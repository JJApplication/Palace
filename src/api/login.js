import {fmtUrl, getPalaceCode} from "../util.js";

const apiLogin = () => {
  return fetch(fmtUrl('/api/user/login'), {
    method: 'post',
    mode: 'cors',
    cache: 'no-cache',
  })
}

const apiCheckLogin = () => {
  return fetch(fmtUrl('/api/user/check'), {
    headers: {
      token: getPalaceCode()
    },
    method: 'post',
    mode: 'cors',
    cache: 'no-cache',
  })
}

const apiLogout = () => {
  return fetch(fmtUrl('/api/user/logout'), {
    headers: {
      token: getPalaceCode()
    },
    method: 'post',
    mode: 'cors',
    cache: 'no-cache',
  })
}

export { apiLogin, apiCheckLogin, apiLogout }