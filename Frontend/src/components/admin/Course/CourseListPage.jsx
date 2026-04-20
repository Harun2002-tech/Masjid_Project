import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Layers,
  Loader2,
  ArrowLeft,
  Eye,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../../../contexts/language-context";
import { COURSE_URL } from "@/config/api";

export default function CourseListPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const API_BASE_URL = "http://localhost:5000";

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(COURSE_URL);
      const result = await res.json();
      if (result?.success && Array.isArray(result.data)) {
        setCourses(result.data);
      } else if (Array.isArray(result)) {
        setCourses(result);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("confirmDelete") || "Are you sure?")) return;
    try {
      setDeletingId(id);
      const res = await fetch(`${COURSE_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthConfig(),
      });

      if (res.ok) {
        setCourses(courses.filter((c) => c._id !== id));
      } else {
        alert("Error!");
      }
    } catch (error) {
      alert("Error!");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const title = course?.title?.toLowerCase() || "";
    const subject = course?.subject?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return title.includes(search) || subject.includes(search);
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b1220]">
        <Loader2 className="animate-spin text-gold w-12 h-12" />
        <p className="mt-4 text-white/40 font-black tracking-widest uppercase text-[10px]">
          {t("loading") || "Loading Courses..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6 pt-32" dir={dir}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div className="space-y-4">
            <Link
              to="/admin"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-gold transition-all"
            >
              <ArrowLeft size={16} className={isRtl ? "rotate-180" : ""} />{" "}
              {t("backToDashboard") || "Back to Dashboard"}
            </Link>
            <div className="flex items-center gap-3">
              <Sparkles className="text-gold animate-pulse" size={24} />
              <h1 className="text-4xl font-bold text-white uppercase tracking-tighter italic">
                {t("courses") || "Courses"}{" "}
                <span className="text-gold-glow">{t("list") || "List"}</span>
              </h1>
            </div>
          </div>

          <Link
            to="/admin/add-course"
            className="btn-gold px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 shadow-2xl active:scale-95 transition-all"
          >
            <Plus size={18} /> {t("addCourse") || "Add New Course"}
          </Link>
        </header>

        {/* Search Bar */}
        <div className="relative mb-14 max-w-xl group">
          <Search
            size={20}
            className={`absolute ${
              isRtl ? "right-6" : "left-6"
            } top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors`}
          />
          <input
            type="text"
            placeholder={t("searchPlaceholder") || "Search for courses..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full glass border border-white/5 rounded-2xl py-5 ${
              isRtl ? "pr-16 pl-6" : "pl-16 pr-6"
            } text-sm font-bold text-white outline-none focus:border-gold/30 transition-all placeholder:text-white/10`}
          />
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => (
              <motion.div
                key={course._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col group hover:border-gold/20 transition-all shadow-xl"
              >
                {/* Thumbnail Area */}
                <div
                  className="h-60 w-full bg-white/5 relative flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/admin/courses/view/${course._id}`)}
                >
                  {course.thumbnail ? (
                    <img
                      src={`${API_BASE_URL}${
                        course.thumbnail.startsWith("/") ? "" : "/"
                      }${course.thumbnail}`}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 text-white/5 w-full h-full">
                      <ImageIcon size={60} />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em]">
                        No Image
                      </span>
                    </div>
                  )}

                  {/* Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="text-[9px] font-black bg-gold text-black px-4 py-2 rounded-full uppercase tracking-tighter shadow-lg">
                      {course.level || "Beginner"}
                    </span>
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="text-white w-10 h-10" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-10 flex-1 flex flex-col">
                  <h3
                    className="text-2xl font-bold text-white mb-3 line-clamp-1 group-hover:text-gold transition-colors uppercase tracking-tight cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/courses/view/${course._id}`)
                    }
                  >
                    {course.title}
                  </h3>
                  <p className="text-white/40 text-[13px] font-medium line-clamp-2 mb-8 leading-relaxed italic">
                    {course.description || "No description provided..."}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5 mb-8 mt-auto">
                    <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                      <Layers size={14} className="text-gold" />
                      <span>
                        {course.lessons?.length || 0}{" "}
                        {t("lessons") || "Lessons"}
                      </span>
                    </div>
                    <span className="text-xl font-black text-gold-glow italic">
                      {course.price === "0" || !course.price
                        ? "FREE"
                        : `${course.price} ETB`}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        navigate(`/admin/courses/view/${course._id}`)
                      }
                      className="p-4 glass text-white/60 hover:text-gold hover:bg-white/10 rounded-2xl transition-all border border-white/5"
                      title="View Course"
                    >
                      <Eye size={20} />
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/admin/courses/edit/${course._id}`)
                      }
                      className="flex-1 bg-white/5 text-white hover:bg-gold hover:text-black py-4 rounded-2xl text-[10px] font-black flex items-center justify-center gap-2 transition-all uppercase tracking-[0.2em] border border-white/10"
                    >
                      <Edit size={14} /> {t("edit") || "Edit"}
                    </button>

                    <button
                      disabled={deletingId === course._id}
                      onClick={() => handleDelete(course._id)}
                      className="p-4 glass text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all border border-red-500/20 disabled:opacity-30"
                    >
                      {deletingId === course._id ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <Trash2 size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && !loading && (
          <div className="text-center py-32 glass rounded-[3rem] border-2 border-dashed border-white/5">
            <Layers size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/20 font-black uppercase tracking-widest text-sm">
              {t("noCoursesFound") || "No Courses Found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
