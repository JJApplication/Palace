import {useEffect, useState} from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {fmtUrl, getPalaceCode} from "./util.js";
import logo from './assets/logo.gif';

function Gallery(props) {
  const [index, setIndex] = useState(-1);
  const [viewIndex, setViewIndex] = useState(-1);
  const [photos, setPhotos] = useState([]);
  const [LightboxPhotos, setLightboxPhotos] = useState([]);
  const [init, setInit] = useState(false);
  const [initCode, setInitCode] = useState('#');

  let tick = null;

  useEffect(() => {
    getPhotos();
    initCallback(initCode);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    getLightboxList();
  }, [photos])

  const backHome = () => {
    props.setShow('home');
  }

  const isInit = () => {
    const rows = document.getElementsByClassName("react-photo-album react-photo-album--rows");
    if (rows) {
      const rowsChildren = rows[0].children;
      if (rowsChildren && rowsChildren.length > 0) {
        return true;
      }
    }

    return false;
  }

  const initCallback = () => {
    tick = setInterval(() => {
      setInitCode(initCode => initCode === '#' ? '$' : '#');
      if (isInit()) {
        clearInterval(tick);
        setInit(true);
      }
    }, 200);
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
          const photosList = list.slice(0, slice).map(p => {
            return {
              image: p.image,
              src: p.thumbnail,
              width: p.width || 0,
              height: p.height || 0,
            }
          })
          setPhotos(photosList);
          clearInterval(lazy);
          return;
        }
      }

    }, 200);
  }

  const getLightboxList = () => {
    setLightboxPhotos(photos.map(p => {
      return {src: p.image}
    }));
  }

  const deletePhoto = (index) => {
    console.log('delete photo:', index);
    fetch(fmtUrl('/api/delete', getPalaceCode()), {
      method: 'post',
      mode: 'cors',
      cache: 'no-cache',
      body: JSON.stringify({deleteId: index, deleteName: photos[index].image})
    }).then(res => {
      if (res.status === 200) {
        toast('delete success',{
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast('delete failed',{
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }).catch(() => {
      toast('delete failed',{
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    })
  }

  return(
      <>
        { !init &&
            <div style={{zIndex: 99999, position: 'fixed', top: 0,left: 0, backgroundColor: '#242424', height: '100%', width: '100%'}}>
              <h1 style={{marginTop: '50vh'}}>Gallery initializing {initCode}</h1>
            </div>
        }
            <div style={{height: '100%', width: '100%', maxWidth:  '1440px', margin: '0 auto'}}>
              <div
                  style={{ textAlign: 'left', marginBottom: '1.5rem', paddingBottom: '0.55rem', height: '50px', userSelect: 'none', borderBottom: '2px dashed #FFFFFF20' }}
              >
                <span
                    style={{ fontSize: '2.75rem', cursor: 'pointer' }}
                    onClick={backHome}
                >
                  Back
                </span>
                <img className="back-logo" src={logo} onClick={backHome} />
                <span
                    style={{ fontSize: '2.75rem', cursor: 'pointer' }}
                    onClick={backHome}
                >
                  Home
                </span>
              </div>
              <PhotoAlbum
                  breakpoints={[300, 600, 800, 1200]}
                  padding={20}
                  spacing={20}
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
                  slides={LightboxPhotos}
                  open={index >= 0}
                  index={index}
                  close={() => { setIndex(-1); setViewIndex(-1) } }
                  // enable optional lightbox plugins
                  plugins={[Fullscreen, Thumbnails, Zoom]}
                  on={{ view: (e) => setViewIndex(e.index)}}
                  toolbar={{
                    buttons: [
                      <button key="delete-button" type="button" className="yarl__button" onClick={() => deletePhoto(viewIndex)}>
                        DELETE
                      </button>,
                      "close",
                    ],
                  }}
              />
              <p>
                Like more & Love more
              </p>
              <p style={{fontSize: '1.2rem'}}>
                Copyright <a href="https://renj.io">renj.io</a>
              </p>
            </div>
      </>
  )
}

export default Gallery;