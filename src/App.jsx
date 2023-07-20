import { useState } from 'react'
import './App.css'
import './font.css'
import Home from "./Home.jsx";
import Gallery from "./Gallery.jsx";

function App() {
  const [show, setShow] = useState(false);

  return (
    <>
      {!show && <Home setShow={setShow}/>}
      {show && <Gallery />}
    </>
  )
}

export default App
