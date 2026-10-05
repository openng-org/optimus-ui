const AI_CO_AUTHOR_MARKERS: readonly string[] = [
    'claude', 'anthropic', 'chatgpt', 'openai', 'gpt-', 'copilot', 'gemini', 'bard', 'devin', 'codeium', 'cursor',
    'windsurf', 'tabnine', 'aider', 'cody', 'jules'
];

const CO_AUTHOR_TRAILER = /^co-authored-by:\s*(.+)$/gim;

export function findAiCoAuthorTrailers(message: string): string[] {
    const found: string[] = [];

    for (const match of message.matchAll(CO_AUTHOR_TRAILER)) {
        const value = match[1].trim();
        const lowerValue = value.toLowerCase();

        if (AI_CO_AUTHOR_MARKERS.some((marker) => lowerValue.includes(marker))) {
            found.push(value);
        }
    }

    return found;
}
