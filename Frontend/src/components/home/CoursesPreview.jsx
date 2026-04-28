import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/language-context";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Clock,
  Users,
  Sparkles,
  Loader2,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

export default function CoursesPreview() {
  const { t, language, dir } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://https://masjid-project.onrender.com/api/courses"
        );
        setCourses(
          Array.isArray(response.data)
            ? response.data
            : response.data.data || []
        );
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const getTitleFont = () => {
    if (language === "am") return "font-amharic text-5xl md:text-7xl font-bold";
    if (language === "ar") return "font-arabic text-5xl md:text-7xl font-bold";
    return "font-display text-5xl md:text-8xl font-bold";
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-40 bg-[#05080f]">
        <Loader2 className="animate-spin text-gold" size={48} />
        <div className="mt-6 text-gold/50 font-amharic tracking-widest">
          {t("loading") || "ትምህርቶች በመጫን ላይ..."}
        </div>
      </div>
    );

  return (
    <section className="py-32 bg-[#05080f] relative overflow-hidden" dir={dir}>
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] -z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red/5 rounded-full blur-[120px] -z-0" />

      {/* Decorative SVG Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <svg className="h-full w-full">
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div
          className={`flex flex-col md:flex-row justify-between items-end gap-10 mb-24 ${
            language === "ar" ? "md:flex-row-reverse" : ""
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={dir === "rtl" ? "text-right" : "text-left"}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 mb-6">
              <Sparkles size={14} className="text-gold animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">
                {t("educationalExcellence") || "ትምህርታዊ ጥራት"}
              </span>
            </div>

            <h2 className={`${getTitleFont()} text-white tracking-tighter`}>
              {language === "am" ? (
                <>
                  የእውቀት <span className="text-gold-glow">ማዕድ .</span>
                </>
              ) : language === "ar" ? (
                <>
                  دورات <span className="text-gold-glow">العلم .</span>
                </>
              ) : (
                <>
                  Knowledge <span className="text-gold-glow">Courses .</span>
                </>
              )}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/courses">
              <button className="btn-gold group flex items-center gap-3 px-10 h-14 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all">
                {t("viewAll") || "ሁሉንም እይ"}
                {dir === "rtl" ? (
                  <ChevronLeft size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 3).map((course, index) => (
            <motion.div
              key={course._id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass group h-full rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-gold/30 transition-all duration-500 shadow-2xl">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05080f] to-transparent z-10 opacity-60" />

                  {course.thumbnail ? (
                    <img
                      src={`http://https://masjid-project.onrender.com/${course.thumbnail.replace(
                        /^\/+/,
                        ""
                      )}`}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <GraduationCap className="w-20 h-20 text-white/10" />
                    </div>
                  )}

                  <div
                    className={`absolute top-6 ${
                      dir === "rtl" ? "right-6" : "left-6"
                    } z-20`}
                  >
                    <span className="bg-gold text-black text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-lg shadow-xl">
                      {course.category}
                    </span>
                  </div>
                </div>

                <CardContent
                  className={`p-8 relative z-20 ${
                    dir === "rtl" ? "text-right" : "text-left"
                  }`}
                >
                  {/* Level Indicator */}
                  <div
                    className={`flex items-center gap-2 mb-4 ${
                      dir === "rtl" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.8)]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-2xl font-amharic font-bold text-white mb-4 group-hover:text-gold transition-colors line-clamp-1">
                    {course.title}
                  </h3>

                  <p className="text-sm text-white/40 leading-relaxed font-amharic line-clamp-2 mb-8 italic">
                    {course.description}
                  </p>

                  {/* Metadata Footer */}
                  <div
                    className={`flex justify-between items-center pt-6 border-t border-white/5 ${
                      dir === "rtl" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 text-gold/60">
                      <Clock size={14} />
                      <span className="text-[10px] font-bold tracking-widest">
                        {course.duration}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-white/30">
                      <Users size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {course.students}{" "}
                        {language === "am" ? "ተማሪዎች" : "STUDENTS"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
