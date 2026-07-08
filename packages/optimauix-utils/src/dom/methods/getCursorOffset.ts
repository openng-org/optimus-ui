export default function getCursorOffset(element: Element, prevText: string, nextText: string, currentText: string): { top: number | string; left: number | string } {
    if (element) {
        const style = getComputedStyle(element);
        const ghostDiv = document.createElement('div');

        ghostDiv.style.position = 'absolute';
        ghostDiv.style.top = '0px';
        ghostDiv.style.left = '0px';
        ghostDiv.style.visibility = 'hidden';
        ghostDiv.style.pointerEvents = 'none';
        ghostDiv.style.overflow = style.overflow;
        ghostDiv.style.width = style.width;
        ghostDiv.style.height = style.height;
        ghostDiv.style.padding = style.padding;
        ghostDiv.style.border = style.border;
        ghostDiv.style.overflowWrap = style.overflowWrap;
        ghostDiv.style.whiteSpace = style.whiteSpace;
        ghostDiv.style.lineHeight = style.lineHeight;
        ghostDiv.innerHTML = prevText.replace(/\r\n|\r|\n/g, '<br />');

        const ghostSpan = document.createElement('span');

        ghostSpan.textContent = currentText;
        ghostDiv.appendChild(ghostSpan);

        const text = document.createTextNode(nextText);

        ghostDiv.appendChild(text);
        document.body.appendChild(ghostDiv);

        const { offsetLeft, offsetTop, clientHeight } = ghostSpan;

        document.body.removeChild(ghostDiv);

        return {
            left: Math.abs(offsetLeft - element.scrollLeft),
            top: Math.abs(offsetTop - element.scrollTop) + clientHeight
        };
    }

    return {
        top: 'auto',
        left: 'auto'
    };
}
