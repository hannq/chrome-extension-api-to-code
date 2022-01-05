import type JSTT from 'json-schema-to-typescript';
import type { GetApiDataByIdResSuccess, GetApiDataByIdResFailed } from '@/types';
export * from './urlParser';

declare const jstt: typeof JSTT;

/**
 * 把多行文本注释转换为单行
 * @param content
 * @returns
 */
export function formatComment2SingleLine(content = '') {
  return content.replace(/\/\*([^/]*)\*\//mg, (_, p1) => `/** ${p1.replace(/[*\s\n]/gm, '')} */`)
}

/**
 * 获取 YApi 接口详情
 * @param prefix 地址前缀
 * @param id yapi项目id
 */
export async function getYapiDataById(prefix: string, id: string): Promise<GetApiDataByIdResSuccess | GetApiDataByIdResFailed> {
  const res = await fetch(`${prefix}/api/interface/get?id=${id}`, {
    "headers": {
      "accept": "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9",
    },
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  }).then(res => res.json());
  // 鉴权未通过
  if (res.errcode === 40011) {
    // TODO: 弹出登录窗口
    return {
      meta: null,
      reqSchema: null,
      resSchema: null,
      err: new Error('请登陆 ...')
    }
  }

  if (res.errcode === 490) {
    // 接口不存在
    return {
      meta: null,
      reqSchema: null,
      resSchema: null,
      err: new Error('接口不存在或已被删除，请检查接口信息')
    }
  }

  if (res.errcode !== 0) {
    // 请求不成功
    return {
      meta: null,
      reqSchema: null,
      resSchema: null,
      err: new Error(res.errmsg || '请求失败')
    }
  }

  const {
    req_body_is_json_schema,
    req_body_other,
    res_body_is_json_schema,
    res_body,
    method,
    path,
    title
  } = res?.data || {};
  const reqSchema = req_body_is_json_schema ? tryJsonParse(req_body_other, {}) : {};
  const resSchema = res_body_is_json_schema ? tryJsonParse(res_body, {}) : {};
  const meta = { method: method?.trim(), path: path?.trim(), title: title?.trim() }

  return {
    meta,
    reqSchema,
    resSchema,
    err: null
  }
}


export async function getSwaggerData(prefix: string, id: string, method: string): Promise<GetApiDataByIdResSuccess | GetApiDataByIdResFailed> {
  try {
    const swaggerResourcesRes = await fetch(`${prefix}/swagger-resources`, {
      "headers": {
        "accept": "application/json",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/json",
      },
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    }).then(res => res.json());
    const apiDocsPath = swaggerResourcesRes?.[0]?.location;
    if (apiDocsPath) {
      const res = await fetch(`${prefix}/${apiDocsPath}`, {
        "headers": {
          "accept": "application/json,*/*",
          "accept-language": "zh-CN,zh;q=0.9",
          "cache-control": "no-cache",
          "pragma": "no-cache",
          "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin"
        },
        "referrer": "https://mcyg.taoljt.com/mbff/swagger-ui.html",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      }).then(res => res.json());
      if (res?.error || !res?.paths || !res?.definitions) throw new Error(`获取 swagger 接口列表信息失败`);
      const { paths, definitions } = res
      const target = Object.entries(paths).find(([, info]: [string, any]) => info?.[method]?.operationId === id) as [string, any] | null;
      if (target) {
        const [path, info] = target;
        const rawReqSchema = info?.[method]?.parameters?.[1]?.schema;
        const rawResSchema = info?.[method]?.responses?.[200]?.schema;
        const reqRef = rawReqSchema?.originalRef;
        const resRef = rawResSchema?.originalRef;
        definitions.List = definitions.List || {}
        const reqSchema = reqRef ? { ...definitions[reqRef], definitions } : { ...rawReqSchema, definitions};
        const resSchema = resRef ? { ...definitions[resRef], definitions } : { ...rawResSchema, definitions };
        delete reqSchema.title;
        delete resSchema.title;

        return {
          meta: { method, path, title: info?.[method]?.summary || '' },
          reqSchema,
          resSchema,
          err: null
        }
      } throw new Error(`未找到指定接口`)
    } else throw new Error('获取 swagger api docs 地址失败');
  } catch (err) {
    console.error(err);
    return {
      meta: null,
      reqSchema: null,
      resSchema: null,
      err: err instanceof Error ? err : new Error(`未知错误`)
    }
  }
}

const jsttCompileConfigOptions = {
  bannerComment: '',
  style: {
    bracketSpacing: false,
    printWidth: 120,
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'none',
    useTabs: false,
  },
  strictIndexSignatures: true,
} as const;

/**
 * 把 JSON Schema 转换为 TypeScript 类型
 * @param schema
 * @param name
 * @returns
 */
export function compileJSONSchema2TS(schema: object, name: string) {
  return jstt.compile(schema, name, jsttCompileConfigOptions)
    .then(code => formatComment2SingleLine(code))
    .catch(err => (console.error(err), ''));
}

/**
 * 生成注释
 * @param path 页面地址
 * @param method 请求方法
 * @param desc 接口描述
 * @returns
 */
export function generateComment(path: string, method: string, desc: string) {
  return [
    `/**`,
    ` * @path ${path}`,
    ` * @method ${method}`,
    ` * @desc ${desc}`,
    ` */`,
    ``
  ].join('\n');
}

/** 使用 JSON.stringify 生成字符串，当出现错误时，返回原值或fallback */
export function tryJsonStringify(value: Record<string, any>, fallback?: string): string {
  fallback = typeof fallback === 'string' ? fallback : String(value);
  try {
    return JSON.stringify(value);
  } catch (err) {
    console.error(err);
    return fallback;
  }
}

/**
 * 使用 JSON.parse 生成对象，当出现错误时，返回原值或fallback
 * @param value
 * @returns
 */
export function tryJsonParse(value: string | null, fallback: any = value): Record<string, any> {
  try {
    return value && JSON.parse(value);
  } catch (err) {
    return fallback;
  }
}
