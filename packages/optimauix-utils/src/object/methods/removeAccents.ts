export default function removeAccents(str: string): string {
    // Regular expression to check for any accented characters 'Latin-1 Supplement' and 'Latin Extended-A'
    const accentCheckRegex = /[\xC0-\xFF\u0100-\u017E]/;

    if (str && accentCheckRegex.test(str)) {
        const accentsMap: { [key: string]: RegExp } = {
            A: /[\xC0-\xC5\u0100\u0102\u0104]/g,
            AE: /[\xC6]/g,
            C: /[\xC7\u0106\u0108\u010A\u010C]/g,
            D: /[\xD0\u010E\u0110]/g,
            E: /[\xC8-\xCB\u0112\u0114\u0116\u0118\u011A]/g,
            G: /[\u011C\u011E\u0120\u0122]/g,
            H: /[\u0124\u0126]/g,
            I: /[\xCC-\xCF\u0128\u012A\u012C\u012E\u0130]/g,
            IJ: /[\u0132]/g,
            J: /[\u0134]/g,
            K: /[\u0136]/g,
            L: /[\u0139\u013B\u013D\u013F\u0141]/g,
            N: /[\xD1\u0143\u0145\u0147\u014A]/g,
            O: /[\xD2-\xD6\xD8\u014C\u014E\u0150]/g,
            OE: /[\u0152]/g,
            R: /[\u0154\u0156\u0158]/g,
            S: /[\u015A\u015C\u015E\u0160]/g,
            T: /[\u0162\u0164\u0166]/g,
            U: /[\xD9-\xDC\u0168\u016A\u016C\u016E\u0170\u0172]/g,
            W: /[\u0174]/g,
            Y: /[\xDD\u0176\u0178]/g,
            Z: /[\u0179\u017B\u017D]/g,

            a: /[\xE0-\xE5\u0101\u0103\u0105]/g,
            ae: /[\xE6]/g,
            c: /[\xE7\u0107\u0109\u010B\u010D]/g,
            d: /[\u010F\u0111]/g,
            e: /[\xE8-\xEB\u0113\u0115\u0117\u0119\u011B]/g,
            g: /[\u011D\u011F\u0121\u0123]/g,
            i: /[\xEC-\xEF\u0129\u012B\u012D\u012F\u0131]/g,
            ij: /[\u0133]/g,
            j: /[\u0135]/g,
            k: /[\u0137,\u0138]/g,
            l: /[\u013A\u013C\u013E\u0140\u0142]/g,
            n: /[\xF1\u0144\u0146\u0148\u014B]/g,
            p: /[\xFE]/g,
            o: /[\xF2-\xF6\xF8\u014D\u014F\u0151]/g,
            oe: /[\u0153]/g,
            r: /[\u0155\u0157\u0159]/g,
            s: /[\u015B\u015D\u015F\u0161]/g,
            t: /[\u0163\u0165\u0167]/g,
            u: /[\xF9-\xFC\u0169\u016B\u016D\u016F\u0171\u0173]/g,
            w: /[\u0175]/g,
            y: /[\xFD\xFF\u0177]/g,
            z: /[\u017A\u017C\u017E]/g
        };

        for (const key in accentsMap) {
            str = str.replace(accentsMap[key], key);
        }
    }

    return str;
}
