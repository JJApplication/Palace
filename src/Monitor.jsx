import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import {
  Avatar,
  Button,
  Card,
  Col,
  Flex,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
} from "antd";
import "./styles/Monitor.css";
import { useContext, useEffect, useState } from "react";
import { apiLogout } from "./api/login.js";
import {
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
import { clearPalaceCode, getAvatarUrl, isAdmin } from "./util.js";
import { apiStorage } from "./api/storage.js";
import Upload from "./components/Upload.jsx";
import UserContext from "./components/UserContext.jsx";
import UploadLive from "./components/UploadLive.jsx";

const Monitor = () => {
  const nav = useNavigate();
  const [storage, setStorage] = useState({});

  const { user, privilege, getUser } = useContext(UserContext);

  const getStorage = () => {
    if (isAdmin(privilege)) {
      apiStorage().then((res) => {
        res.json().then((data) => {
          setStorage(data.data);
        });
      });
    }
  };

  useEffect(() => {
    getStorage();
  }, [privilege]);

  const renderPercent = () => {
    if (!storage || storage?.max_space <= 0) {
      return 0;
    }
    const res =
      (Number(storage?.total_upload_size) +
        Number(storage?.total_thumbnail_size)) /
      Number(storage?.max_space);
    if (res >= 1) {
      return 100;
    }
    return Math.floor(res * 100);
  };

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

  const handleLogout = () => {
    // 强制退出
    clearPalaceCode();
    apiLogout()
      .then(() => {
        toast("logout successfully.");
        nav("/login");
      })
      .finally(() => {
        getUser();
      });
  };

  return (
    <>
      <Header />
      <main className="monitor">
        <Card title={"Palace Monitor"}>
          {/*入口功能负责展示当前登录的用户信息以及其他管理页面的入口*/}
          <Card title={"User Info"}>
            <Flex justify="space-between" align="center" wrap={true}>
              <Space size={"large"}>
                {user?.name && user?.avatar ? (
                  <Avatar
                    size={{
                      xs: 64,
                      sm: 72,
                      md: 96,
                      lg: 128,
                      xl: 196,
                      xxl: 256,
                    }}
                    src={getAvatarUrl(user.avatar)}
                  />
                ) : (
                  <Avatar
                    size={{
                      xs: 64,
                      sm: 72,
                      md: 96,
                      lg: 128,
                      xl: 196,
                      xxl: 256,
                    }}
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
          {isAdmin(privilege) && (
            <Card title={"Storage Detail"}>
              <Row gutter={16}>
                <Col span={24} style={{ marginBottom: "0.75rem" }}>
                  <p>Storage Usage</p>
                  <Progress
                    type="dashboard"
                    steps={8}
                    percent={renderPercent()}
                    trailColor="rgba(0, 0, 0, 0.25)"
                    strokeWidth={20}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Total Photo"
                    value={storage?.total_upload}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Photo Size"
                    value={storage?.total_upload_size}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Total Thumb"
                    value={storage?.total_thumbnail}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Thumbnail Size"
                    value={storage?.total_thumbnail_size}
                  />
                </Col>
                <Col span={12}>
                  <Statistic title="Max SpaceSize" value={storage?.max_space} />
                </Col>
                <Col span={12}>
                  <Statistic title="Database" value={storage?.db_size} />
                </Col>
              </Row>
            </Card>
          )}
          <br />
          <Card title={"Image Management"}>
            <Space size={"large"} wrap={true}>
              <Upload />
              <UploadLive />
              <Button icon={<TruckOutlined />}>export packs</Button>
              <NavLink to={"/monitor/image"}>
                <Button icon={<RestOutlined />}>recycle</Button>
              </NavLink>
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
