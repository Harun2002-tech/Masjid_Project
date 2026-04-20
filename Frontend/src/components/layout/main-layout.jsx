import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LanguageProvider } from "../../contexts/language-context";
import { AuthProvider } from "../../contexts/auth-context";
import { MasjidProvider } from "../../contexts/masjid-context";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./navbar";
import Footer from "./footer";

export function MainLayout({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <LanguageProvider>
      <AuthProvider>
        <MasjidProvider>
          <div className="app-shell font-sans antialiased selection:bg-gold selection:text-emerald-950">
            <Navbar />

            <main className="app-main">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </main>

            <Footer />
          </div>
        </MasjidProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
