import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Quote, Loader2, ArrowLeft } from "lucide-react";
import axios from "@/api/axios";
import { useLanguage } from "../../../contexts/language-context";

const TestimonialProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [testimonial, setTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);

  const isRTL = language === "ar";

  // 1. ዳታውን ከ API የማምጣት ሂደት
  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const { data } = await axios.get(`/testimonials/${id}`);
        setTestimonial(data.data || data);
      } catch (error) {
        console.error("Error fetching testimonial:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTestimonial();
  }, [id]);

  // ቀኑን እንደየ ቋንቋው ፎርማት ማድረግ
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const locale =
      language === "am" ? "am-ET" : language === "ar" ? "ar-SA" : "en-US";
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading Screen
  if (loading)
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-gold" size={40} />
        <p className="text-gold font-black uppercase tracking-[0.3em] text-[10px]">
          Fetching Profile...
        </p>
      </div>
    );

  // ዳታው ካልተገኘ
  if (!testimonial)
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-gray-500">
        <p className="font-bold">No testimonial found!</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-gold uppercase text-xs font-black tracking-widest"
        >
          Go Back
        </button>
      </div>
    );

  return (
    <div className="py-10 px-4">
      {/* Back Button Container */}
      <div className="max-w-md mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 text-gray-500 hover:text-gold transition-all font-black uppercase text-[10px] tracking-widest ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />
          {language === "am" ? "ተመለስ" : isRTL ? "عودة" : "Back"}
        </button>
      </div>

      {/* Main Card */}
      <motion.div
        className={`relative overflow-hidden max-w-md mx-auto group rounded-[3rem] border border-white/10 glass shadow-[0_30px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl ${
          isRTL ? "text-right" : "text-left"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Gold Accent Line */}
        <div className="h-1.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />

        <div className="p-10 md:p-12 relative">
          {/* Quote Icon */}
          <div
            className={`absolute -top-4 ${
              isRTL ? "left-10" : "right-10"
            } text-gold/10 group-hover:text-gold/30 transition-all duration-500`}
          >
            <Quote
              size={100}
              strokeWidth={0.5}
              className={isRTL ? "scale-x-[-1]" : ""}
            />
          </div>

          {/* Profile Image */}
          <div className="flex justify-center mb-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gold/20 rounded-full blur-3xl scale-150 animate-pulse" />
              <img
                src={
                  testimonial.photo || testimonial.image
                    ? `https://masjid-project.onrender.com${
                        testimonial.photo || testimonial.image
                      }`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        testimonial.name
                      )}&background=0b1220&color=fbbf24`
                }
                alt={testimonial.name}
                className="w-36 h-36 rounded-full object-cover border-4 border-white/10 shadow-2xl relative z-10 ring-4 ring-gold/20"
              />
            </div>
          </div>

          {/* User Info */}
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gold/80 text-center tracking-tighter mb-2 italic">
            {testimonial.name}
          </h2>

          <p className="text-gold/50 text-[10px] font-black tracking-[0.3em] uppercase text-center mb-8">
            {testimonial.role ||
              (language === "am" ? "ተማሪ" : isRTL ? "طالب" : "Student")}
          </p>

          {/* Stars */}
          <div className="flex justify-center gap-2 mb-10">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={
                  i < (testimonial.rating || 0)
                    ? "text-gold fill-gold drop-shadow-gold"
                    : "text-white/5"
                }
              />
            ))}
          </div>

          {/* Testimonial Message */}
          <div className="px-2">
            <p className="text-gray-300 text-lg leading-relaxed text-center font-medium italic opacity-95">
              “{testimonial.message || testimonial.content}”
            </p>
          </div>

          {/* Divider */}
          <div className="flex justify-center my-10">
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          </div>

          {/* Footer Date */}
          <p className="text-center text-[10px] tracking-[0.2em] text-gray-600 font-black uppercase">
            {formatDate(testimonial.createdAt)}
          </p>
        </div>

        {/* Shine Effect */}
        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/5 opacity-40 group-hover:animate-shine" />
      </motion.div>
    </div>
  );
};

export default TestimonialProfile;
