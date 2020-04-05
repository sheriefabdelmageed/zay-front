import http from "./http-module";
import config from "./../config.json";

const apiUrl = `${config.api}/config`;

export const getCategories = () => {
  return http.get(apiUrl + "/categories");
};

export const downloadConfgFile = () => {
  return http.get(apiUrl);
};
