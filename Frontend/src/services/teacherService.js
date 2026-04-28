const api_url =
  import.meta.env.VITE_API_URL || "http://https://masjid-project.onrender.com";

// Auth Header ለማዘጋጀት (ቶከን ካለ ለመጨመር)
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ---------------- HANDLE RESPONSE ---------------- */
const handleResponse = async (response) => {
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return {
    success: response.ok,
    data: data?.data ?? data ?? null,
    message: data?.message || (response.ok ? null : "የሆነ ስህተት ተከስቷል"),
  };
};

/* ---------------- GET ALL ---------------- */
const getAllTeachers = async () => {
  try {
    const res = await fetch(`${api_url}/api/teachers`);
    return await handleResponse(res);
  } catch (err) {
    return { success: false, data: null, message: err.message };
  }
};

/* ---------------- GET BY ID ---------------- */
const getTeacherById = async (id) => {
  try {
    const res = await fetch(`${api_url}/api/teachers/${id}`);
    return await handleResponse(res);
  } catch (err) {
    return { success: false, data: null, message: err.message };
  }
};

/* ---------------- CREATE (Admin Only) ---------------- */
const createTeacher = async (formData) => {
  try {
    const res = await fetch(`${api_url}/api/teachers`, {
      method: "POST",
      headers: getAuthHeaders(), // ⚠️ ቶከን ተጨምሯል
      body: formData, // FormData ሲሆን Content-Type Header አያስፈልግም
    });
    return await handleResponse(res);
  } catch (err) {
    return { success: false, data: null, message: err.message };
  }
};

/* ---------------- UPDATE (Admin Only) ---------------- */
const updateTeacher = async (id, formData) => {
  try {
    const res = await fetch(`${api_url}/api/teachers/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(), // ⚠️ ቶከን ተጨምሯል
      body: formData,
    });
    return await handleResponse(res);
  } catch (err) {
    return { success: false, data: null, message: err.message };
  }
};

/* ---------------- DELETE (Admin Only) ---------------- */
const deleteTeacher = async (id) => {
  try {
    const res = await fetch(`${api_url}/api/teachers/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(), // ⚠️ ቶከን ተጨምሯል
    });
    return await handleResponse(res);
  } catch (err) {
    return { success: false, data: null, message: err.message };
  }
};

export default {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
