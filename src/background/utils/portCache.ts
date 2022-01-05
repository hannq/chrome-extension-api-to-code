import { isNumber } from '@/utils/valIs';

chrome.runtime.onConnect.addListener(port => {
  const tabId = port.sender?.tab?.id;
  isNumber(tabId) && (portCache[tabId] = port);
  port.onDisconnect.addListener(async () => {
    isNumber(tabId) && (delete portCache[tabId]);
  });
});

export const portCache: Record<number, chrome.runtime.Port> = {}

export default portCache;
