import * as ts from 'typescript';

interface Edit {
    start: number;
    end: number;
    replacement: string;
}

export interface StyleClassResult {
    text: string;
    changed: boolean;
    /** Number of styleClass attributes/bindings rewritten to class. */
    renamed: number;
    /** 0-based offsets (in the given fragment) of tags skipped because they already carry a [class] binding. */
    conflicts: number[];
}

/**
 * Finds the opening tags of the given element selectors in an HTML fragment, tolerating `>`
 * characters inside quoted attribute values (e.g. `[severity]="a > b ? 'x' : 'y'"`). Returns
 * [start, end] offsets of each opening tag, end exclusive (position after the closing `>`).
 */
export function findOpeningTags(html: string, selector: string): Array<[number, number]> {
    const tags: Array<[number, number]> = [];
    const open = new RegExp(`<${selector}(?=[\\s/>])`, 'g');
    let match: RegExpExecArray | null;
    while ((match = open.exec(html)) !== null) {
        let i = match.index + match[0].length;
        let quote: string | null = null;
        while (i < html.length) {
            const ch = html[i];
            if (quote) {
                if (ch === quote) {
                    quote = null;
                }
            } else if (ch === '"' || ch === "'") {
                quote = ch;
            } else if (ch === '>') {
                tags.push([match.index, i + 1]);
                break;
            }
            i++;
        }
    }
    return tags;
}

const STYLECLASS_BINDING = /\s*\[styleClass\]\s*=\s*(["'])((?:\\.|(?!\1)[^\\])*)\1/;
const STYLECLASS_STATIC = /\s*(?<!\[)\bstyleClass\s*=\s*(["'])((?:\\.|(?!\1)[^\\])*)\1/;
const CLASS_BINDING = /\[class\]\s*=/;
const CLASS_STATIC = /\sclass\s*=\s*(["'])((?:\\.|(?!\1)[^\\])*)\1/;

/**
 * Rewrites the removed `styleClass` input to the plain `class` attribute on elements matching the
 * given selectors:
 *
 * - `styleClass="x"` becomes `class="x"`, merged into an existing static `class` attribute when
 *   one is present (`class="a" styleClass="x"` → `class="a x"`).
 * - `[styleClass]="expr"` becomes `[class]="expr"` (Angular merges a static `class` attribute
 *   with a `[class]` binding, so coexistence with `class="a"` keeps its behavior).
 * - A tag that already carries BOTH `[styleClass]` and `[class]` is left untouched and reported
 *   as a conflict for manual review — rewriting would produce two competing `[class]` bindings.
 */
export function migrateStyleClass(html: string, selectors: readonly string[]): StyleClassResult {
    const edits: Edit[] = [];
    const conflicts: number[] = [];
    let renamed = 0;

    for (const selector of selectors) {
        for (const [start, end] of findOpeningTags(html, selector)) {
            const tag = html.slice(start, end);
            let updated = tag;

            const binding = STYLECLASS_BINDING.exec(updated);
            if (binding) {
                if (CLASS_BINDING.test(updated)) {
                    conflicts.push(start);
                } else {
                    updated = updated.replace(STYLECLASS_BINDING, (m) => m.replace('[styleClass]', '[class]'));
                    renamed++;
                }
            }

            const stat = STYLECLASS_STATIC.exec(updated);
            if (stat) {
                const value = stat[2];
                const existing = CLASS_STATIC.exec(updated);
                if (existing) {
                    // merge into the existing static class attribute, drop styleClass
                    updated = updated.replace(STYLECLASS_STATIC, '');
                    updated = updated.replace(CLASS_STATIC, (m, quote: string, classes: string) => m.replace(`${quote}${classes}${quote}`, `${quote}${classes} ${value}${quote}`));
                } else {
                    updated = updated.replace(STYLECLASS_STATIC, (m) => m.replace(/\bstyleClass\b/, 'class'));
                }
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
 * Same rewrite, applied only inside the `template: \`...\`` string literal of an `@Component`
 * decorator in a TypeScript source file — mirrors utils/removed-outputs.ts so unrelated string
 * literals elsewhere in the file are never touched.
 */
export function migrateStyleClassInTypeScript(fileName: string, text: string, selectors: readonly string[]): StyleClassResult {
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
                const result = migrateStyleClass(body, selectors);
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
