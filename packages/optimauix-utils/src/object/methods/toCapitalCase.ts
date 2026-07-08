import isString from './isString';

export default function toCapitalCase(str: string): string {
    return isString(str, false) ? str[0].toUpperCase() + str.slice(1) : str;
}
