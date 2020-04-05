import React, { Component, Fragment } from "react";

import { toast } from "react-toastify";
import { getBanner, saveBanner } from "./../services/banner-service";
import FileUpload from "./file-upload";
import "react-confirm-alert/src/react-confirm-alert.css";
import getCollections from "./../services/collection";

class Banner extends Component {
  state = {
    data: {},
    editMode: false,
    loading: true,
    file: "",
    filename: "Change Image",
    uploadedFile: {},
    collections: []
  };

  handleUpload = filepath => {
    const data = { ...this.state.data };
    data.ImageURL = filepath;
    this.setState({ data });
  };

  cancelChanges() {
    this.componentDidMount();
  }

  async componentDidMount() {
    try {
      const { data } = await getBanner();
      const { data: dataCollection } = await getCollections();
      const collections = dataCollection?.data?.data?.collections?.edges;
      this.setState({
        data: data,
        loading: false,
        editMode: false,
        collections
      });
    } catch (error) {
      toast.error("Failed to load data");
    }
  }

  editSlide = banner => {
    const data = { ...banner };
    this.setState({
      data,
      editMode: true
    });
  };

  saveChanges = async () => {
    try {
      this.setState({ loading: true });
      const data = { ...this.state.data };
      const obj = {
        key: "HomePageTag",
        value: { ...data }
      };

      await saveBanner(obj);
      toast.success("Changes saved successfully");

      this.setState({
        data,
        editMode: false,
        loading: false
      });
    } catch (error) {
      this.setState({ loading: false });
      toast.error("Can not save data ");
      this.cancelChanges();
    }
  };

  handleArHeadLineChange = e => {
    const value = e.currentTarget.value;
    const data = { ...this.state.data };
    data.Text[1].Headline = value;
    this.setState({ data });
  };

  handleEnHeadLineChange = e => {
    const value = e.currentTarget.value;
    const data = { ...this.state.data };
    data.Text[0].Headline = value;
    this.setState({ data });
  };

  handleArTagLineChange = e => {
    const value = e.currentTarget.value;
    const data = { ...this.state.data };
    data.Text[1].Tagline = value;
    this.setState({ data });
  };

  handleEnTagLineChange = e => {
    const value = e.currentTarget.value;
    const data = { ...this.state.data };
    data.Text[0].Tagline = value;
    this.setState({ data });
  };

  handleArColorChange = e => {
    const value = e.currentTarget.value;
    const data = { ...this.state.data };
    data.Text[1].Color = value;
    this.setState({ data });
  };

  handleEnColorChange = e => {
    const value = e.currentTarget.value;
    const data = { ...this.state.data };
    data.Text[0].TextColor = value;
    this.setState({ data });
  };

  handleCollectionInputChange = e => {
    const value = e.currentTarget.value;
    const data = { ...this.state.data };
    data.CollectionName = value;
    this.setState({ data });
  };

  render() {
    const { data, editMode, loading } = this.state;
    return (
      <Fragment>
        {loading && (
          <div className="row">
            <div className="col-12 spinner-container">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        )}

        {!loading && (
          <div>
            {!editMode && (
              <div>
                <h5>
                  <i className="far fa-images mr-2"></i>
                  Banner Section
                </h5>
                <table className="table borders">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Collection</th>
                      <th>Headline-AR</th>
                      <th>Headline-EN</th>
                      <th>Tagline-AR</th>
                      <th>Tagline-EN</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[data]?.map(s => (
                      <tr key={s.ImageURL}>
                        <td>
                          <img
                            onClick={() => this.editSlide(s)}
                            style={{ width: "80px", cursor: "pointer" }}
                            src={s.ImageURL || "/assets/no-image.png"}
                            alt={s.collection}
                          />
                        </td>
                        <td>{s.CollectionName}</td>
                        <td>{s.Text[1].Headline}</td>
                        <td>{s.Text[0].Headline}</td>
                        <td>{s.Text[1].Tagline}</td>
                        <td>{s.Text[0].Tagline}</td>
                        <td>
                          <button onClick={() => this.editSlide(s)}>
                            <i className="fa fa-edit"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {editMode && (
              <div className="row">
                <div className="col-md-4 col-sm-12">
                  <img
                    style={{ width: "100%" }}
                    className="image"
                    src={data.ImageURL || "/assets/no-image.png"}
                    alt={data.collectionName}
                  />
                  <hr />
                  <FileUpload
                    file={this.state.file}
                    onChange={this.onFileSelect}
                    filename={this.state.filename}
                    uploadedFile={this.state.uploadedFile}
                    onUploadComplete={this.handleUpload}
                  />
                </div>
                <div className="col-md-7 col-sm-12">
                  <h5>
                    <i className="far fa-images mr-2"></i>
                    Banner Details
                  </h5>
                  <hr />
                  <form className="form">
                    <div className="form-row">
                      <div className="form-group col-md-5">
                        <label htmlFor="collection">Collection</label>
                        <select
                          className="form-control"
                          name="collection"
                          id="collection"
                          value={data.Collection}
                          onChange={this.handleCollectionInputChange}
                        >
                          <option value="">Select a collection</option>
                          {this.state.collections?.map(c => (
                            <option key={c.node.id} value={c.node.title}>
                              {c.node.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group col-md-5 col-sm-12">
                        <label htmlFor="ar">Arabic Headline</label>
                        <input
                          onChange={this.handleArHeadLineChange}
                          type="text"
                          placeholder="Arabic Headline"
                          id="ar"
                          name="ar"
                          className="form-control"
                          value={data.Text[1].Headline}
                        />
                      </div>
                      <div className="form-group col-md-5 offset-md-1 col-sm-12">
                        <label htmlFor="en">English Headline</label>
                        <input
                          onChange={this.handleEnHeadLineChange}
                          placeholder="English Headline"
                          type="text"
                          id="en"
                          name="en"
                          className="form-control"
                          value={data.Text[0].Headline}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-5 col-sm-12">
                        <label htmlFor="ar">Arabic Tagline</label>
                        <input
                          onChange={this.handleArTagLineChange}
                          placeholder="Arabic Tagline"
                          type="text"
                          id="ar"
                          name="ar"
                          className="form-control"
                          value={data.Text[1].Tagline}
                        />
                      </div>
                      <div className="form-group form-group col-md-5 offset-md-1 col-sm-12">
                        <label htmlFor="en">English Tagline</label>
                        <input
                          placeholder="English Tagline"
                          onChange={this.handleEnTagLineChange}
                          type="text"
                          id="en"
                          name="en"
                          className="form-control"
                          value={data.Text[0].Tagline}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-5 col-sm-12">
                        <label htmlFor="color">Color for Arabic</label>
                        <input
                          className="form-control"
                          type="color"
                          id="color"
                          name="color"
                          value={`${data.Text[1].Color}`}
                          onChange={this.handleArColorChange}
                        />
                      </div>
                      <div className="form-group form-group col-md-5 offset-md-1 col-sm-12">
                        <label htmlFor="color">Color for English</label>
                        <input
                          className="form-control"
                          type="color"
                          id="color"
                          name="color"
                          value={`${data.Text[0].TextColor}`}
                          onChange={this.handleEnColorChange}
                        />
                      </div>
                    </div>

                    <hr />
                    <div className="form-group">
                      <button
                        className="btn btn-primary mr-2"
                        onClick={this.saveChanges}
                      >
                        Save Changes
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={this.cancelChanges}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </Fragment>
    );
  }
}

export default Banner;
