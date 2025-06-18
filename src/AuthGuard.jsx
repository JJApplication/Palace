import { redirect } from "react-router";
import { apiCheckLogin } from "./api/login.js";
import { toast } from "react-toastify";

const AuthGuard = () => {
  const location = window.location;
  console.log(location.pathname, "/");
  apiCheckLogin()
    .then((response) => {
      if (!response.ok) {
        return redirect("/login");
      }
    })
    .catch(() => {
      toast.error("userinfo check error");
    });
};

export default AuthGuard;
