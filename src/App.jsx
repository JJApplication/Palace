import { useState } from 'react'
import Home from "./Home.jsx";
import Gallery from "./Gallery.jsx";
import Monitor from "./Monitor.jsx";
import './App.css'
import './font.css'
import {ToastContainer} from "react-toastify";

function App() {
  const [show, setShow] = useState('home');

  return (
    <>
      {show === 'home' && <Home setShow={setShow} />}
      {show === 'gallery' && <Gallery setShow={setShow} />}
      {show === 'monitor' && <Monitor setShow={setShow} />}
      <ToastContainer />
    </>
  )
}

export default App
