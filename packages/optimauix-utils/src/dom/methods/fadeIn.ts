export default function fadeIn(element: HTMLElement, duration: number): void {
    if (element) {
        element.style.opacity = '0';

        let last = +new Date();
        let opacity = '0';

        const tick = function () {
            opacity = `${+element.style.opacity + (new Date().getTime() - last) / duration}`;
            element.style.opacity = opacity;
            last = +new Date();

            if (+opacity < 1) {
                if ('requestAnimationFrame' in window) requestAnimationFrame(tick);
                else setTimeout(tick, 16);
            }
        };

        tick();
    }
}
