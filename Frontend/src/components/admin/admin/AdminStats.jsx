import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  School,
  CalendarDays,
  Clock,
  ArrowRight,
  GraduationCap,
  ClipboardCheck,
  LayoutDashboard,
  UserPlus,
  Newspaper,
  MessageSquarePlus,
  Loader2,
  Sparkles,
  ChevronRight,
} from "lucide-react";

// ኮንቴክስት እና ሰርቪሶች
import { useLanguage } from "../../../contexts/language-context";
import { useAuth } from "../../../contexts/auth-context";
import teacherService from "../../../services/teacherService";
import studentService from "../../../services/studentService";
import courseService from "../../../services/courseService";
import scheduleService from "../../../services/scheduleService";

// ያንተ ሎጎ
import LogoImg from "../../../assets/logo.jpg";

const translations = {
  am: {
    dashboard: "አስተዳዳሪ",
    students: "ተማሪዎች",
    teachers: "መምህራን",
    courses: "ትምህርቶች",
    todaySchedule: "የዛሬ ፕሮግራም",
    quickActions: "ፈጣን ተግባራት",
    addStudent: "ተማሪ መዝግብ",
    addTeacher: "መምህር መዝግብ",
    applications: "ማመልከቻዎች",
    addCourse: "ትምህርት አክል",
    newsPost: "ዜና ልጥፍ",
    prayerTime: "የሶላት ሰዓት",
    books: "መጽሐፍት",
    dailyMsg: "መልዕክት",
    loading: "ዳታው እየተጫነ ነው...",
    new: "አዲስ",
    viewAll: "ሁሉንም እይ",
    recentTeachers: "የቅርብ መምህራን",
    recentStudents: "የቅርብ ተማሪዎች",
    noSchedule: "ለዛሬ ፕሮግራም የለም",
    enrollmentControl: "ምዝገባ ተቆጣጠር",
    newsList: "ዜና ዝርዝር",
    testimonials: "የተማሪ እይታዎች",
    allCourses: "ሁሉንም ትምህርቶች",
  },
  en: {
    dashboard: "ADMIN PANEL",
    students: "Students",
    teachers: "Teachers",
    courses: "Courses",
    todaySchedule: "Today's Schedule",
    quickActions: "Quick Actions",
    addStudent: "Add Student",
    addTeacher: "Add Teacher",
    applications: "Applications",
    addCourse: "Add Course",
    newsPost: "Post News",
    prayerTime: "Prayer Times",
    books: "Books",
    dailyMsg: "Messages",
    loading: "Loading Data...",
    new: "New",
    viewAll: "View All",
    recentTeachers: "Recent Teachers",
    recentStudents: "Recent Students",
    noSchedule: "No schedule for today",
    enrollmentControl: "Enrollment Control",
    newsList: "News List",
    testimonials: "Testimonials",
    allCourses: "All Courses",
  },
  ar: {
    enrollmentControl: "التحكم في التسجيل",
    newsList: "قائمة الأخبار",
    testimonials: "آراء الطلاب",
    allCourses: "جميع المواد",
    dashboard: "لوحة التحكم",
    students: "الطلاب",
    teachers: "المعلمين",
    courses: "المواد",
    todaySchedule: "جدول اليوم",
    quickActions: "إجراءات سريعة",
    addStudent: "تسجيل طالب",
    addTeacher: "تسجيل معلم",
    applications: "الطلبات",
    addCourse: "إضافة مادة",
    newsPost: "نشر خبر",
    prayerTime: "أوقات الصلاة",
    books: "الكتب",
    dailyMsg: "الرسائل",
    loading: "جاري التحميل...",
    new: "جديد",
    viewAll: "عرض الكل",
    recentTeachers: "المعلمين الجدد",
    recentStudents: "الطلاب الجدد",
    noSchedule: "لا يوجد جدول اليوم",
  },
};

