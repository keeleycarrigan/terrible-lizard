export interface HolderObject {
    [ key: string ]: any;
}

export type StringOrNumber = string|number;

export type StringOrNumberCompare = (val: StringOrNumber) => boolean;

export type GlobalWindow = HolderObject & Window;

export const GLOBAL_WINDOW: GlobalWindow = window;
