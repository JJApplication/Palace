import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { useEffect, useState } from "react";
import { List, Space, Tag } from "antd";
import { apiGetAlbums } from "./api/album.js";
import { toast } from "react-toastify";
import './styles/Album.css';
import { FileImageOutlined, LikeOutlined } from "@ant-design/icons";

const Album = () => {
  const [albums, setAlbums] = useState([])

  const getAlbums = () => {
    apiGetAlbums().then(res => {
      if (res.ok) {
        res.json().then(data => {
          setAlbums(data.data || [])
        })
        return
      }
      toast.error('获取相册数据失败')
    })
  }

  useEffect(() => {
    getAlbums()
  }, [])

  return (
    <>
      <Header />
      <main className="album">
        <List
          itemLayout="horizontal"
          dataSource={albums}
          renderItem={(item, index) => (
            <List.Item
              extra={
                <img
                  width={256}
                  alt="logo"
                  src={item.cover || 'https://cdn.pixabay.com/photo/2022/01/25/12/16/laptop-6966045_960_720.jpg'}
                />
              }
            >
              <List.Item.Meta
                title={<a href={`/album/${item.id}`}>{item.name}</a>}
                description={
                  <div>
                    <span>{item.cate_info || "暂时没有描述信息"}</span>
                    <br />
                    <Space style={{ marginTop: "4px" }} direction="horizontal">
                      <Tag>
                        <FileImageOutlined /> 图片: {item.image_count}
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
      <Footer />
    </>
  );
}

export default Album