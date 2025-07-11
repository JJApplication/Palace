import { useContext, useEffect, useState } from "react";
import "react-photo-album/rows.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import { apiGetRecycleImageList } from "./api/recycle.js";
import { PhotoList, PhotoType } from "./components/PhotoList.jsx";
import "./styles/GalleryRecycle.css";
import { getImageUrl } from "./util.js";
import UserContext from "./components/UserContext.jsx";

const GalleryRecycle = () => {
  const [photos, setPhotos] = useState([]);
  const { privilege } = useContext(UserContext);

  useEffect(() => {
    getPhotos();
  }, []);

  const getPhotos = () => {
    apiGetRecycleImageList()
      .then((r) => {
        r.json().then((res) => {
          const photosList = res.data.map((p) => {
            return {
              image: getImageUrl("/static/image/", p.uuid, p.ext),
              src: getImageUrl("/static/thumbnail/", p.uuid, p.ext),
              width: p.width,
              height: p.height,
              ...p,
            };
          });
          setPhotos(photosList);
        });
      })
      .catch(() => {
        toast.error("获取图片列表失败");
      });
  };

  return (
    <div>
      <Header />
      <main className="recycle">
        <PhotoList
          photos={photos}
          photoType={PhotoType.recycle}
          photosCb={getPhotos}
          privilege={privilege}
        />
        <p style={{ textAlign: "center", marginBottom: 0 }}>
          Like more & Love more
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default GalleryRecycle;
