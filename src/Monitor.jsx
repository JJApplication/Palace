import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { Avatar, Button, Card, Flex, Space, Tag } from "antd";
import "./styles/Monitor.css";
import { useEffect, useRef, useState } from "react";
import { apiLogout } from "./api/login.js";
import {
  CloudUploadOutlined,
  InsertRowBelowOutlined,
  LoginOutlined,
  LogoutOutlined,
  OneToOneOutlined,
  PartitionOutlined,
  PictureOutlined,
  RestOutlined,
  ThunderboltOutlined,
  TruckOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { apiUploadImages } from "./api/images.js";
import { apiGetUser } from "./api/user.js";
import { clearPalaceCode } from "./util.js";

const Monitor = () => {
  const nav = useNavigate();
  const ref = useRef();
  const [user, setUser] = useState({}); // 用户信息包括用户名，头像，权限描述
  const [status, setStatus] = useState(0); // 上传状态

  const getUser = () => {
    apiGetUser().then((res) => {
      if (!res.ok) {
        toast.error("获取用户信息失败");
        return;
      }
      res.json().then((data) => {
        setUser(data?.data || {});
      });
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  const renderPrivilege = (p) => {
    switch (p) {
      case 0: {
        return <Tag color={"pink"}>访客</Tag>;
      }
      case 1: {
        return <Tag color={"gold"}>超级管理员</Tag>;
      }
      case 2: {
        return <Tag color={"orange"}>管理员</Tag>;
      }
      case 3: {
        return <Tag color={"geekblue"}>编辑者</Tag>;
      }
      default:
        return <Tag color={"pink"}>访客</Tag>;
    }
  };

  const changeUpload = (status) => {
    switch (status) {
      case 0: {
        return "upload images";
      }
      case 1: {
        return "uploading...";
      }
      case 2: {
        return "done";
      }
      case 3: {
        return "upload failed";
      }
      default: {
        return "upload images";
      }
    }
  };

  const handleLogout = () => {
    // 强制退出
    clearPalaceCode();
    apiLogout().then(() => {
      toast("logout successfully.");
      nav("/login");
    });
  };

  const openUpload = () => {
    if (status === 1) {
      return;
    }
    setStatus(0);
    ref.current.click();
  };

  const startUpload = (e) => {
    if (e.target.files && e.target.files.length <= 0) {
      return;
    }
    setStatus(1);
    const files = e.target.files;
    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }
    apiUploadImages(formData)
      .then((res) => {
        if (!res.ok) {
          setStatus(3);
          toast.error("upload failed");
          return;
        }
        setStatus(2);
        toast("upload success");
      })
      .catch((e) => {
        setStatus(3);
        toast.error("upload failed" + e);
      });
  };

  return (
    <>
      <Header />
      <main className="monitor">
        <Card title={"Palace Monitor"}>
          {/*入口功能负责展示当前登录的用户信息以及其他管理页面的入口*/}
          <Card title={"User Info"}>
            <Flex justify="space-between" align="center">
              <Space size={"large"}>
                {user?.name && user?.avatar ? (
                  <Avatar
                    size={{ xs: 32, sm: 48, md: 64, lg: 72, xl: 96, xxl: 100 }}
                    src={user.avatar}
                  />
                ) : (
                  <Avatar
                    size={{ xs: 32, sm: 48, md: 64, lg: 72, xl: 96, xxl: 100 }}
                    style={{ backgroundColor: "#823e9c" }}
                    icon={<UserOutlined />}
                  />
                )}
                <span style={{ fontSize: "1.25rem" }}>
                  {user.name || "unknown"}
                </span>
                {renderPrivilege(user.privilege)}
              </Space>
              {user?.name ? (
                <Button
                  icon={<LogoutOutlined />}
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  icon={<LoginOutlined />}
                  onClick={() => {
                    nav("/login");
                  }}
                >
                  Login
                </Button>
              )}
            </Flex>
          </Card>
          <br />
          <Card title={"Storage Detail"}></Card>
          <br />
          <Card title={"Image Management"}>
            <Space size={"large"} wrap={true}>
              <Button icon={<CloudUploadOutlined />} onClick={openUpload}>
                {changeUpload(status)}
              </Button>
              <Button icon={<ThunderboltOutlined />}>upload livephoto</Button>
              <Button icon={<TruckOutlined />}>export packs</Button>
              <Button icon={<RestOutlined />}>recycle</Button>
              <input
                ref={ref}
                type="file"
                onChange={(e) => startUpload(e)}
                multiple
                accept="image/*"
                style={{ display: "none" }}
              />
            </Space>
          </Card>
          <br />
          <Card title={"System Management"}>
            <Space size={"large"} wrap={true}>
              <NavLink to={"/monitor/image"}>
                <Button icon={<PictureOutlined />}>Image Monitor</Button>
              </NavLink>
              <NavLink to={"/monitor/album"}>
                <Button icon={<InsertRowBelowOutlined />}>Album Monitor</Button>
              </NavLink>
              <NavLink to={"/monitor/tag"}>
                <Button icon={<OneToOneOutlined />}>Tags Monitor</Button>
              </NavLink>
              <NavLink to={"/task"}>
                <Button icon={<PartitionOutlined />}>Task Monitor</Button>
              </NavLink>
              <NavLink to={"/monitor/user"}>
                <Button icon={<UserOutlined />}>User Monitor</Button>
              </NavLink>
            </Space>
          </Card>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default Monitor;
