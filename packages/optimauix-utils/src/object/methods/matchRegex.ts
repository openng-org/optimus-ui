export default function matchRegex(str: string, regex?: RegExp): boolean {
    if (regex) {
        const match = regex.test(str);

        regex.lastIndex = 0;

        return match;
    }

    return false;
}
