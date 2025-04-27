import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://collaborative-ai-powered-coding-platform.onrender.com/" ,
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
  },
});

export default axiosInstance;
