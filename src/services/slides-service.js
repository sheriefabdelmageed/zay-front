import http from "./http-module";
import config from "./../config.json";

const apiUrl = `${config.api}/config`;

export const getSlides = () => {
  return http.get(apiUrl + "/categories/Promotion");
};

export const saveSlide = obj => {
  return http.post(apiUrl + "/update", obj);
};

export const downloadConfgFile = () => {
  return http.get(apiUrl);
};
