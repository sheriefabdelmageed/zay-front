import React, { Fragment } from "react";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Slides from "./components/slides";
import NavBar from "./components/nav-bar";
import SideMenu from "./components/side-menu";

function App() {
  return (
    <Fragment>
      <ToastContainer></ToastContainer>
      <NavBar />
      <div className="container-fluid p4">
        <div className="row">
          <div className="col-md-2 col-sm-12 side-menu">
            <SideMenu />
          </div>
          <div className="col-md-10 col-sm-12 p-3 offset-md-2">
            <Slides />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
