import _get from 'lodash/get';
import _map from 'lodash/map';
import _reduce from 'lodash/reduce';

import {
    BreakpointSetting,
    SlopeMap,
} from '../types';
import baseSettings from '../settings';
import { getBreakpoint } from './index';

const calculateRem = (value: number, basePixels: number = 16) => `${value / basePixels}rem`;

const createSlopeValueMap = (slopeMap: SlopeMap, breakpoints: BreakpointSetting[]): { [key: string]: number } => (
    _reduce(slopeMap, (allMapVals, mapVal, mapKey) => {
        const bpRange: string[] = mapKey.split('-');
        const valueKey: string = getBreakpoint(bpRange[0], bpRange[1], breakpoints);
        const clonedMapVals: { [key: string]: number } = { ...allMapVals };
        if (valueKey) {
            clonedMapVals[valueKey] = mapVal;
        }
        return clonedMapVals;
    }, {})
);

export const rems = (pixelVals: number | number[], basePixels: number = 16) => {
    if (Array.isArray(pixelVals)) {
        return pixelVals.reduce((remVals, val) => {
            let allRemVals = remVals;
            
            allRemVals += `${calculateRem(val, basePixels)} `;
            return allRemVals;
        }, '');
    }
    
    return calculateRem(pixelVals, basePixels);
};
        
export const themeRems = (pixelVals: number) => (props: object) => {
    const basePixels = _get(props, 'theme.basePixels') || _get(baseSettings, 'basePixels', 16);
    
    return rems(pixelVals, basePixels);
};
        
export const linearInterpolation = (propMap: { [key: string]: number }): string => {
    const mapKeys = Object.keys(propMap);
    const propMapList = mapKeys.reduce((list: { [key: string]: number }[], key: string) => {
        // Multipler assumes breakpoints which would be
        // based off window size so anything other than pixels
        // should be multiplied by 16 to get pixel size.
        const bpMultiplier = /px$/g.test(key) ? 1 : 16;
        const breakpoint = parseInt(key, 10) * bpMultiplier;
        const value = propMap[key];
        let propList: { [key: string]: number }[] = [...list];
        
        if (!isNaN(breakpoint) && !isNaN(value)) {
            propList = [...propList, { breakpoint, value }];
        }
        
        return propList;
    }, []);
    
    if (propMapList.length !== 2) {
        throw new Error('Linear Interpolation must contain exactly 2 breakpoints with valid widths and values!');
    }
    
    const slope = (propMapList[1].value - propMapList[0].value) / (propMapList[1].breakpoint - propMapList[0].breakpoint);
    const intercept = propMapList[0].value - (slope * propMapList[0].breakpoint);
    const sign = intercept < 0 ? '-' : '+';
    
    return `calc(${slope * 100}vw ${sign} ${Math.floor(Math.abs(intercept))}px)`;
};

const createMediaQuerySlopes = (mapKeys: string[], valueMap: SlopeMap, styleProperties: string[]) => (
    mapKeys.slice(0, -1).reduce((mQueries: string[], bp: string, index: number) => {
        const key1 = mapKeys[index];
        const key2 = mapKeys[index + 1];
        const val1 = valueMap[key1];
        const val2 = valueMap[key2];
        const allMQueries = [...mQueries];
        
        if (val1 !== val2) {
            const cssMq = `
            @media screen and (min-width: ${bp}) {
                ${styleProperties.map(styleProp => `${styleProp}: ${linearInterpolation({ [key1]: val1, [key2]: val2 })};`).join('\n')}
            }
            `;
            
            allMQueries.push(cssMq);
        }
        return allMQueries;
    }, [])
);

export const slopeCalc = (styleProps: string | string[], slopeMap: SlopeMap) => (props: object) => {
    const styleProperties = Array.isArray(styleProps) ? styleProps : [styleProps];
    const breakpoints = _get(props, 'theme.breakpoints') || _get(baseSettings, 'breakpoints', {});
    const valueMap = createSlopeValueMap(slopeMap, breakpoints);
    const mapKeys = Object.keys(valueMap).sort();
    
    if (mapKeys.length < 2) {
        throw new Error('Must use slopeCalc with at least 2 breakpoints!');
    }
    const basePixels = _get(props, 'theme.basePixels') || _get(baseSettings, 'basePixels', 16);
    const minPropValues = styleProperties.map(styleProp => `${styleProp}: ${rems(valueMap[mapKeys[0]], basePixels)};`);
    const mqValues = createMediaQuerySlopes(mapKeys, valueMap, styleProperties);
    
    const maxValue = `
        @media screen and (min-width: ${mapKeys[mapKeys.length - 1]}) {
            ${styleProperties.map(styleProp => `${styleProp}: ${rems(valueMap[mapKeys[mapKeys.length - 1]], basePixels)};`).join('\n')}
        }
    `;
    
    return [...minPropValues, ...mqValues, maxValue].join('\n');
};
