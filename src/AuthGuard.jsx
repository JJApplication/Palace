import { redirect } from "react-router";
import { apiCheckLogin } from "./api/login.js";
import { toast } from "react-toastify";

const AuthGuard = async () => {
  try {
    const response = await apiCheckLogin()
    if (!response.ok) {
      return redirect("/blocked");
    }
  } catch (error) {
    toast.error("userinfo check error");
    return redirect("/blocked");
  }
  return {};
};

export default AuthGuard;
