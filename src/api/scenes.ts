import { SEVER_URL } from "./config";

export const getScenes = () => {
  return new Promise((resolve) => {
    fetch(`${SEVER_URL}/scenes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      });
  });
};