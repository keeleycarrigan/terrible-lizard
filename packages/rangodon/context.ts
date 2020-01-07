import React from 'react';

interface RangodonContextValue {
    max: number;
    min: number;
    range: number;
    value: number;
}

const defaultValue: RangodonContextValue = {
    max: 100,
    min: 0,
    range: 0,
    value: 50,
};
const RangodonContext = React.createContext(defaultValue);
const {
  Consumer,
  Provider,
} = RangodonContext;

export const RangodonConsumer = Consumer;
export const RangodonProvider = Provider;

export default RangodonContext;
