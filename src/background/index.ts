import options from '@/utils/options';
import type { Options } from '@/types';
import { newWindowCopyService, generateCodeService, autoCopyService } from './service';

importScripts('lib/prettier.js');
importScripts('lib/parser-typescript.js');
importScripts('lib/parser-babel.js');
importScripts('lib/prettier-fix.js');
importScripts('lib/jstt.js');

chrome.runtime.onInstalled.addListener((detail) => detail.reason === 'install' && chrome.runtime.openOptionsPage())

;(async function() {
  newWindowCopyService.open();
  generateCodeService.open();
  const opts = await options.get();
  toggleServiceByOptions(opts);
  options.onChange(toggleServiceByOptions);
})();

function toggleServiceByOptions (opts: Options) {
  if (opts.beta.laziestMode) {
    autoCopyService.open();
  } else {
    autoCopyService.close();
  }
}
