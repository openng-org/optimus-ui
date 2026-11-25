import { numberAttribute } from '@angular/core';

export const transformToBoolean = (value: any): boolean => {
    return !!value;
};

export const transformToNumber = (value: string | number): number => {
    return typeof value === 'string' ? parseFloat(value) : value;
};

/**
 * Like Angular's `numberAttribute`, but returns `undefined` instead of `NaN` for `null`, `undefined` or non-numeric values.
 * @group Utils
 */
export const optionalNumberAttribute = (value: unknown): number | undefined => {
    const result = numberAttribute(value);
    return isNaN(result) ? undefined : result;
};
