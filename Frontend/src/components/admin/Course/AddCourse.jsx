import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Upload,
  ArrowLeft,
  BookOpen,
  LayoutGrid,
  Save,
  Clock,
  Loader2,
  ImageIcon,
  Sparkles,
  X,
} from "lucide-react";
import { COURSE_URL } from "@/config/api";
import { useLanguage } from "../../../contexts/language-context";

export default function AddCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, t } = useLanguage();

  const isRTL = language === "ar";
  const isEditMode = Boolean(id);
  const isViewMode = location.pathname.includes("/view/");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [thumbnail, setThumbnail] = useState(null);
  const [existingThumbnail, setExistingThumbnail] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    level: "Beginner",
    description: "",
    teacher: "",
    duration: "",
    days: "",
    time: "",
    capacity: 0,
    lessons: [],
  });

  const BASE_URL = "https://masjid-project.onrender.com";

  useEffect(() => {
    if (isEditMode) {
      const fetchCourseData = async () => {
        const token = localStorage.getItem("token");
        try {
          const res = await fetch(`${COURSE_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await res.json();
          if (result.success && result.data) {
            setFormData({
              ...result.data,
              lessons: Array.isArray(result.data.lessons)
                ? result.data.lessons
                : [],
            });
            setExistingThumbnail(result.data.thumbnail || "");
          }
        } catch (err) {
          console.error("Fetch Error:", err);
        } finally {
          setFetching(false);
        }
      };
      fetchCourseData();
    }
  }, [id, isEditMode]);

  const update = (field, value) => {
    if (isViewMode) return;
    setFormData((p) => ({ ...p, [field]: value }));
  };

  // መረጃን ወደ ሰርቨር የሚልክ ፋንክሽን - የተስተካከለ
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return;

    setLoading(true);
    const token = localStorage.getItem("token");
    const data = new FormData();

    // 1. ጽሁፎችን ወደ FormData መለወጥ (thumbnail የሚለውን የጽሁፍ ዳታ መዝለል)
    Object.keys(formData).forEach((key) => {
      if (key === "thumbnail") return; // የድሮውን ምስል ስም በጽሁፍ እንዳይልከው

      if (key === "lessons") {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    // 2. አዲስ የፋይል ምስል ካለ "thumbnail" በሚል ስም መጨመር
    // Backend Multerህ URL ላይ "courses" ካየ ወደ uploads/lessons/ ይልከዋል
    if (thumbnail) {
      data.append("thumbnail", thumbnail);
    }

    try {
      const url = isEditMode ? `${COURSE_URL}/${id}` : COURSE_URL;
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type' እዚህ አያስፈልግም፣ FormData ራሱ ያስተካክላል
        },
        body: data,
      });

      const result = await res.json();
      if (result.success) {
        navigate("/admin/courses");
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Network Error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b1220]">
        <Loader2 className="animate-spin text-gold w-12 h-12 mb-4" />
        <p className="text-gold-glow font-bold uppercase text-[10px] tracking-widest animate-pulse">
          {t("loading")}...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen py-16 px-4 pt-32" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto max-w-5xl relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative z-10">
          <Link
            to="/admin/courses"
            className="flex items-center gap-2 px-6 py-3 glass rounded-2xl text-text/60 font-bold text-sm hover:text-gold transition-all"
          >
            <ArrowLeft size={18} className={isRTL ? "rotate-180" : ""} />{" "}
            {t("back")}
          </Link>

          <div className="text-right">
            <div
              className={`flex items-center gap-2 text-gold mb-1 ${
                isRTL ? "justify-start" : "justify-end"
              }`}
            >
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                Admin Portal
              </span>
            </div>
            <h1 className="text-4xl font-bold text-text text-gold-glow tracking-tighter uppercase">
              {isViewMode
                ? t("view_course")
                : isEditMode
                ? t("edit_course")
                : t("add_course")}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          <section className="glass p-8 md:p-10 rounded-[2.5rem] border border-glass-border">
            <h2 className="text-lg font-bold text-text flex items-center gap-3 mb-8">
              <ImageIcon size={22} className="text-gold" /> {t("course_photo")}
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-80 h-52 bg-black/40 rounded-3xl border-2 border-dashed border-glass-border flex items-center justify-center overflow-hidden">
                {thumbnail ? (
                  <img
                    src={URL.createObjectURL(thumbnail)}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : existingThumbnail ? (
                  <img
                    src={`${BASE_URL}/${existingThumbnail.replace(/^\//, "")}`}
                    className="w-full h-full object-cover"
                    alt="Existing"
                  />
                ) : (
                  <div className="text-center opacity-30">
                    <ImageIcon className="mx-auto mb-2 text-text" size={48} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-text">
                      {t("no_image")}
                    </p>
                  </div>
                )}
              </div>
              {!isViewMode && (
                <label className="btn-gold flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest cursor-pointer shadow-xl">
                  <Upload size={18} /> {t("select_photo")}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files[0])}
                  />
                </label>
              )}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <div className="glass p-8 md:p-10 rounded-[2.5rem] space-y-8">
                <h2 className="text-lg font-bold text-text flex items-center gap-3 border-b border-glass-border pb-4">
                  <BookOpen size={22} className="text-gold" /> {t("basic_info")}
                </h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text/40 uppercase tracking-widest ml-2">
                      {t("course_title")}
                    </label>
                    <input
                      className="payment-input w-full p-5 rounded-2xl outline-none"
                      required
                      value={formData.title}
                      onChange={(e) => update("title", e.target.value)}
                      disabled={isViewMode}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text/40 uppercase tracking-widest ml-2">
                        {t("subject")}
                      </label>
                      <input
                        className="payment-input w-full p-5 rounded-2xl outline-none"
                        required
                        value={formData.subject}
                        onChange={(e) => update("subject", e.target.value)}
                        disabled={isViewMode}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text/40 uppercase tracking-widest ml-2">
                        {t("level")}
                      </label>
                      <select
                        className="payment-input w-full p-5 rounded-2xl outline-none cursor-pointer appearance-none"
                        value={formData.level}
                        onChange={(e) => update("level", e.target.value)}
                        disabled={isViewMode}
                      >
                        <option className="bg-[#0b1220]" value="Beginner">
                          {t("level_beginner")}
                        </option>
                        <option className="bg-[#0b1220]" value="Intermediate">
                          {t("level_intermediate")}
                        </option>
                        <option className="bg-[#0b1220]" value="Advanced">
                          {t("level_advanced")}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-text/40 uppercase tracking-widest ml-2">
                      {t("description")}
                    </label>
                    <textarea
                      className="payment-input w-full p-5 rounded-2xl outline-none min-h-[150px]"
                      required
                      value={formData.description}
                      onChange={(e) => update("description", e.target.value)}
                      disabled={isViewMode}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-8 md:p-10 rounded-[2.5rem] border-t-2 border-t-gold/20 h-fit">
              <h2 className="text-lg font-bold flex items-center gap-3 mb-8 border-b border-glass-border pb-4 text-gold-glow">
                <Clock size={22} /> {t("schedule")}
              </h2>
              <div className="space-y-6">
                {[
                  { id: "duration", label: t("duration") },
                  { id: "days", label: t("days") },
                  { id: "time", label: t("time") },
                  { id: "capacity", label: t("capacity"), type: "number" },
                ].map((f) => (
                  <div key={f.id} className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-text/40 ml-1">
                      {f.label}
                    </label>
                    <input
                      className="payment-input w-full p-4 rounded-xl outline-none text-text font-bold"
                      type={f.type || "text"}
                      value={formData[f.id]}
                      required
                      onChange={(e) => update(f.id, e.target.value)}
                      disabled={isViewMode}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.lessons.map((lesson, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-black/20 p-4 rounded-2xl border border-glass-border"
              >
                <div className="flex-1 space-y-2">
                  <input
                    placeholder="Lesson title"
                    className="bg-transparent w-full outline-none text-sm text-text font-bold"
                    value={lesson.title}
                    onChange={(e) => {
                      const newLessons = [...formData.lessons];
                      newLessons[idx].title = e.target.value;
                      update("lessons", newLessons);
                    }}
                  />
                </div>
                {!isViewMode && (
                  <button
                    type="button"
                    onClick={() =>
                      update(
                        "lessons",
                        formData.lessons.filter((_, i) => i !== idx)
                      )
                    }
                    className="text-red-400 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {!isViewMode && (
            <div className="flex justify-center pt-10">
              <button
                type="submit"
                disabled={loading}
                className="btn-gold flex items-center gap-4 px-20 py-6 rounded-full font-black uppercase text-xs tracking-[0.3em] shadow-2xl disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save size={22} />
                )}
                {isEditMode ? t("update_changes") : t("save_course")}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
