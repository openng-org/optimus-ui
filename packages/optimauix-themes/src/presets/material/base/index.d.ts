/**
 *
 * Material Base Tokens
 *
 * @module base
 *
 */
import type { ColorScale } from '@primeuix/styled';

/**
 * Design Token Sections
 */
export declare namespace MaterialBaseTokenSections {
    interface Primitive {
        borderRadius?: {
            none?: string;
            xs?: string;
            sm?: string;
            md?: string;
            lg?: string;
            xl?: string;
        };
        emerald?: ColorScale;
        green?: ColorScale;
        lime?: ColorScale;
        red?: ColorScale;
        orange?: ColorScale;
        amber?: ColorScale;
        yellow?: ColorScale;
        teal?: ColorScale;
        cyan?: ColorScale;
        sky?: ColorScale;
        blue?: ColorScale;
        indigo?: ColorScale;
        violet?: ColorScale;
        purple?: ColorScale;
        fuchsia?: ColorScale;
        pink?: ColorScale;
        rose?: ColorScale;
        slate?: ColorScale;
        gray?: ColorScale;
        zinc?: ColorScale;
        neutral?: ColorScale;
        stone?: ColorScale;
    }

    interface Semantic {
        transitionDuration?: string;
        focusRing?: {
            width?: string;
            style?: string;
            color?: string;
            offset?: string;
        };
        disabledOpacity?: string;
        iconSize?: string;
        anchorGutter?: string;
        primary?: ColorScale;
        formField?: {
            paddingX?: string;
            paddingY?: string;
            sm?: {
                fontSize?: string;
                paddingX?: string;
                paddingY?: string;
            };
            lg?: {
                fontSize?: string;
                paddingX?: string;
                paddingY?: string;
            };
            borderRadius?: string;
            focusRing?: {
                width?: string;
                style?: string;
                color?: string;
                offset?: string;
                shadow?: string;
            };
            transitionDuration?: string;
        };
        list?: {
            padding?: string;
            gap?: string;
            header?: {
                padding?: string;
            };
            option?: {
                padding?: string;
                borderRadius?: string;
            };
            optionGroup?: {
                padding?: string;
                fontWeight?: string;
            };
        };
        content?: {
            borderRadius?: string;
        };
        mask?: {
            transitionDuration?: string;
        };
        navigation?: {
            list?: {
                padding?: string;
                gap?: string;
            };
            item?: {
                padding?: string;
                borderRadius?: string;
                gap?: string;
            };
            submenuLabel?: {
                padding?: string;
                fontWeight?: string;
            };
            submenuIcon?: {
                size?: string;
            };
        };
        overlay?: {
            select?: {
                borderRadius?: string;
                shadow?: string;
            };
            popover?: {
                borderRadius?: string;
                padding?: string;
                shadow?: string;
            };
            modal?: {
                borderRadius?: string;
                padding?: string;
                shadow?: string;
            };
            navigation?: {
                shadow?: string;
            };
        };
        colorScheme?: {
            light?: {
                focusRing?: {
                    shadow?: string;
                };
                surface?: ColorScale;
                primary?: {
                    color?: string;
                    contrastColor?: string;
                    hoverColor?: string;
                    activeColor?: string;
                };
                highlight?: {
                    background?: string;
                    focusBackground?: string;
                    color?: string;
                    focusColor?: string;
                };
                mask?: {
                    background?: string;
                    color?: string;
                };
                formField?: {
                    background?: string;
                    disabledBackground?: string;
                    filledBackground?: string;
                    filledHoverBackground?: string;
                    filledFocusBackground?: string;
                    borderColor?: string;
                    hoverBorderColor?: string;
                    focusBorderColor?: string;
                    invalidBorderColor?: string;
                    color?: string;
                    disabledColor?: string;
                    placeholderColor?: string;
                    invalidPlaceholderColor?: string;
                    floatLabelColor?: string;
                    floatLabelFocusColor?: string;
                    floatLabelActiveColor?: string;
                    floatLabelInvalidColor?: string;
                    iconColor?: string;
                    shadow?: string;
                };
                text?: {
                    color?: string;
                    hoverColor?: string;
                    mutedColor?: string;
                    hoverMutedColor?: string;
                };
                content?: {
                    background?: string;
                    hoverBackground?: string;
                    borderColor?: string;
                    color?: string;
                    hoverColor?: string;
                };
                overlay?: {
                    select?: {
                        background?: string;
                        borderColor?: string;
                        color?: string;
                    };
                    popover?: {
                        background?: string;
                        borderColor?: string;
                        color?: string;
                    };
                    modal?: {
                        background?: string;
                        borderColor?: string;
                        color?: string;
                    };
                };
                list?: {
                    option?: {
                        focusBackground?: string;
                        selectedBackground?: string;
                        selectedFocusBackground?: string;
                        color?: string;
                        focusColor?: string;
                        selectedColor?: string;
                        selectedFocusColor?: string;
                        icon?: {
                            color?: string;
                            focusColor?: string;
                        };
                    };
                    optionGroup?: {
                        background?: string;
                        color?: string;
                    };
                };
                navigation?: {
                    item?: {
                        focusBackground?: string;
                        activeBackground?: string;
                        color?: string;
                        focusColor?: string;
                        activeColor?: string;
                        icon?: {
                            color?: string;
                            focusColor?: string;
                            activeColor?: string;
                        };
                    };
                    submenuLabel?: {
                        background?: string;
                        color?: string;
                    };
                    submenuIcon?: {
                        color?: string;
                        focusColor?: string;
                        activeColor?: string;
                    };
                };
            };
            dark?: {
                focusRing?: {
                    shadow?: string;
                };
                surface?: ColorScale;
                primary?: {
                    color?: string;
                    contrastColor?: string;
                    hoverColor?: string;
                    activeColor?: string;
                };
                highlight?: {
                    background?: string;
                    focusBackground?: string;
                    color?: string;
                    focusColor?: string;
                };
                mask?: {
                    background?: string;
                    color?: string;
                };
                formField?: {
                    background?: string;
                    disabledBackground?: string;
                    filledBackground?: string;
                    filledHoverBackground?: string;
                    filledFocusBackground?: string;
                    borderColor?: string;
                    hoverBorderColor?: string;
                    focusBorderColor?: string;
                    invalidBorderColor?: string;
                    color?: string;
                    disabledColor?: string;
                    placeholderColor?: string;
                    invalidPlaceholderColor?: string;
                    floatLabelColor?: string;
                    floatLabelFocusColor?: string;
                    floatLabelActiveColor?: string;
                    floatLabelInvalidColor?: string;
                    iconColor?: string;
                    shadow?: string;
                };
                text?: {
                    color?: string;
                    hoverColor?: string;
                    mutedColor?: string;
                    hoverMutedColor?: string;
                };
                content?: {
                    background?: string;
                    hoverBackground?: string;
                    borderColor?: string;
                    color?: string;
                    hoverColor?: string;
                };
                overlay?: {
                    select?: {
                        background?: string;
                        borderColor?: string;
                        color?: string;
                    };
                    popover?: {
                        background?: string;
                        borderColor?: string;
                        color?: string;
                    };
                    modal?: {
                        background?: string;
                        borderColor?: string;
                        color?: string;
                    };
                };
                list?: {
                    option?: {
                        focusBackground?: string;
                        selectedBackground?: string;
                        selectedFocusBackground?: string;
                        color?: string;
                        focusColor?: string;
                        selectedColor?: string;
                        selectedFocusColor?: string;
                        icon?: {
                            color?: string;
                            focusColor?: string;
                        };
                    };
                    optionGroup?: {
                        background?: string;
                        color?: string;
                    };
                };
                navigation?: {
                    item?: {
                        focusBackground?: string;
                        activeBackground?: string;
                        color?: string;
                        focusColor?: string;
                        activeColor?: string;
                        icon?: {
                            color?: string;
                            focusColor?: string;
                            activeColor?: string;
                        };
                    };
                    submenuLabel?: {
                        background?: string;
                        color?: string;
                    };
                    submenuIcon?: {
                        color?: string;
                        focusColor?: string;
                        activeColor?: string;
                    };
                };
            };
        };
    }
}

/**
 *
 * _Material Base Tokens_
 *
 * @group presets/material
 * @module base
 * @see
 * --- ---
 * **Compatible Libraries**
 *
 * [![PrimeNG](https://i.postimg.cc/63f7jVST/primeng-icon-24.png)](https://primeng.org/theming/styled)
 * [![PrimeVue](https://i.postimg.cc/cC1vVgyh/primevue-icon-24.png)](https://primevue.org/theming/styled)
 * --- ---
 * **Figma UI Kit**
 *
 * [PrimeNG](https://primeng.org/uikit) | [PrimeVue](https://primevue.org/uikit)
 *
 */
export interface MaterialBaseDesignTokens {
    primitive?: MaterialBaseTokenSections.Primitive;
    semantic?: MaterialBaseTokenSections.Semantic;
}

declare const primitive: MaterialBaseTokenSections.Primitive;
declare const semantic: MaterialBaseTokenSections.Semantic;
declare const _default: {
    primitive: MaterialBaseTokenSections.Primitive;
    semantic: MaterialBaseTokenSections.Semantic;
};

export { _default as default, primitive, semantic };
