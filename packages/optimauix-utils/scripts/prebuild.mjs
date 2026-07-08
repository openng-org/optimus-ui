import fs from 'fs-extra';
import path from 'path';
import { resolvePath } from '../../../scripts/build-helper.mjs';

const { __dirname, INPUT_DIR } = resolvePath(import.meta.url);
const __root = path.resolve(__dirname, '../');

const folderExports = [];

// Fill * > index.ts in subfolders
fs.readdirSync(path.resolve(__root, INPUT_DIR), { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .forEach(({ name: folderName }) => {
        const folderPath = path.resolve(__root, INPUT_DIR + folderName);
        const exports = [];

        folderExports.push(`export * from '@primeuix/utils/${folderName}';\n`);

        fs.readdirSync(folderPath, { withFileTypes: true })
            .filter((dir) => dir.isDirectory())
            .forEach(({ name: subFolderName }) => {
                const subFolderPath = path.resolve(folderPath, `./${subFolderName}`);

                fs.readdirSync(subFolderPath).forEach((file) => {
                    const fileName = file.split(/(.ts)$/)[0];

                    exports.push(`export { default as ${fileName} } from './${subFolderName}/${fileName}';\n`);
                });
            });

        if (exports.length) fs.writeFileSync(path.resolve(folderPath, 'index.ts'), exports.join(''));
    });

// src > index.ts
if (folderExports.length) fs.writeFileSync(path.resolve(__root, INPUT_DIR + 'index.ts'), folderExports.join(''));
