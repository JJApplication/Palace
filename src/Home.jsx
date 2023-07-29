import entrance from "./assets/entrance.jpg";
import {useEffect, useState} from "react";

function Home(props) {
  const [count, setCount] = useState(0)
  const [openAbout, setOpenAbout] = useState(false);

  const getPhotosCount = () => {
    fetch("/photos.json", {cache: 'no-cache'}).then(r => {
      r.json().then(res => {
        setCount(res.length || 0);
      })
    })
  }

  useEffect(() => {
    getPhotosCount();
  }, [])

  return(
      <>
        <div>
          <span onClick={() => props.setShow('monitor')}>
            <img src={entrance} className="logo" alt="logo" />
          </span>
        </div>
        <h1>Gallery with 💕</h1>
        <div className="card">
          <button onClick={() => props.setShow('gallery')}>
            Gallery photos {count}
          </button>
          <p>
            Life is simple and enjoy everyday.
          </p>
        </div>
        <p className="read-the-docs">
          Get source code on <a href="https://github.com/JJApplication/Palace">github</a>
        </p>
        <div className="about" onClick={() => setOpenAbout(!openAbout)}>
          ?
        </div>
        {openAbout &&
            <div className="about-content">
              Hello, 这是一个在线相册项目, 用来记录生活<br/>
              项目基于React-Album开发, 持续改进中...<br/>
              你可以fork<a href="https://github.com/JJApplication/Palace">本项目</a>并二次开发, Enjoy today ~ <br/>
            </div>}
      </>
  )
}

export default Home;