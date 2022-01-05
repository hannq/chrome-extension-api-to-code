/**
 * 解析 YApi 地址
 * @param url
 * @returns
 */
 export function parseYApiUrl(url: string) {
  const matches = url.match(/\/project\/\d+\/interface\/api\/(\d+)$/);
  return matches && {
    prefix: url.replace(matches[0], ''),
    id: matches[1],
  }
}

/**
 * 解析 Swagger 地址
 * @param url
 */
export function parseSwaggerUrl(url: string) {
  const matches = url.match(/swagger-ui\.html#\/[^/]+\/(\w*Using([^_]+)(?:_\d)?)$/i);
  return matches && {
    prefix: url.replace(matches[0], ''),
    id: matches[1],
    method: matches[2].toLowerCase(),
  }
}

/**
 * 检查指定 url 是否受支持
 * @param url
 */
export function isSupportUrl(url: string) {
  return [parseYApiUrl, parseSwaggerUrl].some(parse => !!parse(url))
}
