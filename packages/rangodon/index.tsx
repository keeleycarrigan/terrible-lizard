import React, {
    ChangeEvent,
    FC,
    MouseEvent,
    useEffect,
    useState,
} from 'react';
import _findKey from 'lodash/findKey';

import {
    RangodonTrackControl,
    RangodonTrackWrapper,
} from './styles';

import { RangodonProvider } from './context';

export interface RangodonProps {
    className?: string;
    id: string;
    onChange: (mappedValue: number | string) => void;
    onKeyDown?: (e: KeyboardEvent) => void;
    onMouseDown?: (e: MouseEvent<HTMLInputElement>) => void;
    onMouseUp?: (e: MouseEvent<HTMLInputElement>) => void;
    rangeMap?: { [key: number] : any };
    rangeMax?: number;
    rangeMin?: number;
    step?: string;
    value?: number | null;
}

const Rangodon: FC<RangodonProps> = (props) => {
    const {
        children,
        className,
        onChange,
        rangeMap,
        rangeMax,
        rangeMin,
        value,
        ...rest
    } = props;
    const [internalValue, setInternalValue] = useState<null | number>(value || rangeMin);

    const getContextValue = () => {
        const range = ((internalValue - rangeMin)  * 100) / (rangeMax - rangeMin);
        
        return {
            max: rangeMax,
            min: rangeMin,
            range,
            value: internalValue,
        };
    };
    const updateValue = (rangeValue: number | string) => {
        const mappedValue = _findKey(rangeMap, mapValue => mapValue === rangeValue) || rangeValue;
        const parsedValue = parseFloat(mappedValue.toString());
        
        if (internalValue !== parsedValue) {
            setInternalValue(parsedValue);
        }
    };
    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const parsedValue: number = parseFloat(e.target.value);
        const mappedValue: number | string = rangeMap[parsedValue] || parsedValue;
        
        if (typeof (value) === 'undefined') {
            updateValue(mappedValue);
            onChange(mappedValue);
        } else {
            onChange(parsedValue);
        }
        
    };

    useEffect(() => {
        if (typeof (value) !== 'undefined') {
            updateValue(value);
        }
    }, [updateValue, value]);

    return (
        <RangodonProvider value={getContextValue()}>
            <RangodonTrackWrapper className={className}>
                <RangodonTrackControl
                    value={internalValue}
                    onChange={onInputChange}
                    max={rangeMax}
                    min={rangeMin}
                    {...rest}
                    type="range"
                />
                {children}
            </RangodonTrackWrapper>
        </RangodonProvider>
    );
};

Rangodon.defaultProps = {
    rangeMax: 100,
    rangeMin: 0,
    onChange: () => {},
    onMouseDown: () => {},
    onMouseUp: () => {},
    rangeMap: {},
    step: 'any',
};

export default Rangodon;
