import {redirect} from "react-router";
import {checkLogin} from "./api/login.js";

const AuthGuard = () => {
  const location = window.location;
  console.log(location.pathname, "/");
  checkLogin().then(response => {
    if (!response.ok) {
      return redirect('/login')
    }
  })
}

export default AuthGuard;