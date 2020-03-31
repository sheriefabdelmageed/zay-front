import React from "react";
import { useDropzone } from "react-dropzone";

function Upload({ onUploadComplete }) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <section className="container-files d-flex justify-content-center content-align-center">
      <div className="column">
        <div accept="image/*" {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p className="upload-file">Add file</p>
          <p>or drag file here</p>
          <br />
        </div>
      </div>
    </section>
  );
}

export default Upload;
//<Upload />;
