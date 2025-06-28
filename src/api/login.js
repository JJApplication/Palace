import {fmtUrl, getPalaceCode} from "../util.js";

const apiLogin = (data) => {
  return fetch(fmtUrl('/api/user/login'), {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'post',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    body: JSON.stringify(data),
  })
}

const apiCheckLogin = () => {
  return fetch(fmtUrl('/api/user/check'), {
    headers: {
      token: getPalaceCode()
    },
    method: 'get',
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