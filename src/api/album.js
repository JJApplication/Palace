import { fmtUrl, withQuery } from "../util.js";

const apiGetAlbums = () => {
  return fetch(fmtUrl("/api/album/list"), {
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

const apiAddAlbum = (data) => {
  return fetch(fmtUrl("/api/album/add"), {
    method: "post",
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(data),
  });
}

const apiUpdateAlbum = (data) => {
  return fetch(fmtUrl("/api/album/update"), {
    method: "post",
    mode: "cors",
    cache: "no-cache",
    body: JSON.stringify(data),
  });
}

export { apiGetAlbums, apiGetAlbumInfo, apiAddAlbum,apiUpdateAlbum };