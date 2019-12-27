import { getCleanNumber } from '../Numbers';

import {
    HolderObject,
    StringOrNumber,
    StringOrNumberCompare,
} from '../types';

export function validHasInput (val?: StringOrNumber): boolean {
  return typeof(val) !== 'undefined' && val !== null && val.toString().length > 0;
}

export function validEmail (val: string = ''): boolean {
  return /^[-0-9A-Za-z!#$%&'*+/=?^_`{|}~]+(\.[-0-9A-Za-z!#$%&'*+/=?^_`{|}~]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/ig.test(val);
}

export function validPhone (val: string = ''): boolean {
  return val.replace(/^[0]/g, '').replace(/[\D]/g, '').length >= 10;
}

export function validZipcode (val: string = ''): boolean {
  const zRegEx = new RegExp('^\\d{5}(?:[-\\s]\\d{4})?$');

  return zRegEx.test(val);
}

export function validEqualTo (compareID: string): (val: string, allVals: HolderObject) => boolean {
  return (val: string, allVals: HolderObject): boolean => {
    const otherVal = allVals[compareID];

    return validHasInput(otherVal) && otherVal === val;
  }
}

export function validCompare (type: string = 'min', amount: StringOrNumber): StringOrNumberCompare {
  const comparison = typeof(amount) === 'number' ? amount : getCleanNumber(amount);
  return (val: StringOrNumber): boolean => {
    const input = typeof(val) === 'number' ? val : getCleanNumber(!validHasInput(val) ? 0 : val);
    let valid = false;

    if (input && comparison) {
      valid = type === 'min' ? (input >= comparison) : (input <= comparison);
    }

    return valid;
  }
}

export function validMin (amount: StringOrNumber): StringOrNumberCompare {
  return validCompare('min', amount);
}

export function validMax (amount: StringOrNumber): StringOrNumberCompare {
  return validCompare('max', amount);
}

export function validInRange (min: StringOrNumber, max: StringOrNumber): StringOrNumberCompare {
  return (val: StringOrNumber): boolean => {
    return validMin(min)(val) && validMax(max)(val);
  }
}

export function validNumber (val: StringOrNumberCompare): boolean {
  return !isNaN(parseFloat(val.toString()));
}
