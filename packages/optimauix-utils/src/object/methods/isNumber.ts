import isNotEmpty from './isNotEmpty';

export default function isNumber(value: unknown): boolean {
    return isNotEmpty(value) && !isNaN(value as number);
}
