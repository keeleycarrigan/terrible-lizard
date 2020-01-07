import React, { FunctionComponent } from 'react';

import RangeSliderTrack from '@terrible-lizard/rangodon/components/RangodonTrack';
import { RangodonProps } from '@terrible-lizard/rangodon';

import { AudioceratopsTrack } from '../styles';

const AudioceratopsTrackBar: FunctionComponent<RangodonProps> = (props) => {
  return (
    <AudioceratopsTrack {...props} >
      <RangeSliderTrack />
    </AudioceratopsTrack>
  )
}

export default AudioceratopsTrackBar;
