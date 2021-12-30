// https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration-overview

const CracoLessPlugin = require('@dr2009/craco-less');
const path = require('path');
const webpack = require('webpack');
const { getLoader, loaderByName, whenProd, whenDev } = require('@craco/craco');
const modifiedTheme = require('./theme');
const pkg = require('./package.json');
const CopyPlugin = require("copy-webpack-plugin");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const { appBuild, appPublic } = require("react-scripts/config/paths");

const CSS_MODULE_LOCAL_IDENT_NAME = '[local]___[hash:base64:5]';
const moduleName = (pkg.moduleName || pkg.name).split('/').pop();
const moduleVersion = pkg.version;

module.exports = () => {
  process.env.GENERATE_SOURCEMAP = process.env.NODE_ENV === 'development';

  return {
    webpack: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      plugins: [
        new webpack.DefinePlugin({
          APP_NAME: JSON.stringify(moduleName),
          APP_VERSION: JSON.stringify(moduleVersion),
        }),
        new MonacoWebpackPlugin({
          languages: ['typescript']
        }),
        ...whenDev(() => [
          new webpack.DefinePlugin({ __DEV__: true }),
          new CopyPlugin({
            patterns: [
              {
                from: appPublic,
                to: appBuild,
                filter: async (resourcePath) => !resourcePath.endsWith(path.join(appPublic, 'index.html'))
              },
            ]
          })
        ], []),
        ...whenProd(() => [new webpack.DefinePlugin({ __DEV__: false })], []),
      ],
      /**
       * @param webpackConfig { import ('webpack').Configuration }
       **/
      configure: (webpackConfig, { env, paths }) => {
        const { match } = getLoader(webpackConfig, loaderByName('babel-loader'));
        match.loader.include = [path.resolve(__dirname, 'src')];
        webpackConfig.externals = {
          'json-schema-to-typescript': 'jstt'
        };
        return webpackConfig;
      },
    },
    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      devMiddleware: {
        writeToDisk: true
      }
    },
    plugins: [
      // 项目自身的 less 配置
      {
        plugin: CracoLessPlugin,
        options: {
          lessLoaderOptions: {
            additionalData: `@import (reference) '@/mixins.less';`,
            lessOptions: {
              modifyVars: modifiedTheme,
              javascriptEnabled: true,
            },
          },
          cssLoaderOptions: {
            modules: {
              localIdentName: CSS_MODULE_LOCAL_IDENT_NAME,
            },
          },
          modifyLessRule: (lessRule, _context) => {
            // lessRule.test = /\.less$/; // default: /\.module\.less$/
            return lessRule;
          },
          modifyLessModuleRule: (lessRule, _context) => {
            // .concat(lessRule.exclude)
            lessRule.exclude = [/node_modules/]; // antd less文件不需要css modules
            return lessRule;
          },
        },
      },
    ],
    style: {
      modules: {
        localIdentName: CSS_MODULE_LOCAL_IDENT_NAME,
      },
    },
    babel: {
      plugins: [
        [
          '@dr.pogodin/react-css-modules',
          {
            webpackHotModuleReloading: true,
            autoResolveMultipleImports: true,
            generateScopedName: CSS_MODULE_LOCAL_IDENT_NAME,
            filetypes: {
              '.less': {
                syntax: 'postcss-less',
              },
            },
          },
        ],
        [
          'import',
          {
            libraryName: 'antd',
            libraryDirectory: 'es',
          },
        ],
      ],
    },
  };
};
