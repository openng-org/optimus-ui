import type { DataTableDesignTokens, DataTableTokenSections } from '@primeuix/themes/types/datatable';

export const root: DataTableTokenSections.Root = {
    transitionDuration: '{transition.duration}'
};

export const header: DataTableTokenSections.Header = {
    background: '{content.background}',
    borderColor: '{datatable.border.color}',
    color: '{content.color}',
    borderWidth: '1px 0 1px 0',
    padding: '0.75rem 1rem',
    sm: {
        padding: '0.375rem 0.5rem'
    },
    lg: {
        padding: '1rem 1.25rem'
    }
};

export const headerCell: DataTableTokenSections.HeaderCell = {
    background: '{content.background}',
    hoverBackground: '{content.hover.background}',
    selectedBackground: '{highlight.background}',
    borderColor: '{datatable.border.color}',
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
    },
    sm: {
        padding: '0.375rem 0.5rem'
    },
    lg: {
        padding: '1rem 1.25rem'
    }
};

export const columnTitle: DataTableTokenSections.ColumnTitle = {
    fontWeight: '700'
};

export const row: DataTableTokenSections.Row = {
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

export const bodyCell: DataTableTokenSections.BodyCell = {
    borderColor: '{datatable.border.color}',
    padding: '0.75rem 1rem',
    sm: {
        padding: '0.375rem 0.5rem'
    },
    lg: {
        padding: '1rem 1.25rem'
    }
};

export const footerCell: DataTableTokenSections.FooterCell = {
    background: '{content.background}',
    borderColor: '{datatable.border.color}',
    color: '{content.color}',
    padding: '0.75rem 1rem',
    sm: {
        padding: '0.375rem 0.5rem'
    },
    lg: {
        padding: '1rem 1.25rem'
    }
};

export const columnFooter: DataTableTokenSections.ColumnFooter = {
    fontWeight: '700'
};

export const footer: DataTableTokenSections.Footer = {
    background: '{content.background}',
    borderColor: '{datatable.border.color}',
    color: '{content.color}',
    borderWidth: '0 0 1px 0',
    padding: '0.75rem 1rem',
    sm: {
        padding: '0.375rem 0.5rem'
    },
    lg: {
        padding: '1rem 1.25rem'
    }
};

export const dropPoint: DataTableTokenSections.DropPoint = {
    color: '{primary.color}'
};

export const columnResizer: DataTableTokenSections.ColumnResizer = {
    width: '0.5rem'
};

export const resizeIndicator: DataTableTokenSections.ResizeIndicator = {
    width: '1px',
    color: '{primary.color}'
};

export const sortIcon: DataTableTokenSections.SortIcon = {
    color: '{text.muted.color}',
    hoverColor: '{text.hover.muted.color}',
    size: '0.875rem'
};

export const loadingIcon: DataTableTokenSections.LoadingIcon = {
    size: '2rem'
};

export const rowToggleButton: DataTableTokenSections.RowToggleButton = {
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

export const filter: DataTableTokenSections.Filter = {
    inlineGap: '0.5rem',
    overlaySelect: {
        background: '{overlay.select.background}',
        borderColor: '{overlay.select.border.color}',
        borderRadius: '{overlay.select.border.radius}',
        color: '{overlay.select.color}',
        shadow: '{overlay.select.shadow}'
    },
    overlayPopover: {
        background: '{overlay.popover.background}',
        borderColor: '{overlay.popover.border.color}',
        borderRadius: '{overlay.popover.border.radius}',
        color: '{overlay.popover.color}',
        shadow: '{overlay.popover.shadow}',
        padding: '{overlay.popover.padding}',
        gap: '0.5rem'
    },
    rule: {
        borderColor: '{content.border.color}'
    },
    constraintList: {
        padding: '{list.padding}',
        gap: '{list.gap}'
    },
    constraint: {
        focusBackground: '{list.option.focus.background}',
        selectedBackground: '{list.option.selected.background}',
        selectedFocusBackground: '{list.option.selected.focus.background}',
        color: '{list.option.color}',
        focusColor: '{list.option.focus.color}',
        selectedColor: '{list.option.selected.color}',
        selectedFocusColor: '{list.option.selected.focus.color}',
        separator: {
            borderColor: '{content.border.color}'
        },
        padding: '{list.option.padding}',
        borderRadius: '{list.option.border.radius}'
    }
};

export const paginatorTop: DataTableTokenSections.PaginatorTop = {
    borderColor: '{datatable.border.color}',
    borderWidth: '0 0 1px 0'
};

export const paginatorBottom: DataTableTokenSections.PaginatorBottom = {
    borderColor: '{datatable.border.color}',
    borderWidth: '0 0 1px 0'
};

export const colorScheme: DataTableTokenSections.ColorScheme = {
    light: {
        root: {
            borderColor: '{surface.300}'
        },
        row: {
            stripedBackground: '{surface.50}'
        },
        bodyCell: {
            selectedBorderColor: '{primary.100}'
        }
    },
    dark: {
        root: {
            borderColor: '{surface.600}'
        },
        row: {
            stripedBackground: '{surface.950}'
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
    dropPoint,
    columnResizer,
    resizeIndicator,
    sortIcon,
    loadingIcon,
    rowToggleButton,
    filter,
    paginatorTop,
    paginatorBottom,
    colorScheme
} satisfies DataTableDesignTokens;
