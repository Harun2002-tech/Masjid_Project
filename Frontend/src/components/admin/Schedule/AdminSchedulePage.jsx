import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Clock,
  User,
  MapPin,
  Trash2,
  Edit3,
  Save,
  Loader2,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "../../../contexts/language-context";
import scheduleService from "../../../services/scheduleService";
import teacherService from "../../../services/teacherService";
import courseService from "../../../services/courseService";

// እሁድን ጨምሮ ሙሉ ሳምንት
const DAYS = ["ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ", "ቅዳሜ", "እሁድ"];

// ለዳሽቦርድ ፌልተር እንዲመች የእንግሊዝኛ ተኳኋኝ ስሞች
const DAY_MAP = {
  ሰኞ: "Monday",
  ማክሰኞ: "Tuesday",
  ረቡዕ: "Wednesday",
  ሐሙስ: "Thursday",
  አርብ: "Friday",
  ቅዳሜ: "Saturday",
  እሁድ: "Sunday",
};

const translations = {
  ሰኞ: { am: "ሰኞ", ar: "الاثنين", en: "Monday" },
  ማክሰኞ: { am: "ማክሰኞ", ar: "الثلاثاء", en: "Tuesday" },
  ረቡዕ: { am: "ረቡዕ", ar: "الأربعاء", en: "Wednesday" },
  ሐሙስ: { am: "ሐሙስ", ar: "الخميس", en: "Thursday" },
  አርብ: { am: "አርብ", ar: "الجمعة", en: "Friday" },
  ቅዳሜ: { am: "ቅዳሜ", ar: "السبت", en: "Saturday" },
  እሁድ: { am: "እሁድ", ar: "الأحد", en: "Sunday" },
  header: { am: "ሳምንታዊ ፕሮግራም", ar: "الجدول الأسبوعي", en: "Weekly Schedule" },
  admin: { am: "የአስተዳዳሪ ክፍል", ar: "لوحة التحكم", en: "Admin Dashboard" },
  addNew: { am: "አዲስ ፕሮግራም", ar: "إضافة جدول جديد", en: "Add New" },
  noSchedule: {
    am: "ለዚህ ቀን ምንም ፕሮግራም የለም",
    ar: "لا يوجد جدول لهذا اليوم",
    en: "No schedule",
  },
  save: { am: "መዝግብ", ar: "حفظ", en: "Save" },
  update: { am: "ለውጡን አጽድቅ", ar: "تحديث", en: "Update" },
  loading: { am: "እየተመዘገበ...", ar: "جاري الحفظ...", en: "Saving..." },
  courseLabel: { am: "ኮርስ ምረጥ", ar: "اختر الدورة", en: "Select Course" },
  startTime: { am: "መጀመሪያ ሰዓት", ar: "وقت البدء", en: "Start Time" },
  endTime: { am: "ማብቂያ ሰዓት", ar: "وقت الانتهاء", en: "End Time" },
};

