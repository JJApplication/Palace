// 图片流组件
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm, Popover,
  Select,
  Space,
  Tag,
} from "antd";
import { useRef, useState } from "react";
import { RowsPhotoAlbum } from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import { toast } from "react-toastify";
import { isAdmin } from "../util.js";
import { apiGetAlbums, apiSetAlbumCover } from "../api/album.js";
import {
  apiDeleteImage,
  apiGetImageInfo,
  apiHideImage,
  apiImageAddCate,
} from "../api/images.js";
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FlagOutlined,
  InfoCircleOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { apiRecycleImage } from "../api/recycle.js";
import HiddenCover from "./HiddenCover.jsx";

const PhotoType = {
  gallery: "gallery",
  album: "album",
  tag: "tag",
  recycle: "recycle",
};

const PhotoList = ({
  photoType,
  photos,
  albumId,
  tagId,
  photosCb,
  privilege = "guest",
}) => {
  const ref = useRef(null);
  const [formCate] = Form.useForm();

  const [index, setIndex] = useState(-1);
  const [currentPhoto, setCurrentPhoto] = useState({});
  const [currentPhotoInfo, setCurrentPhotoInfo] = useState({}); // 当前图片详情包含更加详细的图片信息

  const [showInfo, setShowInfo] = useState(false);
  const [showCate, setShowCate] = useState(false);
  const [showTag, setShowTag] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [showDelReal, setShowDelReal] = useState(false);

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const getLightboxList = (photoList) => {
    return photoList.map((p) => {
      return { src: p.image };
    });
  };

  const getPhotoInfo = () => {
    if (!currentPhoto || !currentPhoto?.uuid) {
      return;
    }
    apiGetImageInfo({ uuid: currentPhoto.uuid }).then((res) => {
      if (!res.ok) {
        toast.error("获取图片信息失败");
        return;
      }
      res.json().then((data) => {
        setCurrentPhotoInfo(data.data);
      });
    });
  };

  const hideImage = (uuid, hidden) => {
    const data = { uuid: uuid, hide: hidden };
    const msg = hidden > 0 ? "隐藏" : "取消隐藏";
    apiHideImage(data).then((res) => {
      if (res.ok) {
        toast(`图片${msg}成功`);
        return;
      }
      toast.error(`图片${msg}失败`);
    });
  };

  const setCover = (thumbnail) => {
    if (!thumbnail) {
      return;
    }
    const data = { cover: thumbnail, id: Number(albumId) };
    apiSetAlbumCover(data).then((res) => {
      if (res.ok) {
        toast("封面设置成功");
        return;
      }
      toast.error("封面设置失败");
    });
  };

  const deletePhoto = () => {
    const data = { uuid: currentPhoto.uuid, logical_delete: true };
    apiDeleteImage(data)
      .then((res) => {
        if (res.ok) {
          toast("delete success");
          photosCb ? photosCb() : null;
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

  const recyclePhoto = () => {
    apiRecycleImage([currentPhoto.uuid])
      .then((res) => {
        if (res.ok) {
          toast("delete success");
          ref?.current?.close();
          photosCb ? photosCb() : null;
        } else {
          toast.error("delete failed");
        }
      })
      .catch(() => {
        toast.error("delete failed");
      })
      .finally(() => {
        setShowDelReal(false);
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

  // 按钮分组
  const baseBtns = () => {
    return [
      <Button
        style={{ width: "48px", height: "48px" }}
        key="info-button"
        title="图片信息"
        icon={<InfoCircleOutlined style={{ fontSize: "24px" }} />}
        className="yarl__button"
        onClick={async () => {
          await getPhotoInfo();
          setShowInfo(true);
        }}
      ></Button>,
    ];
  };

  const actionBtns = () => {
    return [
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
    ];
  };

  const coverBtn = () => {
    return (
      <Popconfirm
        key={"add-cover"}
        title="Set photo as cover"
        description="Please confirm before proceeding to the next step."
        okText="Yes"
        cancelText="No"
        getPopupContainer={() => {
          const root = document.getElementsByClassName("yarl__root")[0];
          return root ? root : document.body;
        }}
        onConfirm={() => setCover(currentPhoto?.src)}
      >
        <Button
          style={{ width: "48px", height: "48px" }}
          title="设为封面"
          key="add-cover-button"
          icon={<FlagOutlined style={{ fontSize: "24px" }} />}
          className="yarl__button"
        ></Button>
      </Popconfirm>
    );
  };

  const delBtn = () => {
    return (
      <Button
        style={{ width: "48px", height: "48px" }}
        key="delete-button"
        icon={<DeleteOutlined style={{ fontSize: "24px" }} />}
        className="yarl__button"
        onClick={() => {
          setShowDel(true);
        }}
      ></Button>
    );
  };

  const delRealBtn = () => {
    return (
      <Button
        style={{ width: "48px", height: "48px" }}
        key="delete-real-button"
        icon={<DeleteOutlined style={{ fontSize: "24px" }} />}
        className="yarl__button"
        onClick={() => {
          setShowDelReal(true);
        }}
      ></Button>
    );
  };

  const hideBtn = () => {
    if (!currentPhoto?.need_hide || currentPhoto?.need_hide <= 0) {
      return (
          <Popover
              key={"hide"}
              title="Hide Photo"
              placement="bottom"
              getPopupContainer={() => {
                const root = document.getElementsByClassName("yarl__root")[0];
                return root ? root : document.body;
              }}
              trigger="click"
              content={
                  <Space>
                    <Button onClick={() => hideImage(currentPhoto?.uuid, 1)}>
                      Hide
                    </Button>
                    <Button onClick={() => hideImage(currentPhoto?.uuid, 2)}>
                      Hide From Guest
                    </Button>
                  </Space>
              }
          >
          <Button
            style={{ width: "48px", height: "48px" }}
            key="info-button"
            title="隐藏图片"
            icon={<EyeInvisibleOutlined style={{ fontSize: "24px" }} />}
            className="yarl__button"
          ></Button>
      </Popover>
      );
    }
    return (
      <Popconfirm
        key={"unhide"}
        title="Unhide Photo"
        description="Please confirm before proceeding to the next step."
        okText="Yes"
        cancelText="No"
        getPopupContainer={() => {
          const root = document.getElementsByClassName("yarl__root")[0];
          return root ? root : document.body;
        }}
        onConfirm={() => hideImage(currentPhoto?.uuid, 0)}
      >
        <Button
          style={{ width: "48px", height: "48px" }}
          key="info-button"
          title="取消隐藏"
          icon={<EyeOutlined style={{ fontSize: "24px" }} />}
          className="yarl__button"
        ></Button>
      </Popconfirm>
    );
  };
  const renderPhotoButtons = (photoType) => {
    if (!isAdmin(privilege)) {
      const buttons = baseBtns();
      buttons.push("close");
      return buttons;
    }
    switch (photoType) {
      case PhotoType.gallery: {
        const buttons = baseBtns();
        buttons.push(...actionBtns(), hideBtn(), delBtn(), "close");
        return buttons;
      }
      case PhotoType.album: {
        const buttons = baseBtns();
        buttons.push(...actionBtns(), hideBtn(), coverBtn(), delBtn(), "close");
        return buttons;
      }
      case PhotoType.recycle: {
        const buttons = baseBtns();
        buttons.push(delRealBtn(), "close");
        return buttons;
      }
      default: {
        const buttons = baseBtns();
        buttons.push("close");
        return buttons;
      }
    }
  };

  const renderCategories = (data) => {
    if (!data) {
      return null;
    }
    return (
      <Space wrap={true} size={"small"}>
        {data.map((cate) => {
          return <Tag key={cate}>{cate}</Tag>;
        })}
      </Space>
    );
  };

  const renderTags = (data) => {
    if (!data) {
      return null;
    }
    return (
      <Space wrap={true} size={"small"}>
        {data.map((tag) => {
          return <Tag key={tag}>{tag}</Tag>;
        })}
      </Space>
    );
  };

  return (
    <>
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
        render={{
          extras: (_, { photo }) => {
            if (!isAdmin(privilege) && (photo && photo?.need_hide >= 1)) {
              return <HiddenCover />;
            }
          },
        }}
      />

      <Lightbox
        slides={getLightboxList(photos)}
        controller={{ ref }}
        open={index >= 0}
        index={index}
        close={() => {
          setIndex(-1);
        }}
        // enable optional lightbox plugins
        plugins={[Fullscreen, Thumbnails, Zoom]}
        on={{
          view: (e) => {
            const photo = photos[e.index];
            if (photo) {
              setCurrentPhoto(photo);
            }
            setIndex(e.index);
          },
          exited: () => {
            setIndex(-1);
            setCurrentPhoto({});
          },
        }}
        toolbar={{
          buttons: renderPhotoButtons(photoType),
        }}
      />
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
          <Form.Item label="albums">
            {renderCategories(currentPhotoInfo?.category)}
          </Form.Item>
          <Form.Item label="tags">
            {renderTags(currentPhotoInfo?.tags)}
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
      <Modal
        open={showDelReal}
        title="Delete Image in Storage"
        destroyOnHidden={true}
        onCancel={() => setShowDelReal(false)}
        onOk={recyclePhoto}
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
    </>
  );
};

export { PhotoType, PhotoList };
