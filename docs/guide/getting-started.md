# 快速上手

## 依赖环境
请确保本地已安装 [新版 chrome 浏览器](https://www.google.com/chrome/) 或 [新版 Edge 浏览器](https://www.microsoft.com/en-us/edge)，为保证所有功能可用，建议安装 **最新版本**。

## 安装

### 选择 chrome store 安装

如果你可以直接访问 [chrome store](https://chrome.google.com/webstore/category/extensions)，[直接进入插件详情页](https://chrome.google.com/webstore/detail/api2code/dbbfiofnhjdopgpkoagbdcnccakpjcgo) 或 在入口搜索 `Api2code` 打开插件安装页面进行安装

### 选择 手动安装
如果你无法打开 `chrome store`，[点击这里](https://github.com/hannq/chrome-extension-api-to-code/releases) 下载 `release` 进行手动安装。

#### 手动安装步骤
1. 下载 `release` 页面下的 `Api2Code-x.x.x.x.zip` 文件（建议选择最新版本）
2. 打开 `chrome` [扩展程序管理页面](chrome://extensions/)
3. 确认 `开发者模式` 已打开
4. 将 `Api2Code-x.x.x.x.zip` 直接拖入即可完成安装

## 简单使用

::: tip
以下步骤以 `chrome` 浏览器 为例，`Edge` 浏览器同理。
:::

- **步骤1**: 将 `Api2Code` 插件固定到浏览器

<img :src="$withBase('/images/simple-use-guide-prepare.png')" alt="固定到浏览器示例图片" />

- **步骤2**: 打开 **接口文档**

::: tip
这里以 [YApi](https://github.com/ymfe/yapi) 为例，`Swagger` 同理。
:::

打开你的 `YApi 接口文档`，并进入到 `接口详情` 页面。

<img :src="$withBase('/images/yapi-api-detail-demo.png')" alt="打开yapi接口详情页示例图片" />

- **步骤3**: 点击 **插件按钮**

点击浏览器右上角 **插件按钮**，插件会自动获取当前页面地址，并自动根据页面信息生成对应的代码。

<img :src="$withBase('/images/auto-generate-detail-page-info-to-code.png')" alt="自动根据接口页面详情信息生成示例图片" />


现在，你已经熟悉了插件基础功能的使用。接下来，了解一下 [配置](../configuration) 相关的内容。
