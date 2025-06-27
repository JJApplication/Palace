import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { useNavigate, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { apiGetAlbumImageList, apiGetAlbumInfo } from "./api/album.js";
import "./styles/AlbumDetail.css";
import {
  Button,
  Card,
  Flex,
  FloatButton,
  List,
  Modal,
  Space,
  Spin,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
  CloudUploadOutlined,
  EnvironmentOutlined,
  LikeOutlined,
  PictureOutlined,
} from "@ant-design/icons";

import { getDate, getPrivilege, isAdmin } from "./util.js";

import { PhotoList, PhotoType } from "./components/PhotoList.jsx";
import { apiGetUser } from "./api/user.js";
import { toast } from "react-toastify";
import { apiUploadImages } from "./api/images.js";

const AlbumDetail = () => {
  const { Text, Paragraph } = Typography;
  const navigate = useNavigate();
  const ref = useRef(null);
  const refWithQueue = useRef(null);
  const { id } = useParams();

  const [info, setInfo] = useState({});
  const [photos, setPhotos] = useState([]);
  const [privilege, setPrivilege] = useState("guest");
  const [showUpload, setShowUpload] = useState(false);
  const [status, setStatus] = useState(0); // 普通上传的状态
  const [uploadStatus, setUploadStatus] = useState({
    start: false,
    total: 0,
    done: 0,
    failed: 0,
    complete: false,
    files: [], // 已经处理的文件{file, done}
  }); // 图片上传队列状态

  const resetUploadStatus = () => {
    setUploadStatus({
      start: false,
      total: 0,
      done: 0,
      failed: 0,
      complete: false,
      files: [],
    });
  };

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

  const changeUpload = (status) => {
    switch (status) {
      case 0: {
        return "upload images";
      }
      case 1: {
        return "uploading...";
      }
      case 2: {
        return "done";
      }
      case 3: {
        return "upload failed";
      }
      default: {
        return "upload images";
      }
    }
  };

  const openUpload = () => {
    if (status === 1) {
      return;
    }
    setStatus(0);
    ref.current.click();
  };

  const startUpload = (e) => {
    if (e.target.files && e.target.files.length <= 0) {
      return;
    }
    setStatus(1);
    const files = e.target.files;
    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }
    apiUploadImages(formData)
      .then((res) => {
        if (!res.ok) {
          setStatus(3);
          toast.error("upload failed");
          return;
        }
        setStatus(2);
        toast("upload success");
      })
      .catch((e) => {
        setStatus(3);
        toast.error("upload failed" + e);
      });
  };

  // 队列上传
  const uploadOneFile = (file) => {
    const formData = new FormData();
    formData.append("files", file);
    return apiUploadImages(formData, id);
  };

  const openUploadQueue = () => {
    if (uploadStatus.start === false && uploadStatus.complete === false) {
      refWithQueue.current.click();
    } else if (uploadStatus.start === true && uploadStatus.complete === true) {
      refWithQueue.current.click();
    }
  };
  const startUploadQueue = async (e) => {
    if (e.target.files && e.target.files.length <= 0) {
      return;
    }
    resetUploadStatus();
    const files = [];
    for (let file of e.target.files) {
      files.push({ name: file.name, done: false, failed: false });
    }
    setUploadStatus({
      start: false,
      total: files.length,
      done: 0,
      failed: 0,
      complete: false,
      files: files,
    });
    let done = 0;
    let failed = 0;
    let process = 0;
    let complete = false;
    for (let file of e.target.files) {
      process++;
      if (process === files.length) {
        // 处理最后一个文件
        complete = true;
      }
      try {
        const res = await uploadOneFile(file);
        if (res.ok) {
          // 上传成功更新状态
          done += 1;
          const index = files.findIndex((f) => f.name === file.name);
          files[index].done = true;
          setUploadStatus({
            start: true,
            total: files.length,
            done: done,
            failed: failed,
            complete: complete,
            files: files,
          });
        } else {
          failed += 1;
          const index = files.findIndex((f) => f.name === file.name);
          files[index].failed = true;
          setUploadStatus({
            start: true,
            total: files.length,
            done: done,
            failed: failed,
            complete: complete,
            files: files,
          });
        }
      } catch {
        failed += 1;
        const index = files.findIndex((f) => f.name === file.name);
        files[index].failed = true;
        setUploadStatus({
          start: true,
          total: files.length,
          done: done,
          failed: failed,
          complete: complete,
          files: files,
        });
      }
    }
  };

  const renderUploadTitle = () => {
    return (
      <>
        <Space>
          <Tag color={"geekblue"}>Total: {uploadStatus.total}</Tag>
          <Tag color={"green"}>Done: {uploadStatus.done}</Tag>
          <Tag color={"red"}>Failed: {uploadStatus.failed}</Tag>
        </Space>
      </>
    );
  };

  return (
    <>
      <Header />
      <main className="album-detail">
        {isAdmin(privilege) && (
          <Tooltip title={"上传图片"}>
            <FloatButton
              icon={<CloudUploadOutlined />}
              type={"primary"}
              onClick={() => setShowUpload(true)}
            />
          </Tooltip>
        )}
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
        <Space size={"small"} wrap={true}>
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
          <PhotoList
            photos={photos}
            photoType={PhotoType.album}
            albumId={id}
            photosCb={getAlbumInfo}
            privilege={privilege}
          />
          <p style={{ textAlign: "center", marginBottom: 0 }}>
            Like more & Love more
          </p>
        </div>
      </main>
      <Modal
        title="Upload Photos"
        open={showUpload}
        onCancel={() => {
          resetUploadStatus();
          setShowUpload(false);
          getAlbumInfo();
        }}
        onOk={() => {
          getAlbumInfo();
        }}
        destroyOnClose={true}
        destroyOnHidden={true}
        maskClosable={false}
        footer={null}
        style={{ maxHeight: "720px" }}
      >
        <Card>
          <Space size={"middle"}>
            <Button onClick={openUpload}>{changeUpload(status)}</Button>
            <Button onClick={openUploadQueue}>upload Queue</Button>
            <input
              ref={ref}
              type="file"
              onChange={(e) => startUpload(e)}
              multiple
              accept="image/*"
              style={{ display: "none" }}
            />
            <input
              ref={refWithQueue}
              type="file"
              onChange={(e) => startUploadQueue(e)}
              multiple
              accept="image/*"
              style={{ display: "none" }}
            />
          </Space>
        </Card>
        <br />
        {uploadStatus.start && (
          <Card title={renderUploadTitle()}>
            <List
              bordered={true}
              className={"upload-list-container"}
              dataSource={uploadStatus?.files}
              renderItem={(item) => (
                <List.Item>
                  <Flex
                    justify={"space-between"}
                    align={"center"}
                    style={{ width: "100%" }}
                  >
                    <Text ellipsis={true} style={{ width: "85%" }}>
                      {item.name}
                    </Text>
                    {!item.done && !item.failed && <Spin />}
                    {item.done && (
                      <CheckSquareOutlined style={{ color: "#3aff3a" }} />
                    )}
                    {item.failed && (
                      <CloseSquareOutlined style={{ color: "#ff0000" }} />
                    )}
                  </Flex>
                </List.Item>
              )}
            ></List>
          </Card>
        )}
      </Modal>
      <Footer />
    </>
  );
};

export default AlbumDetail;
