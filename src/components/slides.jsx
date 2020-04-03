import React, { Component, Fragment } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { getSlides, saveSlide } from "./../services/slides-service";
import FileUpload from "./file-upload";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import getCollections from "./../services/collection";

class Slides extends Component {
  state = {
    slides: [],
    selectedSlide: {},
    selectedIndex: null,
    editMode: false,
    loading: true,
    file: "",
    filename: "Change Image",
    uploadedFile: {},
    collections: []
  };

  addNewSlide = () => {
    const selectedSlide = {
      ImageURL: "",
      Collection: "",
      Text: [
        {
          Locale: "en",
          Headline: "",
          Tagline: "",
          TextColor: "000000"
        },
        {
          Locale: "ar",
          Headline: "",
          Tagline: "",
          Color: "FFFFFF"
        }
      ]
    };

    this.setState({ selectedSlide, editMode: true });
  };

  handleUpload = filepath => {
    const selectedSlide = { ...this.state.selectedSlide };
    selectedSlide.ImageURL = filepath;
    this.setState({ selectedSlide });
  };

  cancelChanges() {
    this.componentDidMount();
  }

  async componentDidMount() {
    try {
      const { data } = await getSlides();
      const { data: dataCollection } = await getCollections();
      const collections = dataCollection.data.data.collections.edges;
      const slides = data.Images;
      this.setState({ slides, loading: false, editMode: false, collections });
    } catch (error) {
      toast.error("Failed to load data");
    }
  }

  editSlide = s => {
    const index = this.getSelectedSlideIndex(s);
    const selectedSlide = { ...s };
    this.setState({
      editMode: true,
      selectedSlide,
      selectedIndex: index
    });
  };

  deletSlide = s => {
    try {
      confirmAlert({
        title: "Confirm to delete",
        message: "Are you sure to do this.",
        buttons: [
          {
            label: "Yes",
            onClick: async () => {
              const index = this.getSelectedSlideIndex(s);
              const slides = [...this.state.slides];
              slides.splice(index, 1);

              const obj = {
                key: "Promotion",
                value: { Images: slides }
              };

              await saveSlide(obj);
              toast.success("Changes saved successfully");
              this.setState({ slides });
            }
          },
          {
            label: "No",
            onClick: () => {}
          }
        ]
      });
    } catch (error) {
      toast.error("Error delete slide");
    }
  };

  saveChanges = async () => {
    try {
      this.setState({ loading: true });
      const slides = [...this.state.slides];
      const { selectedIndex } = this.state;

      if (selectedIndex === null) {
        slides.push(this.state.selectedSlide);
      } else {
        slides[selectedIndex] = this.state.selectedSlide;
      }

      const obj = {
        key: "Promotion",
        value: { Images: slides }
      };

      await saveSlide(obj);
      toast.success("Changes saved successfully");

      this.setState({
        slides,
        editMode: false,
        loading: false,
        selectedIndex: null
      });
    } catch (error) {
      this.setState({ loading: false });
      toast.error("Can not save data ");
      this.cancelChanges();
    }
  };

  handleArHeadLineChange = e => {
    const value = e.currentTarget.value;
    const selectedSlide = { ...this.state.selectedSlide };
    selectedSlide.Text[1].Headline = value;
    this.setState({ selectedSlide });
  };

  handleEnHeadLineChange = e => {
    const value = e.currentTarget.value;
    const selectedSlide = { ...this.state.selectedSlide };
    selectedSlide.Text[0].Headline = value;
    this.setState({ selectedSlide });
  };

  handleArTagLineChange = e => {
    const value = e.currentTarget.value;
    const selectedSlide = { ...this.state.selectedSlide };
    selectedSlide.Text[1].Tagline = value;
    this.setState({ selectedSlide });
  };

  handleEnTagLineChange = e => {
    const value = e.currentTarget.value;
    const selectedSlide = { ...this.state.selectedSlide };
    selectedSlide.Text[0].Tagline = value;
    this.setState({ selectedSlide });
  };

  handleArColorChange = e => {
    const value = e.currentTarget.value;
    const selectedSlide = { ...this.state.selectedSlide };
    selectedSlide.Text[1].Color = value;
    this.setState({ selectedSlide });
  };

  handleEnColorChange = e => {
    const value = e.currentTarget.value;
    const selectedSlide = { ...this.state.selectedSlide };
    selectedSlide.Text[0].TextColor = value;
    this.setState({ selectedSlide });
  };

  handleCollectionInputChange = e => {
    const value = e.currentTarget.value;
    const selectedSlide = { ...this.state.selectedSlide };
    selectedSlide.Collection = value;
    this.setState({ selectedSlide });
  };

  getSelectedSlideIndex = selectedSlide => {
    const index = _.findIndex(this.state.slides, selectedSlide);
    return index;
  };

  render() {
    const { slides, editMode, selectedSlide, loading } = this.state;
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
                  Promotion Section
                </h5>
                <div className="row mb-2 d-flex justify-content-end pr-4">
                  <button
                    className="btn btn-primary"
                    onClick={this.addNewSlide}
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Add new slide
                  </button>
                </div>
                <table className="table borders">
                  <thead>
                    <tr>
                      <th className="col-lg-1 col-md-2 col-sm-4"></th>
                      <th className="col-lg-1 col-md-2 col-sm-4">Collection</th>
                      <th className="col-lg-1 col-md-2">Headline-AR</th>
                      <th className="col-lg-1 col-md-2 col-sm-4">
                        Headline-EN
                      </th>
                      <th className="col-lg-3 col-md-2">Tagline-AR</th>
                      <th className="col-lg-3 col-md-2">Tagline-EN</th>
                      <th className="col-lg-1">Edit</th>
                      <th className="col-lg-1">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slides.map(s => (
                      <tr key={s.ImageURL}>
                        <td className="col-lg-1 col-md-2 col-sm-4">
                          <img
                            onClick={() => this.editSlide(s)}
                            style={{ width: "80px", cursor: "pointer" }}
                            src={s.ImageURL || "/assets/no-image.png"}
                            alt={s.collection}
                          />
                        </td>
                        <td className="col-lg-1 col-md-2 col-sm-4">
                          {s.Collection}
                        </td>
                        <td className="col-lg-1 col-md-2">
                          {s.Text[1].Headline}
                        </td>
                        <td className="col-lg-1 col-md-2 col-sm-4">
                          {s.Text[0].Headline}
                        </td>
                        <td className="col-lg-3 col-md-2">
                          {s.Text[1].Tagline}
                        </td>
                        <td className="col-lg-3 col-md-2">
                          {s.Text[0].Tagline}
                        </td>
                        <td className="col-lg-1">
                          <button onClick={() => this.editSlide(s)}>
                            <i className="fa fa-edit"></i>
                          </button>
                        </td>
                        <td className="col-lg-1">
                          <button onClick={() => this.deletSlide(s)}>
                            <i className="fas fa-trash-alt"></i>
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
                    src={selectedSlide.ImageURL || "/assets/no-image.png"}
                    alt={selectedSlide.collection}
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
                    Slide Details
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
                          value={selectedSlide.Collection}
                          onChange={this.handleCollectionInputChange}
                        >
                          <option value="">Select a collection</option>
                          {this.state.collections.map(c => (
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
                          value={selectedSlide.Text[1].Headline}
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
                          value={selectedSlide.Text[0].Headline}
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
                          value={selectedSlide.Text[1].Tagline}
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
                          value={selectedSlide.Text[0].Tagline}
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
                          value={`${selectedSlide.Text[1].Color}`}
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
                          value={`${selectedSlide.Text[0].TextColor}`}
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

export default Slides;
