// https://craco.js.org/docs/category/configuration/

import path from'path';
import webpack from 'webpack';
import { getLoader, loaderByName, whenProd, whenDev } from '@craco/craco';
import type { CracoConfig } from '@craco/types';
import CopyPlugin from 'copy-webpack-plugin';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import pkg from './package.json';
const CracoLessPlugin = require('craco-less-craco7');
const CSS_MODULE_LOCAL_IDENT_NAME = '[local]___[hash:base64:5]';
const moduleName = pkg.name.split('/').pop();
const moduleVersion = pkg.version;

module.exports = (): CracoConfig => {
  // @ts-ignore
  process.env.GENERATE_SOURCEMAP = process.env.NODE_ENV === 'development';
  return {
    webpack: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      plugins: {
        add: [
          new webpack.DefinePlugin({
            APP_NAME: JSON.stringify(moduleName),
            APP_VERSION: JSON.stringify(moduleVersion),
          }),
          new MonacoWebpackPlugin({
            languages: ['typescript']
          }),
          ...whenDev(() => [
            new webpack.DefinePlugin({ __DEV__: true })], [])!,
          ...whenProd(() => [new webpack.DefinePlugin({ __DEV__: false })], [])!,
        ]
      },
      configure: (webpackConfig, { paths }) => {
        const { match } = getLoader(webpackConfig, loaderByName('babel-loader'));
        match!.loader!.include = [path.resolve(__dirname, 'src')];
        webpackConfig.externals = {
          'json-schema-to-typescript': 'jstt'
        };
        webpackConfig.plugins?.push(
          ...whenDev(() => [
            new webpack.DefinePlugin({ __DEV__: true }),
            new CopyPlugin({
              patterns: [
                {
                  from: paths!.appPublic,
                  to: paths!.appBuild,
                  filter: async (resourcePath) => !resourcePath.endsWith(path.join(paths!.appPublic, 'index.html'))
                },
              ]
            })
          ], [])!
        );
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
      {
        plugin: CracoLessPlugin,
        options: {
          lessLoaderOptions: {
            additionalData: `@import (reference) '@/assets/styles/variables.less';`,
            lessOptions: {
              modifyVars: require('./theme'),
              javascriptEnabled: true,
            },
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
        // [
        //   'import',
        //   {
        //     libraryName: 'antd',
        //     libraryDirectory: 'es',
        //   },
        // ],
      ],
    },
  };
};
