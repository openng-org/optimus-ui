import fs from 'fs';
import path from 'path';
import ts from 'typescript';

export const PACKAGE_NAME = '@openng/optimus-ui';

/**
 * Collect every Angular component, directive, NgModule, service and exported type of @openng/optimus-ui, per entry point.
 *
 * Structure (selectors, inputs, outputs, two-way bindings, content projection, inheritance) is read from the
 * Angular metadata the compiler writes into the published typings (`static ɵcmp` / `ɵdir` / `ɵmod` / `ɵprov`),
 * so it matches what the Angular language service sees. Defaults and transforms come from the sources, and
 * templates, pass-through options and CSS classes from the typedoc API docs.
 */
export function collectApi({ libDir, apiDocs }) {
    const distDir = path.join(libDir, 'dist');
    const distPackageJson = path.join(distDir, 'package.json');
    if (!fs.existsSync(distPackageJson)) {
        throw new Error(`${PACKAGE_NAME} is not built: ${distPackageJson} is missing. Run \`pnpm run build:lib\` first.`);
    }

    const exportsMap = JSON.parse(fs.readFileSync(distPackageJson, 'utf-8')).exports;
    const entryFiles = Object.entries(exportsMap)
        .filter(([key, value]) => key.startsWith('./') && value?.types)
        .map(([key, value]) => ({ entry: key.slice(2), file: path.join(distDir, value.types) }))
        // Types are re-exported from the component entry points; list them there rather than under `types/*`
        .sort((a, b) => Number(a.entry.startsWith('types/')) - Number(b.entry.startsWith('types/')) || a.entry.localeCompare(b.entry));

    const program = ts.createProgram(
        entryFiles.map((e) => e.file),
        { noEmit: true, skipLibCheck: true, strict: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler }
    );
    const checker = program.getTypeChecker();
    const sourceInfo = collectSourceInfo(path.join(libDir, 'src'));
    const seen = new Set();

    const entryPoints = [];
    for (const { entry, file } of entryFiles) {
        const sourceFile = program.getSourceFile(file);
        const moduleSymbol = sourceFile && checker.getSymbolAtLocation(sourceFile);
        if (!moduleSymbol) continue;

        const declarations = [];
        const modules = [];
        const services = [];
        const types = [];
        const classes = [];

        for (let symbol of checker.getExportsOfModule(moduleSymbol)) {
            if (symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
            if (seen.has(symbol)) continue;

            const classDecl = symbol.declarations?.find(ts.isClassDeclaration);
            if (classDecl) {
                // Classes are listed under the entry point that declares them, not the ones re-exporting them
                if (classDecl.getSourceFile() !== sourceFile) continue;
                seen.add(symbol);

                if (findStaticMember(classDecl, 'ɵmod')) modules.push(symbol.name);
                if (findStaticMember(classDecl, 'ɵprov') && !isStyleClass(classDecl, checker)) services.push(symbol.name);

                const meta = readAngularMeta(classDecl);
                if (meta?.selector) {
                    declarations.push(describeDeclaration({ entry, symbol, classDecl, meta, checker, sourceInfo, apiDocs }));
                } else if (!meta && !findStaticMember(classDecl, 'ɵmod') && !findStaticMember(classDecl, 'ɵprov')) {
                    classes.push(describeClass(symbol, checker));
                }
            } else if (symbol.flags & (ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias)) {
                seen.add(symbol);
                const described = describeType(symbol, checker);
                if (described) types.push(described);
            }
        }

        if (declarations.length === 0 && modules.length === 0 && services.length === 0 && classes.length === 0 && types.length === 0) continue;

        const apiDoc = apiDocs[entry];
        entryPoints.push(
            compact({
                name: entry,
                import: `${PACKAGE_NAME}/${entry}`,
                description: firstComponentDescription(apiDoc),
                modules,
                services,
                declarations,
                classes: sortByName(classes),
                types: sortByName(types),
                cssClasses: getCssClasses(apiDoc)
            })
        );
    }

    return entryPoints.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Describe a plain exported class (such as DynamicDialogRef or DynamicDialogConfig) by its public members.
 */
function describeClass(symbol, checker) {
    const docs = readDocs(symbol, checker);
    const instanceType = checker.getDeclaredTypeOfSymbol(symbol);
    const members = checker
        .getPropertiesOfType(instanceType)
        .filter((prop) => !/^[_ɵ]/.test(prop.name) && !prop.valueDeclaration?.modifiers?.some((m) => m.kind === ts.SyntaxKind.PrivateKeyword || m.kind === ts.SyntaxKind.ProtectedKeyword))
        .map((prop) => {
            const propDocs = readDocs(prop, checker);
            const isMethod = prop.flags & ts.SymbolFlags.Method;
            return compact({
                name: prop.name,
                kind: isMethod ? 'method' : 'property',
                type: typeToString(checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration ?? symbol.valueDeclaration), checker),
                description: propDocs.description,
                deprecated: propDocs.deprecated
            });
        });
    return compact({ kind: 'class', name: symbol.name, description: docs.description, deprecated: docs.deprecated, members });
}

/**
 * Describe an exported interface (its properties) or type alias (its definition). Pass-through option types are
 * skipped: they are already listed per component under `passThrough`.
 */
function describeType(symbol, checker) {
    if (/PassThrough/.test(symbol.name)) return undefined;
    const docs = readDocs(symbol, checker);
    const declaration = symbol.declarations?.[0];

    if (symbol.flags & ts.SymbolFlags.Interface) {
        const type = checker.getDeclaredTypeOfSymbol(symbol);
        const properties = checker.getPropertiesOfType(type).map((prop) => {
            const propDocs = readDocs(prop, checker);
            return compact({
                name: prop.name,
                type: typeToString(checker.getTypeOfSymbol(prop), checker),
                optional: prop.flags & ts.SymbolFlags.Optional ? true : undefined,
                description: propDocs.description,
                deprecated: propDocs.deprecated
            });
        });
        return compact({ kind: 'interface', name: symbol.name, description: docs.description, deprecated: docs.deprecated, properties });
    }

    if (declaration && ts.isTypeAliasDeclaration(declaration)) {
        const definition = declaration.type.getText().replace(/\s+/g, ' ');
        const type = checker.getTypeAtLocation(declaration.type);
        return compact({ kind: 'type', name: symbol.name, description: docs.description, deprecated: docs.deprecated, definition: definition.length <= 500 ? definition : undefined, values: literalValues(type) });
    }

    return undefined;
}

/**
 * Describe one component or directive: its selector, inputs (own, inherited and from host directives), outputs and templates.
 */
function describeDeclaration({ entry, symbol, classDecl, meta, checker, sourceInfo, apiDocs }) {
    const instanceType = checker.getDeclaredTypeOfSymbol(symbol);
    const chain = getClassChain(classDecl, checker);
    const inputMap = new Map();
    const outputMap = new Map();

    // Base classes first so subclasses override them, matching Angular's inheritance
    for (const cls of [...chain].reverse()) {
        const clsMeta = readAngularMeta(cls);
        if (!clsMeta) continue;
        for (const input of clsMeta.inputs) inputMap.set(input.property, input);
        for (const output of clsMeta.outputs) outputMap.set(output.property, output);
    }

    const outputNames = new Set([...outputMap.values()].map((o) => o.name));

    const inputs = [...inputMap.values()].map((input) => {
        const prop = checker.getPropertyOfType(instanceType, input.property);
        const declaringClass = prop?.valueDeclaration?.parent;
        const source = findSourceMember(sourceInfo, declaringClass?.name?.text ?? symbol.name, entry, input.property);
        const { type, kind } = unwrapInputType(prop, checker);
        const docs = readDocs(prop, checker);

        return compact({
            name: input.name,
            property: input.property !== input.name ? input.property : undefined,
            type: typeToString(type, checker),
            values: literalValues(type),
            default: cleanDefault(source?.default ?? docs.defaultValue),
            required: input.required || undefined,
            twoWay: kind === 'model' || outputNames.has(`${input.name}Change`) || undefined,
            signal: input.isSignal || undefined,
            transform: source?.transform,
            description: docs.description,
            deprecated: docs.deprecated
        });
    });

    for (const host of meta.hostDirectives) {
        let hostSymbol = checker.getSymbolAtLocation(host.expression);
        if (hostSymbol && hostSymbol.flags & ts.SymbolFlags.Alias) hostSymbol = checker.getAliasedSymbol(hostSymbol);
        if (!hostSymbol) continue;
        for (const [property, name] of host.inputs) {
            const prop = checker.getPropertyOfType(checker.getDeclaredTypeOfSymbol(hostSymbol), property);
            const { type } = unwrapInputType(prop, checker);
            const docs = readDocs(prop, checker);
            inputs.push(compact({ name, type: typeToString(type, checker), values: literalValues(type), hostDirective: hostSymbol.name, description: docs.description, deprecated: docs.deprecated }));
        }
    }

    const outputs = [...outputMap.values()].map((output) => {
        const prop = checker.getPropertyOfType(instanceType, output.property);
        const docs = readDocs(prop, checker);
        return compact({
            name: output.name,
            payload: typeToString(unwrapOutputType(prop, checker), checker),
            description: docs.description,
            deprecated: docs.deprecated
        });
    });

    const apiComponent = apiDocs[entry]?.components?.[symbol.name];
    const templates = apiComponent?.templates?.values?.map((t) =>
        compact({
            name: t.name,
            context: t.type?.match(/^TemplateRef<(.+)>$/)?.[1]?.replace(/^void$/, '') || undefined,
            description: t.description || undefined
        })
    );

    const methods = apiComponent?.methods?.values?.map((m) =>
        compact({
            name: m.name,
            parameters: m.parameters?.length ? m.parameters.map((param) => compact({ name: param.name, type: param.type || undefined, description: param.description || undefined })) : undefined,
            returnType: m.returnType && m.returnType !== 'void' ? m.returnType : undefined,
            description: m.description || undefined
        })
    );

    return compact({
        kind: classDecl.members.some((m) => m.name?.getText() === 'ɵcmp') ? 'component' : 'directive',
        className: symbol.name,
        selector: meta.selector,
        exportAs: meta.exportAs,
        standalone: meta.standalone,
        description: readDocs(symbol, checker).description || apiComponent?.description || undefined,
        deprecated: readDocs(symbol, checker).deprecated,
        inputs: sortByName(inputs),
        outputs: sortByName(outputs),
        templates,
        methods,
        forms: checker.getPropertyOfType(instanceType, 'writeValue') ? true : undefined,
        contentProjection: meta.ngContentSelectors,
        passThrough: getPassThrough(apiDocs[entry], symbol.name)
    });
}

/**
 * Parse `static ɵcmp: ɵɵComponentDeclaration<T, Selector, ExportAs, Inputs, Outputs, Queries, NgContent, Standalone, HostDirectives, ...>`
 * (or the matching `ɵdir: ɵɵDirectiveDeclaration<...>`) from a class in a .d.ts file.
 */
function readAngularMeta(classDecl) {
    const member = findStaticMember(classDecl, 'ɵcmp') ?? findStaticMember(classDecl, 'ɵdir');
    const args = member?.type && ts.isTypeReferenceNode(member.type) ? member.type.typeArguments : undefined;
    if (!args) return null;

    const [, selector, exportAs, inputs, outputs, , ngContent, standalone, hostDirectives] = args;

    return {
        selector: literalText(selector),
        exportAs: tupleOrLiteral(exportAs),
        inputs: readTypeLiteral(inputs).map(([property, value]) => ({
            property,
            name: literalText(propertyOf(value, 'alias')) ?? property,
            required: propertyOf(value, 'required')?.kind === ts.SyntaxKind.LiteralType && propertyOf(value, 'required').literal.kind === ts.SyntaxKind.TrueKeyword,
            isSignal: !!propertyOf(value, 'isSignal')
        })),
        outputs: readTypeLiteral(outputs).map(([property, value]) => ({ property, name: literalText(value) ?? property })),
        ngContentSelectors: tupleOrLiteral(ngContent),
        standalone: standalone?.kind === ts.SyntaxKind.LiteralType ? standalone.literal.kind === ts.SyntaxKind.TrueKeyword : undefined,
        hostDirectives: readHostDirectives(hostDirectives)
    };
}

function readHostDirectives(node) {
    if (!node || !ts.isTupleTypeNode(node)) return [];
    const directives = [];
    for (const element of node.elements) {
        if (!ts.isTypeLiteralNode(element)) continue;
        const directive = propertyOf(element, 'directive');
        const inputs = readTypeLiteral(propertyOf(element, 'inputs')).map(([property, value]) => [property, literalText(value) ?? property]);
        if (directive && ts.isTypeQueryNode(directive) && inputs.length > 0) {
            directives.push({ expression: directive.exprName, inputs });
        }
    }
    return directives;
}

// Per-component style providers (ButtonStyle, ...) are injectable but internal to theming
function isStyleClass(classDecl, checker) {
    return getClassChain(classDecl, checker).some((cls) => ['BaseStyle', 'UseStyle'].includes(cls.name?.text));
}

function getClassChain(classDecl, checker) {
    const chain = [];
    let current = classDecl;
    while (current) {
        chain.push(current);
        const heritage = current.heritageClauses?.find((h) => h.token === ts.SyntaxKind.ExtendsKeyword)?.types[0];
        let baseSymbol = heritage && checker.getSymbolAtLocation(heritage.expression);
        if (baseSymbol && baseSymbol.flags & ts.SymbolFlags.Alias) baseSymbol = checker.getAliasedSymbol(baseSymbol);
        current = baseSymbol?.declarations?.find(ts.isClassDeclaration);
    }
    return chain;
}

/**
 * Signal inputs are typed `InputSignal<T>`, `InputSignalWithTransform<T, Write>` or `ModelSignal<T>` in the typings;
 * report the type a template binding accepts.
 */
function unwrapInputType(prop, checker) {
    if (!prop) return { type: undefined, kind: 'unknown' };
    const type = checker.getTypeOfSymbol(prop);
    const name = type.symbol?.name;
    const typeArgs = type.flags & ts.TypeFlags.Object ? checker.getTypeArguments(type) : [];

    if (name === 'ModelSignal') return { type: typeArgs[0], kind: 'model' };
    if (name === 'InputSignal') return { type: typeArgs[0], kind: 'signal' };
    if (name === 'InputSignalWithTransform') {
        const write = typeArgs[1];
        return { type: write && !(write.flags & ts.TypeFlags.Unknown) ? write : typeArgs[0], kind: 'signal' };
    }
    return { type, kind: 'decorator' };
}

function unwrapOutputType(prop, checker) {
    if (!prop) return undefined;
    const type = checker.getTypeOfSymbol(prop);
    const typeArgs = type.flags & ts.TypeFlags.Object ? checker.getTypeArguments(type) : [];
    return typeArgs[0] ?? type;
}

function typeToString(type, checker) {
    if (!type) return undefined;
    return checker.typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope);
}

