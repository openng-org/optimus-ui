import * as ts from 'typescript';
import { findOpeningTags } from './styleclass';

interface Edit {
    start: number;
    end: number;
    replacement: string;
}

export interface RenameInputSpec {
    /** Element selectors the rename applies to (list every selector variant of the component). */
    selectors: readonly string[];
    /** Old input name. */
    from: string;
    /** New input name. */
    to: string;
}

export interface RenameResult {
    text: string;
    changed: boolean;
    /** Number of attributes/bindings renamed. */
    renamed: number;
    /** 0-based offsets of tags skipped because they already carry the target attribute/binding. */
    conflicts: number[];
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Renames a removed/renamed input on elements matching the given selectors:
 *
 * - `from="x"`   → `to="x"`
 * - `[from]="e"` → `[to]="e"`
 *
 * A tag that already carries the target input (either form) keeps its `from` attribute untouched
 * and is reported as a conflict for manual review — the target value is assumed to be the one the
 * author wants to keep.
 */
export function renameInput(html: string, spec: RenameInputSpec): RenameResult {
    const edits: Edit[] = [];
    const conflicts: number[] = [];
    let renamed = 0;

    const from = escapeRegExp(spec.from);
    const to = escapeRegExp(spec.to);
    const fromBinding = new RegExp(`\\[${from}\\]\\s*=`);
    const fromStatic = new RegExp(`(?<![\\[\\w-])${from}\\s*=\\s*(["'])`);
    const toPresent = new RegExp(`(?:\\[${to}\\]|(?<![\\[\\w-])${to})\\s*=`);

    for (const selector of spec.selectors) {
        for (const [start, end] of findOpeningTags(html, selector)) {
            const tag = html.slice(start, end);
            const hasFrom = fromBinding.test(tag) || fromStatic.test(tag);
            if (!hasFrom) {
                continue;
            }
            if (toPresent.test(tag)) {
                conflicts.push(start);
                continue;
            }
            let updated = tag;
            if (fromBinding.test(updated)) {
                updated = updated.replace(fromBinding, (m) => m.replace(`[${spec.from}]`, `[${spec.to}]`));
                renamed++;
            }
            if (fromStatic.test(updated)) {
                updated = updated.replace(fromStatic, (m) => m.replace(spec.from, spec.to));
                renamed++;
            }
            if (updated !== tag) {
                edits.push({ start, end, replacement: updated });
            }
        }
    }

    if (edits.length === 0) {
        return { text: html, changed: false, renamed, conflicts };
    }
    edits.sort((a, b) => b.start - a.start);
    let text = html;
    for (const edit of edits) {
        text = text.slice(0, edit.start) + edit.replacement + text.slice(edit.end);
    }
    return { text, changed: true, renamed, conflicts };
}

/**
 * Same rename, applied only inside the `template: \`...\`` string literal of an `@Component`
 * decorator in a TypeScript source file.
 */
export function renameInputInTypeScript(fileName: string, text: string, spec: RenameInputSpec): RenameResult {
    const sourceFile = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
    const edits: Edit[] = [];
    const conflicts: number[] = [];
    let renamed = 0;

    const visit = (node: ts.Node): void => {
        if (ts.isPropertyAssignment(node) && isTemplateProperty(node) && isInsideDecorator(node)) {
            const initializer = node.initializer;
            if (ts.isStringLiteralLike(initializer)) {
                const raw = initializer.getText(sourceFile);
                const quote = raw[0];
                const body = raw.slice(1, -1);
                const result = renameInput(body, spec);
                renamed += result.renamed;
                conflicts.push(...result.conflicts.map(() => initializer.getStart(sourceFile)));
                if (result.changed) {
                    edits.push({ start: initializer.getStart(sourceFile), end: initializer.getEnd(), replacement: `${quote}${result.text}${quote}` });
                }
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(sourceFile);

    if (edits.length === 0) {
        return { text, changed: false, renamed, conflicts };
    }
    edits.sort((a, b) => b.start - a.start);
    let result = text;
    for (const edit of edits) {
        result = result.slice(0, edit.start) + edit.replacement + result.slice(edit.end);
    }
    return { text: result, changed: true, renamed, conflicts };
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
