const api_url = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ከ LocalStorage ቶከን ለማምጣት የሚረዳ ረዳት (ለ Admin ስራዎች)
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// 1. ሁሉንም ኮርሶች ለማምጣት
const getAllCourses = async () => {
  try {
    const response = await fetch(`${api_url}/api/courses`);
    const result = await response.json();

    return {
      success: true,
      data: Array.isArray(result) ? result : result.data || [],
      count: result.count || (Array.isArray(result) ? result.length : 0),
    };
  } catch (error) {
    console.error("Course fetch error:", error);
    return { success: false, data: [], count: 0 };
  }
};

// 2. አንድን ኮርስ በ ID ለማምጣት
const getCourseById = async (id) => {
  try {
    const response = await fetch(`${api_url}/api/courses/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 3. አዲስ ኮርስ ለመመዝገብ (Admin ፍቃድ ያስፈልገዋል)
const createCourse = async (courseData) => {
  try {
    const response = await fetch(`${api_url}/api/courses`, {
      method: "POST",
      headers: getAuthHeaders(), // ⚠️ ቶከን ተጨምሯል
      body: JSON.stringify(courseData),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 4. የኮርስ መረጃ ለማዘመን (Update)
const updateCourse = async (id, courseData) => {
  try {
    const response = await fetch(`${api_url}/api/courses/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(), // ⚠️ ቶከን ተጨምሯል
      body: JSON.stringify(courseData),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 5. ኮርስ ለመሰረዝ (Delete)
const deleteCourse = async (id) => {
  try {
    const response = await fetch(`${api_url}/api/courses/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(), // ⚠️ ቶከን ተጨምሯል
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const courseService = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};

export default courseService;
