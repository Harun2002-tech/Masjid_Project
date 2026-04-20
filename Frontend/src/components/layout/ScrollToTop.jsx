import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 * ተጠቃሚው ገጽ በቀየረ ቁጥር ብሮውዘሩን ወደ ላይኛው ጫፍ (Top) ይመልሰዋል።
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // ገጽ ሲቀየር ወደ ላይ (0,0) ይመልሰዋል - ለስላሳ እንዲሆን 'smooth' መጨመር ይቻላል
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // አዲስ ገጽ ሲከፈት ወዲያውኑ እንዲያሳይ 'instant' ይመረጣል
      });
    } catch (error) {
      // ለድሮ ብሮውዘሮች እንደ አማራጭ
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}