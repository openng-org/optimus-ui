import removeClass from '../methods/removeClass';

export interface UnblockBodyScrollOptions {
    className?: string;
    variableName?: string;
}

export default function unblockBodyScroll(option: string | UnblockBodyScrollOptions | undefined): void {
    if (typeof option === 'string') {
        removeClass(document.body, option || 'p-overflow-hidden');
    } else {
        if (option?.variableName) document.body.style.removeProperty(option.variableName);
        removeClass(document.body, option?.className || 'p-overflow-hidden');
    }
}
