// 顶部导航切换 直接嵌入到每个单独页面中使用
import {Flex, Menu} from "antd";
import {useState} from "react";
import {
  BorderlessTableOutlined,
  BorderOutlined,
  GatewayOutlined,
  InsertRowBelowOutlined,
  ProfileOutlined
} from "@ant-design/icons";
import './Header.css';

const items = [
  {
    label: 'Gallery',
    key: 'gallery',
    icon: <BorderlessTableOutlined />,
  },
  {
    label: 'Album',
    key: 'album',
    icon: <InsertRowBelowOutlined />,
  },
  {
    label: 'Tags',
    key: 'tags',
    icon: <ProfileOutlined />,
  },
  {
    label: 'Monitor',
    key: 'monitor',
    icon: <GatewayOutlined />,
    children: [
      {
        key: 'gallery-monitor',
        label: 'Gallery Manager',
      },
      {
        key: 'album-monitor',
        label: 'Album Manager',
      },
      {
        key: 'tag-monitor',
        label: 'Tag Manager',
      },
      {
        key: 'task-monitor',
        label: 'Task Manager',
      },
      {
        key: 'user-monitor',
        label: 'User Manager',
      },
    ],
  },
];

const Header = () => {
  const [current, setCurrent] = useState('mail');

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return (
      <>
        <Flex justify="space-between" align={"center"} className={'header'}>
          <span className={'logo-text'}>🖼️ • ⌈Palace⌋</span>
          <Menu className={'menu'} onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
        </Flex>
      </>
  )
}

export default Header;