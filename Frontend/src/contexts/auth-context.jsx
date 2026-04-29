import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 1. Logout ተግባር
   */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  }, []);

  /**
   * 2. የተጠቃሚውን ሁኔታ ማረጋገጫ (Check User Status)
   */
  const checkUserStatus = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get("/users/me");

      if (res.data.success) {
        setUser(res.data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error(
        "Auth initialization error:",
        error.response?.data?.message || error.message
      );
      // ቶከኑ ትክክል ካልሆነ ወይም ኤክስፓየር ካደረገ (401) ሎግ አውት ያደርጋል
      if (error.response?.status === 401) {
        logout();
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  /**
   * 3. Login ተግባር
   */
  const login = async (email, password) => {
    try {
      const res = await api.post("/users/login", { email, password });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        return res.data.user;
      }
    } catch (error) {
      throw error;
    }
  };

  /**
 * 5. Register ተግባር 🚀
 */
const register = async (name, email, password, role = "student") => {
  try {
    const res = await api.post("/users/register", { 
      name, 
      email, 
      password, 
      role 
    });

    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return true; // ለ RegisterForm ስኬታማ መሆኑን ለመንገር
    }
    return false;
  } catch (error) {
    console.error("Registration error in Context:", error);
    throw error;
  }
};

  /**
   * 4. የሮል ማረጋገጫ (Role Helper) 🚀
   * በዳታቤዝህ ላይ ያሉት ሮሎች (admin, superadmin, masjid_admin) በትክክል እንዲለዩ ያደርጋል
   */
  const hasRole = useCallback(
    (roles) => {
      if (!user || !user.role) return false;

      // roles Array መሆኑን እናረጋግጥ
      const rolesArray = Array.isArray(roles) ? roles : [roles];

      // የዩዘሩን ሮል ወደ lowercase ቀይረን እናመሳስል
      const userRole = user.role.toLowerCase();

      return rolesArray.some((role) => role.toLowerCase() === userRole);
    },
    [user]
  );

  /**
   * ለተለያዩ ክፍሎች የሚጋራው መረጃ (Context Value)
   */
  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    hasRole, // 👈 PrivateRoute ላይ የሚጠራው
    isAuthenticated: !!user,
    // በቀጥታ አድሚን መሆኑን ቼክ ማድረጊያ (ለ Sidebar ወዘተ)
    isAdmin: ["admin", "superadmin", "masjid_admin"].includes(
      user?.role?.toLowerCase()
    ),
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? (
        children
      ) : (
        <div className="min-h-screen bg-[#05080f] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gold font-medium animate-pulse">
              Ruhama islamic center...
            </p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
