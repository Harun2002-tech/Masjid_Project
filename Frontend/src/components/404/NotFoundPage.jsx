import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Home, ArrowLeft, Compass, SearchX } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/language-context";

export default function NotFoundPage() {
  const { t, dir, language } = useLanguage();

  // ቋንቋን መሰረት ያደረጉ ፎንቶች
  const titleFont =
    language === "am"
      ? "font-amharic"
      : language === "ar"
      ? "font-arabic"
      : "font-display italic";

  const bodyFont = language === "am" ? "font-amharic" : "font-sans";

  // ለትርጉም አማራጭ (Translation fallback)
  const content = {
    am: {
      title: "መንገድዎ ጠፋብዎት",
      desc: "የፈለጉት ገጽ ሊገኝ አልቻለም። ምናልባት አድራሻው ተቀይሮ ወይም ተሰርዞ ሊሆን ይችላል።",
      homeBtn: "ወደ ዋናው ገጽ",
      backBtn: "ወደ ኋላ",
    },
    ar: {
      title: "هل ضللت الطريق؟",
      desc: "الصفحة التي تبحث عنها غير موجودة. ربما تم نقلها أو حذفها.",
      homeBtn: "الرئيسية",
      backBtn: "العودة",
    },
    en: {
      title: "Are you lost?",
      desc: "The page you are looking for has vanished or never existed in the first place.",
      homeBtn: "Back Home",
      backBtn: "Go Back",
    },
  };

  const currentContent = content[language] || content.en;

  return (
    <div
      dir={dir}
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
    >
      {/* Background Decor - ከ index.css Gradient ጋር የሚዋሃድ */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Compass
          className={`absolute -top-20 ${
            dir === "rtl" ? "-left-20" : "-right-20"
          } w-96 h-96 text-gold opacity-[0.03] rotate-12`}
        />
      </div>

      <div className="text-center relative z-10 max-w-2xl w-full">
        {/* 404 Large Number - በ index.css body ላይ ደብዛዛ ሆኖ እንዲታይ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mb-8"
        >
          <h1 className="text-[12rem] md:text-[18rem] font-black text-white/[0.03] leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <SearchX
              className="text-gold/20 w-24 h-24 md:w-32 md:h-32"
              strokeWidth={1}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="-mt-16 md:-mt-24"
        >
          {/* Main Title - text-gold-glow ክላስን ይጠቀማል */}
          <h2
            className={`text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight ${titleFont}`}
          >
            {currentContent.title}
            <span className="text-gold-glow mx-1">?</span>
          </h2>

          {/* Description */}
          <p
            className={`text-white/50 mt-4 max-w-md mx-auto font-medium text-lg md:text-xl leading-relaxed italic ${bodyFont}`}
          >
            {currentContent.desc}
          </p>

          {/* Action Buttons - በ index.css ውስጥ ያሉትን .btn-gold እና .glass ይጠቀማል */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16">
            <Button
              asChild
              className="btn-gold rounded-2xl px-12 py-8 font-black uppercase text-[10px] tracking-[0.2em] group"
            >
              <Link to="/" className="flex items-center">
                <Home
                  className={`${dir === "rtl" ? "ml-4" : "mr-4"} h-5 w-5`}
                />
                {currentContent.homeBtn}
              </Link>
            </Button>

            <Button
              variant="outline"
              className="glass border-white/5 text-white hover:bg-white hover:text-black rounded-2xl px-12 py-8 font-black uppercase text-[10px] tracking-[0.2em] transition-all"
              onClick={() => window.history.back()}
            >
              <ArrowLeft
                className={`${
                  dir === "rtl" ? "ml-4 rotate-180" : "mr-4"
                } h-5 w-5`}
              />
              {currentContent.backBtn}
            </Button>
          </div>
        </motion.div>

        {/* Bottom Flourish */}
        <div className="mt-24 flex items-center justify-center opacity-20">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-gold" />
          <div className="mx-6 text-gold text-sm tracking-[0.5em] font-light uppercase">
            Ruhama
          </div>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-gold" />
        </div>
      </div>
    </div>
  );
}
