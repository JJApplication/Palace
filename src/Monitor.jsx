import {useRef, useState} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {clearPalaceCode, fmtUrl, getPalaceCode, savePalaceCode} from "./util.js";

function Monitor(props) {
  const [code, setCode] = useState(getPalaceCode());
  const [start, setStart] = useState(0); // 0 init 1 start 2 done 3 failed
  const [check, setCheck] = useState(false);

  const ref = useRef();

  const appendCode = (c) => {
    if (c) {
      setCode(code => {
        const newCode = code+c;
        savePalaceCode(newCode);
        return newCode
      })
    }
  }

  const clearCode = () => {
    setCode('')
    clearPalaceCode();
  }

  const openUpload = () => {
    if (start === 1) {
      return;
    }
    setStart(0);
    ref.current.click();
  }

  const startUpload = (e) => {
    if (e.target.files && e.target.files.length <= 0) {
      return;
    }
    setStart(1);
    const files = e.target.files;
    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }
    fetch(fmtUrl('/api/upload', code), {
      method: 'post',
      mode: 'cors',
      cache: 'no-cache',
      body: formData,
    }).then(response => response.text())
        .then((data) => {
          if (data !== "") {
            setStart(3);
            toast('upload failed' + data,{
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            return;
          }
          setStart(2);
          toast('upload success',{
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }).catch((e) => {
          if (e) {
            setStart(3);
          }
    });
  }

  const checkAuth = () => {
    fetch(fmtUrl('/api/check', code), {
      method: 'post',
      mode: 'cors',
      cache: 'no-cache',
    }).then(res => {
      if (res.status === 200) {
        setCheck(true);
      } else {
        setCheck(false);
      }
    })
  }

  const generateUpload = () => {
    fetch(fmtUrl('/api/generate', code), {
      method: 'post',
      mode: 'cors',
      cache: 'no-cache',
    }).then(res => {
      if (res.status === 200) {
        toast('generate success', {
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
        toast('generate failed',{
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
    })
  }

  const renamePhotos = () => {
    fetch(fmtUrl('/api/rename', code), {
      method: 'post',
      mode: 'cors',
      cache: 'no-cache',
    }).then(res => {
      if (res.status === 200) {
        toast('rename success',{
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
        toast('rename failed',{
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
    })
  }

  const resizePhotos = () => {
    fetch(fmtUrl('/api/resize', code), {
      method: 'post',
      mode: 'cors',
      cache: 'no-cache',
    }).then(res => {
      if (res.status === 200) {
        toast('resize success',{
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
        toast('resize failed',{
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
    })
  }

  const convertPhotos = () => {
    fetch(fmtUrl('/api/convert', code), {
      method: 'post',
      mode: 'cors',
      cache: 'no-cache',
    }).then(res => {
      if (res.status === 200) {
        toast('convert success',{
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
        toast('convert failed',{
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
    })
  }

  const changeUploadText = (status) => {
    switch (status) {
      case 0: {
        return 'upload images'
        break;
      }
      case 1: {
        return 'uploading...'
        break;
      }
      case 2: {
        return 'done'
        break;
      }
      case 3: {
        return 'upload failed'
        break;
      }
      default: {
        return 'upload images'
      }
    }
  }

  return(
      <>
        <div id="monitor-header">
          <strong
              onClick={() => props.setShow('gallery')}
              style={{cursor: 'pointer', fontSize: '2.5rem'}}
          >Go to gallery</strong>
          <div id="monitor-group">
            <button onClick={openUpload}>
              {changeUploadText(start)}
            </button>
            <button onClick={renamePhotos}>rename images</button>
            <button onClick={resizePhotos}>compress images</button>
            <button onClick={convertPhotos}>convert images</button>
            <button onClick={generateUpload}>generate images</button>
          </div>
        </div>
        <input ref={ref}  type="file" onChange={e => startUpload(e)} multiple style={{display: 'none'}}/>
        <div id="monitor-code">
          <div
              className="auth-check"
              onClick={checkAuth}
          >auth check:
            {check && <span style={{fontSize: '1.25rem'}}>🥳</span>}
            {!check && <span style={{fontSize: '1.25rem'}}>🥹</span>}
          </div>
          <p>upload code: {code || '???'}</p>
          <button onClick={() => appendCode('0')}>0</button>
          <button onClick={() => appendCode('1')}>1</button>
          <button onClick={() => appendCode('2')}>2</button>
          <button onClick={() => appendCode('3')}>3</button>
          <button onClick={() => appendCode('4')}>4</button>
          <button onClick={() => appendCode('5')}>5</button>
          <button onClick={() => appendCode('6')}>6</button>
          <button onClick={() => appendCode('7')}>7</button>
          <button onClick={() => appendCode('8')}>8</button>
          <button onClick={() => appendCode('9')}>9</button>
          <button onClick={() => clearCode()}>*</button>
        </div>
      </>
  )
}

export default Monitor;