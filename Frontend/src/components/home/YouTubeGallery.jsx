import React, { useEffect, useState } from "react";
import axios from "axios";
import { Play, Calendar, ExternalLink, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/language-context";

const YouTubeGallery = () => {
  const { language, dir } = useLanguage();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use environment variable for API URL or fallback to localhost
  const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://https://masjid-project.onrender.com";
  const API_URL = `${API_BASE_URL}/api/youtube/videos`;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.data.success) {
          setVideos(response.data.data);
        }
      } catch (error) {
        console.error("ቪዲዮዎችን ማምጣት አልተቻለም:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [API_URL]);

  const titleFont =
    language === "am"
      ? "font-amharic"
      : language === "ar"
      ? "font-arabic"
      : "font-serif italic";
  const bodyFont = language === "am" ? "font-amharic" : "";

  if (loading)
    return (
      <div className="flex justify-center items-center h-[500px] bg-[#05080f]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-t-2 border-gold animate-spin shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
          <div className="absolute inset-4 rounded-full border-b-2 border-white/10 animate-reverse-spin"></div>
          <Youtube className="absolute inset-0 m-auto text-gold/20" size={24} />
        </div>
      </div>
    );

  return (
    <section className="py-40 relative overflow-hidden bg-[#05080f]" dir={dir}>
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-gold/10 mb-6"
          >
            <Youtube size={14} className="text-red-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
              Multimedia
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full flex justify-center items-center mb-12"
          >
            <h2
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-none flex items-baseline gap-x-4 flex-wrap justify-center"
              style={{ fontFamily: '"Noto Sans Ethiopic", sans-serif' }}
            >
              <span className="opacity-90">
                {language === "am"
                  ? "የቅርብ ጊዜ"
                  : language === "ar"
                  ? "آخر"
                  : "Latest"}
              </span>
              <span className="text-gold flex items-baseline">
                {language === "am"
                  ? "ትምህርቶች"
                  : language === "ar"
                  ? "الدروس"
                  : "Lessons"}
                <span className="text-white"></span>
              </span>
            </h2>
          </motion.div>
          <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto rounded-full shadow-gold-glow" />
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {videos.map((video, index) => (
            <motion.div
              key={video.id.videoId}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-[2.5rem] glass border border-white/5 transition-all duration-700 group-hover:border-gold/40 group-hover:-translate-y-2">
                {/* Thumbnail Area */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={
                      video.snippet.thumbnails.high?.url ||
                      video.snippet.thumbnails.medium.url
                    }
                    alt={video.snippet.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />

                  {/* Play Overlay */}
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[3px]"
                  >
                    <div className="bg-gold text-black w-20 h-20 rounded-full flex items-center justify-center shadow-gold-glow-lg transform scale-50 group-hover:scale-100 transition-all duration-500">
                      <Play
                        fill="currentColor"
                        size={32}
                        className={dir === "rtl" ? "rotate-180" : ""}
                      />
                    </div>
                  </a>

                  {/* YouTube Platform Indicator */}
                  <div className="absolute top-6 right-6 bg-red-600/90 text-white p-2 rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Youtube size={16} />
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-10">
                  <h4
                    className={`text-white font-bold text-xl md:text-2xl leading-tight mb-6 line-clamp-2 group-hover:text-gold transition-colors duration-500 ${bodyFont}`}
                  >
                    {video.snippet.title}
                  </h4>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
                      <Calendar size={14} className="mr-3 text-gold/40" />
                      {new Date(video.snippet.publishedAt).toLocaleDateString(
                        language === "am"
                          ? "am-ET"
                          : language === "ar"
                          ? "ar-SA"
                          : "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </div>

                    <a
                      href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Shadow/Glow Effect behind card */}
              <div className="absolute -inset-4 bg-gold/5 blur-3xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10" />
            </motion.div>
          ))}
        </div>

        {/* Footer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 text-center"
        >
          <a
            href="https://youtube.com/@RuhamaIslamicCenter"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 text-gold hover:text-white transition-all font-black tracking-[0.3em] text-[10px] uppercase group"
          >
            <span className="border-b border-gold/30 pb-1 group-hover:border-white transition-colors">
              {language === "am"
                ? "ሁሉንም በዩቲዩብ ይመልከቱ"
                : language === "ar"
                ? "شاهد الكل على يوتيوب"
                : "View all on YouTube"}
            </span>
            <div className="bg-gold/10 p-2 rounded-lg group-hover:bg-gold group-hover:text-black transition-all">
              <ExternalLink size={14} />
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default YouTubeGallery;
