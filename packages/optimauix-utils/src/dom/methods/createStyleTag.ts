import createStyleElement from './createStyleElement';

/**
 * @deprecated Use `createStyleElement` instead.
 */
export default function createStyleTag(attributes: Record<string, unknown> = {}, container?: Element): HTMLStyleElement {
    return createStyleElement('', attributes, container || document.head);
}
