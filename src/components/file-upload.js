import React, { Fragment, useState } from "react";
import axios from "axios";
import config from "./../config.json";

const apiUrl = config.api;
const FileUpload = ({ onUploadComplete }) => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Change Image");

  const onFileChange = e => {
    try {
      const file = e.target.files[0];
      const filename = file.name;
      setFile(file);
      setFilename(filename);
    } catch (error) {}
  };
  const onSubmit = async e => {
    e.preventDefault();

    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(apiUrl + "/upload", formData, {
        "Content-Type": "multipart/form-data"
      });

      let { filepath } = res.data;
      filepath = apiUrl + filepath;
      onUploadComplete(filepath);
      setFilename("Change Image");
      setFile("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <div className="row">
        <div className="col-md-12">
          <form onSubmit={onSubmit}>
            <div className="custom-file mb-4">
              <input
                type="file"
                accept="image/*"
                className="custom-file-input"
                id="customFile"
                onChange={onFileChange}
              />
              <label className="custom-file-label" htmlFor="customFile">
                {filename}
              </label>
            </div>
            <input
              type="submit"
              disabled={!file}
              value="Upload"
              className="btn btn-primary btn-block mb-4"
            />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default FileUpload;
