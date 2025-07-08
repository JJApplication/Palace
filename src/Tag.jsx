import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import "./styles/Tag.css";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Col,
  FloatButton,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Skeleton,
  Space,
  Tag,
  Tooltip,
} from "antd";
import { apiAddTag, apiGetTagList } from "./api/tag.js";
import { toast } from "react-toastify";
import { NavLink } from "react-router";
import { isAdmin } from "./util.js";
import { BorderInnerOutlined } from "@ant-design/icons";
import UserContext from "./components/UserContext.jsx";

const TagPage = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const { privilege } = useContext(UserContext);
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const emptyArray = new Array(40).fill(0);
  const options = [
    { value: "magenta" },
    { value: "red" },
    { value: "volcano" },
    { value: "orange" },
    { value: "gold" },
    { value: "lime" },
    { value: "green" },
    { value: "cyan" },
    { value: "blue" },
    { value: "geekblue" },
    { value: "purple" },
  ];

  useEffect(() => {
    getTags();
  }, []);

  const getTags = () => {
    setLoading(true);
    apiGetTagList()
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            setTags(data.data);
            toast("标签获取成功");
          });
          return;
        }
        toast.error("标签获取失败");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddTag = () => {
    const data = form.getFieldsValue();
    if (!data.name) {
      return;
    }
    apiAddTag(data).then((res) => {
      if (res.ok) {
        toast("标签创建成功");
        getTags();
        setShowAdd(false);
        return;
      }
      toast.error("标签创建失败");
    });
  };

  const renderTags = (tags) => {
    return (
      <Space wrap={true} size={"small"}>
        {tags.map((tag) => {
          if (!tag.tag_color || tag.tag_color === "") {
            return (
              <NavLink to={`/tag/${tag.name}`} key={tag.name}>
                <Tag style={{ padding: "2px 6px", cursor: "pointer" }}>
                  {`${tag.name}: ${tag.image_count || 0}`}
                </Tag>
              </NavLink>
            );
          } else {
            return (
              <NavLink to={`/tag/${tag.name}`} key={tag.name}>
                <Tag
                  color={tag.tag_color}
                  key={tag.name}
                  style={{ padding: "2px 6px", cursor: "pointer" }}
                >
                  {`${tag.name}: ${tag.image_count || 0}`}
                </Tag>
              </NavLink>
            );
          }
        })}
      </Space>
    );
  };

  return (
    <>
      <Header />
      <main className="tag">
        {isAdmin(privilege) && (
          <Tooltip title={"创建标签"}>
            <FloatButton
              icon={<BorderInnerOutlined />}
              type={"primary"}
              onClick={() => setShowAdd(true)}
            />
          </Tooltip>
        )}
        {loading ? (
          <>
            <Row gutter={[16, 16]} wrap={true}>
              {emptyArray.map((_, i) => (
                <Col span={6} key={i} xs={12} sm={8} xl={4}>
                  <Skeleton.Input
                    active
                    block
                    size={"small"}
                    style={{ width: "100%" }}
                  />
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <>{renderTags(tags)}</>
        )}
        <Modal
          title="Create Tag"
          open={showAdd}
          destroyOnHidden={true}
          footer={null}
          onCancel={() => setShowAdd(false)}
        >
          <Form form={form}>
            <Form.Item label="tag name" name={"name"}>
              <Input />
            </Form.Item>
            <Form.Item label="tag info" name={"tag_info"}>
              <TextArea size={"large"} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Form.Item
                  label="tag color"
                  name={"tag_color"}
                  style={{ marginBottom: 0 }}
                >
                  <Input allowClear placeholder={'eg: #ffffff'} />
                </Form.Item>
                <Select
                  style={{ width: "120px" }}
                  options={options}
                  optionRender={(option) => (
                    <Tag color={option.value}>{option.value}</Tag>
                  )}
                  onChange={(e) => {
                    form.setFieldValue("tag_color", e);
                  }}
                ></Select>
              </Space>
            </Form.Item>
            <Button type="primary" htmlType={"submit"} onClick={handleAddTag}>
              Add
            </Button>
          </Form>
        </Modal>
      </main>
      <Footer />
    </>
  );
};

export default TagPage;
