export const getQUeryQuestionMark = (url: string): string =>
  url.indexOf('?') < 0 ? '?' : '';

export const encodeParamsToUrl = (params: Record<string, unknown>): string =>
  Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`
    )
    .join('&');

export const decodeUrlToParams = <T = Record<string, unknown>>(
  url: string
): T => {
  const result = {};
  url
    .replace(/^\?/, '')
    .split('&')
    .forEach((chunk) => {
      const [key, value] = chunk.split('=');
      result[decodeURIComponent(key)] = decodeURIComponent(value);
    });
  return result as T;
};
