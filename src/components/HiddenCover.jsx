import "./HiddenCover.css";
import { Flex, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const HiddenCover = () => {
  return (
    <>
      <div className={"hidden-cover"}>
        <Tooltip placement={"right"} title={"图片已被所有者隐藏, 访客无权查看"}>
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
