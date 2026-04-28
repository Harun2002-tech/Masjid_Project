import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ShieldAlert,
  Camera,
  Loader2,
  ArrowLeft,
  Save,
  FileText,
  Image as ImageIcon,
  Calendar,
  GraduationCap,
  Clock,
  BookOpen,
} from "lucide-react";
import teacherService from "../../../services/teacherService";
import { useLanguage } from "../../../contexts/language-context";

const translations = {
  am: {
    back: "ተመለስ",
    viewTitle: "የሼሁ መረጃ",
    editTitle: "መረጃ ማስተካከያ",
    addTitle: "አዲስ ሼህ መመዝገቢያ",
    personalSection: "የግል መለያ መረጃ",
    professionalSection: "የሙያ እና የመታወቂያ መረጃ",
    addressSection: "ሙሉ አድራሻ",
    emergencySection: "የድንገተኛ አደጋ ተጠሪ",
    educationSection: "የትምህርት መረጃ",
    availabilitySection: "የስራ ሰዓት እና ሁኔታ",
    photo: "ፕሮፋይል ፎቶ",
    idCard: "መታወቂያ / ፓስፖርት (ID Card)",
    idUpload: "መታወቂያ ይጫኑ",
    firstName: "የመጀመሪያ ስም",
    lastName: "የአባት ስም",
    email: "ኢሜይል",
    password: "የይለፍ ቃል",
    phone: "ስልክ ቁጥር",
    gender: "ጾታ",
    experienceYears: "የስራ ልምድ (በዓመት)",
    subjects: "የሙያ ዘርፎች (በኮማ ይለዩ)",
    bio: "አጭር የህይወት ታሪክ (Bio)",
    region: "ክልል",
    subCity: "ክፍለ ከተማ",
    woreda: "ወረዳ",
    kebele: "ቀበሌ",
    address: "ልዩ ቦታ / አድራሻ",
    birthDate: "የትውልድ ቀን",
    birthPlace: "የትውልድ ቦታ",
    nationality: "ዜግነት",
    maritalStatus: "የጋብቻ ሁኔታ",
    disability: "አካላዊ ጉዳት", // Amharic
    education: "የትምህርት ደረጃ",
    institute: "የተመረቁበት ተቋም",
    graduationYear: "የተመረቁበት ዓመት",
    ijazah: "ኢጃዛ (ካለዎት)",
    teachingLevel: "የማስተማር ደረጃ",
    availableDays: "የሚሰሩባቸው ቀናት (በኮማ ይለዩ)",
    availableTime: "የሚሰሩበት ሰዓት",
    teachingMethod: "የማስተማር ዘዴ",
    emergencyPhoto: "የተጠሪ ፎቶ",
    emergencyName: "የተጠሪ ስም",
    relation: "ዝምድና",
    save: "መረጃውን መዝግብ",
    update: "ለውጦችን መዝግብ",
    successAdd: "የሼሁ መረጃ በስኬት ተመዝግቧል!",
    successEdit: "የሼሁ መረጃ ተስተካክሏል!",
    error: "ስህተት ተከስቷል። እባክዎ መረጃዎቹን በትክክል መሙላትዎን ያረጋግጡ።",
  },
  en: {
    back: "Back",
    viewTitle: "Teacher Profile",
    editTitle: "Edit Information",
    addTitle: "Register New Teacher",
    personalSection: "Personal Identity",
    professionalSection: "Professional & ID Info",
    addressSection: "Full Address",
    emergencySection: "Emergency Contact",
    educationSection: "Educational Background",
    availabilitySection: "Availability & Methods",
    photo: "Profile Photo",
    idCard: "ID Card / Passport",
    idUpload: "Upload ID",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    password: "Password",
    phone: "Phone Number",
    gender: "Gender",
    experienceYears: "Experience (Years)",
    subjects: "Specialties (Comma separated)",
    bio: "Short Bio",
    region: "Region",
    subCity: "Sub City",
    woreda: "Woreda",
    kebele: "Kebele",
    address: "Specific Address",
    birthDate: "Birth Date",
    birthPlace: "Birth Place",
    nationality: "Nationality",
    maritalStatus: "Marital Status",
    disability: "Disability", // English
    education: "Education Level",
    institute: "Institute",
    graduationYear: "Graduation Year",
    ijazah: "Ijazah",
    teachingLevel: "Teaching Level",
    availableDays: "Available Days",
    availableTime: "Available Time",
    teachingMethod: "Teaching Method",
    emergencyPhoto: "Contact Photo",
    emergencyName: "Contact Name",
    relation: "Relationship",
    save: "Save Information",
    update: "Save Changes",
    successAdd: "Teacher registered successfully!",
    successEdit: "Teacher info updated successfully!",
    error: "An error occurred. Please check your data.",
  },
  ar: {
    back: "رجوع",
    viewTitle: "ملف المعلم",
    editTitle: "تعديل المعلومات",
    addTitle: "تسجيل معلم جديد",
    personalSection: "الهوية الشخصية",
    professionalSection: "المعلومات المهنية والهوية",
    addressSection: "العنوان الكامل",
    emergencySection: "جهة الاتصال للطوارئ",
    educationSection: "الخلفية التعليمية",
    availabilitySection: "التوفر والأساليب",
    photo: "الصورة الشخصية",
    idCard: "بطاقة الهوية / الجواز",
    idUpload: "تحميل الهوية",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    phone: "رقم الهاتف",
    gender: "الجنس",
    experienceYears: "الخبرة (بالسنوات)",
    subjects: "التخصصات (مفصولة بفاصلة)",
    bio: "سيرة ذاتية قصيرة",
    region: "المنطقة",
    subCity: "المدينة الفرعية",
    woreda: "المنطقة الإدارية",
    kebele: "ቀበሌ",
    address: "العنوان بالتفصيل",
    birthDate: "تاريخ الميلاد",
    birthPlace: "مكان الميلاد",
    nationality: "الجنسية",
    maritalStatus: "الحالة الاجتماعية",
    disability: "الإعاقة", // Arabic
    education: "المستوى التعليمي",
    institute: "المعهد",
    graduationYear: "سنة التخرج",
    ijazah: "الإجازة",
    teachingLevel: "مستوى التدريس",
    availableDays: "أيام التوفر",
    availableTime: "وقت التوفر",
    teachingMethod: "طريقة التدريس",
    emergencyPhoto: "صورة الطوارئ",
    emergencyName: "اسم جهة الاتصال",
    relation: "صلة القرابة",
    save: "حفظ المعلومات",
    update: "حفظ التغييرات",
    successAdd: "تم تسجيل المعلم بنجاح!",
    successEdit: "تم تحديث معلومات المعلم بنجاح!",
    error: "حدث خطأ. يرجى التأكد من البيانات الخاصة بك.",
  },
};

