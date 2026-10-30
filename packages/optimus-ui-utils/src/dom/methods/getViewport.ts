export default function getViewport(): { width: number; height: number } {
    // documentElement.clientWidth/clientHeight exclude the page scrollbars, window.innerWidth/innerHeight include them.
    // An overlay aligned against innerWidth would end up under the vertical scrollbar.
    const win = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        w = e.clientWidth || win.innerWidth || g.clientWidth,
        h = e.clientHeight || win.innerHeight || g.clientHeight;

    return { width: w, height: h };
}
