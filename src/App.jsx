import { useState } from 'react'
import Home from "./Home.jsx";
import Gallery from "./Gallery.jsx";
import Monitor from "./Monitor.jsx";
import './App.css'
import './font.css'

function App() {
  const [show, setShow] = useState('home');

  return (
    <>
      {show === 'home' && <Home setShow={setShow} />}
      {show === 'gallery' && <Gallery />}
      {show === 'monitor' && <Monitor setShow={setShow} />}
    </>
  )
}

export default App
