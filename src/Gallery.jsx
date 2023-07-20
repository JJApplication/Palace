import {useEffect, useState} from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

function Gallery() {
  const [index, setIndex] = useState(-1);
  const [photos, setPhotos] = useState([]);
  const [init, setInit] = useState(false);
  const [initCode, setInitCode] = useState('#')
  let tick = null;

  useEffect(() => {
    getPhotos();
    initCallback(initCode);
    setTimeout(() => {
      setInit(true);
    }, 3500);

    return () => clearInterval(tick);
  }, []);

  const initCallback = () => {
    tick = setInterval(() => {
      setInitCode(initCode => initCode === '#' ? '$' : '#');
    }, 250);
  }

  const getPhotos = () => {
    fetch("/photos.json").then(r => {
      r.json().then(res => {
        console.log(res)
        setPhotos(res);
      })
    })
  }

  return(
      <>
        { !init && <h1>Gallery initializing {initCode}</h1>  }
        { init &&
            <div style={{height: '100%', width: '100%'}}>
              <PhotoAlbum
                  breakpoints={[300, 600, 800, 1200]}
                  padding={4}
                  spacing={4}
                  columns={(containerWidth) => {
                    if (containerWidth < 400) return 2;
                    if (containerWidth < 800) return 3;
                    return 4;
                  }}
                  photos={photos}
                  layout="rows"
                  onClick={({ index }) => {
                    setIndex(index);
                  }}
              />

              <Lightbox
                  slides={photos}
                  open={index >= 0}
                  index={index}
                  close={() => setIndex(-1)}
                  // enable optional lightbox plugins
                  plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
              />
              <p>
                Like more, Love more.
              </p>
              <p style={{fontSize: '1.2rem'}}>
                Copyright <a href="https://renj.io">renj.io</a>
              </p>
            </div>
        }
      </>
  )
}

export default Gallery;