const api_url =
  import.meta.env.VITE_API_URL || "https://api.ruhamaislamiccenter.com";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Lightweight dashboard payload served by /api/admin/stats (aggregate counts +
// only the 5 most recent students/teachers).
const getDashboardStats = async () => {
  try {
    const res = await fetch(`${api_url}/api/admin/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Stats fetch failed");
    return result.data;
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    throw err;
  }
};

export default { getDashboardStats };
