import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../contexts/language-context";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  BookOpen,
  Search,
  LayoutGrid,
  BookMarked,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function CoursesPage() {
  const { t, language, dir } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const API_BASE_URL = "http://https://masjid-project.onrender.com";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/courses`);
        const data = await response.json();
        setCourses(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error("Unable to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    return [...new Set(courses.map((c) => c.category).filter(Boolean))];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const title = course.title || "";
      const desc = course.description || "";
      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, courses]);

  const titleFont =
    language === "am"
      ? "font-amharic"
      : language === "ar"
      ? "font-serif"
      : "font-display";
  const bodyFont = language === "am" ? "font-amharic" : "font-sans";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b1220]">
        <div className="relative">
          <BookOpen
            className="h-16 w-16 text-gold animate-bounce"
            strokeWidth={1}
          />
          <div className="absolute inset-0 blur-2xl bg-gold/20 animate-pulse"></div>
        </div>
        <p
          className={`text-gold/50 text-xs mt-8 tracking-[0.3em] uppercase animate-pulse ${bodyFont}`}
        >
          {language === "am"
            ? "ትምህርቶችን በመጫን ላይ..."
            : language === "ar"
            ? "جاري تحميل الدروس..."
            : "LOADING COURSES..."}
        </p>
      </div>
    );
  }

  return (
    <div
      dir={dir}
      className="min-h-screen py-32 px-6 relative overflow-hidden selection:bg-gold/30"
    >
      {/* Background Glows */}
      <div
        className={`absolute top-0 ${
          dir === "rtl" ? "right-1/4" : "left-1/4"
        } w-[600px] h-[600px] bg-red/5 blur-[120px] rounded-full pointer-events-none`}
      />
      <div
        className={`absolute bottom-0 ${
          dir === "rtl" ? "left-1/4" : "right-1/4"
        } w-[500px] h-[500px] bg-gold/5 blur-[100px] rounded-full pointer-events-none`}
      />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-center items-center gap-3 mb-6 text-gold">
              <Sparkles size={18} className="animate-pulse" />
              <span
                className={`text-xs font-bold tracking-[0.3em] uppercase ${bodyFont}`}
              >
                {language === "am"
                  ? "የእውቀት ብርሃን ለሁላችንም"
                  : language === "ar"
                  ? "نور العلم للجميع"
                  : "LIGHT OF KNOWLEDGE FOR ALL"}
              </span>
            </div>
            <h1
              className={`text-5xl md:text-8xl font-bold tracking-tighter text-white mb-8 ${titleFont}`}
            >
              {language === "am"
                ? "የምንሰጣቸው "
                : language === "ar"
                ? "دروسنا "
                : "OUR "}
              <span className="text-gold-glow">
                {language === "am"
                  ? "ትምህርቶች ."
                  : language === "ar"
                  ? "التعليمية ."
                  : "COURSES ."}
              </span>
            </h1>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <div className="mb-20 flex flex-col md:flex-row gap-6 p-6 glass rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div className="relative flex-1 group">
            <Search
              className={`absolute ${
                dir === "rtl" ? "right-6" : "left-6"
              } top-1/2 h-5 w-5 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors`}
            />
            <input
              type="text"
              placeholder={
                language === "am"
                  ? "ትምህርት እዚህ ይፈልጉ..."
                  : language === "ar"
                  ? "ابحث عن درس هنا..."
                  : "Search courses here..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`payment-input w-full ${
                dir === "rtl" ? "pr-16 pl-6" : "pl-16 pr-6"
              } h-16 rounded-2xl outline-none text-white bg-white/5 border border-white/10 focus:border-gold/30 transition-all ${bodyFont}`}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger
              className={`w-full md:w-[280px] h-16 bg-white/5 border-white/10 rounded-2xl text-white px-6 outline-none focus:ring-1 focus:ring-gold/30 ${bodyFont}`}
            >
              <div
                className={`flex items-center gap-3 ${
                  dir === "rtl" ? "flex-row-reverse" : ""
                }`}
              >
                <LayoutGrid className="h-4 w-4 text-gold" />
                <SelectValue
                  placeholder={
                    language === "am"
                      ? "ዘርፍ ይምረጡ"
                      : language === "ar"
                      ? "اختر الفئة"
                      : "Select Category"
                  }
                />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-[#0b1220] border-white/10 text-white rounded-xl">
              <SelectItem
                value="all"
                className={`focus:bg-gold focus:text-black ${bodyFont}`}
              >
                {language === "am"
                  ? "ሁሉም ዘርፎች"
                  : language === "ar"
                  ? "جميع الفئات"
                  : "All Categories"}
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem
                  key={cat}
                  value={cat}
                  className={`focus:bg-gold focus:text-black ${bodyFont}`}
                >
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Courses Grid */}
        <AnimatePresence mode="popLayout">
          {filteredCourses.length > 0 ? (
            <motion.div
              layout
              className="grid gap-10 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredCourses.map((course, index) => (
                <CourseCard
                  key={course._id || course.id}
                  course={course}
                  index={index}
                  apiBase={API_BASE_URL}
                  language={language}
                  dir={dir}
                  titleFont={titleFont}
                  bodyFont={bodyFont}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center glass rounded-[3rem]"
            >
              <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-white/10" />
              </div>
              <h3 className={`text-xl text-white ${bodyFont}`}>
                {language === "am"
                  ? "ምንም ትምህርት አልተገኘም"
                  : language === "ar"
                  ? "لم يتم العثور على دروس"
                  : "No courses found"}
              </h3>
              <p className={`text-white/40 text-sm mt-2 ${bodyFont}`}>
                {language === "am"
                  ? "ሌላ ቃል በመጠቀም ይሞክሩ"
                  : language === "ar"
                  ? "حاول باستخدام كلمات أخرى"
                  : "Try using different keywords"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CourseCard({
  course,
  index,
  apiBase,
  language,
  dir,
  titleFont,
  bodyFont,
}) {
  const courseId = course._id || course.id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -10 }}
      className="h-full"
    >
      <div
        className={`glass group h-full flex flex-col border border-white/5 hover:border-gold/30 transition-all duration-500 overflow-hidden p-6 rounded-[2.5rem] ${
          dir === "rtl" ? "text-right" : "text-left"
        }`}
      >
        {/* Thumbnail */}
        <div className="relative h-56 -mx-6 -mt-6 mb-8 overflow-hidden">
          {course.thumbnail ? (
            <img
              src={`${apiBase}${course.thumbnail.startsWith("/") ? "" : "/"}${
                course.thumbnail
              }`}
              alt={course.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-[#0b1220]">
              <BookMarked className="h-12 w-12 text-gold/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-[#0b1220]/20 to-transparent"></div>

          <div
            className={`absolute top-6 ${dir === "rtl" ? "right-6" : "left-6"}`}
          >
            <Badge
              className={`bg-gold/10 backdrop-blur-md border border-gold/20 text-gold text-[9px] px-3 py-1.5 rounded-lg ${bodyFont}`}
            >
              {course.category}
            </Badge>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <h3
            className={`text-2xl font-bold text-white group-hover:text-gold transition-colors mb-4 line-clamp-2 leading-snug ${titleFont}`}
          >
            {course.title}
          </h3>

          <p
            className={`text-white/50 text-sm leading-relaxed line-clamp-3 mb-10 italic ${bodyFont}`}
          >
            "{course.description}"
          </p>

          <div className="mt-auto space-y-4">
            <Link
              to={`/courses/${courseId}/enroll`}
              state={{ courseTitle: course.title }}
            >
              <button
                className={`btn-gold w-full flex items-center justify-center gap-3 text-xs py-4 rounded-xl shadow-xl active:scale-[0.98] ${bodyFont}`}
              >
                {language === "am"
                  ? "አሁኑኑ ይመዝገቡ"
                  : language === "ar"
                  ? "سجل الآن"
                  : "ENROLL NOW"}
                {dir === "rtl" ? (
                  <ArrowLeft className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </Link>

            <Link to={`/course-info/${courseId}`} className="block">
              <button
                className={`w-full py-2 text-[10px] text-white/30 hover:text-gold transition-colors uppercase tracking-[0.2em] ${bodyFont}`}
              >
                {language === "am"
                  ? "ተጨማሪ ዝርዝር መረጃ"
                  : language === "ar"
                  ? "مزيد من التفاصيل"
                  : "VIEW FULL DETAILS"}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
