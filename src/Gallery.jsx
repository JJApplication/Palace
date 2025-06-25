import { useEffect, useState } from "react";
import "react-photo-album/rows.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "react-toastify/dist/ReactToastify.css";
import logo from "./assets/logo.gif";
import { useNavigate } from "react-router";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import {
  apiGetImageList,
} from "./api/images.js";
import {PhotoList, PhotoType} from "./components/PhotoList.jsx";
import './styles/Gallery.css';

const Gallery = () => {
  const nav = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [init, setInit] = useState(false);
  const [initCode, setInitCode] = useState("#");


  let tick = null;

  useEffect(() => {
    getPhotos();
    initCallback(initCode);
    return () => clearInterval(tick);
  }, []);

  const backHome = () => {
    nav("/");
  };

  const isInit = () => {
    const rows = document.getElementsByClassName(
      "react-photo-album react-photo-album--rows",
    );
    if (rows) {
      const rowsChildren = rows[0].children;
      if (rowsChildren && rowsChildren.length > 0) {
        return true;
      }
    }
    return init;
  };

  const initCallback = () => {
    tick = setInterval(() => {
      setInitCode((initCode) => (initCode === "#" ? "$" : "#"));
      if (isInit()) {
        clearInterval(tick);
        setInit(true);
      }
    }, 200);
  };

  const getPhotos = () => {
    apiGetImageList()
      .then((r) => {
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
          setInit(true);
        });
      })
      .catch(() => {
        setInit(true);
      });
  };

  return (
    <div
      style={{ textAlign: "center", display: "flex", justifyContent: "center" }}
    >
      {!init && (
        <div
          style={{
            zIndex: 99999,
            position: "fixed",
            top: 0,
            left: 0,
            backgroundColor: "#242424",
            height: "100%",
            width: "100%",
          }}
        >
          <h1 style={{ marginTop: "50vh", textAlign: "center" }}>
            Gallery initializing {initCode}
          </h1>
        </div>
      )}
      <Header />
      <div className={'gallery'}>
        <div
          style={{
            textAlign: "left",
            marginBottom: "1.5rem",
            paddingBottom: "0.55rem",
            height: "36px",
            userSelect: "none",
            borderBottom: "2px dashed #FFFFFF20",
          }}
        >
          <span
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
            onClick={backHome}
          >
            Enjoy
          </span>
          <img className="back-logo" src={logo} onClick={backHome} />
          <span
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
            onClick={backHome}
          >
            Life
          </span>
        </div>
        <PhotoList photoType={PhotoType.gallery} photos={photos} photosCb={getPhotos}/>
        <p style={{ textAlign: "center", marginBottom: 0 }}>
          Like more & Love more
        </p>
        <Footer />
      </div>
    </div>
  );
};

export default Gallery;
