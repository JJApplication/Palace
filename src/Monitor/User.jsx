import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { Avatar, Button, Card, Flex, Form, Input, Space, Tag } from "antd";
import {
  CheckSquareOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { apiGetUser, apiResetUser } from "../api/user.js";
import { toast } from "react-toastify";
import { clearPalaceCode, getPrivilege } from "../util.js";
import { useNavigate } from "react-router";
import "../styles/User.css";

const User = () => {
  const nav = useNavigate();
  const [user, setUser] = useState({}); // 用户信息包括用户名，头像，权限描述
  const [privilege, setPrivilege] = useState('guest');

  const getUser = () => {
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

  const renderPrivilege = (p) => {
    switch (p) {
      case 0: {
        return <Tag color={"gold"}>超级管理员</Tag>;
      }
      case 1: {
        return <Tag color={"orange"}>管理员</Tag>;
      }
      case 2: {
        return <Tag color={"geekblue"}>编辑者</Tag>;
      }
      case 3: {
        return <Tag color={"pink"}>访客</Tag>;
      }
      default:
        return <Tag color={"pink"}>访客</Tag>;
    }
  };

  const handleLogout = () => {
    // 强制退出
    clearPalaceCode();
    toast("logout successfully.");
    nav("/login");
  };

  const reset = (e) => {
    if (!e) {
      return;
    }
    if (e.password.length < 8) {
      toast.error("密码强度低,请输入8位以上密码");
      return;
    }
    if (e.password !== e.password_confirm) {
      toast.error("两次输入的密码不一致");
      return;
    }
    apiResetUser({ password: e.password }).then((res) => {
      if (res.ok) {
        toast("密码修改成功");
        return;
      }
      toast.error("密码修改失败");
    });
  };

  return (
    <>
      <Header />
      <main className="user">
        <Card title={"User Info"}>
          <Flex justify="space-between" align="center" style={{ maxWidth: "640px", margin: "0 auto" }}>
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
            <Button
              icon={<LogoutOutlined />}
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </Button>
          </Flex>
          <Form
            onFinish={(e) => reset(e)}
            style={{ maxWidth: "640px", margin: "2rem auto 0" }}
          >
            <Form.Item
              label="reset password"
              name={"password"}
              rules={[
                { required: true, message: "Please input your password" },
              ]}
            >
              <Input.Password placeholder="输入新密码" />
            </Form.Item>
            <Form.Item
              label="confirm password"
              name={"password_confirm"}
              rules={[
                { required: true, message: "Please input your password" },
              ]}
            >
              <Input.Password placeholder="再次确认新密码" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CheckSquareOutlined />}
            >
              Confirm
            </Button>
          </Form>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default User;