export default function AddTeacherPage({ editMode = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language || "am"];
  const isRTL = language === "ar";

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const isViewOnly = location.pathname.includes("/view");
  const actualEditMode = editMode || location.pathname.includes("/edit");

  const [previews, setPreviews] = useState({
    photo: null,
    idCard: null,
    emergencyPhoto: null,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    gender: language === "ar" ? "ذكر" : language === "en" ? "Male" : "ወንድ",
    birthDate: "",
    birthPlace: "",
    nationality: "ኢትዮጵያዊ",
    maritalStatus: "ያላገባ",
    disability: "የለብኝም", // Default value
    region: "አዲስ አበባ",
    subCity: "",
    woreda: "",
    kebele: "",
    address: "",
    education: "",
    institute: "",
    graduationYear: "",
    ijazah: "",
    experienceYears: "",
    subjects: "",
    teachingLevel: "All Levels",
    availableDays: "",
    availableTime: "",
    teachingMethod: "",
    bio: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    emergencyRegion: "አዲስ አበባ",
    emergencySubCity: "",
    emergencyWoreda: "",
    photo: null,
    idCard: null,
    emergencyPhoto: null,
  });

  useEffect(() => {
    if ((actualEditMode || isViewOnly) && id) {
      const fetchTeacherData = async () => {
        try {
          setFetchLoading(true);
          const response = await teacherService.getTeacherById(id);
          if (response.success) {
            const data = response.data;
            setFormData({
              ...data,
              subjects: Array.isArray(data.subjects)
                ? data.subjects.join(", ")
                : data.subjects || "",
              availableDays: Array.isArray(data.availableDays)
                ? data.availableDays.join(", ")
                : data.availableDays || "",
              birthDate: data.birthDate
                ? new Date(data.birthDate).toISOString().split("T")[0]
                : "",
              password: "",
            });

            const API_BASE = "http://localhost:5000";
            setPreviews({
              photo: data.photo
                ? `${API_BASE}/${data.photo.replace(/\\/g, "/")}`
                : null,
              idCard: data.idCard
                ? `${API_BASE}/${data.idCard.replace(/\\/g, "/")}`
                : null,
              emergencyPhoto: data.emergencyPhoto
                ? `${API_BASE}/${data.emergencyPhoto.replace(/\\/g, "/")}`
                : null,
            });
          }
        } catch (err) {
          console.error("Error fetching data:", err);
        } finally {
          setFetchLoading(false);
        }
      };
      fetchTeacherData();
    }
  }, [id, actualEditMode, isViewOnly]);

  const handleChange = (e) => {
    if (isViewOnly) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (isViewOnly) return;
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewOnly) return;
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "subjects" || key === "availableDays") {
          const arr =
            typeof formData[key] === "string"
              ? formData[key].split(",").map((s) => s.trim())
              : formData[key];
          data.append(key, JSON.stringify(arr));
        } else if (formData[key] !== null && key !== "password") {
          data.append(key, formData[key]);
        } else if (key === "password" && formData[key]) {
          data.append(key, formData[key]);
        }
      });

      const response = actualEditMode
        ? await teacherService.updateTeacher(id, data)
        : await teacherService.createTeacher(data);
      if (response.success) {
        alert(actualEditMode ? t.successEdit : t.successAdd);
        navigate("/admin/teachers");
      }
    } catch (err) {
      console.error(err);
      alert(t.error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={40} />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-12 px-6 ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 text-white/50 hover:text-gold transition-all font-bold uppercase text-[11px] tracking-widest ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />{" "}
            {t.back}
          </button>
          <h1 className="text-3xl font-serif font-black italic text-gold-glow uppercase">
            {isViewOnly
              ? t.viewTitle
              : actualEditMode
              ? t.editTitle
              : t.addTitle}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Personal */}
          <Section title={t.personalSection} icon={User} isRTL={isRTL}>
            <div
              className={`flex flex-col md:flex-row gap-10 items-start ${
                isRTL ? "md:flex-row-reverse" : ""
              }`}
            >
              <FileUpload
                label={t.photo}
                name="photo"
                preview={previews.photo}
                onChange={handleFileChange}
                icon={Camera}
                disabled={isViewOnly}
              />
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <InputField
                  label={t.firstName}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={isViewOnly}
                />
                <InputField
                  label={t.lastName}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={isViewOnly}
                />
                <InputField
                  label={t.email}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isViewOnly}
                />
                {!actualEditMode && (
                  <InputField
                    label={t.password}
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isViewOnly}
                  />
                )}
                <InputField
                  label={t.phone}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={isViewOnly}
                />
                <SelectField
                  label={t.gender}
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={
                    language === "ar"
                      ? ["ذكر", "أنثى"]
                      : language === "en"
                      ? ["Male", "Female"]
                      : ["ወንድ", "ሴት"]
                  }
                  disabled={isViewOnly}
                />
                <InputField
                  label={t.birthDate}
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  disabled={isViewOnly}
                />
                <InputField
                  label={t.birthPlace}
                  name="birthPlace"
                  value={formData.birthPlace}
                  onChange={handleChange}
                  disabled={isViewOnly}
                />
                <InputField
                  label={t.nationality}
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  disabled={isViewOnly}
                />
                <InputField
                  label={t.maritalStatus}
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  disabled={isViewOnly}
                />
                {/* --- Disability Field Added Here --- */}
                <InputField
                  label={t.disability}
                  name="disability"
                  value={formData.disability}
                  onChange={handleChange}
                  disabled={isViewOnly}
                />
              </div>
            </div>
          </Section>

          {/* Section 2: Education & Professional */}
          <Section
            title={t.educationSection}
            icon={GraduationCap}
            isRTL={isRTL}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                label={t.education}
                name="education"
                value={formData.education}
                onChange={handleChange}
                disabled={isViewOnly}
              />
              <InputField
                label={t.institute}
                name="institute"
                value={formData.institute}
                onChange={handleChange}
                disabled={isViewOnly}
              />
              <InputField
                label={t.graduationYear}
                name="graduationYear"
                type="number"
                value={formData.graduationYear}
                onChange={handleChange}
                disabled={isViewOnly}
              />
              <InputField
                label={t.ijazah}
                name="ijazah"
                value={formData.ijazah}
                onChange={handleChange}
                disabled={isViewOnly}
              />
              <InputField
                label={t.experienceYears}
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                disabled={isViewOnly}
              />
              <SelectField
                label={t.teachingLevel}
                name="teachingLevel"
                value={formData.teachingLevel}
                onChange={handleChange}
                options={["Beginner", "Intermediate", "Advanced", "All Levels"]}
                disabled={isViewOnly}
              />
            </div>
          </Section>

          {/* Section 3: Availability & Subjects */}
          <Section title={t.availabilitySection} icon={Clock} isRTL={isRTL}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label={t.subjects}
                name="subjects"
                placeholder="ቁርኣን, ሀዲስ"
                value={formData.subjects}
                onChange={handleChange}
                disabled={isViewOnly}
              />
              <InputField
                label={t.availableDays}
                name="availableDays"
                placeholder="Monday, Wednesday..."
                value={formData.availableDays}
                onChange={handleChange}
                disabled={isViewOnly}
              />
              <InputField
                label={t.availableTime}
                name="availableTime"
                value={formData.availableTime}
                onChange={handleChange}
                disabled={isViewOnly}
              />
              <InputField
                label={t.teachingMethod}
                name="teachingMethod"
                value={formData.teachingMethod}
                onChange={handleChange}
                disabled={isViewOnly}
              />
              <div className="md:col-span-2 space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 px-2">
                  {t.bio}
                </label>
                <textarea
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={isViewOnly}
                  className="w-full payment-input rounded-2xl p-5 outline-none transition-all text-sm font-medium focus:border-gold/50"
                />
              </div>
            </div>
            <div className="mt-8 space-y-3">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 px-2">
                {t.idCard}
              </label>
              <div className="relative h-32 glass border-dashed border-white/10 rounded-2xl flex items-center justify-center overflow-hidden group transition-all hover:border-gold/30">
                {previews.idCard ? (
                  <img
                    src={previews.idCard}
                    alt="ID"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <FileText
                      size={24}
                      className="mx-auto text-white/10 mb-2"
                    />
                    <span className="text-[9px] font-bold uppercase text-white/20">
                      {t.idUpload}
                    </span>
                  </div>
                )}
                {!isViewOnly && (
                  <input
                    type="file"
                    name="idCard"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                )}
              </div>
            </div>
          </Section>

          {/* Section 4: Address */}
          <Section title={t.addressSection} icon={MapPin} isRTL={isRTL}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <InputField
                label={t.region}
                name="region"
                value={formData.region}
                onChange={handleChange}
                disabled={isViewOnly}
              />
              <InputField
                label={t.subCity}
                name="subCity"
                value={formData.subCity}
                onChange={handleChange}
                disabled={isViewOnly}
              />
              <InputField
                label={t.woreda}
                name="woreda"
                value={formData.woreda}
                onChange={handleChange}
                disabled={isViewOnly}
              />
              <InputField
                label={t.kebele}
                name="kebele"
                value={formData.kebele}
                onChange={handleChange}
                disabled={isViewOnly}
              />
              <div className="md:col-span-4">
                <InputField
                  label={t.address}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isViewOnly}
                />
              </div>
            </div>
          </Section>

          {/* Section 5: Emergency */}
          <Section
            title={t.emergencySection}
            icon={ShieldAlert}
            isRTL={isRTL}
            isRed
          >
            <div
              className={`flex flex-col md:flex-row gap-10 items-start ${
                isRTL ? "md:flex-row-reverse" : ""
              }`}
            >
              <FileUpload
                label={t.emergencyPhoto}
                name="emergencyPhoto"
                preview={previews.emergencyPhoto}
                onChange={handleFileChange}
                icon={ImageIcon}
                isRed
                disabled={isViewOnly}
              />
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <InputField
                  label={t.emergencyName}
                  name="emergencyName"
                  value={formData.emergencyName}
                  onChange={handleChange}
                  disabled={isViewOnly}
                />
                <InputField
                  label={t.relation}
                  name="emergencyRelation"
                  value={formData.emergencyRelation}
                  onChange={handleChange}
                  disabled={isViewOnly}
                />
                <InputField
                  label={t.phone}
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  disabled={isViewOnly}
                />
                <InputField
                  label={t.region}
                  name="emergencyRegion"
                  value={formData.emergencyRegion}
                  onChange={handleChange}
                  disabled={isViewOnly}
                />
              </div>
            </div>
          </Section>

          {!isViewOnly && (
            <div
              className={`flex pt-10 ${
                isRTL ? "justify-start" : "justify-end"
              }`}
            >
              <button
                type="submit"
                disabled={loading}
                className="btn-gold px-16 py-6 rounded-2xl flex items-center gap-3 font-black uppercase tracking-[0.2em] text-xs shadow-2xl active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                {actualEditMode ? t.update : t.save}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// --- Helper Sub-Components ---
function Section({ title, icon: Icon, children, isRTL, isRed = false }) {
  const glowClass = isRed ? "text-red-glow" : "text-gold-glow";
  return (
    <div className="glass rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
      <h3
        className={`font-bold uppercase text-[10px] tracking-[0.3em] mb-8 flex items-center gap-4 ${glowClass} ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center glass border-white/10">
          <Icon size={18} />
        </div>
        {title}
      </h3>
      {children}
    </div>
  );
}

function FileUpload({
  label,
  name,
  preview,
  onChange,
  icon: Icon,
  isRed = false,
  disabled = false,
}) {
  const activeClass = isRed ? "hover:border-red/50" : "hover:border-gold/50";
  return (
    <div className="relative group shrink-0">
      <div
        className={`w-40 h-40 glass border-2 border-dashed border-white/10 rounded-[2rem] flex items-center justify-center overflow-hidden transition-all ${
          !disabled && activeClass
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon size={40} className="text-white/10" />
        )}
      </div>
      {!disabled && (
        <input
          type="file"
          name={name}
          onChange={onChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      )}
      <p className="text-center mt-3 text-[9px] font-bold uppercase text-white/30">
        {label}
      </p>
    </div>
  );
}

function InputField({ label, ...props }) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 px-2">
        {label}
      </label>
      <input
        {...props}
        className="w-full payment-input rounded-xl px-6 py-4 outline-none transition-all text-sm font-medium"
      />
    </div>
  );
}

function SelectField({ label, options, ...props }) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 px-2">
        {label}
      </label>
      <select
        {...props}
        className="w-full payment-input rounded-xl px-6 py-4 outline-none transition-all text-sm font-medium appearance-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#0b1220]">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
