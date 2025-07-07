import "../styles/Task.css";
import { Button, Card, Divider, Popconfirm, Space, Table, Tag, Typography } from "antd";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { ClearOutlined, SyncOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  apiClearImages,
  apiClearTasks,
  apiPackageImages,
  apiQueryTasks,
  apiRemovePosition,
  apiSyncAlbumLike,
  apiSyncHide,
  apiSyncImageLike,
} from "../api/task.js";
import { toast } from "react-toastify";
import { getDateTime } from "../util.js";

const {Text } = Typography;

const columns = [
  {
    title: "Name",
    dataIndex: "task_name",
    key: "task_name",
  },
  {
    title: "Task ID",
    dataIndex: "task_id",
    key: "task_id",
    width: 200,
    render: (text, record) => {
      return (
        <Text ellipsis={true} style={{ maxWidth: 200 }} title={text}>{text}</Text>
      )
    }
  },
  {
    title: "Create At",
    dataIndex: "create_at",
    key: "create_at",
    render: (text, record) => {
      return getDateTime(text)
    }
  },
  {
    title: "End Time",
    dataIndex: "task_end_time",
    key: "task_end_time",
    render: (text, record) => {
      return getDateTime(text)
    }
  },
  {
    title: "Status",
    dataIndex: "task_status",
    key: "task_status",
    width: 100,
    render: (text, record) => {
      switch (text) {
        case "running":
          return (<Tag color={'cyan'}>{text}</Tag>)
       case "success":
         return (<Tag color={'green'}>{text}</Tag>)
        case "failed":
          return (<Tag color={'red'}>{text}</Tag>)
      }
    }
  },
];

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTasks = () => {
    setLoading(true);
    apiQueryTasks()
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            setTasks(data.data);
            toast("任务列表获取成功");
          });
        } else {
          toast.error("任务列表获取失败");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getTasks();
  }, []);

  const clearTasks = () => {
    apiClearTasks().then((res) => {
      if (res.ok) {
        toast("任务列表清空成功");
        getTasks();
        return;
      }
      toast.error("任务列表清空失败");
    });
  };

  const removePosition = () => {
    apiRemovePosition().then((res) => {
      if (res.ok) {
        toast("删除图片位置任务下发成功");
        return;
      }
      toast.error("删除图片位置任务下发失败");
    });
  };

  const clearImages = () => {
    apiClearImages().then((res) => {
      if (res.ok) {
        toast("清理无用图片任务下发成功");
        return;
      }
      toast.error("清理无用图片任务下发失败");
    });
  };

  const packageImages = () => {
    apiPackageImages().then((res) => {
      if (res.ok) {
        toast("打包任务下发成功");
        return;
      }
      toast.error("打包任务下发失败");
    });
  };

  const syncHide = () => {
    apiSyncHide().then((res) => {
      if (res.ok) {
        toast("同步隐藏图片任务下发成功");
        return;
      }
      toast.error("同步隐藏图片任务下发失败");
    });
  };

  const syncImageLike = () => {
    apiSyncImageLike().then((res) => {
      if (res.ok) {
        toast("同步图片点赞任务下发成功");
        return;
      }
      toast.error("同步图片点赞任务下发失败");
    });
  };

  const syncAlbumLike = () => {
    apiSyncAlbumLike().then((res) => {
      if (res.ok) {
        toast("同步相册点赞任务下发成功");
        return;
      }
      toast.error("同步相册点赞任务下发失败");
    });
  };

  return (
    <>
      <Header />
      <main className="task">
        <Card title="Task Manager">
          <p>
            Task List &emsp;
            <Button
              shape="circle"
              type="primary"
              icon={<SyncOutlined />}
              onClick={getTasks}
            />
            &emsp;
            <Popconfirm title={"Conform your action"} onConfirm={clearTasks}>
              <Button
                shape="circle"
                type="primary"
                danger
                icon={<ClearOutlined />}
              />
            </Popconfirm>
          </p>
          <Table
            loading={loading}
            columns={columns}
            dataSource={tasks}
            size={"small"}
            style={{ maxHeight: "320px", width: 'auto', overflowY: "auto" }}
            pagination={false}
          />
          <Divider />
          <p>Tasks</p>
          <Space size={"large"} wrap={true}>
            <Button onClick={() => syncHide()}>Sync HiddenImages</Button>
            <Button onClick={() => clearImages()}>Clear UnusedImages</Button>
            <Button onClick={() => removePosition()}>
              Remove ImagePosition
            </Button>
            <Button onClick={() => packageImages()}>Package Images</Button>
            <Button onClick={() => syncImageLike()}>ForceSync ImageLike</Button>
            <Button onClick={() => syncAlbumLike()}>ForceSync AlbumLike</Button>
          </Space>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default Task;
