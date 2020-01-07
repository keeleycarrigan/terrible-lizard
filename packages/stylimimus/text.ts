import { BreakpointModifier } from './types';

import createBreakpointModifiers from './modifiers';

const textProps: BreakpointModifier[] = [
    {
        cssProp: 'text-align',
        propName: 'textAlign',
    },
    {
        cssProp: 'color',
        propName: 'textColor',
    },
    {
        cssProp: 'font-size',
        propName: 'textSize',
    },
];

const text = createBreakpointModifiers(textProps);

export default text;
