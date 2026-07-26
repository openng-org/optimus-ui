import * as ts from 'typescript';
import { IDENTIFIER_RENAMES, mapModuleSpecifier } from './mappings';

interface Edit {
    start: number;
    end: number;
    replacement: string;
}

export function rewriteSource(fileName: string, text: string): { text: string; changed: boolean } {
    const sourceFile = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
    const edits: Edit[] = [];
    // local names (imported un-aliased from a primeng module) whose usages must be renamed file-wide
    const renamedLocals = new Map<string, string>();
    // names already declared in the file (vars, destructured bindings, params, functions/classes/etc.) —
    // renaming an import to one of these would shadow/corrupt an unrelated declaration
    const declaredNames = collectDeclaredNames(sourceFile);

    const editSpecifier = (literal: ts.StringLiteralLike): boolean => {
        const mapped = mapModuleSpecifier(literal.text);
        if (mapped === null) {
            return false;
        }
        const quote = text[literal.getStart(sourceFile)];
        edits.push({ start: literal.getStart(sourceFile), end: literal.getEnd(), replacement: `${quote}${mapped}${quote}` });
        return true;
    };

    const renameBindings = (elements: ts.NodeArray<ts.ImportSpecifier | ts.ExportSpecifier>, trackLocals: boolean) => {
        for (const spec of elements) {
            const original = spec.propertyName ?? spec.name;
            const newName = IDENTIFIER_RENAMES.get(original.text);
            if (!newName) {
                continue;
            }
            if (trackLocals && !spec.propertyName && declaredNames.has(spec.name.text)) {
                // the original local name is already used as a declaration elsewhere in the file
                // (e.g. a shadowing parameter) — alias the import instead of renaming it file-wide
                edits.push({
                    start: original.getStart(sourceFile),
                    end: original.getEnd(),
                    replacement: `${newName} as ${original.text}`
                });
                continue;
            }
            edits.push({ start: original.getStart(sourceFile), end: original.getEnd(), replacement: newName });
            if (trackLocals && !spec.propertyName) {
                renamedLocals.set(spec.name.text, newName);
            }
        }
    };

    const visitImports = (node: ts.Node): void => {
        if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
            if (editSpecifier(node.moduleSpecifier)) {
                const bindings = node.importClause?.namedBindings;
                if (bindings && ts.isNamedImports(bindings)) {
                    renameBindings(bindings.elements, true);
                }
            }
        } else if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
            if (editSpecifier(node.moduleSpecifier) && node.exportClause && ts.isNamedExports(node.exportClause)) {
                renameBindings(node.exportClause.elements, false);
            }
        } else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments.length > 0 && ts.isStringLiteralLike(node.arguments[0])) {
            editSpecifier(node.arguments[0] as ts.StringLiteralLike);
        } else if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'require' && node.arguments.length > 0 && ts.isStringLiteralLike(node.arguments[0])) {
            editSpecifier(node.arguments[0] as ts.StringLiteralLike);
        }
        ts.forEachChild(node, visitImports);
    };
    visitImports(sourceFile);

    if (renamedLocals.size > 0) {
        const visitUsages = (node: ts.Node): void => {
            if (ts.isIdentifier(node)) {
                const newName = renamedLocals.get(node.text);
                if (newName !== undefined) {
                    const replacement = usageReplacement(node, newName);
                    if (replacement !== null) {
                        edits.push({ start: node.getStart(sourceFile), end: node.getEnd(), replacement });
                    }
                }
            }
            ts.forEachChild(node, visitUsages);
        };
        visitUsages(sourceFile);
    }

    rewriteCssLayerNames(sourceFile, text, edits);

    if (edits.length === 0) {
        return { text, changed: false };
    }
    edits.sort((a, b) => b.start - a.start);
    let result = text;
    for (const edit of edits) {
        result = result.slice(0, edit.start) + edit.replacement + result.slice(edit.end);
    }
    return { text: result, changed: true };
}

