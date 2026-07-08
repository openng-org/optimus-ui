import path from 'path';
import { copyDependencies, resolvePath } from '../../../scripts/build-helper.mjs';

const { __dirname, OUTPUT_DIR, INPUT_DIR } = resolvePath(import.meta.url);

copyDependencies(path.resolve(__dirname, `../${INPUT_DIR}/presets`), path.resolve(__dirname, `../${OUTPUT_DIR}`));
