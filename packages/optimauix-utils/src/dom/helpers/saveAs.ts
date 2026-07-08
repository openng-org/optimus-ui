export default function saveAs(file: { name: string; src: string }): boolean {
    if (file) {
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const { name, src } = file;

            link.setAttribute('href', src);
            link.setAttribute('download', name);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return true;
        }
    }

    return false;
}
