import { fmtUrl, getPalaceCode } from "../util.js";

const apiGetUser = () => {
  return fetch(fmtUrl("/api/user/info"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
  });
};

export { apiGetUser };
