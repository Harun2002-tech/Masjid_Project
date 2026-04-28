import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../contexts/language-context";
import {
  Edit3,
  Trash2,
  Plus,
  Search,
  Loader2,
  Newspaper,
  Calendar,
  Eye,
  Sparkles,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminNewsList() {
  const { language, setLanguage, t, dir } = useLanguage();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const API_BASE_URL = "https://masjid-project.onrender.com";

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/news`);
      const data = res.data?.data || res.data || [];
      setNews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmMsg = {
      am: "ይህንን ዜና ለመሰረዝ እርግጠኛ ነዎት?",
      en: "Are you sure you want to delete this news?",
      ar: "هل أنت متأكد አነክ تريد حذف هذا الخبر؟",
    };

    if (!window.confirm(confirmMsg[language] || confirmMsg.en)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNews(news.filter((item) => item._id !== id));
    } catch (err) {
      alert("Error!");
    }
  };

  const filteredNews = news.filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="min-h-screen py-20 px-4 md:px-8 pt-32 transition-all duration-500"
      dir={dir}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className={`flex items-center gap-3 mb-4 ${
                dir === "rtl" ? "flex-row-reverse" : ""
              }`}
            >
              <div className="p-2 bg-gold/10 rounded-xl text-gold">
                <Newspaper size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                {language === "ar"
                  ? "لوحة التحكم"
                  : language === "am"
                  ? "አስተዳዳሪ ማዕከል"
                  : "Admin Dashboard"}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gold-glow tracking-tight uppercase">
              {language === "ar" ? "قائمة" : language === "am" ? "የዜና" : "News"}{" "}
              <span className="text-white font-light italic">
                {language === "ar"
                  ? "الأخبار"
                  : language === "am"
                  ? "ዝርዝር"
                  : "List"}
              </span>
            </h1>
          </motion.div>

          {/* Action Buttons & Language Switcher */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/admin/add-news">
              <button className="btn-gold flex items-center gap-3 px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-gold/10">
                <Plus size={18} />
                {language === "ar"
                  ? "إضافة خبر جديد"
                  : language === "am"
                  ? "አዲስ ዜና ጨምር"
                  : "Add News"}
              </button>
            </Link>
          </div>
        </div>

        {/* Search Bar - Glass Style */}
        <div className="relative mb-12">
          <input
            type="text"
            placeholder={
              language === "ar"
                ? "البحث عن الأخبار..."
                : language === "am"
                ? "ዜና በርዕስ ይፈልጉ..."
                : "Search news..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="payment-input w-full rounded-[2rem] px-14 py-6 text-white placeholder:text-white/20"
          />
          <Search
            className={`absolute ${
              dir === "rtl" ? "right-6" : "left-6"
            } top-1/2 -translate-y-1/2 text-gold/40`}
            size={22}
          />
        </div>

        {/* List Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-gold mb-4" size={48} />
            <p className="text-gold/40 font-black text-[10px] uppercase tracking-[0.3em]">
              Loading...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredNews.map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass group rounded-[2.5rem] p-4 md:p-6 border border-white/5 hover:border-gold/20 transition-all overflow-hidden"
                >
                  <div
                    className={`flex flex-col md:flex-row items-center gap-6 ${
                      dir === "rtl" ? "md:flex-row-reverse text-right" : ""
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full md:w-44 h-32 rounded-[1.5rem] overflow-hidden bg-white/5 flex-shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/5">
                          <Newspaper size={40} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-3">
                      <div
                        className={`flex flex-wrap gap-2 ${
                          dir === "rtl" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span className="px-3 py-1 bg-gold/10 text-gold text-[9px] font-black uppercase tracking-tighter rounded-full border border-gold/10">
                          {item.category}
                        </span>
                        {item.featured && (
                          <span className="px-3 py-1 bg-white/10 text-white text-[9px] font-black uppercase tracking-tighter rounded-full flex items-center gap-1">
                            <Sparkles size={8} /> Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-gold-glow transition-colors">
                        {item.title}
                      </h3>
                      <div
                        className={`flex items-center gap-4 text-white/20 text-[10px] font-black uppercase tracking-widest ${
                          dir === "rtl" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Calendar size={14} className="text-gold/40" />
                          {new Date(item.createdAt).toLocaleDateString(
                            language === "ar"
                              ? "ar-EG"
                              : language === "am"
                              ? "am-ET"
                              : "en-US"
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div
                      className={`flex items-center gap-2 pt-4 md:pt-0 ${
                        dir === "rtl"
                          ? "md:pr-6 md:border-r"
                          : "md:pl-6 md:border-l"
                      } border-white/5`}
                    >
                      <Link to={`/blog/${item._id}`} target="_blank">
                        <button className="p-4 text-white/20 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                          <Eye size={20} />
                        </button>
                      </Link>
                      <Link to={`/admin/news/edit/${item._id}`}>
                        <button className="p-4 text-white/20 hover:text-gold hover:bg-gold/5 rounded-2xl transition-all">
                          <Edit3 size={20} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-4 text-white/10 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
