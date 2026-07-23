#!/usr/bin/env node
/**
 * Generates a changelog section for a release tag from the conventional commits since the
 * previous release tag, prepends it to CHANGELOG.md and (optionally) writes the same section
 * to a notes file used for the GitHub release.
 *
 * Usage:
 *   node scripts/generate-changelog.mjs --tag <tag> [--notes-out <file>] [--dry-run]
 *
 * Options:
 *   --tag        Release tag, e.g. "1.0.0-rc.2" or "v1.0.0-rc.2". If the tag does not exist
 *                yet (local dry runs), the range ends at HEAD instead.
 *   --notes-out  Also write the generated section (without the top heading) to this file.
 *   --dry-run    Print the generated section without touching any file.
 *
 * The previous release tag is auto-detected: the highest semver tag strictly lower than the
 * released version (inherited upstream tags like "21.1.9" sort higher and are ignored as long
 * as this project's versions stay below them).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const SEMVER = /^\d+\.\d+\.\d+(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$/;
const RELEASE_TAG = /^v?\d+\.\d+\.\d+(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$/;
const HEADER = /^(\w+)(?:\(([^)]*)\))?(!)?:\s*(.+)$/;

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function git(...args) {
    return execFileSync('git', args, { cwd: rootDir, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function parseArgs(argv) {
    const args = { tag: null, notesOut: null, dryRun: false };
    for (let i = 0; i < argv.length; i++) {
        if (argv[i] === '--tag') args.tag = argv[++i];
        else if (argv[i] === '--notes-out') args.notesOut = argv[++i];
        else if (argv[i] === '--dry-run') args.dryRun = true;
        else {
            console.error(`Unknown argument: ${argv[i]}`);
            process.exit(1);
        }
    }
    if (!args.tag) {
        console.error('Usage: node scripts/generate-changelog.mjs --tag <tag> [--notes-out <file>] [--dry-run]');
        process.exit(1);
    }
    return args;
}

function parseVersion(value) {
    const [core, prerelease] = value.split(/-(.+)/);
    const [major, minor, patch] = core.split('.').map(Number);
    return { major, minor, patch, prerelease: prerelease ? prerelease.split('.') : null };
}

function compareIdentifiers(a, b) {
    const aNum = /^\d+$/.test(a);
    const bNum = /^\d+$/.test(b);
    if (aNum && bNum) return Number(a) - Number(b);
    if (aNum) return -1; // numeric identifiers sort lower than alphanumeric ones
    if (bNum) return 1;
    return a < b ? -1 : a > b ? 1 : 0;
}

function compareVersions(a, b) {
    for (const key of ['major', 'minor', 'patch']) {
        if (a[key] !== b[key]) return a[key] - b[key];
    }
    if (!a.prerelease && !b.prerelease) return 0;
    if (!a.prerelease) return 1; // a release sorts higher than any of its prereleases
    if (!b.prerelease) return -1;
    for (let i = 0; i < Math.max(a.prerelease.length, b.prerelease.length); i++) {
        if (a.prerelease[i] === undefined) return -1;
        if (b.prerelease[i] === undefined) return 1;
        const diff = compareIdentifiers(a.prerelease[i], b.prerelease[i]);
        if (diff !== 0) return diff;
    }
    return 0;
}

function findPreviousTag(currentVersion) {
    const tags = git('tag', '--list').split('\n').filter(Boolean);
    let best = null;
    for (const tag of tags) {
        if (!RELEASE_TAG.test(tag)) continue;
        const version = parseVersion(tag.replace(/^v/, ''));
        if (compareVersions(version, currentVersion) >= 0) continue;
        if (!best || compareVersions(version, best.version) > 0) best = { tag, version };
    }
    return best ? best.tag : null;
}

function repoUrl() {
    const manifest = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
    const url = typeof manifest.repository === 'string' ? manifest.repository : manifest.repository?.url || '';
    return url
        .replace(/^git\+/, '')
        .replace(/\.git$/, '')
        .replace(/\/$/, '');
}

function collectCommits(range) {
    const raw = git('log', '--no-merges', '--format=%H%x1f%s%x1f%b%x1e', range);
    return raw
        .split('\x1e')
        .map((chunk) => chunk.trim())
        .filter(Boolean)
        .map((chunk) => {
            const [hash, subject, body] = chunk.split('\x1f');
            return { hash, subject: subject || '', body: body || '' };
        });
}

function formatEntry(commit, url) {
    const match = HEADER.exec(commit.subject);
    let scope = match ? match[2] : null;
    let subject = match ? match[4] : commit.subject;

    const links = [];
    subject = subject
        .replace(/\s*\(#(\d+)\)\s*$/, (_, pr) => {
            links.push(`[#${pr}](${url}/pull/${pr})`);
            return '';
        })
        .trim();
    for (const issue of commit.body.matchAll(/(?:Fixes|Fixed|Closes|Closed|Resolves)\s+#(\d+)/gi)) {
        links.push(`[#${issue[1]}](${url}/issues/${issue[1]})`);
    }
    if (links.length === 0) links.push(`[${commit.hash.slice(0, 10)}](${url}/commit/${commit.hash})`);

    const prefix = scope && scope !== 'release' ? `${scope.charAt(0).toUpperCase()}${scope.slice(1)} | ` : '';
    return `- ${prefix}${subject} ${links.join(' ')}`;
}

const args = parseArgs(process.argv.slice(2));
const version = args.tag.replace(/^v/, '');
if (!SEMVER.test(version)) {
    console.error(`Tag '${args.tag}' is not a valid semver release tag`);
    process.exit(1);
}

let endRef = args.tag;
try {
    git('rev-parse', '--verify', '--quiet', `${args.tag}^{commit}`);
} catch {
    console.warn(`Tag '${args.tag}' not found, using HEAD as the end of the commit range`);
    endRef = 'HEAD';
}

const url = repoUrl();
const previousTag = findPreviousTag(parseVersion(version));
const range = previousTag ? `${previousTag}..${endRef}` : endRef;
const date = git('log', '-1', '--format=%as', endRef).trim();

const groups = {
    breaking: { title: '**Breaking changes:**', entries: [] },
    feat: { title: '**New features:**', entries: [] },
    fix: { title: '**Fixed bugs:**', entries: [] }
};

for (const commit of collectCommits(range)) {
    const match = HEADER.exec(commit.subject);
    if (!match) continue;
    const [, type, scope, bang] = match;
    if (type === 'chore' && scope === 'release') continue;
    const breaking = Boolean(bang) || /BREAKING[ -]CHANGE/.test(commit.body);
    const group = breaking ? groups.breaking : groups[type];
    if (group) group.entries.push(formatEntry(commit, url));
}

const lines = [`## [${version}](${url}/tree/${args.tag}) (${date})`];
if (previousTag) lines.push(`[Full Changelog](${url}/compare/${previousTag}...${args.tag})`);
const bodyLines = [];
for (const group of Object.values(groups)) {
    if (group.entries.length === 0) continue;
    bodyLines.push('', group.title, ...group.entries);
}
if (bodyLines.length === 0) bodyLines.push('', '_Maintenance release — no user-facing changes._');
const section = [...lines, ...bodyLines].join('\n');

if (args.dryRun) {
    console.log(section);
    process.exit(0);
}

const changelogPath = path.join(rootDir, 'CHANGELOG.md');
const changelog = fs.readFileSync(changelogPath, 'utf8');
if (changelog.includes(`## [${version}]`)) {
    console.warn(`CHANGELOG.md already contains a section for ${version}, leaving it untouched`);
} else {
    const anchor = changelog.search(/^## /m);
    const updated =
        anchor === -1
            ? `${changelog.trimEnd()}\n\n${section}\n`
            : `${changelog.slice(0, anchor)}${section}\n\n${changelog.slice(anchor)}`;
    fs.writeFileSync(changelogPath, updated);
    console.log(`CHANGELOG.md updated with section for ${version} (${previousTag || 'no previous tag'} -> ${args.tag})`);
}

if (args.notesOut) {
    const notes = [previousTag ? `[Full Changelog](${url}/compare/${previousTag}...${args.tag})` : '', ...bodyLines].join('\n').trim();
    fs.writeFileSync(args.notesOut, `${notes}\n`);
    console.log(`Release notes written to ${args.notesOut}`);
}
