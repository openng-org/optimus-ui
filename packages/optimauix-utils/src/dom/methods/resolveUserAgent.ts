export default function resolveUserAgent(): { browser: string | undefined; version: string | undefined } {
    const ua = navigator.userAgent.toLowerCase();
    const match = /(chrome)[ ]([\w.]+)/.exec(ua) || /(webkit)[ ]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ ]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || (ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) || [];

    return {
        browser: match[1] || '',
        version: match[2] || '0'
    };
}
