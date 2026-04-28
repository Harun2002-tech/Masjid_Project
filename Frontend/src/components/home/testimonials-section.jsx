import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { useLanguage } from "../../contexts/language-context";

const TestimonialsSection = () => {
  const { language } = useLanguage();
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const SERVER_URL = "http://https://masjid-project.onrender.com";

  const fetchTestimonials = useCallback(async () => {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/testimonials`);
      setTestimonials(data?.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const nextSlide = useCallback(() => {
    if (testimonials.length) {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }
  }, [testimonials.length]);

  const prevSlide = () => {
    if (testimonials.length) {
      setCurrentIndex(
        (prev) => (prev - 1 + testimonials.length) % testimonials.length
      );
    }
  };

  useEffect(() => {
    if (!testimonials.length) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, testimonials.length]);

  const getImageUrl = (imagePath, name) => {
    if (!imagePath)
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=random&color=fff&size=128`;
    let cleanPath = imagePath.replace(/\\/g, "/");
    if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
    return `${SERVER_URL}${cleanPath}`;
  };

  const titleFont = language === "am" ? "font-amharic" : "font-display";
  const bodyFont = language === "am" ? "font-amharic" : "font-sans";

  if (loading)
    return (
      <div className="py-24 text-center text-gold font-bold animate-pulse">
        በመጫን ላይ...
      </div>
    );
  if (!testimonials.length) return null;

  const current = testimonials[currentIndex];

  return (
    <section className="py-32 relative overflow-hidden bg-[#05080f]">
      {/* Background Cinematic Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`text-gold uppercase tracking-[0.4em] mb-6 font-black text-xs ${bodyFont}`}
          >
            {language === "am" ? "ምስክርነቶች" : "Testimonials"}
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-4xl md:text-6xl font-bold text-white tracking-tighter ${titleFont}`}
          >
            {language === "am"
              ? "ተማሪዎቻችን ስለ እኛ ምን ይላሉ?"
              : "Voice of Our Students"}
          </motion.h3>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="glass border border-white/10 rounded-[4rem] p-10 md:p-20 text-center relative overflow-hidden"
            >
              <Quote className="absolute -top-6 -left-6 text-gold/10 w-48 h-48 pointer-events-none" />

              <div className="flex flex-col items-center relative z-10">
                {/* ⭐ Stars */}
                <div className="flex mb-10 gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={
                        i < current.rating
                          ? "text-gold fill-gold"
                          : "text-white/10"
                      }
                    />
                  ))}
                </div>

                <p
                  className={`text-2xl md:text-4xl font-medium text-white/90 leading-[1.5] mb-12 italic ${bodyFont}`}
                >
                  “{current.content}”
                </p>

                {/* 👤 Profile */}
                <div className="flex flex-col items-center">
                  <div className="relative group mb-6">
                    <div className="absolute inset-0 rounded-full bg-gold/30 blur-md group-hover:bg-gold/50 transition-all" />
                    <div className="w-24 h-24 rounded-full border-4 border-[#05080f] overflow-hidden relative z-10 shadow-2xl">
                      <img
                        src={getImageUrl(current.image, current.name)}
                        alt={current.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  <div>
                    <h4
                      className={`text-white font-bold text-2xl tracking-tight mb-1 ${titleFont}`}
                    >
                      {current.name}
                    </h4>
                    <p className="text-gold text-[10px] font-black uppercase tracking-[0.3em]">
                      {current.role || (language === "am" ? "ተማሪ" : "Student")}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-center mt-12 gap-6">
            <button
              onClick={prevSlide}
              className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-gold hover:text-black transition-all glass"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="w-14 h-14 rounded-full bg-gold flex items-center justify-center text-black hover:scale-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
