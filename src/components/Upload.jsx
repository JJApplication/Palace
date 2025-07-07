import {
  Button,
  Card,
  Flex,
  List,
  Modal,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import {
  CheckSquareOutlined,
  CloseSquareOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import { useRef, useState } from "react";
import { apiUploadImages } from "../api/images.js";
import { toast } from "react-toastify";

const Upload = ({ title = "Upload", album, onOk, onBad }) => {
  if (!onOk) {
    onOk = () => {};
  }
  if (!onBad) {
    onBad = () => {};
  }

  const { Text } = Typography;

  const ref = useRef(null);
  const refWithQueue = useRef(null);
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
    return apiUploadImages(formData, album);
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
      start: true,
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
      <Button
        icon={<CloudUploadOutlined />}
        onClick={() => setShowUpload(true)}
      >
        {title}
      </Button>
      <Modal
        title="Upload Photos"
        open={showUpload}
        onCancel={() => {
          resetUploadStatus();
          setShowUpload(false);
          onBad();
        }}
        onOk={() => {
          onOk();
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
    </>
  );
};

export default Upload;
