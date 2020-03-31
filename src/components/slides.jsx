import React, { Component, Fragment } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { getSlides, saveSlide } from "./../services/slides-service";
import FileUpload from "./file-upload";

class Slides extends Component {
  state = {
    slides: [],
    selectedSlide: {},
    selectedIndex: 0,
    editMode: false,
    loading: true,
    file: "",
    filename: "Change Image",
    uploadedFile: {},
    collections: ["Sparkles", "Accessories", "Blues"]
  };

  reset = () => {
    this.setState({ file: "", filename: "Change Image", uploadedFile: {} });
  };

  onSelect = c => {
    this.reset();
  };

  handleUpload = filepath => {
    debugger;
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
      const slides = data.Images;
      this.setState({ slides, loading: false, editMode: false });
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

  saveChanges = async () => {
    debugger;
    try {
      this.setState({ loading: true });
      const slides = [...this.state.slides];
      slides[this.state.selectedIndex] = this.state.selectedSlide;

      const obj = {
        key: "Promotion",
        value: { Images: slides }
      };

      await saveSlide(obj);
      toast.success("Changes saved successfully");

      this.setState({ slides, editMode: false, loading: false });
    } catch (error) {
      this.setState({ loading: false });
      toast.error("Can not save data ");
      this.cancelChanges();
    }
  };

  handleArInputChane = e => {
    const value = e.target.value;
    const selectedSlide = { ...this.state.selectedSlide };
    selectedSlide.Text[0].Headline = value;
    this.setState({ selectedSlide });
  };

  handleEnInputChane = e => {
    const value = e.target.value;
    const selectedSlide = { ...this.state.selectedSlide };
    selectedSlide.Text[1].Headline = value;
    this.setState({ selectedSlide });
  };

  handleCollectionInputChange = e => {
    debugger;
    const value = e.target.value;
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
                <h4>
                  <i className="far fa-images mr-2"></i>
                  Promotion Section
                </h4>
                <table className="table borders">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Collection</th>
                      <th>Headline-AR</th>
                      <th>Headline-EN</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {slides.map(s => (
                      <tr key={s.ImageURL}>
                        <td>
                          <img
                            onClick={() => this.editSlide(s)}
                            style={{ width: "100px", cursor: "pointer" }}
                            src={s.ImageURL}
                            alt={s.collection}
                          />
                        </td>
                        <td>{s.Collection}</td>
                        <td>{s.Text[0].Headline}</td>
                        <td>{s.Text[1].Headline}</td>
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
                <div className="col-md-4">
                  <img
                    style={{ width: "100%" }}
                    className="image"
                    src={selectedSlide.ImageURL}
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
                <div className="col-md-8">
                  <h4>
                    <i className="far fa-images mr-2"></i>
                    Slide Details
                  </h4>
                  <hr />
                  <form className="form">
                    <div className="form-group">
                      <label htmlFor="collection">Collection</label>
                      <select
                        className="form-control"
                        name="collection"
                        id="collection"
                        value={selectedSlide.Collection}
                        onChange={this.handleCollectionInputChange}
                      >
                        {this.state.collections.map(c => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6 col-sm-12">
                        <label htmlFor="ar">Arabic Headline</label>
                        <input
                          onChange={this.handleArInputChane}
                          type="text"
                          id="ar"
                          name="ar"
                          className="form-control"
                          value={selectedSlide.Text[0].Headline}
                        />
                      </div>
                      <div className="form-group col-md-6 col-sm-12">
                        <label htmlFor="en">English Headline</label>
                        <input
                          onChange={this.handleEnInputChane}
                          type="text"
                          id="en"
                          name="en"
                          className="form-control"
                          value={selectedSlide.Text[1].Headline}
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
