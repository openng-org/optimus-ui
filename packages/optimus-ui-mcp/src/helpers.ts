/**
 * @primeuix/mcp - Shared helper functions for PrimeVue and PrimeNG MCP servers
 */

import type { Component, ComponentsData, Page, PrimeMcpConfig } from './types.js';

/**
 * Find a component by name (case-insensitive)
 */
export function findComponent(data: ComponentsData, name: string): Component {
    const component = data.components.find((c) => c.name.toLowerCase() === name.toLowerCase());

    if (!component) {
        throw new Error(`Component "${name}" not found`);
    }

    return component;
}

/**
 * Extract category from component name using heuristics
 */
export function extractCategory(component: Component): string {
    const name = component.name.toLowerCase();

    if (
        name.includes('table') ||
        name.includes('tree') ||
        name.includes('list') ||
        name.includes('paginator') ||
        name.includes('virtualscroller') ||
        name.includes('timeline') ||
        name.includes('orderlist') ||
        name.includes('picklist') ||
        name.includes('organizationchart') ||
        name.includes('scroller')
    ) {
        return 'Data';
    }

    if (name.includes('button') || name.includes('speed') || name.includes('splitbutton')) {
        return 'Button';
    }

    if (
        name.includes('input') ||
        name.includes('select') ||
        name.includes('dropdown') ||
        name.includes('autocomplete') ||
        name.includes('calendar') ||
        name.includes('checkbox') ||
        name.includes('radio') ||
        name.includes('slider') ||
        name.includes('rating') ||
        name.includes('toggle') ||
        name.includes('editor') ||
        name.includes('colorpicker') ||
        name.includes('password') ||
        name.includes('textarea') ||
        name.includes('chips') ||
        name.includes('knob') ||
        name.includes('listbox') ||
        name.includes('multiselect') ||
        name.includes('treeselect') ||
        name.includes('cascadeselect') ||
        name.includes('mention') ||
        name.includes('datepicker') ||
        name.includes('keyfilter') ||
        name.includes('fluid') ||
        name.includes('iftalabel') ||
        name.includes('floatlabel') ||
        name.includes('iconfield')
    ) {
        return 'Form';
    }

    if (
        name.includes('menu') ||
        name.includes('breadcrumb') ||
        name.includes('contextmenu') ||
        name.includes('dock') ||
        name.includes('megamenu') ||
        name.includes('panelmenu') ||
        name.includes('steps') ||
        name.includes('tabmenu') ||
        name.includes('tieredmenu')
    ) {
        return 'Menu';
    }

    if (
        name.includes('dialog') ||
        name.includes('overlay') ||
        name.includes('sidebar') ||
        name.includes('tooltip') ||
        name.includes('popover') ||
        name.includes('drawer') ||
        name.includes('confirmpopup') ||
        name.includes('confirmdialog') ||
        name.includes('dynamicdialog')
    ) {
        return 'Overlay';
    }

    if (
        name.includes('panel') ||
        name.includes('accordion') ||
        name.includes('card') ||
        name.includes('fieldset') ||
        name.includes('divider') ||
        name.includes('splitter') ||
        name.includes('scrollpanel') ||
        name.includes('tab') ||
        name.includes('toolbar') ||
        name.includes('stepper')
    ) {
        return 'Panel';
    }

    if (name.includes('upload') || name.includes('file')) {
        return 'File';
    }

    if (name.includes('chart')) {
        return 'Chart';
    }

    if (name.includes('message') || name.includes('toast') || name.includes('inlinemessage')) {
        return 'Messages';
    }

    if (name.includes('carousel') || name.includes('galleria') || name.includes('image')) {
        return 'Media';
    }

    if (name.includes('animate') || name.includes('ripple') || name.includes('styleclass') || name.includes('autofocus') || name.includes('focustrap')) {
        return 'Misc';
    }

    return 'Misc';
}

