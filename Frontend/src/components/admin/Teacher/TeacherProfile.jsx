import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  Phone,
  ArrowLeft,
  Edit,
  MapPin,
  ShieldAlert,
  CheckCircle2,
  FileText,
  User,
  Briefcase,
  BookOpen,
  Globe,
  Info,
  Home,
  Heart,
  Loader2,
  Eye,
  X,
  ZoomIn,
  Hash,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../contexts/language-context";

const translations = {
  am: {
    back: "ወደ ዝርዝር ተመለስ",
    edit: "መረጃ አሻሽል",
    exp: "ዓመት ልምድ",
    teacher: "መምህር",
    bio: "አጭር የህይወት ታሪክ",
    personal: "የሼሁ የግል መረጃ",
    professional: "የሙያ መረጃ",
    address: "የመኖሪያ አድራሻ",
    emergency: "የድንገተኛ አደጋ ተጠሪ",
    loading: "መረጃው እየተጫነ ነው...",
    error: "መረጃው አልተገኘም",
    subjects: "የሙያ ዘርፎች",
  },
  en: {
    back: "Back to List",
    edit: "Update Info",
    exp: "Years Exp",
    teacher: "Teacher",
    bio: "Short Biography",
    personal: "Personal Information",
    professional: "Professional Info",
    address: "Residential Address",
    emergency: "Emergency Contact",
    loading: "Loading profile...",
    error: "Teacher not found",
    subjects: "Subjects",
  },
  ar: {
    back: "العودة للقائمة",
    edit: "تحديث البيانات",
    exp: "سنوات خبرة",
    teacher: "مدرس",
    bio: "سيرة ذاتية",
    personal: "المعلومات الشخصية",
    professional: "المعلومات المهنية",
    address: "عنوان السكن",
    emergency: "جهة اتصال الطوارئ",
    loading: "جاري التحميل...",
    error: "لم يتم العثور",
    subjects: "المواد الدراسية",
  },
};

const TeacherProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language || "am"];
  const isRTL = language === "ar";

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);

  const API_BASE_URL = "http://https://masjid-project.onrender.com";

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/teachers/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTeacher(res.data.data || res.data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTeacher();
  }, [id]);

  const getUrl = (path) =>
    path ? `${API_BASE_URL}/${path.replace(/\\/g, "/")}` : null;

  const getSubjects = (subs) => {
    if (Array.isArray(subs)) return subs;
    if (typeof subs === "string") {
      try {
        return JSON.parse(subs);
      } catch {
        return subs.split(",").filter((s) => s.trim());
      }
    }
    return [];
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0a0a0a]">
        <Loader2 className="animate-spin text-gold" size={48} />
        <p className="text-gold uppercase tracking-[0.3em] text-[10px] font-bold">
          {t.loading}
        </p>
      </div>
    );

  if (!teacher)
    return (
      <div className="text-white text-center py-20 bg-[#0a0a0a]">{t.error}</div>
    );

  const subjectsList = getSubjects(teacher.subjects);

  return (
    <div
      className={`w-full min-h-screen py-12 px-4 md:px-10 overflow-x-hidden bg-[#0a0a0a] text-white ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* --- Image Preview Modal --- */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 cursor-zoom-out"
            onClick={() => setSelectedImg(null)}
          >
            <button className="absolute top-8 right-8 text-white/40 hover:text-gold p-3 glass rounded-full z-[10000]">
              <X size={30} />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={selectedImg}
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border border-white/10 object-contain shadow-inner"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-10"
      >
        {/* Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link
            to="/admin/teachers"
            className={`flex items-center gap-3 text-gray-400 hover:text-gold transition-all uppercase text-[10px] font-black tracking-[0.3em] ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />{" "}
            {t.back}
          </Link>
          <button
            onClick={() => navigate(`/admin/teacher/${id}/edit`)}
            className="btn-gold px-10 py-4 rounded-xl flex items-center gap-3 font-bold text-xs uppercase tracking-widest shadow-2xl"
          >
            {t.edit} <Edit size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: Profile Card */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass p-10 rounded-[3.5rem] text-center relative overflow-hidden shadow-2xl border-white/5">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gold-dark shadow-[0_0_15px_#fbbf24]" />

              {/* Teacher Photo (Clickable) */}
              <div
                className="w-48 h-48 rounded-[2.5rem] border-4 border-white/5 mx-auto mb-8 overflow-hidden bg-white/5 shadow-2xl p-1 cursor-pointer group relative"
                onClick={() =>
                  teacher.photo && setSelectedImg(getUrl(teacher.photo))
                }
              >
                {teacher.photo ? (
                  <>
                    <img
                      src={getUrl(teacher.photo)}
                      className="w-full h-full object-cover rounded-[2.2rem] transition-transform group-hover:scale-110"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="text-gold" size={32} />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gold text-5xl font-black italic">
                    {teacher.firstName?.[0]}
                  </div>
                )}
              </div>

              <h1 className="text-3xl font-black tracking-tight mb-2 text-white uppercase italic">
                {teacher.firstName} {teacher.lastName}
              </h1>
              <div
                className={`flex justify-center gap-2 mb-8 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Badge
                  label={`${teacher.experienceYears || 0} ${t.exp}`}
                  icon={Briefcase}
                />
                <Badge label={t.teacher} icon={BookOpen} />
              </div>

              {/* ID Preview (Clickable) */}
              <div className="space-y-4 pt-8 border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
                  Documents / ID
                </p>
                <div
                  className="h-32 glass border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center cursor-pointer hover:border-gold/30 transition-all overflow-hidden group relative"
                  onClick={() =>
                    teacher.idCard && setSelectedImg(getUrl(teacher.idCard))
                  }
                >
                  {teacher.idCard ? (
                    <>
                      <img
                        src={getUrl(teacher.idCard)}
                        className="max-h-full transition-transform group-hover:scale-105"
                        alt="ID"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="text-gold" size={24} />
                      </div>
                    </>
                  ) : (
                    <FileText size={30} className="text-gray-700 opacity-20" />
                  )}
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-[2rem] border border-gold/10">
              <h3 className="text-[10px] font-black uppercase text-gold mb-3 italic">
                {t.bio}
              </h3>
              <p className="text-sm text-white/60 italic leading-relaxed">
                {teacher.bio || "---"}
              </p>
            </div>
          </div>

          {/* RIGHT: Info Sections */}
          <div className="lg:col-span-8 space-y-8">
            <InfoSection title={t.personal} iconColor="bg-gold">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DetailRow
                  label="Full Name"
                  value={`${teacher.firstName} ${teacher.lastName}`}
                  icon={User}
                />
                <DetailRow label="Email" value={teacher.email} icon={Mail} />
                <DetailRow label="Phone" value={teacher.phone} icon={Phone} />
                <DetailRow label="Gender" value={teacher.gender} icon={Info} />
                <DetailRow
                  label="Nationality"
                  value={teacher.nationality}
                  icon={Globe}
                />
                <DetailRow
                  label="Marital Status"
                  value={teacher.maritalStatus}
                  icon={Info}
                />
              </div>
            </InfoSection>

            <InfoSection title={t.professional} iconColor="bg-blue-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <DetailRow
                  label="Work Experience"
                  value={`${teacher.experienceYears || 0} ${t.exp}`}
                  icon={Briefcase}
                />
                <DetailRow
                  label="Birth Place"
                  value={teacher.birthPlace}
                  icon={MapPin}
                />
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  {t.subjects}
                </p>
                <div
                  className={`flex flex-wrap gap-2 ${
                    isRTL ? "justify-end" : ""
                  }`}
                >
                  {subjectsList.map((sub, i) => (
                    <span
                      key={i}
                      className="glass border border-white/10 text-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-inner"
                    >
                      <CheckCircle2 size={12} /> {sub}
                    </span>
                  ))}
                </div>
              </div>
            </InfoSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoSection title={t.address} iconColor="bg-emerald-500">
                <div className="space-y-6">
                  <DetailRow
                    label="Region"
                    value={teacher.region}
                    icon={MapPin}
                  />
                  <DetailRow
                    label="Sub City"
                    value={teacher.subCity}
                    icon={Home}
                  />
                  <DetailRow
                    label="Woreda"
                    value={teacher.woreda}
                    icon={Hash}
                  />
                </div>
              </InfoSection>

              <InfoSection title={t.emergency} iconColor="bg-red-500">
                <div className={`flex flex-col gap-6`}>
                  <div
                    className="w-20 h-20 rounded-2xl glass border border-white/10 shrink-0 cursor-pointer overflow-hidden group relative p-1 self-start"
                    onClick={() =>
                      teacher.emergencyPhoto &&
                      setSelectedImg(getUrl(teacher.emergencyPhoto))
                    }
                  >
                    {teacher.emergencyPhoto ? (
                      <>
                        <img
                          src={getUrl(teacher.emergencyPhoto)}
                          className="w-full h-full object-cover rounded-xl transition-transform group-hover:scale-110"
                          alt=""
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ZoomIn className="text-gold" size={16} />
                        </div>
                      </>
                    ) : (
                      <User className="w-full h-full p-4 text-white/5" />
                    )}
                  </div>
                  <div className="space-y-6 flex-1">
                    <DetailRow
                      label="Name"
                      value={teacher.emergencyName}
                      icon={Heart}
                    />
                    <DetailRow
                      label="Relation"
                      value={teacher.emergencyRelation}
                      icon={Info}
                    />
                    <DetailRow
                      label="Phone"
                      value={teacher.emergencyPhone}
                      icon={Phone}
                    />
                  </div>
                </div>
              </InfoSection>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Sub-components
const InfoSection = ({ title, iconColor, children }) => (
  <div className="glass p-8 md:p-10 rounded-[2.5rem] border-white/5 shadow-2xl relative">
    <div className="flex items-center gap-4 mb-8">
      <div
        className={`h-6 w-1.5 ${iconColor} rounded-full shadow-[0_0_10px_rgba(251,191,36,0.3)]`}
      ></div>
      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/90 italic">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

const DetailRow = ({ label, value, icon: Icon }) => (
  <div className="space-y-2">
    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
      {Icon && <Icon size={12} className="text-gold/50" />} {label}
    </p>
    <p className="text-base font-bold text-white tracking-tight leading-tight">
      {value || "---"}
    </p>
  </div>
);

const Badge = ({ label, icon: Icon }) => (
  <span className="glass text-gold px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 flex items-center gap-2 shadow-inner">
    {Icon && <Icon size={12} />} {label}
  </span>
);

export default TeacherProfile;
