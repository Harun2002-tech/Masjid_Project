import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/language-context"; // ቋንቋውን ለመቀየር
import {
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  PlayCircle,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function MyCourses() {
  const { language, t, dir } = useLanguage();
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/enrollments/my-list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyEnrollments(res.data?.data || []);
      } catch (err) {
        console.error("መረጃ ማምጣት አልተቻለም", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchMyCourses();
    else navigate("/login");
  }, [token, navigate, API_BASE_URL]);

  // የሁኔታ መግለጫ (Status) በቋንቋው እንዲሆን
  const getStatusDisplay = (status) => {
    switch (status) {
      case "approved":
        return {
          label:
            language === "am"
              ? "የጸደቀ"
              : language === "ar"
              ? "تم الموافقة"
              : "Approved",
          icon: <CheckCircle size={14} />,
          class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };
      case "rejected":
        return {
          label:
            language === "am"
              ? "ውድቅ የተደረገ"
              : language === "ar"
              ? "مرفوض"
              : "Rejected",
          icon: <XCircle size={14} />,
          class: "bg-red/10 text-red border-red/20",
        };
      default:
        return {
          label:
            language === "am"
              ? "በመጠባበቅ ላይ"
              : language === "ar"
              ? "قيد الانتظار"
              : "Pending",
          icon: <Clock size={14} />,
          class: "bg-gold/10 text-gold border-gold/20",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-gold" size={40} />
      </div>
    );
  }

  const titleFont =
    language === "am"
      ? "font-amharic"
      : language === "ar"
      ? "font-serif"
      : "font-serif italic";

  return (
    <div
      dir={dir}
      className={`min-h-screen py-20 px-4 md:px-12 max-w-7xl mx-auto ${
        language === "am" ? "font-amharic" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header
          className={`mb-16 border-b border-white/5 pb-10 ${
            dir === "rtl" ? "text-right" : "text-left"
          }`}
        >
          <div
            className={`flex items-center gap-3 mb-4 ${
              dir === "rtl" ? "flex-row-reverse" : ""
            }`}
          >
            <div className="h-1 w-10 bg-gold rounded-full shadow-gold-glow" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/60">
              {language === "am"
                ? "የትምህርት መከታተያ"
                : language === "ar"
                ? "متابعة التعليم"
                : "Learning Tracker"}
            </span>
          </div>
          <h1
            className={`text-4xl md:text-6xl font-bold text-white ${titleFont}`}
          >
            {language === "am"
              ? "የእኔ ኮርሶች"
              : language === "ar"
              ? "كورساتي"
              : "My Courses"}
            <span className="text-gold">.</span>
          </h1>
          <p className="text-white/40 text-xs font-medium mt-4 max-w-2xl">
            {language === "am"
              ? "የምዝገባ ሁኔታዎን እና የትምህርት ሂደትዎን እዚህ ይከታተሉ"
              : language === "ar"
              ? "تابع حالة التسجيل والتقدم الدراسي هنا"
              : "Track your enrollment status and academic progress here."}
          </p>
        </header>

        {myEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {myEnrollments.map((item) => {
              const status = getStatusDisplay(item.applicationStatus);
              const course = item.course;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={item._id}
                  className="glass rounded-[2.5rem] border-white/5 overflow-hidden flex flex-col group hover:border-gold/20 transition-all duration-500"
                >
                  {/* Course Thumbnail with Overlay */}
                  <div className="h-48 bg-[#0b1220] relative overflow-hidden">
                    {course?.thumbnail ? (
                      <img
                        src={`${API_BASE_URL}/${course.thumbnail.replace(
                          /\\/g,
                          "/"
                        )}`}
                        alt={course.title}
                        className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gold/10">
                        <BookOpen size={60} />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div
                      className={`absolute top-6 ${
                        dir === "rtl" ? "left-6" : "right-6"
                      } px-4 py-1.5 rounded-full border text-[10px] font-black flex items-center gap-2 backdrop-blur-md shadow-lg ${
                        status.class
                      }`}
                    >
                      {status.icon} {status.label}
                    </div>
                  </div>

                  {/* Course Details */}
                  <div
                    className={`p-8 flex-1 flex flex-col ${
                      dir === "rtl" ? "text-right" : "text-left"
                    }`}
                  >
                    <h3
                      className={`text-xl font-bold text-white mb-4 line-clamp-2 ${titleFont}`}
                    >
                      {course?.title || "ርዕስ አልተገኘም"}
                    </h3>

                    {/* Progress Bar Section */}
                    <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
                      <div
                        className={`flex items-center justify-between ${
                          dir === "rtl" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">
                          {language === "am"
                            ? "ሂደት"
                            : language === "ar"
                            ? "التقدم"
                            : "Progress"}
                        </span>
                        <span className="text-sm font-black text-gold-glow tabular-nums">
                          {Math.round(item.progress || 0)}%
                        </span>
                      </div>

                      {/* Custom Styled Progress Bar */}
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress || 0}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-gold to-gold-dark"
                        />
                      </div>

                      <div className={`flex justify-end pt-4`}>
                        {item.applicationStatus === "approved" ? (
                          <button
                            onClick={() =>
                              navigate(`/course-learn/${course._id}`)
                            }
                            className="btn-gold p-4 rounded-2xl shadow-lg active:scale-90 transition-all flex items-center gap-2"
                          >
                            <PlayCircle size={22} />
                            <span className="text-[10px] font-black uppercase tracking-widest px-2">
                              {language === "am"
                                ? "ጀምር"
                                : language === "ar"
                                ? "ابدأ"
                                : "Start"}
                            </span>
                          </button>
                        ) : (
                          <div className="text-white/10 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <AlertCircle size={22} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="glass border-dashed border-white/10 rounded-[4rem] p-24 text-center">
            <div className="bg-white/5 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              <BookOpen size={48} className="text-white/10" />
            </div>
            <p className="text-white/40 font-bold italic text-lg mb-8">
              {language === "am"
                ? "እስካሁን ምንም የተመዘገቡበት ኮርስ የለም።"
                : language === "ar"
                ? "لم تقم بالتسجيل في أي كورس بعد."
                : "You haven't enrolled in any courses yet."}
            </p>
            <button
              onClick={() => navigate("/courses")}
              className="btn-gold px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 mx-auto"
            >
              {language === "am"
                ? "አዲስ ኮርስ ምረጥ"
                : language === "ar"
                ? "اختر كورس جديد"
                : "Pick New Course"}
              <ArrowRight
                size={16}
                className={dir === "rtl" ? "rotate-180" : ""}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
