import addStyle from './addStyle';

let calculatedScrollbarHeight: number | undefined = undefined;

export default function calculateScrollbarHeight(element?: HTMLElement): number {
    if (element) {
        const style = getComputedStyle(element);

        return element.offsetHeight - element.clientHeight - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth);
    } else {
        if (calculatedScrollbarHeight != null) return calculatedScrollbarHeight;

        const scrollDiv = document.createElement('div');

        addStyle(scrollDiv, {
            width: '100px',
            height: '100px',
            overflow: 'scroll',
            position: 'absolute',
            top: '-9999px'
        });
        document.body.appendChild(scrollDiv);

        const scrollbarHeight = scrollDiv.offsetHeight - scrollDiv.clientHeight;

        document.body.removeChild(scrollDiv);

        calculatedScrollbarHeight = scrollbarHeight;

        return scrollbarHeight;
    }
}
