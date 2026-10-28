import Theme from '../config/index';
import { mergePresets } from '../utils/index';

export default function updatePreset<T extends Record<string, unknown>>(...presets: T[]): T {
    const newPreset = mergePresets([Theme.getPreset(), ...presets], Theme.defaults.variable.excludedKeyRegex);

    Theme.setPreset(newPreset);

    return newPreset as T;
}
