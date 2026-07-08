export default function removeClass(element: Element, className: string | undefined | null | (string | undefined | null)[]): void {
    if (element && className) {
        const fn = (_className: string) => {
            if (element.classList) element.classList.remove(_className);
            else element.className = element.className.replace(new RegExp('(^|\\b)' + _className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        };

        [className]
            .flat()
            .filter(Boolean)
            .forEach((_classNames) => (_classNames as string).split(' ').forEach(fn));
    }
}