/**
 * List the allowed values when a type is a union of string/number literals (ignoring null and undefined).
 */
function literalValues(type) {
    if (!type) return undefined;
    const parts = (type.isUnion() ? type.types : [type]).filter((t) => !(t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)));
    if (parts.length < 2 || !parts.every((t) => t.isStringLiteral() || t.isNumberLiteral())) return undefined;
    return parts.map((t) => t.value);
}

function readDocs(symbol, checker) {
    if (!symbol) return {};
    const description = ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim() || undefined;
    const tags = symbol.getJsDocTags(checker);
    const tagText = (name) => {
        const tag = tags.find((t) => t.name === name);
        return tag ? ts.displayPartsToString(tag.text).trim() || true : undefined;
    };
    return { description, deprecated: tagText('deprecated'), defaultValue: tagText('defaultValue') };
}

/**
 * Index the library sources for what the typings drop: input defaults and transforms.
 * Keyed by class name; a class name can exist in several entry points, so each entry keeps its file.
 */
function collectSourceInfo(srcDir) {
    const index = new Map();

    const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (entry.name !== 'node_modules' && !entry.name.startsWith('__')) walk(full);
            } else if (entry.name.endsWith('.ts') && !/\.(test|spec|d)\.ts$/.test(entry.name)) {
                indexFile(full);
            }
        }
    };

    const indexFile = (file) => {
        const sf = ts.createSourceFile(file, fs.readFileSync(file, 'utf-8'), ts.ScriptTarget.Latest, true);
        const entry = path.relative(srcDir, file).split(path.sep)[0];
        sf.forEachChild((node) => {
            if (!ts.isClassDeclaration(node) || !node.name) return;
            const members = new Map();
            for (const member of node.members) {
                if (!member.name || !(ts.isPropertyDeclaration(member) || ts.isSetAccessor(member) || ts.isGetAccessor(member))) continue;
                const info = readSourceMember(member);
                if (info) members.set(member.name.getText(), { ...members.get(member.name.getText()), ...info });
            }
            if (!index.has(node.name.text)) index.set(node.name.text, []);
            index.get(node.name.text).push({ entry, members });
        });
    };

    walk(srcDir);
    return index;
}