const AdminSchedulePage = () => {
  const { language: lang } = useLanguage(); // ቋንቋውን ከኮንቴክስት እየሳብን ነው
  const [activeDay, setActiveDay] = useState("ሰኞ");
  const [schedules, setSchedules] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    course: "",
    day: "ሰኞ",
    dayEn: "Monday",
    startTime: "",
    endTime: "",
    subject: "",
    teacher: "",
    room: "",
  });

  const t = (key) => translations[key]?.[lang] || key;
  const isRTL = lang === "ar";

  const fetchData = async () => {
    try {
      setLoading(true);
      const [scheduleData, teacherData, courseData] = await Promise.all([
        scheduleService.getAllSchedules(),
        teacherService.getAllTeachers(),
        courseService.getAllCourses(),
      ]);
      setSchedules(
        Array.isArray(scheduleData) ? scheduleData : scheduleData.data || []
      );
      setTeachersList(teacherData.data || teacherData || []);
      setCoursesList(courseData.data || courseData || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ታብ ሲቀየር ፎርሙ ላይ ያለውም ቀን አብሮ እንዲቀየር
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      day: activeDay,
      dayEn: DAY_MAP[activeDay],
    }));
  }, [activeDay]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const dataToSubmit = { ...formData, dayEn: DAY_MAP[formData.day] };
      if (editingId) {
        await scheduleService.updateSchedule(editingId, dataToSubmit);
      } else {
        await scheduleService.createSchedule(dataToSubmit);
      }
      fetchData();
      closeModal();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      course: "",
      day: activeDay,
      dayEn: DAY_MAP[activeDay],
      startTime: "",
      endTime: "",
      subject: "",
      teacher: "",
      room: "",
    });
  };

  return (
    <div
      className={`min-h-screen pb-20 px-4 sm:px-8 ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto pt-16">
        {/* Language Selection አያስፈልግም - ከኮንቴክስት ነው የሚመጣው */}

        <header className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-8">
          <div>
            <div
              className={`flex items-center gap-2 text-gold mb-3 ${
                isRTL ? "justify-end" : ""
              }`}
            >
              <Calendar size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                {t("admin")}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              {t("header")}
            </h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-gold px-8 py-4 rounded-xl font-black text-xs uppercase flex items-center gap-2"
          >
            <Plus size={18} /> {t("addNew")}
          </button>
        </header>

        {/* Days Navigation */}
        <nav className="flex flex-wrap gap-2 mb-12 glass p-2 rounded-2xl">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex-1 min-w-[90px] py-3 rounded-xl font-black transition-all text-[10px] uppercase ${
                activeDay === day
                  ? "bg-gold text-bg shadow-lg"
                  : "text-white/30 hover:text-white hover:bg-white/5"
              }`}
            >
              {t(day)}
            </button>
          ))}
        </nav>

        {/* Schedule Grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {schedules.filter((s) => s.day === activeDay).length > 0 ? (
              schedules
                .filter((s) => s.day === activeDay)
                .map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item._id}
                    className="glass p-8 rounded-[2.5rem] group relative hover:border-gold/30 transition-all duration-500"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <span className="bg-gold/10 px-4 py-2 rounded-xl text-gold text-[10px] font-black flex items-center gap-2">
                        <Clock size={12} /> {item.startTime} - {item.endTime}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(item._id);
                            setFormData(item);
                            setIsModalOpen(true);
                          }}
                          className="p-2.5 bg-white/5 hover:bg-gold hover:text-bg rounded-xl transition-all"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure?"))
                              scheduleService
                                .deleteSchedule(item._id)
                                .then(fetchData);
                          }}
                          className="p-2.5 bg-white/5 hover:bg-red-500 text-white rounded-xl transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-6 group-hover:text-gold transition-colors">
                      {item.subject}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-white/40 text-[11px] font-bold">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gold">
                          <User size={14} />
                        </div>
                        {item.teacher}
                      </div>
                      <div className="flex items-center gap-3 text-white/40 text-[11px] font-bold">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gold">
                          <MapPin size={14} />
                        </div>
                        {item.room}
                      </div>
                    </div>
                  </motion.div>
                ))
            ) : (
              <div className="col-span-full py-20 text-center glass rounded-[3rem] opacity-20">
                <Calendar size={40} className="mx-auto mb-4" />
                <p className="font-black uppercase tracking-widest text-xs">
                  {t("noSchedule")}
                </p>
              </div>
            )}
          </AnimatePresence>
        </main>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#0b1220]/90 backdrop-blur-md"
                onClick={closeModal}
              />
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass w-full max-w-lg rounded-[3rem] p-10 relative z-10 border-white/10"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <h2 className="text-sm font-black text-gold-glow uppercase mb-10 tracking-widest">
                  {editingId ? t("update") : t("addNew")}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/20 font-black uppercase tracking-widest ml-1">
                      {t("courseLabel")}
                    </label>
                    <select
                      required
                      className="payment-input w-full rounded-2xl px-5 py-4 text-sm"
                      value={formData.course}
                      onChange={(e) =>
                        setFormData({ ...formData, course: e.target.value })
                      }
                    >
                      <option value="" className="bg-bg">
                        Choose Course...
                      </option>
                      {coursesList.map((c) => (
                        <option
                          key={c._id}
                          value={c._id}
                          className="bg-bg text-white"
                        >
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-white/20 font-black uppercase tracking-widest ml-1">
                        {t("startTime")}
                      </label>
                      <input
                        required
                        className="payment-input w-full rounded-2xl px-5 py-4 text-sm font-mono"
                        placeholder="08:30"
                        value={formData.startTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startTime: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-white/20 font-black uppercase tracking-widest ml-1">
                        {t("endTime")}
                      </label>
                      <input
                        required
                        className="payment-input w-full rounded-2xl px-5 py-4 text-sm font-mono"
                        placeholder="10:00"
                        value={formData.endTime}
                        onChange={(e) =>
                          setFormData({ ...formData, endTime: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <input
                    required
                    placeholder="Subject"
                    className="payment-input w-full rounded-2xl px-5 py-4 text-sm"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                  />
                  <input
                    required
                    placeholder="Teacher Name"
                    className="payment-input w-full rounded-2xl px-5 py-4 text-sm"
                    value={formData.teacher}
                    onChange={(e) =>
                      setFormData({ ...formData, teacher: e.target.value })
                    }
                  />
                  <input
                    required
                    placeholder="Room / Location"
                    className="payment-input w-full rounded-2xl px-5 py-4 text-sm"
                    value={formData.room}
                    onChange={(e) =>
                      setFormData({ ...formData, room: e.target.value })
                    }
                  />

                  <button
                    disabled={submitting}
                    type="submit"
                    className="btn-gold w-full py-5 rounded-2xl font-black text-xs uppercase mt-6 flex items-center justify-center gap-3"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Save size={20} />
                    )}
                    {submitting ? t("loading") : t("save")}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminSchedulePage;
