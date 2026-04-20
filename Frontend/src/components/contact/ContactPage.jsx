import React, { useState } from "react";
import { useLanguage } from "../../contexts/language-context";
import { useMasjid } from "../../contexts/masjid-context";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Info, Sparkles } from "lucide-react";
import { Label } from "../ui/label";

export default function ContactPage() {
  const { t, language, dir } = useLanguage();
  const { currentMasjid } = useMasjid();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          language === "am"
            ? "መልእክትዎ በትክክል ተልኳል! እናመሰግናለን።"
            : language === "ar"
            ? "تم ارسال رسالتك بنجاح! شكراً لك."
            : "Message sent successfully! Thank you."
        );
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        language === "am"
          ? "ከሰርቨር ጋር መገናኘት አልተቻለም።"
          : language === "ar"
          ? "تعذر الاتصال بالخادم."
          : "Could not connect to server."
      );
    } finally {
      setIsSubmitting(false);
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
      className="min-h-screen text-white py-32 px-6 relative overflow-hidden selection:bg-gold/30"
    >
      {/* Background Decorative Glows */}
      <div
        className={`absolute top-0 ${
          dir === "rtl" ? "left-0" : "right-0"
        } w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] -z-0`}
      />
      <div
        className={`absolute bottom-0 ${
          dir === "rtl" ? "right-0" : "left-0"
        } w-[600px] h-[600px] bg-red/5 rounded-full blur-[120px] -z-0`}
      />

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center justify-center px-6 py-2 mb-8 rounded-full glass border border-white/10 text-gold">
            <Sparkles
              className={`h-4 w-4 ${
                dir === "rtl" ? "ml-3" : "mr-3"
              } animate-pulse`}
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
              {language === "am"
                ? "ይገናኙን"
                : language === "ar"
                ? "اتصل بنا"
                : "Get in touch"}
            </span>
          </div>
          <h1
            className={`text-5xl md:text-8xl font-bold tracking-tighter mb-8 ${titleFont}`}
          >
            {t("contact") || "ያግኙን"} <span className="text-gold-glow">.</span>
          </h1>
          <p
            className={`text-white/40 text-sm tracking-widest max-w-2xl mx-auto italic leading-relaxed ${bodyFont}`}
          >
            {language === "am"
              ? "ለማንኛውም ጥያቄ ወይም አስተያየት ሁሌም ዝግጁ ነን። የሩሃማ ኢስላሚክ ሴንተር ቤተሰብ ይሁኑ።"
              : language === "ar"
              ? "نحن دائماً هنا للإجابة على استفساراتكم. كن جزءاً من عائلة مركز رحماء الإسلامي."
              : "We are always ready for any questions or comments. Join the Ruhama Islamic Center family."}
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {[
              {
                icon: MapPin,
                title:
                  language === "am"
                    ? "አድራሻ"
                    : language === "ar"
                    ? "الموقع"
                    : "Location",
                content: `${currentMasjid?.address || "Kombolcha, Amhara"}, ${
                  currentMasjid?.city || "Ethiopia"
                }`,
              },
              {
                icon: Phone,
                title:
                  language === "am"
                    ? "ስልክ"
                    : language === "ar"
                    ? "الهاتف"
                    : "Phone",
                content: currentMasjid?.contactPhone || "+251936291283",
              },
              {
                icon: Mail,
                title:
                  language === "am"
                    ? "ኢሜይል"
                    : language === "ar"
                    ? "البريد الإلكتروني"
                    : "Email",
                content:
                  currentMasjid?.contactEmail ||
                  "ruhamaislamaiccenter@gmail.com",
              },
              {
                icon: Clock,
                title:
                  language === "am"
                    ? "የስራ ሰዓት"
                    : language === "ar"
                    ? "ساعات العمل"
                    : "Office Hours",
                content:
                  language === "am"
                    ? "ሰኞ - አርብ: 2:00 - 11:00 ሰዓት"
                    : language === "ar"
                    ? "الاثنين - الجمعة: 8:00 - 17:00"
                    : "Mon - Fri: 8:00 AM - 5:00 PM",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="glass p-6 flex items-center gap-5 rounded-[2rem] border border-white/5 hover:border-gold/30 transition-all duration-500 group cursor-default"
              >
                <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-gold transition-all duration-500 shadow-inner">
                  <item.icon className="h-6 w-6 text-gold group-hover:text-black transition-colors" />
                </div>
                <div className={dir === "rtl" ? "text-right" : "text-left"}>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gold/50">
                    {item.title}
                  </p>
                  <p className="text-sm font-bold text-white mt-1">
                    {item.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Alert Box */}
            <div className="p-8 rounded-[2.5rem] bg-gold text-black relative overflow-hidden shadow-2xl group transition-transform hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -mr-8 -mt-8 blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Info className="h-5 w-5" />
                  <span className="font-bold uppercase text-xs tracking-widest">
                    {language === "am"
                      ? "ማሳሰቢያ"
                      : language === "ar"
                      ? "ملاحظة"
                      : "Note"}
                  </span>
                </div>
                <p
                  className={`text-xs leading-relaxed font-bold opacity-80 ${bodyFont}`}
                >
                  {language === "am"
                    ? "ለአስቸኳይ ጥያቄዎች በስልክ ቁጥራችን ቢደውሉ ፈጣን ምላሽ ያገኛሉ።"
                    : language === "ar"
                    ? "للاستفسارات العاجلة، يرجى الاتصال بنا عبر الهاتف للحصول على رد أسرع."
                    : "For urgent inquiries, please call our phone number for a faster response."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-[3rem] border border-white/5 overflow-hidden p-2">
              <div
                className={`p-10 pb-6 ${
                  dir === "rtl" ? "text-right" : "text-left"
                }`}
              >
                <h2
                  className={`text-3xl font-bold text-white italic mb-2 ${titleFont}`}
                >
                  {language === "am"
                    ? "መልእክት "
                    : language === "ar"
                    ? "أرسل "
                    : "Send a "}
                  <span className="text-gold">
                    {language === "am"
                      ? "ይላኩ"
                      : language === "ar"
                      ? "رسالة"
                      : "Message"}
                  </span>
                </h2>
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
                  {language === "am"
                    ? "በ 24 ሰዓት ውስጥ ምላሽ እንሰጣለን"
                    : language === "ar"
                    ? "سنرد عليك في غضون 24 ساعة"
                    : "We will respond within 24 hours"}
                </p>
              </div>

              <div className="p-10 pt-4">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div className="space-y-3">
                      <Label
                        className={`text-[10px] font-bold uppercase text-gold/60 mx-2 tracking-widest ${
                          dir === "rtl" ? "text-right" : "text-left"
                        }`}
                      >
                        {language === "am"
                          ? "ሙሉ ስም"
                          : language === "ar"
                          ? "الاسم الكامل"
                          : "Full Name"}
                      </Label>
                      <input
                        placeholder={
                          language === "am"
                            ? "የእርሶ ስም..."
                            : language === "ar"
                            ? "اسمك..."
                            : "Your name..."
                        }
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={`payment-input w-full h-14 px-6 rounded-xl outline-none text-white bg-white/5 border border-white/10 focus:border-gold/50 transition-all ${bodyFont}`}
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        className={`text-[10px] font-bold uppercase text-gold/60 mx-2 tracking-widest ${
                          dir === "rtl" ? "text-right" : "text-left"
                        }`}
                      >
                        {language === "am"
                          ? "ኢሜይል"
                          : language === "ar"
                          ? "البريد الإلكتروني"
                          : "Email"}
                      </Label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="payment-input w-full h-14 px-6 rounded-xl outline-none text-white bg-white/5 border border-white/10 focus:border-gold/50 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label
                      className={`text-[10px] font-bold uppercase text-gold/60 mx-2 tracking-widest ${
                        dir === "rtl" ? "text-right" : "text-left"
                      }`}
                    >
                      {language === "am"
                        ? "ርዕስ"
                        : language === "ar"
                        ? "الموضوع"
                        : "Subject"}
                    </Label>
                    <input
                      placeholder={
                        language === "am"
                          ? "ስለምን ጉዳይ ነው?"
                          : language === "ar"
                          ? "ما هو الموضوع؟"
                          : "What is it about?"
                      }
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className={`payment-input w-full h-14 px-6 rounded-xl outline-none text-white bg-white/5 border border-white/10 focus:border-gold/50 transition-all ${bodyFont}`}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      className={`text-[10px] font-bold uppercase text-gold/60 mx-2 tracking-widest ${
                        dir === "rtl" ? "text-right" : "text-left"
                      }`}
                    >
                      {language === "am"
                        ? "መልእክት"
                        : language === "ar"
                        ? "الرسالة"
                        : "Message"}
                    </Label>
                    <textarea
                      placeholder={
                        language === "am"
                          ? "እዚህ ይፃፉ..."
                          : language === "ar"
                          ? "اكتب هنا..."
                          : "Write here..."
                      }
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className={`payment-input w-full p-6 rounded-[2rem] outline-none resize-none text-white bg-white/5 border border-white/10 focus:border-gold/50 transition-all ${bodyFont}`}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gold w-full h-16 bg-gold text-black font-bold uppercase tracking-[0.2em] rounded-2xl transition-all shadow-2xl active:scale-[0.98] group flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">
                        {language === "am"
                          ? "በመላክ ላይ..."
                          : language === "ar"
                          ? "جاري الإرسال..."
                          : "Sending..."}
                      </span>
                    ) : (
                      <>
                        <span>
                          {language === "am"
                            ? "መልእክት ላክ"
                            : language === "ar"
                            ? "إرسال الرسالة"
                            : "Send Message"}
                        </span>
                        <Send
                          className={`h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ${
                            dir === "rtl" ? "rotate-180" : ""
                          }`}
                        />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
