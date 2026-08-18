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
  XCircle,
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
  Printer,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "../../../components/ui/ImageUpload";

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
  disabled = false, // እዚህ ላይ የነበረው 'disable' ወደ 'disabled' ተስተካክሏል
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

// Application status badge
const StatusBadge = ({ status, t }) => {
  if (!status) return null;
  const map = {
    pending: { label: t.pending, cls: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
    approved: { label: t.approved, cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
    rejected: { label: t.rejected, cls: "bg-red-500/15 text-red-400 border-red-500/20" },
  };
  const s = map[status];
  if (!s) return null;
  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${s.cls}`}>
      {s.label}
    </span>
  );
};

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
      pending: "በመጠባበቅ ላይ",
      approved: "የጸደቀ",
      rejected: "ውድቅ የተደረገ",
      approve: "ማመልከቻውን አጽድቅ",
      reject: "ማመልከቻውን ውድቅ አድርግ",
      confirmApprove: "ይህንን ተማሪ ማጽደቅ ትፈልጋለህ?",
      confirmReject: "ይህንን ማመልከቻ ውድቅ ማድረግ ትፈልጋለህ?",
      rejectReasonPrompt: "የውድቅ ምክንያት (አማራጭ):",
      approvedMsg: "ተማሪው ጸድቋል",
      rejectedMsg: "ማመልከቻው ውድቅ ተደርጓል",
      actionError: "ስህተት ተከስቷል፣ እባክዎ ደግመው ይሞክሩ",
      print: "አትም / ፒዲኤፍ",
      printProfile: "የተማሪ መረጃ አትም",
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
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      approve: "Approve Application",
      reject: "Reject Application",
      confirmApprove: "Approve this student?",
      confirmReject: "Reject this application?",
      rejectReasonPrompt: "Reason for rejection (optional):",
      approvedMsg: "Student approved",
      rejectedMsg: "Application rejected",
      actionError: "Something went wrong, please try again",
      print: "Print / Download PDF",
      printProfile: "Student Profile Record",
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
      pending: "قيد الانتظار",
      approved: "مقبول",
      rejected: "مرفوض",
      approve: "قبول الطلب",
      reject: "رفض الطلب",
      confirmApprove: "هل تريد قبول هذا الطالب؟",
      confirmReject: "هل تريد رفض هذا الطلب؟",
      rejectReasonPrompt: "سبب الرفض (اختياري):",
      approvedMsg: "تم قبول الطالب",
      rejectedMsg: "تم رفض الطلب",
      actionError: "حدث خطأ، يرجى المحاولة مرة أخرى",
      print: "طباعة / تنزيل PDF",
      printProfile: "سجل بيانات الطالب",
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
    applicationStatus: "",
  });

  const [photo, setPhoto] = useState(null);
  const [studentIDPhoto, setStudentIDPhoto] = useState(null);
  const [emergencyIDPhoto, setEmergencyIDPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [emergencyIdPreview, setEmergencyIdPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [actionLoading, setActionLoading] = useState(""); // "approve" | "reject" | ""
  const [msg, setMsg] = useState({ type: "", text: "" });

  const API_BASE_URL = "https://api.ruhamaislamiccenter.com";
  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        try {
          setFetching(true);
          const res = await axios.get(`${API_BASE_URL}/api/students/${id}`, authHeader);
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
            applicationStatus: data.applicationStatus || "",
          }));
          if (data.photo)
            setPhotoPreview(
              data.photo.startsWith("http")
                ? data.photo
                : `${API_BASE_URL}/${data.photo.replace(/\\/g, "/")}`
            );
          if (data.studentIDPhoto)
            setIdPreview(
              data.studentIDPhoto.startsWith("http")
                ? data.studentIDPhoto
                : `${API_BASE_URL}/${data.studentIDPhoto.replace(/\\/g, "/")}`
            );
          if (data.emergencyIDPhoto)
            setEmergencyIdPreview(
              data.emergencyIDPhoto.startsWith("http")
                ? data.emergencyIDPhoto
                : `${API_BASE_URL}/${data.emergencyIDPhoto.replace(/\\/g, "/")}`
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

  // ✅ ማመልከቻ ማጽደቅ
  const handleApprove = async () => {
    if (!window.confirm(t.confirmApprove)) return;
    try {
      setActionLoading("approve");
      const res = await axios.put(
        `${API_BASE_URL}/api/students/${id}/approve`,
        {},
        authHeader
      );
      setFormData((prev) => ({
        ...prev,
        applicationStatus: "approved",
        studentID: res.data?.data?.studentID || prev.studentID,
      }));
      setMsg({ type: "success", text: t.approvedMsg });
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || t.actionError });
    } finally {
      setActionLoading("");
    }
  };

  // ❌ ማመልከቻ ውድቅ ማድረግ
  const handleReject = async () => {
    if (!window.confirm(t.confirmReject)) return;
    const reason = window.prompt(t.rejectReasonPrompt) || "";
    try {
      setActionLoading("reject");
      await axios.put(
        `${API_BASE_URL}/api/students/${id}/reject`,
        { reason },
        authHeader
      );
      setFormData((prev) => ({ ...prev, applicationStatus: "rejected" }));
      setMsg({ type: "success", text: t.rejectedMsg });
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || t.actionError });
    } finally {
      setActionLoading("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (!isEditMode && key === "studentID") return;
        if (key === "applicationStatus") return;
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

      if (isEditMode) {
        await axios.put(
          `${API_BASE_URL}/api/students/${id}`,
          formDataToSend,
          authHeader
        );
        setMsg({ type: "success", text: t.successMsg });
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/api/students`,
          formDataToSend,
          authHeader
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

  const isPending = isEditMode && formData.applicationStatus === "pending";

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div
        dir={dir}
        className={`min-h-screen py-20 px-4 md:px-10 selection:bg-gold/30 print:hidden ${
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
            <div>
              <h1 className="text-4xl font-bold tracking-tighter">
                {t.title}{" "}
                <span className="text-gold-glow uppercase italic">
                  {t.action}
                </span>
              </h1>
              {isEditMode && formData.applicationStatus && (
                <div className="mt-3">
                  <StatusBadge status={formData.applicationStatus} t={t} />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Print / Download PDF — shown on the profile view page */}
            {isViewOnly && (
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-gold text-black font-black uppercase text-[10px] tracking-widest shadow-xl hover:brightness-110 transition-all"
              >
                <Printer size={16} /> {t.print}
              </button>
            )}

            {/* Approve / Reject actions — only shown for pending applications */}
            {isPending && (
              <>
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={actionLoading !== ""}
                  className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-40"
                >
                  {actionLoading === "approve" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                  {t.approve}
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={actionLoading !== ""}
                  className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 text-white/50 border border-white/10 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/20 transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-40"
                >
                  {actionLoading === "reject" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <XCircle size={16} />
                  )}
                  {t.reject}
                </button>
              </>
            )}

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
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 lg:self-start">
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
                {!isViewOnly && (
                  <ImageUpload
                    preview={photoPreview}
                    onFileSelect={(file) => {
                      setPhoto(file);
                      setPhotoPreview(URL.createObjectURL(file));
                    }}
                    label=""
                    uploadText={t.upload}
                    changeText={t.change}
                    icon={Camera}
                    rounded="rounded-full"
                    triggerClassName="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                    previewClassName="rounded-full"
                    cameraFacing="user"
                    showHelperText={false}
                  />
                )}
              </div>
              <div className="space-y-3 mb-8 text-left">
                <label
                  className={`text-[10px] font-black text-gray-400 uppercase tracking-widest block ${
                    isRTL ? "text-right mr-4" : "ml-4"
                  }`}
                >
                  {t.idCard}
                </label>
                <ImageUpload
                  preview={idPreview}
                  disabled={isViewOnly}
                  label=""
                  uploadText={t.upload}
                  changeText={t.change}
                  helperText={t.idCard}
                  icon={FileText}
                  rounded="rounded-3xl"
                  triggerClassName="min-h-[180px] flex items-center justify-center bg-white/5"
                  previewClassName="w-full h-32 object-contain rounded-xl mb-2"
                  onFileSelect={(file) => {
                    setStudentIDPhoto(file);
                    setIdPreview(URL.createObjectURL(file));
                  }}
                  showHelperText={false}
                />
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
                    disabled={isViewOnly}
                  />
                  <FormField
                    label={t.lname}
                    name="lastName"
                    icon={User}
                    value={formData.lastName}
                    onChange={handleChange}
                    isRTL={isRTL}
                    disabled={isViewOnly}
                  />
                  <FormField
                    label={t.email}
                    name="email"
                    icon={Globe}
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    isRTL={isRTL}
                    disabled={isViewOnly}
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
                      disabled={isViewOnly}
                    />
                  )}
                  <FormField
                    label={t.phone}
                    name="phone"
                    icon={Phone}
                    value={formData.phone}
                    onChange={handleChange}
                    isRTL={isRTL}
                    disabled={isViewOnly}
                  />
                  <FormField
                    label={t.nationality}
                    name="nationality"
                    icon={Globe}
                    value={formData.nationality}
                    onChange={handleChange}
                    isRTL={isRTL}
                    disabled={isViewOnly}
                  />
                  <FormField
                    label={t.birthDate}
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    disabled={isViewOnly}
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
                    disabled={isViewOnly}
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
                    disabled={isViewOnly}
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
                    disabled={isViewOnly}
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
                    disabled={isViewOnly}
                  />
                  <FormField
                    label={t.subCity}
                    name="subCity"
                    value={formData.subCity}
                    onChange={handleChange}
                    isRTL={isRTL}
                    disabled={isViewOnly}
                  />
                  <FormField
                    label={t.woreda}
                    name="woreda"
                    value={formData.woreda}
                    onChange={handleChange}
                    isRTL={isRTL}
                    disabled={isViewOnly}
                  />
                  <FormField
                    label={t.kebele}
                    name="kebele"
                    value={formData.kebele}
                    onChange={handleChange}
                    isRTL={isRTL}
                    disabled={isViewOnly}
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
                    disabled={isViewOnly}
                  />
                  <FormField
                    label={t.shift}
                    name="shift"
                    options={["Morning", "Afternoon", "Night"]}
                    icon={Activity}
                    value={formData.shift}
                    onChange={handleChange}
                    isRTL={isRTL}
                    disabled={isViewOnly}
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
                        {!isViewOnly && (
                          <X
                            size={14}
                            className="cursor-pointer hover:scale-125 transition-transform"
                            onClick={() => removeSubject(i)}
                          />
                        )}
                      </span>
                    ))}
                    {!isViewOnly && (
                      <input
                        onKeyDown={handleAddSubject}
                        className={`bg-transparent outline-none text-sm font-bold flex-1 placeholder:text-gray-600 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                        placeholder={t.subPlaceholder}
                      />
                    )}
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
                    disabled={isViewOnly}
                  />
                  <FormField
                    label={t.relation}
                    name="emergencyRelation"
                    icon={Info}
                    value={formData.emergencyRelation}
                    onChange={handleChange}
                    isRTL={isRTL}
                    disabled={isViewOnly}
                  />
                  <FormField
                    label={t.phone}
                    name="emergencyPhone"
                    icon={Phone}
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    isRTL={isRTL}
                    disabled={isViewOnly}
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
                    disabled={isViewOnly}
                  />
                  <FormField
                    label={t.subCity}
                    name="emergencySubCity"
                    value={formData.emergencySubCity}
                    onChange={handleChange}
                    isRTL={isRTL}
                    disabled={isViewOnly}
                  />
                  <FormField
                    label={t.woreda}
                    name="emergencyWoreda"
                    value={formData.emergencyWoreda}
                    onChange={handleChange}
                    isRTL={isRTL}
                    disabled={isViewOnly}
                  />
                  <FormField
                    label={t.kebele}
                    name="emergencyKebele"
                    value={formData.emergencyKebele}
                    onChange={handleChange}
                    isRTL={isRTL}
                    disabled={isViewOnly}
                  />
                </div>

                <ImageUpload
                  preview={emergencyIdPreview}
                  disabled={isViewOnly}
                  label=""
                  uploadText={t.emergencyID}
                  changeText={t.change}
                  helperText={t.emergencyID}
                  icon={FileText}
                  rounded="rounded-[2rem]"
                  triggerClassName="min-h-[180px] flex items-center justify-center bg-white/5 border border-red-500/20"
                  previewClassName="h-32 object-contain rounded-xl mb-4"
                  onFileSelect={(file) => {
                    setEmergencyIDPhoto(file);
                    setEmergencyIdPreview(URL.createObjectURL(file));
                  }}
                  showHelperText={false}
                />
              </section>

              {!isViewOnly && (
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
              )}
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

      {/* Print / PDF export template — visible only when printing */}
      <div className="hidden print:block">
        <StudentPrintTemplate
          formData={formData}
          photoPreview={photoPreview}
          idPreview={idPreview}
          emergencyIdPreview={emergencyIdPreview}
          t={t}
          isRTL={isRTL}
        />
      </div>
    </>
  );
}

