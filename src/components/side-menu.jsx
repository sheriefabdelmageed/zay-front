import React, { Component, Fragment } from "react";
import { downloadConfgFile } from "./../services/slides-service";
class SideMenu extends Component {
  state = {
    categories: ["Home", "Promotion", "Branding", "Operations"],
    loading: false
  };

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

  render() {
    const { categories } = this.state;
    const itemStyle = "list-group-item list-group-item-action";
    return (
      <Fragment>
        <h5 className="mt-3">
          <i className="fa fa-list mr-2"></i>
          Categories
        </h5>
        <div className="list-group-flush mb-4">
          {categories.map(c => (
            <div
              key={c}
              className={
                c === "Promotion" ? `${itemStyle} active` : `${itemStyle}`
              }
            >
              <i className="fa fa-list mr-2"></i>
              {c}
            </div>
          ))}
        </div>

        <button
          disabled={this.state.loading}
          className="btn btn-success btn-block"
          onClick={this.getJSON}
        >
          {this.state.loading && <i className="fas fa-spinner"></i>} Download
          JSON File
        </button>
      </Fragment>
    );
  }
}

export default SideMenu;
