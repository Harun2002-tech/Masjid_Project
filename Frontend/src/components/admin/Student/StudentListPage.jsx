import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Loader2,
  Search,
  Hash,
  Users,
  User,
  AlertCircle,
} from "lucide-react";
import studentService from "../../../services/studentService";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../contexts/language-context";
import DataTableSkeleton from "../../ui/DataTableSkeleton";

const translations = {
  am: {
    title: "የተማሪዎች",
    subtitle: "ዝርዝር",
    admin: "አስተዳዳሪ ክፍል",
    total: "በአጠቃላይ",
    registered: "ተመዝግበዋል",
    addBtn: "አዲስ ተማሪ",
    searchPlaceholder: "በስም፣ በ ID ወይም በስልክ ይፈልጉ...",
    thStudent: "ተማሪ",
    thLevel: "ደረጃ / ፈረቃ",
    thPhone: "ስልክ",
    thActions: "እርምጃ",
    loadingText: "መረጃ እየመጣ ነው...",
    noResult: "ምንም ተማሪ አልተገኘም",
    deleteConfirm: "እርግጠኛ ነዎት? ተማሪው በቋሚነት ይሰረዛል።",
  },
  en: {
    title: "Student",
    subtitle: "Management",
    admin: "ADMIN PANEL",
    total: "Total",
    registered: "students",
    addBtn: "Add Student",
    searchPlaceholder: "Search by name, ID or phone...",
    thStudent: "Student",
    thLevel: "Level / Shift",
    thPhone: "Phone",
    thActions: "Actions",
    loadingText: "Fetching records...",
    noResult: "No records found",
    deleteConfirm: "Are you sure? This action is permanent.",
  },
  ar: {
    title: "إدارة",
    subtitle: "الطلاب",
    admin: "لوحة التحكم",
    total: "الإجمالي",
    registered: "طالب مسجل",
    addBtn: "إضافة طالب",
    searchPlaceholder: "ابحث بالاسم أو الهوية...",
    thStudent: "الطالب",
    thLevel: "المستوى",
    thPhone: "الهاتف",
    thActions: "إجراءات",
    loadingText: "جاري التحميل...",
    noResult: "لا يوجد نتائج",
    deleteConfirm: "هل أنت متأكد؟ سيتم حذف البيانات نهائيًا.",
  },
};

