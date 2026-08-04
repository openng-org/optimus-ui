import { Tree, SchematicsException } from '@angular-devkit/schematics';
import * as ts from 'typescript';

export function addImportToModule(tree: Tree, filePath: string, importStatement: string): void {
    const fileContent = tree.read(filePath);
    if (!fileContent) {
        throw new SchematicsException(`File ${filePath} does not exist.`);
    }
    const sourceText = fileContent.toString('utf-8');

    // Simple check to avoid duplicates
    if (sourceText.includes(importStatement)) {
        return;
    }

    const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);

    // Find the last import declaration
    let lastImportEnd = 0;
    ts.forEachChild(sourceFile, (node) => {
        if (ts.isImportDeclaration(node)) {
            lastImportEnd = node.getEnd();
        }
    });

    const updateRecorder = tree.beginUpdate(filePath);
    if (lastImportEnd === 0) {
        updateRecorder.insertLeft(0, importStatement + '\n');
    } else {
        updateRecorder.insertRight(lastImportEnd, '\n' + importStatement);
    }
    tree.commitUpdate(updateRecorder);
}

export function addProviderToAppConfig(tree: Tree, filePath: string, providerCode: string): void {
    const fileContent = tree.read(filePath);
    if (!fileContent) {
        throw new SchematicsException(`File ${filePath} does not exist.`);
    }
    const sourceText = fileContent.toString('utf-8');
    const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
    let providersNode: ts.ArrayLiteralExpression | undefined;

    const visit = (node: ts.Node) => {
        if (ts.isPropertyAssignment(node) && node.name.getText() === 'providers') {
            if (ts.isArrayLiteralExpression(node.initializer)) {
                providersNode = node.initializer;
            }
        }
        ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    if (providersNode) {
        const pNode = providersNode as ts.ArrayLiteralExpression;
        const updateRecorder = tree.beginUpdate(filePath);
        const elements = pNode.elements;
        if (elements.length === 0) {
            updateRecorder.insertRight(pNode.getStart() + 1, providerCode);
        } else {
            const lastElement = elements[elements.length - 1];
            updateRecorder.insertRight(lastElement.getEnd(), `, ${providerCode}`);
        }
        tree.commitUpdate(updateRecorder);
    } else {
        throw new SchematicsException(`Could not find providers array in ${filePath}`);
    }
}

export function addProviderToAppModule(tree: Tree, filePath: string, providerCode: string): void {
    const fileContent = tree.read(filePath);
    if (!fileContent) {
        throw new SchematicsException(`File ${filePath} does not exist.`);
    }
    const sourceText = fileContent.toString('utf-8');
    const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
    let providersNode: ts.ArrayLiteralExpression | undefined;

    const visit = (node: ts.Node) => {
        if (ts.isDecorator(node) && ts.isCallExpression(node.expression)) {
            const expression = node.expression;
            if (ts.isIdentifier(expression.expression) && expression.expression.text === 'NgModule') {
                const args = expression.arguments;
                if (args.length > 0 && ts.isObjectLiteralExpression(args[0])) {
                    for (const prop of args[0].properties) {
                        if (ts.isPropertyAssignment(prop) && prop.name.getText() === 'providers') {
                            if (ts.isArrayLiteralExpression(prop.initializer)) {
                                providersNode = prop.initializer;
                            }
                        }
                    }
                }
            }
        }
        ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    if (providersNode) {
        const pNode = providersNode as ts.ArrayLiteralExpression;
        const updateRecorder = tree.beginUpdate(filePath);
        const elements = pNode.elements;
        if (elements.length === 0) {
            updateRecorder.insertRight(pNode.getStart() + 1, providerCode);
        } else {
            const lastElement = elements[elements.length - 1];
            updateRecorder.insertRight(lastElement.getEnd(), `, ${providerCode}`);
        }
        tree.commitUpdate(updateRecorder);
    } else {
        throw new SchematicsException(`Could not find providers array in ${filePath}`);
    }
}
