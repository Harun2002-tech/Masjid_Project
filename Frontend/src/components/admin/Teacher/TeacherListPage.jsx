import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Loader2,
  Search,
  Phone,
  Hash,
  Users,
  BookOpen,
} from "lucide-react";
import teacherService from "../../../services/teacherService";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../contexts/language-context";

const translations = {
  am: {
    adminDept: "የአስተዳደር ክፍል",
    title: "የሼኮች ዝርዝር",
    total: "በአጠቃላይ {count} ሼኮች ተመዝግበዋል",
    addNew: "አዲስ ሼህ መዝግብ",
    searchPlaceholder: "ሼህ በስም፣ በ ID ወይም በሙያ ዘርፍ ይፈልጉ...",
    thTeacher: "ሼህ (Teacher)",
    thGender: "ጾታ",
    thSubject: "የሙያ ዘርፍ",
    thPhone: "ስልክ",
    thAction: "እርምጃ",
    loading: "መረጃ እየመጣ ነው...",
    noData: "ምንም አይነት መረጃ አልተገኘም",
    confirmDelete: "እርግጠኛ ነዎት? ሼህ {name} በቋሚነት ይሰረዛሉ።",
    deleteSuccess: "የሼሁ መረጃ ተሰርዟል!",
    male: "ወንድ",
    female: "ሴት",
    unspecified: "ያልተጠቀሰ",
  },
  en: {
    adminDept: "ADMINISTRATION",
    title: "Teachers List",
    total: "Total {count} teachers registered",
    addNew: "Add New Teacher",
    searchPlaceholder: "Search by name, ID or specialty...",
    thTeacher: "Teacher",
    thGender: "Gender",
    thSubject: "Specialization",
    thPhone: "Phone",
    thAction: "Action",
    loading: "Loading data...",
    noData: "No data found",
    confirmDelete: "Are you sure? Teacher {name} will be permanently deleted.",
    deleteSuccess: "Teacher deleted successfully!",
    male: "Male",
    female: "Female",
    unspecified: "Unspecified",
  },
  ar: {
    adminDept: "قسم الإدارة",
    title: "قائمة المعلمين",
    total: "إجمالي {count} معلمين مسجلين",
    addNew: "إضافة معلم جديد",
    searchPlaceholder: "بحث بالاسم، الرقم التعريف أو التخصص...",
    thTeacher: "المعلم",
    thGender: "الجنس",
    thSubject: "التخصص",
    thPhone: "الهاتف",
    thAction: "إجراء",
    loading: "جاري تحميل البيانات...",
    noData: "لم يتم العثور على بيانات",
    confirmDelete: "هل أنت متأكد؟ سيتم حذف المعلم {name} نهائيًا.",
    deleteSuccess: "تم حذف بيانات المعلم بنجاح!",
    male: "ذكر",
    female: "أنثى",
    unspecified: "غير محدد",
  },
};

