import mitt from 'mitt';
import type { EventBusEventMap, /** CopyEventMap */ } from '../types';

declare module "mitt" {
  interface Emitter<Events extends Record<EventType, unknown>> {
    once<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;
    once(type: '*', handler: WildcardHandler<Events>): void;
  }
}

type Events = EventBusEventMap // & CopyEventMap;

function hyperMitt () {
  const eventBusBase = mitt<Events>();
  const eventBus: typeof eventBusBase = Object.create(eventBusBase);

  eventBus.once = function <K extends keyof Events>(type: K, handler: Function) {
    const onceHandler = (...args: any[]) => {
      handler(...args);
      eventBusBase.off(type, onceHandler);
    }
    eventBusBase.on(type, onceHandler);
  }

  return eventBus;
}


export default hyperMitt();
