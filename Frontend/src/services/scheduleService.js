import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/schedules`
  : "http://https://masjid-project.onrender.com/api/schedules";

// ከ LocalStorage ቶከን ለማምጣት የሚረዳ ረዳት
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

const scheduleService = {
  // 1. ሁሉንም ፕሮግራም ማምጣት (ለሁሉም ሰው ክፍት ነው)
  getAllSchedules: async () => {
    try {
      const response = await axios.get(API_URL);
      // ባክኤንድህ ዳታውን በ { data: [...] } ውስጥ የሚልክ ከሆነ response.data.data በል
      return response.data.data || response.data;
    } catch (error) {
      console.error("Error fetching schedules:", error);
      throw error.response?.data?.message || "ፕሮግራሞችን ማምጣት አልተቻለም";
    }
  },

  // 2. አዲስ ፕሮግራም መመዝገብ (Admin Only)
  createSchedule: async (scheduleData) => {
    try {
      const response = await axios.post(API_URL, scheduleData, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error("Error creating schedule:", error);
      throw error.response?.data?.message || "ፕሮግራም መመዝገብ አልተቻለም";
    }
  },

  // 3. ፕሮግራም መሰረዝ (Admin Only)
  deleteSchedule: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
      return response.data;
    } catch (error) {
      console.error("Error deleting schedule:", error);
      throw error.response?.data?.message || "ፕሮግራም መሰረዝ አልተቻለም";
    }
  },
};

export default scheduleService;
