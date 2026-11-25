import { optionalNumberAttribute } from './inpututils';

describe('optionalNumberAttribute', () => {
    it.each([undefined, null, '', 'abc', '42px', true])('returns undefined for %p', (value) => {
        expect(optionalNumberAttribute(value)).toBeUndefined();
    });

    it.each([
        [0, 0],
        ['42', 42],
        [' 42 ', 42],
        ['1e2', 100],
        [12.5, 12.5]
    ])('coerces %p to %p', (value, expected) => {
        expect(optionalNumberAttribute(value)).toBe(expected);
    });

    it('passes Infinity through unchanged', () => {
        expect(optionalNumberAttribute(Infinity)).toBe(Infinity);
    });
});
