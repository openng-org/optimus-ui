export default function getBrowserLanguage(): string {
    return (navigator.languages && navigator.languages.length && navigator.languages[0]) || navigator.language || 'en';
}
