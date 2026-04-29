import axios from "axios";

const instance = axios.create({
  // የባክኤንድህ ትክክለኛ ሊንክ
  baseURL: "https://masjid-project.onrender.com/api",
  // Render ለመነሳት ጊዜ ስለሚወስድ 1 ደቂቃ እንዲታገስ (60 ሰከንድ)
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
