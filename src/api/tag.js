import { fmtUrl, getPalaceCode, withQuery } from "../util.js";

const apiGetTagList = () => {
  return fetch(fmtUrl("/api/tag/list"), {
    method: "get",
    mode: "cors",
    cache: "no-cache",
  });
}

const apiGetTagInfo = (params) => {
  return fetch(withQuery(fmtUrl("/api/tag/info"), params), {
    method: "get",
    mode: "cors",
    cache: "no-cache",
  });
}

const apiUpdateImageTags = (data) => {
  return fetch(fmtUrl("/api/image/tag/modify"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(data),
  });
}

const apiAddTag = (data) => {
  return fetch(fmtUrl("/api/tag/add"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(data),
  });
}

export { apiGetTagList, apiGetTagInfo, apiUpdateImageTags, apiAddTag}