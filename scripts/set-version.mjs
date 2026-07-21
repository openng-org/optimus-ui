#!/usr/bin/env node
/**
 * Stamps a single version into the root package.json and every package in packages/*.
 * Only the "version" field is touched, so the original file formatting is preserved.
 *
 * Usage: node scripts/set-version.mjs <version>
 *        (a leading "v" is accepted and stripped, e.g. both "1.0.0-rc.2" and "v1.0.0-rc.2" work)
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const SEMVER = /^\d+\.\d+\.\d+(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$/;

const rawVersion = process.argv[2];
if (!rawVersion) {
    console.error('Usage: node scripts/set-version.mjs <version>');
    process.exit(1);
}

const version = rawVersion.replace(/^v/, '');
if (!SEMVER.test(version)) {
    console.error(`Invalid semver version: '${rawVersion}'`);
    process.exit(1);
}

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packagesDir = path.join(rootDir, 'packages');

const manifests = [path.join(rootDir, 'package.json')];
for (const entry of fs.readdirSync(packagesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const manifest = path.join(packagesDir, entry.name, 'package.json');
    if (fs.existsSync(manifest)) manifests.push(manifest);
}

for (const manifest of manifests) {
    const original = fs.readFileSync(manifest, 'utf8');
    const updated = original.replace(/"version"\s*:\s*"[^"]*"/, `"version": "${version}"`);
    let parsed;
    try {
        parsed = JSON.parse(updated);
    } catch (error) {
        console.error(`Result is not valid JSON after updating ${manifest}: ${error.message}`);
        process.exit(1);
    }
    if (parsed.version !== version) {
        console.error(`Failed to set version in ${manifest} (no "version" field found?)`);
        process.exit(1);
    }
    if (updated !== original) fs.writeFileSync(manifest, updated);
    console.log(`${path.relative(rootDir, manifest)} -> ${version}`);
}
