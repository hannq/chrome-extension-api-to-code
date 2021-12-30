import eventBus from './eventBus';
import { tryJsonParse, tryJsonStringify } from '.';
import { EventBusEventName } from '../constant';

const isChromeStorageExist = !!chrome?.storage?.sync;
const isChromeStorageOnChangedExist = !!chrome?.storage?.onChanged;
if (isChromeStorageOnChangedExist) {
  chrome.storage.onChanged.addListener((changes) => {
    const key = Object.keys(changes)[0];
    eventBus.emit(EventBusEventName.STORAGE_CHANGE, { [key]: changes[key].newValue });
  });
} else {
  window.addEventListener('storage', (event) => {
    const { key, newValue } = event;
    key && eventBus.emit(EventBusEventName.STORAGE_CHANGE, { [key]: tryJsonParse(newValue) });
  }, false);
}

export function createStorage() {
  return {
    async get<T>(key: string): Promise<T> {
      if (isChromeStorageExist) {
        return (await chrome.storage.sync.get(key))?.[key] as T;
      } else {
        return tryJsonParse(localStorage.getItem(key), {}) as T;
      }
    },
    async set<T extends Record<string, any>>(key: string, value: T): Promise<T> {
      if (isChromeStorageExist) {
        await chrome.storage.sync.set({ [key]: value});
        return value;
      } else {
        const val = tryJsonStringify(value, '{}');
        localStorage.setItem(key, val);
        eventBus.emit(EventBusEventName.STORAGE_CHANGE, { [key]: value })
        return value;
      }
    },
    onChange(listener: (changes: Record<string, any>) => void) {
      eventBus.on(EventBusEventName.STORAGE_CHANGE, listener);
    },
    offChange(listener: (changes: Record<string, any>) => void) {
      eventBus.off(EventBusEventName.STORAGE_CHANGE, listener);
    }
  }
}

export default createStorage();
