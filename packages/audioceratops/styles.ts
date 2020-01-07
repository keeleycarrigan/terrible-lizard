import styled from 'styled-components';

import Rangodon from '@terrible-lizard/rangodon';
import { RangodonTrackHead } from '@terrible-lizard/rangodon/styles';

import { grayScale } from 'style/color/default';
import { themeRems } from 'style-utils/units';

export const AudioceratopsControls = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;
export const AudioceratopsPlayBtn = styled.button`
  background-color: transparent;
  border-radius: 50%;
  border: none;
  box-sizing: border-box;
  display: block;
  flex-shrink: 0;
  height: ${themeRems(40)};
  padding: 0;
  width: ${themeRems(40)};

  path,
  rect {
    fill: ${grayScale.gray4};
    transition: fill 200ms linear;
  }

  &:focus {
    outline: none;
   
    path,
    rect {
      fill: ${grayScale.black};
    }
  }

  ::-moz-focus-inner {
    border: none;
  }
`;
export const AudioceratopsTimeline = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  padding-left: ${themeRems(18)};
`;
export const AudioceratopsTime = styled.span`
  color: ${grayScale.gray4};
  font-size: ${themeRems(12)};
  font-family: 'Helvetica', 'Arial', 'sans-serif';
`;

export const AudioceratopsTrack = styled(Rangodon)`
  height: 4px;
  margin-left: ${themeRems(10)};
  margin-right: ${themeRems(10)};

  ${RangodonTrackHead} {
    background-color: transparent;
    height: 4px;
    width: 2px;
  }
`;
