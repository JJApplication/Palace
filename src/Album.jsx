import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Flex,
  FloatButton,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Popover,
  Skeleton,
  Space,
  Tag,
  Tooltip,
} from "antd";
import {
  apiAddAlbum,
  apiDeleteAlbum,
  apiGetAlbums,
  apiHideAlbum, apiLikeAlbum,
  apiUpdateAlbum
} from "./api/album.js";
import { toast } from "react-toastify";
import "./styles/Album.css";
import {
  LikeOutlined,
  PictureOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router";
import debounce from "lodash/debounce";
import cloneDeep from "lodash/cloneDeep";

import { formatImageUrl, isAdmin, noCover } from "./util.js";
import HiddenCover from "./components/HiddenCover.jsx";
import UserContext from "./components/UserContext.jsx";

const like = (id) => {
  if (!id) return;
  const params = {cate: id}
  apiLikeAlbum(params).then((res) => {
    if (res.ok) {
      toast("点赞成功");
      return
    }
    toast.error('点赞失败')
  })
};
const debounceLike = debounce(like, 1500, { leading: true });

const Album = () => {
  const [form] = Form.useForm();
  const [formEdit] = Form.useForm();

  const [init, setInit] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [addAlbumInfo, setAddAlbumInfo] = useState({});
  const [editAlbumInfo, setEditAlbumInfo] = useState({});
  const [showAddAlbum, setShowAddAlbum] = useState(false);
  const [showEditAlbum, setShowEditAlbum] = useState(false);
  const [albumLike, setAlbumLike] = useState({}); // 保持键值对

  const { privilege } = useContext(UserContext);

  const getAlbums = () => {
    setInit(false);
    apiGetAlbums()
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            setAlbums(data.data || []);
          });
          return;
        }
        toast.error("获取相册数据失败");
      })
      .finally(() => {
        setInit(true);
      });
  };

  useEffect(() => {
    getAlbums();
  }, []);

  const handleLikeAlbum = (id) => {
    const data = cloneDeep(albumLike);
    setAlbumLike(Object.assign(data, {[id]: true}));
    debounceLike(id);
  };

  const handleAddAlbum = async () => {
    try {
      await form.validateFields();
      const data = form.getFieldsValue();
      if (data) {
        apiAddAlbum(data).then((res) => {
          if (res.ok) {
            toast.success("相册创建成功");
            getAlbums();
            form.resetFields();
            setShowAddAlbum(false);
            return;
          }
          toast.error("相册创建失败");
        });
      }
    } catch {
      form.resetFields();
      setShowAddAlbum(false);
    }
  };

  const hideAlbum = (id, hidden) => {
    const data = { cate: id, hide: hidden };
    const msg = hidden > 0 ? "隐藏" : "取消隐藏";
    apiHideAlbum(data).then((res) => {
      if (res.ok) {
        toast(`相册${msg}成功`);
        getAlbums();
        return;
      }
      toast.error(`相册${msg}失败`);
    });
  };

  const handleCancelAddAlbum = () => {
    setShowAddAlbum(false);
    form.resetFields();
    setAddAlbumInfo({});
  };

  const handleRemoveAlbum = (item) => {
    const { id, name } = item;
    apiDeleteAlbum({ id: id, name: name }).then((res) => {
      if (res.ok) {
        toast("相册删除成功");
        getAlbums();
        return;
      }
      toast.error("相册删除失败");
    });
  };

  const openEditAlbum = (item) => {
    setEditAlbumInfo(item);
    setShowEditAlbum(true);
  };
  const handleEditAlbum = async () => {
    try {
      await formEdit.validateFields();
      const data = formEdit.getFieldsValue();
      data.id = editAlbumInfo.id;
      if (data) {
        apiUpdateAlbum(data).then((res) => {
          if (res.ok) {
            toast.success("相册更新成功");
            getAlbums();
            formEdit.resetFields();
            setShowEditAlbum(false);
            return;
          }
          toast.error("相册更新失败");
        });
      }
    } catch {
      formEdit.resetFields();
      setShowEditAlbum(false);
    }
  };

  const handleCancelEditAlbum = () => {
    setShowEditAlbum(false);
    formEdit.resetFields();
    setEditAlbumInfo({});
  };

  const hideBtn = (item) => {
    if (!item?.need_hide || item?.need_hide <= 0) {
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
              <Button onClick={() => hideAlbum(item?.id, 1)}>Hide</Button>
              <Button onClick={() => hideAlbum(item?.id, 2)}>
                Hide From Guest
              </Button>
            </Space>
          }
        >
          <Button type={"text"} key="list-hide" title="隐藏相册">
            Hide
          </Button>
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
        onConfirm={() => hideAlbum(item?.id, 0)}
      >
        <Button type={"text"} key="list-unhide" title="取消隐藏">
          Unhide
        </Button>
      </Popconfirm>
    );
  };
  const renderActions = (item) => {
    if (!isAdmin(privilege)) {
      return [
        <NavLink to={`/album/${item.id}`} key="list-open">
          <Button type={"text"}>Open</Button>
        </NavLink>,
      ];
    }
    return [
      <NavLink to={`/album/${item.id}`} key="list-open">
        <Button type={"text"}>Open</Button>
      </NavLink>,
      <Button type={"text"} key="list-edit" onClick={() => openEditAlbum(item)}>
        Edit
      </Button>,
      hideBtn(item),
      <Popconfirm
        title={"确认删除"}
        key="list-delete"
        placement={"bottom"}
        onConfirm={() => handleRemoveAlbum(item)}
      >
        <Button type={"text"}>Delete</Button>
      </Popconfirm>,
    ];
  };

  const renderTitle = (item) => {
    if (!isAdmin(privilege) && item?.need_hide >= 1) {
      return (
        <a href="#" style={{ fontSize: "1.5rem" }}>
          {item.name}
        </a>
      );
    }
    return (
      <a href={`/album/${item.id}`} style={{ fontSize: "1.5rem" }}>
        {item.name}
      </a>
    );
  };
  const renderCover = (item) => {
    if (!isAdmin(privilege) && item?.need_hide >= 1) {
      return <HiddenCover type="album" />;
    }
    return (
      <NavLink to={`/album/${item.id}`} key="nav-album">
        <img
          width={256}
          alt="logo"
          src={formatImageUrl(item.cover) || noCover()}
        />
      </NavLink>
    );
  };

  return (
    <>
      <Header />
      {!init ? (
        <div
          style={{ width: "100%", maxWidth: 720, margin: "4rem auto 0 auto" }}
        >
          {[1, 2, 3, 4].map((item, index) => (
            <Flex
              key={index}
              justify="space-between"
              align="center"
              style={{ width: "100%", marginBottom: "1.5rem" }}
            >
              <Space
                direction={"vertical"}
                style={{ width: "calc(100% - 160px)" }}
              >
                <Skeleton.Input
                  active
                  block
                  size={"small"}
                  style={{ width: "65%" }}
                />
                <Skeleton.Input
                  active
                  block
                  size={"small"}
                  style={{ width: "100%" }}
                />
                <Skeleton.Input
                  active
                  block
                  size={"small"}
                  style={{ width: "100%" }}
                />
                <Skeleton.Input
                  active
                  block
                  size={"small"}
                  style={{ width: "100%" }}
                />
              </Space>
              <Skeleton.Image active style={{ width: 128, height: 128 }} />
            </Flex>
          ))}
        </div>
      ) : (
        <main className="album">
          {isAdmin(privilege) && (
            <Tooltip title={"创建相册"}>
              <FloatButton
                icon={<PlusSquareOutlined />}
                type={"primary"}
                onClick={() => setShowAddAlbum(true)}
              />
            </Tooltip>
          )}
          <List
            itemLayout="horizontal"
            dataSource={albums}
            renderItem={(item, index) => (
              <List.Item
                style={{ position: "relative" }}
                actions={renderActions(item)}
                extra={renderCover(item)}
              >
                <List.Item.Meta
                  title={renderTitle(item)}
                  description={
                    <div>
                      <span>{item.cate_info || "暂时没有描述信息"}</span>
                      <br />
                      <Space
                        style={{ marginTop: "4px" }}
                        direction="horizontal"
                      >
                        <Tag>
                          <PictureOutlined /> 图片: {item.image_count}
                        </Tag>
                        <Tag
                          onClick={() => handleLikeAlbum(item.id)}
                          style={{ userSelect: "none", cursor: "pointer" }}
                          color={albumLike[item.id] ? 'blue' : null}
                        >
                          <LikeOutlined /> 点赞: {item.like}
                        </Tag>
                      </Space>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </main>
      )}
      <Modal
        open={showAddAlbum}
        title="Add Album"
        destroyOnHidden={true}
        onCancel={handleCancelAddAlbum}
        onOk={handleAddAlbum}
      >
        <Form form={form}>
          <Form.Item
            label="album name"
            name={"name"}
            rules={[{ required: true, message: "请输入相册名称" }]}
          >
            <Input placeholder="输入相册名称" />
          </Form.Item>
          <Form.Item label="album info" name={"cate_info"}>
            <Input placeholder="输入相册描述" />
          </Form.Item>
          <Form.Item label="album date" name={"cate_date"}>
            <Input placeholder="输入相册纪念日期" />
          </Form.Item>
          <Form.Item label="album position" name={"cate_position"}>
            <Input placeholder="输入相册位置" />
          </Form.Item>
          <Form.Item label="album cover" name={"cover"}>
            <Input placeholder="输入相册封面图地址" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={showEditAlbum}
        title="Edit Album"
        destroyOnHidden={true}
        onCancel={handleCancelEditAlbum}
        onOk={handleEditAlbum}
      >
        <Form form={formEdit} initialValues={editAlbumInfo}>
          <Form.Item
            label="album name"
            name={"name"}
            rules={[{ required: true, message: "请输入相册名称" }]}
          >
            <Input placeholder="输入相册名称" />
          </Form.Item>
          <Form.Item label="album info" name={"cate_info"}>
            <Input placeholder="输入相册描述" />
          </Form.Item>
          <Form.Item label="album date" name={"cate_date"}>
            <Input placeholder="输入相册纪念日期" />
          </Form.Item>
          <Form.Item label="album position" name={"cate_position"}>
            <Input placeholder="输入相册位置" />
          </Form.Item>
          <Form.Item label="album cover" name={"cover"}>
            <Input placeholder="输入相册封面图地址" />
          </Form.Item>
        </Form>
      </Modal>
      <Footer />
    </>
  );
};

export default Album;
