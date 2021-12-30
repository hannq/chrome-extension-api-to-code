import { type FC, useRef, useState } from 'react';
import { useMount } from 'ahooks';
import { type Input, message, Button } from 'antd';
import classnames from 'classnames';
import Editor, { type Ref as EditorRef } from '@/components/Editor';
import SearchBar from './components/SearchBar';
import { getYapiDataById, compileJSONSchema2TS, parseYApiUrl, generateComment } from '@/utils';
import options from '@/utils/options';
import './index.module.less';

const Options: FC = () => {
  const editorRef = useRef<EditorRef>(null);
  const searchRef = useRef<Input>(null);
  const [isEditorFucus, setIsEditorFucus] = useState(false);

  useMount(async () => {
    editorRef.current?.onDidFocusEditorText(() => setIsEditorFucus(true));
    editorRef.current?.onDidBlurEditorText(() => setIsEditorFucus(false));
    if (chrome.tabs) {
      // TODO: 使用 useRequest 替换
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const { prefix, id } = parseYApiUrl(tab.url || '') || {};
      if (prefix && id) {
        const res = await getYapiDataById(prefix, id);
        if (!res.err) {
          const { resSchema, reqSchema, meta: { path, method, title } } = res;
          const reqTsCode = await compileJSONSchema2TS(reqSchema, 'Request')
          const resTsCode = await compileJSONSchema2TS(resSchema, 'Response')
          const code = [
            generateComment(path, method, title),
            `/** 请求参数 */`,
            reqTsCode,
            `/** 返回值 */`,
            resTsCode
          ].join('\n')
          editorRef.current?.setValue(code);
          searchRef.current?.setValue(tab.url || '');
          const { basic: { autoCopyAfterGenCode } } = await options.get();
          if (autoCopyAfterGenCode) {
            await window.navigator.clipboard.writeText(code);
            message.success('已复制到剪贴板');
          }
        } else {
          message.error(res.err.message);
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
          const { prefix, id } = parseYApiUrl(url) || {};
          if (prefix && id) {
            const res = await getYapiDataById(prefix, id);
            if (!res.err) {
              const { resSchema, reqSchema, meta: { path, method, title } } = res;
              const reqTsCode = await compileJSONSchema2TS(reqSchema, 'Request')
              const resTsCode = await compileJSONSchema2TS(resSchema, 'Response')
              const code = [
                generateComment(path, method, title),
                `/** 请求参数 */`,
                reqTsCode,
                `/** 返回值 */`,
                resTsCode
              ].join('\n')
              editorRef.current?.setValue(code);
              const { basic: { autoCopyAfterGenCode } } = await options.get();
              if (autoCopyAfterGenCode) {
                await window.navigator.clipboard.writeText(code);
                message.success('已复制到剪贴板');
              }
            } else {
              message.error(res.err.message);
            }
          } else message.error(`不支持的域名地址`);
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
