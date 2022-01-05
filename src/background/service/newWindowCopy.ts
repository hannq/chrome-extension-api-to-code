/**
 * 当前页面无法写入剪切板时候，调用该服务，主动开启一个新窗口执行写入操作
 */

import debounce from "lodash.debounce";
import serviceWorkerMsg from "@/background/utils/serviceWorkerMsg";
import { NewWindowCopyEventName, ExtensionMsgEventName } from "@/constant";
import { isNumber } from "@/utils/valIs";
import { Message, MessageRes } from "@/types";
import { portCache } from "../utils";

type OnMessageHandle = (message: Message<ExtensionMsgEventName.RUN_NEW_WINDOW_COPY, string>, sender: chrome.runtime.MessageSender) => void;

/**
 * 执行复制任务
 * @param content 拷贝内容
 */
const copyTaskHandle = debounce(async function (content: string, sendRes: (res: MessageRes<ExtensionMsgEventName.RUN_NEW_WINDOW_COPY, string>) => void) {
  const tmpCopyPageUrl = `${chrome.runtime.getURL('index.html')}#/copy`;
  const win = await chrome.windows.create({
    url: tmpCopyPageUrl,
    type: 'popup',
    state: 'fullscreen',
    focused: true,
  });
  let msgEventHandle: ((e: ServiceWorkerGlobalScopeEventMap['message']) => void) | null = null;
  try {
    await Promise.race([
      new Promise<void>((resolve, reject) => {
        msgEventHandle = async (e: ServiceWorkerGlobalScopeEventMap['message']) => {
          // TODO: 增加 UUID Token 验证
          // @ts-ignore
          if (e?.source?.url === tmpCopyPageUrl) {
            // 拷贝页面准备就绪
            if (e.data?.type === NewWindowCopyEventName.COPY_PAGE_READY) {
              e.source?.postMessage({
                type: NewWindowCopyEventName.COPY_CODE,
                data: content
              })
            }
            // 拷贝完成
            if (win?.id && e.data?.type === NewWindowCopyEventName.COPY_CODE_FINISHED) {
              serviceWorkerMsg.off(msgEventHandle!);
              resolve();
            }
            // 拷贝失败
            if (win?.id && e.data?.type === NewWindowCopyEventName.COPY_CODE_FAILED) {
              reject(e.data?.data);
            }
          }
        }
        serviceWorkerMsg.on(msgEventHandle);
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('操作超时！')), 5 * 1000))
    ]);
    sendRes({ type: ExtensionMsgEventName.RUN_NEW_WINDOW_COPY, err: null, data: null });
  } catch (err) {
    if (msgEventHandle) serviceWorkerMsg.off(msgEventHandle);
    let errMsg: string;
    if (err instanceof Error) {
      errMsg = err.message;
    } else if (typeof err === 'string') {
      errMsg = err;
    } else {
      errMsg = '未知异常';
    }
    sendRes({ type: ExtensionMsgEventName.RUN_NEW_WINDOW_COPY, err: errMsg, data: null });
  } finally {
    typeof win?.id === 'number' && await chrome.windows.remove(win.id);
  }
});

/**
 * 创建「新建新窗口拷贝服务」
 */
function createNewWindowCopyService() {
  let isOpen = false;

  const onMessageHandle: OnMessageHandle = (msg, sender) => {
    const { type, data } = msg;
    const sanderTabId = sender.tab?.id
    if (type === ExtensionMsgEventName.RUN_NEW_WINDOW_COPY) {
      copyTaskHandle(data, (res) => {
        isNumber(sanderTabId) && portCache[sanderTabId]?.postMessage(res);
      });
    }
  }

  return {
    open() {
      !isOpen && chrome.runtime.onMessage.addListener(onMessageHandle)
      isOpen = true;
    },
    close() {
      isOpen && chrome.runtime.onMessage.removeListener(onMessageHandle)
      isOpen = false;
    }
  }
}

export default createNewWindowCopyService();
