import {fmtUrl, getPalaceCode, withQuery} from "../util.js";

const apiGetAlbums = () => {
  return fetch(fmtUrl("/api/album/list"), {
    method: "get",
    mode: "cors",
    cache: "no-cache",
  });
}

const apiGetAlbumImageList = (params) => {
  return fetch(withQuery(fmtUrl("/api/album/images"), params), {
    method: "get",
    mode: "cors",
    cache: "no-cache",
  });
}

const apiGetAlbumInfo = (params) => {
  return fetch(withQuery(fmtUrl("/api/album/info"), params), {
    method: "get",
    mode: "cors",
    cache: "no-cache",
  });
}

const apiSetAlbumCover = (data) => {
  return fetch(fmtUrl("/api/album/cover"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(data),
  });
}

const apiAddAlbum = (data) => {
  return fetch(fmtUrl("/api/album/add"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(data),
  });
}

const apiUpdateAlbum = (data) => {
  return fetch(fmtUrl("/api/album/update"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(data),
  });
}

export { apiGetAlbums, apiGetAlbumImageList, apiGetAlbumInfo, apiSetAlbumCover, apiAddAlbum,apiUpdateAlbum };