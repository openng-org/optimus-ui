import * as ts from 'typescript';

interface Edit {
    start: number;
    end: number;
    replacement: string;
    /** Applied first among edits sharing the same position, so a closing `)` lands after a nested `()` insertion. */
    closing?: boolean;
}

export interface ConfigSignalProperty {
    /** Exported class name of the config service, e.g. 'Optimus'. */
    className: string;
    /** Property on that service that became a `signal()`, e.g. 'overlayOptions'. */
    property: string;
}

export interface ConfigSignalResult {
    text: string;
    changed: boolean;
    /** Number of `x.prop = value` assignments rewritten to `x.prop.set(value)`. */
    writes: number;
    /** Number of bare `x.prop` reads rewritten to `x.prop()`. */
    reads: number;
    /** 1-based lines of `.prop` accesses that need manual review (see rewriteConfigPropertyToSignal). */
    leftovers: number[];
}

/**
 * Rewrites every access to a config-service property that turned into a `signal()` inside one
 * TypeScript source file: plain assignments become `.set(...)` calls and plain reads become
 * `()` calls. Only receivers that can be proven to hold the service are touched: identifiers,
 * class properties and parameters declared with the service as their type annotation or
 * initialized with `inject(Service)` — resolved against the scope they are declared in — plus
 * direct `inject(Service).prop` chains.
 *
 * Reported as leftovers instead of being rewritten, because there is no mechanical equivalent:
 * - accesses on a receiver that merely looks like a config object (named `config`, `primeng`,
 *   `optimus`, …) but cannot be proven to be the service — a component or unrelated object can
 *   legitimately expose a property of the same name;
 * - compound assignments (`??=`, `||=`, …), assignments used as expressions, writes to a nested
 *   member (`x.prop.key = v`) and `delete x.prop...` — a signal has to be replaced with `.set()`/
 *   `.update()`, not mutated in place;
 * - reads inside component templates (inline `template:` strings and `.html` files, via
 *   findConfigPropertyLeftoversInHtml), where the value is bound rather than called.
 */
export function rewriteConfigPropertyToSignal(fileName: string, text: string, target: ConfigSignalProperty): ConfigSignalResult {
    const sourceFile = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
    const bindings = collectServiceBindings(sourceFile, target.className);
    const edits: Edit[] = [];
    const leftovers: number[] = [];
    let writes = 0;
    let reads = 0;

    const isServiceReceiver = (expression: ts.Expression): boolean => {
        const unwrapped = unwrap(expression);
        if (isInjectCall(unwrapped, target.className)) {
            return true;
        }
        if (ts.isIdentifier(unwrapped)) {
            return bindings.resolvesIdentifier(unwrapped);
        }
        if (ts.isPropertyAccessExpression(unwrapped) && unwrap(unwrapped.expression).kind === ts.SyntaxKind.ThisKeyword) {
            return bindings.resolvesMember(unwrapped);
        }
        return false;
    };

    const isTargetAccess = (node: ts.Node): node is ts.PropertyAccessExpression => ts.isPropertyAccessExpression(node) && node.name.text === target.property;

    const isAlreadyMigrated = (access: ts.PropertyAccessExpression): boolean => {
        const parent = access.parent;
        if (ts.isCallExpression(parent) && parent.expression === access) {
            return true;
        }
        return ts.isPropertyAccessExpression(parent) && parent.expression === access && ['set', 'update', 'asReadonly'].includes(parent.name.text);
    };

    const visit = (node: ts.Node): void => {
        if (isTargetAccess(node) && isServiceReceiver(node.expression)) {
            const assignment = enclosingAssignment(node);
            if (assignment && assignment.left === node && assignment.operatorToken.kind === ts.SyntaxKind.EqualsToken && ts.isExpressionStatement(assignment.parent)) {
                edits.push({ start: node.getEnd(), end: assignment.right.getStart(sourceFile), replacement: '.set(' });
                edits.push({ start: assignment.getEnd(), end: assignment.getEnd(), replacement: ')', closing: true });
                writes++;
            } else if (assignment || isDeleted(node)) {
                leftovers.push(lineOf(sourceFile, node));
            } else if (!isAlreadyMigrated(node)) {
                edits.push({ start: node.getEnd(), end: node.getEnd(), replacement: '()' });
                reads++;
            }
        } else if (isTargetAccess(node) && looksLikeConfigReceiver(node.expression, sourceFile)) {
            leftovers.push(lineOf(sourceFile, node));
        }
        ts.forEachChild(node, visit);
    };
    visit(sourceFile);

    if (edits.length === 0) {
        return { text, changed: false, writes, reads, leftovers };
    }
    edits.sort((a, b) => b.start - a.start || Number(b.closing ?? false) - Number(a.closing ?? false));
    let result = text;
    for (const edit of edits) {
        result = result.slice(0, edit.start) + edit.replacement + result.slice(edit.end);
    }
    return { text: result, changed: true, writes, reads, leftovers };
}

