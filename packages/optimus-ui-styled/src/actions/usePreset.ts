import Theme from '../config/index';
import { mergePresets } from '../utils/index';

export default function usePreset<T extends Record<string, unknown>>(...presets: T[]): T {
    const newPreset = mergePresets(presets, Theme.defaults.variable.excludedKeyRegex);

    Theme.setPreset(newPreset);

    return newPreset as T;
}
