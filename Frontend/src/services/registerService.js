const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ================= REGISTER ================= */
export const registerService = async (name, email, password) => {
  try {
    // 1. መጀመሪያ የቆዩ ዳታዎችን ማጽዳት
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    // 2. ሰርቨሩ ስህተት ከመለሰ (ለምሳሌ 400 Bad Request)
    if (!response.ok) {
      return {
        success: false,
        error: data.message || "ምዝገባው አልተሳካም (Email might exist)",
      };
    }

    // 3. ዳታው መኖሩን እናረጋግጥና እናስቀምጥ
    if (data.token && data.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return {
        success: true,
        token: data.token,
        user: data.user,
      };
    }

    return { success: false, error: "ያልተጠበቀ ስህተት ተከስቷል" };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "ከሰርቨሩ ጋር መገናኘት አልተቻለም (Network Error)",
    };
  }
};
