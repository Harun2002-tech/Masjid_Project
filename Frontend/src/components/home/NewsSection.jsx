import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useLanguage } from "../../contexts/language-context";
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Newspaper,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function NewsSection() {
  const { language, dir } = useLanguage();
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

  const titleFont = language === "am" ? "font-amharic" : "font-display";
  const bodyFont = language === "am" ? "font-amharic" : "font-sans";

  if (loading) return <NewsSkeleton />;

  return (
    <section className="py-32 relative overflow-hidden bg-[#05080f]" dir={dir}>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-red/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2
              className={`text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4 ${titleFont}`}
            >
              {language === "am" ? "ዜና እና " : "News & "}
              <span className="text-gold-glow italic">
                {language === "am" ? "ወቅታዊ መረጃዎች" : "Updates"}.
              </span>
            </h2>
            <div className="h-1.5 w-40 bg-gradient-to-r from-gold to-transparent rounded-full" />
          </motion.div>

          <Link to="/blog">
            <button className="h-14 px-10 rounded-2xl font-bold uppercase tracking-widest text-[10px] border border-white/10 glass text-white hover:bg-gold hover:text-black transition-all flex items-center gap-3">
              {language === "am" ? "ሁሉንም ይዩ" : "View All"}
              {dir === "rtl" ? (
                <ArrowLeft size={16} />
              ) : (
                <ArrowRight size={16} />
              )}
            </button>
          </Link>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Featured News */}
          {featuredNews && (
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link to={`/blog/${featuredNews._id}`}>
                <div className="group relative overflow-hidden rounded-[3rem] glass border border-white/5 h-full transition-all duration-500 hover:border-gold/20">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={getImageUrl(featuredNews.imageUrl)}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/800x500/05080f/gold?text=News";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05080f] via-transparent to-transparent opacity-60" />
                    <Badge className="absolute top-8 left-8 bg-gold text-black border-none px-6 py-2 rounded-full shadow-lg font-black uppercase tracking-widest text-[10px]">
                      {language === "am" ? "ዋና ዜና" : "Featured"}
                    </Badge>
                  </div>

                  <div className="p-12">
                    <div className="flex items-center gap-4 mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gold/60">
                      <Calendar size={14} />
                      {new Date(featuredNews.date).toLocaleDateString(
                        language === "am" ? "am-ET" : "en-US",
                        { month: "long", day: "numeric", year: "numeric" }
                      )}
                    </div>
                    <h3
                      className={`text-3xl md:text-4xl font-bold mb-6 text-white group-hover:text-gold transition-colors leading-tight ${titleFont}`}
                    >
                      {featuredNews.title}
                    </h3>
                    <p
                      className={`text-white/40 leading-relaxed line-clamp-2 mb-10 text-lg ${bodyFont}`}
                    >
                      {featuredNews.excerpt}
                    </p>
                    <div className="flex items-center text-gold font-black text-[10px] uppercase tracking-[0.3em] group-hover:gap-4 transition-all">
                      {language === "am" ? "ሙሉውን ያንብቡ" : "Read More"}{" "}
                      <ArrowRight size={14} className="ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Other News List */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {otherNews.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/blog/${item._id}`}>
                  <div className="glass-light p-5 rounded-[2.5rem] flex items-center gap-6 border border-white/5 hover:border-gold/20 hover:bg-white/5 transition-all group">
                    <div className="h-24 w-24 shrink-0 rounded-[1.5rem] overflow-hidden bg-white/5">
                      <img
                        src={getImageUrl(item.imageUrl)}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        alt=""
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/100/05080f/gold?text=N";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge
                        variant="outline"
                        className="text-[9px] border-gold/30 text-gold mb-2 font-bold uppercase tracking-tighter"
                      >
                        {item.category || "Update"}
                      </Badge>
                      <h4
                        className={`font-bold text-lg line-clamp-1 text-white group-hover:text-gold transition-colors ${bodyFont}`}
                      >
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-white/30 font-bold mt-2 uppercase tracking-widest">
                        {new Date(item.date).toLocaleDateString()}
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
    <div className="py-32 bg-[#05080f] animate-pulse">
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-16 w-80 bg-white/5 rounded-full mb-20" />
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
