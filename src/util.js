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

export function fmtUrl(url, code) {
  if (DEV) {
    return `http://gallery.renj.io${url}?palaceCode=${code}`;
  }
  return `${url}?palaceCode=${code}`;
}