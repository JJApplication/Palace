import { useEffect, useState } from "react";
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "./assets/logo.gif";
import { useNavigate } from "react-router";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import {
  apiDeleteImage,
  apiGetImageList,
  apiImageAddCate,
} from "./api/images.js";
import { Button, Form, Input, Modal, Select } from "antd";
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  FileExclamationOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { apiGetAlbums } from "./api/album.js";
import { apiGetUser } from "./api/user.js";
import { getPrivilege, isAdmin } from "./util.js";

const Gallery = () => {
  const nav = useNavigate();
  const [formCate] = Form.useForm();

  const [index, setIndex] = useState(-1);
  const [currentPhoto, setCurrentPhoto] = useState({});
  const [viewIndex, setViewIndex] = useState(-1);
  const [privilege, setPrivilege] = useState("guest");
  const [photos, setPhotos] = useState([]);
  const [LightboxPhotos, setLightboxPhotos] = useState([]);
  const [init, setInit] = useState(false);
  const [initCode, setInitCode] = useState("#");

  const [showInfo, setShowInfo] = useState(false);
  const [showCate, setShowCate] = useState(false);
  const [showTag, setShowTag] = useState(false);
  const [showDel, setShowDel] = useState(false);

  const [categories, setCategories] = useState([]);

  let tick = null;

  useEffect(() => {
    getPhotos();
    initCallback(initCode);
    return () => clearInterval(tick);
  }, []);

  const getUser = () => {
    apiGetUser().then((res) => {
      if (!res.ok) {
        toast.error("获取用户信息失败");
        return;
      }
      res.json().then((data) => {
        setPrivilege(getPrivilege(data?.data.privilege));
      });
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  const backHome = () => {
    nav("/");
  };

  const isInit = () => {
    const rows = document.getElementsByClassName(
      "react-photo-album react-photo-album--rows",
    );
    if (rows) {
      const rowsChildren = rows[0].children;
      if (rowsChildren && rowsChildren.length > 0) {
        return true;
      }
    }

    return false;
  };

  const initCallback = () => {
    tick = setInterval(() => {
      setInitCode((initCode) => (initCode === "#" ? "$" : "#"));
      if (isInit()) {
        clearInterval(tick);
        setInit(true);
      }
    }, 200);
  };

  const getPhotos = () => {
    apiGetImageList().then((r) => {
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

  const deletePhoto = () => {
    console.log("delete photo:", currentPhoto.uuid);
    const data = { uuid: currentPhoto.uuid, logical_delete: true };
    apiDeleteImage(data)
      .then((res) => {
        if (res.ok) {
          toast("delete success");
        } else {
          toast.error("delete failed");
        }
      })
      .catch(() => {
        toast.error("delete failed");
      })
      .finally(() => {
        setShowDel(false);
      });
  };

  const openImageCate = () => {
    apiGetAlbums().then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          if (data && data.data) {
            const cateList = data.data.map((p) => {
              return {
                label: p.name,
                value: p.id,
              };
            });
            setCategories(cateList);
            setShowCate(true);
          }
        });
      } else {
        toast.error("获取相册列表失败");
      }
    });
  };

  const handleImageCateAdd = () => {
    const { cate } = formCate.getFieldsValue();
    if (!cate) {
      return;
    }
    const data = { uuid: currentPhoto.uuid, cate: cate };
    apiImageAddCate(data)
      .then((res) => {
        if (res.ok) {
          toast("成功添加到相册");
          return;
        }
        toast.error("添加到相册失败");
      })
      .catch(() => {
        toast.error("添加到相册失败");
      })
      .finally(() => {
        formCate.resetFields();
        setShowCate(false);
      });
  };

  const handleImageCateClose = () => {
    formCate.resetFields();
    setShowCate(false);
  };

  const renderPhotoButtons = () => {
    if (!isAdmin(privilege)) {
      return [
        <Button
          style={{ width: "48px", height: "48px" }}
          key="info-button"
          title="图片信息"
          icon={<FileExclamationOutlined style={{ fontSize: "24px" }} />}
          className="yarl__button"
          onClick={() => setShowInfo(true)}
        ></Button>,
        'close'
      ];
    }
    return [
      <Button
        style={{ width: "48px", height: "48px" }}
        key="info-button"
        title="图片信息"
        icon={<FileExclamationOutlined style={{ fontSize: "24px" }} />}
        className="yarl__button"
        onClick={() => setShowInfo(true)}
      ></Button>,
      <Button
        style={{ width: "48px", height: "48px" }}
        title="添加到相册分组"
        key="cate-button"
        icon={<AppstoreAddOutlined style={{ fontSize: "24px" }} />}
        className="yarl__button"
        onClick={openImageCate}
      ></Button>,
      <Button
        style={{ width: "48px", height: "48px" }}
        title="编辑标签"
        key="tag-button"
        icon={<TagOutlined style={{ fontSize: "24px" }} />}
        className="yarl__button"
        onClick={() => {}}
      ></Button>,
      <Button
        style={{ width: "48px", height: "48px" }}
        key="delete-button"
        icon={<DeleteOutlined style={{ fontSize: "24px" }} />}
        className="yarl__button"
        onClick={() => {
          setShowDel(true);
        }}
      ></Button>,
      "close",
    ];
  };

  return (
    <div
      style={{ textAlign: "center", display: "flex", justifyContent: "center" }}
    >
      {!init && (
        <div
          style={{
            zIndex: 99999,
            position: "fixed",
            top: 0,
            left: 0,
            backgroundColor: "#242424",
            height: "100%",
            width: "100%",
          }}
        >
          <h1 style={{ marginTop: "50vh", textAlign: "center" }}>
            Gallery initializing {initCode}
          </h1>
        </div>
      )}
      <Header />
      <div
        style={{
          height: "100%",
          width: "100%",
          maxWidth: "1440px",
          margin: "1.5rem 0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            textAlign: "left",
            marginBottom: "1.5rem",
            paddingBottom: "0.55rem",
            height: "36px",
            userSelect: "none",
            borderBottom: "2px dashed #FFFFFF20",
          }}
        >
          <span
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
            onClick={backHome}
          >
            Enjoy
          </span>
          <img className="back-logo" src={logo} onClick={backHome} />
          <span
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
            onClick={backHome}
          >
            Life
          </span>
        </div>
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
          onClick={({ index, photo }) => {
            setIndex(index);
            setCurrentPhoto(photo);
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
          toolbar={{
            buttons: renderPhotoButtons(),
          }}
        />
        <p style={{ textAlign: "center", marginBottom: 0 }}>
          Like more & Love more
        </p>
        <Footer />
      </div>
      <Modal
        open={showInfo}
        title="Image Info"
        destroyOnHidden={true}
        onCancel={() => setShowInfo(false)}
        getContainer={() => {
          const root = document.getElementsByClassName("yarl__root")[0];
          return root ? root : document.body;
        }}
        style={{ zIndex: 9999 }}
        footer={null}
      >
        <Form labelCol={{ span: 4 }} initialValues={currentPhoto}>
          <Form.Item label="name" name="name">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item label="create at" name="create_at">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item label="description" name="description">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item label="uuid" name="uuid">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item label="ext" name="ext">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item label="width" name="width">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item label="height" name="height">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item label="like" name="like">
            <Input disabled={true} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={showCate}
        title="Image Albums"
        destroyOnHidden={true}
        onCancel={handleImageCateClose}
        onOk={handleImageCateAdd}
        getContainer={() => {
          const root = document.getElementsByClassName("yarl__root")[0];
          return root ? root : document.body;
        }}
        style={{ zIndex: 9999 }}
      >
        <Form form={formCate}>
          <Form.Item label="category" name="cate">
            <Select
              getPopupContainer={() => {
                const root = document.getElementsByClassName("yarl__root")[0];
                return root ? root : document.body;
              }}
              style={{ width: "100%" }}
              options={categories}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={showTag}
        title="Image Tags"
        destroyOnHidden={true}
        onCancel={() => setShowInfo(false)}
      ></Modal>
      <Modal
        open={showDel}
        title="Delete Image"
        destroyOnHidden={true}
        onCancel={() => setShowDel(false)}
        onOk={deletePhoto}
        getContainer={() => {
          const root = document.getElementsByClassName("yarl__root")[0];
          return root ? root : document.body;
        }}
        style={{ zIndex: 9999 }}
      >
        <Form labelCol={{ span: 4 }} initialValues={currentPhoto}>
          <Form.Item label="name" name="name">
            <Input disabled={true} />
          </Form.Item>
          <Form.Item label="uuid" name="uuid">
            <Input disabled={true} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Gallery;
