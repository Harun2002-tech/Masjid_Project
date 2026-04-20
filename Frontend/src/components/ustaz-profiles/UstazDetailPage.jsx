import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  BookOpen,
  Award,
  Calendar,
  Loader2,
  Sparkles,
  GraduationCap,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useLanguage } from "../../contexts/language-context";

export default function UstazDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, dir } = useLanguage();
  const [ustaz, setUstaz] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchUstazDetail = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/teachers/${id}`);
        setUstaz(res.data.data || res.data);
      } catch (err) {
        console.error("Error fetching detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUstazDetail();
  }, [id, API_BASE_URL]);

  const titleFont =
    language === "am"
      ? "font-amharic"
      : language === "ar"
      ? "font-serif"
      : "font-serif italic";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#0b1220]">
        <div className="relative">
          <Loader2
            className="animate-spin text-gold"
            size={64}
            strokeWidth={1}
          />
          <div className="absolute inset-0 blur-2xl bg-gold/20 animate-pulse" />
        </div>
        <p
          className={`text-gold/50 text-xs tracking-widest uppercase animate-pulse ${
            language === "am" ? "font-amharic" : ""
          }`}
        >
          {language === "am"
            ? "መረጃው በመጫን ላይ..."
            : language === "ar"
            ? "جاري تحميل البيانات..."
            : "Loading detail..."}
        </p>
      </div>
    );
  }

  if (!ustaz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-6 text-center bg-[#0b1220]">
        <ShieldCheck size={64} className="text-gold/20 mb-6" />
        <h2
          className={`text-3xl font-bold mb-6 text-white ${
            language === "am" ? "font-amharic" : ""
          }`}
        >
          {language === "am"
            ? "ኡስታዙ አልተገኘም!"
            : language === "ar"
            ? "لم يتم العثور على الأستاذ!"
            : "Ustaz not found!"}
        </h2>
        <button
          onClick={() => navigate("/ustaz")}
          className="btn-gold px-10 py-4 font-black text-[10px] uppercase tracking-widest rounded-2xl"
        >
          {language === "am"
            ? "ወደ ዝርዝር ተመለስ"
            : language === "ar"
            ? "العودة إلى القائمة"
            : "Back to List"}
        </button>
      </div>
    );
  }

  const photoUrl = ustaz.photo
    ? `${API_BASE_URL}/${ustaz.photo.replace(/^\/+/, "")}`
    : null;
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${ustaz.firstName}+${ustaz.lastName}&background=0b1220&color=fbbf24&size=512&bold=true`;

  return (
    <div
      dir={dir}
      className={`min-h-screen text-white py-32 px-6 relative overflow-hidden bg-[#0b1220] ${
        language === "am" ? "font-amharic" : ""
      }`}
    >
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: dir === "rtl" ? 10 : -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className={`group flex items-center gap-4 text-white/40 hover:text-gold mb-16 text-[10px] font-black uppercase tracking-widest transition-all ${
            dir === "rtl" ? "flex-row-reverse" : ""
          }`}
        >
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold/50 glass transition-colors">
            {dir === "rtl" ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          </div>
          {language === "am" ? "ተመለስ" : language === "ar" ? "رجوع" : "Go Back"}
        </motion.button>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Left Side (Visual Profile) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl group">
              <img
                src={photoUrl || fallbackAvatar}
                alt={ustaz.firstName}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-transparent to-transparent opacity-80" />

              {/* Floating Stat Badge */}
              <div className="absolute bottom-8 left-8 right-8 p-8 glass rounded-[2.5rem] flex justify-around shadow-2xl border-white/5">
                <div className="text-center">
                  <GraduationCap className="text-gold mx-auto mb-2" size={24} />
                  <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">
                    {language === "am"
                      ? "ተማሪዎች"
                      : language === "ar"
                      ? "الطلاب"
                      : "Students"}
                  </p>
                  <p className="text-xl font-black text-white mt-1 tabular-nums">
                    1.2k+
                  </p>
                </div>
                <div className="w-px h-12 bg-white/5" />
                <div className="text-center">
                  <Award className="text-gold mx-auto mb-2" size={24} />
                  <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">
                    {language === "am"
                      ? "ልምድ"
                      : language === "ar"
                      ? "الخبرة"
                      : "Experience"}
                  </p>
                  <p
                    className={`text-xl font-black text-white mt-1 ${
                      language === "am" ? "text-sm" : ""
                    }`}
                  >
                    {language === "am"
                      ? "12+ ዓመት"
                      : language === "ar"
                      ? "12+ سنة"
                      : "12+ Years"}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div
              className={`glass p-10 rounded-[3rem] border-white/5 ${
                dir === "rtl" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`flex items-center gap-4 mb-8 ${
                  dir === "rtl" ? "flex-row-reverse" : ""
                }`}
              >
                <MessageCircle size={20} className="text-gold" />
                <h4 className="text-[10px] font-black text-white/40 tracking-[0.3em] uppercase">
                  {language === "am"
                    ? "ያግኙን"
                    : language === "ar"
                    ? "تواصل معنا"
                    : "Contact"}
                </h4>
              </div>
              <div className="space-y-6">
                <div
                  className={`flex items-center gap-4 group cursor-pointer ${
                    dir === "rtl" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-gold/20 transition-all duration-300">
                    <Mail
                      size={16}
                      className="text-gold/50 group-hover:text-gold"
                    />
                  </div>
                  <span className="text-sm font-medium text-white/60 hover:text-white transition-colors">
                    {ustaz.email || "ustaz.info@ruhama.com"}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-4 ${
                    dir === "rtl" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Calendar size={16} className="text-gold/50" />
                  </div>
                  <span className="text-xs text-white/40">
                    {language === "am"
                      ? "ከ 2023 ጀምሮ በመተግበሪያው ላይ"
                      : language === "ar"
                      ? "على التطبيق منذ 2023"
                      : "On the app since 2023"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side (Detailed Info) */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`lg:col-span-7 space-y-16 ${
              dir === "rtl" ? "text-right" : "text-left"
            }`}
          >
            <div>
              <div
                className={`flex items-center gap-3 text-gold mb-8 ${
                  dir === "rtl" ? "flex-row-reverse" : ""
                }`}
              >
                <Sparkles size={20} className="animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.4em] uppercase">
                  {language === "am"
                    ? "የሊቃውንት ፕሮፋይል"
                    : language === "ar"
                    ? "ملف العلماء"
                    : "Scholar Profile"}
                </span>
              </div>

              <h1
                className={`text-5xl md:text-8xl font-bold leading-[1.1] mb-10 text-white ${titleFont}`}
              >
                {language === "am"
                  ? "ኡስታዝ"
                  : language === "ar"
                  ? "الأستاذ"
                  : "Ustaz"}{" "}
                <br />
                <span className="text-gold-glow">
                  {ustaz.firstName} {ustaz.lastName}
                </span>
              </h1>

              <div
                className={`flex flex-wrap gap-3 ${
                  dir === "rtl" ? "justify-end" : "justify-start"
                }`}
              >
                {(Array.isArray(ustaz.subjects)
                  ? ustaz.subjects
                  : [ustaz.subjects]
                ).map((sub, i) => (
                  <span
                    key={i}
                    className="glass px-6 py-3 rounded-2xl text-[10px] font-black text-gold uppercase tracking-widest hover:border-gold/40 transition-all border-white/5"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Biography Section */}
            <div className="space-y-8">
              <h3
                className={`text-white/20 text-[10px] font-black tracking-[0.3em] flex items-center gap-4 uppercase ${
                  dir === "rtl" ? "flex-row-reverse" : ""
                }`}
              >
                <BookOpen size={18} className="text-gold/40" />
                {language === "am"
                  ? "የህይወት ታሪክ"
                  : language === "ar"
                  ? "السيرة الذاتية"
                  : "Biography"}
              </h3>
              <div className="relative">
                <div
                  className={`absolute ${
                    dir === "rtl" ? "-right-8" : "-left-8"
                  } top-0 bottom-0 w-1.5 bg-gradient-to-b from-gold/50 to-transparent rounded-full`}
                />
                <p
                  className={`text-xl md:text-3xl text-white/80 leading-relaxed italic ${
                    language === "am" ? "font-amharic" : ""
                  }`}
                >
                  "
                  {ustaz.bio ||
                    (language === "am"
                      ? "ይህ ኡስታዝ ቁርአንንና ሐዲስን በማስተማር ለበርካታ ዓመታት ያገለገሉ ታዋቂ መምህር ናቸው።"
                      : "A renowned teacher dedicated to spreading knowledge of Quran and Hadith.")}
                  "
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div
              className={`pt-12 flex flex-col sm:flex-row items-center gap-8 ${
                dir === "rtl" ? "sm:flex-row-reverse" : ""
              }`}
            >
              <button className="btn-gold w-full sm:w-auto px-16 py-6 text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 group rounded-2xl shadow-gold-glow transition-all active:scale-95">
                {language === "am"
                  ? "ከኡስታዙ ጋር ይማሩ"
                  : language === "ar"
                  ? "تعلم مع الأستاذ"
                  : "Learn with Ustaz"}
                {dir === "rtl" ? (
                  <ChevronLeft
                    size={20}
                    className="group-hover:-translate-x-2 transition-transform"
                  />
                ) : (
                  <ChevronRight
                    size={20}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
