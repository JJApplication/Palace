import {
  createBrowserRouter,
} from "react-router";
import Home from "../Home.jsx";
import Gallery from "../Gallery.jsx";
import AuthGuard from "../AuthGuard.jsx";
import NotFound from "../NotFound.jsx";
import Login from "../Login.jsx";
import Monitor from "../Monitor.jsx";
import Blocked from "../Blocked.jsx";
import User from "../Monitor/User.jsx";
import GalleryMonitor from "../Monitor/Gallery.jsx";
import Album from "../Album.jsx";
import AlbumDetail from "../AlbumDetail.jsx";
import AlbumMonitor from "../Monitor/Album.jsx";

const router = createBrowserRouter([
  {
    path: "",
    Component: Home,
  },
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/gallery", // images
    Component: Gallery,
  },
  {
    path: "/album", // category
    Component: Album,
  },
  {
    path: "/album/:id", // category
    Component: AlbumDetail,
  },
  {
    path: "/tag", // tag
    Component: NotFound,
  },
  {
    path: "/task", // task
    Component: NotFound,
    loader: AuthGuard,
  },
  {
    path: "/monitor", // 管理员页面
    Component: Monitor, // 无需认证允许访客查看
  },
  {
    path: "/monitor/image", // 管理图片
    Component: GalleryMonitor,
    loader: AuthGuard,
  },
  {
    path: "/monitor/album", // 管理相册
    Component: AlbumMonitor,
    loader: AuthGuard,
  },
  {
    path: "/monitor/tag", // 管理标签
    Component: NotFound,
    loader: AuthGuard,
  },
  {
    path: "/monitor/user", // 管理用户
    Component: User,
    loader: AuthGuard,
  },
  {
    path: "/login", // 管理用户
    Component: Login,
  },
  {
    path: "/blocked", // 无权限
    Component: Blocked,
  },
  {
    path: "*",
    Component: NotFound
  }
]);

export default router;