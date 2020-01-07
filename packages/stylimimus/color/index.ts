import _get from 'lodash/get';
import _isPlainObject from 'lodash/isPlainObject';
import _reduce from 'lodash/reduce';
import _upperFirst from 'lodash/upperFirst';

import { BaseThemeSettings } from '../types';
import baseSettings from '../settings';

const colorMods = [
  {
    cssProp: 'color',
    propName: 'color',
  },
  {
    cssProp: 'background-color',
    propName: 'bgColor',
  },
];

const getColorModifiers = (colors: { [key: string] : string }, props: { [key: string] : any }) => {
    return colorMods.reduce((allColors, { propName, cssProp }) => {
        const colorName = props[propName];
        const validColor = colors[colorName];
    
        if (validColor) {
          allColors += `${cssProp}: ${validColor};\n`;
        }
    
        return allColors;
      }, '');
}

export const createColorData = (data = {}, colorCatName = '') => {
  return _reduce(data, (allData: { [key: string] : string }, hex: string, name: string) => {
    const colorName = colorCatName.length ? _upperFirst(name) : name;
    const colorDataName = `${colorCatName}${colorName}`;

    if (typeof (hex) === 'string') {
      allData[colorDataName] = hex;
    } else if (_isPlainObject(hex)) {
      allData = {
        ...allData,
        ...createColorData(hex, colorDataName)
      }
    }

    return allData;
  }, {});
};


export const createColorModifiers = (colors = {}) => (props: { [key: string] : any }) => {
  const colorsData: { [key: string] : string } = createColorData(colors);

  return getColorModifiers(colorsData, props);
};

export const createDefaultColorModifiers = ({ theme, ...props }: { theme: BaseThemeSettings, props: { [key: string] : any }}) => {
  const colors: { [key: string] : any } = _get(theme, 'colors', _get(baseSettings, 'colors', {})) || {};

  return getColorModifiers(colors, props);
};

const colors = createDefaultColorModifiers;

export default colors;
