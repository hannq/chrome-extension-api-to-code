/**
 * A node.js command line app for packing Google Chrome extensions.
 * @doc [thom4parisot/crx](https://github.com/thom4parisot/crx)
 * */
declare module 'crx' {
  class ChromeExtension {
    constructor(opts: { privateKey: string });
    load(path: string): Promise<this>;
    pack(): Promise<Buffer>;
  }
  export = ChromeExtension;
}
