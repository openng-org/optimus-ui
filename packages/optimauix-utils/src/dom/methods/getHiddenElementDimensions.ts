export default function getHiddenElementDimensions(element?: HTMLElement): { width: number; height: number } {
    const dimensions: { width: number; height: number } = { width: 0, height: 0 };

    if (element) {
        const [visibility, display] = [element.style.visibility, element.style.display];
        const rect = element.getBoundingClientRect();

        // Temporarily hide the element to get its dimensions
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        dimensions.width = rect.width || element.offsetWidth;
        dimensions.height = rect.height || element.offsetHeight;
        element.style.display = display;
        element.style.visibility = visibility;
    }

    return dimensions;
}