/**
 * Find a guide/page by name (case-insensitive)
 */
export function findGuide(data: ComponentsData, name: string): Page {
    if (!data.pages) {
        throw new Error('No guides available in the data');
    }

    const page = data.pages.find((p) => p.name.toLowerCase() === name.toLowerCase());

    if (!page) {
        const availableGuides = data.pages.map((p) => p.name).join(', ');

        throw new Error(`Guide "${name}" not found. Available guides: ${availableGuides}`);
    }

    return page;
}

/**
 * Get formatted guide content, optionally for a specific section
 */
export function getGuideContent(data: ComponentsData, config: PrimeMcpConfig, guideName: string, sectionId?: string): string {
    const guide = findGuide(data, guideName);

    if (sectionId) {
        const section = guide.sections.find((s) => s.id.toLowerCase() === sectionId.toLowerCase());

        if (!section) {
            const availableSections = guide.sections.map((s) => s.id).join(', ');

            return `Section "${sectionId}" not found in guide "${guideName}". Available sections: ${availableSections}`;
        }

        let content = `# ${guide.title} - ${section.label}\n\n`;

        content += `${section.description}\n\n`;

        if (section.examples) {
            Object.entries(section.examples).forEach(([variant, code]) => {
                if (variant !== 'basic') {
                    content += `### ${variant}\n`;
                }

                content += `\`\`\`${config.codeLanguage}\n${code}\n\`\`\`\n\n`;
            });
        }

        content += `**Full documentation:** ${config.baseUrl}/${guide.path}`;

        return content;
    }

    let content = `# ${guide.title}\n\n${guide.description}\n\n`;

    content += `**Documentation:** ${config.baseUrl}/${guide.path}\n\n`;
    content += `## Sections\n\n`;

    guide.sections.forEach((section) => {
        content += `### ${section.label}\n\n`;
        content += `${section.description}\n\n`;

        if (section.examples) {
            Object.entries(section.examples).forEach(([variant, code]) => {
                if (variant !== 'basic') {
                    content += `#### ${variant}\n`;
                }

                content += `\`\`\`${config.codeLanguage}\n${code}\n\`\`\`\n\n`;
            });
        }
    });

    return content;
}

/**
 * Get slots/templates from component API based on framework
 */
export function getSlotsOrTemplates(component: Component, slotKey: 'slots' | 'templates') {
    return slotKey === 'slots' ? component.api.slots : component.api.templates;
}

/**
 * Get slot/template count from component API based on framework
 */
export function getSlotsOrTemplatesCount(component: Component, slotKey: 'slots' | 'templates'): number {
    const data = getSlotsOrTemplates(component, slotKey);

    return data?.length || 0;
}

/**
 * Default keyword mapping for component suggestions
 * Can be extended by framework-specific implementations
 */
