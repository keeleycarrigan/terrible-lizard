import _get from 'lodash/get';
import _find from 'lodash/find';

import { BreakpointSetting } from '../types';

export const getBreakpoint = (range: string, breakpointName: string, breakpoints: BreakpointSetting[]): string => {
    return _get(_find(breakpoints, ['name', breakpointName]), range);
}

export const getBreakpointPxInteger = (range: string, breakpointName: string, breakpoints: BreakpointSetting[]): number => {
    return parseInt(getBreakpoint(range, breakpointName, breakpoints), 10) * 16; // 16 references default browser size
}

export const createMediaQueries = (breakpoints: BreakpointSetting[]) => {
  return breakpoints.reduce((allBPs: { [ key: string ]: string; }, bp: BreakpointSetting) => {
    const {
      lower,
      name,
      upper,
    } = bp;
    allBPs[name] = `screen and (min-width: ${lower})`;
    allBPs[`${name}Only`] = `screen and (min-width: ${lower}) and (max-width: ${upper})`;
    allBPs[`${name}Max`] = `screen and (max-width: ${upper})`;

    return allBPs;
  }, {});
};
