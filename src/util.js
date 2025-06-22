// 工具类
const PalaceCodeName = 'palaceCode';
const DEV = import.meta.env.MODE === 'development';

export function getPalaceCode() {
  const code = localStorage.getItem(PalaceCodeName);

  return code || '';
}

export function savePalaceCode(code) {
  localStorage.setItem(PalaceCodeName, code);
}

export function clearPalaceCode() {
  localStorage.clear();
}

export function fmtUrl(url) {
  if (DEV) {
    url = 'http://192.168.0.111:12345' + url
  }
  if (url.includes('..')) {
    url = url.replaceAll('..', '')
  }
  return url;
}

export function withQuery(baseUrl, params) {
  const url = new URL(baseUrl);
  for (let key in params) {
    url.searchParams.append(key, params[key]);
  }
  return url
}