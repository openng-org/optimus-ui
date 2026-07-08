import createElement from './createElement';

export default function createStyleElement(css: string, attributes: Record<string, unknown> = {}, container?: Element): HTMLStyleElement {
    const element = createElement('style', attributes, css)! as HTMLStyleElement;

    container?.appendChild(element);

    return element;
}
