import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../contexts/language-context";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Share2,
  RefreshCw,
  Quote,
  ArrowLeft,
  ArrowRight,
  Copy,
  CheckCircle2,
  Loader2,
  Sparkles,
  Bookmark,
  Languages,
} from "lucide-react";

export default function DailyMessagePage() {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { language, dir } = useLanguage();

  const fetchDailyMessage = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://https://masjid-project.onrender.com/api/messages/random"
      );
      setMessage(response.data);
    } catch (error) {
      console.error("Error fetching message:", error);
      setMessage({
        type: "Ayah",
        arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
        text:
          language === "am"
            ? "በእርግጥም ከአስቸጋሪነት ጋር ቀላልነት አለ።"
            : language === "ar"
            ? "إن مع العسر يسراً"
            : "For indeed, with hardship [will be] ease.",
        reference:
          language === "am" ? "ሱረቱ አል-ሸርህ 94:5" : "Surah Al-Sharh 94:5",
      });
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    fetchDailyMessage();
  }, []);

  const handleCopy = () => {
    if (!message) return;
    const footer =
      language === "am"
        ? "በሩሃማ ኢስላሚክ ሴንተር የተላከ"
        : language === "ar"
        ? "أرسلت عبر مركز روهاما الإسلامي"
        : "Sent via Ruhama Islamic Center";
    const fullText = `${message.arabic}\n\n"${message.text}"\n— ${message.reference}\n\n${footer}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title:
            language === "am"
              ? "የዕለቱ መልዕክት - ሩሃማ"
              : language === "ar"
              ? "رسالة اليوم - روهاما"
              : "Daily Message - Ruhama",
          text: `${message.arabic}\n\n"${message.text}"\n— ${message.reference}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed", err);
      }
    } else {
      handleCopy();
    }
  };

  const titleFont =
    language === "am"
      ? "font-amharic"
      : language === "ar"
      ? "font-serif"
      : "font-display";
  const bodyFont = language === "am" ? "font-amharic" : "font-sans";

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[#05080f] py-20 px-4 relative flex items-center justify-center overflow-hidden selection:bg-gold/30"
    >
      {/* Cinematic Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[150px] -z-0 animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-3xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            to="/dashboard"
            className={`text-white/40 hover:text-gold flex items-center gap-3 mb-10 transition-all group w-fit ${
              dir === "rtl" ? "flex-row-reverse" : ""
            }`}
          >
            {dir === "rtl" ? (
              <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
            ) : (
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-2 transition-transform" />
            )}
            <span
              className={`text-[10px] font-black uppercase tracking-[0.3em] ${bodyFont}`}
            >
              {language === "am"
                ? "ወደ ዳሽቦርድ ተመለስ"
                : language === "ar"
                ? "العودة إلى لوحة القيادة"
                : "Back to Dashboard"}
            </span>
          </Link>
        </motion.div>

        <Card className="bg-white/[0.02] border-white/10 shadow-2xl rounded-[4rem] relative overflow-hidden backdrop-blur-3xl border-t-white/20">
          <Quote
            className={`absolute -top-10 ${
              dir === "rtl" ? "-right-10" : "-left-10"
            } h-48 w-48 text-gold/5 ${
              dir === "rtl" ? "rotate-12" : "-rotate-12"
            } pointer-events-none`}
          />

          <CardContent className="p-10 md:p-20 w-full text-center relative">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-8 py-20"
                >
                  <div className="relative">
                    <Loader2 className="h-16 w-16 text-gold animate-spin" />
                    <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-gold/50 animate-bounce" />
                  </div>
                  <p
                    className={`text-[10px] font-black uppercase tracking-[0.4em] text-gold/40 ${bodyFont}`}
                  >
                    {language === "am"
                      ? "መልዕክቱን በማምጣት ላይ..."
                      : language === "ar"
                      ? "جاري جلب الحكمة..."
                      : "Fetching Divine Wisdom..."}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-12"
                >
                  <div className="flex justify-center">
                    <Badge
                      className={`bg-gold/10 text-gold border-gold/20 px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] ${bodyFont}`}
                    >
                      {language === "am"
                        ? `የዕለቱ ${message?.type === "Ayah" ? "ቁርዓን" : "ሀዲስ"}`
                        : language === "ar"
                        ? `${message?.type === "Ayah" ? "آية" : "حديث"} اليوم`
                        : `Daily ${message?.type}`}
                    </Badge>
                  </div>

                  {/* Arabic Text */}
                  <h2
                    className="text-4xl md:text-6xl text-white leading-[1.8] font-arabic drop-shadow-[0_10px_30px_rgba(212,175,55,0.1)]"
                    dir="rtl"
                  >
                    {message?.arabic}
                  </h2>

                  {/* Translation */}
                  <div className="space-y-8 relative">
                    <div className="h-px w-20 bg-gradient-to-r from-transparent via-gold/40 to-transparent mx-auto" />
                    <p
                      className={`text-xl md:text-3xl font-medium text-white/90 leading-relaxed italic ${bodyFont}`}
                    >
                      "{message?.text}"
                    </p>
                    <div
                      className={`flex items-center justify-center gap-4 ${
                        dir === "rtl" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div className="h-px w-8 bg-gold/20" />
                      <p
                        className={`text-gold font-black uppercase tracking-widest text-xs italic ${bodyFont}`}
                      >
                        {message?.reference}
                      </p>
                      <div className="h-px w-8 bg-gold/20" />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div
                    className={`pt-10 flex flex-wrap items-center justify-center gap-5 ${
                      dir === "rtl" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Button
                      variant="outline"
                      className="h-14 border-white/10 bg-white/[0.03] text-white hover:bg-white/10 rounded-2xl px-8 transition-all"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <CheckCircle2
                          className={`${
                            dir === "rtl" ? "ml-3" : "mr-3"
                          } h-5 w-5 text-green-400`}
                        />
                      ) : (
                        <Copy
                          className={`${
                            dir === "rtl" ? "ml-3" : "mr-3"
                          } h-5 w-5 text-gold`}
                        />
                      )}
                      <span
                        className={`uppercase text-[11px] font-black tracking-widest ${bodyFont}`}
                      >
                        {copied
                          ? language === "am"
                            ? "ኮፒ ሆኗል"
                            : language === "ar"
                            ? "تم النسخ"
                            : "Copied"
                          : language === "am"
                          ? "ኮፒ"
                          : language === "ar"
                          ? "نسخ"
                          : "Copy"}
                      </span>
                    </Button>

                    <Button
                      className={`h-14 bg-gold hover:bg-white text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl px-10 shadow-2xl shadow-gold/20 transition-all active:scale-95 group ${bodyFont}`}
                      onClick={handleShare}
                    >
                      <Share2
                        className={`${
                          dir === "rtl" ? "ml-3" : "mr-3"
                        } h-5 w-5 group-hover:rotate-12 transition-transform`}
                      />
                      {language === "am"
                        ? "አጋራ"
                        : language === "ar"
                        ? "مشاركة الحكمة"
                        : "Share Wisdom"}
                    </Button>

                    <Button
                      variant="ghost"
                      className="h-14 w-14 p-0 rounded-2xl text-white/20 hover:text-gold hover:bg-gold/5 transition-all"
                      onClick={fetchDailyMessage}
                      disabled={loading}
                    >
                      <RefreshCw
                        className={`h-6 w-6 ${loading ? "animate-spin" : ""}`}
                      />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Brand Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-4 opacity-20">
            <div className="h-px w-12 bg-gold" />
            <Sparkles size={16} className="text-gold" />
            <div className="h-px w-12 bg-gold" />
          </div>
          <p
            className={`text-[10px] font-black uppercase tracking-[0.5em] text-white/30 ${bodyFont}`}
          >
            {language === "am"
              ? "ሩሃማ ኢስላሚክ ሴንተር • የዕውቀት ብርሃን"
              : language === "ar"
              ? "مركز روهاما الإسلامي • نور العلم"
              : "Ruhama Islamic Center • Light of Knowledge"}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
