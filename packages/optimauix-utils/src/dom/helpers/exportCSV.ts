import saveAs from './saveAs';

export default function exportCSV(csv: any, filename: string): void {
    const blob = new Blob([csv], {
        type: 'application/csv;charset=utf-8;'
    });

    if ((window.navigator as any).msSaveOrOpenBlob) {
        (navigator as any).msSaveOrOpenBlob(blob, filename + '.csv');
    } else {
        const isDownloaded = saveAs({ name: filename + '.csv', src: URL.createObjectURL(blob) });

        if (!isDownloaded) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
            window.open(encodeURI(csv));
        }
    }
}
