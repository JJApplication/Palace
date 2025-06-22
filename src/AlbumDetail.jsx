import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { apiGetAlbumInfo } from "./api/album.js";
import './styles/AlbumDetail.css';

const AlbumDetail = () => {
  const { id } = useParams();
  const [info, setInfo] = useState({});

  const getAlbumInfo = () => {
    if (!id) {
      return
    }
    const params = {id: id};
    apiGetAlbumInfo(params).then((res) => {
      if (res.ok) {
        res.json().then(data => {
          setInfo(data.data);
        })
      }
    })
  }

  useEffect(() => {
    getAlbumInfo();
  }, [])

  return (
    <>
      <Header />
      <main className="album-detail">
        <h3>{info.name}</h3>
      </main>
      <Footer />
    </>
  )
}

export default AlbumDetail;