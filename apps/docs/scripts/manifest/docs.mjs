import fs from 'fs';
import path from 'path';

/**
 * Read the prose and code examples of the documentation site: one entry per component page (its sections with
 * descriptions and demo code, and the API classes the page documents) and one per guide page.
 */
export function collectDocs({ docsDir, pagesDir, demosPath }) {
    DOCS_DIR = docsDir;
    PAGES_DIR = pagesDir;
    demosData = loadDemosJson(demosPath);
    if (!demosData) console.warn('   Warning: demos.json not available, code examples will be missing');

    // Some guide pages (e.g. llms) also look like component pages; keep them under guides only.
    const guides = getAllGuidePages();
    const guideNames = new Set(guides.map((page) => page.route.split('/').pop()));
    const components = getAllComponents()
        .filter((comp) => !guideNames.has(comp.name))
        .map((comp) => ({ ...comp, route: COMPONENT_ROUTE_MAP[comp.name] ?? comp.name }));

    return { components, guides };
}

let DOCS_DIR;
let PAGES_DIR;

// Demos data loaded from demos.json
let demosData = null;

// Components whose documentation directory name differs from their public route.
// Keep in sync with router/app.routes.ts.
const COMPONENT_ROUTE_MAP = {
    scroller: 'virtualscroller'
};

// Guide/documentation pages configuration
// Maps route paths to their doc directories and metadata
const GUIDE_PAGES = [
    {
        route: 'installation',
        docPath: 'installation',
        title: 'Installation',
        description: 'Setting up Optimus UI in an Angular CLI project.'
    },
    {
        route: 'configuration',
        docPath: 'configuration',
        title: 'Configuration',
        description: 'Application wide configuration for Optimus UI.'
    },
    {
        route: 'theming/styled',
        docPath: 'theming/styled',
        title: 'Styled Mode',
        description: 'Choose from a variety of pre-styled themes or develop your own.'
    },
    {
        route: 'theming/unstyled',
        docPath: 'theming/unstyled',
        title: 'Unstyled Mode',
        description: 'Theming Optimus UI with alternative styling approaches.'
    },
    {
        route: 'icons',
        docPath: 'icons',
        title: 'Icons',
        description: 'OpenNG Icons is the default icon library of Optimus UI with over 250 open source icons.'
    },
    {
        route: 'customicons',
        docPath: 'customicons',
        title: 'Custom Icons',
        description: 'Use custom icons with Optimus UI components.'
    },
    {
        route: 'passthrough',
        docPath: 'guides/passthrough',
        title: 'Pass Through',
        description: 'Pass Through Props allow direct access to the underlying elements for complete customization.'
    },
    {
        route: 'tailwind',
        docPath: 'tailwind',
        title: 'Tailwind CSS',
        description: 'Integration between Optimus UI and Tailwind CSS.'
    },
    {
        route: 'llms',
        docPath: 'llms',
        title: 'LLMs.txt',
        description: 'LLM-optimized documentation endpoints for Optimus UI components.'
    },
    {
        route: 'guides/accessibility',
        docPath: 'guides/accessibility',
        title: 'Accessibility',
        description: 'Optimus UI has WCAG 2.1 AA level compliance.'
    },
    {
        route: 'guides/animations',
        docPath: 'guides/animations',
        title: 'Animations',
        description: 'Built-in CSS animations for Optimus UI components.'
    },
    {
        route: 'guides/rtl',
        docPath: 'guides/rtl',
        title: 'RTL',
        description: 'Right-to-left support for Optimus UI components.'
    },
    {
        route: 'guides/primeflex',
        docPath: 'guides/primeflex',
        title: 'PrimeFlex',
        description: 'Moving from PrimeFlex to Tailwind CSS.'
    },
    {
        route: 'philosophy',
        docPath: 'philosophy',
        title: 'Philosophy',
        description: 'Why Optimus UI exists, what it commits to, and where it stops.'
    },
    {
        route: 'faq',
        docPath: 'faq',
        title: 'FAQ',
        description: 'Licensing, migration from PrimeNG, the ecosystem, and how support works.'
    },
    {
        route: 'contribution',
        docPath: 'contribution',
        title: 'Contribution Guide',
        description: 'How to contribute to Optimus UI.'
    }
];

/**
 * Extract description text from Angular template
 */
