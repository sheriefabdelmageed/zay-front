import React, { Fragment } from "react";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./components/nav-bar";
import SideMenu from "./components/side-menu";
import Home from "./components/home";
import { Route, Redirect, Switch } from "react-router-dom";
import Slides from "./components/slides";
import Banner from "./components/banner";
import NotFound from "./components/not-found";
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
            <Switch>
              <Route path="/#/Promotion" component={Slides}></Route>
              <Route path="/#/Home">
                <Home />
              </Route>
              <Route path="/#/HomePageTag">
                <Banner />
              </Route>
              <Route path="/#/not-found">
                <NotFound />
              </Route>
              <Route path="/" component={Home} exact></Route>
              <Redirect to="/#/not-found"></Redirect>
            </Switch>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
