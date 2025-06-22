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

export { apiGetUser, apiResetUser };
