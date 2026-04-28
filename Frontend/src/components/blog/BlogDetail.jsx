import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Share2,
  Clock,
  Loader2,
  Newspaper,
  Link as LinkIcon,
  Check,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/language-context";

export default function BlogDetail() {
  const { id } = useParams();
  const { language, dir } = useLanguage();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // API ጥሪውን እንደ አስፈላጊነቱ ማስተካከል ትችላለህ
        const res = await axios.get(
          `http://https://masjid-project.onrender.com/api/news/${id}`
        );
        setPost(res.data.data || res.data);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const titleFont =
    language === "am"
      ? "font-amharic"
      : language === "ar"
      ? "font-serif"
      : "font-display";
  const bodyFont = language === "am" ? "font-amharic" : "font-sans";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#05080f]">
        <Loader2 className="animate-spin text-gold mb-6" size={48} />
        <p
          className={`text-gold/60 font-black uppercase tracking-[0.4em] text-[10px] ${bodyFont}`}
        >
          {language === "am"
            ? "መረጃ በመጫን ላይ..."
            : language === "ar"
            ? "جاري تحميل المحتوى..."
            : "LOADING CONTENT..."}
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div
        dir={dir}
        className="min-h-screen flex flex-col items-center justify-center bg-[#05080f] text-white p-6"
      >
        <h2 className={`text-3xl font-bold mb-6 text-center ${titleFont}`}>
          {language === "am"
            ? "ዜናው አልተገኘም"
            : language === "ar"
            ? "المقال غير موجود"
            : "Article Not Found"}
        </h2>
        <Link
          to="/news"
          className="flex items-center gap-2 bg-gold text-black px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest transition-transform hover:scale-105"
        >
          {dir === "rtl" ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
          {language === "am"
            ? "ወደ ዜና ዝርዝር"
            : language === "ar"
            ? "العودة إلى الأخبار"
            : "BACK TO NEWS"}
        </Link>
      </div>
    );
  }

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[#05080f] pb-32 selection:bg-gold/30 overflow-x-hidden"
    >
      {/* Hero Header Section */}
      <div className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden">
        {post.imageUrl ? (
          <motion.img
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1.5 }}
            src={post.imageUrl}
            className="w-full h-full object-cover grayscale-[30%]"
            alt={post.title}
          />
        ) : (
          <div className="w-full h-full bg-[#0a0f1a] flex items-center justify-center">
            <Newspaper size={120} className="text-white/5" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#05080f] via-[#05080f]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

        {/* Floating Back Button */}
        <div
          className={`absolute top-32 ${
            dir === "rtl" ? "right-6 md:right-12" : "left-6 md:left-12"
          } z-30`}
        >
          <Link to="/news">
            <motion.button
              whileHover={{ x: dir === "rtl" ? 5 : -5 }}
              className="flex items-center gap-3 bg-white/5 backdrop-blur-md text-white/80 border border-white/10 px-6 py-3 rounded-2xl hover:bg-gold hover:text-black transition-all font-black text-[10px] uppercase tracking-[0.2em]"
            >
              {dir === "rtl" ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
              {language === "am" ? "ተመለስ" : language === "ar" ? "رجوع" : "BACK"}
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Article Content Container */}
      <article className="max-w-4xl mx-auto px-6 -mt-60 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] p-8 md:p-20 border border-white/10 shadow-2xl"
        >
          {/* Metadata Badges */}
          <div
            className={`flex flex-wrap items-center gap-6 mb-12 border-b border-white/5 pb-10 ${
              dir === "rtl" ? "text-right" : "text-left"
            }`}
          >
            <span className="px-6 py-2.5 bg-gold text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
              {post.category ||
                (language === "am"
                  ? "ዜና"
                  : language === "ar"
                  ? "أخبار"
                  : "NEWS")}
            </span>
            <div className="flex items-center gap-2.5 text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
              <Calendar size={14} className="text-gold" />
              {new Date(post.createdAt).toLocaleDateString(
                language === "am"
                  ? "am-ET"
                  : language === "ar"
                  ? "ar-SA"
                  : "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </div>
            <div className="flex items-center gap-2.5 text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
              <Clock size={14} className="text-gold" />
              {language === "am"
                ? "የ5 ደቂቃ ንባብ"
                : language === "ar"
                ? "5 دقائق للقراءة"
                : "5 MIN READ"}
            </div>
          </div>

          {/* Title */}
          <h1
            className={`text-4xl md:text-6xl font-bold text-white leading-[1.2] mb-12 tracking-tight ${titleFont}`}
          >
            {post.title}
          </h1>

          {/* Excerpt with Gold Accent */}
          {post.excerpt && (
            <motion.div
              initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className={`text-xl md:text-2xl italic text-white/70 leading-relaxed mb-16 border-l-2 ${
                dir === "rtl"
                  ? "border-r-2 border-l-0 pr-10 pl-4 text-right"
                  : "border-l-2 pl-10 pr-4 text-left"
              } border-gold py-4 bg-white/5 rounded-[2rem] ${bodyFont}`}
            >
              {post.excerpt}
            </motion.div>
          )}

          {/* Body Content */}
          <div
            className={`prose prose-invert prose-lg max-w-none text-white/80 leading-[2] ${
              dir === "rtl" ? "text-right" : "text-left"
            } ${bodyFont}`}
          >
            {post.content.split("\n").map(
              (paragraph, idx) =>
                paragraph.trim() && (
                  <p
                    key={idx}
                    className="mb-8 opacity-90 hover:opacity-100 transition-opacity"
                  >
                    {paragraph}
                  </p>
                )
            )}
          </div>

          {/* Footer Section */}
          <div className="mt-24 pt-12 border-t border-white/5 flex flex-wrap items-center justify-between gap-10">
            <div
              className={`flex items-center gap-5 ${
                dir === "rtl" ? "flex-row-reverse" : ""
              }`}
            >
              <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center text-black shadow-[0_10px_30px_rgba(212,175,55,0.2)]">
                <User size={32} />
              </div>
              <div className={dir === "rtl" ? "text-right" : "text-left"}>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">
                  {language === "am"
                    ? "የተፃፈው በ"
                    : language === "ar"
                    ? "بواسطة"
                    : "WRITTEN BY"}
                </p>
                <p className={`font-bold text-white text-xl ${bodyFont}`}>
                  {language === "am"
                    ? "የሩሃማ ሚዲያ ክፍል"
                    : language === "ar"
                    ? "فريق رحماء ميديا"
                    : "Ruhama Media Team"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-3 px-6 py-4 bg-white/5 text-white/80 rounded-2xl border border-white/10 hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest"
              >
                {copied ? (
                  <Check size={18} className="text-green-400" />
                ) : (
                  <LinkIcon size={18} className="text-gold" />
                )}
                {copied
                  ? language === "am"
                    ? "ተቀድቷል"
                    : language === "ar"
                    ? "تم النسخ"
                    : "COPIED"
                  : language === "am"
                  ? "ሊንኩን ቅዳ"
                  : language === "ar"
                  ? "نسخ الرابط"
                  : "COPY LINK"}
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      url: window.location.href,
                    });
                  } else {
                    copyToClipboard();
                  }
                }}
                className="p-4 bg-gold text-black rounded-2xl hover:scale-110 transition-all shadow-xl shadow-gold/10"
              >
                <Share2 size={22} />
              </button>
            </div>
          </div>
        </motion.div>
      </article>

      {/* Related Articles */}
      <div className="max-w-4xl mx-auto px-6 mt-32">
        <h3
          className={`text-2xl font-bold text-white mb-10 flex items-center gap-4 ${titleFont}`}
        >
          <span className="w-12 h-px bg-gold/50"></span>
          {language === "am"
            ? "ተያያዥ ዜናዎች"
            : language === "ar"
            ? "مقالات ذات صلة"
            : "Related Articles"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className={`p-16 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10 flex items-center justify-center text-white/20 italic text-center ${bodyFont}`}
          >
            {language === "am"
              ? "በቅርቡ ተጨማሪ ዜናዎች ይኖራሉ..."
              : language === "ar"
              ? "المزيد من المقالات قريباً..."
              : "More articles coming soon..."}
          </div>
        </div>
      </div>
    </div>
  );
}
