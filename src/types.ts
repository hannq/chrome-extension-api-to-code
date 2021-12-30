import { Theme, CopyEventName, EventBusEventName } from './constant';

export type ThemeType =
  /** 暗黑模式 */
  | 'dark'
  /** 亮色模式 */
  | 'light'

interface BasicOptions {
  /** 主题 */
  theme: Theme;
  /** 生成代码后自动复制 */
  autoCopyAfterGenCode: boolean;
}

interface EditorOptions {
  /** 编辑器是否可编辑 */
  editable: boolean;
}

interface BetaOptions {
  /** 懒癌模式 */
  laziestMode: boolean;
}

export interface Options {
  /** 基础配置 */
  basic: BasicOptions
  /** 编辑器配置 */
  editor: EditorOptions
  /** 实验性功能 */
  beta: BetaOptions
}

// export type CopyEventMap = Record<CopyEventName, ServiceWorkerGlobalScopeEventMap['message']>

export type EventBusEventMap = {
  /** options change event */
  [EventBusEventName.ALL]: EventBusEventMap;
  /** options change event */
  [EventBusEventName.OPTIONS_CHANGE]: Options;
  /** storage change event */
  [EventBusEventName.STORAGE_CHANGE]: any;
  /** storage change event */
  [EventBusEventName.THEME_CHANGE]: ThemeType;
  /** storage change event */
  [EventBusEventName.SERVICE_WORKER_MSG]: ServiceWorkerGlobalScopeEventMap['message'];
}
