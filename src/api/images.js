import { fmtUrl, getPalaceCode } from "../util.js";

const apiUploadImages = (formData) => {
  return fetch(fmtUrl("/api/images/upload"), {
    headers: {
      token: getPalaceCode(),
    },
    method: "post",
    mode: "cors",
    cache: "no-cache",
    body: formData,
  });
};

export { apiUploadImages };
