import React, { Component, Fragment } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { getSlides, saveSlide } from "./../services/home-service";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import collection from "./../services/collection";

const getCollections = collection.getCollections;
const getSubCollections = collection.getSubCollections;

const tempCollections = [
  { node: { id: 1, title: "Occasions" } },
  { node: { id: 2, title: "Shop Looks" } },
  { node: { id: 3, title: "Featured" } },
  { node: { id: 4, title: "Everyone" } },
  { node: { id: 5, title: "Art Night" } }
];
const tempSubCollections = [
  { node: { id: 1, title: "The Ramadan Edit" } },
  { node: { id: 2, title: "Dresses" } },
  { node: { id: 3, title: "Luxe Bags" } },
  { node: { id: 4, title: "Accessories" } }
];

class Home extends Component {
  state = {
    slides: [],
    selectedSlide: {},
    selectedIndex: null,
    editMode: false,
    loading: true,
    uploadedFile: {},
    collections: [],
    SubCollectionsList: [],
    SubCollections: [],
    styleList: ["Grid", "Column", "Row"]
  };

  cancelChanges() {
    this.componentDidMount();
  }

  async componentDidMount() {
    try {
      const { data } = await getSlides();

      const { data: dataCollection } = await getCollections();
      let Collections = dataCollection?.data?.data?.collections?.edges;
      if (!Collections) {
        Collections = tempCollections;
      }

      const slides = data.Content;
      this.setState({
        slides,
        loading: false,
        editMode: false,
        Collections
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to load data");
    }
  }

  editSlide = async s => {
    const index = this.getSelectedSlideIndex(s);
    const selectedSlide = { ...s };
    if (!selectedSlide.SubCollections) selectedSlide.SubCollections = [];

    let { data: dataCollection } = await getSubCollections();
    let SubCollectionsList = dataCollection?.data?.data?.collections?.edges;
    SubCollectionsList = null;
    if (!SubCollectionsList) {
      SubCollectionsList = tempSubCollections;
    }

    this.setState({
      editMode: true,
      selectedSlide,
      selectedIndex: index,
      SubCollectionsList
    });
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
        key: "Home",
        value: { Promoted: "Promoted", Content: slides }
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

  handleInputChange = e => {
    const { value, name } = e.currentTarget;
    const selectedSlide = { ...this.state.selectedSlide };
    selectedSlide[name] = value;
    this.setState({ selectedSlide });
  };

  handleColorChange = e => {
    const value = e.currentTarget.value.substring(1);
    const selectedSlide = { ...this.state.selectedSlide };
    selectedSlide.TextColor = value;
    this.setState({ selectedSlide });
  };

  handleImageStyleInputChange = e => {
    const { value, name } = e.currentTarget;
    const selectedSlide = { ...this.state.selectedSlide };
    selectedSlide.ImageStyle[name] = value;
    this.setState({ selectedSlide });
  };

  handleCollectionInputChange = async e => {
    debugger;
    const value = e.currentTarget.value;
    if (!value) return null;
    const selectedSlide = { ...this.state.selectedSlide };
    selectedSlide.Collection = value;

    let { data: dataCollection } = await getSubCollections();
    let SubCollectionsList = dataCollection?.data?.metafields;
    SubCollectionsList = null;
    if (!SubCollectionsList) {
      SubCollectionsList = tempSubCollections;
    }

    this.setState({ selectedSlide, SubCollectionsList });
  };

  getSelectedSlideIndex = selectedSlide => {
    const index = _.findIndex(this.state.slides, selectedSlide);
    return index;
  };

  addNewSlide = () => {
    const selectedSlide = {
      Collection: "",
      TextColor: "",
      SubCollections: [],
      Style: "",
      NavigationTitle: "",
      ImageStyle: {
        Shadow: "",
        CornerRadius: "",
        Width: "",
        Height: ""
      }
    };
    const SubCollectionsList = [];
    this.setState({ selectedSlide, editMode: true, SubCollectionsList });
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
                key: "Home",
                value: { Promoted: "Promoted", Content: slides }
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
      toast.error("Error delete data");
    }
  };

  addSubCollectionInputChange = ({ currentTarget }) => {
    const SubCollection = currentTarget.value;
    if (!SubCollection) return;
    let selectedSlide = { ...this.state.selectedSlide };

    const index = selectedSlide.SubCollections.indexOf(SubCollection);
    if (index === -1 || index === undefined)
      selectedSlide.SubCollections.push(SubCollection);

    this.setState({ selectedSlide });
  };

  deleteSubCollection = sc => {
    let selectedSlide = { ...this.state.selectedSlide };
    const index = selectedSlide.SubCollections.indexOf(sc);
    selectedSlide.SubCollections.splice(index, 1);

    this.setState({ selectedSlide });
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
                  Trending Section
                </h5>
                <div className="row mb-2 d-flex justify-content-end pr-4">
                  <button
                    className="btn btn-primary"
                    onClick={this.addNewSlide}
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Add new
                  </button>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Collection</th>
                      <th>Navigation Title</th>
                      <th>Style</th>
                      <th>Text Color</th>
                      <th style={{ Width: "10%" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {slides.map(s => (
                      <tr key={s.NavigationTitle}>
                        <td>{s.Collection}</td>
                        <td>{s.NavigationTitle}</td>
                        <td>{s.Style}</td>
                        <td>
                          <input
                            type="color"
                            className="color-circle"
                            disabled
                            value={`#${s.TextColor}`}
                          />
                        </td>
                        <td>
                          <button onClick={() => this.editSlide(s)}>
                            <i className="fa fa-edit"></i>
                          </button>
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
                <div className="col-12 ">
                  <h5>
                    <i className="far fa-images mr-2"></i>
                    Collection Details
                  </h5>
                  <hr />

                  <form className="form">
                    <div className="form-row">
                      <div className="form-group col-md-6 col-sm-12">
                        <label htmlFor="collection">Collection</label>
                        <select
                          className="form-control"
                          name="collection"
                          id="collection"
                          value={selectedSlide.Collection}
                          onChange={this.handleCollectionInputChange}
                        >
                          <option value="">Select a collection</option>
                          {this.state.Collections?.map(c => (
                            <option key={c?.node?.id} value={c?.node?.title}>
                              {c?.node?.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group col-md-6 col-sm-12">
                        <label htmlFor="textColor">Text Color</label>
                        <input
                          className="form-control"
                          id="textColor"
                          name="textColor"
                          type="color"
                          value={`#${selectedSlide.TextColor}`}
                          onChange={this.handleColorChange}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-4 col-sm-12">
                        <label htmlFor="SubCollections">
                          Add Sub Collection
                        </label>
                        <select
                          className="form-control"
                          name="SubCollections"
                          id="SubCollections"
                          onChange={this.addSubCollectionInputChange}
                        >
                          <option value="">Select a Sub Collection</option>
                          {this.state.SubCollectionsList?.map(c => (
                            <option key={c?.node?.id} value={c?.node?.title}>
                              {c?.node?.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group col-md-8 col-sm-12">
                        <label htmlFor="SubCollections">
                          Sub Collections List
                        </label>
                        <ul
                          className="form-control"
                          style={{
                            height: "auto",
                            minHeight: "37px",
                            padding: "0px"
                          }}
                        >
                          {this.state.selectedSlide.SubCollections.map(sc => (
                            <li
                              className="chip"
                              key={sc}
                              onClick={() => this.deleteSubCollection(sc)}
                            >
                              <i className="item">X</i>
                              <span className="item-text">{sc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6 col-sm-12">
                        <label htmlFor="NavigationTitle">
                          Navigation Title
                        </label>
                        <input
                          onChange={this.handleInputChange}
                          type="text"
                          placeholder="NavigationTitle"
                          id="NavigationTitle"
                          name="NavigationTitle"
                          className="form-control"
                          value={selectedSlide.NavigationTitle}
                        />
                      </div>
                      <div className="form-group col-md-6 col-sm-12">
                        <label htmlFor="Style">Style</label>
                        <select
                          className="form-control"
                          name="Style"
                          id="Style"
                          value={selectedSlide.Style}
                          onChange={this.handleInputChange}
                        >
                          <option value="">Select a style</option>
                          {this.state.styleList?.map(s => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <hr />
                    <h6>Image Style</h6>
                    <div className="form-row">
                      <div className="form-group col-md-3 col-sm-12">
                        <label htmlFor="Shadow">Shadow</label>
                        <input
                          onChange={this.handleImageStyleInputChange}
                          placeholder="Shadow"
                          type="number"
                          id="Shadow"
                          name="Shadow"
                          className="form-control"
                          value={selectedSlide.ImageStyle.Shadow}
                        />
                      </div>

                      <div className="form-group col-md-3 col-sm-12">
                        <label htmlFor="CornerRadius">CornerRadius</label>
                        <input
                          onChange={this.handleImageStyleInputChange}
                          placeholder="Corner Radius"
                          type="number"
                          id="CornerRadius"
                          name="CornerRadius"
                          className="form-control"
                          value={selectedSlide.ImageStyle.CornerRadius}
                        />
                      </div>

                      <div className="form-group col-md-3 col-sm-12">
                        <label htmlFor="Width">Width</label>
                        <input
                          onChange={this.handleImageStyleInputChange}
                          placeholder="Width"
                          type="number"
                          min="5"
                          id="Width"
                          name="Width"
                          className="form-control"
                          value={selectedSlide.ImageStyle.Width}
                        />
                      </div>

                      <div className="form-group col-md-3 col-sm-12">
                        <label htmlFor="Height">Height</label>
                        <input
                          onChange={this.handleImageStyleInputChange}
                          placeholder="Height"
                          min="5"
                          type="number"
                          id="Height"
                          name="Height"
                          className="form-control"
                          value={selectedSlide.ImageStyle.Height}
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

export default Home;