function extractDescriptionFromTemplate(template) {
    const descriptions = [];

    // Extract content from app-docsectiontext
    const docTextMatches = template.matchAll(/<app-docsectiontext[^>]*>([\s\S]*?)<\/app-docsectiontext>/gi);
    for (const match of docTextMatches) {
        const content = match[1]
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        if (content) {
            descriptions.push(content);
        }
    }

    return descriptions.join(' ');
}

/**
 * Load demos.json data
 */
function loadDemosJson(demosPath) {
    if (!fs.existsSync(demosPath)) {
        console.warn('demos.json not found. Run build:democode first.');
        return null;
    }

    return JSON.parse(fs.readFileSync(demosPath, 'utf-8'));
}

/**
 * Convert component name to hyphenated form (e.g., cascadeselect -> cascade-select)
 */
function toHyphenatedName(name) {
    // Common compound words that need hyphenation
    const compounds = {
        cascadeselect: 'cascade-select',
        treeselect: 'tree-select',
        treetable: 'tree-table',
        multiselect: 'multi-select',
        selectbutton: 'select-button',
        togglebutton: 'toggle-button',
        splitbutton: 'split-button',
        speeddial: 'speed-dial',
        inputtext: 'input-text',
        inputnumber: 'input-number',
        inputmask: 'input-mask',
        inputotp: 'input-otp',
        inputgroup: 'input-group',
        iconfield: 'icon-field',
        floatlabel: 'float-label',
        iftalabel: 'ifta-label',
        colorpicker: 'color-picker',
        orderlist: 'order-list',
        picklist: 'pick-list',
        contextmenu: 'context-menu',
        tieredmenu: 'tiered-menu',
        megamenu: 'mega-menu',
        panelmenu: 'panel-menu',
        tabmenu: 'tab-menu',
        confirmdialog: 'confirm-dialog',
        confirmpopup: 'confirm-popup',
        dynamicdialog: 'dynamic-dialog',
        fileupload: 'file-upload',
        progressbar: 'progress-bar',
        progressspinner: 'progress-spinner',
        blockui: 'block-ui',
        scrollpanel: 'scroll-panel',
        scrolltop: 'scroll-top',
        virtualscroller: 'virtual-scroller',
        datepicker: 'date-picker',
        dataview: 'data-view',
        toggleswitch: 'toggle-switch',
        organizationchart: 'organization-chart',
        overlaybadge: 'overlay-badge',
        metergroup: 'meter-group',
        imagecompare: 'image-compare'
    };
    return compounds[name.toLowerCase()] || name;
}

/**
 * Get code examples from demos.json for a specific component section
 */
function getCodeExamplesFromDemos(componentName, sectionId) {
    if (!demosData || !demosData.demos) return null;

    // Try different selector patterns
    const hyphenated = toHyphenatedName(componentName);
    const selectors = [`${componentName}-${sectionId}-demo`, `${hyphenated}-${sectionId}-demo`];

    for (const selector of selectors) {
        const demo = demosData.demos[selector];
        if (demo && demo.code) {
            const examples = {};
            if (demo.code.typescript) examples.typescript = demo.code.typescript;
            if (demo.code.data) examples.data = demo.code.data;
            if (demo.code.scss) examples.scss = demo.code.scss;

            return Object.keys(examples).length > 0 ? examples : null;
        }
    }

    return null;
}

/**
 * Extract code object from file content
 */
function extractCodeFromFile(content) {
    const examples = {};

    // Look for code: Code = { ... } pattern
    const codeMatch = content.match(/code:\s*Code\s*=\s*\{/);
    if (codeMatch) {
        const startIndex = codeMatch.index + codeMatch[0].length;
        let braceDepth = 1;
        let endIndex = startIndex;

        for (let i = startIndex; i < content.length && braceDepth > 0; i++) {
            if (content[i] === '{') braceDepth++;
            else if (content[i] === '}') braceDepth--;
            endIndex = i;
        }

        const codeContent = content.substring(startIndex, endIndex);

        // Extract each code type
        const extractBetweenBackticks = (text, prefix) => {
            const regex = new RegExp(prefix + '\\s*`([\\s\\S]*?)`');
            const match = text.match(regex);
            return match ? match[1].trim() : null;
        };

        const typescript = extractBetweenBackticks(codeContent, 'typescript:');
        const command = extractBetweenBackticks(codeContent, 'command:');
        const scss = extractBetweenBackticks(codeContent, 'scss:');

        if (typescript) examples.typescript = typescript;
        if (command) examples.command = command;
        if (scss) examples.scss = scss;
    }

    return Object.keys(examples).length > 0 ? examples : null;
}

/**
 * Parse a single TypeScript documentation file
 */
function parseDocFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract template from @Component decorator
    const templateMatch = content.match(/template:\s*`([\s\S]*?)`(?=\s*(?:,|\}))/);
    const template = templateMatch ? templateMatch[1] : '';

    const description = extractDescriptionFromTemplate(template);

    // Extract app-code selector from template (for guide pages that reference other demos)
    const appCodeMatch = template.match(/<app-code\s+selector="([^"]+)"/);
    const appCodeSelector = appCodeMatch ? appCodeMatch[1] : null;

    // Extract inline code object from file (for guide pages)
    const inlineCode = extractCodeFromFile(content);

    return {
        description,
        appCodeSelector,
        inlineCode
    };
}

