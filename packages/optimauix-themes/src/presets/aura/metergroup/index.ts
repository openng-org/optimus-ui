import type { MeterGroupDesignTokens, MeterGroupTokenSections } from '@primeuix/themes/types/metergroup';

export const root: MeterGroupTokenSections.Root = {
    borderRadius: '{content.border.radius}',
    gap: '1rem'
};

export const meters: MeterGroupTokenSections.Meters = {
    background: '{content.border.color}',
    size: '0.5rem'
};

export const label: MeterGroupTokenSections.Label = {
    gap: '0.5rem'
};

export const labelMarker: MeterGroupTokenSections.LabelMarker = {
    size: '0.5rem'
};

export const labelIcon: MeterGroupTokenSections.LabelIcon = {
    size: '1rem'
};

export const labelList: MeterGroupTokenSections.LabelList = {
    verticalGap: '0.5rem',
    horizontalGap: '1rem'
};

export default {
    root,
    meters,
    label,
    labelMarker,
    labelIcon,
    labelList
} satisfies MeterGroupDesignTokens;
