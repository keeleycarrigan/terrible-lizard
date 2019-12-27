import _omit from 'lodash/omit';

import { HolderObject } from '../types';

const Listener = (() => {
  let calls: HolderObject = {};
  let events: HolderObject = {};

  return {
    on(eventName: string, callback: Function = () => {}, useLastCall: boolean): void {
    if (!events[eventName]) {
      events[eventName] = [];
    }

    events[eventName] = [...events[eventName], callback];

    if (useLastCall && typeof calls[eventName] !== 'undefined') {
      callback(calls[eventName]);
    }
  },
  clear(eventName: string, callback?: Function): void {
    // If a callback is passed and the events array has additional callbacks,
    // then just remove the argument callback
    if (callback && events[eventName].length > 1) {
      // Filter out the matching callback
      events[eventName] = events[eventName].filter((cb: Function) => cb !== callback);
    } else {
      // remove the entire event array if there's no callback argument or if
      // that callback is the only item in the array
      events = _omit(events, eventName);
    }
  },
  trigger(eventName: string, data: any = null): void {
      calls[eventName] = data;

      if (events[eventName]) {
        events[eventName].forEach((callback: Function) => callback(data));
      }
    }
  }
})();

export default Listener;
