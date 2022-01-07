import type { SidebarConfig } from '@vuepress/theme-default';

export const zh: SidebarConfig = [
  {
    text: '指南',
    children: [
      '/guide/README.md',
      '/guide/getting-started.md',
    ],
  },
  {
    text: '配置',
    children: [
      '/configuration/README.md',
    ],
  },
]
