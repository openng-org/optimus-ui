import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const SKILL_NAME = 'optimus-ui';
const ZIP_NAME = 'optimus-ui-skill.zip';
const SITE_URL = 'https://optimus.openng.org';
const DISCOVERY_SCHEMA = 'https://schemas.agentskills.io/discovery/0.2.0/schema.json';

const SKILL_DESCRIPTION =
    'Local, offline copy of the official Optimus UI (@openng/optimus-ui) documentation — usage examples, full API (props, events, templates), pass-through options, CSS classes and design tokens for all 80+ Angular components, plus the installation, configuration, theming (styled/unstyled), icons, Tailwind, pass-through, accessibility and PrimeNG-migration guides. ' +
    'Use this skill whenever writing, reviewing, debugging or answering questions about Angular code that uses Optimus UI — any `p-*` element or `p*` directive (p-button, p-table, p-select, p-dialog, pTooltip, ...), imports from `@openng/optimus-ui` or `@openng/optimus-ui-themes`, theming/design tokens, or migrating from PrimeNG — and prefer it over fetching optimus.openng.org pages.';

/**
 * Build an Agent Skill (https://agentskills.io: SKILL.md + references/) from the generated LLM markdown files
 * and publish it as a single zip next to llms.txt.
 *
 * The zip has SKILL.md at its root, as the well-known discovery index requires. The index at
 * `/.well-known/agent-skills/index.json` lets `npx skills add https://optimus.openng.org` install the skill,
 * and its sha256 digest lets `npx skills update` detect new versions.
 */
export function generateAgentSkill({ outputDir, wellKnownDir, components, pages, version }) {
    const files = [];

    // Some guide pages (e.g. llms) are also picked up as components; keep them under guides only.
    const pageNames = new Set(pages.map((page) => page.route.split('/').pop()));
    const componentEntries = components
        .filter((comp) => !pageNames.has(comp.name))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((comp) => ({ file: `references/components/${comp.name}.md`, source: path.join(outputDir, 'components', `${comp.name}.md`), title: shortTitle(comp.title), description: comp.description }));

    const pageEntries = [...pages]
        .map((page) => {
            const name = page.route.split('/').pop();
            return { file: `references/guides/${name}.md`, source: path.join(outputDir, 'pages', `${name}.md`), title: page.title, description: page.description };
        })
        .sort((a, b) => a.file.localeCompare(b.file));

    for (const entry of [...pageEntries, ...componentEntries]) {
        if (fs.existsSync(entry.source)) {
            files.push({ name: entry.file, data: fs.readFileSync(entry.source) });
        }
    }

    files.unshift({ name: 'SKILL.md', data: Buffer.from(renderSkillMd({ version, pageEntries, componentEntries }), 'utf-8') });
    files.push({ name: 'references/llms.txt', data: fs.readFileSync(path.join(outputDir, 'llms.txt')) });

    const zip = createZip(files);
    const zipPath = path.join(outputDir, ZIP_NAME);
    fs.writeFileSync(zipPath, zip);
    console.log(`✓ Generated Agent Skill (${files.length} files): ${zipPath}`);

    const index = {
        $schema: DISCOVERY_SCHEMA,
        skills: [
            {
                name: SKILL_NAME,
                type: 'archive',
                description: SKILL_DESCRIPTION,
                url: `/${path.basename(outputDir)}/${ZIP_NAME}`,
                digest: `sha256:${crypto.createHash('sha256').update(zip).digest('hex')}`
            }
        ]
    };
    const indexPath = path.join(wellKnownDir, 'agent-skills', 'index.json');
    fs.mkdirSync(path.dirname(indexPath), { recursive: true });
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 4) + '\n');
    console.log(`✓ Generated skills discovery index: ${indexPath}`);
}

function shortTitle(title) {
    return title.replace(/^Angular /, '').replace(/ (Component|Directive)$/, '');
}

function oneLine(text) {
    return (text || '').replace(/\s+/g, ' ').trim() || '-';
}