export default function StudentListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const context = useLanguage();
  const language = context?.language || "am";
  const t = translations[language] || translations["am"];
  const isRTL = language === "ar";

  const [searchTerm, setSearchTerm] = React.useState("");

  const API_BASE_URL = "https://api.ruhamaislamiccenter.com";

  // Cached list: renders instantly on revisit while refetching in background.
  const {
    data: students = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const result = await studentService.getAllStudents();
      if (!result.success) throw new Error(result.message || "Failed to load");
      return Array.isArray(result.data) ? result.data : [];
    },
  });

  // Optimistic delete: remove from cache immediately, roll back on failure.
  const deleteMutation = useMutation({
    mutationFn: (id) => studentService.deleteStudent(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["students"] });
      const previous = queryClient.getQueryData(["students"]);
      queryClient.setQueryData(["students"], (old) =>
        (old || []).filter((s) => s.id !== id)
      );
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["students"], ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["students"] }),
  });

  const handleDelete = async (id, name) => {
    if (!window.confirm(`${name}: ${t.deleteConfirm}`)) return;
    deleteMutation.mutate(id);
  };

  const filtered = useMemo(() => {
    const s = searchTerm.toLowerCase().trim();
    return students.filter(
      (st) =>
        `${st.firstName} ${st.lastName}`.toLowerCase().includes(s) ||
        (st.studentID || "").toLowerCase().includes(s) ||
        (st.phone || "").includes(s)
    );
  }, [students, searchTerm]);

  if (isLoading) {
    return (
      <div
        className={`p-6 md:p-12 min-h-screen text-white overflow-x-hidden ${
          isRTL ? "text-right" : "text-left"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="h-10 w-64 rounded-2xl bg-white/5 animate-pulse" />
          <div className="h-16 w-full rounded-2xl bg-white/5 animate-pulse" />
          <DataTableSkeleton rows={6} isRTL={isRTL} />
        </div>
      </div>
    );
  }

  return (
    // 'w-full' እና 'overflow-hidden' መጨመሩ ለ RTL ችግር ወሳኝ ነው
    <div
      className={`p-6 md:p-12 min-h-screen text-white overflow-x-hidden ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* HEADER AREA */}
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
                {t.admin}
              </span>
            </div>
            <h1 className="text-4xl font-serif font-black italic tracking-tight uppercase text-gold-glow">
              {t.title}{" "}
              <span className="text-gold-glow italic">{t.subtitle}</span>
            </h1>
            <div
              className={`flex items-center gap-3 glass px-4 py-2 rounded-full w-fit ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse shadow-[0_0_10px_#fbbf24]"></span>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
                {t.total} <span className="text-white">{students.length}</span>{" "}
                {t.registered}
              </p>
              {isFetching && !isLoading ? (
                <Loader2 size={12} className="text-gold/60 animate-spin" />
              ) : null}
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/add-student")}
            className="btn-gold px-10 py-5 rounded-2xl flex items-center gap-3 font-black uppercase tracking-[0.2em] text-xs shadow-2xl"
          >
            <UserPlus size={18} /> {t.addBtn}
          </button>
        </div>

        {/* SEARCH AREA */}
        <div className="relative group w-full">
          <Search
            className={`absolute ${
              isRTL ? "right-6" : "left-6"
            } top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gold transition-all`}
            size={22}
          />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className={`payment-input w-full h-18 py-6 rounded-2xl outline-none text-base font-medium shadow-2xl transition-all ${
              isRTL ? "pr-16 pl-6" : "pl-16 pr-6"
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* DATA TABLE (The main fix is here) */}
        <div className="glass rounded-[2.5rem] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/[0.03] text-gray-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-white/5">
                  <th className="px-10 py-8 text-inherit">{t.thStudent}</th>
                  <th className="px-10 py-8 text-inherit">{t.thLevel}</th>
                  <th className="px-10 py-8 text-inherit">{t.thPhone}</th>
                  <th
                    className={`px-10 py-8 text-inherit ${
                      isRTL ? "text-left" : "text-right"
                    }`}
                  >
                    {t.thActions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {filtered.map((student, index) => {
                    const studentId = student._id || student.id;
                    const fullName = `${student.firstName} ${student.lastName}`;
                    return (
                      <motion.tr
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={studentId || index}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-10 py-8">
                          <div className={`flex items-center gap-5`}>
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl shrink-0">
                              {student.photo ? (
                                <img
                                  src={
                                    student.photo.startsWith("http")
                                      ? student.photo
                                      : `${API_BASE_URL}/${student.photo.replace(
                                          /\\/g,
                                          "/"
                                        )}`
                                  }
                                  className="w-full h-full object-cover"
                                  alt=""
                                />
                              ) : (
                                <User size={24} className="text-gold/20" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-white text-lg truncate group-hover:text-gold transition-colors">
                                {fullName}
                              </div>
                              <div className="text-[10px] text-gray-500 font-mono mt-1 flex items-center gap-1 uppercase tracking-tighter">
                                <Hash size={12} className="text-gold/40" />{" "}
                                {student.studentID}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-black text-gold uppercase tracking-widest">
                              {student.gradeLevel}
                            </span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                              {student.shift}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-sm font-mono text-gray-400 font-medium">
                          {student.phone}
                        </td>
                        <td className="px-10 py-8">
                          <div
                            className={`flex gap-3 ${
                              isRTL ? "justify-start" : "justify-end"
                            }`}
                          >
                            <ActionButton
                              icon={<Eye size={18} />}
                              type="gold"
                              onClick={() =>
                                studentId && navigate(`/admin/student/${studentId}/view`)
                              }
                            />
                            <ActionButton
                              icon={<Edit size={18} />}
                              type="gold"
                              onClick={() =>
                                studentId && navigate(`/admin/student/${studentId}/edit`)
                              }
                            />
                            <ActionButton
                              icon={<Trash2 size={18} />}
                              type="red"
                              onClick={() =>
                                studentId && handleDelete(studentId, fullName)
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

          {filtered.length === 0 && (
            <div className="py-24 text-center flex flex-col items-center gap-4 opacity-20">
              <AlertCircle size={48} className="text-gold" />
              <p className="text-xs font-black uppercase tracking-[0.3em]">
                {t.noResult}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, type, onClick }) {
  const styles = {
    gold: "text-gold hover:bg-gold hover:text-black border-gold/10",
    red: "text-red hover:bg-red hover:text-white border-red/10",
  };
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-xl border transition-all active:scale-90 bg-white/[0.03] shadow-lg ${styles[type]}`}
    >
      {icon}
    </button>
  );
}
