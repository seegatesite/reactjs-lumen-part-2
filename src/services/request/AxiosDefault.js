import axios from "axios";
import { path_server, request_delay } from "../Constants";
const api_token = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : "";

export const api = axios.create({
  baseURL: path_server,
  timeout: request_delay,
  headers: {
    token: api_token,
  },
});

export const noAuthAPI = axios.create({
  baseURL: path_server,
  timeout: request_delay,
});
