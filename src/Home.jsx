import viteLogo from '/vite.svg'
import reactLogo from "./assets/react.svg";
import {useEffect, useState} from "react";
import {fmtUrl} from "./util.js";

function Home(props) {
  const [count, setCount] = useState(0)
  const getPhotosCount = () => {
    fetch("/photos.json").then(r => {
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
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </span>
          <span onClick={() => props.setShow('monitor')}>
            <img src={reactLogo} className="logo react" alt="React logo" />
          </span>
        </div>
        <h1>Gallery with <span style={{fontSize: '2rem'}}>(Vite + React)</span></h1>
        <div className="card">
          <button onClick={() => props.setShow('gallery')}>
            Gallery photos {count}
          </button>
          <p>
            Life is simple and enjoy everyday.
          </p>
        </div>
        <p className="read-the-docs">
          Get source code on <a>github</a>
        </p>
      </>
  )
}

export default Home;