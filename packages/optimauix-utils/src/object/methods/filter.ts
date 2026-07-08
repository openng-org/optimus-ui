import resolveFieldData from './resolveFieldData';

export default function filter<T = any>(value: T[], fields: string[], filterValue: string): T[] {
    const filteredItems = [];

    if (value) {
        for (const item of value) {
            for (const field of fields) {
                if (String(resolveFieldData(item, field)).toLowerCase().indexOf(filterValue.toLowerCase()) > -1) {
                    filteredItems.push(item);
                    break;
                }
            }
        }
    }

    return filteredItems;
}
