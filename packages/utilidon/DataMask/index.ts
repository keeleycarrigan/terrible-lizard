import _isArray from 'lodash/isArray';

type Matched = string[] | null;

export function numbersOnlyMask (val: string = ''): string {
    return val.replace(/\D/g, '');
}

export function characterLimitMask (limit: number = 0, allowWhiteSpace: boolean = false): (val: string) => string {
    return (val: string = ''): string => {
        const characters: string = allowWhiteSpace ? '.' : '\\w';
        const limitExpr: RegExp = new RegExp(`(${characters}{0,${limit}})`);
        const matched: Matched = val.match(limitExpr);
        
        return matched && matched.length ? matched[1] : '';
    }
}

export function creditCardMask (val: string = ''): string {
    const matched: Matched = numbersOnlyMask(val).match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
    
    if (_isArray(matched)) {
        return `${matched[1]}${matched[2] && ` ${matched[2]}`}${matched[3] && ` ${matched[3]}`}${matched[4] && ` ${matched[4]}`}`;
    }
    
    return '';
}

export function phoneMask1 (val: string = ''): string {
    const matched: Matched = numbersOnlyMask(val).match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    
    if (_isArray(matched)) {
        return `${!matched[2] ? matched[1] : `(${matched[1]}) `}${matched[2]}${matched[3] && `-${matched[3]}`}`;
    }

    return '';
}

export function phoneMask2 (val: string = ''): string {
    const matched: Matched = numbersOnlyMask(val).match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    
    if (_isArray(matched)) {
        return `${matched[1]}${matched[2] && `-${matched[2]}`}${matched[3] && `-${matched[3]}`}`;
    }

    return '';
}

export function ssnMask (val: string = ''): string {
    const matched: Matched = numbersOnlyMask(val).match(/(\d{0,3})(\d{0,2})(\d{0,4})/);
    
    if (_isArray(matched)) {
        return `${matched[1]}${matched[2] && `-${matched[2]}`}${matched[3] && `-${matched[3]}`}`;
    }

    return '';
}

export function zipcodeMask (val: string = ''): string {
    const matched: Matched = numbersOnlyMask(val).match(/(\d{0,5})(\d{0,4})/);
    
    if (_isArray(matched)) {
        return `${!matched[2] ? matched[1] : `${matched[1]}-`}${matched[2]}`;
    }

    return '';
}
