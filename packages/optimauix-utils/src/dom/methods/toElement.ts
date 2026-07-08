import { resolve } from '@primeuix/utils/object';
import isElement from './isElement';

/**
 * Converts various framework-specific element references to a DOM HTMLElement
 * Supports:
 * - React refs: { current: HTMLElement }
 * - Vue refs: { value: HTMLElement }
 * - Lit refs: { value: HTMLElement }
 * - Angular ViewChild: { nativeElement: HTMLElement }
 * - Vue template ref: { el: HTMLElement }
 * - Direct HTMLElement
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

    // React ref pattern: { current: HTMLElement }
    if ('current' in ref) {
        target = (ref as { current: unknown }).current;
        target = toElement((target as { elementRef?: { current: unknown } })?.elementRef) ?? target; // Handle potential nested ref (e.g., when using withComponent)
    }
    // Vue ref / Lit pattern: { value: HTMLElement }
    // Note: Vue 3 refs use getters/setters, so we need 'in' operator instead of hasOwn
    else if ('value' in ref) {
        target = (ref as { value: unknown }).value;
    }
    // Angular ViewChild pattern: { nativeElement: HTMLElement }
    else if ('nativeElement' in ref) {
        target = (ref as { nativeElement: unknown }).nativeElement;
    }
    // Vue 3 template ref: { el: Element }
    else if ('el' in ref) {
        const el = (ref as { el: unknown }).el;

        // Nested element check (could be another ref)
        if (el && typeof el === 'object' && 'nativeElement' in el) {
            target = (el as { nativeElement: unknown }).nativeElement;
        } else {
            target = el;
        }
    }
    // PrimeReact component instance: { elementRef: { current: HTMLElement } }
    else if ('elementRef' in ref) {
        return toElement((ref as { elementRef: unknown }).elementRef);
    }

    // function pattern: resolve the element if it's a function that returns an element
    target = resolve(target);

    return isElement(target) ? (target as HTMLElement) : undefined;
}
