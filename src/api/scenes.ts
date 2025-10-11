import { request } from "./request";

export const getScenes = () => {
  return request("/scenes", {
    method: "GET",
  });
};