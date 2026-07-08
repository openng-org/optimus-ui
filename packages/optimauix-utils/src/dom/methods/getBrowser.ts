import resolveUserAgent from './resolveUserAgent';

type BrowserType = {
    [key: string]: string | boolean | undefined;
};

let browser: BrowserType | null = null;

export default function getBrowser(): BrowserType {
    if (!browser) {
        browser = {};

        const matched = resolveUserAgent();

        if (matched.browser) {
            browser[matched.browser] = true;
            browser['version'] = matched.version;
        }

        if (browser['chrome']) {
            browser['webkit'] = true;
        } else if (browser['webkit']) {
            browser['safari'] = true;
        }
    }

    return browser;
}
