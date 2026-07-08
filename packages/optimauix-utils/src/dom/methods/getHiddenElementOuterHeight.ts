export default function getHiddenElementOuterHeight(element: HTMLElement): number {
    if (element) {
        const [visibility, display] = [element.style.visibility, element.style.display];

        // Temporarily hide the element to get its outer height
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        const elementHeight = element.offsetHeight;

        element.style.display = display;
        element.style.visibility = visibility;

        return elementHeight;
    }

    return 0;
}
