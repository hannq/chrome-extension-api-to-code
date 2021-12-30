/**
 * ⚠️ 注意：此模块仅在 background service worker 中可用
 */

/// <reference lib="WebWorker" />
declare const self: ServiceWorkerGlobalScope;

import { EventBusEventName } from "@/constant";
import eventBus from "./eventBus";

type SWEventHandle = (e: ServiceWorkerGlobalScopeEventMap['message']) => void;

self.addEventListener('message', e => eventBus.emit(EventBusEventName.SERVICE_WORKER_MSG, e))

function createServiceWorkerMsg() {
  return {
    on(handle: SWEventHandle) {
      eventBus.on(EventBusEventName.SERVICE_WORKER_MSG, handle);
    },
    once(handle: SWEventHandle) {
      eventBus.once(EventBusEventName.SERVICE_WORKER_MSG, handle);
    },
    off(handle: SWEventHandle) {
      eventBus.off(EventBusEventName.SERVICE_WORKER_MSG, handle);
    },
  }
}

export default createServiceWorkerMsg();
