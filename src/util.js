// 工具类
const PalaceCodeName = 'palaceCode';
const DEV = false;

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
  if (url.includes('..')) {
    url = url.replaceAll('..', '')
  }
  return url;
}