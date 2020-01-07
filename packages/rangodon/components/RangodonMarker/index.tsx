import React, {
    FC,
    useContext,
} from 'react';

import RangodonContext from '../../context';

import {
    Marker,
    MarkerLabel,
    MarkerWrapper,
} from './styles';

interface RangodonMarkerProps {
    at: number;
}

const RangodonMarker: FC<RangodonMarkerProps> = (props) => {
    const {
        at,
        children,
    } = props;
    const {
        max,
        min,
        range,
    } = useContext(RangodonContext);
    const markerPosition = ((at - min) * 100) / (max - min);
    
    return (
        <MarkerWrapper
            active={range >= at}
            position={markerPosition}
        >
        <Marker />
            <MarkerLabel>{children}</MarkerLabel>
        </MarkerWrapper>
        )
};

export default RangodonMarker;
