import findIndexInList from './findIndexInList';

export default function insertIntoOrderedArray<T>(item: T, index: number, arr: T[], sourceArr: any[]): void {
    if (arr.length > 0) {
        let injected = false;

        for (let i = 0; i < arr.length; i++) {
            const currentItemIndex = findIndexInList(arr[i], sourceArr);

            if (currentItemIndex > index) {
                arr.splice(i, 0, item);
                injected = true;
                break;
            }
        }

        if (!injected) {
            arr.push(item);
        }
    } else {
        arr.push(item);
    }
}
