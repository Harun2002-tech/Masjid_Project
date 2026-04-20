import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../../contexts/language-context";
import { useMasjid } from "../../contexts/masjid-context";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Clock,
  MapPin,
  RefreshCw,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Timer,
  Users,
} from "lucide-react";

import {
  fetchPrayerTimesFromBackend,
  formatPrayerTime,
  addMinutesToTime,
  getCurrentPrayer,
  getNextPrayer,
  getTimeUntilPrayer,
} from "../../lib/prayer-times";

// --- 🇪🇹 ቋሚና አስተማማኝ የኢትዮጵያ ቀን ቀመር (ያለ Package የሚሰራ) ---
const getEthiopianDate = () => {
  const now = new Date();
  const date = now.getTime();

  // በ ሚሊ ሰከንድ የተቀመጠ የዘመን መለወጫ ልዩነት
  const difference = date - new Date("1971-09-12").getTime();
  const fourYears = 1461 * 24 * 3600 * 1000;
  const oneYear = 365 * 24 * 3600 * 1000;

  const years =
    Math.floor(difference / fourYears) * 4 +
    Math.floor((difference % fourYears) / oneYear);
  const remainingDays = Math.floor(
    ((difference % fourYears) % oneYear) / (24 * 3600 * 1000)
  );

  const ethYear = years + 1964;
  const ethMonthIndex = Math.floor(remainingDays / 30);
  const ethDay = (remainingDays % 30) + 1;

  const ethMonths = [
    "መስከረም",
    "ጥቅምት",
    "ህዳር",
    "ታህሳስ",
    "ጥር",
    "የካቲት",
    "መጋቢት",
    "ሚያዝያ",
    "ግንቦት",
    "ሰኔ",
    "ሐምሌ",
    "ነሐሴ",
    "ጳጉሜ",
  ];

  return {
    day: ethDay,
    month: ethMonths[ethMonthIndex] || "መስከረም",
    year: ethYear,
  };
};

const prayerIcons = {
  Fajr: Moon,
  Sunrise: Sunrise,
  Dhuhr: Sun,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: Moon,
};

