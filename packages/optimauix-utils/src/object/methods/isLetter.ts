export default function isLetter(char: string): boolean {
    return /^[a-zA-Z\u00C0-\u017F]$/.test(char);
}
