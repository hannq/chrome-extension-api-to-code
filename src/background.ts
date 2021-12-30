import debounce from "lodash.debounce";
import { getYapiDataById, generateComment, parseYApiUrl, compileJSONSchema2TS } from "./utils";
import options from "./utils/options";
import serviceWorkerMsg from "./utils/serviceWorkerMsg";
import { CopyEventName, LAZIEST_MODE_ACTION_TIMEOUT } from "./constant";

importScripts('lib/prettier.js');
importScripts('lib/parser-typescript.js');
importScripts('lib/parser-babel.js');
importScripts('lib/prettier-fix.js');
importScripts('lib/jstt.js');

// chrome.tabs.onActivated.addListener(async activeInfo => {
//   const tabId = activeInfo.tabId;
//   const tab = await chrome.tabs.get(tabId);
//   if (tab && tab.url) {
//     const result = parseYApiUrl(tab.url);
//     if (result) {
//       const { prefix, id } = result;
//       copyTaskHandle(prefix, id, tabId);
//     }
//   }
// });

chrome.runtime.onInstalled.addListener(() => chrome.runtime.openOptionsPage())

  ; (async function () {
    const lasiestMode = createLasiestMode();
    const { beta: { laziestMode } } = await options.get();

    if (laziestMode) {
      lasiestMode.open();
    } else {
      lasiestMode.close();
    }

    options.onChange(({ beta: { laziestMode } }) => {
      if (laziestMode) {
        lasiestMode.open();
      } else {
        lasiestMode.close();
      }
    });
  })();

/**
 * 开启懒癌模式
 */
function createLasiestMode() {
  const tabUpdateEventHandle = async (_: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
    const { url, active } = tab || {}
    if (url && active && changeInfo.status === "complete") {
      const result = parseYApiUrl(url);
      if (result) {
        const { prefix, id } = result;
        copyTaskHandle(prefix, id);
      }
    }
  }

  return {
    open() {
      chrome.tabs.onUpdated.addListener(tabUpdateEventHandle);
    },
    close() {
      chrome.tabs.onUpdated.removeListener(tabUpdateEventHandle);
    }
  }
}

/**
 * 执行复制任务
 * @param prefix 地址前缀
 * @param id 接口id
 */
const copyTaskHandle = debounce(async function (prefix: string, id: string) {
  const tmpCopyPageUrl = `${chrome.runtime.getURL('index.html')}#/copy`;
  const [win, res] = await Promise.all([
    chrome.windows.create({
      url: tmpCopyPageUrl,
      type: 'popup',
      state: 'fullscreen',
      focused: true,
    }),
    getYapiDataById(prefix, id)
  ]);
  let msgEventHandle: ((e: ServiceWorkerGlobalScopeEventMap['message']) => void) | null = null;
  try {
    await Promise.race([
      (async function () {
        if (res.err) throw res.err;
        const { reqSchema, resSchema, meta: { path, method, title } } = res;
        const reqTsCode = await compileJSONSchema2TS(reqSchema, 'Request');
        const resTsCode = await compileJSONSchema2TS(resSchema, 'Response');
        const tsCode = [
          generateComment(path, method, title),
          `/** 请求参数 */`,
          reqTsCode,
          `/** 返回值 */`,
          resTsCode
        ].join('\n');
        await new Promise<void>((resolve, reject) => {
          msgEventHandle = async (e: ServiceWorkerGlobalScopeEventMap['message']) => {
            // TODO: 增加 UUID Token 验证
            // @ts-ignore
            if (e?.source?.url === tmpCopyPageUrl) {
              // 拷贝页面准备就绪
              if (e.data?.type === CopyEventName.COPY_PAGE_READY) {
                e.source?.postMessage({
                  type: CopyEventName.COPY_CODE,
                  data: tsCode
                })
              }
              // 拷贝完成
              if (win?.id && e.data?.type === CopyEventName.COPY_CODE_FINISHED) {
                serviceWorkerMsg.off(msgEventHandle!);
                resolve();
              }
              // 拷贝失败
              if (win?.id && e.data?.type === CopyEventName.COPY_CODE_FAILED) {
                reject(e.data?.data);
              }
            }
          }
          serviceWorkerMsg.on(msgEventHandle);
        });

        // TODO: test
        // await new Promise((resolve) => setTimeout(() => resolve(null), 50 * 1000));

        await chrome.notifications.create(
          {
            type: 'basic',
            iconUrl: 'assets/images/icon128.png',
            title: '提示',
            message: '代码已复制到剪贴板'
          },
          id => {
            setTimeout(() => {
              chrome.notifications.clear(id);
            }, 1.5 * 1000);
          }
        );
      })(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('操作超时！')), LAZIEST_MODE_ACTION_TIMEOUT * 1000))
    ]);
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

    await chrome.notifications.create(
      {
        type: 'basic',
        iconUrl: 'assets/images/icon128.png',
        title: '错误',
        message: errMsg
      }
    );
  } finally {
    typeof win?.id === 'number' && await chrome.windows.remove(win.id);
  }
});