export default function PrayerTimesPage() {
  const { language, dir } = useLanguage();
  const { currentMasjid, isLoading: masjidLoading } = useMasjid();

  const [prayerData, setPrayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [use24Hour, setUse24Hour] = useState(false);

  const loadPrayerTimes = useCallback(async () => {
    if (!currentMasjid?._id) return;
    setLoading(true);
    try {
      const data = await fetchPrayerTimesFromBackend(currentMasjid._id);
      if (data) setPrayerData(data);
    } catch (error) {
      console.error("Failed to load prayers:", error);
    } finally {
      setLoading(false);
    }
  }, [currentMasjid?._id]);

  useEffect(() => {
    loadPrayerTimes();
  }, [loadPrayerTimes, currentMasjid]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const activeData = currentMasjid || prayerData;
  const currentPrayerName = activeData ? getCurrentPrayer(activeData) : null;
  const nextPrayer = activeData ? getNextPrayer(activeData) : null;
  const ethDate = getEthiopianDate();

  if (masjidLoading || (loading && !prayerData)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <RefreshCw className="h-10 w-10 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div dir={dir} className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div
          className={`mb-16 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-10 ${
            dir === "rtl" ? "md:flex-row-reverse" : ""
          }`}
        >
          <div className={dir === "rtl" ? "text-right" : "text-left"}>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
              {language === "am"
                ? "የሶላት ሰዓታት"
                : language === "ar"
                ? "مواقيت الصلاة"
                : "Prayer Times"}
              <span className="text-gold">.</span>
            </h1>
            <div
              className={`mt-4 flex items-center gap-3 text-gold-glow ${
                dir === "rtl" ? "flex-row-reverse" : ""
              }`}
            >
              <MapPin className="h-6 w-6" />
              <span className="text-2xl font-bold tracking-tight">
                {currentMasjid?.name}
              </span>
            </div>
          </div>
          <Badge className="glass px-6 py-2 rounded-2xl text-gold border-gold/20 text-lg tabular-nums">
            {language === "am"
              ? "ፀሐይ መውጫ፦ "
              : language === "ar"
              ? "شروق الشمس: "
              : "Sunrise: "}
            {currentMasjid?.manualTimes?.Sunrise ||
              prayerData?.timings?.Sunrise ||
              "--:--"}
          </Badge>
        </div>

        {/* Hero Card */}
        <div className="mb-16">
          <Card className="glass border-white/5 shadow-2xl overflow-hidden relative rounded-[3rem]">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
            <CardContent className="p-8 md:p-14 relative z-10">
              <div
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  dir === "rtl" ? "lg:text-right" : ""
                }`}
              >
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-2">
                      {language === "am" ? "የአሁኑ ሰዓት" : "Current Time"}
                    </p>
                    <p className="text-7xl md:text-9xl font-black tracking-tighter tabular-nums text-white leading-none">
                      {currentTime.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: !use24Hour,
                      })}
                    </p>
                  </div>

                  {nextPrayer && (
                    <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
                      <div className="p-4 bg-gold rounded-2xl text-[#0b1220]">
                        <Timer className="h-6 w-6 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gold/60">
                          {language === "am"
                            ? `ቀጣይ፡ ${nextPrayer.name}`
                            : `Next: ${nextPrayer.name}`}
                        </p>
                        <p className="text-3xl font-bold text-white italic">
                          {language === "am"
                            ? `በ ${getTimeUntilPrayer(nextPrayer.time)} ውስጥ`
                            : `in ${getTimeUntilPrayer(nextPrayer.time)}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] text-center group hover:border-gold/30 transition-colors">
                    <p className="text-[9px] font-black text-gold uppercase mb-2 tracking-[0.2em]">
                      Ethiopian
                    </p>
                    <p className="text-2xl font-black text-white">
                      {ethDate.day} {ethDate.month}
                    </p>
                    <p className="text-xs font-bold text-white/40 mt-1">
                      {ethDate.year} ዓ.ም
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] text-center group hover:border-gold/30 transition-colors">
                    <p className="text-[9px] font-black text-gold uppercase mb-2 tracking-[0.2em]">
                      Gregorian
                    </p>
                    <p className="text-2xl font-black text-white">
                      {currentTime.toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <p className="text-xs font-bold text-white/40 mt-1">
                      {currentTime.getFullYear()}
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] text-center group hover:border-gold/30 transition-colors">
                    <p className="text-[9px] font-black text-gold uppercase mb-2 tracking-[0.2em]">
                      Hijri
                    </p>
                    <p className="text-2xl font-black text-white">
                      {prayerData?.date?.hijri?.day || "01"}{" "}
                      {language === "ar"
                        ? prayerData?.date?.hijri?.month?.ar
                        : prayerData?.date?.hijri?.month?.en || "Ramadan"}
                    </p>
                    <p className="text-xs font-bold text-white/40 mt-1">
                      {prayerData?.date?.hijri?.year || "1447"} H.E.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prayer Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {prayers.map((prayer) => {
            const Icon = prayerIcons[prayer];
            const isCurrent = currentPrayerName === prayer;
            const azanTime =
              activeData?.manualTimes?.[prayer] ||
              prayerData?.timings?.[prayer]?.azan ||
              "--:--";
            const iqamahOffset = activeData?.iqamahOffsets?.[prayer] || 0;

            const prayerNames = {
              am: {
                Fajr: "ፈጅር",
                Dhuhr: "ዙሁር",
                Asr: "ዐስር",
                Maghrib: "መግሪብ",
                Isha: "ዒሻእ",
              },
              ar: {
                Fajr: "الفجر",
                Dhuhr: "الظهر",
                Asr: "العصر",
                Maghrib: "المغرب",
                Isha: "العشاء",
              },
            };

            return (
              <Card
                key={prayer}
                className={`glass rounded-[2.5rem] border-white/5 transition-all duration-500 overflow-hidden ${
                  isCurrent
                    ? "ring-2 ring-gold shadow-gold/20 scale-[1.02]"
                    : "hover:border-white/20"
                }`}
              >
                <CardContent className="p-0">
                  <div
                    className={`p-8 flex items-center justify-between ${
                      dir === "rtl" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex items-center gap-5 ${
                        dir === "rtl" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`p-5 rounded-2xl ${
                          isCurrent
                            ? "bg-gold text-[#0b1220]"
                            : "bg-white/5 text-gold border border-white/10"
                        }`}
                      >
                        <Icon className="h-8 w-8" />
                      </div>
                      <div
                        className={dir === "rtl" ? "text-right" : "text-left"}
                      >
                        <p
                          className={`text-2xl font-black uppercase tracking-tight ${
                            isCurrent ? "text-white" : "text-white/60"
                          }`}
                        >
                          {language === "am"
                            ? prayerNames.am[prayer]
                            : language === "ar"
                            ? prayerNames.ar[prayer]
                            : prayer}
                        </p>
                        <span className="text-[10px] font-black text-gold/40 tracking-[0.2em]">
                          AZAN
                        </span>
                      </div>
                    </div>
                    <p
                      className={`text-4xl font-black tabular-nums tracking-tighter ${
                        isCurrent ? "text-gold" : "text-white"
                      }`}
                    >
                      {formatPrayerTime(azanTime, use24Hour)}
                    </p>
                  </div>

                  <div
                    className={`px-8 py-6 flex justify-between items-center ${
                      isCurrent ? "bg-gold/10" : "bg-white/5"
                    } ${dir === "rtl" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex items-center gap-3 ${
                        dir === "rtl" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Users
                        size={18}
                        className={isCurrent ? "text-gold" : "text-white/20"}
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">
                        IQAMAH
                      </span>
                    </div>
                    <p
                      className={`text-2xl font-bold tabular-nums ${
                        isCurrent ? "text-white" : "text-white/40"
                      }`}
                    >
                      {formatPrayerTime(
                        addMinutesToTime(azanTime, iqamahOffset),
                        use24Hour
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setUse24Hour(!use24Hour)}
            className="glass px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 hover:text-gold transition-all text-white/60"
          >
            <Clock className="h-4 w-4" />
            {use24Hour ? "12-Hour Mode" : "24-Hour Mode"}
          </button>
        </div>
      </div>
    </div>
  );
}
