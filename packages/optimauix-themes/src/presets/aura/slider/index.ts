import type { SliderDesignTokens, SliderTokenSections } from '@primeuix/themes/types/slider';

export const root: SliderTokenSections.Root = {
    transitionDuration: '{transition.duration}'
};

export const track: SliderTokenSections.Track = {
    background: '{content.border.color}',
    borderRadius: '{content.border.radius}',
    size: '3px'
};

export const range: SliderTokenSections.Range = {
    background: '{primary.color}'
};

export const handle: SliderTokenSections.Handle = {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '{content.border.color}',
    hoverBackground: '{content.border.color}',
    content: {
        borderRadius: '50%',
        hoverBackground: '{content.background}',
        width: '16px',
        height: '16px',
        shadow: '0px 0.5px 0px 0px rgba(0, 0, 0, 0.08), 0px 1px 1px 0px rgba(0, 0, 0, 0.14)'
    },
    focusRing: {
        width: '{focus.ring.width}',
        style: '{focus.ring.style}',
        color: '{focus.ring.color}',
        offset: '{focus.ring.offset}',
        shadow: '{focus.ring.shadow}'
    }
};

export const colorScheme: SliderTokenSections.ColorScheme = {
    light: {
        handle: {
            content: {
                background: '{surface.0}'
            }
        }
    },
    dark: {
        handle: {
            content: {
                background: '{surface.950}'
            }
        }
    }
};

export default {
    root,
    track,
    range,
    handle,
    colorScheme
} satisfies SliderDesignTokens;
