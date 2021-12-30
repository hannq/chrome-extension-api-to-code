// @ts-check

const path = require("path");
const execa = require("execa");

;(async function() {
  execa(
    'rollup',
    [
      '-wc',
      '--environment',
      [
        `NODE_ENV:development`,
        `SOURCE_MAP:true`,
      ].join(',')
    ],
    {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    }
  );
  execa(
    'craco',
    [
      'start',
    ],
    {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    }
  );
})();
