import { Button } from "antd";
import { NavLink } from "react-router";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import './styles/NotFound.css';

const NotFound = () => {
  return (
    <>
      <Header />
      <main className="not-found">
        <p>找不到要访问的页面🚧</p>
        <NavLink to={"/"}>
          <Button type={"primary"}>返回首页</Button>
        </NavLink>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
