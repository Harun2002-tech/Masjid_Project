import React, { useState, useEffect } from "react";
import { useMasjid } from "../../../contexts/masjid-context";
import { useLanguage } from "../../../contexts/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Calendar,
  Sparkles,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function UpdatePrayertimes() {
  const { currentMasjid, setCurrentMasjid } = useMasjid();
  const { language, dir } = useLanguage();

  const [manualTimes, setManualTimes] = useState({
    Fajr: "",
    Sunrise: "",
    Dhuhr: "",
    Asr: "",
    Maghrib: "",
    Isha: "",
  });

  const [iqamahOffsets, setIqamahOffsets] = useState({
    Fajr: 20,
    Dhuhr: 15,
    Asr: 15,
    Maghrib: 5,
    Isha: 15,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const content = {
    am: {
      back: "ወደ ሰሌዳው ተመለስ",
      title: "የሰዓት ማስተካከያ",
      subtitle: "የአሁኑን ሰዓት እዚህ ጋር ያገኛሉ። ለማስተካከል ሰዓቱን ይቀይሩና ያስቀምጡ።",
      prayer: "የሶላት ወቅት",
      azan: "የአዛን ሰዓት",
      iqamah: "ኢቃማ (ደቂቃ)",
      prev: "ያለፈው",
      prevMin: "የነበረው",
      loading: "መረጃ እየተጫነ ነው...",
      save: "ለውጦችን በቋሚነት አዝምን",
      saving: "በማስቀመጥ ላይ...",
      success: "ሁሉም የሰዓት ለውጦች በትክክል ተቀምጠዋል!",
    },
    en: {
      back: "Back to Dashboard",
      title: "Prayer Settings",
      subtitle: "Update Adhan and Iqamah times for your Masjid.",
      prayer: "Prayer",
      azan: "Adhan Time",
      iqamah: "Iqamah (Min)",
      prev: "Previous",
      prevMin: "Was",
      loading: "Loading...",
      save: "Update Changes",
      saving: "Saving...",
      success: "Updated successfully!",
    },
    ar: {
      back: "العودة للوحة التحکم",
      title: "تعديل الأوقات",
      subtitle: "قم بتحديث أوقات الأذان والإقامة للمسجد.",
      prayer: "الصلاة",
      azan: "وقت الأذان",
      iqamah: "الإقامة",
      prev: "السابق",
      prevMin: "كان",
      loading: "جار التحميل...",
      save: "حفظ التغييرات",
      saving: "جار الحفظ...",
      success: "تم التحديث بنجاح!",
    },
  };

  const t = content[language] || content.en;

  useEffect(() => {
    if (currentMasjid) {
      if (currentMasjid.manualTimes)
        setManualTimes((prev) => ({ ...prev, ...currentMasjid.manualTimes }));
      if (currentMasjid.iqamahOffsets)
        setIqamahOffsets((prev) => ({
          ...prev,
          ...currentMasjid.iqamahOffsets,
        }));
    }
  }, [currentMasjid]);

  const handleSave = async () => {
    if (!currentMasjid?._id) return;
    setIsSaving(true);
    setStatus({ type: "", message: "" });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/masjids/${currentMasjid._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ manualTimes, iqamahOffsets }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setStatus({ type: "success", message: t.success });
        setCurrentMasjid(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatus({ type: "", message: "" }), 4000);
    }
  };

  if (!currentMasjid)
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-gold" />
      </div>
    );

  const prayerList = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

  return (
    <div dir={dir} className="min-h-screen py-20 px-4 md:px-10 text-white">
      <div className="mx-auto max-w-5xl space-y-8 relative z-10">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex justify-between items-center ${
            dir === "rtl" ? "flex-row-reverse" : ""
          }`}
        >
          <Link
            to="/prayer-times"
            className="flex items-center gap-2 text-white/40 hover:text-gold transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
          >
            {dir === "rtl" ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}{" "}
            {t.back}
          </Link>
          <div className="glass px-6 py-2 rounded-full border-gold/20 flex items-center gap-2">
            <Sparkles size={14} className="text-gold animate-pulse" />
            <span className="text-xs font-bold text-gold-glow uppercase tracking-widest">
              {currentMasjid.name}
            </span>
          </div>
        </motion.div>

        <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 md:p-12 border-b border-white/5 bg-white/[0.01]">
            <div
              className={`flex items-center gap-6 ${
                dir === "rtl" ? "flex-row-reverse" : ""
              }`}
            >
              <div className="w-16 h-16 bg-gold/10 rounded-3xl flex items-center justify-center text-gold border border-gold/20 shadow-[0_0_30px_rgba(251,191,36,0.1)]">
                <Clock size={32} />
              </div>
              <div className={dir === "rtl" ? "text-right" : "text-left"}>
                <CardTitle className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                  {t.title.split(" ")[0]}{" "}
                  <span className="text-gold-glow italic">
                    {t.title.split(" ").slice(1).join(" ")}
                  </span>
                </CardTitle>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                  {t.subtitle}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 md:p-12 space-y-4">
            {/* Header Row */}
            <div
              className={`hidden md:grid grid-cols-12 gap-6 px-8 mb-4 text-[9px] font-black uppercase text-white/20 tracking-[0.3em] ${
                dir === "rtl" ? "flex-row-reverse" : ""
              }`}
            >
              <div className="col-span-4">{t.prayer}</div>
              <div className="col-span-4 text-center">{t.azan}</div>
              <div className="col-span-4 text-center">{t.iqamah}</div>
            </div>

            {prayerList.map((prayer, index) => (
              <motion.div
                key={prayer}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`grid grid-cols-1 md:grid-cols-12 items-center gap-4 p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-gold/20 transition-all group ${
                  dir === "rtl" ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Prayer Name */}
                <div
                  className={`col-span-4 flex items-center gap-4 ${
                    dir === "rtl" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-gold/40 group-hover:text-gold transition-colors font-black">
                    {prayer.charAt(0)}
                  </div>
                  <span className="text-lg font-bold tracking-tight text-white/80 group-hover:text-white">
                    {prayer}
                  </span>
                </div>

                {/* Adhan Input */}
                <div className="col-span-4 space-y-1.5">
                  <input
                    type="time"
                    value={manualTimes[prayer] || ""}
                    onChange={(e) =>
                      setManualTimes({
                        ...manualTimes,
                        [prayer]: e.target.value,
                      })
                    }
                    className="payment-input w-full rounded-2xl py-4 px-6 text-center font-bold text-white outline-none"
                  />
                  <p className="text-[8px] text-center font-black text-white/10 uppercase tracking-widest group-hover:text-white/20">
                    {t.prev}:{" "}
                    <span className="text-gold/40">
                      {currentMasjid?.manualTimes?.[prayer] || "--:--"}
                    </span>
                  </p>
                </div>

                {/* Iqamah Input */}
                <div className="col-span-4 space-y-1.5">
                  {prayer !== "Sunrise" ? (
                    <>
                      <div className="relative">
                        <input
                          type="number"
                          value={iqamahOffsets[prayer] || 0}
                          onChange={(e) =>
                            setIqamahOffsets({
                              ...iqamahOffsets,
                              [prayer]: parseInt(e.target.value) || 0,
                            })
                          }
                          className="payment-input w-full rounded-2xl py-4 text-center font-bold text-gold outline-none"
                        />
                        <span
                          className={`absolute ${
                            dir === "rtl" ? "left-5" : "right-5"
                          } top-1/2 -translate-y-1/2 text-[8px] font-black text-white/10 uppercase`}
                        >
                          MIN
                        </span>
                      </div>
                      <p className="text-[8px] text-center font-black text-white/10 uppercase tracking-widest group-hover:text-white/20">
                        {t.prevMin}:{" "}
                        <span className="text-gold/40">
                          {currentMasjid?.iqamahOffsets?.[prayer] || 0}m
                        </span>
                      </p>
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center opacity-10 font-black text-[10px]">
                      N/A
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Status & Save Button */}
            <div className="pt-8 space-y-6">
              <AnimatePresence>
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={`p-5 rounded-2xl flex items-center gap-3 border ${
                      status.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}
                  >
                    {status.type === "success" ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}
                    <p className="text-xs font-bold uppercase tracking-wider">
                      {status.message}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-gold w-full flex items-center justify-center gap-3 py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] disabled:opacity-50 disabled:transform-none"
              >
                {isSaving ? (
                  <RefreshCw className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                <span>{isSaving ? t.saving : t.save}</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper Loader
function Loader2({ className }) {
  return <RefreshCw className={className} />;
}
