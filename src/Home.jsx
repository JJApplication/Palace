import entrance from "./assets/entrance.jpg";
import {useEffect, useState} from "react";

function Home(props) {
  const [count, setCount] = useState(0)
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
            <img src={entrance} className="logo" alt="React logo" />
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
          Get source code on <a href="https://github.com/JJApplication/Palace">github</a>
        </p>
      </>
  )
}

export default Home;