import { useNavigate, useParams } from "react-router";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { Button, Space, Tag } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./styles/TagDetail.css";
import { useEffect, useState } from "react";
import { apiGetTagInfo } from "./api/tag.js";
import { toast } from "react-toastify";

const TagDetail = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const [tagInfo, setTagInfo] = useState({});

  useEffect(() => {
    getTagInfo();
  }, []);

  const getTagInfo = () => {
    const params = {
      tag: name,
    };
    apiGetTagInfo(params).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setTagInfo(data.data);
          toast("标签信息获取成功");
        });
        return;
      }
      toast.error("标签信息获取失败");
    });
  };

  const renderTitle = (info) => {
    return (
      <Space size={'small'}>
        <Tag
          color={info.tag_color}
          style={{ padding: "2px 6px", cursor: "pointer" }}
        >
          {info.name}
        </Tag>
        <Tag>{`图片数量: ${info.image_count}`}</Tag>
        <Tag>{`点赞数量: ${info.like}`}</Tag>
      </Space>
    );
  };

  return (
    <>
      <Header />
      <main className="tag-detail">
        <Space size={"large"}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              navigate("/tag");
            }}
          ></Button>
          <h3>标签: {renderTitle(tagInfo)}</h3>
        </Space>
        <br />
        <p className="tag-info">{tagInfo.tag_info || ''}</p>
      </main>
      <Footer />
    </>
  );
};

export default TagDetail;
