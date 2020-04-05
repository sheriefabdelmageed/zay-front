import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";
import {
  downloadConfgFile,
  getCategories
} from "./../services/side-menu-service";

const staticCategories = ["Home", "HomePageTag", "Promotion"];

class SideMenu extends Component {
  state = {
    categories: [],
    loading: false
  };

  async componentDidMount() {
    try {
      const { data } = await getCategories();
      const categories = data.filter(c => staticCategories.indexOf(c) > -1);
      this.setState({ categories });
    } catch (error) {
      return;
    }
  }

  getJSON = async () => {
    this.setState({ loading: true });
    const { data } = await downloadConfgFile();
    this.setState({ loading: false });
    this.exportJSON(data);
  };

  exportJSON = list => {
    let dataStr = JSON.stringify(list);
    let dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    let exportFileDefaultName = "config.json";
    let linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  getIcon = c => {
    if (c === "Promotion") return "far fa-images mr-2";
    if (c === "Home") return "fa fa-home mr-2";
    else return "fa fa-flag mr-2";
  };

  getLinkName = c => {
    if (c === "Promotion") return "Slider";
    else if (c === "Home") return "Trending";
    else if (c === "HomePageTag") return "Banner";
  };

  render() {
    const { categories } = this.state;
    const itemStyle = "list-group-item list-group-item-action";

    return (
      <Fragment>
        <h6 className="mt-3">
          <i className="fa fa-list mr-2"></i>
          Categories
        </h6>
        <div className="list-group-flush mb-4 pb-4">
          {categories.map(c => (
            <div key={c} className={itemStyle}>
              <i className={this.getIcon(c)}></i>
              <NavLink to={`/${c}`}>{this.getLinkName(c)}</NavLink>
            </div>
          ))}
          <div className="list-group-item list-group-item-action mb-4">
            <button
              disabled={this.state.loading}
              className="btn btn-success btn-sm"
              onClick={this.getJSON}
            >
              {this.state.loading && <i className="fas fa-spinner"></i>}{" "}
              Download JSON File
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SideMenu;
