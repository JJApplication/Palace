// 顶部导航切换 直接嵌入到每个单独页面中使用
import { Flex, Menu } from "antd";
import { useState } from "react";
import {
  BorderlessTableOutlined,
  GatewayOutlined,
  InsertRowBelowOutlined,
  OneToOneOutlined,
} from "@ant-design/icons";
import "./Header.css";
import { NavLink, useNavigate } from "react-router";

const menuMap = {
  gallery: "/gallery",
  album: "/album",
  tags: "/tag",
  monitor: "/monitor",
  "gallery-monitor": "/monitor/image",
  "album-monitor": "/monitor/album",
  "tag-monitor": "/monitor/tag",
  "task-monitor": "/task",
  "user-monitor": "/monitor/user",
};

const Header = () => {
  const nav = useNavigate();
  const [current, setCurrent] = useState("mail");

  const onClick = (e) => {
    setCurrent(e.key);
    nav(menuMap[e.key]);
  };
  const items = [
    {
      label: "Gallery",
      key: "gallery",
      icon: <BorderlessTableOutlined />,
    },
    {
      label: "Album",
      key: "album",
      icon: <InsertRowBelowOutlined />,
    },
    {
      label: "Tags",
      key: "tags",
      icon: <OneToOneOutlined />,
    },
    {
      label: "Monitor",
      key: "monitor",
      icon: <GatewayOutlined />,
      onTitleClick: onClick,
      children: [
        {
          key: "gallery-monitor",
          label: "Gallery Manager",
        },
        {
          key: "album-monitor",
          label: "Album Manager",
        },
        {
          key: "tag-monitor",
          label: "Tag Manager",
        },
        {
          key: "task-monitor",
          label: "Task Manager",
        },
        {
          key: "user-monitor",
          label: "User Manager",
        },
      ],
    },
  ];
  return (
    <>
      <Flex justify="space-between" align={"center"} className={"header"}>
        <NavLink to={"/"}>
          <span className={"logo-text"}>
            <span style={{ color: "#fff" }}>▶</span>{" "}
            <span style={{ fontSize: "1.5rem" }}>Palace</span>{" "}
            <span style={{ color: "#fff" }}>◀</span>
          </span>
        </NavLink>
        <Menu
          className={"menu"}
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
        />
      </Flex>
    </>
  );
};

export default Header;
