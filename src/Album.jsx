import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { useEffect, useState } from "react";
import {
  Col, Flex,
  FloatButton,
  Form,
  Input,
  List,
  Modal,
  Popconfirm, Row,
  Skeleton,
  Space,
  Tag,
  Tooltip,
} from "antd";
import { apiAddAlbum, apiGetAlbums, apiUpdateAlbum } from "./api/album.js";
import { toast } from "react-toastify";
import "./styles/Album.css";
import {
  LikeOutlined,
  PictureOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router";
import { apiGetUser } from "./api/user.js";
import { getPrivilege, isAdmin } from "./util.js";

const Album = () => {
  const [form] = Form.useForm();
  const [formEdit] = Form.useForm();

  const [init, setInit] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [privilege, setPrivilege] = useState("guest");
  const [addAlbumInfo, setAddAlbumInfo] = useState({});
  const [editAlbumInfo, setEditAlbumInfo] = useState({});
  const [showAddAlbum, setShowAddAlbum] = useState(false);
  const [showEditAlbum, setShowEditAlbum] = useState(false);

  const getAlbums = () => {
    setInit(false);
    apiGetAlbums().then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setAlbums(data.data || []);
        });
        return;
      }
      toast.error("获取相册数据失败");
    }).finally(() => {
      setInit(true);
    });
  };

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
    getAlbums();
  }, []);

  useEffect(() => {
    getUser();
  }, []);

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

  const handleCancelAddAlbum = () => {
    setShowAddAlbum(false);
    form.resetFields();
    setAddAlbumInfo({});
  };
  const handleRemoveAlbum = (item) => {};

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

  const renderActions = (item) => {
    if (!isAdmin(privilege)) {
      return [
        <NavLink to={`/album/${item.id}`} key="list-open">
          <a style={{ fontSize: "1.05rem" }}>Open</a>
        </NavLink>,
      ];
    }
    return [
      <NavLink to={`/album/${item.id}`} key="list-open">
        <a style={{ fontSize: "1.05rem" }}>Open</a>
      </NavLink>,
      <a
        key="list-edit"
        onClick={() => openEditAlbum(item)}
        style={{ fontSize: "1.05rem" }}
      >
        Edit
      </a>,
      <Popconfirm
        title={"确认删除"}
        key="list-delete"
        placement={"bottom"}
        onConfirm={handleRemoveAlbum(item)}
      >
        <a style={{ fontSize: "1.05rem" }}>Delete</a>
      </Popconfirm>,
    ];
  };

  return (
    <>
      <Header />
      {!init ? (
          <div style={{ width: "100%", maxWidth: 720, margin: "4rem auto 0 auto" }}>
              <Row style={{ width: '100%' }}>
                <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                <Col span={18}>
                  <Space direction={'vertical'} style={{ width: '100%' }}>
                    <Skeleton.Input active block style={{ width: '65%' }}/>
                    <Skeleton.Input active block style={{ width: '100%' }} />
                    <Skeleton.Input active block style={{ width: '100%' }} />
                    <Skeleton.Input active block style={{ width: '100%' }} />
                  </Space>
                </Col>
                <Col span={4}>
                  <Skeleton.Image active style={{ width: 172, height: 172 }} />
                </Col>
                </Flex>
              </Row>
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
                actions={renderActions(item)}
                extra={
                  <NavLink to={`/album/${item.id}`} key="nav-album">
                    <img
                      width={256}
                      alt="logo"
                      src={
                        item.cover ||
                        "https://cdn.pixabay.com/photo/2022/01/25/12/16/laptop-6966045_960_720.jpg"
                      }
                    />
                  </NavLink>
                }
              >
                <List.Item.Meta
                  title={
                    <a
                      href={`/album/${item.id}`}
                      style={{ fontSize: "1.5rem" }}
                    >
                      {item.name}
                    </a>
                  }
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
                        <Tag>
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
