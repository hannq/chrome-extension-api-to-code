export const OPTIONS_STORAGE_KEY = "OPTIONS_STORAGE_KEY";
/** Html 标签上 theme 标识位的值 */
export const THEME_ATTRIBUTE_KEY = 'data-theme';
/** 懒癌模式单次操作超时时间 单位(秒) */
export const LAZIEST_MODE_ACTION_TIMEOUT = 5;

/** 主题 */
export enum Theme {
  /** 自动获取操作系统主题 */
  AUTO = "THEME#AUTO",
  /** 暗黑主题 */
  DARK = "THEME#DARK",
  /** 亮色主题 */
  LIGHT = "THEME#LIGHT",
}

/** 拷贝专用事件集 */
export enum CopyEventName {
  COPY_PAGE_READY = 'COPY_EVENT#COPY_PAGE_READY',
  COPY_CODE = 'COPY_EVENT#COPY_CODE',
  COPY_CODE_FINISHED = 'COPY_EVENT#COPY_CODE_FINISHED',
  COPY_CODE_FAILED = 'COPY_EVENT#COPY_CODE_FAILED',
}

/** eventBus 事件集 */
export enum EventBusEventName {
  ALL = '*',
  /** options change event */
  OPTIONS_CHANGE = 'EVENT_BUS_EVENT#OPTIONS_CHANGE',
  /** storage change event */
  STORAGE_CHANGE = 'EVENT_BUS_EVENT#STORAGE_CHANGE',
  /** theme change event */
  THEME_CHANGE = 'EVENT_BUS_EVENT#THEME_CHANGE',
  /** theme change event */
  SERVICE_WORKER_MSG = 'EVENT_BUS_EVENT#SERVICE_WORKER_MSG',
}
