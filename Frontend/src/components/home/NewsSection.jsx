import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { useLanguage } from "../../contexts/language-context";
import { ArrowRight, ArrowLeft, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function NewsSection() {
  const { language, dir, t } = useLanguage();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/news`);
        const fetchedData = response.data.data || response.data;
        setNews(Array.isArray(fetchedData) ? fetchedData : []);
      } catch (err) {
        console.error("News Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [language]);

  const getImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  };

  const featuredNews = news.find((item) => item.featured) || news[0];
  const otherNews = news
    .filter((item) => item._id !== featuredNews?._id)
    .slice(0, 4);

  // ፎንቶቹን ለሶስቱም ቋንቋዎች ማስተካከያ
  const navFont =
    language === "am"
      ? "font-arefa"
      : language === "ar"
      ? "font-amiri"
      : "font-sans";

  if (loading) return <NewsSkeleton />;

  return (
    <section className="py-32 relative overflow-hidden bg-[#0b1220]" dir={dir}>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-red/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full flex flex-col items-center justify-center text-center mb-24"
          >
            {/* Header Badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-10 bg-gold/30" />
              <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">
                {language === "am"
                  ? "መረጃ"
                  : language === "ar"
                  ? "اكتشاف"
                  : "Discovery"}
              </span>
              <div className="h-[1px] w-10 bg-gold/30" />
            </div>

            <h2
              className="text-4xl md:text-6xl lg:text-[5rem] font-black text-white mb-10 leading-tight flex flex-row flex-wrap items-center justify-center gap-x-4"
              style={{
                fontFamily:
                  language === "ar"
                    ? '"Amiri", serif'
                    : '"Noto Sans Ethiopic", sans-serif',
              }}
            >
              <span className="opacity-90">
                {language === "am"
                  ? "ዜና እና"
                  : language === "ar"
                  ? "الأخبار و"
                  : "News &"}
              </span>
              <span className="text-gold">
                {language === "am"
                  ? "ወቅታዊ መረጃዎች"
                  : language === "ar"
                  ? "التحديثات"
                  : "Updates"}
              </span>
            </h2>

            {/* Decorative Line */}
            <div className="relative">
              <div className="h-1.5 w-32 bg-gold rounded-full shadow-[0_0_20px_rgba(251,191,36,0.6)]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rotate-45 border-2 border-gold bg-[#0b1220]" />
            </div>
          </motion.div>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Featured News Card */}
          {featuredNews && (
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link to={`/blog/${featuredNews._id}`}>
                <div className="group relative overflow-hidden rounded-[3rem] glass border border-white/5 h-full transition-all duration-500 hover:border-gold/30">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={getImageUrl(featuredNews.imageUrl)}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/800x500/0b1220/fbbf24?text=News";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-transparent to-transparent opacity-80" />
                    <Badge
                      className={`absolute top-8 ${
                        dir === "rtl" ? "right-8" : "left-8"
                      } bg-gold text-black border-none px-6 py-2 rounded-full shadow-lg font-black uppercase tracking-widest text-[10px] ${navFont}`}
                    >
                      {language === "am"
                        ? "ዋና ዜና"
                        : language === "ar"
                        ? "خبر مميز"
                        : "Featured"}
                    </Badge>
                  </div>

                  <div className="p-10 md:p-12">
                    <div
                      className={`flex items-center gap-4 mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gold/60 ${navFont}`}
                    >
                      <Calendar size={14} />
                      {new Date(featuredNews.date).toLocaleDateString(
                        language === "am"
                          ? "am-ET"
                          : language === "ar"
                          ? "ar-SA"
                          : "en-US",
                        { month: "long", day: "numeric", year: "numeric" }
                      )}
                    </div>
                    <h3
                      className={`text-3xl md:text-4xl font-bold mb-6 text-white group-hover:text-gold transition-colors leading-tight tracking-tight ${navFont}`}
                    >
                      {featuredNews.title}
                    </h3>
                    <p
                      className={`text-white/50 leading-relaxed line-clamp-2 mb-10 text-lg ${navFont}`}
                    >
                      {featuredNews.excerpt}
                    </p>
                    <div
                      className={`flex items-center text-gold font-black text-[11px] uppercase tracking-[0.3em] group-hover:gap-5 transition-all ${navFont}`}
                    >
                      {language === "am"
                        ? "ሙሉውን ያንብቡ"
                        : language === "ar"
                        ? "اقرأ المزيد"
                        : "Read More"}{" "}
                      {dir === "rtl" ? (
                        <ArrowLeft
                          size={14}
                          className="mr-2 group-hover:translate-x--2 transition-transform"
                        />
                      ) : (
                        <ArrowRight
                          size={14}
                          className="ml-2 group-hover:translate-x-2 transition-transform"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Sidebar News List */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {otherNews.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: dir === "rtl" ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/blog/${item._id}`}>
                  <div className="glass p-5 rounded-[2.5rem] flex items-center gap-6 border border-white/5 hover:border-gold/30 hover:bg-white/5 transition-all group">
                    <div className="h-24 w-24 shrink-0 rounded-[1.5rem] overflow-hidden bg-white/5 shadow-inner">
                      <img
                        src={getImageUrl(item.imageUrl)}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        alt=""
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/100/0b1220/fbbf24?text=N";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge
                        variant="outline"
                        className={`text-[9px] border-gold/30 text-gold mb-2 font-bold uppercase tracking-tighter ${navFont}`}
                      >
                        {item.category ||
                          (language === "am"
                            ? "መረጃ"
                            : language === "ar"
                            ? "تحديث"
                            : "Update")}
                      </Badge>
                      <h4
                        className={`font-bold text-lg line-clamp-1 text-white group-hover:text-gold transition-colors tracking-tight ${navFont}`}
                      >
                        {item.title}
                      </h4>
                      <p
                        className={`text-[10px] text-white/40 font-bold mt-2 uppercase tracking-widest ${navFont}`}
                      >
                        {new Date(item.date).toLocaleDateString(
                          language === "am"
                            ? "am-ET"
                            : language === "ar"
                            ? "ar-SA"
                            : "en-US"
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsSkeleton() {
  return (
    <div className="py-32 bg-[#0b1220] animate-pulse">
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-16 w-80 bg-white/5 rounded-full mb-20 mx-auto" />
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 h-[600px] bg-white/5 rounded-[3rem]" />
          <div className="lg:col-span-5 space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-white/5 rounded-[2.5rem]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
