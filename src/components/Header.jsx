// 顶部导航切换 直接嵌入到每个单独页面中使用
import { Avatar, Flex, Menu, Space } from "antd";
import { useContext, useState } from "react";
import {
  BorderlessTableOutlined,
  GatewayOutlined,
  InsertRowBelowOutlined,
  OneToOneOutlined, UserOutlined
} from "@ant-design/icons";
import "./Header.css";
import { NavLink, useNavigate } from "react-router";
import UserContext from "./UserContext.jsx";
import { getAvatarUrl } from "../util.js";

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
  const [current, setCurrent] = useState("gallery");
  const { user, privilege } = useContext(UserContext);

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

  const renderAvatar = () => {
    if (user?.avatar && user?.name) {
      return (
        <NavLink to={'/monitor/user'}>
          <Avatar
            size={64}
            src={getAvatarUrl(user.avatar)}
            style={{ margin: "-0.75rem 0" }}
          />
        </NavLink>
      )
    }
    // header中不展示访客头像
    return null;
  }
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
        <Flex style={{ minWidth: 0, flex: 'auto', justifyContent: 'end' }} align={"center"}>
          <Menu
            className={"menu"}
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
          />
          {renderAvatar()}
        </Flex>
      </Flex>
    </>
  );
};

export default Header;
