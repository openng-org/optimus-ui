import type { ProgressSpinnerDesignTokens, ProgressSpinnerTokenSections } from '@primeuix/themes/types/progressspinner';

export const colorScheme: ProgressSpinnerTokenSections.ColorScheme = {
    light: {
        root: {
            colorOne: '{red.500}',
            colorTwo: '{blue.500}',
            colorThree: '{green.500}',
            colorFour: '{yellow.500}'
        }
    },
    dark: {
        root: {
            colorOne: '{red.400}',
            colorTwo: '{blue.400}',
            colorThree: '{green.400}',
            colorFour: '{yellow.400}'
        }
    }
};

export default {
    colorScheme
} satisfies ProgressSpinnerDesignTokens;
