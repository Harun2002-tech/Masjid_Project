import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/auth-context";
import { useLanguage } from "../../contexts/language-context";

import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  Clock,
  BookOpen,
  Bell,
  ArrowRight,
  MapPin,
  Loader2,
  LogOut,
  CalendarDays,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, t, dir } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyMessage, setDailyMessage] = useState(null);
  const [msgLoading, setMsgLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setMsgLoading(true);
        // ማሳሰቢያ፡ የ API URL እንደ አስፈላጊነቱ ይቀይሩ
        const res = await axios.get(
          "http://https://masjid-project.onrender.com/api/messages/random"
        );
        setDailyMessage(res.data.data || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setMsgLoading(false);
      }
    };
    if (isAuthenticated) fetchMessage();
  }, [isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // ቋንቋ ተኮር ፎንቶች
  const titleFont =
    language === "am"
      ? "font-amharic"
      : language === "ar"
      ? "font-serif"
      : "font-serif italic";

  return (
    <div
      dir={dir}
      className={`min-h-screen text-white py-10 pt-28 px-4 md:px-8 max-w-7xl mx-auto relative ${
        language === "am" ? "font-amharic" : ""
      }`}
    >
      {/* --- HEADER SECTION --- */}
      <header
        className={`mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 ${
          dir === "rtl" ? "md:flex-row-reverse" : ""
        }`}
      >
        <motion.div
          initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={dir === "rtl" ? "text-right" : "text-left"}
        >
          <div
            className={`flex items-center gap-3 mb-2 ${
              dir === "rtl" ? "flex-row-reverse" : ""
            }`}
          >
            <div className="h-1 w-8 bg-gold rounded-full shadow-[0_0_10px_#fbbf24]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/60">
              {language === "am"
                ? "የተማሪዎች ፖርታል"
                : language === "ar"
                ? "بوابة الطلاب"
                : "Student Portal"}
            </span>
          </div>
          <h1 className={`text-4xl md:text-6xl font-bold ${titleFont}`}>
            {language === "am"
              ? `ሰላም፣ ${user?.name?.split(" ")[0]}`
              : language === "ar"
              ? `مرحباً، ${user?.name?.split(" ")[0]}`
              : `Welcome, ${user?.name?.split(" ")[0]}`}
            <span className="text-gold-glow">.</span>
          </h1>
        </motion.div>

        <div
          className={`glass p-2 rounded-[2rem] flex items-center gap-4 border-white/5 shadow-2xl ${
            dir === "rtl" ? "flex-row-reverse" : ""
          }`}
        >
          <div
            className={`px-6 py-2 border-white/10 ${
              dir === "rtl" ? "border-l text-left" : "border-r text-right"
            }`}
          >
            <p className="text-2xl font-black font-mono text-gold-glow">
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p
              className={`text-[9px] text-white/40 uppercase font-bold tracking-widest mt-1 flex items-center gap-1 ${
                dir === "rtl" ? "justify-start" : "justify-end"
              }`}
            >
              <MapPin className="h-2 w-2 text-red" /> Addis Ababa
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/5 text-white/60 hover:text-gold relative group"
          >
            <Bell className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red rounded-full border-2 border-[#0b1220]" />
          </Button>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* --- LEFT COLUMN --- */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Daily Message Card */}
            <Card className="glass border-none rounded-[3rem] overflow-hidden min-h-[350px] flex flex-col group relative">
              <div className="absolute -top-10 -right-10 opacity-[0.05] text-gold group-hover:scale-110 transition-transform duration-700">
                <Sparkles size={200} />
              </div>
              <CardContent className="p-10 relative z-10 flex flex-col h-full">
                <AnimatePresence mode="wait">
                  {msgLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <Loader2 className="animate-spin text-gold" />
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6 flex-1 flex flex-col"
                    >
                      <Badge className="bg-gold text-black font-black uppercase text-[9px] px-4 py-1.5 border-none w-fit shadow-lg shadow-gold/20">
                        {language === "am" ? "የዕለቱ መልዕክት" : "Daily Message"}
                      </Badge>

                      <h2
                        className="text-3xl font-serif leading-relaxed text-white text-right italic"
                        dir="rtl"
                      >
                        {dailyMessage?.arabic ||
                          "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ"}
                      </h2>

                      <p className="text-lg text-white/70 italic leading-relaxed flex-1">
                        "
                        {language === "am"
                          ? dailyMessage?.amharic
                          : dailyMessage?.text}
                        "
                      </p>

                      <div
                        className={`flex items-center justify-between pt-4 border-t border-white/5 ${
                          dir === "rtl" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span className="text-[10px] text-gold font-black uppercase tracking-widest">
                          — {dailyMessage?.reference}
                        </span>
                        <Link
                          to="/daily-message"
                          className="text-white/20 hover:text-gold transition-colors"
                        >
                          <ChevronRight
                            className={dir === "rtl" ? "rotate-180" : ""}
                            size={20}
                          />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Prayer Card */}
            <Card className="bg-gradient-to-br from-[#0f172a] to-[#0b1220] border border-white/5 rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div
                className={`absolute -bottom-10 ${
                  dir === "rtl" ? "-left-10" : "-right-10"
                } text-white/[0.02] rotate-12 group-hover:rotate-0 transition-transform duration-1000`}
              >
                <Clock size={220} />
              </div>
              <div className={dir === "rtl" ? "text-right" : "text-left"}>
                <h3 className="text-gold/40 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                  {language === "am" ? "ቀጣይ ሶላት" : "Next Prayer"}
                </h3>
                <div className="space-y-2">
                  <span
                    className={`text-6xl font-bold text-white tracking-tighter block ${titleFont}`}
                  >
                    {language === "am" ? "ዙሁር" : "Dhuhr"}
                  </span>
                  <p className="text-gold-glow font-mono font-black text-2xl">
                    12:30 PM
                  </p>
                </div>
              </div>
              <div className="mt-12 space-y-4 relative z-10">
                <div
                  className={`flex justify-between text-[10px] font-black uppercase text-white/30 ${
                    dir === "rtl" ? "flex-row-reverse" : ""
                  }`}
                >
                  <span>{language === "am" ? "የቀረው ጊዜ" : "Remaining"}</span>
                  <span className="text-gold">45 min</span>
                </div>
                <Progress value={65} className="h-1.5 bg-white/5" />
              </div>
            </Card>
          </div>

          {/* Library Banner Card */}
          <Card className="glass border-white/5 rounded-[3rem] p-10 group relative overflow-hidden transition-all hover:bg-white/[0.06]">
            <div
              className={`absolute ${
                dir === "rtl" ? "-left-10" : "-right-10"
              } top-1/2 -translate-y-1/2 opacity-[0.03] group-hover:opacity-[0.08] transition-all`}
            >
              <BookOpen size={250} />
            </div>
            <div
              className={`flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 ${
                dir === "rtl" ? "md:flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex items-center gap-8 flex-col md:flex-row text-center ${
                  dir === "rtl" ? "md:text-right" : "md:text-left"
                }`}
              >
                <div className="bg-gold/10 h-20 w-20 flex items-center justify-center rounded-3xl group-hover:scale-110 transition-transform shadow-inner">
                  <BookOpen className="text-gold h-10 w-10" />
                </div>
                <div>
                  <h2 className={`text-3xl font-bold text-white ${titleFont}`}>
                    {language === "am"
                      ? "የሼክ ሙሀመድ ጁድ ኪታቦች"
                      : "Sheikh Mohammed Jid's Library"}
                  </h2>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                    {language === "am"
                      ? "ዲጂታል ቤተ-መጽሐፍት • በድምፅና በጽሑፍ"
                      : "Digital Library • Audio & Text"}
                  </p>
                </div>
              </div>
              <Link to="/library">
                <Button className="btn-gold rounded-2xl px-12 py-8 font-black text-[11px] uppercase tracking-widest flex items-center gap-3">
                  {language === "am" ? "ቤተ-መጽሐፍት" : "Library"}
                  <ArrowRight
                    size={16}
                    className={dir === "rtl" ? "rotate-180" : ""}
                  />
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* --- RIGHT COLUMN (SIDEBAR) --- */}
        <div className="lg:col-span-4 space-y-8">
          {/* Profile Card */}
          <Card className="glass border-white/5 rounded-[3.5rem] p-10 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
            <div className="relative inline-block mb-6">
              <div className="h-28 w-28 rounded-[2.5rem] bg-gradient-to-tr from-gold/20 to-transparent p-[1px]">
                <div className="w-full h-full rounded-[2.5rem] bg-[#0b1220] flex items-center justify-center text-4xl font-bold text-gold-glow">
                  {user?.name?.charAt(0)}
                </div>
              </div>
            </div>
            <h3 className={`text-2xl font-bold text-white mb-1 ${titleFont}`}>
              {user?.name}
            </h3>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-10">
              {user?.email}
            </p>

            <Button
              onClick={logout}
              variant="ghost"
              className="w-full h-14 rounded-2xl text-red hover:bg-red/5 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <LogOut size={16} /> {language === "am" ? "ውጣ" : "Logout"}
            </Button>
          </Card>

          {/* Events Sidebar */}
          <Card className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8">
            <div
              className={`flex items-center justify-between mb-8 ${
                dir === "rtl" ? "flex-row-reverse" : ""
              }`}
            >
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/60 flex items-center gap-2">
                <CalendarDays size={16} />{" "}
                {language === "am" ? "መጪ ዝግጅቶች" : "Upcoming Events"}
              </h3>
            </div>
            <div className="space-y-6 text-left">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className={`flex items-center gap-5 group cursor-pointer ${
                    dir === "rtl" ? "flex-row-reverse text-right" : ""
                  }`}
                >
                  <div className="h-14 w-14 rounded-2xl bg-white/5 flex flex-col items-center justify-center group-hover:bg-gold transition-all duration-500 shrink-0">
                    <span className="text-lg font-black text-white group-hover:text-black">
                      1{i}
                    </span>
                    <span className="text-[8px] font-bold text-white/30 group-hover:text-black/60 uppercase">
                      APR
                    </span>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-white/80 uppercase group-hover:text-gold transition-colors">
                      {language === "am" ? "የኪታብ ቂርአት" : "Kitab Recitation"}
                    </h4>
                    <p className="text-[9px] text-white/20 font-bold mt-1 flex items-center gap-1">
                      <Clock size={10} /> 09:00 PM
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-8 text-[9px] font-black uppercase text-white/20 hover:text-gold tracking-[0.3em]"
            >
              {language === "am" ? "ሁሉንም ተመልከት" : "View All"}
            </Button>
          </Card>
        </div>
      </div>

      {/* Footer Decoration */}
      <footer className="mt-20 py-10 border-t border-white/5 text-center opacity-20">
        <p className="text-[9px] font-black uppercase tracking-[0.8em]">
          RUHAMA ISLAMIC CENTER
        </p>
      </footer>
    </div>
  );
}
