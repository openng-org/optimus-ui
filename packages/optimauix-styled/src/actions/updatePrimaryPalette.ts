import { $t } from '../helpers/index';

export default function updatePrimaryPalette<T = unknown, P = unknown>(palette?: T): P {
    return $t().primaryPalette(palette).update().preset as P;
}
