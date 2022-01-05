import { ExtensionMsgEventName } from '@/constant';
import { MessageRes } from '@/types';
import { port } from './port';
export async function writeToClipboard(text: string) {
  try {
    if (window.navigator.clipboard) {
      await window.navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const copyResult = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (!copyResult) {
        chrome.runtime.sendMessage({ type: ExtensionMsgEventName.RUN_NEW_WINDOW_COPY, data: text });
        await Promise.race([
          new Promise<void>((resolve, reject) => {
            const msgResHandle = (res: MessageRes<ExtensionMsgEventName.RUN_NEW_WINDOW_COPY, void>) => {
              if (res.type === ExtensionMsgEventName.RUN_NEW_WINDOW_COPY) {
                port.onMessage.removeListener(msgResHandle);
                const { err } = res;
                if (!err) resolve()
                else reject(new Error(err))
              }
            }
            port.onMessage.addListener(msgResHandle)
          }),
          new Promise<void>((_, reject) => setTimeout(reject, 5 * 1000, new Error(`写入剪切板超时`)))
        ]);
      }
    }

  } catch (err) {
    let errMsg: string;
    if (err instanceof Error) {
      errMsg = err.message;
    } else if (typeof err === 'string') {
      errMsg = err;
    } else {
      errMsg = '未知异常';
      console.error(err);
    }

    throw new Error(errMsg);
  }
}

export default writeToClipboard;
