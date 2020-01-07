export interface BreakpointSetting {
    name: string;
    lower: string;
    upper: string;
}

export interface BaseThemeSettings {
    basePixels?: number;
    breakpoints?: BreakpointSetting[];
    columns?: number;
    columnGutter?: number;
    colors?: { [key: string]: string | { [key: string]: string } };
    maxRowWidth?: number;
    [key: string]: any;
}

export interface BreakpointModifier {
    propName: string;
    cssProp: string;
    valTransform?: (value: any, theme: BaseThemeSettings) => string;
}

export interface PropertyBlacklist {
    prop: string | string[];
    threshold?: (value: any) => boolean;
}

export type SlopeMap = { [key: string]: number };
