import type { AvatarDesignTokens, AvatarTokenSections } from '@primeuix/themes/types/avatar';

export const root: AvatarTokenSections.Root = {
    width: '2rem',
    height: '2rem',
    fontSize: '1rem',
    background: '{content.border.color}',
    color: '{content.color}',
    borderRadius: '{content.border.radius}'
};

export const icon: AvatarTokenSections.Icon = {
    size: '1rem'
};

export const group: AvatarTokenSections.Group = {
    borderColor: '{content.background}',
    offset: '-0.75rem'
};

export const lg: AvatarTokenSections.Lg = {
    width: '3rem',
    height: '3rem',
    fontSize: '1.5rem',
    icon: {
        size: '1.5rem'
    },
    group: {
        offset: '-1rem'
    }
};

export const xl: AvatarTokenSections.Xl = {
    width: '4rem',
    height: '4rem',
    fontSize: '2rem',
    icon: {
        size: '2rem'
    },
    group: {
        offset: '-1.5rem'
    }
};

export default {
    root,
    icon,
    group,
    lg,
    xl
} satisfies AvatarDesignTokens;
