import React, { FunctionComponent } from 'react';

import { AudioceratopsTime as TimeElement } from '../styles';

export interface TimeProps {
    time: string | number;
}

const AudioceratopsTime: FunctionComponent<TimeProps> = ({ time, ...props }) => {
  return (
    <TimeElement {...props}>
      {time}
    </TimeElement>
  );
};

export default AudioceratopsTime;
