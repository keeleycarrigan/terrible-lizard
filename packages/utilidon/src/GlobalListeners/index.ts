import _debounce from 'lodash/debounce';
import _omit from 'lodash/omit';

import Listener from '../Listener';
import { debugLog } from '../General';

import { HolderObject } from '../types';

interface HandlerMappings extends HolderObject {
    resize: Function;
    scroll: Function;
    mousedown: Function;
    touchstart: Function;
    mousemove: Function;
    touchmove: Function;
    mouseup: Function;
    touchend: Function;
}

interface ListenerActions extends HolderObject {
    add: (eventName: string) => void;
    remove: (eventName: string) => void;
}

const GlobalListeners = (() => {
  // Assign an object of event name -> handler functions to be looped below
  const handlerMappings: HandlerMappings = {
    resize: _debounce((e: WindowEventHandlers) => Listener.trigger('GLOBAL_RESIZE', e), 100),
    scroll: (e: Event) => Listener.trigger('GLOBAL_SCROLL', e),

    mousedown: (e: MouseEvent) => Listener.trigger('GLOBAL_MOUSE_DOWN', e),
    touchstart: (e: TouchEvent) => Listener.trigger('GLOBAL_TOUCH_START', e),

    mousemove: (e: MouseEvent) => Listener.trigger('GLOBAL_MOUSE_MOVE', e),
    touchmove: (e: TouchEvent) => Listener.trigger('GLOBAL_TOUCH_MOVE', e),

    mouseup: (e: MouseEvent) => Listener.trigger('GLOBAL_MOUSE_UP', e),
    touchend: (e: TouchEvent) => Listener.trigger('GLOBAL_TOUCH_END', e),
  };
  function all(action: string) {
    Object.keys(handlerMappings).forEach((eventName: string)=> listenerActions[action](eventName));
  }
  // Declare an empty storage object for already added listeners
  let addedListeners: { [ key: string ]: any; } = {};
  const listenerActions: ListenerActions = {
    add(eventName: string) {
      // If an event name argument is passed, then just add and return the single
      // event listener, otherwise return all the event listeners declared above
      if (typeof (eventName) === 'string') {
        if (addedListeners[eventName]) {

          debugLog('warn', 'GlobalListeners.add:%cMultiple global event listeners are being declared. This is unnecessary.', 'font-weight:bold');
        } else {
          // Store the listener so it can be checked above as to whether or not it
          // was created yet
          addedListeners[eventName] = true;

          // Add the event listener and just return it as there's no return value
          // required, so sending the listeners default return value of `undefined`
          // seems appropriate
          window.addEventListener(eventName, handlerMappings[eventName]);
        }
      } else {
        all('add');
      }
    },
    remove(eventName: string) {
      // If an event name argument is passed, then just add and return the single
      // event listener, otherwise return all the event listeners declared above
      if (typeof (eventName) === 'string') {
        if (addedListeners[eventName]) {
          // Remove the stored boolean for the listener since it's about to be removed
          addedListeners = _omit(addedListeners, eventName);

          // If handler was made with a _debounce, cancel the debounce.
          handlerMappings[eventName].cancel && handlerMappings[eventName].cancel();

          window.removeEventListener(eventName, handlerMappings[eventName]);
        } else {
          debugLog('warn', `GlobalListeners.remove:%cThe "${eventName}" event has already been removed. No need to remove it again.`, 'font-weight:bold');
        }
      } else {
        all('remove');
      }
    }
  };

  return {
    add: listenerActions.add,
    all,
    remove: listenerActions.remove,
  }
})();

export default GlobalListeners;
