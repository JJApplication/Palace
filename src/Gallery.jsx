import { useEffect, useState } from "react";
import { RowsPhotoAlbum } from "react-photo-album";
import 'react-photo-album/rows.css';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "react-toastify/dist/ReactToastify.css";
import logo from "./assets/logo.gif";
import { useNavigate } from "react-router";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import { apiGetImageList } from "./api/images.js";

function Gallery() {
  const nav = useNavigate();
  const [index, setIndex] = useState(-1);
  const [viewIndex, setViewIndex] = useState(-1);
  const [photos, setPhotos] = useState([]);
  const [LightboxPhotos, setLightboxPhotos] = useState([]);
  const [init, setInit] = useState(false);
  const [initCode, setInitCode] = useState("#");

  let tick = null;

  useEffect(() => {
    getPhotos()
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

    return false;
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
    apiGetImageList().then((r) => {
      r.json().then((res) => {
        const photosList = res.data.map((p) => {
          return {
            image: `/static/image/${p.uuid}${p.ext}`,
            src: `/static/thumbnail/${p.thumbnail}`,
            width: p.width,
            height: p.height,
          };
        });
        setPhotos(photosList);
        getLightboxList(photosList);
      });
    });
  };

  const getLightboxList = (photoList) => {
    setLightboxPhotos(
      photoList.map((p) => {
        return { src: p.image };
      }),
    );
  };

  return (
    <div style={{ textAlign: "center", display: "flex", justifyContent: "center" }}>
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
      <div
        style={{
          height: "100%",
          width: "100%",
          maxWidth: "1440px",
          margin: "1.5rem 0 auto",
          textAlign: "center",
        }}
      >
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
        <RowsPhotoAlbum
          breakpoints={[1440, 1200, 1080, 640, 384, 256, 128, 96, 64, 48]}
          padding={5}
          spacing={8}
          columns={(containerWidth) => {
            if (containerWidth <= 400) return 2;
            if (containerWidth <= 800) return 3;
            if (containerWidth <= 1000) return 4;
            if (containerWidth <= 1200) return 5;
            return 6;
          }}
          photos={photos}
          onClick={({ index }) => {
            setIndex(index);
          }}
        />

        <Lightbox
          slides={LightboxPhotos}
          open={index >= 0}
          index={index}
          close={() => {
            setIndex(-1);
            setViewIndex(-1);
          }}
          // enable optional lightbox plugins
          plugins={[Fullscreen, Thumbnails, Zoom]}
          on={{ view: (e) => setViewIndex(e.index) }}
        />
        <p style={{ textAlign: 'center', marginBottom: 0 }}>Like more & Love more</p>
        <Footer />
      </div>
    </div>
  );
}

export default Gallery;
