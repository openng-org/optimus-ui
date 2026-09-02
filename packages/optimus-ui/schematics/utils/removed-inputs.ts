import * as ts from 'typescript';
import { findOpeningTags } from './styleclass';

interface Edit {
    start: number;
    end: number;
    replacement: string;
}

export interface DeadInputResult {
    text: string;
    changed: boolean;
    /** Number of attribute/binding usages removed. */
    removed: number;
}

function bindingRegex(name: string): RegExp {
    // `[name]="..."` property binding, single- or double-quoted, leading whitespace included so
    // removal leaves no stray gap between the surrounding attributes.
    const escaped = escapeRegExp(name);
    return new RegExp(`\\s*\\[${escaped}\\]\\s*=\\s*(["'])(?:\\\\.|(?!\\1)[^\\\\])*\\1`);
}

function staticRegex(name: string): RegExp {
    // `name="..."` static attribute (not a `[name]` binding).
    const escaped = escapeRegExp(name);
    return new RegExp(`\\s*(?<!\\[)\\b${escaped}\\s*=\\s*(["'])(?:\\\\.|(?!\\1)[^\\\\])*\\1`);
}

/**
 * Removes `[name]="..."` bindings and `name="..."` static attributes for the given removed input
 * names, but only on elements matching the given selectors — the same input name may still exist
 * on other components, so a blind global removal would produce false positives.
 */
export function removeDeadInputs(html: string, selectors: readonly string[], names: readonly string[]): DeadInputResult {
    const edits: Edit[] = [];
    let removed = 0;

    for (const selector of selectors) {
        for (const [start, end] of findOpeningTags(html, selector)) {
            const tag = html.slice(start, end);
            let updated = tag;

            for (const name of names) {
                const binding = bindingRegex(name);
                if (binding.test(updated)) {
                    updated = updated.replace(binding, '');
                    removed++;
                }
                const stat = staticRegex(name);
                if (stat.test(updated)) {
                    updated = updated.replace(stat, '');
                    removed++;
                }
            }

            if (updated !== tag) {
                edits.push({ start, end, replacement: updated });
            }
        }
    }

    if (edits.length === 0) {
        return { text: html, changed: false, removed };
    }
    edits.sort((a, b) => b.start - a.start);
    let text = html;
    for (const edit of edits) {
        text = text.slice(0, edit.start) + edit.replacement + text.slice(edit.end);
    }
    return { text, changed: true, removed };
}

/**
 * Same removal, applied only inside the `template: \`...\`` string literal of an `@Component`
 * decorator in a TypeScript source file — mirrors utils/removed-outputs.ts so unrelated string
 * literals elsewhere in the file are never touched.
 */
export function removeDeadInputsInTypeScript(fileName: string, text: string, selectors: readonly string[], names: readonly string[]): DeadInputResult {
    const sourceFile = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
    const edits: Edit[] = [];
    let removed = 0;

    const visit = (node: ts.Node): void => {
        if (ts.isPropertyAssignment(node) && isTemplateProperty(node) && isInsideDecorator(node)) {
            const initializer = node.initializer;
            if (ts.isStringLiteralLike(initializer)) {
                const raw = initializer.getText(sourceFile);
                const quote = raw[0];
                const body = raw.slice(1, -1);
                const result = removeDeadInputs(body, selectors, names);
                if (result.changed) {
                    edits.push({ start: initializer.getStart(sourceFile), end: initializer.getEnd(), replacement: `${quote}${result.text}${quote}` });
                    removed += result.removed;
                }
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(sourceFile);

    if (edits.length === 0) {
        return { text, changed: false, removed };
    }
    edits.sort((a, b) => b.start - a.start);
    let result = text;
    for (const edit of edits) {
        result = result.slice(0, edit.start) + edit.replacement + result.slice(edit.end);
    }
    return { text: result, changed: true, removed };
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isTemplateProperty(node: ts.PropertyAssignment): boolean {
    const name = node.name;
    return (ts.isIdentifier(name) || ts.isStringLiteral(name)) && name.text === 'template';
}

function isInsideDecorator(node: ts.Node): boolean {
    let current: ts.Node | undefined = node.parent;
    while (current) {
        if (ts.isDecorator(current)) {
            return true;
        }
        current = current.parent;
    }
    return false;
}
