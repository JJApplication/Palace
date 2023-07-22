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
    fetch("/photos.json", {cache: 'no-cache'}).then(r => {
      r.json().then(res => {
        lazyLoadPhotos(res);
      })
    })
  }

  const lazyLoadPhotos = (list) => {
    let sliceAll = list.length;
    let slice = 0;
    let lazy = setInterval(() => {
      if (slice >= sliceAll) {
        clearInterval(lazy);
        return;
      }

      // 每次加载5张
      for (let i=0; i<5; i++) {
        slice++
        if (slice >= sliceAll) {
          setPhotos(list.slice(0, slice));
          clearInterval(lazy);
          return;
        }
      }

      setPhotos(list.slice(0, slice));
    }, 200);
  }

  return(
      <>
        { !init && <h1>Gallery initializing {initCode}</h1>  }
        { init &&
            <div style={{height: '100%', width: '100%'}}>
              <PhotoAlbum
                  breakpoints={[300, 600, 800, 1200]}
                  padding={20}
                  spacing={15}
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