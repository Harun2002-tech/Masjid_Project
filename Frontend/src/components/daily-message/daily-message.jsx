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
} from "lucide-react";

export default function DailyMessagePage() {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { language, dir } = useLanguage();

  const API = import.meta.env.VITE_API_URL;

  const fetchDailyMessage = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API}/api/messages/random`
      );

      // ከ backend የመጣው መዋቅር { success: true, data: {...} } ስለሆነ
      if (response.data && response.data.data) {
        setMessage(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching message:", error);
      // Error ሲፈጠር default መልእክት
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
          title: "Daily Message",
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

  const bodyFont = language === "am" ? "font-amharic" : "font-sans";

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[#05080f] py-20 px-4 relative flex items-center justify-center overflow-hidden"
    >
      {/* Cinematic Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[150px] -z-0 animate-pulse" />

      <div className="max-w-3xl w-full relative z-10">
        <Link
          to="/dashboard"
          className="text-white/40 hover:text-gold flex items-center gap-3 mb-10 transition-all w-fit"
        >
          {dir === "rtl" ? (
            <ArrowRight className="h-4 w-4" />
          ) : (
            <ArrowLeft className="h-4 w-4" />
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

        <Card className="bg-white/[0.02] border-white/10 shadow-2xl rounded-[4rem] backdrop-blur-3xl">
          <CardContent className="p-10 md:p-20 text-center">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-20"
                >
                  <Loader2 className="h-16 w-16 text-gold animate-spin mx-auto" />
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-12"
                >
                  <Badge className="bg-gold/10 text-gold border-gold/20 px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                    {language === "am"
                      ? `የዕለቱ ${message?.type === "Ayah" ? "ቁርዓን" : "ሀዲስ"}`
                      : `Daily ${message?.type}`}
                  </Badge>

                  {message?.image && (
                    <div className="flex justify-center">
                      <img
                        src={message.image}
                        alt="Message"
                        className="w-full max-w-md rounded-3xl border border-white/10 shadow-2xl object-cover"
                      />
                    </div>
                  )}

                  <h2
                    className="text-4xl md:text-6xl text-white leading-[1.8] font-arabic"
                    dir="rtl"
                  >
                    {message?.arabic}
                  </h2>

                  <p className="text-xl md:text-3xl font-medium text-white/90 italic">
                    "{message?.text}"
                  </p>

                  <p className="text-gold font-black uppercase tracking-widest text-xs">
                    {message?.reference}
                  </p>

                  <div className="pt-10 flex justify-center gap-5">
                    <Button
                      variant="outline"
                      className="h-14 rounded-2xl"
                      onClick={handleCopy}
                    >
                      <Copy className="mr-2 h-5 w-5 text-gold" />{" "}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button
                      className="h-14 bg-gold text-black rounded-2xl"
                      onClick={handleShare}
                    >
                      <Share2 className="mr-2 h-5 w-5" /> Share
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-14 w-14 rounded-2xl"
                      onClick={fetchDailyMessage}
                    >
                      <RefreshCw className="h-6 w-6" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
