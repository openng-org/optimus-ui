export * from './actions/index';
export { default as Theme } from './config/index';
export * from './helpers/index';
export { default as ThemeService } from './service/index';
export * from './stylesheet/index';
export { default as StyleSheet } from './stylesheet/index';
export * from './utils/index';

export interface ThemeOptions {
    /**
     * The prefix for the theme
     * @default 'p'
     */
    prefix?: string;
    /**
     * Dark mode selector
     * @default 'system'
     */
    darkModeSelector?: string;
    /**
     * Whether to use the css layer
     * @default false
     */
    cssLayer?: boolean | { name?: string; order?: string };
}

export interface StyleOptions {
    dt: (key: string, fallback?: string | number | Pick<StyleOptions, 'dt'>) => string | number | undefined;
}

export declare type StyleType<T = StyleOptions> = string | ((options?: T) => string);

export type ColorScale = {
    0?: string;
    50?: string;
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
    950?: string;
};
