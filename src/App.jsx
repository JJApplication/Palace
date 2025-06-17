import './App.css'
import './font.css'
import router from './router/router.jsx'
import {ToastContainer} from "react-toastify";
import {ConfigProvider, theme} from "antd";
import {RouterProvider} from "react-router";

function App() {
  return (
    <>
      <ConfigProvider theme={{
        algorithm: theme.darkAlgorithm
      }}>
        <RouterProvider router={router}></RouterProvider>
      </ConfigProvider>
      <ToastContainer />
    </>
  )
}

export default App
