import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { apiGetAlbumImageList, apiGetAlbumInfo } from "./api/album.js";
import "./styles/AlbumDetail.css";
import { Button, Space, Tag, Typography } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  LikeOutlined,
  PictureOutlined,
} from "@ant-design/icons";

import { getDate } from "./util.js";

import { PhotoList, PhotoType } from "./components/PhotoList.jsx";

const AlbumDetail = () => {
  const { Text, Paragraph } = Typography;
  const navigate = useNavigate();
  const { id } = useParams();

  const [info, setInfo] = useState({});
  const [photos, setPhotos] = useState([]);

  const getAlbumInfo = () => {
    if (!id) {
      return;
    }
    const params = { id: id };
    apiGetAlbumInfo(params).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setInfo(data.data);
          if (data.data) {
            const params = { cate: data.data.name };
            getPhotosInAlbum(params);
          }
        });
      }
    });
  };

  useEffect(() => {
    getAlbumInfo();
  }, []);

  const getPhotosInAlbum = (params) => {
    apiGetAlbumImageList(params).then((r) => {
      r.json().then((res) => {
        const photosList = res.data.map((p) => {
          return {
            image: `/static/image/${p.uuid}${p.ext}`,
            src: `/static/thumbnail/${p.thumbnail}`,
            width: p.width,
            height: p.height,
            ...p,
          };
        });
        setPhotos(photosList);
      });
    });
  };

  return (
    <>
      <Header />
      <main className="album-detail">
        <Space size={"large"}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              navigate("/album");
            }}
          ></Button>
          <h3>{info.name}</h3>
        </Space>
        <br />
        <Paragraph>
          <Text type={"secondary"}>{info.cate_info}</Text>
        </Paragraph>
        <Space size={"middle"}>
          <Tag>
            <PictureOutlined /> 图片: {info.image_count}
          </Tag>
          <Tag>
            <LikeOutlined /> 点赞: {info.like}
          </Tag>
          <Tag>
            <CalendarOutlined /> 创建日期: {getDate(info.create_at)}
          </Tag>
          <Tag>
            <EnvironmentOutlined /> 地点: {getDate(info.cate_position)}
          </Tag>
        </Space>
        <div className="album-images-list-container">
          <PhotoList photos={photos} photoType={PhotoType.album} albumId={id} photosCb={getAlbumInfo} />
          <p style={{ textAlign: "center", marginBottom: 0 }}>
            Like more & Love more
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AlbumDetail;
