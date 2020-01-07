import { css } from 'styled-components';
import _find from 'lodash/find';
import _get from 'lodash/get';
import _intersection from 'lodash/intersection';
import _reduce from 'lodash/reduce';
import _isEmpty from 'lodash/isEmpty';

import {
    BaseThemeSettings,
    BreakpointModifier,
    PropertyBlacklist,
} from '../types';
import baseSettings from '../settings';
import { rems } from '../utility/units';

const defaultPixelThreshold = (value: number) => value > 5;
const numberParseBlacklist: PropertyBlacklist[] = [
    {
        prop: ['cols', 'offsetCols']
    },
    {
        prop: 'flex'
    },
    {
        prop: ['border-width', 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'],
        threshold: defaultPixelThreshold,
    }
];

// This function will parse a property value if it's a number.
// If the value doesn't parse into a number the value is returned
// as it was passed. If the value is a number we check the blacklist
// to see if it's a number that needs to stay the way it is and not
// become pixels or rems. If the blacklist entry has a threshold,
// that means it's okay to turn into rems if the value is over the
// threshold that's set. The threshold keeps rems from being set on
// values that will produce awkward half pixels. There is a default
// rem conversion threshold on all non blacklisted numbers as usually
// a value 5 or less produces a bad appearance in most browsers due to
// the rem calculation giving it weird half pixels.
const parsePropertyValue = (cssProp: string[], propVal: string, theme: BaseThemeSettings): string => {
    const parsedPropVal = parseFloat(propVal);
    const blacklistItem = _find(numberParseBlacklist, (item) => {
        if (Array.isArray(item.prop)) {
            return _intersection(cssProp, item.prop).length > 0;
        } else {
            return cssProp.indexOf(item.prop) > -1;
        }
    });
    let cssPropVal: string = propVal;
    
    if (!isNaN(parsedPropVal)) {
        const threshold = _get(blacklistItem, 'threshold');
        
        if (blacklistItem) {
            if (threshold) {
                cssPropVal = threshold(parsedPropVal) ? rems(parsedPropVal, theme.basePixels): `${parsedPropVal}px`;
            } else {
                cssPropVal = parsedPropVal.toString();
            }
        } else {
            cssPropVal = defaultPixelThreshold(parsedPropVal) ? rems(parsedPropVal, theme.basePixels) : `${parsedPropVal}px`;
        }
    }
    
    return cssPropVal;
}

const createBreakpointModifiers = (modifiers: BreakpointModifier[] = []) => (props: { [key: string]: any }) => {
    const themeProp = _get(props, 'theme', {});
    const theme = _isEmpty(themeProp) ? baseSettings : themeProp;
    
    if (modifiers.length) {
        return modifiers.reduce((allModifiers, { propName, cssProp, valTransform }) => {
            const property = props[propName];
            
            if (property) {
                
                allModifiers += _reduce(property, (allProperties, propVal, mqName) => {
                    const query: string = theme.queries[mqName];
                    const cssProps: string[] = Array.isArray(cssProp) ? cssProp : [cssProp];
                    const cssPropVal: string = parsePropertyValue([...cssProps, propName], propVal, theme);
                    const transformedVal: string = valTransform ? valTransform(cssPropVal, theme) : cssPropVal;
                    
                    if (typeof (query) === 'string') {
                        allProperties += css`
                        ${`
                        @media ${query} {
                            ${cssProps.map(cssPropName => `${cssPropName}: ${transformedVal};`).join('\n')}
                        }
                        `}
                        `.join('');
                    }
                    return allProperties;
                }, '');
            }
            return allModifiers;
        }, '');
    }
    
    return '';
}

export const modifiers = (mod: string) => {
    return (literals: TemplateStringsArray, ...placeholders: any[]) => {
        return (props: { [key: string] : any }) => props[mod] && css(literals, ...placeholders);
    }
}

export default createBreakpointModifiers;
