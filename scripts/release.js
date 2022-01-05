// @ts-check

const ChromeExtension = require('crx');
const fs = require('fs-extra');
const path = require('path');
const { name, version } = require('../public/manifest.json');

if (!process.env.PRIVATE_KEY) {
  throw new Error(`PRIVATE_KEY not exist`)
}

const crx = new ChromeExtension({
  privateKey: process.env.PRIVATE_KEY,
});

crx
  .load(path.join(__dirname, '../build'))
  .then(crx => crx.pack())
  .then(crxBuffer => (
    fs.ensureDir(path.join(__dirname, `../release`))
      .then(() => {
        fs.writeFile(
          path.join(__dirname, `../release/${name}-${version}.crx`),
          crxBuffer,
          err => {
            if (err) {
              console.error(err);
              throw err;
            }
          }
        )
        fs.writeFile(
          path.join(__dirname, `../release/${name}-${version}.zip`),
          crxBuffer,
          err => {
            if (err) {
              console.error(err);
              throw err;
            }
          }
        )
      })
  ))
  .catch(err => {
    console.error(err);
    return Promise.reject(err);
  })
