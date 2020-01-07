import styled from 'styled-components';

import spacing from '../../layout/spacing';
import display from '../../layout/display';
import align from '../../layout/align';
import text from '../../text';
import colors from '../../color';

const Box = styled.div`
  box-sizing: border-box;

  ${display}
  ${align}
  ${spacing}
  ${colors}
  ${text}
`;

export default Box;
