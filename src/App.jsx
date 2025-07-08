import "./App.css";
import "./font.css";
import router from "./router/router.jsx";
import { toast, ToastContainer } from "react-toastify";
import { ConfigProvider, theme } from "antd";
import { RouterProvider } from "react-router";
import { useEffect, useState } from "react";
import { apiGetUser } from "./api/user.js";
import { getPalaceCode, getPrivilege } from "./util.js";
import UserContext from "./components/UserContext.jsx";

function App() {
  const [user, setUser] = useState({}); // 用户信息包括用户名，头像，权限描述
  const [privilege, setPrivilege] = useState("guest");
  const [currentMenu, setCurrentMenu] = useState("");

  const getUser = () => {
    // 简化请求，如果没有token不请求
    if (!getPalaceCode() || getPalaceCode() === "") {
      setUser({});
      setPrivilege("guest");
      return;
    }
    apiGetUser().then((res) => {
      if (!res.ok) {
        toast.error("获取用户信息失败");
        return;
      }
      res.json().then((data) => {
        setUser(data?.data || {});
        setPrivilege(getPrivilege(data?.data.privilege));
      });
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  const value = {
    user,
    setUser,
    privilege,
    setPrivilege,
    getUser,
    currentMenu,
    setCurrentMenu,
  };

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <UserContext.Provider value={value}>
          <RouterProvider router={router}></RouterProvider>
        </UserContext.Provider>
      </ConfigProvider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={false}
        draggable={true}
        pauseOnFocusLoss={false}
        theme="light"
        zIndex={99999}
        toastStyle={{ zIndex: 99999 }}
        bodyStyle={{ zIndex: 99999 }}
        style={{ zIndex: 99999 }}
      />
    </>
  );
}

export default App;
