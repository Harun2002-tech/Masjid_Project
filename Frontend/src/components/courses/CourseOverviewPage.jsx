import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { useLanguage } from "../../contexts/language-context";
import {
  BookOpen,
  Clock,
  Calendar,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  ListChecks,
  Sparkles,
  PlayCircle,
  Award,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function CourseOverviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language, dir } = useLanguage();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);

  const API_BASE_URL = "http://https://masjid-project.onrender.com";

  useEffect(() => {
    const fetchCourseAndStatus = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_BASE_URL}/api/courses/${id}`);
        const resData = await response.json();
        const courseData = resData.success ? resData.data : resData;
        setCourse(courseData);

        if (token && id) {
          const statusRes = await fetch(
            `${API_BASE_URL}/api/enrollments/status/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const statusData = await statusRes.json();

          if (statusData?.status === "Approved") {
            navigate(`/course-learn/${id}`);
            return;
          }
          setEnrollmentStatus(statusData?.status);
        }
      } catch (err) {
        console.error("Error fetching course data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndStatus();
  }, [id, navigate]);

  const titleFont =
    language === "am"
      ? "font-amharic"
      : language === "ar"
      ? "font-serif"
      : "font-display";
  const bodyFont = language === "am" ? "font-amharic" : "font-sans";

  if (loading)
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-emerald-900 mb-4" size={48} />
        <p
          className={`text-emerald-900 font-black uppercase tracking-widest text-[10px] ${bodyFont}`}
        >
          {language === "am"
            ? "ዝርዝሩን በማዘጋጀት ላይ..."
            : language === "ar"
            ? "جاري تحميل التفاصيل..."
            : "LOADING DETAILS..."}
        </p>
      </div>
    );

  if (!course)
    return (
      <div
        dir={dir}
        className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6"
      >
        <h1 className={`text-2xl font-bold text-emerald-900 ${titleFont}`}>
          {language === "am"
            ? "ኮርሱ አልተገኘም"
            : language === "ar"
            ? "الكورس غير موجود"
            : "Course Not Found"}
        </h1>
        <Link
          to="/courses"
          className="mt-4 text-gold font-bold uppercase text-xs flex items-center gap-2"
        >
          {dir === "rtl" ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
          {language === "am"
            ? "ወደ ዝርዝር ተመለስ"
            : language === "ar"
            ? "العودة إلى القائمة"
            : "Back to List"}
        </Link>
      </div>
    );

  const renderEnrollmentAction = () => {
    if (enrollmentStatus === "Pending") {
      return (
        <Button
          disabled
          className="w-full h-16 rounded-2xl bg-white/10 text-gold/50 cursor-wait border-none font-black text-[11px] uppercase tracking-[0.1em]"
        >
          <Loader2
            className={`h-4 w-4 animate-spin ${
              dir === "rtl" ? "ml-2" : "mr-2"
            }`}
          />
          {language === "am"
            ? "ጥያቄዎ በመታየት ላይ ነው..."
            : language === "ar"
            ? "طلبك قيد المراجعة..."
            : "Request Pending..."}
        </Button>
      );
    }

    if (course.enrollmentOpen) {
      return (
        <Button
          className="w-full h-16 rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase mb-8 shadow-2xl transition-all duration-500 bg-gold text-emerald-900 hover:bg-white hover:scale-[1.02] border-none"
          asChild
        >
          <Link to={`/courses/${id}/enroll`}>
            {language === "am"
              ? "አሁኑኑ ይመዝገቡ"
              : language === "ar"
              ? "سجل الآن"
              : "ENROLL NOW"}
            {dir === "rtl" ? (
              <ArrowLeft className="mr-3 h-4 w-4" />
            ) : (
              <ArrowRight className="ml-3 h-4 w-4" />
            )}
          </Link>
        </Button>
      );
    }

    return (
      <Button
        disabled
        className="w-full h-16 rounded-2xl bg-white/10 text-white/40 border-none font-black text-[11px] uppercase"
      >
        {language === "am"
          ? "ምዝገባ ተዘግቷል"
          : language === "ar"
          ? "التسجيل مغلق"
          : "REGISTRATION CLOSED"}
      </Button>
    );
  };

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[#FDFBF7] py-12 text-emerald-900 relative pt-32 selection:bg-gold/30"
    >
      <div
        className={`absolute top-0 ${
          dir === "rtl" ? "left-0" : "right-0"
        } w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -z-0`}
      />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            variant="ghost"
            className="mb-10 text-emerald-900/60 hover:text-emerald-900 hover:bg-white/50 transition-all rounded-full px-6 border border-transparent hover:border-emerald-900/10"
            asChild
          >
            <Link to="/courses">
              {dir === "rtl" ? (
                <ArrowRight className="ml-3 h-4 w-4" />
              ) : (
                <ArrowLeft className="mr-3 h-4 w-4" />
              )}
              {language === "am"
                ? "ወደ ኮርሶች ዝርዝር ተመለስ"
                : language === "ar"
                ? "العودة إلى الدورات"
                : "Back to Courses"}
            </Link>
          </Button>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-3">
          <div
            className={`lg:col-span-2 space-y-12 ${
              dir === "rtl" ? "text-right" : "text-left"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="bg-emerald-900 text-gold mb-6 uppercase font-black tracking-[0.3em] px-5 py-2 rounded-full shadow-lg border-none">
                {course.category ||
                  (language === "am"
                    ? "ጠቅላላ"
                    : language === "ar"
                    ? "عام"
                    : "General")}
              </Badge>
              <h1
                className={`text-5xl md:text-6xl font-bold text-emerald-900 mb-6 leading-[1.1] ${titleFont}`}
              >
                {course.title} <span className="text-gold">.</span>
              </h1>
            </motion.div>

            {course.thumbnail && (
              <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={`${API_BASE_URL}${
                    course.thumbnail.startsWith("/") ? "" : "/"
                  }${course.thumbnail}`}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-6 bg-white p-10 md:p-14 rounded-[3.5rem] border border-emerald-900/5 shadow-xl relative overflow-hidden">
              <h2
                className={`text-gold font-black uppercase tracking-[0.3em] text-[11px] flex items-center gap-3 ${
                  dir === "rtl" ? "flex-row-reverse" : ""
                }`}
              >
                <div className="h-1 w-8 bg-gold rounded-full" />
                {language === "am"
                  ? "ስለ ኮርሱ ዝርዝር ማብራሪያ"
                  : language === "ar"
                  ? "تفاصيل الدورة"
                  : "COURSE DESCRIPTION"}
              </h2>
              <p
                className={`text-emerald-900/80 text-xl leading-relaxed italic relative z-10 ${bodyFont}`}
              >
                "{course.description}"
              </p>
            </div>

            <div className="space-y-8">
              <div
                className={`flex items-center gap-4 ${
                  dir === "rtl" ? "flex-row-reverse" : ""
                }`}
              >
                <ListChecks className="text-gold h-6 w-6" />
                <h3
                  className={`text-2xl font-bold text-emerald-900 ${titleFont}`}
                >
                  {language === "am"
                    ? "የትምህርቱ ይዘቶች (Syllabus)"
                    : language === "ar"
                    ? "منهج الدورة"
                    : "Syllabus"}
                </h3>
              </div>
              <div className="grid gap-4">
                {course.syllabus?.map((item, i) => (
                  <motion.div
                    key={i}
                    className={`group p-6 bg-white rounded-3xl border border-emerald-900/5 flex items-center gap-6 hover:shadow-lg transition-all cursor-default ${
                      dir === "rtl" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span className="flex-none w-12 h-12 rounded-2xl bg-emerald-900/5 text-emerald-900 group-hover:bg-emerald-900 group-hover:text-gold flex items-center justify-center text-sm font-black transition-all">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-emerald-900/80 font-bold ${bodyFont}`}
                    >
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="sticky top-32"
            >
              <Card className="bg-emerald-900 border-none rounded-[3.5rem] p-10 text-white shadow-[0_40px_80px_-15px_rgba(2,44,34,0.3)] relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-center mb-8">
                    <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center">
                      <Award className="text-gold h-8 w-8" />
                    </div>
                  </div>

                  <div className="text-center mb-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/60 mb-3">
                      {language === "am"
                        ? "የምዝገባ ሁኔታ"
                        : language === "ar"
                        ? "حالة التسجيل"
                        : "ENROLLMENT STATUS"}
                    </p>
                    <h3
                      className={`text-2xl font-bold text-white ${titleFont}`}
                    >
                      {enrollmentStatus === "Pending"
                        ? language === "am"
                          ? "ጥያቄዎ በመታየት ላይ ነው"
                          : "قيد المراجعة"
                        : course.enrollmentOpen
                        ? language === "am"
                          ? "ምዝገባ ክፍት ነው"
                          : language === "ar"
                          ? "التسجيل مفتوح"
                          : "Open"
                        : language === "am"
                        ? "ምዝገባ ተዘግቷል"
                        : language === "ar"
                        ? "التسجيل مغلق"
                        : "Closed"}
                    </h3>
                  </div>

                  <div className="mb-8">{renderEnrollmentAction()}</div>

                  <div className="space-y-6 pt-8 border-t border-white/10">
                    <InfoRow
                      icon={<Clock size={16} />}
                      label={
                        language === "am"
                          ? "ቆይታ"
                          : language === "ar"
                          ? "المدة"
                          : "Duration"
                      }
                      value={course.duration || "N/A"}
                      dir={dir}
                    />
                    <InfoRow
                      icon={<Calendar size={16} />}
                      label={
                        language === "am"
                          ? "የመጀመሪያ ቀን"
                          : language === "ar"
                          ? "تاريخ البدء"
                          : "Start Date"
                      }
                      value={
                        course.startDate
                          ? new Date(course.startDate).toLocaleDateString(
                              language === "ar"
                                ? "ar-SA"
                                : language === "am"
                                ? "am-ET"
                                : "en-US"
                            )
                          : "TBA"
                      }
                      dir={dir}
                    />
                    <InfoRow
                      icon={<ShieldCheck size={16} />}
                      label={
                        language === "am"
                          ? "ሰርተፍኬት"
                          : language === "ar"
                          ? "الشهادة"
                          : "Certificate"
                      }
                      value={
                        language === "am"
                          ? "ይሰጣል"
                          : language === "ar"
                          ? "معتمد"
                          : "Certified"
                      }
                      valueClass="text-gold"
                      dir={dir}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, valueClass, dir }) {
  return (
    <div
      className={`flex items-center justify-between ${
        dir === "rtl" ? "flex-row-reverse" : ""
      }`}
    >
      <div
        className={`flex items-center gap-3 text-white/40 ${
          dir === "rtl" ? "flex-row-reverse" : ""
        }`}
      >
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest">
          {label}
        </span>
      </div>
      <span className={`text-[11px] font-bold ${valueClass || ""}`}>
        {value}
      </span>
    </div>
  );
}
