import React, { Fragment } from "react";
import axios from "axios";

const apiUrl = "https://r-upload-file.herokuapp.com/";
const FileUpload = ({
  disabled,
  file,
  filename,
  uploadedFile,
  onUploadComplete,
  onChange
}) => {
  const onFileChange = e => {
    onChange(e);
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

      let { filename, filepath } = res.data;
      filepath = apiUrl + filepath;
      onUploadComplete({ filename, filepath });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <div className="row">
        <div className="col-md-7">
          <form onSubmit={onSubmit}>
            <div className="custom-file mb-4">
              <input
                disabled={disabled}
                type="file"
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
              disabled={disabled}
              value="Upload"
              className="btn btn-primary btn-block mb-4"
            />
          </form>
        </div>
        <div className="col-md-2">
          <div className="row">
            {uploadedFile ? (
              <img
                style={{ width: "100%" }}
                src={uploadedFile.filepath}
                alt={uploadedFile.filename}
              />
            ) : null}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default FileUpload;
