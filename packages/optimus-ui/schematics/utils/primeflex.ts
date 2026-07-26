import * as ts from 'typescript';
import translations from './primeflex-translations.json';

/**
 * PrimeFlex -> Tailwind CSS class-name dictionary, ported verbatim from the PrimeCLT `pf2tw`
 * command (src/utils/data/translationDict.json). Keys are individual PrimeFlex class tokens
 * (including responsive prefixes such as `md:col-6`); values are the equivalent Tailwind class
 * list. A value may expand to several classes (`grid` -> `grid grid-cols-12 gap-4`) or be empty
 * (`grid-nogutter` -> ``), meaning the token is dropped.
 */
const TRANSLATIONS: Readonly<Record<string, string>> = translations;

/**
 * Translates a whitespace-separated class list (the value of a `class` attribute or of a string
 * literal inside a class binding). Each token is looked up in the PrimeFlex dictionary and, when
 * matched, replaced by its Tailwind equivalent; unknown tokens (Tailwind classes already, Angular
 * interpolations like `{{ x }}`, arbitrary text) are left untouched. Inter-token whitespace is
 * preserved so diffs stay minimal.
 */
export function translateClassList(value: string): { value: string; changed: boolean } {
    let changed = false;
    // Split keeping the whitespace runs so the original spacing is preserved on rebuild.
    const parts = value.split(/(\s+)/);
    const rebuilt = parts.map((part, index) => {
        if (index % 2 === 1 || part.length === 0) {
            return part; // whitespace run or empty edge
        }
        const mapped = TRANSLATIONS[part];
        if (mapped === undefined) {
            return part;
        }
        if (mapped !== part) {
            changed = true;
        }
        return mapped;
    });
    return { value: rebuilt.join(''), changed };
}

/**
 * Translates every quoted string literal found inside a class-binding expression
 * (`[class]`/`[ngClass]`) as a class list. Covers the common Angular shapes:
 *   [ngClass]="'grid col-6'"                    -> string operand
 *   [ngClass]="{ 'grid col-6': active }"        -> object keys
 *   [ngClass]="[a ? 'grid' : 'flex-1', 'p-2']"  -> array elements / ternary operands
 * Only the contents of the string literals are touched; identifiers and the surrounding
 * expression structure are left exactly as-is.
 */
function translateBindingExpression(expr: string): { value: string; changed: boolean } {
    let changed = false;
    const rebuilt = expr.replace(/(['"])((?:\\.|(?!\1).)*)\1/g, (_match, quote: string, inner: string) => {
        const translated = translateClassList(inner);
        if (translated.changed) {
            changed = true;
        }
        return `${quote}${translated.value}${quote}`;
    });
    return { value: rebuilt, changed };
}

// Static `class="..."` / `ngClass="..."` attributes. The leading boundary (`[\s(]` or start)
// ensures we do not match the `class` inside `[class]`, `[class.foo]`, or `ngClass` inside
// `[ngClass]` — those are handled as bindings below.
const STATIC_CLASS_RE = /(^|[\s(])((?:ng)?[Cc]lass)(\s*=\s*)(["'])((?:\\.|(?!\4).)*)\4/g;
// Angular class bindings: [class]="expr", [ngClass]="expr" (but not [class.foo]="...").
const CLASS_BINDING_RE = /(\[(?:ngClass|class)\]\s*=\s*)(["'])((?:\\.|(?!\2).)*)\2/g;

/**
 * Rewrites PrimeFlex classes to Tailwind inside an HTML fragment (a standalone template file or the
 * body of an inline component template). Only class-bearing locations are touched: static
 * `class`/`ngClass` attribute values and `[class]`/`[ngClass]` binding expressions. All other markup
 * — text, unrelated attributes, single-class bindings like `[class.active]` — is left untouched.
 */
export function translateHtml(html: string): { text: string; changed: boolean } {
    let changed = false;

    let text = html.replace(STATIC_CLASS_RE, (match, lead: string, name: string, eq: string, quote: string, inner: string) => {
        const translated = translateClassList(inner);
        if (!translated.changed) {
            return match;
        }
        changed = true;
        return `${lead}${name}${eq}${quote}${translated.value}${quote}`;
    });

    text = text.replace(CLASS_BINDING_RE, (match, prefix: string, quote: string, inner: string) => {
        const translated = translateBindingExpression(inner);
        if (!translated.changed) {
            return match;
        }
        changed = true;
        return `${prefix}${quote}${translated.value}${quote}`;
    });

    return { text, changed };
}

interface Edit {
    start: number;
    end: number;
    replacement: string;
}

/**
 * Rewrites PrimeFlex classes inside a TypeScript source file. To stay safe against corrupting
 * unrelated strings (a data value like `const mode = 'grid'`), only the bodies of Angular *inline
 * templates* are translated — i.e. the string/template-literal initializer of a `template`
 * property inside an `@Component`/`@Directive` decorator. Everything else in the file is untouched.
 *
 * Angular templates use `{{ }}` interpolation (not JS `${}`), so a multi-line inline template is a
 * single `NoSubstitutionTemplateLiteral` (or `StringLiteral`) to the TypeScript parser and its full
 * body can be handed to `translateHtml`.
 */
export function translateTypeScript(fileName: string, text: string): { text: string; changed: boolean } {
    const sourceFile = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true);
    const edits: Edit[] = [];

    const visit = (node: ts.Node): void => {
        if (ts.isPropertyAssignment(node) && isTemplateProperty(node) && isInsideDecorator(node)) {
            const initializer = node.initializer;
            if (ts.isStringLiteralLike(initializer)) {
                const raw = initializer.getText(sourceFile);
                const quote = raw[0];
                const body = raw.slice(1, -1);
                const translated = translateHtml(body);
                if (translated.changed) {
                    edits.push({
                        start: initializer.getStart(sourceFile),
                        end: initializer.getEnd(),
                        replacement: `${quote}${translated.text}${quote}`
                    });
                }
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(sourceFile);

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

function isTemplateProperty(node: ts.PropertyAssignment): boolean {
    const name = node.name;
    return (ts.isIdentifier(name) || ts.isStringLiteral(name)) && name.text === 'template';
}

/** True when the property assignment lives inside a decorator call, e.g. `@Component({ template: ... })`. */
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
