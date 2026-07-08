import isClient from './isClient';

export default function isServer(): boolean {
    return !isClient();
}
