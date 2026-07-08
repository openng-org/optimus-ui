export default function fadeOut(element: HTMLElement, duration: number): void {
    if (element) {
        let opacity = 1;
        const interval = 50;
        const gap = interval / duration;

        const fading = setInterval(() => {
            opacity -= gap;

            if (opacity <= 0) {
                opacity = 0;
                clearInterval(fading);
            }

            element.style.opacity = opacity.toString();
        }, interval);
    }
}
