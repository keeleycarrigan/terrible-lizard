import _isArray from 'lodash/isArray';
import _isEmpty from 'lodash/isEmpty';
import _isPlainObject from 'lodash/isPlainObject';
import _reduce from 'lodash/reduce';

import { HolderObject } from '../types';

const GLOBAL_CONSOLE: Console & HolderObject = console;

function setObjectValue (obj: HolderObject, key: string, value: any): object {
    return {
        ...obj,
        [key]: value
    };
}

export function deepRemoveEmpty(obj: HolderObject|any[]): HolderObject|any[] {
  return _reduce(obj, (accum: HolderObject|any[], val: any, key: string) => {
    if (_isPlainObject(val) || _isArray(val)) {
      const items = deepRemoveEmpty(val);
      if (!_isEmpty(items)) {
        if (_isPlainObject(accum)) {
          accum = setObjectValue(accum, key, items);
        } else if (_isArray(accum)) {
          accum = [...accum, items];
        }
      }
    } else if (typeof (val) !== 'undefined') {
      if (_isPlainObject(accum)) {
        accum = setObjectValue(accum, key, val);
      } else if (_isArray(accum)) {
        accum = [...accum, val];
      }
    }

    return accum;
  }, _isPlainObject(obj) ? {} : []);
}

export function convertKeyCode(e: KeyboardEvent) {
  const keyCode = e.keyCode || e.which;
  if (!keyCode) return {};

  const isLeftDir = keyCode === 37;
  const isUpDir = keyCode === 38;
  const isRightDir = keyCode === 39;
  const isDownDir = keyCode === 40;
  const isPageUp = keyCode === 33;
  const isPageDown = keyCode === 34;
  const isDown = isRightDir || isDownDir || isPageDown;
  const isUp = isLeftDir || isUpDir || isPageUp;

  return {
    isLeftDir,
    isUpDir,
    isRightDir,
    isDownDir,
    isPageUp,
    isPageDown,
    isDown,
    isUp,
    isDir: isDown || isUp,
    isEnd: keyCode === 35,
    isHome: keyCode === 36,
    isEnter: keyCode === 13,
    isTab: keyCode === 9,
    isEsc: keyCode === 27,
    isShift: e.shiftKey,
    isSpace: keyCode === 32,
    char: String.fromCharCode(keyCode),
    keyCode
  };
};

export function getQueryParams(key: string, url: string = window.location.search): string | object | null {
  const parseURL = url.match(/\?.+/);
  let found: string | object | null = null;

  if (parseURL && parseURL.length) {
    const parts = parseURL[0].split(/&|\?/g);
    const params: HolderObject = parts.reduce((obj: HolderObject, part): object => {
      const keyVal = part.split('=');

      if (keyVal.length && keyVal[0].trim() !== '') {
        obj[keyVal[0]] = keyVal[1] || true;
      }

      return obj;
    }, {});
    found = !_isEmpty(params) ? params: null;

    if (key && params) {
      found = params[key];
    }
  }

  return found;
};

/**
 * This util logs out messages in the console if there is a debug paramater
 * in the url (?debugLogging). The filename should be included in your arguments in
 * some way to help with debugging
 *
 * e.g. If you have a formatted string, you should have...
 * debugLog(
 *   'log', 'nameOfFile.js: %cThis is a log', 'color:green;'
 * );
 *
 * @param  {String} [type] The type of log ('log', 'error', 'warn')
 *                         If undefined, defaults to console.log
 */
// ---------------------------------------------------------------------------

export function debugLog(type: string = 'log', ...args: any): void {
  const debugMode = getQueryParams('debugLog');

  if (debugMode && GLOBAL_CONSOLE) {
    /* eslint-disable no-console */
    if (typeof type !== 'string' || !GLOBAL_CONSOLE[type]) {
      return console.log.apply(console, args);
    } else {
      return GLOBAL_CONSOLE[type].apply(GLOBAL_CONSOLE, args);
    }
    /* eslint-enable no-console */
  }
};