export const DEFAULT_KEYWORD_MAPPING: Record<string, string[]> = {
    table: ['datatable', 'treetable', 'table'],
    grid: ['datatable', 'dataview', 'table'],
    list: ['listbox', 'orderlist', 'picklist', 'dataview', 'virtualscroller'],
    tree: ['tree', 'treetable', 'treeselect', 'organizationchart'],
    form: ['inputtext', 'inputnumber', 'textarea', 'checkbox', 'radiobutton', 'select', 'multiselect'],
    input: ['inputtext', 'inputnumber', 'inputmask', 'inputotp', 'textarea', 'password'],
    select: ['select', 'multiselect', 'listbox', 'cascadeselect', 'treeselect'],
    dropdown: ['select', 'multiselect', 'cascadeselect'],
    date: ['datepicker'],
    calendar: ['datepicker'],
    time: ['datepicker'],
    file: ['fileupload'],
    upload: ['fileupload'],
    image: ['image', 'galleria', 'imagecompare'],
    gallery: ['galleria', 'carousel'],
    slider: ['slider', 'carousel'],
    dialog: ['dialog', 'confirmdialog', 'dynamicdialog'],
    modal: ['dialog', 'drawer'],
    popup: ['popover', 'confirmpopup', 'tooltip'],
    drawer: ['drawer'],
    sidebar: ['drawer'],
    menu: ['menu', 'menubar', 'megamenu', 'tieredmenu', 'contextmenu', 'panelmenu', 'dock', 'speeddial'],
    navigation: ['menubar', 'breadcrumb', 'tabs', 'stepper'],
    tab: ['tabs'],
    step: ['stepper'],
    wizard: ['stepper'],
    accordion: ['accordion'],
    collapse: ['accordion', 'panel', 'fieldset'],
    panel: ['panel', 'fieldset', 'card', 'splitter'],
    card: ['card'],
    button: ['button', 'splitbutton', 'speeddial', 'togglebutton'],
    toggle: ['toggleswitch', 'togglebutton', 'checkbox'],
    switch: ['toggleswitch'],
    checkbox: ['checkbox'],
    radio: ['radiobutton', 'selectbutton'],
    rating: ['rating'],
    star: ['rating'],
    progress: ['progressbar', 'progressspinner'],
    loading: ['progressspinner', 'skeleton', 'blockui'],
    skeleton: ['skeleton'],
    toast: ['toast'],
    notification: ['toast', 'message'],
    message: ['message', 'toast'],
    alert: ['message'],
    badge: ['badge', 'tag'],
    tag: ['tag', 'chip'],
    chip: ['chip'],
    avatar: ['avatar'],
    tooltip: ['tooltip'],
    editor: ['editor'],
    rich: ['editor'],
    text: ['inputtext', 'textarea', 'editor'],
    color: ['colorpicker'],
    chart: ['chart'],
    graph: ['chart', 'organizationchart'],
    terminal: ['terminal'],
    scroll: ['scrollpanel', 'scrolltop', 'virtualscroller'],
    virtual: ['virtualscroller'],
    lazy: ['table', 'tree', 'virtualscroller', 'datatable'],
    filter: ['table', 'listbox', 'select', 'multiselect', 'tree', 'datatable'],
    sort: ['table', 'orderlist', 'datatable'],
    paginate: ['table', 'paginator', 'dataview', 'datatable'],
    pagination: ['table', 'paginator', 'dataview', 'datatable'],
    drag: ['orderlist', 'picklist', 'table', 'datatable'],
    reorder: ['orderlist', 'table', 'datatable'],
    expand: ['table', 'treetable', 'accordion', 'panel', 'datatable'],
    timeline: ['timeline'],
    divider: ['divider'],
    splitter: ['splitter'],
    knob: ['knob'],
    meter: ['metergroup']
};

/**
 * Form component names (shared between frameworks)
 */
export const FORM_COMPONENT_NAMES = [
    'autocomplete',
    'cascadeselect',
    'checkbox',
    'colorpicker',
    'datepicker',
    'editor',
    'inputmask',
    'inputnumber',
    'inputotp',
    'inputtext',
    'knob',
    'listbox',
    'multiselect',
    'password',
    'radiobutton',
    'rating',
    'select',
    'slider',
    'textarea',
    'togglebutton',
    'toggleswitch',
    'treeselect',
    'selectbutton',
    'inputgroup',
    'floatlabel',
    'iftalabel',
    'iconfield',
    'keyfilter',
    'fluid'
];

/**
 * Data component names (shared between frameworks)
 */
export const DATA_COMPONENT_NAMES = ['table', 'datatable', 'dataview', 'orderlist', 'organizationchart', 'paginator', 'picklist', 'timeline', 'tree', 'treetable', 'virtualscroller', 'scroller'];

/**
 * Overlay component names (shared between frameworks)
 */
export const OVERLAY_COMPONENT_NAMES = ['confirmdialog', 'confirmpopup', 'dialog', 'drawer', 'dynamicdialog', 'popover', 'tooltip'];
