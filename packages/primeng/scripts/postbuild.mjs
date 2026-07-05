import fs from 'fs-extra';
import path from 'path';
import { resolvePath } from '../../../scripts/build-helper.mjs';

const { __dirname, __workspace, OUTPUT_DIR } = resolvePath(import.meta.url);

fs.copySync(path.resolve(__dirname, '../README.md'), `${OUTPUT_DIR}/README.md`);
fs.copySync(path.resolve(__workspace, './LICENSE.md'), `${OUTPUT_DIR}/LICENSE.md`);

// Copy Schematics JSON files
if (fs.existsSync(path.resolve(__dirname, '../schematics/collection.json'))) {
    fs.copySync(path.resolve(__dirname, '../schematics/collection.json'), `${OUTPUT_DIR}/schematics/collection.json`);
}
if (fs.existsSync(path.resolve(__dirname, '../schematics/ng-add/schema.json'))) {
    fs.copySync(path.resolve(__dirname, '../schematics/ng-add/schema.json'), `${OUTPUT_DIR}/schematics/ng-add/schema.json`);
}
