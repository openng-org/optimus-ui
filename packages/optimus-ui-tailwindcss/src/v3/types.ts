export {};

declare type AnimationDelayKeys = 0 | 75 | 100 | 150 | 200 | 300 | 500 | 700 | 1000 | string;
declare type AnimationDurationKeys = 0 | 75 | 100 | 150 | 200 | 300 | 400 | 500 | 700 | 1000 | 2000 | 3000 | string;
declare type AnimationKeys =
    | 'fadein'
    | 'fadeout'
    | 'slidedown'
    | 'slideup'
    | 'scalein'
    | 'fadeinleft'
    | 'fadeoutleft'
    | 'fadeinright'
    | 'fadeoutright'
    | 'fadeinup'
    | 'fadeoutup'
    | 'fadeindown'
    | 'fadeoutdown'
    | 'width'
    | 'flip'
    | 'flipup'
    | 'flipleft'
    | 'flipright'
    | 'zoomin'
    | 'zoomindown'
    | 'zoominleft'
    | 'zoominright'
    | 'zoominup'
    | string;

declare module 'tailwindcss/types/config' {
    interface ThemeConfig {
        colors: ResolvableTo<RecursiveKeyValuePair>;
        keyframes: ResolvableTo<KeyValuePair<string, KeyValuePair<string, KeyValuePair>>>;
        animation: ResolvableTo<KeyValuePair<AnimationKeys>>;
        animationDelay: ResolvableTo<KeyValuePair<AnimationDelayKeys>>;
        animationDuration: ResolvableTo<KeyValuePair<AnimationDurationKeys>>;
        animationOpacity?: ThemeConfig['opacity'];
        animationTranslate?: ThemeConfig['spacing'];
        animationScale?: ResolvableTo<KeyValuePair>;
        animationRotate?: ResolvableTo<KeyValuePair>;
    }
}
