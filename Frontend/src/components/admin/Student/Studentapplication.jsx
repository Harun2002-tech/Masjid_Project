import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../../../contexts/language-context";
import { useAuth } from "../../../contexts/auth-context";
import {
  User,
  Save,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Phone,
  Info,
  X,
  Heart,
  Globe,
  Activity,
  Camera,
  FileText,
  ShieldAlert,
  MapPin,
  GraduationCap,
  HelpCircle,
  Clock3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// FormField Component (same pattern used across the app)
const FormField = ({
  label,
  icon: Icon,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  options = null,
  isRTL,
  disabled = false,
}) => (
  <div className="space-y-2 group">
    <label
      className={`text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ${
        isRTL ? "flex-row-reverse mr-4" : "ml-4"
      }`}
    >
      {Icon && (
        <Icon
          size={14}
          className="group-focus-within:text-gold transition-colors"
        />
      )}
      {label}
    </label>
    {options ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full payment-input rounded-2xl px-6 py-4 outline-none font-bold appearance-none transition-all cursor-pointer ${
          isRTL ? "text-right" : "text-left"
        } disabled:opacity-50`}
      >
        {options.map((opt) => (
          <option
            key={opt.val || opt}
            value={opt.val || opt}
            className="bg-[#0b1220]"
          >
            {opt.label || opt}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full payment-input rounded-2xl px-6 py-4 outline-none font-bold placeholder:text-gray-600 transition-all ${
          isRTL ? "text-right" : "text-left"
        } disabled:opacity-50`}
      />
    )}
  </div>
);