/**
 * Finds `<receiver>.prop` reads of a config-looking receiver inside an HTML fragment — a template
 * file, or the body of an inline `template:` literal — that are not already calls. Returns the
 * 1-based line (relative to the fragment) of each match.
 */
export function findConfigPropertyLeftoversInHtml(html: string, property: string): number[] {
    const pattern = new RegExp(`\\b(?:config|primeng|optimus)\\w*(?:\\?\\.|\\.)${escapeRegExp(property)}\\b(?!\\s*\\()`, 'gi');
    const lines: number[] = [];
    for (const match of html.matchAll(pattern)) {
        lines.push(html.slice(0, match.index).split('\n').length);
    }
    return lines;
}

/**
 * Same scan, applied to the inline `template:` literals of `@Component` decorators in a
 * TypeScript source file. Returns 1-based lines within the file.
 */
export function findConfigPropertyLeftoversInTypeScript(fileName: string, text: string, property: string): number[] {
    const sourceFile = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
    const lines: number[] = [];
    const visit = (node: ts.Node): void => {
        if (ts.isPropertyAssignment(node) && isDirectComponentTemplateProperty(node) && ts.isStringLiteralLike(node.initializer)) {
            const start = node.initializer.getStart(sourceFile) + 1;
            for (const line of findConfigPropertyLeftoversInHtml(node.initializer.text, property)) {
                lines.push(sourceFile.getLineAndCharacterOfPosition(start).line + line);
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(sourceFile);
    return lines;
}

interface ServiceBindings {
    /** True when the identifier refers to a variable/parameter bound to the service in an enclosing scope. */
    resolvesIdentifier(identifier: ts.Identifier): boolean;
    /** True when `this.<name>` refers to a property (or parameter property) of the enclosing class bound to the service. */
    resolvesMember(access: ts.PropertyAccessExpression): boolean;
}

/**
 * Declarations bound to the service: class properties, variables and parameters typed as the
 * service or initialized with `inject(Service)`, each remembered with the scope it belongs to so
 * a same-named identifier elsewhere in the file is not mistaken for it.
 */
function collectServiceBindings(sourceFile: ts.SourceFile, className: string): ServiceBindings {
    const scoped = new Map<string, Set<ts.Node>>();
    const members = new Map<string, Set<ts.Node>>();

    const remember = (map: Map<string, Set<ts.Node>>, name: string, scope: ts.Node): void => {
        const scopes = map.get(name) ?? new Set<ts.Node>();
        scopes.add(scope);
        map.set(name, scopes);
    };

    const bindsService = (type: ts.TypeNode | undefined, initializer: ts.Expression | undefined): boolean => {
        if (type && ts.isTypeReferenceNode(type) && ts.isIdentifier(type.typeName) && type.typeName.text === className) {
            return true;
        }
        return initializer !== undefined && isInjectCall(unwrap(initializer), className);
    };

    const visit = (node: ts.Node): void => {
        if (ts.isPropertyDeclaration(node) && ts.isIdentifier(node.name) && bindsService(node.type, node.initializer)) {
            remember(members, node.name.text, node.parent);
        } else if (ts.isParameter(node) && ts.isIdentifier(node.name) && bindsService(node.type, node.initializer)) {
            remember(scoped, node.name.text, node.parent);
            if (ts.isConstructorDeclaration(node.parent) && isParameterProperty(node)) {
                remember(members, node.name.text, node.parent.parent);
            }
        } else if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && bindsService(node.type, node.initializer)) {
            remember(scoped, node.name.text, enclosingScope(node));
        }
        ts.forEachChild(node, visit);
    };
    visit(sourceFile);

    const hasAncestor = (node: ts.Node, scopes: Set<ts.Node> | undefined): boolean => {
        for (let current: ts.Node | undefined = node; current; current = current.parent) {
            if (scopes?.has(current)) {
                return true;
            }
        }
        return false;
    };

    return {
        resolvesIdentifier: (identifier) => hasAncestor(identifier, scoped.get(identifier.text)),
        resolvesMember: (access) => hasAncestor(access, members.get(access.name.text))
    };
}

function enclosingScope(node: ts.Node): ts.Node {
    for (let current = node.parent; current; current = current.parent) {
        if (ts.isBlock(current) || ts.isSourceFile(current) || ts.isFunctionLike(current) || ts.isModuleBlock(current) || ts.isCaseClause(current)) {
            return current;
        }
    }
    return node.getSourceFile();
}

function isParameterProperty(node: ts.ParameterDeclaration): boolean {
    return (ts.getCombinedModifierFlags(node) & (ts.ModifierFlags.AccessibilityModifier | ts.ModifierFlags.Readonly)) !== 0;
}

/** The assignment expression this access is written through, if it sits on the left-hand side of one (directly or via nested member access). */
function enclosingAssignment(access: ts.PropertyAccessExpression): ts.BinaryExpression | undefined {
    let current: ts.Node = access;
    while (
        current.parent &&
        (ts.isPropertyAccessExpression(current.parent) || ts.isElementAccessExpression(current.parent) || ts.isNonNullExpression(current.parent) || ts.isParenthesizedExpression(current.parent)) &&
        current.parent.expression === current
    ) {
        current = current.parent;
    }
    const parent = current.parent;
    if (parent && ts.isBinaryExpression(parent) && parent.left === current && isAssignmentOperator(parent.operatorToken.kind)) {
        return parent;
    }
    return undefined;
}

function isDeleted(access: ts.PropertyAccessExpression): boolean {
    let current: ts.Node = access;
    while (current.parent && (ts.isPropertyAccessExpression(current.parent) || ts.isElementAccessExpression(current.parent)) && current.parent.expression === current) {
        current = current.parent;
    }
    return ts.isDeleteExpression(current.parent);
}

function unwrap(expression: ts.Expression): ts.Expression {
    let current = expression;
    while (ts.isParenthesizedExpression(current) || ts.isNonNullExpression(current) || ts.isAsExpression(current) || ts.isSatisfiesExpression(current) || ts.isTypeAssertionExpression(current)) {
        current = current.expression;
    }
    return current;
}

function isInjectCall(expression: ts.Expression, className: string): boolean {
    if (!ts.isCallExpression(expression) || expression.arguments.length === 0) {
        return false;
    }
    const callee = expression.expression;
    const calleeName = ts.isIdentifier(callee) ? callee.text : ts.isPropertyAccessExpression(callee) ? callee.name.text : undefined;
    const firstArgument = expression.arguments[0];
    return calleeName === 'inject' && ts.isIdentifier(firstArgument) && firstArgument.text === className;
}

function looksLikeConfigReceiver(expression: ts.Expression, sourceFile: ts.SourceFile): boolean {
    return /\b(config|primeng|optimus)\w*$/i.test(expression.getText(sourceFile));
}

function isDirectComponentTemplateProperty(node: ts.PropertyAssignment): boolean {
    const name = node.name;
    if (!((ts.isIdentifier(name) || ts.isStringLiteral(name)) && name.text === 'template')) {
        return false;
    }
    const objectLiteral = node.parent;
    const call = objectLiteral.parent;
    const decorator = call?.parent;
    return (
        ts.isObjectLiteralExpression(objectLiteral) &&
        ts.isCallExpression(call) &&
        call.arguments[0] === objectLiteral &&
        ts.isIdentifier(call.expression) &&
        call.expression.text === 'Component' &&
        decorator !== undefined &&
        ts.isDecorator(decorator)
    );
}

function isAssignmentOperator(kind: ts.SyntaxKind): boolean {
    return kind >= ts.SyntaxKind.FirstAssignment && kind <= ts.SyntaxKind.LastAssignment;
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function lineOf(sourceFile: ts.SourceFile, node: ts.Node): number {
    return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}
