export default function getHiddenElementOuterWidth(element: HTMLElement): number {
    if (element) {
        const [visibility, display] = [element.style.visibility, element.style.display];

        // Temporarily hide the element to get its outer width
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        const elementWidth = element.offsetWidth;

        element.style.display = display;
        element.style.visibility = visibility;

        return elementWidth;
    }

    return 0;
}
