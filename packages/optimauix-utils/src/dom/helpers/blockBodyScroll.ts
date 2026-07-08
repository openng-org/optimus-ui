import addClass from '../methods/addClass';
import calculateBodyScrollbarWidth from '../methods/calculateBodyScrollbarWidth';

export interface BlockBodyScrollOptions {
    className?: string;
    variableName?: string;
}

export default function blockBodyScroll(option: string | BlockBodyScrollOptions | undefined): void {
    if (typeof option === 'string') {
        addClass(document.body, option || 'p-overflow-hidden');
    } else {
        option?.variableName && document.body.style.setProperty(option.variableName, calculateBodyScrollbarWidth() + 'px');
        addClass(document.body, option?.className || 'p-overflow-hidden');
    }
}
