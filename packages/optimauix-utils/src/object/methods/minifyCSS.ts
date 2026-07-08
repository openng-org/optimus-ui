export default function minifyCSS(css?: string): string | undefined {
    return css
        ? css
              .replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '')
              .replace(/ {2,}/g, ' ')
              .replace(/ ([{:}]) /g, '$1')
              .replace(/([;,]) /g, '$1')
              .replace(/ !/g, '!')
              .replace(/: /g, ':')
              .trim()
        : css;
}
