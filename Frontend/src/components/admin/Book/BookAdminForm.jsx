import React, { useState } from "react";
import axios from "axios";
import {
  Loader2,
  PlusCircle,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Star,
  User,
  X,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "../../../contexts/language-context"; // ቋንቋውን ለመቀየር

export default function BookAdminForm() {
  const { language, t } = useLanguage();
  const isRTL = language === "ar";

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Tafsir",
    description: "",
    isSheikhBook: false,
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const categories = [
    "Tafsir",
    "Hadith",
    "Fiqh",
    "Aqidah",
    "History",
    "Language",
    "Other",
  ];

  const toggleSheikhBook = () => {
    const isChecked = !formData.isSheikhBook;
    setFormData({
      ...formData,
      isSheikhBook: isChecked,
      author: isChecked
        ? "ሼክ ሙሀመድ ጁድ"
        : formData.author === "ሼክ ሙሀመድ ጁድ"
        ? ""
        : formData.author,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        setStatus({ type: "error", msg: "ፋይሉ በጣም ትልቅ ነው! ከ 50MB በታች ይሁን።" });
        return;
      }
      setFile(selectedFile);
      setStatus({ type: "", msg: "" });
    }
  };

  const isFormValid = formData.title.trim() && formData.author.trim() && file;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append("file", file);

      const response = await axios.post(
        "http://localhost:5000/api/library",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setStatus({ type: "success", msg: "መጽሐፉ በትክክል ተመዝግቧል!" });
        setFormData({
          title: "",
          author: "",
          category: "Tafsir",
          description: "",
          isSheikhBook: false,
        });
        setFile(null);
      }
    } catch (error) {
      setStatus({ type: "error", msg: "ፋይሉን መጫን አልተቻለም።" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen py-20 px-4 flex items-center justify-center"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="glass max-w-2xl w-full rounded-[3rem] overflow-hidden shadow-2xl border border-glass-border">
        {/* Header Section */}
        <div className="bg-emerald-900/40 p-10 text-center relative border-b border-glass-border">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <BookOpen className="h-32 w-32 text-gold" strokeWidth={1} />
          </div>
          <div className="flex items-center justify-center gap-2 text-gold mb-3 relative z-10">
            <Sparkles size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70">
              {t("library_admin")}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-text relative z-10 text-gold-glow">
            {t("add_new_book")}
          </h2>
        </div>

        <div className="p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload Section */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-text/40 uppercase ml-4 tracking-widest">
                {t("upload_file_label")}
              </label>
              <div
                className={`relative border-2 border-dashed rounded-[2rem] p-10 transition-all text-center ${
                  file
                    ? "border-gold/50 bg-gold/5"
                    : "border-glass-border hover:border-gold/30"
                }`}
              >
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,image/*"
                />
                <div className="flex flex-col items-center gap-4">
                  {file ? (
                    <div className="flex items-center gap-4 bg-[#0b1220]/60 px-6 py-4 rounded-2xl border border-glass-border">
                      <FileText className="text-gold" size={28} />
                      <div className="text-left">
                        <p className="text-sm font-bold text-text truncate max-w-[180px]">
                          {file.name}
                        </p>
                        <p className="text-[9px] text-gold uppercase tracking-widest">
                          Ready
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-red-400 hover:scale-110 transition-transform"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-glass-border group-hover:scale-110 transition-transform">
                        <Upload className="h-7 w-7 text-text/40" />
                      </div>
                      <p className="text-[12px] text-text/60 font-bold uppercase tracking-tight">
                        {t("drag_drop_text")}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Sheikh Tag Checkbox */}
            <div
              onClick={toggleSheikhBook}
              className={`flex items-center gap-5 p-6 rounded-[2rem] border transition-all cursor-pointer ${
                formData.isSheikhBook
                  ? "border-gold bg-gold/5"
                  : "border-glass-border bg-white/5"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all ${
                  formData.isSheikhBook
                    ? "bg-gold border-gold"
                    : "border-glass-border"
                }`}
              >
                {formData.isSheikhBook && (
                  <CheckCircle
                    className="text-[#0b1220] w-5 h-5"
                    strokeWidth={3}
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-text font-bold flex items-center gap-2 text-sm uppercase">
                  <Star
                    className={`w-4 h-4 ${
                      formData.isSheikhBook
                        ? "fill-gold text-gold"
                        : "text-text/20"
                    }`}
                  />
                  {t("sheikh_book_tag")}
                </p>
                <p className="text-[10px] text-text/40 font-medium">
                  {t("sheikh_tag_desc")}
                </p>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text/40 uppercase tracking-widest ml-2">
                  {t("book_title")}
                </label>
                <input
                  required
                  className="payment-input w-full p-5 rounded-2xl outline-none"
                  placeholder={t("book_title_ph")}
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text/40 uppercase tracking-widest ml-2">
                  {t("category")}
                </label>
                <select
                  className="payment-input w-full p-5 rounded-2xl outline-none appearance-none cursor-pointer"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0b1220]">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text/40 uppercase tracking-widest ml-2">
                {t("author_name")}
              </label>
              <div className="relative">
                <User
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-text/20"
                  size={18}
                />
                <input
                  required
                  className="payment-input w-full p-5 pl-14 rounded-2xl outline-none"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text/40 uppercase tracking-widest ml-2">
                {t("description")}
              </label>
              <textarea
                className="payment-input w-full p-5 rounded-2xl outline-none h-32 resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Status Messages */}
            {status.msg && (
              <div
                className={`p-5 rounded-2xl flex items-center gap-4 border animate-pulse ${
                  status.type === "success"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span className="text-xs font-bold uppercase tracking-tight">
                  {status.msg}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`btn-gold w-full py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl ${
                !isFormValid ? "opacity-30 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto h-5 w-5" />
              ) : (
                t("upload_book_btn")
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
