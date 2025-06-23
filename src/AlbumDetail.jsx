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
  LikeOutlined, PictureOutlined
} from "@ant-design/icons";
import { RowsPhotoAlbum } from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { getDate } from "./util.js";

const AlbumDetail = () => {
  const { Text, Paragraph } = Typography;
  const navigate = useNavigate();
  const { id } = useParams();
  const [info, setInfo] = useState({});
  const [index, setIndex] = useState(-1);
  const [currentPhoto, setCurrentPhoto] = useState({});
  const [viewIndex, setViewIndex] = useState(-1);
  const [photos, setPhotos] = useState([]);
  const [LightboxPhotos, setLightboxPhotos] = useState([]);

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
          };
        });
        setPhotos(photosList);
        getLightboxList(photosList);
      });
    });
  };

  const getLightboxList = (photoList) => {
    setLightboxPhotos(
      photoList.map((p) => {
        return { src: p.image };
      }),
    );
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
        </Space>
        <div className="album-images-list-container">
          <RowsPhotoAlbum
            breakpoints={[1440, 1200, 1080, 640, 384, 256, 128, 96, 64, 48]}
            padding={5}
            spacing={8}
            columns={(containerWidth) => {
              if (containerWidth <= 400) return 2;
              if (containerWidth <= 800) return 3;
              if (containerWidth <= 1000) return 4;
              if (containerWidth <= 1200) return 5;
              return 6;
            }}
            photos={photos}
            onClick={({ index }) => {
              setIndex(index);
            }}
          />

          <Lightbox
            slides={LightboxPhotos}
            open={index >= 0}
            index={index}
            close={() => {
              setIndex(-1);
              setViewIndex(-1);
            }}
            // enable optional lightbox plugins
            plugins={[Fullscreen, Thumbnails, Zoom]}
            on={{ view: (e) => setViewIndex(e.index) }}
          />
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
