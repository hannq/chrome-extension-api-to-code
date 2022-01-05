/**
 * 当开启该服务时，监听指定页面 historyState 变化，符合要求时，通知 content-script 执行复制操作
 */

import { isSupportUrl } from '@/utils/urlParser';
import { ExtensionMsgEventName } from '@/constant';
import { portCache } from '../utils';


function createAutoCopyService() {
  let isOpen = false;
  const onHistoryStateUpdatedHandle = async (details: chrome.webNavigation.WebNavigationTransitionCallbackDetails) => {
    if (isSupportUrl(details.url)) {
      portCache[details.tabId]?.postMessage({ type: ExtensionMsgEventName.AUTO_COPY });
    }
  }

  return {
    open() {
      !isOpen && chrome.webNavigation.onHistoryStateUpdated.addListener(onHistoryStateUpdatedHandle);
      isOpen = true;
    },
    close() {
      isOpen && chrome.webNavigation.onHistoryStateUpdated.removeListener(onHistoryStateUpdatedHandle)
      isOpen = false;
    }
  }
}

export default createAutoCopyService();
