export default function nextFrame(): Promise<void> {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(resolve as () => void);
        });
    });
}
