import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowUpRight,
  Loader2,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../contexts/language-context";

export default function UstazProfilesPage() {
  const { language, t, dir } = useLanguage();
  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/teachers`);
        const result = response.data.data || response.data;
        setTeachers(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          language === "am" ? "መምህራንን መጫን አልተቻለም።" : "Failed to load teachers."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [API_BASE_URL, language]);

  const filtered = teachers.filter((u) => {
    const searchTerm = search.toLowerCase();
    const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
    const subjects = Array.isArray(u.subjects)
      ? u.subjects.join(" ").toLowerCase()
      : String(u.subjects || "").toLowerCase();
    return fullName.includes(searchTerm) || subjects.includes(searchTerm);
  });

  const titleFont =
    language === "am"
      ? "font-amharic"
      : language === "ar"
      ? "font-serif"
      : "font-serif italic";

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-[#0b1220]">
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
            ? "መምህራንን በመፈለግ ላይ..."
            : language === "ar"
            ? "جاري التحميل..."
            : "Loading Teachers..."}
        </p>
      </div>
    );

  return (
    <div
      dir={dir}
      className={`py-32 px-6 min-h-screen relative overflow-hidden bg-[#0b1220] ${
        language === "am" ? "font-amharic" : ""
      }`}
    >
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className={`flex justify-center items-center gap-3 mb-6 text-gold ${
                dir === "rtl" ? "flex-row-reverse" : ""
              }`}
            >
              <Sparkles size={18} className="animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase">
                {language === "am"
                  ? "የላቀ ትምህርት ለሁሉም"
                  : language === "ar"
                  ? "تعليم متميز للجميع"
                  : "Excellence in Education"}
              </span>
            </div>
            <h1
              className={`text-5xl md:text-8xl font-bold tracking-tighter text-white mb-8 ${titleFont}`}
            >
              {language === "am"
                ? "የእኛ "
                : language === "ar"
                ? "أساتذتنا"
                : "Our "}
              <span className="text-gold-glow">
                {language === "am"
                  ? "ኡስታዞች ."
                  : language === "ar"
                  ? " ."
                  : "Ustazs ."}
              </span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed italic">
              {language === "am"
                ? '"በእውቀታቸው እና በስነ-ምግባራቸው የታወቁ፣ የኡማው ፋኖስ የሆኑ መምህራን"'
                : language === "ar"
                ? '"علماء معروفون بعلمهم وأخلاقهم، منارات للأمة"'
                : '"Renowned for their knowledge and character, beacons for the Ummah"'}
            </p>
          </motion.div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-28 relative group">
          <div className="absolute inset-0 bg-gold/10 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <Search
              className={`absolute ${
                dir === "rtl" ? "right-6" : "left-6"
              } top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors`}
              size={24}
            />
            <input
              type="text"
              placeholder={
                language === "am"
                  ? "ኡስታዝ በስም ወይም በትምህርት አይነት ይፈልጉ..."
                  : language === "ar"
                  ? "ابحث عن أستاذ بالاسم أو التخصص..."
                  : "Search by name or subject..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`payment-input w-full ${
                dir === "rtl" ? "pr-16 pl-6 text-right" : "pl-16 pr-6 text-left"
              } h-20 text-lg rounded-3xl outline-none transition-all`}
            />
          </div>
        </div>

        {/* Grid & Empty State */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filtered.map((ustaz, index) => (
                <UstazCard
                  key={ustaz._id}
                  ustaz={ustaz}
                  index={index}
                  API_BASE_URL={API_BASE_URL}
                  language={language}
                  dir={dir}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass text-center py-24 rounded-[3rem] border-white/5"
          >
            <AlertCircle className="mx-auto text-white/10 mb-6" size={56} />
            <h3 className="text-xl text-white mb-2">
              {language === "am"
                ? "ምንም ኡስታዝ አልተገኘም"
                : language === "ar"
                ? "لم يتم العثور على أستاذ"
                : "No Ustaz Found"}
            </h3>
            <p className="text-white/40 text-sm px-6">
              {language === "am"
                ? "እባክዎ ሌላ ስም ወይም የትምህርት አይነት በመጠቀም ይሞክሩ።"
                : language === "ar"
                ? "يرجى المحاولة باستخدام اسم ወይም تخصص آخر."
                : "Please try another name or subject."}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function UstazCard({ ustaz, index, API_BASE_URL, language, dir }) {
  const photoUrl = ustaz.photo
    ? `${API_BASE_URL}/${ustaz.photo.replace(/^\/+/, "")}`
    : null;
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${ustaz.firstName}+${ustaz.lastName}&background=0b1220&color=fbbf24&size=512&bold=true`;
  const titleFont =
    language === "am"
      ? "font-amharic"
      : language === "ar"
      ? "font-serif"
      : "font-serif italic";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -10 }}
      className="glass group overflow-hidden border border-white/5 hover:border-gold/30 transition-all duration-500 p-6 flex flex-col"
    >
      <div className="relative h-[24rem] -mx-6 -mt-6 overflow-hidden">
        <img
          src={photoUrl || fallbackAvatar}
          alt={ustaz.firstName}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-[#0b1220]/20 to-transparent opacity-90" />

        <div
          className={`absolute bottom-6 left-6 right-6 ${
            dir === "rtl" ? "text-right" : "text-left"
          }`}
        >
          <div
            className={`flex flex-wrap gap-2 mb-4 ${
              dir === "rtl" ? "justify-end" : "justify-start"
            }`}
          >
            {(Array.isArray(ustaz.subjects) ? ustaz.subjects : [ustaz.subjects])
              .slice(0, 2)
              .map((sub, i) => (
                <span
                  key={i}
                  className="bg-gold/10 backdrop-blur-md border border-gold/20 text-gold text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-lg"
                >
                  {sub || "General"}
                </span>
              ))}
          </div>
          <h2
            className={`text-3xl font-bold text-white group-hover:text-gold transition-colors leading-tight ${titleFont}`}
          >
            {language === "am"
              ? `ኡስታዝ ${ustaz.firstName}`
              : language === "ar"
              ? `الأستاذ ${ustaz.firstName}`
              : `Ustaz ${ustaz.firstName}`}
            <br /> {ustaz.lastName}
          </h2>
        </div>
      </div>

      <div
        className={`pt-8 flex-1 flex flex-col ${
          dir === "rtl" ? "text-right" : "text-left"
        }`}
      >
        <p className="text-white/50 text-sm leading-relaxed mb-10 line-clamp-3 italic flex-1">
          "
          {ustaz.bio ||
            (language === "am"
              ? "ስለዚህ መምህር አጭር መግለጫ አልተሰጠም።"
              : "No bio available for this teacher.")}
          "
        </p>

        <Link
          to={`/ustaz-profile/${ustaz._id}`}
          className="btn-gold w-full flex items-center justify-center gap-3 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest group/btn"
        >
          {language === "am"
            ? "ሙሉ መረጃ ይመልከቱ"
            : language === "ar"
            ? "عرض الملف الشخصي"
            : "View Full Profile"}
          <ArrowUpRight
            size={18}
            className={`${
              dir === "rtl"
                ? "rotate-[-90deg] group-hover/btn:-translate-x-1"
                : "group-hover/btn:translate-x-1"
            } group-hover/btn:-translate-y-1 transition-transform`}
          />
        </Link>
      </div>
    </motion.div>
  );
}