function readSourceMember(member) {
    const info = {};
    const inputDecorator = ts.getDecorators(member)?.find((d) => ts.isCallExpression(d.expression) && d.expression.expression.getText() === 'Input');
    const decoratorOptions = inputDecorator?.expression.arguments[0];
    if (decoratorOptions && ts.isObjectLiteralExpression(decoratorOptions)) info.transform = transformName(decoratorOptions);

    const init = ts.isPropertyDeclaration(member) ? member.initializer : undefined;
    if (init && ts.isCallExpression(init)) {
        const callee = init.expression.getText();
        if (/^(input|model)(\.required)?$/.test(callee)) {
            const required = callee.endsWith('.required');
            const options = init.arguments[required ? 0 : 1];
            if (!required && init.arguments[0]) info.default = init.arguments[0].getText();
            if (options && ts.isObjectLiteralExpression(options)) info.transform = transformName(options);
            return info;
        }
        if (/^output(FromObservable)?$/.test(callee)) return info;
    }
    if (init && !(ts.isNewExpression(init) && init.expression.getText() === 'EventEmitter')) info.default = init.getText();

    return info.default !== undefined || info.transform !== undefined ? info : null;
}

function transformName(options) {
    const transform = options.properties.find((p) => p.name?.getText() === 'transform');
    if (!transform) return undefined;
    const text = ts.isPropertyAssignment(transform) ? transform.initializer.getText() : transform.getText();
    return text.length <= 40 ? text : 'custom';
}

