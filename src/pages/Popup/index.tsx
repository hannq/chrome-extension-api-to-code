import { type FC, useRef, useState } from 'react';
import { useMount } from 'ahooks';
import { type Input, message, Button } from 'antd';
import classnames from 'classnames';
import Editor, { type Ref as EditorRef } from '@/components/Editor';
import { isSupportUrl } from '@/utils/urlParser';
import { ExtensionMsgEventName } from '@/constant';
import { MessageRes } from '@/types';
import options from '@/utils/options';
import SearchBar from './components/SearchBar';
import './index.module.less';
const getCodeByUrl = async (url: string) => {
  try {
    chrome.runtime.sendMessage({ type: ExtensionMsgEventName.GENERATE_CODE, data: url });
    return await Promise.race([
      new Promise<string>((resolve, reject) => {
        const msgResHandle = (res: MessageRes<ExtensionMsgEventName.GENERATE_CODE, string>) => {
          if (res.type === ExtensionMsgEventName.GENERATE_CODE) {
            chrome.runtime.onMessage.removeListener(msgResHandle);
            const { data, err } = res;
            if (!err) resolve(data!)
            else reject(new Error(err))
          }
        }
        chrome.runtime.onMessage.addListener(msgResHandle)
      }),
      new Promise<string>((_, reject) => setTimeout(reject, 5 * 1000, new Error(`生成代码超时`)))
    ]);
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

const Options: FC = () => {
  const editorRef = useRef<EditorRef>(null);
  const searchRef = useRef<Input>(null);
  const [isEditorFucus, setIsEditorFucus] = useState(false);

  useMount(async () => {
    editorRef.current?.onDidFocusEditorText(() => setIsEditorFucus(true));
    editorRef.current?.onDidBlurEditorText(() => setIsEditorFucus(false));
    const { basic: { autoCopyAfterGenCode } } = await options.get();
    if (chrome.tabs) {
      // TODO: 使用 useRequest 替换
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const url = tab.url;
      if (url && isSupportUrl(url)) {
        try {
          searchRef.current?.setValue(url);
          const code = await getCodeByUrl(url);
          editorRef.current?.setValue(code);
          if (autoCopyAfterGenCode) {
            await navigator.clipboard.writeText(code);
            message.success('代码已复制到剪贴板');
          }
        } catch (err) {
          message.error((err as Error).message);
        }
      }
    } else message.error(`非 chrome 插件环境 或 未获得 tabs 权限`);
  });

  return (
    <div styleName="options-wrapper">
      <SearchBar
        ref={searchRef}
        onSearch={async (url) => {
          if (!url) return;
          if (url && isSupportUrl(url)) {
            try {
              searchRef.current?.setValue(url);
              const code = await getCodeByUrl(url);
              editorRef.current?.setValue(code);
              const { basic: { autoCopyAfterGenCode } } = await options.get();
              if (autoCopyAfterGenCode) {
                await navigator.clipboard.writeText(code || '');
                message.success('代码已复制到剪贴板');
              }
            } catch (err) {
              message.error((err as Error).message);
            }
          }
        }}
      />
      <div styleName={classnames("editor-wrapper", { focus: isEditorFucus })}>
        <Editor ref={editorRef} />
        <Button
          styleName="copy-btn"
          type="primary"
          onClick={async () => {
            const code = editorRef.current?.getValue();
            if (code) {
              await window.navigator.clipboard.writeText(code);
              message.success('已复制到剪贴板');
            }
          }}
        >复制</Button>
      </div>
    </div>
  )
}

export default Options;
