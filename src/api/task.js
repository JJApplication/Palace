import { fmtUrl, getPalaceCode } from "../util.js";

const apiQueryTasks = () => {
  return fetch(fmtUrl("/api/task/list"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "get",
    mode: "cors",
    cache: "no-cache",
  });
};

const apiClearTasks = () => {
  return fetch(fmtUrl("/api/task/clear/task"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
  });
};

const apiClearImages = () => {
  return fetch(fmtUrl("/api/task/clear/image"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
  });
};

const apiRemovePosition = () => {
  return fetch(fmtUrl("/api/task/removepos"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
  });
};

const apiPackageImages = () => {
  return fetch(fmtUrl("/api/task/package"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
  });
};

const apiSyncHide = () => {
  return fetch(fmtUrl("/api/task/sync/hide"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
  });
};

const apiSyncImageLike = () => {
  return fetch(fmtUrl("/api/task/sync/image"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
  });
};

const apiSyncAlbumLike = () => {
  return fetch(fmtUrl("/api/task/sync/album"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
  });
};

export {
  apiQueryTasks,
  apiPackageImages,
  apiRemovePosition,
  apiClearImages,
  apiClearTasks,
  apiSyncHide,
  apiSyncImageLike,
  apiSyncAlbumLike,
};
