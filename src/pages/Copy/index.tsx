import { FC } from 'react'
import { useMount } from 'ahooks'
import { CopyEventName } from '@/constant'
import "./index.module.less";

const AutoCopy: FC = () => {
  useMount(() => {
    window.navigator.serviceWorker.controller?.postMessage({
      type: CopyEventName.COPY_PAGE_READY
    });
    window.navigator.serviceWorker.addEventListener('message', async (e) => {
      if (e.data.type === CopyEventName.COPY_CODE && e.data.data) {
        try {
          window.focus();
          if (document.hasFocus()) {
            await window.navigator.clipboard.writeText(e.data.data);
            window.navigator.serviceWorker.controller?.postMessage({
              type: CopyEventName.COPY_CODE_FINISHED
            });
          } else {
            window.navigator.serviceWorker.controller?.postMessage({
              type: CopyEventName.COPY_CODE_FAILED,
              data: `复制失败，请保持页面聚焦`
            });
          }
        } catch (e) {
          console.error(e);
          window.navigator.serviceWorker.controller?.postMessage({
            type: CopyEventName.COPY_CODE_FAILED,
            data: (e as Error)?.message || '复制失败'
          });
        }
      }
    }, { once: true })
  });

  return (
    <div styleName="copy-page-wrapper">
      <h1 styleName="tips">正在生成代码，请勿操作 ....</h1>
      <img src="./assets/images/copy-loading.jpg" alt="涩图" />
    </div>
  );
}

export default AutoCopy;
