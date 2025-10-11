import { request, buildUrl } from "./request";

export const getScenes = () => {
  return request(buildUrl("/scenes"), {
    method: "GET",
  });
};