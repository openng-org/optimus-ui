export default function getViewport(): { width: number; height: number } {
    const win = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        w = win.innerWidth || e.clientWidth || g.clientWidth,
        h = win.innerHeight || e.clientHeight || g.clientHeight;

    return { width: w, height: h };
}
