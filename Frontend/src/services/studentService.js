const api_url =
  import.meta.env.VITE_API_URL || "http://https://masjid-project.onrender.com";

/**
 * Auth Header ለማዘጋጀት የሚረዳ ረዳት
 * FormData ሲላክ ብራውዘሩ ራሱ Boundary ስለሚጨምር Content-Type መላክ የለብንም
 */
const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: token ? `Bearer ${token}` : "",
  };

  // FormData ካልሆነ ብቻ Content-Typeን JSON እናደርጋለን
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

const studentService = {
  // 1. ሁሉንም ተማሪዎች ለማምጣት
  getAllStudents: async () => {
    try {
      const response = await fetch(`${api_url}/api/students`, {
        method: "GET",
        headers: getAuthHeaders(false),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "መረጃውን ማምጣት አልተቻለም");

      return {
        success: true,
        data: result.data || [],
        count: result.count || 0,
      };
    } catch (error) {
      console.error("Fetch Students Error:", error);
      return { success: false, data: [], message: error.message };
    }
  },

  // 2. አንድን ተማሪ በ ID ለመፈለግ
  getStudentById: async (id) => {
    try {
      const response = await fetch(`${api_url}/api/students/${id}`, {
        method: "GET",
        headers: getAuthHeaders(false),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "ተማሪው አልተገኘም");

      return { success: true, data: result.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // 3. አዲስ ተማሪ ለመመዝገብ (ሁልጊዜ FormData ይጠቀማል - ለፎቶዎች)
  createStudent: async (formData) => {
    try {
      const response = await fetch(`${api_url}/api/students`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "ምዝገባው አልተሳካም");

      return { success: true, data: result.data };
    } catch (error) {
      console.error("Create Student Error:", error);
      return { success: false, message: error.message };
    }
  },

  // 4. የተማሪ መረጃ ለማዘመን
  // ማሳሰቢያ፡ መረጃ ብቻ ከሆነ የሚቀየረው JSON፣ ፋይል ካለ ደግሞ FormData ይላካል
  updateStudent: async (id, updateData) => {
    try {
      const isFormData = updateData instanceof FormData;

      const response = await fetch(`${api_url}/api/students/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(isFormData),
        body: isFormData ? updateData : JSON.stringify(updateData),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "ማዘመን አልተሳካም");

      return { success: true, data: result.data };
    } catch (error) {
      console.error("Update Student Error:", error);
      return { success: false, message: error.message };
    }
  },

  // 5. ተማሪ ለመሰረዝ
  deleteStudent: async (id) => {
    try {
      const response = await fetch(`${api_url}/api/students/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(false),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "መሰረዝ አልተቻለም");

      return { success: true, message: result.message };
    } catch (error) {
      console.error("Delete Student Error:", error);
      return { success: false, message: error.message };
    }
  },

  // 6. የተማሪውን ኮርሶች ለማምጣት
  getStudentCourses: async (id) => {
    try {
      const response = await fetch(`${api_url}/api/students/${id}/courses`, {
        method: "GET",
        headers: getAuthHeaders(false),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "ኮርሶቹን ማግኘት አልተቻለም");

      return { success: true, data: result.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};

export default studentService;
