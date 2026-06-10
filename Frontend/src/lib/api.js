import axios from "axios";

const isDev = import.meta.env.DEV;
const BASE_URL = isDev ? "http://localhost:5000/api" : "https://api.ruhamaislamiccenter.com/api";

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ለእያንዳንዱ ጥያቄ ቶከኑን በራስ-ሰር የሚያያይዝ
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
