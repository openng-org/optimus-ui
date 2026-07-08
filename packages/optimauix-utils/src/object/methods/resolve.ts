import isFunction from './isFunction';

export default function resolve<T, P extends unknown[], R>(obj: T | ((...params: P) => R), ...params: P): T | R {
    return isFunction(obj) ? (obj as (...params: P) => R)(...params) : (obj as T);
}
