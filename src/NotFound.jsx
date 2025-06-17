import {Button} from "antd";
import {NavLink} from "react-router";

const NotFound = () => {
  return (
      <>
        <p>找不到要访问的页面🚧</p>
        <NavLink to={'/'}><Button type={'primary'}>返回首页</Button></NavLink>
      </>
  )
}

export default NotFound;