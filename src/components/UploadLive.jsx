import { Button } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";
import { useState } from "react";

const UploadLive = ({ title = "Upload LivePhoto", album, onOk, onBad }) => {
  if (!onOk) {
    onOk = () => {};
  }
  if (!onBad) {
    onBad = () => {};
  }

  const [showUpload, setShowUpload] = useState(false);

  return (
    <>
      <Button
        icon={<ThunderboltOutlined />}
        onClick={() => setShowUpload(true)}
      >
        {title}
      </Button>
    </>
  );
};

export default UploadLive;
