// 登录页 通过中间件拦截页面路由进入
import { Button, Card, Form, Input, Space } from "antd";
import { NavLink, useNavigate } from "react-router";
import { LoginOutlined } from "@ant-design/icons";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { apiLogin } from "./api/login.js";
import { toast } from "react-toastify";
import { savePalaceCode } from "./util.js";
import "./styles/Login.css";
import { useContext } from "react";
import UserContext from "./components/UserContext.jsx";

const Login = () => {
  const nav = useNavigate();
  const { getUser } = useContext(UserContext);

  const login = (e) => {
    const { user, password } = e;
    if (!user || !password) {
      return;
    }
    apiLogin({ username: user, password: password }).then((res) => {
      if (!res.ok) {
        toast.error("登录失败");
        return;
      }
      res
        .json()
        .then((res) => {
          const data = res.data;
          if (data && data !== "") {
            toast.success("登录成功");
            savePalaceCode(data);
            nav("/");
          } else {
            toast.error("登录失败, 用户信息认证失败");
          }
        })
        .finally(() => {
          getUser();
        });
    });
  };
  return (
    <>
      <Header />
      <div className={"login"}>
        <Card title={<p style={{ fontSize: "1.25rem" }}>Login to Palace</p>}>
          <Form
            name={"login-form"}
            onFinish={(e) => login(e)}
            style={{ maxWidth: "480px", margin: "0 auto" }}
          >
            <Form.Item
              label="user"
              name={"user"}
              rules={[
                { required: true, message: "Please input your username" },
              ]}
            >
              <Input allowClear />
            </Form.Item>
            <Form.Item
              label="passwd"
              name={"password"}
              rules={[
                { required: true, message: "Please input your password" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Space>
              <Form.Item label={null}>
                <NavLink to="/">
                  <Button type="link">Back</Button>
                </NavLink>
              </Form.Item>
              <Form.Item label={null}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<LoginOutlined />}
                >
                  Login
                </Button>
              </Form.Item>
            </Space>
          </Form>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default Login;
