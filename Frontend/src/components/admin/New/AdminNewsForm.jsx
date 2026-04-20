import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../../../contexts/language-context";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Send,
  AlertCircle,
  CheckCircle,
  Newspaper,
  Sparkles,
  Image as ImageIcon,
  Calendar,
  Tag,
  Globe,
  ArrowLeft,
  Save,
  Eye,
} from "lucide-react";

export default function AdminNewsForm() {
  const { id } = useParams(); // URL ላይ ID ካለ Edit ወይም View ሞድ ነው
  const navigate = useNavigate();
  const { language, dir } = useLanguage();

  // የትኛው ገጽ ላይ እንዳለን ለማወቅ
  const isViewMode = window.location.pathname.includes("view");
  const isEditMode = Boolean(id) && !isViewMode;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: "ማስታወቂያ",
    featured: false,
    date: new Date().toISOString().split("T")[0],
    image: null,
  });

  const API_BASE_URL = "http://localhost:5000";

  // Edit ወይም View ከሆነ ነባር ዳታ መጫን
  useEffect(() => {
    if (id) {
      const fetchNews = async () => {
        try {
          setFetching(true);
          const res = await axios.get(`${API_BASE_URL}/api/news/${id}`);
          const data = res.data?.data || res.data;
          setFormData({
            title: data.title || "",
            excerpt: data.excerpt || "",
            category: data.category || "ማስታወቂያ",
            featured: data.featured || false,
            date:
              data.date?.split("T")[0] ||
              new Date().toISOString().split("T")[0],
            image: null, // አዲስ ፋይል ካልተመረጠ ባዶ ይሆናል
          });
          if (data.imageUrl) setPreview(data.imageUrl);
        } catch (err) {
          setStatus({ type: "error", msg: "መረጃውን መጫን አልተቻለም!" });
        } finally {
          setFetching(false);
        }
      };
      fetchNews();
    }
  }, [id]);

  const handleImageChange = (e) => {
    if (isViewMode) return; // View ሞድ ከሆነ መቀየር አይቻልም
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewMode) return;

    setLoading(true);
    setStatus({ type: "", msg: "" });

    const formPayload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) formPayload.append(key, formData[key]);
    });

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/api/news/${id}`, formPayload, config);
        setStatus({
          type: "success",
          msg:
            language === "am"
              ? "በተሳካ ሁኔታ ተስተካክሏል! ✨"
              : "Updated successfully!",
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/news`, formPayload, config);
        setStatus({
          type: "success",
          msg:
            language === "am"
              ? "ዜናው በትክክል ተለጥፏል! ✅"
              : "Published successfully!",
        });
      }
      setTimeout(() => navigate("/admin/news"), 2000);
    } catch (error) {
      setStatus({
        type: "error",
        msg: error.response?.data?.message || "Error occurred!",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={48} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-20 px-4 flex flex-col items-center justify-center font-sans pt-32 transition-all duration-500"
      dir={dir}
    >
      {/* Back Button */}
      <div className="w-full max-w-3xl mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-gold font-black text-[10px] uppercase tracking-widest transition-all"
        >
          <ArrowLeft size={16} /> {language === "am" ? "ወደ ኋላ" : "Back"}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-3xl rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
      >
        {/* Header */}
        <div className="relative p-10 text-center border-b border-white/5 bg-white/5">
          <div className="inline-flex p-3 bg-gold/10 rounded-2xl text-gold mb-4">
            {isViewMode ? <Eye size={28} /> : <Newspaper size={28} />}
          </div>
          <h2 className="text-3xl font-bold text-gold-glow tracking-tight uppercase">
            {isViewMode
              ? language === "am"
                ? "የዜና እይታ"
                : "View News"
              : isEditMode
              ? language === "am"
                ? "ዜና ማስተካከያ"
                : "Edit News"
              : language === "am"
              ? "አዲስ ዜና ማሳተሚያ"
              : "Publish News"}
          </h2>
          <p className="text-white/30 text-[10px] font-black tracking-[.3em] uppercase mt-2">
            Ruhama News Center
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Title Input */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-gold/40 uppercase ml-2 tracking-widest flex items-center gap-2">
                <Globe size={12} /> {language === "am" ? "ርዕስ" : "News Title"}
              </label>
              <input
                disabled={isViewMode}
                required
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="payment-input w-full rounded-2xl px-6 py-5 font-bold disabled:opacity-60"
                placeholder="..."
              />
            </div>

            {/* Details */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-gold/40 uppercase ml-2 tracking-widest flex items-center gap-2">
                <Tag size={12} /> {language === "am" ? "ዝርዝር መረጃ" : "Details"}
              </label>
              <textarea
                disabled={isViewMode}
                required
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                className="payment-input w-full rounded-[2rem] p-6 min-h-[160px] disabled:opacity-60"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold/40 uppercase ml-2 tracking-widest flex items-center gap-2">
                <Tag size={12} /> {language === "am" ? "ምድብ" : "Category"}
              </label>
              <select
                disabled={isViewMode}
                className="payment-input w-full rounded-2xl px-6 py-5 appearance-none bg-emerald-950 disabled:opacity-60"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="ማስታወቂያ">ማስታወቂያ (Notice)</option>
                <option value="ወቅታዊ">ወቅታዊ (Latest)</option>
                <option value="ትምህርት">ትምህርት (Education)</option>
              </select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold/40 uppercase ml-2 tracking-widest flex items-center gap-2">
                <Calendar size={12} /> {language === "am" ? "ቀን" : "Date"}
              </label>
              <input
                disabled={isViewMode}
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="payment-input w-full rounded-2xl px-6 py-5 disabled:opacity-60"
              />
            </div>

            {/* Image Upload Area */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-gold/40 uppercase ml-2 tracking-widest flex items-center gap-2">
                <ImageIcon size={12} />{" "}
                {language === "am" ? "ምስል" : "Featured Image"}
              </label>
              <div
                className={`relative group ${
                  isViewMode ? "cursor-default" : "cursor-pointer"
                }`}
              >
                <input
                  disabled={isViewMode}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor={!isViewMode ? "image-upload" : ""}
                  className="flex flex-col items-center justify-center w-full min-h-[120px] rounded-3xl border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 transition-all overflow-hidden"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-white/30">
                      <ImageIcon size={32} strokeWidth={1} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {language === "am"
                          ? "ምስል አልተመረጠም"
                          : "No image selected"}
                      </span>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Featured Checkbox */}
          {!isViewMode && (
            <label className="flex items-center gap-4 p-5 rounded-2xl bg-gold/5 border border-gold/10 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="w-5 h-5 rounded-md border-gold/20 bg-transparent text-gold focus:ring-gold/30"
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-white/80 uppercase tracking-widest group-hover:text-gold transition-colors">
                  {language === "am" ? "እንደ ዋና ዜና አሳይ" : "Mark as Featured"}
                </span>
              </div>
            </label>
          )}

          {/* Status Message */}
          <AnimatePresence mode="wait">
            {status.msg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-5 rounded-2xl flex items-center gap-3 border ${
                  status.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-red/10 border-red/20 text-red-500"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                <p className="text-[11px] font-black uppercase tracking-widest">
                  {status.msg}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button - View ሞድ ከሆነ አይታይም */}
          {!isViewMode && (
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all shadow-xl"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : isEditMode ? (
                <Save size={18} />
              ) : (
                <Send size={18} />
              )}
              {isEditMode
                ? language === "am"
                  ? "አስተካክል"
                  : "UPDATE"
                : language === "am"
                ? "አሳትም"
                : "PUBLISH"}
            </button>
          )}
        </form>
      </motion.div>
    </div>
  );
}
