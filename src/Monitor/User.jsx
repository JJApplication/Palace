import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import {
  Avatar,
  Button,
  Card,
  Flex,
  Form,
  Input,
  Modal,
  Space,
  Tag,
} from "antd";
import {
  CheckSquareOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useContext, useRef, useState } from "react";
import { apiResetUser, apiUpdateUser, apiUploadAvatar } from "../api/user.js";
import { toast } from "react-toastify";
import { clearPalaceCode, getAvatarUrl, isSuperAdmin } from "../util.js";
import { useNavigate } from "react-router";
import "../styles/User.css";
import { apiLogout } from "../api/login.js";
import UserContext from "../components/UserContext.jsx";

const User = () => {
  const nav = useNavigate();
  const [formReset] = Form.useForm();
  const ref = useRef(null);

  const [currentAvatar, setCurrentAvatar] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const { user, privilege } = useContext(UserContext);

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
    apiLogout().then(() => {
      toast("logout successfully.");
      nav("/login");
    });
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

  const updateUser = () => {
    const data = formReset.getFieldsValue();
    apiUpdateUser(data)
      .then((res) => {
        if (res.ok) {
          toast("用户信息更新成功");
          return;
        }
        toast.error("用户信息更新失败");
      })
      .finally(() => {
        formReset.resetFields();
      });
  };

  const uploadAvatar = (e) => {
    if (e.target.files && e.target.files.length <= 0) {
      return;
    }
    const file = e.target.files[0];
    if (file?.size > 1024 * 1024) {
      toast.warn("头像文件大小需要小于1mb");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    apiUploadAvatar(formData).then((res) => {
      if (res.ok) {
        toast("头像上传成功");
        res.json().then((data) => {
          console.log(data);
          setCurrentAvatar(data?.data);
        });
        return;
      }
      toast.error("头像上传失败");
    });
  };

  return (
    <>
      <Header />
      <main className="user">
        <Card title={"User Info"}>
          <Flex
            justify="space-between"
            align="center"
            style={{ maxWidth: "640px", margin: "0 auto" }}
          >
            <Space size={"large"}>
              {user?.name && user?.avatar ? (
                <Avatar
                  onClick={() => {
                    setShowUpload(true);
                  }}
                  size={{ xs: 64, sm: 72, md: 96, lg: 128, xl: 196, xxl: 256 }}
                  src={getAvatarUrl(user.avatar)}
                />
              ) : (
                <Avatar
                  onClick={() => {
                    setShowUpload(true);
                  }}
                  size={{ xs: 64, sm: 72, md: 96, lg: 128, xl: 196, xxl: 256 }}
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
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<CheckSquareOutlined />}
              >
                Confirm
              </Button>
              {isSuperAdmin(privilege) && (
                <Button
                  color={"danger"}
                  variant="solid"
                  onClick={() => setShowReset(true)}
                >
                  Reset User
                </Button>
              )}
            </Space>
          </Form>
        </Card>
        <Modal
          title={"Reset user"}
          open={showReset}
          destroyOnClose={true}
          footer={null}
          bodyStyle={{ maxHeight: "640px" }}
          onCancel={() => {
            formReset.resetFields();
            setShowReset(false);
          }}
        >
          <Form form={formReset}>
            <Form.Item label={"username"} name="username">
              <Input />
            </Form.Item>
            <Form.Item label={"password"} name="password">
              <Input.Password />
            </Form.Item>
            <Button type={"primary"} onClick={updateUser} htmlType="submit">
              Submit
            </Button>
          </Form>
        </Modal>
        <Modal
          open={showUpload}
          destroyOnHidden={true}
          onCancel={() => {
            setShowUpload(false);
          }}
          onOk={() => setShowUpload(false)}
        >
          <Card title={"Upload A New Avatar"}>
            <Space size={"large"}>
              {user?.name && user?.avatar ? (
                <Avatar
                  onClick={() => {
                    setShowUpload(true);
                  }}
                  size={{ xs: 72, sm: 96, md: 128, lg: 196, xl: 256, xxl: 384 }}
                  src={getAvatarUrl(currentAvatar)}
                />
              ) : (
                <Avatar
                  onClick={() => {
                    setShowUpload(true);
                  }}
                  size={{ xs: 72, sm: 96, md: 128, lg: 196, xl: 256, xxl: 384 }}
                  style={{ backgroundColor: "#823e9c" }}
                  icon={<UserOutlined />}
                />
              )}
              <Button
                type={"primary"}
                onClick={() => {
                  ref?.current?.click();
                }}
              >
                Upload
              </Button>
            </Space>
            <input
              ref={ref}
              type="file"
              name="file"
              onChange={(e) => uploadAvatar(e)}
              accept="image/*"
              style={{ display: "none" }}
            />
          </Card>
        </Modal>
      </main>
      <Footer />
    </>
  );
};

export default User;
