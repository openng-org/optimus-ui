import { resolve } from '@openng/optimus-ui-utils/object';
import isElement from './isElement';

/**
 * Converts various framework-specific element references to a DOM HTMLElement
 *
 * @param ref - Framework-specific element reference
 * @returns The resolved HTMLElement or undefined if not found
 */
export default function toElement(ref: unknown): HTMLElement | undefined {
    // Direct Element
    if (isElement(ref)) {
        return ref as HTMLElement;
    }

    if (!ref || typeof ref !== 'object') {
        return undefined;
    }

    let target: unknown = ref;
    target = (ref as { nativeElement: unknown }).nativeElement;


    // function pattern: resolve the element if it's a function that returns an element
    target = resolve(target);

    return isElement(target) ? (target as HTMLElement) : undefined;
}
