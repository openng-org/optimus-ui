import getScrollLeft from './getScrollLeft';

export default function getWindowScrollLeft(): number {
    const doc = document.documentElement;

    return (window.pageXOffset || getScrollLeft(doc)) - (doc.clientLeft || 0);
}