// Collects identifier names that are declaration names anywhere in the file (variables,
// destructured bindings, parameters, and function/class/interface/type-alias/enum declarations).
// Used to detect when renaming an import would shadow/corrupt an unrelated local declaration.
function collectDeclaredNames(sourceFile: ts.SourceFile): Set<string> {
    const names = new Set<string>();
    const addIfIdentifier = (name: ts.Node | undefined): void => {
        if (name && ts.isIdentifier(name)) {
            names.add(name.text);
        }
    };
    const visit = (node: ts.Node): void => {
        if (ts.isVariableDeclaration(node) || ts.isBindingElement(node) || ts.isParameter(node)) {
            addIfIdentifier(node.name);
        } else if (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node) || ts.isEnumDeclaration(node)) {
            addIfIdentifier(node.name);
        }
        ts.forEachChild(node, visit);
    };
    visit(sourceFile);
    return names;
}

// Returns the replacement text for a usage identifier, or null when the
// identifier does not actually reference the imported symbol.
function usageReplacement(node: ts.Identifier, newName: string): string | null {
    const parent = node.parent;
    // import specifiers were handled in the first pass
    if (ts.isImportSpecifier(parent)) {
        return null;
    }
    if (ts.isExportSpecifier(parent)) {
        const namedExports = parent.parent;
        const exportDecl = namedExports.parent;
        if (ts.isExportDeclaration(exportDecl) && exportDecl.moduleSpecifier) {
            // export { X } from '...' — handled in the first pass
            return null;
        }
        if (parent.propertyName === node) {
            // export { PrimeNG as Legacy } — propertyName references the local
            return newName;
        }
        if (parent.name === node && !parent.propertyName) {
            // export { PrimeNG } — bare local re-export references the local
            return newName;
        }
        // export { X as PrimeNG } — pure export alias, not a reference to the local
        return null;
    }
    // { PrimeNG: renamed } = obj — destructuring key, or { PrimeNG } = obj — declares a new local;
    // neither references the imported symbol
    if (ts.isBindingElement(parent) && (parent.propertyName === node || parent.name === node)) {
        return null;
    }
    // obj.PrimeNG — property name, not a reference to the import
    if (ts.isPropertyAccessExpression(parent) && parent.name === node) {
        return null;
    }
    // { PrimeNG: 1 } — object literal key
    if (ts.isPropertyAssignment(parent) && parent.name === node) {
        return null;
    }
    // A.PrimeNG in type positions
    if (ts.isQualifiedName(parent) && parent.right === node) {
        return null;
    }
    // class/interface member names
    if ((ts.isClassElement(parent) || ts.isTypeElement(parent)) && (parent as { name?: ts.Node }).name === node) {
        return null;
    }
    // { PrimeNG } shorthand — expand so the key is preserved
    if (ts.isShorthandPropertyAssignment(parent)) {
        return `${node.text}: ${newName}`;
    }
    return newName;
}

// PrimeNG's default CSS cascade layer is named `primeng`. Users who enable the theme's cssLayer
// option with an explicit name/order carry that token into their app config, e.g.
//   cssLayer: { name: 'primeng', order: 'theme, base, primeng' }
const CSS_LAYER_TOKEN_RE = /\bprimeng\b/g;

function rewriteCssLayerNames(sourceFile: ts.SourceFile, text: string, edits: Edit[]): void {
    const visit = (node: ts.Node): void => {
        if (ts.isPropertyAssignment(node) && propertyKeyText(node.name) === 'cssLayer' && ts.isObjectLiteralExpression(node.initializer)) {
            for (const prop of node.initializer.properties) {
                if (!ts.isPropertyAssignment(prop) || !ts.isStringLiteralLike(prop.initializer)) {
                    continue;
                }
                const key = propertyKeyText(prop.name);
                if (key !== 'name' && key !== 'order') {
                    continue;
                }
                const literal = prop.initializer;
                const replaced = literal.text.replace(CSS_LAYER_TOKEN_RE, 'optimus');
                if (replaced === literal.text) {
                    continue;
                }
                const quote = text[literal.getStart(sourceFile)];
                edits.push({ start: literal.getStart(sourceFile), end: literal.getEnd(), replacement: `${quote}${replaced}${quote}` });
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(sourceFile);
}

// The text of an object-literal property key when it is a plain identifier or string literal
// (name, "name", 'name'); null for computed or numeric keys.
function propertyKeyText(name: ts.PropertyName): string | null {
    return ts.isIdentifier(name) || ts.isStringLiteral(name) ? name.text : null;
}
