import http from "./http-module";
import config from "./../config.json";

const apiUrl = `${config.api}/config`;

export const getBanner = () => {
  return http.get(apiUrl + "/categories/HomePageTag");
};

export const saveBanner = obj => {
  return http.post(apiUrl + "/update", obj);
};
