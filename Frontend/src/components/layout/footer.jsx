import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../../contexts/language-context";
import { useMasjid } from "../../contexts/masjid-context";
import {
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Youtube,
  Send,
  Sparkles,
  Send as Telegram,
} from "lucide-react";

import LogoImg from "../../assets/logo.jpg";

// TikTok icon custom SVG
const TikTokIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Footer() {
  const { language, dir, t } = useLanguage();
  const { currentMasjid } = useMasjid();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const renderYouTubeButton = () => {
      if (window.gapi && window.gapi.ytsubscribe) {
        window.gapi.ytsubscribe.go();
      }
    };
    renderYouTubeButton();
    const timer = setTimeout(renderYouTubeButton, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/newsletter/subscribe",
        { email }
      );
      if (response.data.success) {
        alert(
          t("subscribeSuccess") ||
            (language === "am"
              ? "በተሳካ ሁኔታ ተመዝግበዋል!"
              : language === "ar"
              ? "تم الاشتراك بنجاح!"
              : "Subscribed successfully!")
        );
        setEmail("");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          (language === "am" ? "የኔትወርክ ስህተት ተከስቷል!" : "Network error!")
      );
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    {
      href: "/about",
      label:
        t("about") ||
        (language === "am"
          ? "ስለ እኛ"
          : language === "ar"
          ? "من نحن"
          : "About Us"),
    },
    {
      href: "/courses",
      label:
        t("courses") ||
        (language === "am"
          ? "ትምህርቶች"
          : language === "ar"
          ? "الدورات"
          : "Courses"),
    },
    {
      href: "/prayer-times",
      label:
        language === "am"
          ? "የሶላት ወቅቶች"
          : language === "ar"
          ? "أوقات الصلاة"
          : "Prayer Times",
    },
    {
      href: "/library",
      label:
        t("library") ||
        (language === "am"
          ? "ቤተ-መጽሐፍት"
          : language === "ar"
          ? "المكتبة"
          : "Library"),
    },
    {
      href: "/donations",
      label:
        t("donations") ||
        (language === "am"
          ? "ልገሳ"
          : language === "ar"
          ? "التبرعات"
          : "Donations"),
    },
    {
      href: "/contact",
      label:
        t("contact") ||
        (language === "am"
          ? "ያግኙን"
          : language === "ar"
          ? "اتصل بنا"
          : "Contact Us"),
    },
  ];

  const socialLinks = [
    {
      href: "https://www.facebook.com/profile.php?id=61589009274959",
      icon: Facebook,
      label: "Facebook",
    },
    { href: "https://t.me/afkhfcje7", icon: Telegram, label: "Telegram" },
    {
      href: "https://www.instagram.com/ruhamamosque?igsh=MTM0eTlvMHc1Y2YxbQ==",
      icon: Instagram,
      label: "Instagram",
    },
    {
      href: "http://www.youtube.com/@RuhamaIslamaiccenter",
      icon: Youtube,
      label: "YouTube",
    },
    {
      href: "https://www.tiktok.com/@ruhama.islamic.c?_r=1&_t=ZS-95uOrDELSS4",
      icon: TikTokIcon,
      label: "TikTok",
    },
  ];

  // Font setup based on language
  const amharicFont = language === "am" ? "font-amharic" : "";
  const arabicFont = language === "ar" ? "font-amiri" : "";

  return (
    <footer
      className="relative bg-[#05080f] pt-24 pb-12 overflow-hidden border-t border-white/5"
      dir={dir}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Mission */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                <img
                  src={LogoImg}
                  alt="Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-2xl font-bold uppercase tracking-tighter text-white">
                  RUHAMA <span className="text-[#D4AF37]">.</span>
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37]/40">
                  {language === "ar" ? "أكاديمية إسلامية" : "Islamic Academy"}
                </p>
              </div>
            </div>
            <p
              className={`text-sm text-white/40 leading-relaxed italic ${amharicFont} ${arabicFont}`}
            >
              {t("footerAbout") ||
                (language === "am"
                  ? "ጥራት ያለው ኢስላማዊ ትምህርት ለመስጠት እና ጠንካራ ማህበረሰብ ለመገንባት የተቆረቆረ።"
                  : language === "ar"
                  ? "مكرسة لتقديم تعليم إسلامي عالي الجودة وبناء مجتمع قوي."
                  : "Dedicated to providing quality Islamic education and building a strong community.")}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-white/40 transition-all hover:bg-[#D4AF37] hover:text-black hover:scale-110"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3
              className={`mb-8 text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] underline underline-offset-[12px] decoration-[#D4AF37]/20 ${amharicFont} ${arabicFont}`}
            >
              {t("quickLinks") ||
                (language === "am"
                  ? "ፈጣን ሊንኮች"
                  : language === "ar"
                  ? "روابط سريعة"
                  : "Quick Links")}
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={`text-sm text-white/30 hover:text-[#D4AF37] transition-all flex items-center gap-2 group ${amharicFont} ${arabicFont}`}
                  >
                    <div className="h-1 w-0 bg-[#D4AF37] transition-all group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3
              className={`mb-8 text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] underline underline-offset-[12px] decoration-[#D4AF37]/20 ${amharicFont} ${arabicFont}`}
            >
              {t("contactUs") ||
                (language === "am"
                  ? "ያግኙን"
                  : language === "ar"
                  ? "اتصل بنا"
                  : "Contact Us")}
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-[#D4AF37]" />
                </div>
                <span
                  className={`text-xs text-white/50 leading-loose pt-1 ${amharicFont} ${arabicFont}`}
                >
                  {currentMasjid?.address ||
                    (language === "am"
                      ? "ኮምቦልቻ፣ አማራ፣ ኢትዮጵያ"
                      : language === "ar"
                      ? "كومبولتشا، أمهرة، إثيوبيا"
                      : "Kombolcha, Amhara, Ethiopia")}
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-[#D4AF37]" />
                </div>
                <span
                  className="text-xs text-white/50 tracking-widest"
                  dir="ltr"
                >
                  {currentMasjid?.contactPhone || "+251 936 291 283"}
                </span>
              </li>
            </ul>
          </div>

          {/* Engagement Section */}
          <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 shadow-2xl">
              <h3
                className={`mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-2 ${arabicFont}`}
              >
                <Sparkles size={14} className="animate-pulse" />
                {language === "am"
                  ? "ዝግጅት"
                  : language === "ar"
                  ? "النشرة الإخبارية"
                  : "NEWSLETTER"}
              </h3>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    language === "am"
                      ? "ኢሜል ያስገቡ"
                      : language === "ar"
                      ? "أدخل البريد الإلكتروني"
                      : "Enter Email"
                  }
                  className={`w-full h-12 rounded-xl text-xs px-4 outline-none bg-white/5 text-white border border-white/10 focus:border-[#D4AF37]/50 transition-all ${
                    dir === "rtl" ? "pr-4 pl-12" : "pr-12 pl-4"
                  } ${amharicFont} ${arabicFont}`}
                  required
                  disabled={loading}
                />
                <button
                  type="submit"
                  className={`absolute top-1.5 h-9 w-9 bg-[#D4AF37] text-black hover:bg-white transition-all rounded-lg flex items-center justify-center disabled:opacity-50 ${
                    dir === "rtl" ? "left-1.5" : "right-1.5"
                  }`}
                  disabled={loading}
                >
                  <Send
                    className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""} ${
                      dir === "rtl" ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </form>
            </div>

            <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5 flex flex-col items-center gap-4 shadow-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                {language === "ar"
                  ? "اشترك في اليوتيوب"
                  : "SUBSCRIBE ON YOUTUBE"}
              </p>
              <div className="min-h-[30px] grayscale hover:grayscale-0 transition-all duration-500">
                <div
                  className="g-ytsubscribe"
                  data-channelid="UC15SS8bvMr-Z8V_qVqeiTbg"
                  data-layout="default"
                  data-count="default"
                  data-theme="dark"
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
            &copy; {new Date().getFullYear()} RUHAMA ACADEMY.{" "}
            {language === "ar"
              ? "محفوظة للأمة الإسلامية"
              : "PRESERVED FOR THE UMMAH."}
          </p>
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
            <span>
              {language === "am"
                ? "የተገነባው በ"
                : language === "ar"
                ? "تم التطوير بواسطة"
                : "DEVELOPED BY"}
            </span>
            <span className="text-white/60">HARUN AHMED MOHAMMED</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
