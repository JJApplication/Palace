import {fmtUrl, getPalaceCode} from "../util.js";

const login = () => {
  return fetch(fmtUrl('/api/user/login'), {
    method: 'post',
    mode: 'cors',
    cache: 'no-cache',
  })
}

const checkLogin = () => {
  return fetch(fmtUrl('/api/user/check'), {
    headers: {
      token: getPalaceCode()
    },
    method: 'post',
    mode: 'cors',
    cache: 'no-cache',
  })
}

export { login, checkLogin }