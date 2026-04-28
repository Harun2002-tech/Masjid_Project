const API_URL =
  import.meta.env.VITE_API_URL || "https://masjid-project.onrender.com";

export const loginService = async (formData) => {
  try {
    // 1. መጀመሪያ ማንኛውንም የቆየ Auth ዳታ እናጽዳ
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    // 2. ሰርቨሩ ስህተት ከመለሰ (ለምሳሌ 401 Unauthorized)
    if (!response.ok) {
      return {
        success: false,
        error: data.message || "የኢሜል ወይም የይለፍ ቃል ስህተት ነው",
      };
    }

    // 3. ዳታው መኖሩን እናረጋግጥና እናስቀምጥ
    if (data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ለ AuthContext ግልጽ የሆነ Success response እንመልስ
      return {
        success: true,
        token: data.token,
        user: data.user,
      };
    }

    return { success: false, error: "ያልተጠበቀ ስህተት ተከስቷል" };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "ከሰርቨሩ ጋር መገናኘት አልተቻለም (Network Error)",
    };
  }
};

/**
 * Logout ለመሰረዝ የሚጠቅም ረዳት ፋንክሽን
 */
export const logoutService = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login"; // ተጠቃሚውን ወደ መግቢያ ገጽ ለመመለስ
};