function PrintField({ label, value }) {
  return (
    <div className="mb-3">
      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">
        {label}
      </p>
      <p className="text-sm font-semibold text-black">
        {value || "—"}
      </p>
    </div>
  );
}

function PrintSection({ title, children }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-5 w-1 bg-black rounded-full"></div>
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-black">
          {title}
        </h2>
      </div>
      <div className="border border-gray-300 rounded-lg p-5">{children}</div>
    </div>
  );
}

function StudentPrintTemplate({
  formData,
  photoPreview,
  idPreview,
  emergencyIdPreview,
  t,
  isRTL,
}) {
  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-white text-black p-8"
      style={{ fontFamily: "'Noto Sans Ethiopic', 'Inter', sans-serif" }}
    >
      {/* Document Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-5 mb-8">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-black">
            Ruhama Islamic Center
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold mt-1">
            {t.printProfile}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">
            Student ID
          </p>
          <p className="text-lg font-black text-black">
            {formData.studentID || "—"}
          </p>
          <p className="text-[9px] text-gray-500 mt-1">
            {t.regDate}: {formData.joinDate || "—"}
          </p>
          <p className="text-[9px] text-gray-500">
            Printed: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Photo + Documents */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="text-center">
          <div className="border-2 border-gray-300 h-36 w-32 mx-auto flex items-center justify-center overflow-hidden bg-white">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Student"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-[10px] font-bold uppercase">
                No photo
              </span>
            )}
          </div>
          <p className="text-[9px] uppercase tracking-widest text-gray-500 mt-2 font-black">
            Student Photo
          </p>
        </div>
        <div className="text-center">
          <div className="border-2 border-gray-300 h-36 w-32 mx-auto flex items-center justify-center overflow-hidden bg-white">
            {idPreview ? (
              <img
                src={idPreview}
                alt="ID"
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-gray-400 text-[10px] font-bold uppercase">
                No ID
              </span>
            )}
          </div>
          <p className="text-[9px] uppercase tracking-widest text-gray-500 mt-2 font-black">
            ID Document
          </p>
        </div>
        <div className="text-center">
          <div className="border-2 border-gray-300 h-36 w-32 mx-auto flex items-center justify-center overflow-hidden bg-white">
            {emergencyIdPreview ? (
              <img
                src={emergencyIdPreview}
                alt="Emergency ID"
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-gray-400 text-[10px] font-bold uppercase">
                No ID
              </span>
            )}
          </div>
          <p className="text-[9px] uppercase tracking-widest text-gray-500 mt-2 font-black">
            Emergency Contact ID
          </p>
        </div>
      </div>

      {/* Sections */}
      <PrintSection title="1. Personal Information">
        <div className="grid grid-cols-3 gap-x-6">
          <PrintField label={t.fname} value={formData.firstName} />
          <PrintField label={t.lname} value={formData.lastName} />
          <PrintField label={t.gender} value={formData.gender} />
          <PrintField label={t.email} value={formData.email} />
          <PrintField label={t.phone} value={formData.phone} />
          <PrintField label={t.nationality} value={formData.nationality} />
          <PrintField label={t.birthDate} value={formData.birthDate} />
          <PrintField
            label={t.maritalStatus}
            value={formData.maritalStatus}
          />
          <PrintField label={t.disability} value={formData.disability} />
        </div>
      </PrintSection>

      <PrintSection title="2. Residential Address">
        <div className="grid grid-cols-4 gap-x-6">
          <PrintField label={t.region} value={formData.region} />
          <PrintField label={t.subCity} value={formData.subCity} />
          <PrintField label={t.woreda} value={formData.woreda} />
          <PrintField label={t.kebele} value={formData.kebele} />
          <PrintField label={t.address} value={formData.address} />
        </div>
      </PrintSection>

      <PrintSection title="3. Education Info">
        <div className="grid grid-cols-2 gap-x-6">
          <PrintField label={t.level} value={formData.gradeLevel} />
          <PrintField label={t.shift} value={formData.shift} />
          <div className="col-span-2">
            <PrintField
              label={t.subjects}
              value={formData.subjects?.join(", ")}
            />
          </div>
        </div>
      </PrintSection>

      <PrintSection title="4. Emergency Contact">
        <div className="grid grid-cols-3 gap-x-6">
          <PrintField
            label={t.emergencyName}
            value={formData.emergencyName}
          />
          <PrintField
            label={t.relation}
            value={formData.emergencyRelation}
          />
          <PrintField label={t.phone} value={formData.emergencyPhone} />
          <PrintField label={t.region} value={formData.emergencyRegion} />
          <PrintField
            label={t.subCity}
            value={formData.emergencySubCity}
          />
          <PrintField label={t.woreda} value={formData.emergencyWoreda} />
          <PrintField label={t.kebele} value={formData.emergencyKebele} />
        </div>
      </PrintSection>

      {/* Signature Block */}
      <div className="flex justify-between gap-10 mt-12 pt-6 border-t border-gray-300">
        <div className="w-1/2">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
            Student Signature
          </p>
          <div className="h-12 border-b border-gray-400 mt-8"></div>
        </div>
        <div className="w-1/2 text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
            Administrator Signature
          </p>
          <div className="h-12 border-b border-gray-400 mt-8"></div>
        </div>
      </div>
    </div>
  );
}
