import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, MousePointer2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/language-context";
import MosqueImg from "../../assets/images/mosque.jpg";
import CoursesPreview from "../home/CoursesPreview";
import NewsSection from "../home/NewsSection";
import YouTubeGallery from "../home/YouTubeGallery";
import TestimonialsSection from "../home/testimonials-section";
import CTASection from "../home/CTASection";
import PrayerTimes from "../prayer-times/prayer-times-page";

export default function Home() {
  const { t, language } = useLanguage();

  const separator = language === "am" ? "፣" : ",";
  const titleParts = t("heroTitle").split(separator);
  const firstPart = titleParts[0];
  const secondPart = titleParts[1] ? separator + titleParts[1] : "";

  const titleFont = language === "am" ? "font-amharic" : "font-display";
  const bodyFont = language === "am" ? "font-amharic" : "font-sans";

  return (
    <div className="min-h-screen bg-[#05080f] overflow-x-hidden">
      {/* ---------------- Hero Section ---------------- */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Image with Ken Burns Effect */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            src={MosqueImg}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-50 grayscale-[20%]"
          />
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#05080f]/80 via-transparent to-[#05080f]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05080f] via-transparent to-[#05080f] opacity-60" />
        </div>

        {/* Cinematic Motifs */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gold/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gold/5 blur-[150px] rounded-full" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-50 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-white/10"
          >
            <Sparkles size={16} className="text-gold" />
            <span
              className={`text-xs md:text-sm font-black text-white/80 tracking-[0.3em] uppercase ${bodyFont}`}
            >
              {language === "am" ? "እንኳን በደህና መጡ" : "Welcome to Ruhama Center"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={`mb-8 ${titleFont} text-4xl md:text-6xl lg:text-[80px] leading-[1.1] font-black text-white tracking-tighter`}
          >
            {/* እዚህ ጋር block የሚሉትን አጥፍተን በአንድ ላይ እናስቀምጠዋለን */}
            <span className="opacity-90">{firstPart}</span>
            <span className="text-gold-glow italic">{secondPart}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className={`mx-auto mb-14 text-white/50 text-lg md:text-2xl max-w-3xl leading-relaxed ${bodyFont}`}
          >
            {t("heroSubtitle")}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`flex flex-col sm:flex-row justify-center gap-6 ${bodyFont}`}
          >
            <Link
              to="/courses"
              className="group bg-gold hover:bg-white text-black px-12 py-5 rounded-2xl text-base font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(212,175,55,0.2)]"
            >
              {t("exploreCoures")}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <Link
              to="/register"
              className="px-12 py-5 border border-white/10 text-white rounded-2xl text-base font-black uppercase tracking-widest hover:bg-white/5 transition-all glass flex items-center justify-center"
            >
              {t("register")}
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 text-white/20"
        >
          <MousePointer2 size={32} />
        </motion.div>
      </section>

      {/* ---------------- Inner Sections ---------------- */}
      <div className="relative z-20 bg-[#05080f]">
        {/* Simple top divider to blend hero with content */}
        <div className="h-32 bg-gradient-to-b from-transparent to-[#05080f]" />

        <div className="relative z-10 space-y-0">
          <CoursesPreview />
          <div className="py-20">
            <PrayerTimes />
          </div>
          <NewsSection />
          <YouTubeGallery />
          <TestimonialsSection />
          <CTASection />
        </div>
      </div>
    </div>
  );
}
