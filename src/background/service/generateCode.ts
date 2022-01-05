/**
 * 该服务承接所有「获取api接口数据详情」需求
 */
import { getYapiDataById, compileJSONSchema2TS, parseYApiUrl, parseSwaggerUrl, getSwaggerData, generateComment } from '@/utils';
import { ExtensionMsgEventName } from "@/constant";
import { Message, MessageRes, ApiMeta } from "@/types";
import { isNumber } from '@/utils/valIs';
import { portCache } from '../utils';

type OnMessageHandle = (message: Message<ExtensionMsgEventName.GENERATE_CODE, string>, sender: chrome.runtime.MessageSender) => void;

/**
* 创建「生成代码服务」
*/
function createGenerateCodeService() {
  let isOpen = false;

  const onMessageHandle: OnMessageHandle = async (msg, sender) => {
    const { type, data: url } = msg;
    if (type === ExtensionMsgEventName.GENERATE_CODE) {
      const sendRes = (res: MessageRes<ExtensionMsgEventName.GENERATE_CODE, string>) => {
        if (isNumber(senderTabId)) {
          portCache[senderTabId]?.postMessage(res)
        } else {
          chrome.runtime.sendMessage(res);
        }
      }
      const senderTabId = sender.tab?.id;
      try {
        const yapiParseInfo = parseYApiUrl(url);
        const swaggerParseInfo = parseSwaggerUrl(url);
        const isYApi = !!yapiParseInfo;
        const isSwagger = !!swaggerParseInfo;
        let reqSchema: object | null = null;
        let resSchema: object | null = null;
        let meta: ApiMeta | null = null;

        await new Promise<void>(r => setTimeout(() => r(), 500))

        if (isYApi) {
          // if yapi
          const { prefix, id } = yapiParseInfo;
          const res = await getYapiDataById(prefix, id);
          !res.err && ({ resSchema, reqSchema, meta } = res);
        } else if (isSwagger) {
          // if swagger
          const { prefix, id, method } = swaggerParseInfo;
          const res = await getSwaggerData(prefix, id, method);
          !res.err && ({ resSchema, reqSchema, meta } = res);
        } else throw new Error(`不支持的接口平台，有新增需求，请联系作者！`)

        const reqTsCode = await compileJSONSchema2TS(reqSchema || {}, 'Request')
        const resTsCode = await compileJSONSchema2TS(resSchema || {}, 'Response')
        const code = [
          generateComment(meta?.path || '', meta?.method || '', meta?.title || ''),
          `/** 请求参数 */`,
          reqTsCode,
          `/** 返回值 */`,
          resTsCode
        ].join('\n')
        sendRes({ type: ExtensionMsgEventName.GENERATE_CODE, err: null, data: code })
      } catch (err) {
        let errMsg: string;
        if (err instanceof Error) {
          errMsg = err.message;
        } else if (typeof err === 'string') {
          errMsg = err;
        } else {
          errMsg = '未知异常';
        }
        sendRes({ type: ExtensionMsgEventName.GENERATE_CODE, err: errMsg, data: null })
      }
    }
  }

  return {
    open() {
      !isOpen && chrome.runtime.onMessage.addListener(onMessageHandle);
      isOpen = true;
    },
    close() {
      isOpen && chrome.runtime.onMessage.removeListener(onMessageHandle);
      isOpen = false;
    }
  }
}

export default createGenerateCodeService();
