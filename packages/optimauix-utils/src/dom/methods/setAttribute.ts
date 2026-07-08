import isElement from './isElement';

export default function setAttribute(element: HTMLElement, attribute: string = '', value: any): void {
    if (isElement(element) && value !== null && value !== undefined) {
        // CSP-safe
        if (attribute === 'style') {
            if (typeof value === 'string') {
                element.style.cssText = value;
            } else if (typeof value === 'object') {
                Object.entries(value).forEach(([prop, val]) => {
                    if (val === null || val === undefined) return;

                    const name = prop.startsWith('--') ? prop : prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

                    element.style.setProperty(name, String(val));
                });
            }

            return;
        }

        element.setAttribute(attribute, value);
    }
}
