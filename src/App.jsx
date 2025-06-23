import "./App.css";
import "./font.css";
import router from "./router/router.jsx";
import { ToastContainer } from "react-toastify";
import { ConfigProvider, theme } from "antd";
import { RouterProvider } from "react-router";

function App() {
  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <RouterProvider router={router}></RouterProvider>
      </ConfigProvider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={false}
        draggable={true}
        pauseOnFocusLoss={false}
        theme="light"
        zIndex={99999}
        toastStyle={{ zIndex: 99999 }}
        bodyStyle={{ zIndex: 99999 }}
        style={{ zIndex: 99999 }}
      />
    </>
  );
}

export default App;