export default function StudentApplication() {
  const navigate = useNavigate();
  const { language, dir } = useLanguage();
  const { user } = useAuth();
  const isRTL = dir === "rtl";

  const translations = {
    am: {
      back: "ተመለስ",
      title: "የተማሪ",
      action: "ምዝገባ ጥያቄ",
      subtitle: "ይህን ፎርም ይሙሉ፣ አድሚኑ ገምግሞ ካጸደቀው በኋላ ኦፊሴላዊ ተማሪ ይሆናሉ።",
      noticeTitle: "ማመልከቻዎ ወዲያውኑ አይጸድቅም",
      noticeBody:
        "ካስገቡ በኋላ ማመልከቻዎ 'በመጠባበቅ ላይ' ሆኖ ይቀመጣል፤ አድሚኑ ሲያጸድቀው በኢሜል ይነገርዎታል።",
      personal: "የግል መረጃ",
      fname: "የመጀመሪያ ስም",
      lname: "የአባት ስም",
      email: "ኢሜል",
      phone: "ስልክ",
      gender: "ጾታ",
      male: "ወንድ",
      female: "ሴት",
      nationality: "ዜግነት",
      birthDate: "የትውልድ ቀን",
      maritalStatus: "የጋብቻ ሁኔታ",
      disability: "አካላዊ ጉዳት",
      single: "ያላገባ",
      married: "ያገባ",
      none: "የለብኝም",
      has: "አለብኝ",
      addressTitle: "የመኖሪያ አድራሻ",
      region: "ክልል",
      subCity: "ክፍለ ከተማ",
      woreda: "ወረዳ",
      kebele: "ቀበሌ",
      edu: "የትምህርት መረጃ",
      level: "ደረጃ",
      shift: "ፈረቃ",
      subjects: "የሚፈልጓቸው ትምህርቶች (Enter ይጫኑ)",
      subPlaceholder: "ትምህርት ይጨምሩ...",
      emergency: "የአደጋ ጊዜ ተጠሪ",
      emergencyName: "የተጠሪ ስም",
      relation: "ዝምድና",
      emergencyID: "ተጠሪ መታወቂያ ጫን",
      idCard: "የግል መታወቂያ (ID Card)",
      upload: "ፎቶ ይምረጡ",
      change: "ቀይር",
      submit: "ማመልከቻ አስገባ",
      successMsg: "ማመልከቻዎ ተልኳል! አድሚኑ እስኪያጸድቅልዎ ይጠብቁ።",
      errorMsg: "ማመልከቻ ማስገባት አልተቻለም",
    },
    en: {
      back: "Back",
      title: "Student",
      action: "Application",
      subtitle:
        "Fill this form, and once an admin reviews and approves it you'll become an official student.",
      noticeTitle: "Your application won't be approved instantly",
      noticeBody:
        "After submitting, your application stays 'Pending' until an admin reviews it — you'll be notified by email once approved.",
      personal: "Personal Information",
      fname: "First Name",
      lname: "Last Name",
      email: "Email",
      phone: "Phone Number",
      gender: "Gender",
      male: "Male",
      female: "Female",
      nationality: "Nationality",
      birthDate: "Birth Date",
      maritalStatus: "Marital Status",
      disability: "Disability Status",
      single: "Single",
      married: "Married",
      none: "None",
      has: "Yes",
      addressTitle: "Residential Address",
      region: "Region",
      subCity: "Sub City",
      woreda: "Woreda",
      kebele: "Kebele",
      edu: "Education Info",
      level: "Grade Level",
      shift: "Shift",
      subjects: "Subjects you want to study (Press Enter)",
      subPlaceholder: "Add a subject...",
      emergency: "Emergency Contact",
      emergencyName: "Contact Name",
      relation: "Relation",
      emergencyID: "Upload Emergency ID",
      idCard: "Your ID Card",
      upload: "Choose Photo",
      change: "Change",
      submit: "Submit Application",
      successMsg: "Application submitted! Please wait for admin approval.",
      errorMsg: "Could not submit application",
    },
    ar: {
      back: "رجوع",
      title: "طلب",
      action: "تسجيل طالب",
      subtitle:
        "املأ هذه الاستمارة، وبعد مراجعة المسؤول والموافقة عليها ستصبح طالبًا رسميًا.",
      noticeTitle: "لن تتم الموافقة على طلبك فورًا",
      noticeBody:
        "بعد الإرسال، يبقى طلبك 'قيد الانتظار' حتى يراجعه المسؤول — سيتم إعلامك عبر البريد الإلكتروني عند الموافقة.",
      personal: "معلومات شخصية",
      fname: "الاسم الأول",
      lname: "اسم العائلة",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      gender: "الجنس",
      male: "ذكر",
      female: "أنثى",
      nationality: "الجنسية",
      birthDate: "تاريخ الميلاد",
      maritalStatus: "الحالة الاجتماعية",
      disability: "حالة الإعاقة",
      single: "أعزب",
      married: "متزوج",
      none: "لا يوجد",
      has: "يوجد",
      addressTitle: "عنوان السكن",
      region: "المنطقة",
      subCity: "المنطقة الفرعية",
      woreda: "الوردية",
      kebele: "كيبيلي",
      edu: "معلومات الدراسة",
      level: "المستوى",
      shift: "الفترة",
      subjects: "المواد التي ترغب بدراستها (اضغط Enter)",
      subPlaceholder: "أضف مادة...",
      emergency: "جهة اتصال الطوارئ",
      emergencyName: "اسم جهة الاتصال",
      relation: "العلاقة",
      emergencyID: "تحميل الهوية",
      idCard: "بطاقة هويتك",
      upload: "اختر صورة",
      change: "تغيير",
      submit: "إرسال الطلب",
      successMsg: "تم إرسال طلبك! يرجى انتظار موافقة المسؤول.",
      errorMsg: "تعذر إرسال الطلب",
    },
  };

  const t = translations[language] || translations.en;
  const API_BASE_URL = "https://api.ruhamaislamiccenter.com";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    gender: "ወንድ",
    nationality: "ኢትዮጵያዊ",
    birthDate: "",
    maritalStatus: "ያላገባ",
    disability: "የለብኝም",
    region: "አዲስ አበባ",
    subCity: "",
    woreda: "",
    kebele: "",
    gradeLevel: "Beginner",
    shift: "Morning",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    subjects: [],
  });

  const [photo, setPhoto] = useState(null);
  const [studentIDPhoto, setStudentIDPhoto] = useState(null);
  const [emergencyIDPhoto, setEmergencyIDPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [emergencyIdPreview, setEmergencyIdPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e, setter, previewSetter) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
      previewSetter(URL.createObjectURL(file));
    }
  };

  const handleAddSubject = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = e.target.value.trim();
      if (val && !formData.subjects.includes(val)) {
        setFormData({ ...formData, subjects: [...formData.subjects, val] });
        e.target.value = "";
      }
    }
  };

  const removeSubject = (index) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "subjects") {
          formDataToSend.append("subjects", JSON.stringify(formData[key]));
        } else if (
          formData[key] !== undefined &&
          formData[key] !== null &&
          formData[key] !== ""
        ) {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (photo) formDataToSend.append("photo", photo);
      if (studentIDPhoto)
        formDataToSend.append("studentIDPhoto", studentIDPhoto);
      if (emergencyIDPhoto)
        formDataToSend.append("emergencyIDPhoto", emergencyIDPhoto);

      await axios.post(`${API_BASE_URL}/api/students/apply`, formDataToSend, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setMsg({ type: "success", text: t.successMsg });
      setSubmitted(true);
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || t.errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        dir={dir}
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      >
        <div className="glass p-14 rounded-[3rem] max-w-md">
          <CheckCircle2 size={56} className="text-gold mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-3">{t.successMsg}</h2>
          <Link
            to="/dashboard"
            className="inline-block mt-6 btn-gold px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest"
          >
            {t.back}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={dir}
      className={`min-h-screen py-20 px-4 md:px-10 selection:bg-gold/30 ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto pt-10"
      >
        {/* Header */}
        <div
          className={`flex items-center gap-6 mb-6 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <Link
            to="/dashboard"
            className="p-4 glass rounded-2xl hover:bg-white/10 transition-all text-gold"
          >
            <ArrowLeft size={20} className={isRTL ? "rotate-180" : ""} />
          </Link>
          <h1 className="text-4xl font-bold tracking-tighter">
            {t.title}{" "}
            <span className="text-gold-glow uppercase italic">{t.action}</span>
          </h1>
        </div>
        <p className="text-white/40 text-sm font-bold mb-6 max-w-2xl">
          {t.subtitle}
        </p>

        {/* Pending notice */}
        <div
          className={`glass border border-amber-500/20 bg-amber-500/5 rounded-[2rem] p-6 mb-10 flex items-start gap-4 ${
            isRTL ? "flex-row-reverse text-right" : ""
          }`}
        >
          <Clock3 size={22} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-1">
              {t.noticeTitle}
            </h3>
            <p className="text-[11px] text-white/40 font-bold">
              {t.noticeBody}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          {/* Left Column - Photos */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass p-8 rounded-[3.5rem] relative overflow-hidden text-center">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50"></div>
              <div className="relative w-40 h-40 mx-auto mb-8">
                <div className="w-full h-full rounded-full border-2 border-gold/30 p-1.5 shadow-[0_0_40px_rgba(251,191,36,0.15)]">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      className="w-full h-full object-cover rounded-full"
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 rounded-full flex items-center justify-center">
                      <User size={60} className="text-white/10" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-1 right-1 p-3 btn-gold rounded-xl cursor-pointer hover:scale-110 shadow-lg">
                  <Camera size={18} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      handleFileChange(e, setPhoto, setPhotoPreview)
                    }
                    accept="image/*"
                  />
                </label>
              </div>
              <div className="space-y-3 text-left">
                <label
                  className={`text-[10px] font-black text-gray-400 uppercase tracking-widest block ${
                    isRTL ? "text-right mr-4" : "ml-4"
                  }`}
                >
                  {t.idCard}
                </label>
                <div
                  className={`glass rounded-3xl p-4 flex flex-col items-center min-h-[180px] justify-center border-dashed ${
                    idPreview ? "border-gold/50" : "border-white/10"
                  }`}
                >
                  {idPreview ? (
                    <img
                      src={idPreview}
                      className="w-full h-32 object-contain rounded-xl mb-2"
                      alt="ID"
                    />
                  ) : (
                    <FileText size={40} className="text-white/10 mb-2" />
                  )}
                  <label className="cursor-pointer text-gold text-[10px] font-black uppercase tracking-tighter flex items-center gap-2">
                    <Camera size={14} /> {idPreview ? t.change : t.upload}
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange(e, setStudentIDPhoto, setIdPreview)
                      }
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-8 space-y-8">
            <div className="glass p-10 md:p-14 rounded-[3.5rem] border-white/5 space-y-12 shadow-2xl">
              {/* Personal */}
              <section className="space-y-8">
                <div
                  className={`flex items-center gap-4 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="h-8 w-1.5 bg-gold rounded-full shadow-[0_0_15px_#fbbf24]"></div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">
                    {t.personal}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label={t.fname}
                    name="firstName"
                    icon={User}
                    value={formData.firstName}
                    onChange={handleChange}
                    isRTL={isRTL}
                  />
                  <FormField
                    label={t.lname}
                    name="lastName"
                    icon={User}
                    value={formData.lastName}
                    onChange={handleChange}
                    isRTL={isRTL}
                  />
                  <FormField
                    label={t.email}
                    name="email"
                    icon={Globe}
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    isRTL={isRTL}
                    disabled={!!user?.email}
                  />
                  <FormField
                    label={t.phone}
                    name="phone"
                    icon={Phone}
                    value={formData.phone}
                    onChange={handleChange}
                    isRTL={isRTL}
                  />
                  <FormField
                    label={t.nationality}
                    name="nationality"
                    icon={Globe}
                    value={formData.nationality}
                    onChange={handleChange}
                    isRTL={isRTL}
                  />
                  <FormField
                    label={t.birthDate}
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
                  <FormField
                    label={t.maritalStatus}
                    name="maritalStatus"
                    icon={Heart}
                    options={[
                      { val: "ያላገባ", label: t.single },
                      { val: "ያገባ", label: t.married },
                    ]}
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    isRTL={isRTL}
                  />
                  <FormField
                    label={t.disability}
                    name="disability"
                    icon={HelpCircle}
                    options={[
                      { val: "የለብኝም", label: t.none },
                      { val: "አለብኝ", label: t.has },
                    ]}
                    value={formData.disability}
                    onChange={handleChange}
                    isRTL={isRTL}
                  />
                  <FormField
                    label={t.gender}
                    name="gender"
                    options={[
                      { val: "ወንድ", label: t.male },
                      { val: "ሴት", label: t.female },
                    ]}
                    value={formData.gender}
                    onChange={handleChange}
                    isRTL={isRTL}
                  />
                </div>
              </section>

              {/* Address */}
              <section className="space-y-8 pt-10 border-t border-white/5">
                <div
                  className={`flex items-center gap-4 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="h-8 w-1.5 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6]"></div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">
                    {t.addressTitle}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FormField
                    label={t.region}
                    name="region"
                    icon={MapPin}
                    value={formData.region}
                    onChange={handleChange}
                    isRTL={isRTL}
                  />
                  <FormField
                    label={t.subCity}
                    name="subCity"
                    value={formData.subCity}
                    onChange={handleChange}
                    isRTL={isRTL}
                  />
                  <FormField
                    label={t.woreda}
                    name="woreda"
                    value={formData.woreda}
                    onChange={handleChange}
                    isRTL={isRTL}
                  />
                  <FormField
                    label={t.kebele}
                    name="kebele"
                    value={formData.kebele}
                    onChange={handleChange}
                    isRTL={isRTL}
                  />
                </div>
              </section>

              {/* Education */}
              <section className="space-y-8 pt-10 border-t border-white/5">
                <div
                  className={`flex items-center gap-4 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="h-8 w-1.5 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]"></div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">
                    {t.edu}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label={t.level}
                    name="gradeLevel"
                    options={["Beginner", "Intermediate", "Advanced"]}
                    icon={GraduationCap}
                    value={formData.gradeLevel}
                    onChange={handleChange}
                    isRTL={isRTL}
                  />
                  <FormField
                    label={t.shift}
                    name="shift"
                    options={["Morning", "Afternoon", "Night"]}
                    icon={Activity}
                    value={formData.shift}
                    onChange={handleChange}
                    isRTL={isRTL}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className={`text-[10px] font-black text-gray-400 uppercase tracking-widest block ${
                      isRTL ? "mr-4" : "ml-4"
                    }`}
                  >
                    {t.subjects}
                  </label>
                  <div
                    className={`flex flex-wrap gap-2 p-5 glass rounded-2xl min-h-[70px] ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    {formData.subjects.map((sub, i) => (
                      <span
                        key={i}
                        className="bg-gold text-[#0b1220] px-4 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-2 shadow-lg"
                      >
                        {sub}{" "}
                        <X
                          size={14}
                          className="cursor-pointer hover:scale-125 transition-transform"
                          onClick={() => removeSubject(i)}
                        />
                      </span>
                    ))}
                    <input
                      onKeyDown={handleAddSubject}
                      className={`bg-transparent outline-none text-sm font-bold flex-1 placeholder:text-gray-600 ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                      placeholder={t.subPlaceholder}
                    />
                  </div>
                </div>
              </section>

              {/* Emergency Contact */}
              <section className="p-8 glass bg-red-500/5 border border-red-500/10 rounded-[3rem] space-y-8 shadow-inner">
                <div
                  className={`flex items-center gap-4 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="h-8 w-1.5 bg-red-500 rounded-full shadow-[0_0_15px_#ef4444]"></div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-red-400">
                    {t.emergency}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label={t.emergencyName}
                    name="emergencyName"
                    icon={Heart}
                    value={formData.emergencyName}
                    onChange={handleChange}
                    isRTL={isRTL}
                  />
                  <FormField
                    label={t.relation}
                    name="emergencyRelation"
                    icon={Info}
                    value={formData.emergencyRelation}
                    onChange={handleChange}
                    isRTL={isRTL}
                  />
                  <FormField
                    label={t.phone}
                    name="emergencyPhone"
                    icon={Phone}
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    isRTL={isRTL}
                  />
                </div>
                <div className="glass bg-white/5 border border-red-500/20 rounded-[2rem] p-6 flex flex-col items-center">
                  {emergencyIdPreview && (
                    <img
                      src={emergencyIdPreview}
                      className="h-32 object-contain rounded-xl mb-4"
                      alt="Emergency ID"
                    />
                  )}
                  <label className="cursor-pointer bg-red-500/20 text-red-400 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                    {t.emergencyID}{" "}
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange(
                          e,
                          setEmergencyIDPhoto,
                          setEmergencyIdPreview
                        )
                      }
                      accept="image/*"
                    />
                  </label>
                </div>
              </section>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gold py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50 transition-all hover:scale-[1.01]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                {t.submit}
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {msg.text && msg.type === "error" && (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            className="fixed bottom-10 right-10 p-6 rounded-[2.5rem] shadow-2xl z-50 flex items-center gap-4 border-l-4 glass border-red-500 text-red-glow"
          >
            <ShieldAlert size={24} />
            <span className="font-black text-[10px] uppercase tracking-widest leading-none">
              {msg.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
