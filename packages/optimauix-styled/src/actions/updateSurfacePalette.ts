import { $t } from '../helpers/index';

export default function updateSurfacePalette<T = unknown, P = unknown>(palette?: T): P {
    return $t().surfacePalette(palette).update().preset as P;
}
