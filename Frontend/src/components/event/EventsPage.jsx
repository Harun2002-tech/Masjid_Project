import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/language-context";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Calendar,
  Users,
  Video,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Clock,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function EventsPage() {
  const { t, language, dir } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://https://masjid-project.onrender.com/api/events";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        setEvents(response.data);
      } catch (err) {
        setError(
          language === "am"
            ? "መረጃውን መጫን አልተቻለም። እባክዎ ትንሽ ቆይተው ይሞክሩ።"
            : language === "ar"
            ? "فشل تحميل الفعاليات. يرجى المحاولة مرة أخرى لاحقاً."
            : "Failed to load events. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [language]);

  const handleRegister = async (eventId) => {
    try {
      await axios.post(
        `http://https://masjid-project.onrender.com/api/events/register/${eventId}`
      );
      alert(
        language === "am"
          ? "በተሳካ ሁኔታ ተመዝግበዋል!"
          : language === "ar"
          ? "تم التسجيل بنجاح!"
          : "Registered successfully!"
      );
      setEvents((prev) =>
        prev.map((ev) =>
          ev._id === eventId
            ? { ...ev, currentAttendees: ev.currentAttendees + 1 }
            : ev
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Error during registration");
    }
  };

  const titleFont =
    language === "am"
      ? "font-amharic"
      : language === "ar"
      ? "font-serif"
      : "font-display";
  const bodyFont = language === "am" ? "font-amharic" : "font-sans";

  if (loading)
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#05080f]">
        <Loader2 className="h-12 w-12 animate-spin text-gold" />
        <p
          className={`mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-gold/60 ${bodyFont}`}
        >
          {language === "am"
            ? "ዝግጅቶችን በመጫን ላይ..."
            : language === "ar"
            ? "جاري تحميل الفعاليات..."
            : "Loading Events..."}
        </p>
      </div>
    );

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[#05080f] py-24 text-white selection:bg-gold/30 overflow-x-hidden"
    >
      {/* Cinematic Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <header className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className={`flex justify-center items-center gap-3 mb-6 ${
                dir === "rtl" ? "flex-row-reverse" : ""
              }`}
            >
              <Sparkles className="h-5 w-5 text-gold animate-pulse" />
              <span
                className={`text-[10px] font-black uppercase tracking-[0.4em] text-gold/80 ${bodyFont}`}
              >
                {language === "am"
                  ? "የማህበረሰብ እና መንፈሳዊ ትምህርት"
                  : language === "ar"
                  ? "التعلم المجتمعي والروحي"
                  : "Community & Spiritual Learning"}
              </span>
            </div>
            <h1
              className={`text-5xl md:text-7xl font-bold tracking-tighter text-white mb-8 ${titleFont}`}
            >
              {language === "am"
                ? "መጪ ዝግጅቶች"
                : language === "ar"
                ? "الفعاليات القادمة"
                : "Upcoming Events"}{" "}
              <span className="text-gold-glow italic">.</span>
            </h1>
            <p
              className={`mx-auto max-w-2xl text-lg md:text-xl text-white/50 leading-relaxed ${bodyFont}`}
            >
              {language === "am"
                ? "በሩሃማ ኢስላሚክ ሴንተር የሚዘጋጁ ትምህርታዊ ሴሚናሮችን፣ መንፈሳዊ ፕሮግራሞችን እና የማህበረሰብ ስብሰባዎችን እዚህ ያገኛሉ።"
                : language === "ar"
                ? "اكتشف الندوات التعليمية والبرامج الروحية والتجمعات المجتمعية التي يستضيفها مركز روهاما الإسلامي."
                : "Discover educational seminars, spiritual programs, and community gatherings hosted by Ruhama Islamic Center."}
            </p>
          </motion.div>
        </header>

        {error && (
          <div
            className={`mb-12 flex items-center justify-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-red-400 max-w-2xl mx-auto ${
              dir === "rtl" ? "flex-row-reverse" : ""
            }`}
          >
            <AlertCircle size={20} />
            <p className={`text-sm font-bold ${bodyFont}`}>{error}</p>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid gap-10 lg:grid-cols-2">
          <AnimatePresence>
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group relative h-full overflow-hidden border-white/5 bg-white/[0.02] backdrop-blur-xl transition-all hover:border-gold/30 rounded-[2.5rem] shadow-2xl">
                  <div
                    className={`flex flex-col md:flex-row h-full ${
                      dir === "rtl" ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Event Image */}
                    <div className="relative h-64 w-full md:h-auto md:w-64 overflow-hidden">
                      {event.imageUrl ? (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gold/5">
                          <Calendar className="h-16 w-16 text-gold/20" />
                        </div>
                      )}
                      <div
                        className={`absolute top-6 ${
                          dir === "rtl" ? "right-6" : "left-6"
                        }`}
                      >
                        <Badge className="bg-gold text-black font-black uppercase tracking-widest border-none px-4 py-1.5 shadow-xl">
                          {event.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Event Details */}
                    <CardContent
                      className={`flex flex-1 flex-col p-8 md:p-10 ${
                        dir === "rtl" ? "text-right" : "text-left"
                      }`}
                    >
                      <div
                        className={`mb-6 flex flex-wrap gap-3 ${
                          dir === "rtl" ? "flex-row-reverse" : ""
                        }`}
                      >
                        {event.isOnline && (
                          <Badge className="rounded-full bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-gold border border-gold/20 px-3">
                            <Video
                              className={`${
                                dir === "rtl" ? "ml-1.5" : "mr-1.5"
                              } h-3.5 w-3.5`}
                            />
                            {language === "am"
                              ? "በኢንተርኔት"
                              : language === "ar"
                              ? "أونلاين"
                              : "Online"}
                          </Badge>
                        )}
                        <Badge className="rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-white/60 px-3">
                          {event.price === 0
                            ? language === "am"
                              ? "ነፃ"
                              : language === "ar"
                              ? "دخول مجاني"
                              : "Free Access"
                            : `${event.price} ${event.currency}`}
                        </Badge>
                      </div>

                      <h3
                        className={`mb-4 text-2xl md:text-3xl font-bold text-white leading-tight group-hover:text-gold transition-colors duration-300 ${titleFont}`}
                      >
                        {event.title}
                      </h3>

                      <p
                        className={`mb-8 line-clamp-2 text-sm font-medium leading-relaxed text-white/40 ${bodyFont}`}
                      >
                        {event.description}
                      </p>

                      <div
                        className={`mt-auto grid grid-cols-2 gap-6 border-t border-white/5 pt-8 ${
                          dir === "rtl" ? "rtl-grid" : ""
                        }`}
                      >
                        <div
                          className={`flex items-center gap-4 ${
                            dir === "rtl" ? "flex-row-reverse text-right" : ""
                          }`}
                        >
                          <div className="rounded-2xl bg-white/5 p-3 text-gold">
                            <Calendar size={18} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">
                              {language === "am"
                                ? "ቀን"
                                : language === "ar"
                                ? "التاريخ"
                                : "Date"}
                            </p>
                            <p className="text-xs font-bold text-white/80">
                              {new Date(event.startDate).toLocaleDateString(
                                language === "am"
                                  ? "am-ET"
                                  : language === "ar"
                                  ? "ar-SA"
                                  : "en-US"
                              )}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`flex items-center gap-4 ${
                            dir === "rtl" ? "flex-row-reverse text-right" : ""
                          }`}
                        >
                          <div className="rounded-2xl bg-white/5 p-3 text-gold">
                            <Users size={18} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">
                              {language === "am"
                                ? "ቦታ"
                                : language === "ar"
                                ? "السعة"
                                : "Capacity"}
                            </p>
                            <p className="text-xs font-bold text-white/80">
                              {event.currentAttendees}/{event.maxAttendees}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleRegister(event._id)}
                        disabled={event.currentAttendees >= event.maxAttendees}
                        className="mt-10 w-full rounded-2xl bg-gold text-black font-black uppercase tracking-widest hover:bg-white transition-all py-7 shadow-[0_10px_30px_rgba(212,175,55,0.15)] group-hover:shadow-gold/20"
                      >
                        {event.currentAttendees >= event.maxAttendees ? (
                          language === "am" ? (
                            "ዝግጅቱ ሞልቷል"
                          ) : language === "ar" ? (
                            "الفعالية ممتلئة"
                          ) : (
                            "Event Full"
                          )
                        ) : (
                          <span
                            className={`flex items-center gap-3 ${
                              dir === "rtl" ? "flex-row-reverse" : ""
                            }`}
                          >
                            {language === "am"
                              ? "አሁኑኑ ይመዝገቡ"
                              : language === "ar"
                              ? "سجل الآن"
                              : "Register Now"}
                            {dir === "rtl" ? (
                              <ArrowLeft size={18} />
                            ) : (
                              <ArrowRight size={18} />
                            )}
                          </span>
                        )}
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {events.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-40 text-center"
          >
            <div className="mb-8 rounded-full bg-white/5 border border-white/10 p-12 shadow-2xl">
              <Calendar className="h-20 w-20 text-white/10" />
            </div>
            <h3 className={`text-3xl font-bold text-white mb-4 ${titleFont}`}>
              {language === "am"
                ? "ምንም ዝግጅት አልተገኘም"
                : language === "ar"
                ? "لم يتم العثور على فعاليات"
                : "No Events Found"}
            </h3>
            <p className={`text-white/40 font-medium max-w-sm ${bodyFont}`}>
              {language === "am"
                ? "በቅርቡ የሚኖሩ ዝግጅቶችን እዚህ እናሳውቃለን።"
                : language === "ar"
                ? "ترقبونا! سننشر الفعاليات القادمة هنا قريباً."
                : "Stay tuned! We'll post upcoming events here soon."}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
