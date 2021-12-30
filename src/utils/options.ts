import merge from 'lodash.merge';
import type { Options } from '../types';
import storage from './storage';
import eventBus from './eventBus';
import { Theme, OPTIONS_STORAGE_KEY, EventBusEventName } from '../constant';

export const defaultOptions: Options = {
  basic: {
    theme: Theme.AUTO,
    autoCopyAfterGenCode: false
  },
  editor: {
    editable: false
  },
  beta: {
    laziestMode: false
  }
}

storage.onChange((changes: Record<string, any>) => {
  if (changes?.[OPTIONS_STORAGE_KEY]) {
    eventBus.emit(EventBusEventName.OPTIONS_CHANGE, changes[OPTIONS_STORAGE_KEY]);
  }
})

export function createOptions() {
  return {
    async get(): Promise<Options>  {
      try {
        const opts = await storage.get<Partial<Options>>(OPTIONS_STORAGE_KEY) || {};
        return merge({}, defaultOptions, opts);
      } catch (err) {
        console.error(err);
        return defaultOptions;
      }
    },
    async set(options: Partial<Options>): Promise<Options> {
      try {
        const opts = await storage.get(OPTIONS_STORAGE_KEY) as Options || {};
        const nextOpts = merge({}, defaultOptions, opts, options);
        await storage.set(OPTIONS_STORAGE_KEY, nextOpts);
        return nextOpts;
      } catch (err) {
        console.error(err);
        return defaultOptions
      }
    },
    onChange(handler: (options: Options) => void) {
      eventBus.on(EventBusEventName.OPTIONS_CHANGE, handler);
    },
    onceChange(handler: (options: Options) => void) {
      eventBus.once(EventBusEventName.OPTIONS_CHANGE, handler);
    },
    offChange(handler: (options: Options) => void) {
      eventBus.off(EventBusEventName.OPTIONS_CHANGE, handler);
    }
  }
}

export default createOptions();
