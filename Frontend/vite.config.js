import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // "@" ምልክት ወደ "src" ፎልደር እንዲያመለክት ያደርጋል
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // ማንኛውም በ /api የሚጀምር ጥያቄ ወደ backend (Port 5000) እንዲሄድ ያደርጋል
      "/api": {
        target: "https://masjid-project.onrender.com",
        changeOrigin: true,
        secure: false,
      },
      // በዳታቤዝህ ውስጥ ያሉ ምስሎች በFrontend ላይ እንዲታዩ
      "/uploads": {
        target: "https://masjid-project.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
