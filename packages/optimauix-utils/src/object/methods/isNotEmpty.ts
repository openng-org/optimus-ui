import isEmpty from './isEmpty';

export default function isNotEmpty(value: any): boolean {
    return !isEmpty(value);
}
