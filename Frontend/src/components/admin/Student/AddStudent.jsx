import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useLanguage } from "../../../contexts/language-context";
import {
  User,
  Save,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Phone,
  Calendar,
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// FormField Component
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
        className={`w-full payment-input rounded-2xl px-6 py-4 outline-none font-bold appearance-none transition-all cursor-pointer ${
          isRTL ? "text-right" : "text-left"
        }`}
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
        placeholder={placeholder}
        className={`w-full payment-input rounded-2xl px-6 py-4 outline-none font-bold placeholder:text-gray-600 transition-all ${
          isRTL ? "text-right" : "text-left"
        }`}
      />
    )}
  </div>
);

export default function AddStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!id;
  const { language, dir } = useLanguage();
  const isRTL = dir === "rtl";
  const isViewOnly = location.pathname.includes("/view");

  const translations = {
    am: {
      title: isEditMode ? "ተማሪ" : "አዲስ",
      action: isEditMode ? "አዘምን" : "ምዝገባ",
      regDate: "የምዝገባ ቀን",
      personal: "የግል መረጃ",
      fname: "የመጀመሪያ ስም",
      lname: "የአባት ስም",
      email: "ኢሜል",
      password: "የይለፍ ቃል",
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
      address: "አድራሻ",
      edu: "የትምህርት መረጃ",
      level: "ደረጃ",
      shift: "ፈረቃ",
      subjects: "የሚማሯቸው ትምህርቶች (Enter ይጫኑ)",
      subPlaceholder: "ትምህርት ይጨምሩ...",
      emergency: "የአደጋ ጊዜ ተጠሪ",
      emergencyName: "የተጠሪ ስም",
      relation: "ዝምድና",
      emergencyID: "ተጠሪ መታወቂያ ጫን",
      idCard: "ተማሪ መታወቂያ (ID Card)",
      upload: "ፎቶ ይምረጡ",
      change: "ቀይር",
      save: isEditMode ? "መረጃውን አዘምን" : "ተማሪውን መዝግብ",
      successMsg: isEditMode ? "የተማሪው መረጃ ታድሷል!" : "ተማሪው በትክክል ተመዝግቧል!",
    },
    en: {
      title: isEditMode ? "Update" : "New",
      action: isEditMode ? "Student" : "Enrollment",
      regDate: "Registration Date",
      personal: "Personal Information",
      fname: "First Name",
      lname: "Last Name",
      email: "Email",
      password: "Password",
      phone: "Phone Number",
      gender: "Gender",
      male: "Male",
      female: "Female",
      nationality: "Nationality",
      birthDate: "BirthDate",
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
      address: "Address",
      edu: "Education Info",
      level: "Grade Level",
      shift: "Shift",
      subjects: "Subjects (Press Enter)",
      subPlaceholder: "Add a subject...",
      emergency: "Emergency Contact",
      emergencyName: "Contact Name",
      relation: "Relation",
      emergencyID: "Upload Emergency ID",
      idCard: "Student ID Card",
      upload: "Choose Photo",
      change: "Change",
      save: isEditMode ? "Update Profile" : "Register Student",
      successMsg: "Operation successful!",
    },
    ar: {
      title: isEditMode ? "تحديث" : "تسجيل",
      action: isEditMode ? "بيانات الطالب" : "طالب جديد",
      regDate: "تاريخ التسجيل",
      personal: "معلومات شخصية",
      fname: "الاسم الأول",
      lname: "اسم العائلة",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
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
      address: "العنوان",
      edu: "معلومات الدراسة",
      level: "المستوى",
      shift: "الفترة",
      subjects: "المواد الدراسية (اضغط Enter)",
      subPlaceholder: "أضف مادة...",
      emergency: "جهة اتصال الطوارئ",
      emergencyName: "اسم جهة الاتصال",
      relation: "العلاقة",
      emergencyID: "تحميل الهوية",
      idCard: "بطاقة الطالب",
      upload: "اختر صورة",
      change: "تغيير",
      save: isEditMode ? "تحديث البيانات" : "تسجيل الطالب",
      successMsg: "تمت العملية بنجاح!",
    },
  };

  const t = translations[language] || translations.en;

  const [formData, setFormData] = useState({
    studentID: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    gender: "ወንድ",
    nationality: "ኢትዮጵያዊ",
    birthDate: "",
    birthPlace: "",
    maritalStatus: "ያላገባ",
    disability: "የለብኝም",
    region: "አዲስ አበባ",
    subCity: "",
    woreda: "",
    kebele: "",
    address: "",
    birthDate: "",
    birthPlace: "",
    gradeLevel: "Beginner",
    shift: "Morning",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    emergencyRegion: "አዲስ አበባ",
    emergencySubCity: "",
    emergencyWoreda: "",
    emergencyKebele: "",
    subjects: [],
    joinDate: new Date().toISOString().split("T")[0],
  });

  const [photo, setPhoto] = useState(null);
  const [studentIDPhoto, setStudentIDPhoto] = useState(null);
  const [emergencyIDPhoto, setEmergencyIDPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [emergencyIdPreview, setEmergencyIdPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const API_BASE_URL = "http://https://masjid-project.onrender.com";

  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        try {
          setFetching(true);
          const res = await axios.get(`${API_BASE_URL}/api/students/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = res.data.data || res.data;

          setFormData((prev) => ({
            ...prev,
            ...data,
            birthDate: data.birthDate
              ? new Date(data.birthDate).toISOString().split("T")[0]
              : "",
            password: "",
            subjects: Array.isArray(data.subjects) ? data.subjects : [],
            joinDate: data.joinDate
              ? data.joinDate.split("T")[0]
              : prev.joinDate,
          }));
          if (data.photo)
            setPhotoPreview(
              `${API_BASE_URL}/${data.photo.replace(/\\/g, "/")}`
            );
          if (data.studentIDPhoto)
            setIdPreview(
              `${API_BASE_URL}/${data.studentIDPhoto.replace(/\\/g, "/")}`
            );
          if (data.emergencyIDPhoto)
            setEmergencyIdPreview(
              `${API_BASE_URL}/${data.emergencyIDPhoto.replace(/\\/g, "/")}`
            );
        } catch (err) {
          setMsg({ type: "error", text: "መረጃውን መጫን አልተቻለም" });
        } finally {
          setFetching(false);
        }
      };
      fetchStudent();
    }
  }, [id, isEditMode]);

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
        if (!isEditMode && key === "studentID") return;
        if (key === "subjects") {
          formDataToSend.append("subjects", JSON.stringify(formData[key]));
        } else if (
          key === "password" &&
          isEditMode &&
          !formData.password?.trim()
        ) {
          return;
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

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEditMode) {
        await axios.put(
          `${API_BASE_URL}/api/students/${id}`,
          formDataToSend,
          config
        );
        setMsg({ type: "success", text: t.successMsg });
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/api/students`,
          formDataToSend,
          config
        );
        const generatedID = response.data?.data?.studentID || "ተመዝግቧል";
        setMsg({
          type: "success",
          text: `${t.successMsg} ID: ${generatedID} 🎉`,
        });
      }
      setTimeout(() => navigate("/admin/students"), 2500);
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "የመረጃ ስህተት ተከስቷል",
      });
    } finally {
      setLoading(false);
    }
  };

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
        className="max-w-7xl mx-auto pt-10"
      >
        {/* Header Section */}
        <div
          className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 ${
            isRTL ? "md:flex-row-reverse" : ""
          }`}
        >
          <div
            className={`flex items-center gap-6 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Link
              to="/admin/students"
              className="p-4 glass rounded-2xl hover:bg-white/10 transition-all text-gold"
            >
              <ArrowLeft size={20} className={isRTL ? "rotate-180" : ""} />
            </Link>
            <h1 className="text-4xl font-bold tracking-tighter">
              {t.title}{" "}
              <span className="text-gold-glow uppercase italic">
                {t.action}
              </span>
            </h1>
          </div>
          <div className="glass px-8 py-4 rounded-[2rem] flex items-center gap-4 border-gold/20 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
            <Calendar size={18} className="text-gold" />
            <div
              className={`${
                isRTL ? "border-r pr-4" : "border-l pl-4"
              } border-white/10`}
            >
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                {t.regDate}
              </p>
              <p className="text-sm font-bold font-mono text-gold">
                {formData.joinDate}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          {/* Left Column */}
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
              <div className="space-y-3 mb-8 text-left">
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
              <div className="pt-6 border-t border-white/5">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {formData.firstName || "---"} {formData.lastName || "---"}
                </h2>
                <p className="text-[10px] text-gold/60 uppercase font-black mt-1">
                  Student Identity
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="glass p-10 md:p-14 rounded-[3.5rem] border-white/5 space-y-12 shadow-2xl">
              {/* 1. Personal Section */}
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
                  />
                  {!isEditMode && (
                    <FormField
                      label={t.password}
                      name="password"
                      icon={Lock}
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      isRTL={isRTL}
                    />
                  )}
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
                    label={t.birtDate}
                    name="birtDate"
                    type="date"
                    value={formData.birtDate}
                    onChange={handleChange}
                    disable={isViewOnly}
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

              {/* 2. Residential Address Section */}
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

              {/* 3. Education Section */}
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

              {/* 4. Emergency Contact Section */}
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-red-500/10">
                  <FormField
                    label={t.region}
                    name="emergencyRegion"
                    icon={MapPin}
                    value={formData.emergencyRegion}
                    onChange={handleChange}
                    isRTL={isRTL}
                  />
                  <FormField
                    label={t.subCity}
                    name="emergencySubCity"
                    value={formData.emergencySubCity}
                    onChange={handleChange}
                    isRTL={isRTL}
                  />
                  <FormField
                    label={t.woreda}
                    name="emergencyWoreda"
                    value={formData.emergencyWoreda}
                    onChange={handleChange}
                    isRTL={isRTL}
                  />
                  <FormField
                    label={t.kebele}
                    name="emergencyKebele"
                    value={formData.emergencyKebele}
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
                disabled={loading || fetching}
                className="w-full btn-gold py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 shadow-2xl disabled:opacity-50 transition-all hover:scale-[1.01]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}{" "}
                {t.save}
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {msg.text && (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            className={`fixed bottom-10 right-10 p-6 rounded-[2.5rem] shadow-2xl z-50 flex items-center gap-4 border-l-4 ${
              msg.type === "success"
                ? "glass border-gold text-gold-glow"
                : "glass border-red-500 text-red-glow"
            }`}
          >
            {msg.type === "success" ? (
              <CheckCircle2 size={24} />
            ) : (
              <ShieldAlert size={24} />
            )}
            <span className="font-black text-[10px] uppercase tracking-widest leading-none">
              {msg.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
