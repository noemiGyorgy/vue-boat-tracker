import axios, { AxiosResponse } from "axios";

export const changeStatus = (
  callback: (response: AxiosResponse<any>) => void
) => {
  axios
    .put(process.env.VUE_APP_SERVER + "/status", {
      withCredentials: true
    })
    .then((response) => {
      callback(response);
    });
};

export const getTrack = (
  trackId: string,
  callback: (response: AxiosResponse<any>) => void
) => {
  axios
    .get(process.env.VUE_APP_SERVER + "/track/" + trackId, {
      withCredentials: true
    })
    .then((response) => {
      callback(response);
    });
};
