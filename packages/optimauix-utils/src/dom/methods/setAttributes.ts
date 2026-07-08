import isElement from './isElement';

export default function setAttributes(element: HTMLElement, attributes: { [key: string]: any } = {}): void {
    if (isElement(element)) {
        const computedStyles = (rule: string, value: any): string[] => {
            const styles = (element as any)?.$attrs?.[rule] ? [(element as any)?.$attrs?.[rule]] : [];

            return [value].flat().reduce((cv, v) => {
                if (v !== null && v !== undefined) {
                    const type = typeof v;

                    if (type === 'string' || type === 'number') {
                        cv.push(v);
                    } else if (type === 'object') {
                        const _cv = Array.isArray(v) ? computedStyles(rule, v) : Object.entries(v).map(([_k, _v]) => (rule === 'style' && (!!_v || _v === 0) ? `${_k.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}:${_v}` : _v ? _k : undefined));

                        cv = _cv.length ? cv.concat(_cv.filter((c) => !!c)) : cv;
                    }
                }

                return cv;
            }, styles);
        };

        // CSP-safe
        const applyStyle = (value: any): void => {
            const declarations = computedStyles('style', value);

            declarations.forEach((decl) => {
                const idx = decl.indexOf(':');

                if (idx < 0) return;

                const prop = decl.slice(0, idx).trim();
                const val = decl.slice(idx + 1).trim();

                if (!prop) return;

                element.style.setProperty(prop, val);
            });
        };

        Object.entries(attributes).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                const matchedEvent = key.match(/^on(.+)/);

                if (matchedEvent) {
                    element.addEventListener(matchedEvent[1].toLowerCase(), value);
                } else if (key === 'p-bind' || key === 'pBind') {
                    setAttributes(element, value);
                } else if (key === 'style') {
                    applyStyle(value);
                    ((element as any).$attrs = (element as any).$attrs || {}) && ((element as any).$attrs[key] = element.style.cssText);
                } else {
                    value = key === 'class' ? [...new Set(computedStyles('class', value))].join(' ').trim() : value;

                    ((element as any).$attrs = (element as any).$attrs || {}) && ((element as any).$attrs[key] = value);
                    element.setAttribute(key, value);
                }
            }
        });
    }
}
