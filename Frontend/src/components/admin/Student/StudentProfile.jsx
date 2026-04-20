import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  GraduationCap,
  Activity,
  Heart,
  Globe,
  Info,
  Home,
  Loader2,
  Hash,
} from "lucide-react";
import { motion } from "framer-motion";
import studentService from "../../../services/studentService";
import { useLanguage } from "../../../contexts/language-context";

const translations = {
  am: {
    back: "ወደ ዝርዝር ተመለስ",
    edit: "መረጃ አሻሽል",
    personalInfo: "የተማሪው የግል መረጃ",
    academicInfo: "የትምህርት መረጃ",
    address: "የመኖሪያ አድራሻ",
    emergency: "የአደጋ ጊዜ ተጠሪ",
    idPhotos: "የመታወቂያ ፎቶዎች",
    fullName: "ሙሉ ስም",
    email: "ኢሜይል",
    phone: "ስልክ",
    gender: "ጾታ",
    nationality: "ዜግነት",
    marital: "የጋብቻ ሁኔታ",
    disability: "አካል ጉዳት",
    grade: "ደረጃ (Grade)",
    shift: "ፈረቃ (Shift)",
    subjects: "የሚማሯቸው ትምህርቶች",
    region: "ክልል",
    subcity: "ክፍለ ከተማ",
    woreda: "ወረዳ",
    emergencyName: "የተጠሪ ስም",
    relation: "ዝምድና",
    loading: "መረጃው እየተጫነ ነው...",
    error: "ተማሪው አልተገኘም",
  },
  en: {
    back: "Back to List",
    edit: "Edit Profile",
    personalInfo: "Personal Information",
    academicInfo: "Academic Details",
    address: "Residential Address",
    emergency: "Emergency Contact",
    idPhotos: "ID Documents",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    gender: "Gender",
    nationality: "Nationality",
    marital: "Marital Status",
    disability: "Disability",
    grade: "Grade Level",
    shift: "Shift",
    subjects: "Enrolled Subjects",
    region: "Region",
    subcity: "Sub-city",
    woreda: "Woreda",
    emergencyName: "Contact Name",
    relation: "Relationship",
    loading: "Loading profile...",
    error: "Student not found",
  },
  ar: {
    back: "العودة للقائمة",
    edit: "تعديل البيانات",
    personalInfo: "المعلومات الشخصية",
    academicInfo: "المعلومات الأكاديمية",
    address: "عنوان السكن",
    emergency: "جهة الاتصال للطوارئ",
    idPhotos: "صور الهوية",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    gender: "الجنس",
    nationality: "الجنسية",
    marital: "الحالة الاجتماعية",
    disability: "الإعاقة",
    grade: "المستوى الدراسي",
    shift: "الفترة",
    subjects: "المواد الدراسية",
    region: "المنطقة",
    subcity: "المدينة الفرعية",
    woreda: "المنطقة الإدارية",
    emergencyName: "اسم الشخص",
    relation: "صلة القرابة",
    loading: "جاري التحميل...",
    error: "الطالب غير موجود",
  },
};

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language || "am"];
  const isRTL = language === "ar";

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const res = await studentService.getStudentById(id);
        if (res.success) {
          setStudent(res.data);
        } else {
          setError(t.error);
        }
      } catch (err) {
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStudentData();
  }, [id, t.error]);

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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-gold" size={48} />
        <p className="text-gold uppercase tracking-[0.3em] text-[10px] font-bold">
          {t.loading}
        </p>
      </div>
    );

  if (error || !student)
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="glass p-12 rounded-[3rem] space-y-6 max-w-md border-red-500/20">
          <ShieldAlert size={80} className="mx-auto text-red/20" />
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
            {error}
          </h2>
          <Link
            to="/admin/students"
            className="btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={18} /> {t.back}
          </Link>
        </div>
      </div>
    );

  const subjectsList = getSubjects(student.subjects);

  return (
    <div
      className={`w-full min-h-screen py-12 px-4 md:px-10 overflow-x-hidden ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-10"
      >
        {/* Top Navigation */}
        <div
          className={`flex flex-col md:flex-row justify-between items-center gap-6`}
        >
          <Link
            to="/admin/students"
            className={`flex items-center gap-3 text-gray-400 hover:text-gold transition-all uppercase text-[10px] font-black tracking-[0.3em] ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />{" "}
            {t.back}
          </Link>
          <button
            onClick={() => navigate(`/admin/student/${id}/edit`)}
            className="btn-gold px-10 py-4 rounded-xl flex items-center gap-3 font-bold text-xs uppercase tracking-widest"
          >
            {t.edit} <Edit size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: Profile Card */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass p-10 rounded-[3.5rem] text-center relative overflow-hidden shadow-2xl border-white/5">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gold-dark" />
              <div className="w-48 h-48 rounded-[2.5rem] border-4 border-white/5 mx-auto mb-8 overflow-hidden bg-white/5 shadow-2xl p-1">
                {student.photo ? (
                  <img
                    src={getUrl(student.photo)}
                    className="w-full h-full object-cover rounded-[2.2rem]"
                    alt=""
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gold text-5xl font-black italic">
                    {student.firstName?.[0]}
                    {student.lastName?.[0]}
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-black tracking-tight mb-2 text-white uppercase">
                {student.firstName} {student.lastName}
              </h1>
              <div
                className={`flex justify-center gap-2 mb-8 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Badge label={student.gradeLevel} icon={GraduationCap} />
                <Badge label={student.shift} icon={Activity} />
              </div>

              <div className="space-y-4 pt-8 border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
                  {t.idPhotos}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <IdCardPreview
                    label="Student ID"
                    url={getUrl(student.studentIDPhoto)}
                  />
                  <IdCardPreview
                    label="Emergency ID"
                    url={getUrl(student.emergencyIDPhoto)}
                    isRed
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Detailed Info */}
          <div className="lg:col-span-8 space-y-8">
            {/* Personal Section */}
            <InfoSection title={t.personalInfo} iconColor="bg-gold">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DetailRow
                  label={t.fullName}
                  value={`${student.firstName} ${student.lastName}`}
                  icon={User}
                />
                <DetailRow label={t.email} value={student.email} icon={Globe} />
                <DetailRow label={t.phone} value={student.phone} icon={Phone} />
                <DetailRow
                  label={t.gender}
                  value={student.gender}
                  icon={Info}
                />
                <DetailRow
                  label={t.nationality}
                  value={student.nationality}
                  icon={Globe}
                />
                <DetailRow
                  label={t.marital}
                  value={student.maritalStatus}
                  icon={Info}
                />
              </div>
            </InfoSection>

            {/* Academic Section */}
            <InfoSection title={t.academicInfo} iconColor="bg-blue-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <DetailRow
                  label={t.grade}
                  value={student.gradeLevel}
                  icon={GraduationCap}
                />
                <DetailRow
                  label={t.shift}
                  value={student.shift}
                  icon={Activity}
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
                      className="bg-white/5 border border-white/10 text-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-inner"
                    >
                      <CheckCircle2 size={12} /> {sub}
                    </span>
                  ))}
                </div>
              </div>
            </InfoSection>

            {/* Address & Emergency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoSection title={t.address} iconColor="bg-emerald-500">
                <div className="space-y-6">
                  <DetailRow
                    label={t.region}
                    value={student.region}
                    icon={MapPin}
                  />
                  <DetailRow
                    label={t.subcity}
                    value={student.subCity}
                    icon={Home}
                  />
                  <DetailRow
                    label={t.woreda}
                    value={student.woreda}
                    icon={Hash}
                  />
                </div>
              </InfoSection>

              <InfoSection title={t.emergency} iconColor="bg-red">
                <div className="space-y-6">
                  <DetailRow
                    label={t.emergencyName}
                    value={student.emergencyName}
                    icon={Heart}
                  />
                  <DetailRow
                    label={t.relation}
                    value={student.emergencyRelation}
                    icon={Info}
                  />
                  <DetailRow
                    label={t.phone}
                    value={student.emergencyPhone}
                    icon={Phone}
                  />
                </div>
              </InfoSection>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable Components
const InfoSection = ({ title, iconColor, children }) => (
  <div className="glass p-8 md:p-10 rounded-[2.5rem] border-white/5 shadow-2xl relative">
    <div className="flex items-center gap-4 mb-8">
      <div
        className={`h-6 w-1.5 ${iconColor} rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]`}
      ></div>
      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/90">
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
    <p className="text-base font-bold text-white tracking-tight">
      {value || "---"}
    </p>
  </div>
);

const Badge = ({ label, icon: Icon }) => (
  <span className="bg-white/5 text-gold px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 flex items-center gap-2 shadow-inner">
    {Icon && <Icon size={12} />} {label}
  </span>
);

const IdCardPreview = ({ label, url, isRed }) => (
  <div className="space-y-2 text-center">
    <div
      onClick={() => url && window.open(url, "_blank")}
      className={`h-32 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center overflow-hidden cursor-pointer hover:border-gold/30 transition-all group relative shadow-inner`}
    >
      {url ? (
        <img
          src={url}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          alt={label}
        />
      ) : (
        <FileText size={24} className="text-gray-700" />
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[8px] font-black uppercase text-gold">
        View
      </div>
    </div>
    <p className="text-[8px] font-bold uppercase text-gray-600 tracking-tighter">
      {label}
    </p>
  </div>
);

export default StudentProfile;
