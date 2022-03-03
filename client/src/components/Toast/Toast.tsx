import React, { ReactElement } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export function Toast(): ReactElement {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={60000000}
        newestOnTop
        closeOnClick
        theme="colored"
        rtl={false}
        draggable
        pauseOnHover
      />
    </>
  );
}