function renderSkillMd({ version, pageEntries, componentEntries }) {
    const indexLine = (e) => `- \`${e.file}\` — **${e.title}**: ${oneLine(e.description)}`;

    return `---
name: ${SKILL_NAME}
description: ${SKILL_DESCRIPTION}
---

# Optimus UI docs (local copy)

Optimus UI is a community-maintained, MIT-licensed continuation of PrimeNG: 80+ accessible Angular components, targeting Angular v21+. This skill bundles the documentation published at <${SITE_URL}/llms/llms.txt> (generated from Optimus UI v${version}), so you can read it from disk instead of fetching \`${SITE_URL}/llms/components/<name>.md\` each time.

All paths below are relative to this skill's directory (the folder containing this SKILL.md).

## How to use the docs

1. Find the file in the index below. The file name is the component's docs slug (\`select\`, \`datepicker\`, \`inputotp\`, \`galleria\`, \`scroller\`, ...), which is not always the selector name.
2. Read only the part you need. Component files are 10–60 KB, so list the headings first and then read the matching line range, for example \`grep -n '^##' references/components/table.md\`.
3. When an exact API detail matters (input name, event payload, template context, token name), copy it from the docs instead of relying on memory of PrimeNG. Optimus UI is API-compatible with PrimeNG v21 in most places, but names, packages and defaults can differ.

To search everything at once, grep the folder, for example \`grep -rn "appendTo" references/components/\`.

### Layout of a component file

- \`# Angular <Name> Component\` followed by a one-line summary.
- One \`##\` section per demo (Basic, Template, Sizes, Disabled, ...). Each has a short explanation and a full standalone Angular component in a \`typescript\` block showing the correct imports.
- \`## Accessibility\`: screen-reader and keyboard support.
- \`## <Name>\` with \`### Props\`, \`### Emits\`, \`### Templates\` (and sometimes \`### Methods\`): the API tables. This is the authoritative list of inputs and outputs.
- \`## Pass Through Options\`: the \`pt\` keys for styling internal elements.
- \`## Theming\`, with \`### CSS Classes\` and \`### Design Tokens\`.

## Conventions that hold across the library

Check the guides when in doubt; these are here so simple tasks don't need a lookup:

- Packages: \`@openng/optimus-ui\` (one secondary entry point per component, such as \`@openng/optimus-ui/button\`) and \`@openng/optimus-ui-themes\` (theme presets).
- Components are imported per entry point (\`import { ButtonModule } from '@openng/optimus-ui/button'\`) into standalone components. The docs examples show the exact symbol to import, so copy it from there.
- App-wide setup (theme preset, ripple, z-index, locale and so on) goes through \`provideOptimus({...})\` from \`@openng/optimus-ui/config\`; see \`references/guides/configuration.md\`. New projects can use \`ng add @openng/optimus-ui\`. Existing PrimeNG apps use the \`migrate-from-primeng\` schematic instead (see \`references/guides/installation.md\` and \`references/guides/faq.md\`).
- Selectors use the \`p-\` prefix (\`<p-button>\`, \`<p-table>\`) and directives the \`p\` prefix (\`pButton\`, \`pTooltip\`, \`pInputText\`).

## Keeping the docs up to date

These docs are a snapshot of v${version}. If the project uses a newer Optimus UI release, or the docs contradict the installed package, offer to update it by running \`npx skills update ${SKILL_NAME}\`, or \`npx skills add ${SITE_URL}\` (add \`-g\` for a user-level install) if it was installed another way. Any single page can also be fetched live from \`${SITE_URL}/llms/components/<name>.md\` or \`${SITE_URL}/llms/pages/<name>.md\`.

## Index

### Guides (\`references/guides/\`)

${pageEntries.map(indexLine).join('\n')}

### Components (\`references/components/\`)

${componentEntries.map(indexLine).join('\n')}
`;
}

/**
 * Minimal zip writer (deflate, no extra fields) so the docs build doesn't need an archiver
 * dependency. Uses a fixed timestamp to keep the output reproducible.
 */
function createZip(entries) {
    const DOS_TIME = 0;
    const DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1;
    const locals = [];
    const centrals = [];
    let offset = 0;

    for (const { name, data } of entries) {
        const nameBuf = Buffer.from(name, 'utf-8');
        const compressed = zlib.deflateRawSync(data, { level: 9 });
        const crc = zlib.crc32(data);

        const local = Buffer.alloc(30);
        local.writeUInt32LE(0x04034b50, 0);
        local.writeUInt16LE(20, 4); // version needed
        local.writeUInt16LE(0x0800, 6); // UTF-8 names
        local.writeUInt16LE(8, 8); // deflate
        local.writeUInt16LE(DOS_TIME, 10);
        local.writeUInt16LE(DOS_DATE, 12);
        local.writeUInt32LE(crc, 14);
        local.writeUInt32LE(compressed.length, 18);
        local.writeUInt32LE(data.length, 22);
        local.writeUInt16LE(nameBuf.length, 26);
        local.writeUInt16LE(0, 28);

        const central = Buffer.alloc(46);
        central.writeUInt32LE(0x02014b50, 0);
        central.writeUInt16LE(20, 4); // version made by
        central.writeUInt16LE(20, 6);
        central.writeUInt16LE(0x0800, 8);
        central.writeUInt16LE(8, 10);
        central.writeUInt16LE(DOS_TIME, 12);
        central.writeUInt16LE(DOS_DATE, 14);
        central.writeUInt32LE(crc, 16);
        central.writeUInt32LE(compressed.length, 20);
        central.writeUInt32LE(data.length, 24);
        central.writeUInt16LE(nameBuf.length, 28);
        central.writeUInt32LE(offset, 42);

        locals.push(local, nameBuf, compressed);
        centrals.push(central, nameBuf);
        offset += local.length + nameBuf.length + compressed.length;
    }

    const centralDir = Buffer.concat(centrals);
    const end = Buffer.alloc(22);
    end.writeUInt32LE(0x06054b50, 0);
    end.writeUInt16LE(entries.length, 8);
    end.writeUInt16LE(entries.length, 10);
    end.writeUInt32LE(centralDir.length, 12);
    end.writeUInt32LE(offset, 16);

    return Buffer.concat([...locals, centralDir, end]);
}
