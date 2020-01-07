import { StringOrNumber } from '../types';

type FormattedNumberArgs = { val: StringOrNumber, decimals: number, prefix: string, suffix: string };

export function roundNumber (num: StringOrNumber, decimals: number = 0): number {
    const number: number = typeof (num) === 'string' ? parseFloat(num) : num;
    const safeNumber: number = isNaN(number) ? 0 : number;

    // This crazy Number initialization more accurately rounds numbers.
    return Number(`${Math.round(Number(`${safeNumber}e${decimals}`))}e-${decimals}`);
}

export function numberWithCommas (num: StringOrNumber): string {
    const number: string = typeof (num) === 'string' ? num : num.toString();
    const parts: string[] = number.toString().split('.');

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
}

export function getCleanNumber (val: StringOrNumber): number | null {
    const cleaned: number = typeof (val) === 'string' ? parseFloat(val.replace(/[^\.|\d|-]+/g, '')) : val;

    if (!isNaN(cleaned)) {
        return cleaned;
    }

    return null;
}

export function getFormattedNumber ({ val, decimals = 0, prefix = '', suffix = '' }: FormattedNumberArgs): string {
    const cleanNumber: number | null = getCleanNumber(val);
    const finalVal: string = cleanNumber ? numberWithCommas(roundNumber(cleanNumber, decimals).toFixed(decimals)) : '';

    return `${prefix}${finalVal}${suffix}`;
}

export function minDigits (digits: number = 0, min: number = 2): string {
    return (digits).toLocaleString('en-US', { minimumIntegerDigits: min, useGrouping: false });
}

/**
 * Formats time into minutes and seconds
 * @param { number } - pass duration
 * @return - formatted minutes and seconds
 */
export function formatTime (duration: number = 0): string {
    const roughDuration: number = Math.floor(!isNaN(duration) ? duration : 0);
    const seconds: string = minDigits(Math.floor(roughDuration % 60), 2);
    const minutes: string = minDigits(Math.floor(roughDuration / 60), 2);

    return `${minutes}:${seconds}`;
}
