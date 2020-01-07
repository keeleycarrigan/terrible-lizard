import { BreakpointModifier } from '../../types';

import createBreakpointModifiers from '../../modifiers';

const alignProps: BreakpointModifier[] = [
  {
    cssProp: 'align-items',
    propName: 'align',
  },
  {
    cssProp: 'align-self',
    propName: 'alignSelf',
  },
  {
    cssProp: 'align-content',
    propName: 'alignContent',
  },
  {
    cssProp: 'flex-direction',
    propName: 'direction',
  },
  {
    cssProp: 'justify-content',
    propName: 'justify',
  },
];

export const align = createBreakpointModifiers(alignProps);

export default align;
