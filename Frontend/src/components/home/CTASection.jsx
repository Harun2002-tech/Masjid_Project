import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/language-context";
import {
  ArrowRight,
  ArrowLeft,
  Heart,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Users,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import CountUp from "react-countup";

// Stat Component for the animated numbers
function Stat({ value, label, icon, bodyFont, dir }) {
  const numericValue =
    typeof value === "string" ? parseInt(value.replace(/\D/g, "")) : value;
  const hasPlus = String(value).includes("+");

  return (
    <div className="text-center group">
      <div className="flex justify-center mb-8 transition-transform duration-500 group-hover:-translate-y-4">
        <div className="p-8 rounded-[2rem] glass border border-white/5 text-gold shadow-2xl group-hover:bg-gold group-hover:text-black transition-all duration-500 group-hover:shadow-gold/20">
          {React.cloneElement(icon, { size: 36, strokeWidth: 1.5 })}
        </div>
      </div>
      <p className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-3 tabular-nums">
        <CountUp
          end={numericValue || 0}
          duration={3}
          enableScrollSpy
          scrollSpyOnce
        />
        {hasPlus && <span className="text-gold ml-1 text-4xl">+</span>}
      </p>
      <p
        className={`text-[10px] font-black uppercase tracking-[0.4em] text-white/30 group-hover:text-gold transition-colors ${bodyFont}`}
      >
        {label}
      </p>
    </div>
  );
}

export default function CTASection() {
  const { language, dir, t } = useLanguage();
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://masjid-project.onrender.com";

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem("ruhama_stats");
    return saved
      ? JSON.parse(saved)
      : {
          activeStudents: "500+",
          yearsOfService: "7+",
          qualifiedScholars: "15+",
          totalCourses: "20+",
        };
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/stats`);
        if (response.data.success) {
          setStats(response.data.data);
          localStorage.setItem(
            "ruhama_stats",
            JSON.stringify(response.data.data)
          );
        }
      } catch (error) {
        console.error("Stats Fetch Error:", error);
      }
    };
    fetchStats();
  }, [API_BASE_URL]);

  const titleFont =
    language === "am"
      ? "font-amharic"
      : language === "ar"
      ? "font-serif"
      : "font-serif italic";
  const bodyFont = language === "am" ? "font-amharic" : "";

  return (
    <section
      className={`py-40 relative overflow-hidden bg-[#05080f] ${bodyFont}`}
      dir={dir}
    >
      {/* Cinematic Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gold/5 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-96 bg-gradient-to-t from-red/5 to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Join Academy Card */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`glass p-12 md:p-16 rounded-[4rem] border border-white/5 hover:border-gold/20 transition-all duration-700 shadow-2xl relative overflow-hidden group ${
              dir === "rtl" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`absolute top-0 ${
                dir === "rtl" ? "left-0" : "right-0"
              } p-10 opacity-5 group-hover:opacity-10 transition-opacity`}
            >
              <GraduationCap size={160} className="text-white" />
            </div>

            <div className="h-20 w-20 bg-gold/10 rounded-[1.5rem] flex items-center justify-center mb-12 border border-gold/20">
              <GraduationCap className="h-10 w-10 text-gold" />
            </div>

            <h3
              className={`text-4xl md:text-7xl font-bold text-white mb-10 leading-[1.1] ${titleFont}`}
            >
              {language === "am"
                ? "ጉዟችሁን ይጀምሩ"
                : language === "ar"
                ? "ابدأ رحلتك"
                : "Begin Journey"}
              <span className="text-gold"> .</span>
            </h3>

            <p className="text-white/40 mb-14 text-xl leading-relaxed max-w-md italic font-light">
              {language === "am"
                ? "ጥንታዊ የኢስላማዊ እውቀትን ለመቅሰም የተማሪዎቻችንና የሊቃውንቶቻችን ማህበረሰብ አካል ይሁኑ።"
                : language === "ar"
                ? "كن جزءاً من مجتمعنا العالمي من الطلاب والعلماء المتميزين."
                : "Join our global community of dedicated students and world-class Islamic scholars."}
            </p>

            <Link to="/courses">
              <button className="btn-gold h-20 px-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-6 group shadow-gold-glow">
                {language === "am"
                  ? "አሁን ይመዝገቡ"
                  : language === "ar"
                  ? "سجل الآن"
                  : "Apply Now"}
                {dir === "rtl" ? (
                  <ArrowLeft
                    size={22}
                    className="group-hover:-translate-x-2 transition-transform"
                  />
                ) : (
                  <ArrowRight
                    size={22}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                )}
              </button>
            </Link>
          </motion.div>

          {/* Support/Donation Card */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`glass p-12 md:p-16 rounded-[4rem] border border-white/5 hover:border-red/20 transition-all duration-700 shadow-2xl relative overflow-hidden group ${
              dir === "rtl" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`absolute top-0 ${
                dir === "rtl" ? "left-0" : "right-0"
              } p-10 opacity-5 group-hover:opacity-10 transition-opacity`}
            >
              <Heart size={160} className="text-white" />
            </div>

            <div className="h-20 w-20 bg-red/10 rounded-[1.5rem] flex items-center justify-center mb-12 border border-red/20">
              <Heart className="h-10 w-10 text-red" />
            </div>

            <h3
              className={`text-4xl md:text-7xl font-bold text-white mb-10 leading-[1.1] ${titleFont}`}
            >
              {language === "am"
                ? "ተልዕኳችንን ይደግፉ"
                : language === "ar"
                ? "ادعم رسالتنا"
                : "Support Mission"}
              <span className="text-red"> .</span>
            </h3>

            <p className="text-white/40 mb-14 text-xl leading-relaxed max-w-md italic font-light">
              {language === "am"
                ? "የእርስዎ ድጋፍ ተቋማችንን ለማጠናከር እና አገልግሎታችንን ለማስፋፋት ይረዳናል።"
                : language === "ar"
                ? "مساهماتكم تساهم بشكل مباشر في تمكين الجيل القادم من قادة الفكر."
                : "Your contributions directly empower the next generation of Islamic leaders and educators."}
            </p>

            <Link to="/donations">
              <button className="h-20 px-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] border border-white/10 text-white hover:bg-white hover:text-black transition-all flex items-center gap-6 group">
                {language === "am"
                  ? "አሁኑኑ ይለግሱ"
                  : language === "ar"
                  ? "تبرع الآن"
                  : "Donate Now"}
                <Heart
                  size={20}
                  className="fill-current group-hover:scale-125 transition-transform duration-500"
                />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Dynamic Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 pt-24 border-t border-white/5"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 md:gap-24">
            <Stat
              value={stats.activeStudents}
              label={
                language === "am"
                  ? "ተማሪዎች"
                  : language === "ar"
                  ? "الطلاب"
                  : "Students"
              }
              icon={<Users />}
              bodyFont={bodyFont}
              dir={dir}
            />
            <Stat
              value={stats.yearsOfService}
              label={
                language === "am"
                  ? "ዓመታት"
                  : language === "ar"
                  ? "سنوات"
                  : "Years"
              }
              icon={<Sparkles />}
              bodyFont={bodyFont}
              dir={dir}
            />
            <Stat
              value={stats.qualifiedScholars}
              label={
                language === "am"
                  ? "ሊቃውንት"
                  : language === "ar"
                  ? "العلماء"
                  : "Scholars"
              }
              icon={<ShieldCheck />}
              bodyFont={bodyFont}
              dir={dir}
            />
            <Stat
              value={stats.totalCourses}
              label={
                language === "am"
                  ? "ኮርሶች"
                  : language === "ar"
                  ? "الدورات"
                  : "Courses"
              }
              icon={<BookOpen />}
              bodyFont={bodyFont}
              dir={dir}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
