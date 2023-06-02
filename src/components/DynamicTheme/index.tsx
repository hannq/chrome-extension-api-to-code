import { type FC } from 'react';
import { createPortal } from 'react-dom';
import { theme } from 'antd';
import { ANTD_PREFIX_CLS } from '@/constant';

const { useToken } = theme;

const DynamicTheme: FC = () => {
  const { token: {
    colorBorder,
    colorBgContainer,
    colorPrimaryHover,
    controlOutline
  } } = useToken();
  // const { token } = useToken();
  // console.log(token)

  const styleContent = /* css */ `
    :root {
      --${ANTD_PREFIX_CLS}-color-border: ${colorBorder};
      --${ANTD_PREFIX_CLS}-color-bg-container: ${colorBgContainer};
      --${ANTD_PREFIX_CLS}-color-primary-hover: ${colorPrimaryHover};
      --${ANTD_PREFIX_CLS}-control-outline: ${controlOutline};
    }

    :root[data-theme] .monaco-editor {
      --vscode-editor-background: ${colorBgContainer};
      --vscode-editorGutter-background: ${colorBgContainer};
    }
  `;

  return createPortal(
    <style data-global-variables>{ styleContent }</style>,
    document.head
  )
}

export default DynamicTheme
