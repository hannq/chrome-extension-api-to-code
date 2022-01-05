import { Notify } from 'notiflix/build/notiflix-notify-aio';
import options from '@/utils/options';
import { ExtensionMsgEventName } from '@/constant';
import { Message, MessageRes, Options } from '@/types';
import { isSupportUrl } from '@/utils/urlParser';
import { port, writeToClipboard } from './utils';

;(async function () {
  let inited = false;
  const url = location.href;
  const opts = await options.get();

  if (opts.beta.laziestMode && isSupportUrl(url)) {
    setTimeout(() => {
      !inited && generateAndCopyCurrentCode();
    }, 1.5 * 1000);
  }

  port.onMessage.addListener((msg: Message<ExtensionMsgEventName.AUTO_COPY, void>) => {
    if (msg.type === ExtensionMsgEventName.AUTO_COPY) {
      inited = true;
      generateAndCopyCurrentCode();
    }
  })
})();

async function generateAndCopyCurrentCode() {
  const opts = await options.get();
  const url = location.href;
  if (opts.beta.laziestMode && isSupportUrl(url)) {
    try {
      chrome.runtime.sendMessage({ type: ExtensionMsgEventName.GENERATE_CODE, data: url });
      const code = await Promise.race([
        new Promise<string>((resolve, reject) => {
          const msgResHandle = (res: MessageRes<ExtensionMsgEventName.GENERATE_CODE, string>) => {
            if (res.type === ExtensionMsgEventName.GENERATE_CODE) {
              port.onMessage.removeListener(msgResHandle);
              const { data, err } = res;
              if (!err) resolve(data!)
              else reject(new Error(err))
            }
          }
          port.onMessage.addListener(msgResHandle)
        }),
        new Promise<string>((_, reject) => setTimeout(reject, 5 * 1000, new Error(`生成代码超时`)))
      ]);

      await writeToClipboard(code);
      Notify.success('代码已复制到剪贴板');
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
      Notify.failure(errMsg);
    }
  }
}