export default function AdminDashboard() {
  // እዚህ ጋር setLanguage መጨመሩን እርግጠኛ ሁን
  const { language: lang, setLanguage } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentTeachers, setRecentTeachers] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [todaySchedules, setTodaySchedules] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    newStudents: 0,
  });

  const t = (key) => translations[lang][key] || key;
  const isRTL = lang === "ar";
  const navFont = lang === "am" ? "font-arefa" : "font-sans";

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    loadDashboardData();
    return () => clearInterval(timer);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [teacherRes, studentRes, courseRes, scheduleRes] =
        await Promise.all([
          teacherService.getAllTeachers(),
          studentService.getAllStudents(),
          courseService.getAllCourses(),
          scheduleService.getAllSchedules(),
        ]);

      const daysAm = ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ", "ቅዳሜ"];
      const daysEn = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const todayIndex = new Date().getDay();

      const allSchedules = Array.isArray(scheduleRes)
        ? scheduleRes
        : scheduleRes?.data || [];
      const filtered = allSchedules.filter(
        (s) =>
          (s.day && s.day.trim() === daysAm[todayIndex]) ||
          (s.dayEn &&
            s.dayEn.trim().toLowerCase() === daysEn[todayIndex].toLowerCase())
      );
      setTodaySchedules(filtered);

      if (studentRes?.success) {
        const students = studentRes.data || [];
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        setCounts((prev) => ({
          ...prev,
          students: students.length,
          newStudents: students.filter((s) => new Date(s.createdAt) > oneDayAgo)
            .length,
        }));
        setRecentStudents(students.slice(0, 5));
      }

      if (teacherRes?.success) {
        const teachers = teacherRes.data || [];
        setCounts((prev) => ({ ...prev, teachers: teachers.length }));
        setRecentTeachers(teachers.slice(0, 5));
      }

      if (courseRes?.success) {
        setCounts((prev) => ({
          ...prev,
          courses: (courseRes.data || []).length,
        }));
      }
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-bg">
        <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
        <p className="text-gold/40 font-black uppercase text-[10px] tracking-widest italic">
          {t("loading")}
        </p>
      </div>
    );

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-screen bg-bg pb-20 pt-24 px-4 sm:px-8 ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      {/* --- SITE HEADER (STAY DARK) --- */}
      <header className="fixed top-0 inset-x-0 z-[100] bg-[#1a141d]/90 backdrop-blur-xl border-b border-white/5 h-24 shadow-2xl">
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6 lg:px-8">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-4 group shrink-0">
            <div className="relative h-14 w-14 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-gold/30 group-hover:border-gold transition-colors duration-500" />
              <div className="h-[90%] w-[90%] rounded-full overflow-hidden bg-white">
                <img
                  src={LogoImg}
                  alt="Logo"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
            <div
              className={`flex flex-col border-l border-white/10 pl-4 py-1 ${
                isRTL ? "border-r border-l-0 pr-4 pl-0 text-right" : ""
              }`}
            >
              <p className="text-2xl font-black leading-none tracking-tight text-white font-display uppercase">
                Ruhama
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mt-1.5">
                {t("dashboard")}
              </p>
            </div>
          </Link>

          {/* Right Controls */}
          <div
            className={`flex items-center gap-6 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            {/* Clock */}
            <div className="hidden lg:flex items-center gap-2 text-white/20 font-mono text-[10px]">
              <Clock size={12} className="text-gold/50" />
              {currentTime.toLocaleTimeString()}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
              {[
                { code: "am", label: "AM" },
                { code: "en", label: "EN" },
                { code: "ar", label: "AR" },
              ].map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`w-9 h-7 flex items-center justify-center rounded-lg text-[10px] font-black transition-all ${
                    lang === l.code
                      ? "bg-gold text-bg shadow-lg shadow-gold/20"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Profile */}
            <div
              className={`flex items-center gap-3 pl-6 border-l border-white/10 ${
                isRTL ? "border-r border-l-0 pr-6 pl-0" : ""
              }`}
            >
              <div className="flex flex-col items-end hidden sm:block">
                <span
                  className={`text-[12px] font-bold text-white tracking-widest uppercase ${navFont}`}
                >
                  {user?.name || "Admin"}
                </span>
                <span className="text-[8px] text-gold font-bold uppercase tracking-tighter italic">
                  Online
                </span>
              </div>
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gold text-bg text-xs font-black border border-white/10 shadow-lg shadow-gold/10">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto mt-10 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: t("students"),
              value: counts.students,
              newCount: counts.newStudents,
              icon: Users,
              link: "/admin/students",
            },
            {
              title: t("teachers"),
              value: counts.teachers,
              icon: GraduationCap,
              link: "/admin/teachers",
            },
            {
              title: t("courses"),
              value: counts.courses,
              icon: BookOpen,
              link: "/admin/courses",
            },
            {
              title: t("todaySchedule"),
              value: todaySchedules.length,
              icon: CalendarDays,
              link: "/admin/schedule",
            },
          ].map((s, i) => (
            <Link to={s.link} key={i}>
              <motion.div
                whileHover={{ y: -4 }}
                className="glass p-8 rounded-[2rem] group relative overflow-hidden border border-white/5 transition-all hover:border-gold/30"
              >
                <div
                  className={`absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-10 transition-opacity text-white ${
                    isRTL ? "-left-4 -right-auto" : ""
                  }`}
                >
                  <s.icon size={120} />
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-gold transition-colors">
                  <s.icon size={20} className="text-gold group-hover:text-bg" />
                </div>
                <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] mb-1">
                  {s.title}
                </p>
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl font-bold text-white group-hover:text-gold">
                    {s.value}
                  </h3>
                  {s.newCount > 0 && (
                    <span className="bg-red-500/20 text-red-500 text-[8px] font-black px-2 py-1 rounded-lg border border-red-500/20 animate-pulse">
                      +{s.newCount} {t("new")}
                    </span>
                  )}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* --- QUICK ACTIONS SECTION --- */}
        <div className="glass p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.01]">
          <h2
            className={`text-xs font-black uppercase tracking-widest flex items-center gap-3 mb-10 text-gold-glow ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <LayoutDashboard size={18} /> {t("quickActions")}
          </h2>

          {/* የግሪድ ብዛት ለትናንሽ ስክሪኖች 2፣ ለትላልቅ 6 እንዲሆን ተስተካክሏል */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            <QuickLink
              to="/admin/add-student"
              icon={UserPlus}
              title={t("addStudent")}
              color="text-gold"
            />
            <QuickLink
              to="/admin/add-teacher"
              icon={GraduationCap}
              title={t("addTeacher")}
              color="text-white"
            />
            <QuickLink
              to="/admin/enrollments"
              icon={ClipboardCheck}
              title={t("applications")}
              color="text-white/60"
            />
            <QuickLink
              to="/admin/add-course"
              icon={BookOpen}
              title={t("addCourse")}
              color="text-gold"
            />
            <QuickLink
              to="/admin/news"
              icon={Newspaper}
              title={t("newsPost")}
              color="text-white"
            />
            <QuickLink
              to="/admin/prayer-times"
              icon={Clock}
              title={t("prayerTime")}
              color="text-gold"
            />

            {/* ያንተ አዳዲስ ሊንኮች እዚህ ጋር ይቀጥላሉ */}
            <QuickLink
              to="/admin/enrollment-control"
              icon={ClipboardCheck}
              title={t("enrollmentControl")}
              color="text-emerald-400" // ለዳርክ ሞድ እንዲታይ ቀለሙ ፈካ ተደርጓል
            />
            <QuickLink
              to="/admin/news-list"
              icon={Newspaper}
              title={t("newsList")}
              color="text-red-400"
            />
            <QuickLink
              to="/admin/testimonials"
              icon={Users}
              title={t("testimonials")}
              color="text-sky-400"
            />
            <QuickLink
              to="/admin/courses"
              icon={BookOpen}
              title={t("allCourses")}
              color="text-purple-400"
            />
            <QuickLink
              to="/admin/manage-books"
              icon={BookOpen}
              title={t("books")}
              color="text-white"
            />
            <QuickLink
              to="/admin/add-message"
              icon={MessageSquarePlus}
              title={t("dailyMsg")}
              color="text-gold"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
            <DataSection
              title={t("recentTeachers")}
              items={recentTeachers}
              type="teacher"
              tViewAll={t("viewAll")}
              isRTL={isRTL}
            />
            <DataSection
              title={t("recentStudents")}
              items={recentStudents}
              type="student"
              tViewAll={t("viewAll")}
              isRTL={isRTL}
            />
          </div>
          <div className="lg:col-span-4">
            <div className="glass p-8 rounded-[2.5rem] border-t-4 border-t-gold h-full flex flex-col">
              <h2
                className={`text-xs font-black uppercase tracking-widest flex items-center gap-3 mb-8 text-gold ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <CalendarDays size={18} /> {t("todaySchedule")}
              </h2>
              <div className="space-y-3 flex-grow">
                {todaySchedules.length > 0 ? (
                  todaySchedules.map((item, idx) => (
                    <ScheduleItem
                      key={item._id}
                      subject={item.subject}
                      time={`${item.startTime} - ${item.endTime}`}
                      active={idx === 0}
                      isRTL={isRTL}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 opacity-20">
                    <Sparkles size={20} className="mx-auto mb-2" />
                    <p className="text-[10px] uppercase font-bold tracking-widest">
                      {t("noSchedule")}
                    </p>
                  </div>
                )}
              </div>
              <Link
                to="/admin/schedule"
                className={`mt-8 w-full py-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-widest hover:bg-gold hover:text-bg transition-all group ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                {t("viewAll")}{" "}
                <ArrowRight
                  size={14}
                  className={
                    isRTL
                      ? "rotate-180"
                      : "group-hover:translate-x-1 transition-transform"
                  }
                />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function QuickLink({ to, icon: Icon, title, color }) {
  return (
    <Link
      to={to}
      className="group flex flex-col items-center p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-gold/40 hover:bg-white/10 transition-all text-center"
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${color}`}
      >
        <Icon size={20} />
      </div>
      <span className="text-[8px] font-black uppercase text-white/40 group-hover:text-gold tracking-tighter">
        {title}
      </span>
    </Link>
  );
}

function DataSection({ title, items, type, tViewAll, isRTL }) {
  const baseUrl = "http://https://masjid-project.onrender.com";
  return (
    <div className="glass p-8 rounded-[2rem] border border-white/5">
      <div
        className={`flex items-center justify-between mb-6 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <h2 className="text-[9px] font-black uppercase text-white/20 tracking-[0.2em]">
          {title}
        </h2>
        <Link
          to={`/admin/${type}s`}
          className={`text-[8px] font-black text-gold uppercase flex items-center gap-1 hover:text-white transition-all ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {tViewAll}{" "}
          <ArrowRight size={12} className={isRTL ? "rotate-180" : ""} />
        </Link>
      </div>
      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <Link
              key={item._id}
              to={`/admin/${type}/view/${item._id}`}
              className={`flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex items-center gap-3 ${
                  isRTL ? "flex-row-reverse text-right" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gold/10 overflow-hidden flex items-center justify-center text-gold border border-gold/10">
                  {item.photo ? (
                    <img
                      src={`${baseUrl}${item.photo.startsWith("/") ? "" : "/"}${
                        item.photo
                      }`}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  ) : (
                    <span className="text-sm font-bold opacity-30">
                      {(item.firstName || "?")[0]}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-white/80">
                    {item.firstName} {item.lastName}
                  </p>
                  <p className="text-[8px] text-white/30 font-mono tracking-tighter">
                    {item.phone}
                  </p>
                </div>
              </div>
              <ChevronRight
                size={14}
                className={`text-white/10 ${isRTL ? "rotate-180" : ""}`}
              />
            </Link>
          ))
        ) : (
          <p className="text-center py-4 text-[10px] opacity-20 uppercase tracking-widest">
            No Data
          </p>
        )}
      </div>
    </div>
  );
}

function ScheduleItem({ subject, time, active, isRTL }) {
  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        active ? "bg-gold/10 border-gold/30" : "bg-white/5 border-white/5"
      }`}
    >
      <div
        className={`flex items-center gap-4 ${
          isRTL ? "flex-row-reverse text-right" : ""
        }`}
      >
        <div
          className={`w-1 h-8 rounded-full ${
            active ? "bg-gold" : "bg-white/10"
          }`}
        />
        <div>
          <h4
            className={`text-[10px] font-black uppercase tracking-widest ${
              active ? "text-gold" : "text-white/60"
            }`}
          >
            {subject}
          </h4>
          <p className="text-[9px] font-mono text-white/30 flex items-center gap-2 mt-1">
            <Clock size={10} /> {time}
          </p>
        </div>
      </div>
    </div>
  );
}
