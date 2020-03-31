import React from "react";

const Input = ({ name, value, onChange }) => {
  return (
    <input
      onChange={onChange}
      type="text"
      id={name}
      name={name}
      className="form-control"
      value={value}
    />
  );
};

export default Input;