export default function TeacherListPage() {
  const { language } = useLanguage();
  const t = translations[language || "am"];
  const isRTL = language === "ar";

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:5000";

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await teacherService.getAllTeachers();
      const fetchedData = result?.success
        ? result.data?.data || result.data || []
        : [];
      setTeachers(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setError(t.noData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id, fullName) => {
    if (!window.confirm(t.confirmDelete.replace("{name}", fullName))) {
      return;
    }
    try {
      await teacherService.deleteTeacher(id);
      setTeachers((prev) => prev.filter((t) => t._id !== id));
      alert(t.deleteSuccess);
    } catch (error) {
      alert("Error!");
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const fullName = `${teacher.firstName || ""} ${
      teacher.lastName || ""
    }`.toLowerCase();
    const teacherID = (teacher.teacherID || "").toLowerCase();
    const phone = (teacher.phone || "").toLowerCase();
    const subjects = Array.isArray(teacher.subjects)
      ? teacher.subjects.join(" ").toLowerCase()
      : (teacher.subjects || "").toLowerCase();
    const search = searchTerm.toLowerCase().trim();

    return (
      fullName.includes(search) ||
      teacherID.includes(search) ||
      phone.includes(search) ||
      subjects.includes(search)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-gold" size={50} />
          <p className="text-white/40 font-black tracking-[0.2em] uppercase text-[10px]">
            {t.loading}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 md:p-12 min-h-screen text-white ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div
          className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-6 ${
            isRTL ? "md:flex-row-reverse" : ""
          }`}
        >
          <div className="space-y-4">
            <div
              className={`flex items-center gap-3 text-gold-glow ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <Users size={20} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
                {t.adminDept}
              </span>
            </div>
            <h1 className="text-4xl font-serif font-black italic tracking-tight uppercase text-gold-glow">
              {t.title}
            </h1>
            <div
              className={`flex items-center gap-3 glass px-4 py-2 rounded-full w-fit ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse shadow-[0_0_10px_#fbbf24]"></span>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
                {t.total.replace("{count}", teachers.length)}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/add-teacher")}
            className="btn-gold px-10 py-5 rounded-2xl flex items-center gap-3 font-black uppercase tracking-[0.2em] text-xs shadow-2xl"
          >
            <UserPlus size={18} /> {t.addNew}
          </button>
        </div>

        {/* Search Bar */}
        <div
          className={`relative group max-w-2xl ${isRTL ? "mr-0 ml-auto" : ""}`}
        >
          <Search
            className={`absolute ${
              isRTL ? "right-6" : "left-6"
            } top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors`}
            size={20}
          />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className={`w-full payment-input rounded-2xl py-5 ${
              isRTL ? "pr-16 pl-6" : "pl-16 pr-6"
            } outline-none shadow-xl text-sm font-medium`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Teachers Table */}
        <div className="glass rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
          <div className="overflow-x-auto">
            <table
              className={`w-full ${
                isRTL ? "text-right" : "text-left"
              } border-collapse`}
            >
              <thead>
                <tr className="bg-white/5 text-white/40 uppercase text-[10px] font-black tracking-[0.2em] border-b border-white/5">
                  <th className="px-10 py-8">{t.thTeacher}</th>
                  <th className="px-10 py-8">{t.thGender}</th>
                  <th className="px-10 py-8">{t.thSubject}</th>
                  <th className="px-10 py-8">{t.thPhone}</th>
                  <th
                    className={`px-10 py-8 ${
                      isRTL ? "text-left" : "text-right"
                    }`}
                  >
                    {t.thAction}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {filteredTeachers.map((teacher) => {
                    const fullName = `${teacher.firstName || ""} ${
                      teacher.lastName || ""
                    }`.trim();
                    const specializations = Array.isArray(teacher.subjects)
                      ? teacher.subjects
                      : [];

                    return (
                      <motion.tr
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={teacher._id}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-10 py-7">
                          <div
                            className={`flex items-center gap-5 ${
                              isRTL ? "flex-row-reverse" : ""
                            }`}
                          >
                            <div className="w-14 h-14 rounded-2xl glass border border-white/10 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-gold/30 transition-all">
                              {teacher.photo ? (
                                <img
                                  src={`${API_BASE_URL}/${teacher.photo.replace(
                                    /\\/g,
                                    "/"
                                  )}`}
                                  alt={fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-xl font-black text-white/10 uppercase">
                                  {teacher.firstName?.[0]}
                                </span>
                              )}
                            </div>
                            <div className={isRTL ? "text-right" : "text-left"}>
                              <div className="font-bold text-white group-hover:text-gold transition-colors text-base">
                                {fullName}
                              </div>
                              <div
                                className={`text-[10px] text-white/30 font-mono flex items-center gap-1 mt-1 ${
                                  isRTL ? "flex-row-reverse" : ""
                                }`}
                              >
                                <Hash size={10} className="text-gold/50" />
                                {teacher.teacherID || "---"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-10 py-7">
                          <span className="px-4 py-1.5 rounded-xl glass border border-white/5 text-white/60 text-[10px] font-black uppercase tracking-tighter">
                            {teacher.gender === "Male" ||
                            teacher.gender === "ወንድ" ||
                            teacher.gender === "ذكر"
                              ? t.male
                              : t.female}
                          </span>
                        </td>

                        <td className="px-10 py-7">
                          <div
                            className={`flex flex-wrap gap-2 max-w-[250px] ${
                              isRTL ? "justify-end" : ""
                            }`}
                          >
                            {specializations.length > 0 ? (
                              specializations.slice(0, 3).map((spec, i) => (
                                <span
                                  key={i}
                                  className="bg-gold/5 text-gold text-[9px] font-bold px-2.5 py-1 rounded-lg border border-gold/10 flex items-center gap-1.5"
                                >
                                  <BookOpen size={10} /> {spec}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-white/20 italic">
                                {t.unspecified}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-10 py-7 text-sm text-white/70 font-medium font-mono">
                          <div
                            className={`flex items-center gap-2 ${
                              isRTL ? "flex-row-reverse" : ""
                            }`}
                          >
                            <Phone size={14} className="text-gold/50" />
                            {teacher.phone || "---"}
                          </div>
                        </td>

                        <td className="px-10 py-7">
                          <div
                            className={`flex gap-3 ${
                              isRTL ? "justify-start" : "justify-end"
                            }`}
                          >
                            <ActionButton
                              icon={<Eye size={18} />}
                              type="view"
                              onClick={() =>
                                navigate(`/admin/teacher/${teacher._id}/view`)
                              }
                            />
                            <ActionButton
                              icon={<Edit size={18} />}
                              type="edit"
                              onClick={() =>
                                navigate(`/admin/teacher/${teacher._id}/edit`)
                              }
                            />
                            <ActionButton
                              icon={<Trash2 size={18} />}
                              type="delete"
                              onClick={() =>
                                handleDelete(teacher._id, fullName)
                              }
                            />
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, type, onClick }) {
  const styles = {
    view: "hover:text-gold hover:border-gold/30",
    edit: "hover:text-blue-400 hover:border-blue-400/30",
    delete: "hover:text-red-500 hover:border-red-500/30",
  };

  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-xl glass border border-white/5 text-white/30 transition-all active:scale-90 shadow-lg ${styles[type]}`}
    >
      {icon}
    </button>
  );
}
