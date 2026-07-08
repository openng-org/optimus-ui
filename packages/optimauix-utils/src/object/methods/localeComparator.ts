export default function localeComparator(): (val1: string, val2: string) => number {
    //performance gain using Int.Collator. It is not recommended to use localeCompare against large arrays.
    return new Intl.Collator(undefined, { numeric: true }).compare;
}
