import { useEffect, useState } from 'react';
import { ThemeType } from '@/types';
import { THEME_ATTRIBUTE_KEY, EventBusEventName } from '@/constant';
import eventBus from '@/utils/eventBus';



const observer = new MutationObserver(function (mutationsList) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'attributes' && mutation.attributeName === THEME_ATTRIBUTE_KEY && mutation.target === document.documentElement) {
      const theme = document.documentElement.getAttribute(THEME_ATTRIBUTE_KEY) as ThemeType || 'light';
      eventBus.emit(EventBusEventName.THEME_CHANGE, theme);
    }
  }
});

observer.observe(document.documentElement, { attributes: true });

/**
 * 获取当前主题
 */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeType>(() => document.documentElement.getAttribute(THEME_ATTRIBUTE_KEY) as ThemeType || 'light');
  useEffect(() => {
    eventBus.on(EventBusEventName.THEME_CHANGE, setTheme);
    return () => eventBus.off(EventBusEventName.THEME_CHANGE, setTheme);
  })
  return theme;
};
