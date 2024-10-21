import axios from "axios";

export const httpCommon = axios.create({
  // baseURL: "http://localhost:3000/api",
  baseURL: "http://172.25.18.33:3000/api",
});
