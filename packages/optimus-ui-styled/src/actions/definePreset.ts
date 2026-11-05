import Theme from '../config/index';
import { mergePresets } from '../utils/index';

export default function definePreset<T extends Record<string, unknown>>(...presets: T[]): T {
    return mergePresets(presets, Theme.defaults.variable.excludedKeyRegex) as T;
}
