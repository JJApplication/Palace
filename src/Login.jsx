// 登录页 通过中间件拦截页面路由进入
import {Button, Card, Form, Input, Space} from "antd";
import {NavLink} from "react-router";

const Login = () => {
  const login = (e) => {
    console.log(e)
  }
  return(
      <>
        <div style={{ textAlign: "center" }}>
          <Card title={<p style={{ fontSize: '1.25rem' }}>Login to Palace</p>}>
            <Form
                name={'login-form'}
                onFinish={(e) => login(e)}
                style={{ maxWidth: '480px', margin: '0 auto' }}
            >
              <Form.Item
                  label='user'
                  name={'user'}
                  rules={[{ required: true, message: 'Please input your username' }]}
              >
                <Input allowClear />
              </Form.Item>
              <Form.Item
                  label='passwd'
                  name={'password'}
                  rules={[{ required: true, message: 'Please input your password' }]}
              >
                <Input.Password />
              </Form.Item>
              <Space>
                <Form.Item label={null}>
                  <NavLink to='/'>
                    <Button type="link">
                      Back
                    </Button>
                  </NavLink>
                </Form.Item>
                <Form.Item label={null}>
                  <Button type="primary" htmlType="submit">
                    Login
                  </Button>
                </Form.Item>
              </Space>
            </Form>
          </Card>
        </div>
      </>
  )
}

export default Login;