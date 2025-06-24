import { fmtUrl, getPalaceCode } from "../util.js";

const apiGetImageList = () => {
  return fetch(fmtUrl("/api/image/list"), {
    method: "get",
    mode: "cors",
    cache: "no-cache",
  });
}

const apiGetImageCount = () => {
  return fetch(fmtUrl("/api/image/count"), {
    method: "get",
    mode: "cors",
    cache: "no-cache",
  });
}

const apiHideImage = (data) => {
  return fetch(fmtUrl("/api/image/hidden"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(data),
  });
};

const apiUploadImages = (formData) => {
  return fetch(fmtUrl("/api/image/upload"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
    body: formData,
  });
};

const apiDeleteImage = (data) => {
  return fetch(fmtUrl("/api/image/delete"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(data),
  })
}

const apiImageAddCate = (data) => {
  return fetch(fmtUrl("/api/image/cate/add"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(data),
  })
}

export { apiGetImageList, apiGetImageCount, apiHideImage, apiUploadImages, apiDeleteImage, apiImageAddCate };
