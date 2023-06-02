/** antd prefixCls 配置字段 */
export const ANTD_PREFIX_CLS = 'api-to-code';

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
export enum NewWindowCopyEventName {
  /** 拷贝页面准备完毕 */
  COPY_PAGE_READY = 'NEW_WINDOW_COPY#COPY_PAGE_READY',
  /** 拷贝代码 */
  COPY_CODE = 'NEW_WINDOW_COPY#COPY_CODE',
  /** 拷贝代码完毕 */
  COPY_CODE_FINISHED = 'NEW_WINDOW_COPY#COPY_CODE_FINISHED',
  /** 拷贝代码失败 */
  COPY_CODE_FAILED = 'NEW_WINDOW_COPY#COPY_CODE_FAILED',
}

/** extension msg 事件集 */
export enum ExtensionMsgEventName {
  /** 执行新窗口拷贝操作 */
  RUN_NEW_WINDOW_COPY = 'EXTENSION_MSG_EVENT_NAME#RUN_NEW_WINDOW_COPY',
  /** 生成代码 */
  GENERATE_CODE = 'EXTENSION_MSG_EVENT_NAME#GENERATE_CODE',
  /** 生成代码 */
  AUTO_COPY = 'EXTENSION_MSG_EVENT_NAME#AUTO_COPY',
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
  /** service worker event */
  SERVICE_WORKER_MSG = 'EVENT_BUS_EVENT#SERVICE_WORKER_MSG',
  /** extension event */
  EXTENSION_MSG = 'EVENT_BUS_EVENT#EXTENSION_MSG',
}
