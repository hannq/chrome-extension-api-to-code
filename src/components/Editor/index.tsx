import { type ForwardRefRenderFunction, forwardRef, useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useTheme } from '@/hooks/useTheme';
import { useOptions } from '@/hooks/useOptions';
import './index.module.less';

interface Props {}
export type Ref = monaco.editor.IStandaloneCodeEditor;
const media = window.matchMedia('(prefers-color-scheme: dark)');

const Editor: ForwardRefRenderFunction<Ref, Props> = (props, ref) => {
  const { ...rest } = props;
  const instanceRef = useRef<Ref | null>(null);
  const containerElRef = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const { editor: { editable } } = useOptions();
  useEffect(() => {
    if (containerElRef.current) {
      const isSystemDarkTheme = media.matches;
      const editor = monaco.editor.create(containerElRef.current, {
        language: 'typescript',
        theme: isSystemDarkTheme ? 'vs-dark' : 'vs',
        readOnly: true,
        minimap: { enabled: false }
      });
      instanceRef.current = editor;

      if (ref) {
        if (typeof ref === 'function') {
          ref(instanceRef.current);
        } else if ('current' in ref) {
          ref.current = instanceRef.current;
        }
      }
    }

    return () => instanceRef.current?.dispose();
  }, []);

  useEffect(() => {
    instanceRef.current?.updateOptions({
      theme: theme === 'dark' ? 'vs-dark' : 'vs',
      readOnly: !editable
    })
  }, [theme, editable]);

  return (
    <div styleName='editor-container' {...rest} ref={containerElRef} />
  )
}

export default forwardRef(Editor);
