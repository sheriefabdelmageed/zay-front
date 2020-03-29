import React, { Fragment, useState } from "react";
import _ from "lodash";
import "./App.css";
import FileUpload from "./components/file-upload";

const list = [
  { id: 1, name: "Clothes", images: [] },
  { id: 2, name: "Shoes", images: [] }
];

function App() {
  const [selectedCategory, setSelectedCategory] = useState({});
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose file");
  const [uploadedFile, setUploadedFile] = useState({});
  const [categories, setCategories] = useState(list);

  const reset = () => {
    setFile("");
    setFilename("Choose File");
    setUploadedFile({});
  };

  const onSelect = c => {
    setSelectedCategory(c);
    reset();
  };

  const handleUpload = file => {
    setUploadedFile(file);
    const img = { imageUrl: file.filepath };
    setUploadedFileToTheCategory(selectedCategory, img);
  };

  const setUploadedFileToTheCategory = (selectedCategory, img) => {
    const catIndex = _.findIndex(categories, selectedCategory);
    let cats = [...categories];
    cats[catIndex].images.push(img);
    setCategories(cats);
  };

  const onFileSelect = e => {
    try {
      const file = e.target.files[0];
      const filename = file.name;
      setFile(file);
      setFilename(filename);
    } catch (error) {}
  };

  const exportJSON = () => {
    debugger;
    let dataStr = JSON.stringify(categories);
    let dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    let exportFileDefaultName = "config.json";
    let linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Fragment>
      <header
        className="navbar navbar-dark"
        style={{ backgroundColor: "#333" }}
      >
        <a href="/" className="navbar-brand">
          ZAY
        </a>
      </header>

      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-3">
            <div className="column">
              <h4>Categories</h4>

              <div className="list-group">
                {categories.map(c => (
                  <div
                    key={c.id}
                    className={
                      c.id === selectedCategory.id
                        ? "list-group-item list-group-item-action active"
                        : "list-group-item list-group-item-action"
                    }
                    onClick={() => onSelect(c)}
                  >
                    {c.name}
                  </div>
                ))}
              </div>

              <hr />
              <button
                className="btn btn-success btn-block"
                onClick={exportJSON}
              >
                Export JSON File
              </button>
            </div>
          </div>
          <div className="col-md-9">
            <h4 className="mb4">
              <i className="fa fa-upload"></i>Upload file
            </h4>
            <FileUpload
              file={file}
              onChange={onFileSelect}
              filename={filename}
              uploadedFile={uploadedFile}
              onUploadComplete={handleUpload}
              disabled={!selectedCategory.id ? true : false}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
