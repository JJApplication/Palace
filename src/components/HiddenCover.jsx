import "./HiddenCover.css";
import { Flex, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const HiddenCover = ({ type }) => {
  let title = "";
  switch (type) {
    case "image":
      title = "图片已被所有者隐藏, 访客无权查看";
      break;
    case "album":
      title = "相册已被所有者隐藏, 访客无权查看";
      break;
    default:
      title = "查看项已被所有者隐藏, 访客无权查看";
      break;
  }
  return (
    <>
      <div className={"hidden-cover"}>
        <Tooltip placement={"bottom"} title={title}>
          <Flex
            align={"center"}
            justify="center"
            style={{ width: "100%", height: "100%" }}
          >
            <EyeOutlined style={{ fontSize: 32, color: "#ffffff9c" }} />
          </Flex>
        </Tooltip>
      </div>
    </>
  );
};

export default HiddenCover;
