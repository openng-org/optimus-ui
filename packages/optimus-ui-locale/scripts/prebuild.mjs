import path from 'path';
import { resolvePath, updatePackageJson } from '../../../scripts/build-helper.mjs';

const { __dirname } = resolvePath(import.meta.url);
const __root = path.resolve(__dirname, '../');
const pkg = path.resolve(__root, './package.json');

updatePackageJson(pkg);
