export default function createStyleMarkup(css?: string, attributes: Record<string, unknown> = {}): string {
    return css ? `<style${Object.entries(attributes).reduce((s, [k, v]) => s + ` ${k}="${v}"`, '')}>${css}</style>` : '';
}
