import { matchRegex } from '@primeuix/utils';
import type { ColorScale } from '../..';
import { EXPR_REGEX } from '../../utils/index';
import shade from './shade';
import tint from './tint';

const scales: number[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export default (color: string): string | ColorScale => {
    if (matchRegex(color, EXPR_REGEX)) {
        const token = color.replace(/{|}/g, '');

        return scales.reduce<ColorScale>((acc, scale) => {
            acc[scale as keyof ColorScale] = `{${token}.${scale}}`;

            return acc;
        }, {});
    }

    return typeof color === 'string'
        ? scales.reduce<ColorScale>((acc, scale, i) => {
              acc[scale as keyof ColorScale] = i <= 5 ? tint(color, (5 - i) * 19) : shade(color, (i - 5) * 15);

              return acc;
          }, {})
        : color;
};
