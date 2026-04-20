import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
  Send as Telegram,
  Sparkles,
  Heart,
} from "lucide-react";

// ያንተ ሎጎ እዚህ ጋር ገብቷል
import LogoImg from "../../assets/logo.jpg";

export default function Footer() {
  const { t } = useLanguage();
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
    const timer = setTimeout(renderYouTubeButton, 1000);
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
        alert(t("subscribeSuccess") || "በተሳካ ሁኔታ ተመዝግበዋል!");
        setEmail("");
      }
    } catch (error) {
      alert(error.response?.data?.message || "የኔትወርክ ስህተት ተከስቷል!");
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { href: "/about", label: t("about") || "About Us" },
    { href: "/courses", label: t("courses") || "Courses" },
    { href: "/prayer-times", label: t("prayerTimes") || "Prayer Times" },
    { href: "/library", label: t("library") || "Library" },
  ];

  const socialLinks = [
    {
      href: "https://facebook.com/RuhamaCenter",
      icon: Facebook,
      label: "Facebook",
    },
    { href: "https://t.me/afkhfcje7", icon: Telegram, label: "Telegram" },
    {
      href: "https://instagram.com/RuhamaCenter",
      icon: Instagram,
      label: "Instagram",
    },
    {
      href: "http://www.youtube.com/@RuhamaIslamaiccenter",
      icon: Youtube,
      label: "YouTube",
    },
  ];

  return (
    <footer className="relative bg-[#05080f] pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Mission - ሎጎው የተቀየረበት ክፍል */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              {/* ክብ ሎጎ ከወርቃማ መስመር ጋር */}
              <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-gold shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                <img
                  src={LogoImg}
                  alt="Ruhama Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-2xl font-bold uppercase tracking-tighter text-white">
                  RUHAMA <span className="text-gold">.</span>
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold/40">
                  Islamic Academy
                </p>
              </div>
            </div>
            <p className="text-sm text-white/40 leading-relaxed font-amharic italic">
              {t("footerAbout") ||
                "ጥራት ያለው ኢስላማዊ ትምህርት ለመስጠት እና ጠንካራ ማህበረሰብ ለመገንባት የተቆረቆረ።"}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center rounded-xl glass border border-white/5 text-white/40 transition-all hover:bg-gold hover:text-black hover:scale-110"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="mb-8 text-[11px] font-bold uppercase tracking-[0.3em] text-gold underline underline-offset-[12px] decoration-gold/20">
              {t("quickLinks") || "ፈጣን ሊንኮች"}
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/30 hover:text-gold transition-all flex items-center gap-2 group font-amharic"
                  >
                    <div className="h-1 w-0 bg-gold transition-all group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="mb-8 text-[11px] font-bold uppercase tracking-[0.3em] text-gold underline underline-offset-[12px] decoration-gold/20">
              {t("contactUs") || "ያግኙን"}
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg glass border border-white/5 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-gold" />
                </div>
                <span className="text-xs text-white/50 font-amharic leading-loose pt-1">
                  {currentMasjid?.address || "ኮምቦልቻ፣ አማራ፣ ኢትዮጵያ"}
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg glass border border-white/5 flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-gold" />
                </div>
                <span className="text-xs text-white/50 font-sans tracking-widest">
                  {currentMasjid?.contactPhone || "+251 936 291 283"}
                </span>
              </li>
            </ul>
          </div>

          {/* Engagement Section */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-[2rem] border border-white/5 shadow-2xl">
              <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-2">
                <Sparkles size={14} className="animate-pulse" />
                NEWSLETTER
              </h3>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ኢሜል ያስገቡ"
                  className="payment-input w-full h-12 rounded-xl text-xs px-4 pr-12 outline-none font-amharic bg-white/5 text-white"
                  required
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 h-9 w-9 bg-gold text-black hover:bg-white transition-all rounded-lg flex items-center justify-center disabled:opacity-50"
                  disabled={loading}
                >
                  <Send
                    className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
              </form>
            </div>

            <div className="glass p-5 rounded-[2rem] border border-white/5 flex flex-col items-center gap-4 shadow-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                SUBSCRIBE ON YOUTUBE
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
            &copy; {new Date().getFullYear()} RUHAMA ACADEMY. PRESERVED FOR THE
            UMMAH.
          </p>
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
            <span>DEVELOPED WITH</span>
            <Heart
              size={12}
              className="text-red-500 animate-pulse fill-red-500"
            />
            <span>FOR THE SAKE OF ALLAH</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
