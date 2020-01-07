import createBreakpointModifiers from '../../modifiers';

const displayProps = [
  {
    cssProp: 'display',
    propName: 'display',
  },
  {
    cssProp: 'flex',
    propName: 'flex',
  },
];

export const display = createBreakpointModifiers(displayProps);

export default display;
