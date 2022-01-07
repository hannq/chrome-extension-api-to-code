import type { SidebarConfig } from '@vuepress/theme-default';

export const en: SidebarConfig = [
  {
    text: 'Guide',
    children: [
      '/en/guide/README.md',
      '/en/guide/getting-started.md',
    ],
  },
  {
    text: 'configuration',
    children: [
      '/en/configuration/README.md',
    ],
  },
]
