import fs from 'fs-extra';
import path from 'path';
import { clearPackageJson, resolvePath } from '../../../scripts/build-helper.mjs';

const { __dirname, INPUT_DIR, OUTPUT_DIR } = resolvePath(import.meta.url);
const __root = path.resolve(__dirname, '../');
const inputPath = path.resolve(__root, INPUT_DIR);
const outputPath = path.resolve(__root, OUTPUT_DIR);

for (const file of fs.readdirSync(inputPath)) {
    if (file.endsWith('.json')) {
        fs.copySync(path.join(inputPath, file), path.join(outputPath, file));
    }
}

fs.copySync(path.resolve(__root, './package.json'), path.join(outputPath, 'package.json'));
fs.copySync(path.resolve(__root, './README.md'), path.join(outputPath, 'README.md'));
fs.copySync(path.resolve(__root, './LICENSE'), path.join(outputPath, 'LICENSE'));

clearPackageJson(path.join(outputPath, 'package.json'));
