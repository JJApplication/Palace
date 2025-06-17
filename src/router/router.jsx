import {
  createBrowserRouter,
} from "react-router";
import Home from "../Home.jsx";
import Gallery from "../Gallery.jsx";
import AuthGuard from "../AuthGuard.jsx";
import NotFound from "../NotFound.jsx";
import Login from "../Login.jsx";
import Monitor from "../Monitor.jsx";

const router = createBrowserRouter([
  {
    path: "",
    Component: Home,
  },
  {
    path: "/gallery", // images
    Component: Gallery,
  },
  {
    path: "/album", // category
    Component: Gallery,
  },
  {
    path: "/tag", // tag
    Component: Gallery,
  },
  {
    path: "/task", // task
    Component: Gallery,
    loader: AuthGuard,
  },
  {
    path: "/monitor", // 管理员页面
    Component: Monitor,
    loader: AuthGuard,
  },
  {
    path: "/monitor/image", // 管理图片
    Component: Gallery,
    loader: AuthGuard,
  },
  {
    path: "/monitor/album", // 管理相册
    Component: Gallery,
    loader: AuthGuard,
  },
  {
    path: "/monitor/tag", // 管理标签
    Component: Gallery,
    loader: AuthGuard,
  },
  {
    path: "/monitor/user", // 管理用户
    Component: Gallery,
    loader: AuthGuard,
  },
  {
    path: "/login", // 管理用户
    Component: Login,
  },
  {
    path: "/blocked", // 无权限
    Component: Gallery,
  },
  {
    path: "*",
    Component: NotFound
  }
]);

export default router;