import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { Button, Result, Space } from "antd";
import "./styles/Blocked.css";

import {
  StopOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router";

const Blocked = () => {
  return (
      <>
        <Header />
        <main className="blocked">
          <Result
              status="error"
              icon={<StopOutlined />}
              title={'you have no permission!'}
              subTitle={'please login to Palace to access this page'}
              extra={
            <Space>
              <NavLink to="/"><Button type={'primary'}>Back</Button></NavLink>
              <NavLink to="/login"><Button type={'dashed'}>Login</Button></NavLink>
            </Space>}
          >
          </Result>
        </main>
        <Footer />
      </>
  );
};

export default Blocked;
