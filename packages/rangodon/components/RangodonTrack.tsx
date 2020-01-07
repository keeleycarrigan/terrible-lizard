import React, {
    FC,
    useContext,
} from 'react';

import RangodonContext from '../context';

import {
  RangodonTrack as Track,
  RangodonTrackBar,
  RangodonTrackHead,
} from '../styles';

const RangodonTrack: FC = (props) => {
  const { children } = props;
  const { range } = useContext(RangodonContext);

  return (
    <React.Fragment>
      <Track>
        <RangodonTrackBar
          style={{ width: `${range}%` }}
        />
      </Track>
      {children}
      <RangodonTrackHead
        style={{ left: `${range}%` }}
      />
    </React.Fragment>
  )
}

export default RangodonTrack;
