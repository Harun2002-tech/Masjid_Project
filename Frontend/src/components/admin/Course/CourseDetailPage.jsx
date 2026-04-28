import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FileText,
  ArrowLeft,
  Plus,
  Video,
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
  UploadCloud,
  Link as LinkIcon,
  Edit2,
  Trash2,
  Sparkles,
  Music,
  FileJson,
} from "lucide-react";
// ከዚህ ይልቅ (አንጻራዊ መንገድ በመጠቀም)፡
import { useLanguage } from "../../../contexts/language-context";

// (ማሳሰቢያ፦ እንደ ፋይሉ መደራረብ የ ".." ብዛት ሊለያይ ይችላል)
import { motion, AnimatePresence } from "framer-motion";

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const isRtl = dir === "rtl";

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedLessonId, setExpandedLessonId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingLessonId, setEditingLessonId] = useState(null);
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    dayNumber: 1,
    youtubeUrl: "",
  });
  const [files, setFiles] = useState({ audio: null, pdf: null });

  const API_BASE = "https://masjid-project.onrender.com";

  useEffect(() => {
    if (id && id !== ":id") fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/courses/${id}`);
      const result = await res.json();
      if (result.success) setCourse(result.data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  const handleEditClick = (lesson) => {
    setEditingLessonId(lesson._id);
    setNewLesson({
      title: lesson.title,
      description: lesson.description,
      dayNumber: lesson.dayNumber,
      youtubeUrl: lesson.youtubeUrl || "",
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", newLesson.title);
    formData.append("description", newLesson.description);
    formData.append("dayNumber", newLesson.dayNumber);
    formData.append("youtubeUrl", newLesson.youtubeUrl);
    if (files.audio) formData.append("audio", files.audio);
    if (files.pdf) formData.append("pdf", files.pdf);

    const url = editingLessonId
      ? `${API_BASE}/api/courses/${id}/lessons/${editingLessonId}`
      : `${API_BASE}/api/courses/${id}/lessons`;
    const method = editingLessonId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        closeModal();
        fetchCourseData();
      }
    } catch (err) {
      alert("Error!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm(t("confirmDelete") || "Are you sure?")) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/courses/${id}/lessons/${lessonId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if ((await res.json()).success) fetchCourseData();
    } catch (err) {
      alert("Failed!");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLessonId(null);
    setNewLesson({ title: "", description: "", dayNumber: 1, youtubeUrl: "" });
    setFiles({ audio: null, pdf: null });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gold w-12 h-12" />
      </div>
    );

  return (
    <div className="min-h-screen py-16 px-4 pt-32" dir={dir}>
      <div className="container mx-auto max-w-4xl relative">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 px-6 py-3 glass rounded-2xl text-white/60 font-bold text-sm hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft
              size={18}
              className={`${
                isRtl ? "rotate-180" : ""
              } group-hover:-translate-x-1 transition-transform`}
            />{" "}
            {t("back")}
          </button>
          <div className={isRtl ? "text-right" : "md:text-right"}>
            <div
              className={`flex items-center ${
                isRtl ? "justify-start" : "md:justify-end"
              } gap-2 text-gold-glow mb-1`}
            >
              <Sparkles size={16} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                {t("courseDetail") || "Course Detail"}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white uppercase tracking-tighter">
              {course?.title}
            </h1>
          </div>
        </div>

        {/* Add Lesson Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-gold flex items-center gap-2 px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl active:scale-95"
          >
            <Plus size={18} /> {t("addLesson")}
          </button>
        </div>

        {/* Lessons List */}
        <div className="space-y-6">
          {course?.lessons?.length > 0 ? (
            course.lessons.map((lesson) => (
              <div
                key={lesson._id}
                className="glass rounded-[2rem] overflow-hidden border border-white/5"
              >
                <div className="flex items-center justify-between p-6">
                  <button
                    onClick={() =>
                      setExpandedLessonId(
                        expandedLessonId === lesson._id ? null : lesson._id
                      )
                    }
                    className="flex flex-1 items-center gap-5 text-left"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gold border border-white/10">
                      {lesson.youtubeUrl ? (
                        <Video size={24} />
                      ) : (
                        <FileText size={24} />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                        Day {lesson.dayNumber}
                      </span>
                      <h3 className="font-bold text-white text-lg">
                        {lesson.title}
                      </h3>
                    </div>
                  </button>

                  <div className="flex items-center gap-3 px-4">
                    <button
                      onClick={() => handleEditClick(lesson)}
                      className="p-3 text-white/40 hover:text-gold glass rounded-xl transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson._id)}
                      className="p-3 text-white/40 hover:text-red glass rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="ml-2 text-white/20">
                      {expandedLessonId === lesson._id ? (
                        <ChevronUp size={24} />
                      ) : (
                        <ChevronDown size={24} />
                      )}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedLessonId === lesson._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5 bg-white/[0.02] p-8 space-y-8"
                    >
                      <p className="text-white/60 leading-relaxed italic">
                        {lesson.description}
                      </p>

                      {lesson.youtubeUrl && (
                        <div className="rounded-[2rem] overflow-hidden aspect-video shadow-2xl border border-white/10 bg-black">
                          <iframe
                            width="100%"
                            height="100%"
                            src={getEmbedUrl(lesson.youtubeUrl)}
                            title="Video"
                            frameBorder="0"
                            allowFullScreen
                          ></iframe>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {lesson.audioUrl && (
                          <div className="p-6 glass rounded-2xl space-y-3">
                            <label className="text-[10px] font-black text-gold/50 uppercase tracking-widest flex items-center gap-2">
                              <Music size={14} /> Audio Lesson
                            </label>
                            <audio
                              controls
                              className="w-full h-10 filter invert opacity-80"
                              src={`${API_BASE}/${lesson.audioUrl.replace(
                                /\\/g,
                                "/"
                              )}`}
                            />
                          </div>
                        )}
                        {lesson.pdfUrl && (
                          <a
                            href={`${API_BASE}/${lesson.pdfUrl.replace(
                              /\\/g,
                              "/"
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-3 p-6 glass rounded-2xl text-white font-bold hover:bg-white/10 transition-all border border-white/5"
                          >
                            <FileJson className="text-gold" />{" "}
                            {t("openPdf") || "Open PDF Document"}
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className="text-center py-20 glass rounded-[2.5rem] border-2 border-dashed border-white/5 opacity-30 uppercase font-black tracking-[0.3em] text-sm">
              {t("noLessons")}
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0b1220]/90 backdrop-blur-xl">
          <div className="bg-[#0f172a] w-full max-w-xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-gold/10 to-transparent">
              <h2 className="text-gold font-bold uppercase tracking-widest">
                {editingLessonId ? t("editCourse") : t("addLesson")}
              </h2>
              <button
                onClick={closeModal}
                className="text-white/40 hover:text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="p-10 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar"
            >
              <div className="grid grid-cols-4 gap-6">
                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">
                    Day
                  </label>
                  <input
                    type="number"
                    className="payment-input w-full p-4 rounded-xl outline-none text-center font-bold"
                    value={newLesson.dayNumber}
                    onChange={(e) =>
                      setNewLesson({ ...newLesson, dayNumber: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-3 space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    className="payment-input w-full p-4 rounded-xl outline-none font-bold"
                    value={newLesson.title}
                    onChange={(e) =>
                      setNewLesson({ ...newLesson, title: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">
                  YouTube URL
                </label>
                <input
                  type="url"
                  className="payment-input w-full p-4 rounded-xl outline-none text-red-400 text-sm"
                  value={newLesson.youtubeUrl}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, youtubeUrl: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">
                    Audio
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) =>
                      setFiles({ ...files, audio: e.target.files[0] })
                    }
                    className="text-[10px] glass w-full p-3 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">
                    PDF
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) =>
                      setFiles({ ...files, pdf: e.target.files[0] })
                    }
                    className="text-[10px] glass w-full p-3 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-2">
                  Description
                </label>
                <textarea
                  rows="4"
                  className="payment-input w-full p-4 rounded-xl outline-none text-sm resize-none"
                  value={newLesson.description}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, description: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-gold w-full py-6 rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-30 mt-4"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : editingLessonId ? (
                  <Edit2 size={18} />
                ) : (
                  <UploadCloud size={18} />
                )}
                {isSubmitting
                  ? t("loading")
                  : editingLessonId
                  ? t("updateChanges")
                  : t("saveCourse")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
