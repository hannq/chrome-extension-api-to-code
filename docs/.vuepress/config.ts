import { type DefaultThemeOptions, defineUserConfig } from 'vuepress';
import { sidebar, navbar } from './configs'
import { name, description, PUBLIC_URL } from './configs/meta';

export default defineUserConfig<DefaultThemeOptions>({
  // site config
  base: PUBLIC_URL,
  title: name,
  description,
  locales: {
    "/": {
      lang: 'zh-CN',
    },
    "/en/": {
      lang: 'en-US',
    },
  },
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: `${PUBLIC_URL}images/icons/favicon16.png`,
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: `${PUBLIC_URL}/images/icons/favicon32.png`,
      },
    ],
    ['meta', { name: 'application-name', content: 'Api2Code' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'Api2Code' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
    ['meta', { name: 'google-site-verification', content: 'i1qnePvMRL6PfrMWQzPoUUoErpMa56ogIhNtNdMSYmo' }],
  ],

  // theme and its config
  theme: '@vuepress/theme-default',
  themeConfig: {
    logo: '/images/logo.png',

    locales: {
      /**
       * Chinese locale config
       */
      "/": {
        // navbar
        navbar: navbar.zh,

        selectLanguageName: '简体中文',
        selectLanguageText: '选择语言',
        selectLanguageAriaLabel: '选择语言',

        // sidebar
        sidebar: sidebar.zh,

        // page meta
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdatedText: '上次更新',
        contributorsText: '贡献者',

        // custom containers
        tip: '提示',
        warning: '注意',
        danger: '警告',

        // 404 page
        notFound: [
          '这里什么都没有',
          '我们怎么到这来了？',
          '这是一个 404 页面',
          '看起来我们进入了错误的链接',
        ],
        backToHome: '返回首页',

        // a11y
        openInNewWindow: '在新窗口打开',
        toggleDarkMode: '切换夜间模式',
        toggleSidebar: '切换侧边栏',
      },
      /**
       * English locale config
       */
      "/en/": {
        // navbar
        navbar: navbar.en,

        selectLanguageName: 'English',
        selectLanguageText: 'English',
        selectLanguageAriaLabel: 'English',

        // sidebar
        sidebar: sidebar.en,

        // page meta
        editLinkText: 'Edit this page on GitHub',
      },
    },
  },

  // common config
  // ...

  plugins: [
    // [
    //   '@vuepress/plugin-docsearch',
    //   {
    //     apiKey: '3a539aab83105f01761a137c61004d85',
    //     indexName: 'vuepress',
    //     searchParameters: {
    //       facetFilters: ['tags:v2'],
    //     },
    //     locales: {
    //       '/zh/': {
    //         placeholder: '搜索文档',
    //       },
    //     },
    //   },
    // ]
  ]


})
