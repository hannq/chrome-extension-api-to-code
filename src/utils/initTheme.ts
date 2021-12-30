import { Theme } from '../constant';
import options from './options';

/**
 * 初始化主题
 */
export async function initTheme() {
  let { basic: { theme } } = await options.get();
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const mediaOnChangehandle = (e: MediaQueryListEvent) => {
    const isSystemDarkTheme = e.matches;
    document.documentElement.setAttribute('data-theme', isSystemDarkTheme ? 'dark' : 'light');
  }
  handleThemeChange(theme);
  options.onChange(nextOpts => {
    const nextTheme = nextOpts?.basic?.theme;
    nextTheme && handleThemeChange(nextTheme);
  })

  function handleThemeChange(theme: Theme) {
    if (theme === Theme.AUTO) {
      const isDefaultSystemDarkTheme = media.matches;
      document.documentElement.setAttribute('data-theme', isDefaultSystemDarkTheme ? 'dark' : 'light');
      media.removeEventListener('change', mediaOnChangehandle);
      media.addEventListener('change', mediaOnChangehandle);
    } else {
      const themeMap = {
        [Theme.DARK]: 'dark',
        [Theme.LIGHT]: 'light',
      }
      document.documentElement.setAttribute('data-theme', themeMap[theme]);
    }
  }
};
