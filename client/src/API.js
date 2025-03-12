import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3600/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.authorization = token;
  return req;
});

export default API;
