import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";

/**
 * PrivateRoute - ገጾችን በስልጣን (Role) ለመገደብ የሚያገለግል
 * @param {children} - ሊታይ የሚገባው ገጽ
 * @param {roles} - የተፈቀዱ ሮሎች (ለምሳሌ፦ ["admin", "superadmin"])
 */
const PrivateRoute = ({ children, roles }) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  // 1. ዳታው ከሰርቨር እስኪመጣ ድረስ ባዶ ገጽ ወይም ኤረር እንዳያሳይ መከላከል
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#05080f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gold/60 text-sm animate-pulse">በመጫን ላይ...</p>
        </div>
      </div>
    );
  }

  // 2. ተጠቃሚው ካልገባ (Login ካላደረገ) ወደ Login ገጽ ይወሰዳል
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. ተጠቃሚው ቢገባም ነገር ግን ለዚህ ገጽ የተፈቀደለት Role ከሌለው
  if (roles) {
    // roles Array መሆኑን እናረጋግጥ
    const rolesToChecked = Array.isArray(roles) ? roles : [roles];

    // hasRole አሁን በ AuthContext ውስጥ በ lowercase ሎጂክ ስለተሰናዳ በትክክል ይሰራል
    if (!hasRole(rolesToChecked)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 4. ሁሉም መስፈርቶች ከተሟሉ ገጹን ያሳየዋል
  return children;
};

export default PrivateRoute;
