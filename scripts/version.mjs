#!/usr/bin/env node
/**
 * Wrapper around `changeset version` that keeps this repo's single root CHANGELOG.md.
 *
 * Changesets natively writes one changelog per package; since all @openng/* packages are
 * versioned in lockstep we disable that (`"changelog": false` in .changeset/config.json)
 * and instead prepend one aggregated section here. The script:
 *
 *   1. collects the pending changesets (.changeset/*.md not yet applied — in rc pre-mode,
 *      already-applied ones are listed in .changeset/pre.json and are skipped),
 *   2. runs `changeset version`,
 *   3. syncs the root package.json to the new package version,
 *   4. prepends a section for the new version to CHANGELOG.md.
 *
 * Run via `pnpm run version` (used by the release workflow's Version Packages PR).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const referencePackage = path.join(rootDir, 'packages', 'optimus-ui', 'package.json');

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

function repoUrl() {
    const url = readJson(path.join(rootDir, 'package.json')).repository?.url || '';
    return url
        .replace(/^git\+/, '')
        .replace(/\.git$/, '')
        .replace(/\/$/, '');
}

/** Pending changesets: every .changeset/*.md except README, minus those already applied in pre-mode. */
function pendingChangesets() {
    const dir = path.join(rootDir, '.changeset');
    const prePath = path.join(dir, 'pre.json');
    const applied = new Set(fs.existsSync(prePath) ? readJson(prePath).changesets : []);
    const entries = [];
    for (const file of fs.readdirSync(dir)) {
        if (!file.endsWith('.md') || file === 'README.md') continue;
        const name = file.slice(0, -3);
        if (applied.has(name)) continue;
        const content = fs.readFileSync(path.join(dir, file), 'utf8');
        const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(content);
        if (!match) continue;
        const bumps = [...match[1].matchAll(/^\s*['"]?[^'":]+['"]?\s*:\s*(major|minor|patch)\s*$/gm)].map((m) => m[1]);
        const bump = bumps.includes('major') ? 'major' : bumps.includes('minor') ? 'minor' : 'patch';
        const summary = match[2].trim();
        if (summary) entries.push({ name, bump, summary });
    }
    return entries;
}

function formatSummary(summary) {
    const [first, ...rest] = summary.split('\n');
    return [`- ${first}`, ...rest.map((line) => (line.trim() ? `  ${line}` : ''))].join('\n');
}

const pending = pendingChangesets();
if (pending.length === 0) {
    console.log('No pending changesets, nothing to version.');
    process.exit(0);
}

const previousVersion = readJson(referencePackage).version;
execFileSync('pnpm', ['exec', 'changeset', 'version'], { cwd: rootDir, stdio: 'inherit' });
const version = readJson(referencePackage).version;
if (version === previousVersion) {
    console.log('changeset version made no changes.');
    process.exit(0);
}

// Sync the (private) root package.json version, preserving file formatting.
const rootManifest = path.join(rootDir, 'package.json');
fs.writeFileSync(rootManifest, fs.readFileSync(rootManifest, 'utf8').replace(/"version"\s*:\s*"[^"]*"/, `"version": "${version}"`));

// Prepend the aggregated changelog section.
const url = repoUrl();
const date = new Date().toISOString().slice(0, 10);
const groups = [
    { bump: 'major', title: '**Breaking changes:**' },
    { bump: 'minor', title: '**New features:**' },
    { bump: 'patch', title: '**Fixed bugs:**' }
];
const lines = [`## [${version}](${url}/tree/${version}) (${date})`, `[Full Changelog](${url}/compare/${previousVersion}...${version})`];
for (const { bump, title } of groups) {
    const entries = pending.filter((c) => c.bump === bump);
    if (entries.length === 0) continue;
    lines.push('', title, ...entries.map((c) => formatSummary(c.summary)));
}
const section = lines.join('\n');

const changelogPath = path.join(rootDir, 'CHANGELOG.md');
const changelog = fs.existsSync(changelogPath) ? fs.readFileSync(changelogPath, 'utf8') : '# Changelog\n';
if (changelog.includes(`## [${version}]`)) {
    console.warn(`CHANGELOG.md already has a section for ${version}, leaving it untouched.`);
} else {
    const anchor = changelog.search(/^## /m);
    const updated =
        anchor === -1
            ? `${changelog.trimEnd()}\n\n${section}\n`
            : `${changelog.slice(0, anchor)}${section}\n\n${changelog.slice(anchor)}`;
    fs.writeFileSync(changelogPath, updated);
}
console.log(`Versioned ${previousVersion} -> ${version} (${pending.length} changeset(s)).`);
