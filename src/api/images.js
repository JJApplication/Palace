import {fmtUrl, getPalaceCode, withQuery} from "../util.js";

const apiGetImageList = () => {
  return fetch(fmtUrl("/api/image/list"), {
    method: "get",
    mode: "cors",
    cache: "no-cache",
  });
}

const apiGetImageInfo = (params) => {
  return fetch(withQuery(fmtUrl("/api/image/info"), params), {
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

const apiUploadImages = (formData, cate) => {
  let url = fmtUrl("/api/image/upload")
  if (cate && Number(cate) !== 0) {
    url += "?cate=" + cate;
  }
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

const apiLikeImage = (data) => {
  return fetch(fmtUrl("/api/image/like"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(data),
  })
}
export { apiGetImageList, apiGetImageInfo, apiGetImageCount, apiHideImage, apiUploadImages, apiDeleteImage, apiImageAddCate, apiLikeImage };
