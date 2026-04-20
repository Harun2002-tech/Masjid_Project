import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // የባክኤንድህ አድራሻ
});

// 🚀 ለእያንዳንዱ ጥያቄ ቶከኑን በራስ-ሰር እንዲልክ የሚያደርግ
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // 'Bearer ' የሚለው ቃል መኖሩን አረጋግጥ
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;