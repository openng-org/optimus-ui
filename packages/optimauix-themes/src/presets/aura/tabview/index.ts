import type { TabViewDesignTokens, TabViewTokenSections } from '@primeuix/themes/types/tabview';

export const root: TabViewTokenSections.Root = {
    transitionDuration: '{transition.duration}'
};

export const tabList: TabViewTokenSections.TabList = {
    background: '{content.background}',
    borderColor: '{content.border.color}'
};

export const tab: TabViewTokenSections.Tab = {
    borderColor: '{content.border.color}',
    activeBorderColor: '{primary.color}',
    color: '{text.muted.color}',
    hoverColor: '{text.color}',
    activeColor: '{primary.color}'
};

export const tabPanel: TabViewTokenSections.TabPanel = {
    background: '{content.background}',
    color: '{content.color}'
};

export const navButton: TabViewTokenSections.NavButton = {
    background: '{content.background}',
    color: '{text.muted.color}',
    hoverColor: '{text.color}'
};

export const colorScheme: TabViewTokenSections.ColorScheme = {
    light: {
        navButton: {
            shadow: '0px 0px 10px 50px rgba(255, 255, 255, 0.6)'
        }
    },
    dark: {
        navButton: {
            shadow: '0px 0px 10px 50px color-mix(in srgb, {content.background}, transparent 50%)'
        }
    }
};

export default {
    root,
    tabList,
    tab,
    tabPanel,
    navButton,
    colorScheme
} satisfies TabViewDesignTokens;
