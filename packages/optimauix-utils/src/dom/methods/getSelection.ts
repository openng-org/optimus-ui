export default function getSelection(): string | undefined {
    if (window.getSelection) return (window.getSelection() as any).toString();
    else if (document.getSelection) return (document.getSelection() as any).toString();

    return undefined;
}
