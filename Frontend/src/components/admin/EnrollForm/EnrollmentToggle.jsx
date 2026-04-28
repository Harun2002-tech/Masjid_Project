import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../contexts/language-context"; // 🚩 ቋንቋውን ለመቀየር

const API_BASE_URL = "http://https://masjid-project.onrender.com/api/courses";

const EnrollmentToggle = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [error, setError] = useState(null);
  const { language, t } = useLanguage();
  const isRTL = language === "ar";

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE_URL);
      if (res.data.success) setCourses(res.data.data);
    } catch (err) {
      setError(t("loading_courses_error") || "Error loading courses");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (courseId) => {
    setTogglingId(courseId);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${API_BASE_URL}/${courseId}/toggle-enrollment`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const newState = res.data.enrollmentOpen;
        setCourses((prev) =>
          prev.map((c) =>
            c._id === courseId ? { ...c, enrollmentOpen: newState } : c
          )
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error toggling status");
    } finally {
      setTogglingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="animate-spin text-gold" size={40} />
        <p className="text-text/40 text-[10px] font-black uppercase tracking-widest">
          {t("loading_courses")}
        </p>
      </div>
    );

  return (
    <div
      className="glass p-8 rounded-[3rem] max-w-4xl mx-auto"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h2 className="text-[11px] font-black uppercase tracking-widest text-text/40 flex items-center gap-2 mb-8">
        <Sparkles size={16} className="text-gold shadow-gold-glow" />{" "}
        {t("enrollment_control")}
      </h2>

      <div className="grid gap-4">
        <AnimatePresence>
          {courses.map((course) => (
            <motion.div
              layout
              key={course._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-white/5 border border-white/5 rounded-[2rem] flex justify-between items-center group hover:bg-white/10 hover:border-white/10 transition-all"
            >
              <div className="flex items-center gap-5">
                <div
                  className={`w-1.5 h-10 rounded-full transition-all duration-500 ${
                    course.enrollmentOpen
                      ? "bg-gold shadow-gold-glow"
                      : "bg-red shadow-red-glow opacity-50"
                  }`}
                />
                <div>
                  <h4 className="text-[12px] font-black uppercase text-text tracking-tight">
                    {course.title}
                  </h4>
                  <span
                    className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                      course.enrollmentOpen
                        ? "bg-gold/10 text-gold"
                        : "bg-red/10 text-red"
                    }`}
                  >
                    {course.enrollmentOpen
                      ? t("status_open")
                      : t("status_closed")}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleToggle(course._id)}
                disabled={togglingId === course._id}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  course.enrollmentOpen
                    ? "bg-red/10 text-red hover:bg-red hover:text-white"
                    : "bg-gold text-bg font-bold shadow-lg hover:scale-105"
                }`}
              >
                {togglingId === course._id ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : course.enrollmentOpen ? (
                  <XCircle size={20} />
                ) : (
                  <CheckCircle2 size={20} />
                )}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnrollmentToggle;
