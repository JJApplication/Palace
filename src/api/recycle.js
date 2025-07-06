import { fmtUrl, getPalaceCode } from "../util.js";

const apiGetRecycleImageList = () => {
  return fetch(fmtUrl("/api/image/recycle"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "get",
    mode: "cors",
    cache: "no-cache",
  });
};

const apiRecycleImage = (data) => {
  return fetch(fmtUrl("/api/image/recycle/delete"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(data),
  });
};

const apiRestoreImage = (data) => {
  return fetch(fmtUrl("/api/image/recycle/restore"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(data),
  });
};

export { apiGetRecycleImageList, apiRecycleImage, apiRestoreImage };