/**
 * Get code examples by selector directly from demos.json
 */
function getCodeExamplesBySelector(selector) {
    if (!demosData || !demosData.demos || !selector) return null;

    const demo = demosData.demos[selector];
    if (demo && demo.code) {
        const examples = {};
        if (demo.code.typescript) examples.typescript = demo.code.typescript;
        if (demo.code.data) examples.data = demo.code.data;
        if (demo.code.scss) examples.scss = demo.code.scss;

        return Object.keys(examples).length > 0 ? examples : null;
    }

    return null;
}

/**
 * Get component metadata from page file
 */
function getComponentMetadata(componentName) {
    const pagePath = path.join(PAGES_DIR, componentName, 'index.ts');

    if (!fs.existsSync(pagePath)) {
        return null;
    }

    const content = fs.readFileSync(pagePath, 'utf-8');

    // Extract from app-doc template attributes
    const docTitleMatch = content.match(/docTitle="([^"]+)"/);
    // Page titles carry a ' - Optimus UI' suffix for the browser tab; the llms output
    // is already headed '# Optimus UI', so drop it rather than repeat it on every line.
    const docTitle = docTitleMatch ? docTitleMatch[1].replace(/\s+-\s+Optimus UI$/, '') : null;
    const headerMatch = content.match(/header="([^"]+)"/);
    const descriptionMatch = content.match(/description="([^"]+)"/);
    const apiDocsMatch = content.match(/\[apiDocs\]="(\[[^\]]+\])"/);
    const themeDocsMatch = content.match(/themeDocs="([^"]+)"/);

    // Extract docs array for sections
    const docsMatch = content.match(/docs\s*=\s*\[([\s\S]*?)\];/);
    let sections = [];

    if (docsMatch) {
        const docsContent = docsMatch[1];
        const sectionMatches = docsContent.matchAll(/{\s*id:\s*['"]([^'"]+)['"]\s*,\s*label:\s*['"]([^'"]+)['"]/g);

        for (const match of sectionMatches) {
            sections.push({
                id: match[1],
                label: match[2]
            });
        }
    }

    // Parse apiDocs array
    let apiComponents = [];
    if (apiDocsMatch) {
        try {
            apiComponents = JSON.parse(apiDocsMatch[1].replace(/'/g, '"'));
        } catch (e) {
            // Try extracting manually
            const apiMatches = apiDocsMatch[1].matchAll(/['"]([^'"]+)['"]/g);
            for (const m of apiMatches) {
                apiComponents.push(m[1]);
            }
        }
    }

    return {
        title: docTitle ?? componentName,
        header: headerMatch ? headerMatch[1] : componentName,
        description: descriptionMatch ? descriptionMatch[1] : '',
        sections,
        apiComponents,
        themeDocs: themeDocsMatch ? themeDocsMatch[1] : componentName.toLowerCase()
    };
}

/**
 * Process a component directory
 */
function processComponent(componentName, componentDir) {
    const metadata = getComponentMetadata(componentName);

    if (!metadata) {
        return null;
    }

    const component = {
        name: componentName,
        title: metadata.title,
        description: metadata.description,
        apiComponents: metadata.apiComponents,
        themeDocs: metadata.themeDocs,
        sections: []
    };

    const files = fs.readdirSync(componentDir);

    for (const file of files) {
        if (!file.endsWith('.ts') || file.endsWith('.spec.ts')) continue;

        const filePath = path.join(componentDir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) continue;

        // Extract section id from filename (e.g., "basic-doc.ts" -> "basic" or "basicdoc.ts" -> "basic")
        const sectionId = file.replace(/-?doc\.ts$/i, '').toLowerCase();
        const sectionInfo = metadata.sections.find((s) => s.id === sectionId);

        const docData = parseDocFile(filePath);

        // Sections that should use inline code from doc file instead of demos.json
        const nonDemoSections = ['accessibility', 'style'];

        // Get code examples: for non-demo sections use inline code from doc file,
        // otherwise get from demos.json
        let codeExamples;
        if (nonDemoSections.includes(sectionId)) {
            // For accessibility/style docs, only use code object defined in the doc file
            codeExamples = docData.inlineCode;
        } else {
            // For regular demo sections, get code from demos.json
            codeExamples = getCodeExamplesFromDemos(componentName, sectionId);
        }

        if (docData.description || codeExamples) {
            component.sections.push({
                id: sectionId,
                label: sectionInfo ? sectionInfo.label : sectionId.charAt(0).toUpperCase() + sectionId.slice(1),
                description: docData.description,
                examples: codeExamples
            });
        }
    }

    // Follow the order of the page; doc files the page does not list go last
    const order = (section) => {
        const index = metadata.sections.findIndex((s) => s.id === section.id);
        return index === -1 ? Number.MAX_SAFE_INTEGER : index;
    };
    component.sections.sort((a, b) => order(a) - order(b) || a.id.localeCompare(b.id));

    return component;
}

/**
 * Get all components from the docs directory
 */
function getAllComponents() {
    const entries = fs.readdirSync(DOCS_DIR);
    const components = [];

    // Directories to exclude (non-component documentation)
    const excludeDirs = [
        'apidoc',
        'common',
        'guides',
        'theming',
        'configuration',
        'contribution',
        'customicons',
        'faq',
        'philosophy',
        'designer',
        'icons',
        'introduction',
        'installation',
        'setup',
        'tailwind',
        'colors',
        'primeflex',
        'domain',
        'filterservice',
        'classnames',
        'bind',
        'forms',
        'passthrough',
        'cdn',
        'nuxt',
        'accessibility',
        'templates'
    ];

    for (const entry of entries) {
        const componentDir = path.join(DOCS_DIR, entry);
        const stat = fs.statSync(componentDir);

        if (!stat.isDirectory() || excludeDirs.includes(entry)) continue;

        // Folder names are not always lowercase (doc/Image), page folders and routes are
        const component = processComponent(entry.toLowerCase(), componentDir);
        if (component && component.sections.length > 0) {
            components.push(component);
        }
    }

    return components;
}

/**
 * Process a guide/documentation page
 */
function processGuidePage(pageConfig) {
    const docDir = path.join(DOCS_DIR, pageConfig.docPath);

    if (!fs.existsSync(docDir)) {
        console.warn(`   Warning: Doc directory not found for ${pageConfig.route}`);
        return null;
    }

    const page = {
        route: pageConfig.route,
        title: pageConfig.title,
        description: pageConfig.description,
        sections: []
    };

    // Process doc files recursively
    function processDocDir(dir, prefix = '') {
        const entries = fs.readdirSync(dir);

        for (const entry of entries) {
            const entryPath = path.join(dir, entry);
            const stat = fs.statSync(entryPath);

            if (stat.isDirectory()) {
                // Recurse into subdirectories
                processDocDir(entryPath, entry + '/');
            } else if (entry.endsWith('.ts') && !entry.endsWith('.spec.ts') && entry.toLowerCase().includes('doc')) {
                const sectionId = entry.replace(/doc\.ts$/i, '').toLowerCase();
                const docData = parseDocFile(entryPath);

                // Get code examples - priority: inline code > app-code selector > page/section naming
                let codeExamples = docData.inlineCode;
                if (!codeExamples && docData.appCodeSelector) {
                    codeExamples = getCodeExamplesBySelector(docData.appCodeSelector);
                }
                if (!codeExamples) {
                    const pageName = pageConfig.route.split('/').pop();
                    codeExamples = getCodeExamplesFromDemos(pageName, sectionId);
                }

                if (docData.description || codeExamples) {
                    // Extract label from filename - convert camelCase to title case
                    const label = sectionId
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase())
                        .trim();

                    page.sections.push({
                        id: prefix + sectionId,
                        label: label.charAt(0).toUpperCase() + label.slice(1),
                        description: docData.description,
                        examples: codeExamples
                    });
                }
            }
        }
    }

    processDocDir(docDir);

    return page;
}

/**
 * Get all guide pages
 */
function getAllGuidePages() {
    const pages = [];

    for (const pageConfig of GUIDE_PAGES) {
        const page = processGuidePage(pageConfig);
        if (page) {
            pages.push(page);
        }
    }

    return pages;
}