function findSourceMember(sourceInfo, className, entry, property) {
    const candidates = sourceInfo.get(className);
    if (!candidates) return undefined;
    const match = candidates.find((c) => c.entry === entry && c.members.has(property)) ?? candidates.find((c) => c.members.has(property));
    return match?.members.get(property);
}

function cleanDefault(value) {
    if (value === undefined || value === true) return undefined;
    const text = String(value).trim();
    if (text === '' || text === 'undefined' || text === 'null' || text.length > 120) return undefined;
    return text;
}

function getPassThrough(apiDoc, className) {
    const interfaces = apiDoc?.types?.interfaces?.values ?? [];
    const ptInterface = interfaces.find((i) => i.name === `${className}PassThroughOptions`);
    return ptInterface?.props?.map((p) => compact({ name: p.name, type: p.type || undefined, description: p.description || undefined }));
}

function getCssClasses(apiDoc) {
    return apiDoc?.style?.classes?.values?.filter((c) => typeof c.class === 'string').map((c) => compact({ class: c.class, description: c.description || undefined }));
}

function firstComponentDescription(apiDoc) {
    return Object.values(apiDoc?.components ?? {})[0]?.description || undefined;
}

function findStaticMember(classDecl, name) {
    return classDecl.members.find((m) => m.name?.getText() === name && m.modifiers?.some((mod) => mod.kind === ts.SyntaxKind.StaticKeyword));
}

function readTypeLiteral(node) {
    if (!node || !ts.isTypeLiteralNode(node)) return [];
    return node.members.filter(ts.isPropertySignature).map((m) => [m.name.text ?? m.name.getText(), m.type]);
}

function propertyOf(node, name) {
    return readTypeLiteral(node).find(([key]) => key === name)?.[1];
}

function literalText(node) {
    return node && ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal) ? node.literal.text : undefined;
}

function tupleOrLiteral(node) {
    if (!node) return undefined;
    if (ts.isTupleTypeNode(node)) return node.elements.map(literalText).filter(Boolean);
    const text = literalText(node);
    return text ? [text] : undefined;
}

function sortByName(items) {
    return items.length > 0 ? items.sort((a, b) => a.name.localeCompare(b.name)) : undefined;
}

/** Drop undefined values and empty arrays so the manifest only carries what is known. */
function compact(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0)));
}
