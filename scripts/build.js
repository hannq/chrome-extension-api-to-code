// @ts-check

const path = require("path");
const execa = require("execa");

;(async function() {
  execa.sync(
    'craco',
    [
      'build',
    ],
    {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    }
  );
  execa(
    'rollup',
    [
      '-c',
      '--environment',
      [
        `NODE_ENV:production`,
        `SOURCE_MAP:false`,
      ].join(',')
    ],
    {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    }
  );
})();
