import type { TreeTableDesignTokens, TreeTableTokenSections } from '@primeuix/themes/types/treetable';

export const root: TreeTableTokenSections.Root = {
    transitionDuration: '{transition.duration}'
};

export const header: TreeTableTokenSections.Header = {
    background: '{content.background}',
    borderColor: '{treetable.border.color}',
    color: '{content.color}',
    borderWidth: '1px 0 1px 0',
    padding: '0.75rem 1rem'
};

export const headerCell: TreeTableTokenSections.HeaderCell = {
    background: '{content.background}',
    hoverBackground: '{content.hover.background}',
    selectedBackground: '{highlight.background}',
    borderColor: '{treetable.border.color}',
    color: '{content.color}',
    hoverColor: '{content.hover.color}',
    selectedColor: '{highlight.color}',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '-1px',
        shadow: '{focus.ring.shadow}'
    }
};

export const columnTitle: TreeTableTokenSections.ColumnTitle = {
    fontWeight: '700'
};

export const row: TreeTableTokenSections.Row = {
    background: '{content.background}',
    hoverBackground: '{content.hover.background}',
    selectedBackground: '{highlight.background}',
    color: '{content.color}',
    hoverColor: '{content.hover.color}',
    selectedColor: '{highlight.color}',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '-1px',
        shadow: '{focus.ring.shadow}'
    }
};

export const bodyCell: TreeTableTokenSections.BodyCell = {
    borderColor: '{treetable.border.color}',
    padding: '0.75rem 1rem',
    gap: '0.5rem'
};

export const footerCell: TreeTableTokenSections.FooterCell = {
    background: '{content.background}',
    borderColor: '{treetable.border.color}',
    color: '{content.color}',
    padding: '0.75rem 1rem'
};

export const columnFooter: TreeTableTokenSections.ColumnFooter = {
    fontWeight: '700'
};

export const footer: TreeTableTokenSections.Footer = {
    background: '{content.background}',
    borderColor: '{treetable.border.color}',
    color: '{content.color}',
    borderWidth: '0 0 1px 0',
    padding: '0.75rem 1rem'
};

export const columnResizer: TreeTableTokenSections.ColumnResizer = {
    width: '0.5rem'
};

export const resizeIndicator: TreeTableTokenSections.ResizeIndicator = {
    width: '1px',
    color: '{primary.color}'
};

export const sortIcon: TreeTableTokenSections.SortIcon = {
    color: '{text.muted.color}',
    hoverColor: '{text.hover.muted.color}',
    size: '0.875rem'
};

export const loadingIcon: TreeTableTokenSections.LoadingIcon = {
    size: '2rem'
};

export const nodeToggleButton: TreeTableTokenSections.NodeToggleButton = {
    hoverBackground: '{content.hover.background}',
    selectedHoverBackground: '{content.background}',
    color: '{text.muted.color}',
    hoverColor: '{text.color}',
    selectedHoverColor: '{primary.color}',
    size: '1.75rem',
    borderRadius: '50%',
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const paginatorTop: TreeTableTokenSections.PaginatorTop = {
    borderColor: '{content.border.color}',
    borderWidth: '0 0 1px 0'
};

export const paginatorBottom: TreeTableTokenSections.PaginatorBottom = {
    borderColor: '{content.border.color}',
    borderWidth: '0 0 1px 0'
};

export const colorScheme: TreeTableTokenSections.ColorScheme = {
    light: {
        root: {
            borderColor: '{surface.300}'
        },
        bodyCell: {
            selectedBorderColor: '{primary.100}'
        }
    },
    dark: {
        root: {
            borderColor: '{surface.600}'
        },
        bodyCell: {
            selectedBorderColor: '{primary.900}'
        }
    }
};

export default {
    root,
    header,
    headerCell,
    columnTitle,
    row,
    bodyCell,
    footerCell,
    columnFooter,
    footer,
    columnResizer,
    resizeIndicator,
    sortIcon,
    loadingIcon,
    nodeToggleButton,
    paginatorTop,
    paginatorBottom,
    colorScheme
} satisfies TreeTableDesignTokens;
