// 工具类
const PalaceCodeName = "palaceCode";
const DEV = import.meta.env.MODE === "development";

export function getPalaceCode() {
  const code = localStorage.getItem(PalaceCodeName);

  return code || "";
}

export function savePalaceCode(code) {
  localStorage.setItem(PalaceCodeName, code);
}

export function clearPalaceCode() {
  localStorage.clear();
}

export function fmtUrl(url) {
  if (DEV) {
    url = "http://127.0.0.1:12345" + url;
  }
  if (url.includes("..")) {
    url = url.replaceAll("..", "");
  }
  return url;
}

export function withQuery(baseUrl, params) {
  const origin = window.location.origin;
  if (baseUrl.indexOf("http://") <= -1 && baseUrl.indexOf("https://") <= -1) {
    baseUrl = `${origin}${baseUrl}`;
  }
  const url = new URL(baseUrl);
  for (let key in params) {
    url.searchParams.append(key, params[key]);
  }
  return url;
}

export function getDate(timestamp) {
  if (timestamp) {
    const str = timestamp.split("T");
    return str[0] ? str[0] : timestamp;
  }
  return "";
}

export function noCover() {
  return "https://cdn.pixabay.com/photo/2022/01/25/12/16/laptop-6966045_960_720.jpg";
}
export function getPrivilege(privilege) {
  switch (privilege) {
    case 0: {
      return "guest";
    }
    case 1: {
      return "super-admin";
    }
    case 2: {
      return "admin";
    }
    case 3: {
      return "editor";
    }
    default: {
      return "guest";
    }
  }
}

export function isSuperAdmin(p) {
  return p === "super-admin";
}

export function isAdmin(p) {
  return p === "super-admin" || p === "admin";
}

export function isGuest(p) {
  return p === "guest";
}

export function isEditor(p) {
  return p === "editor";
}

/**
 * 根据参数生成真实的图片请求路径
 * 避免受缓存影响图片请求url增加query参数session,timestamp(以日为最小粒度)
 * @param path
 * @param uuid
 * @param ext
 */
export function getImageUrl(path, uuid, ext) {
  if (!getPalaceCode() || getPalaceCode() === "") {
    return `${path}${uuid}${ext}`;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 将时分秒毫秒设为0
  const timestamp = today.getTime();
  const userSession = encodeURIComponent(getPalaceCode())

  return `${path}${uuid}${ext}?session=${userSession}&timestamp=${timestamp}`;
}