import { fmtUrl, getPalaceCode } from "../util.js";

const apiStorage = () => {
  return fetch(fmtUrl("/api/image/storage"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "get",
    mode: "cors",
    cache: "no-cache",
  });
};

export { apiStorage };