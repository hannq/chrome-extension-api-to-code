// @ts-check

const fs = require('fs');
const path = require("path");
const execa = require("execa");
const archiver = require('archiver');
const filesize = require('filesize');

;(async function() {
  await execa(
    'craco',
    [
      'build',
    ],
    {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    }
  );

  await execa(
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

  // zip bundle
  const output = fs.createWriteStream(path.join(__dirname, '../build.zip'));
  const archive = archiver('zip', { zlib: { level: 9 } });
  output.on('close', function() {
    console.log(`bundle zise:`, filesize(archive.pointer()));
  });
  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      console.warn('[zip warning]:', err.message);
    } else {
      throw err;
    }
  });
  archive.on('error', function(err) { throw err });
  archive.pipe(output);
  archive.directory(path.join(__dirname, '../build'), false);
  archive.finalize();

})();
