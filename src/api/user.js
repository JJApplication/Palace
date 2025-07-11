import { fmtUrl, getPalaceCode } from "../util.js";

const apiGetUser = () => {
  return fetch(fmtUrl("/api/user/info"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "get",
    mode: "cors",
    cache: "no-cache",
  });
};

const apiResetUser = (data) => {
  return fetch(fmtUrl("/api/user/reset"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(data),
  });
};

const apiUpdateUser = (data) => {
  return fetch(fmtUrl("/api/user/update"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(data),
  });
};

const apiResetUserAvatar = () => {
  return fetch(fmtUrl("/api/user/avatar/reset"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache"
  });
};

const apiUploadAvatar = (formData) => {
  let url = fmtUrl("/api/user/avatar/upload")
  return fetch(url, {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
    body: formData,
  });
};


export { apiGetUser, apiResetUser, apiUpdateUser, apiResetUserAvatar, apiUploadAvatar };
