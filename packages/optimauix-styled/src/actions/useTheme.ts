import { $t } from '../helpers/index';

export default function useTheme<T = unknown>(theme: T): T {
    return $t(theme).update({ mergePresets: false }) as T;
}
