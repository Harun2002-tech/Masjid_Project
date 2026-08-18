import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Award,
  Camera,
  Send,
  Loader2,
  XCircle,
} from "lucide-react";
import { useLanguage } from "../../../contexts/language-context";
import ImageUpload from "../../../components/ui/ImageUpload";

export default function EnrollForm() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isRTL = language === "ar";

  const [courseTitle, setCourseTitle] = useState(
    location.state?.courseTitle || ""
  );
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    gender: language === "am" ? "ወንድ" : language === "ar" ? "ذكر" : "Male",
    nationalId: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://api.ruhamaislamiccenter.com";

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;
      try {
        setCheckingStatus(true);
        const res = await axios.get(`${API_BASE_URL}/api/courses/${id}`);
        const courseData = res.data.data || res.data;
        if (courseData) {
          setCourseTitle(courseData.title || courseData.name);
          if (courseData.enrollmentOpen === false) setIsClosed(true);
        }
      } catch (err) {
        setMsg({ type: "error", text: t("unknown_course") });
      } finally {
        setCheckingStatus(false);
      }
    };
    fetchCourseData();
  }, [id, t]);

  useEffect(() => {
    if (!photo) return setPreview(null);
    const objectUrl = URL.createObjectURL(photo);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  if (isClosed) {
    return (
      <div
        className="min-h-screen p-6 flex items-center justify-center"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 text-center rounded-[3rem] max-w-md w-full border-red-500/20"
        >
          <XCircle
            className="mx-auto text-red mb-6 shadow-red-glow"
            size={64}
          />
          <h2 className="text-2xl font-bold text-red-glow">
            {t("registration_closed")}
          </h2>
          <p className="text-text/60 mt-4 text-sm">
            {t("registration_closed_desc")}
          </p>
          <Link
            to="/courses"
            className="mt-10 px-8 py-4 btn-gold rounded-2xl font-black uppercase text-[10px] tracking-widest inline-block"
          >
            {t("back_to_courses")}
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^(09|07)\d{8}$/.test(formData.phone))
      return setMsg({ type: "error", text: t("invalid_phone") });
    if (!photo) return setMsg({ type: "error", text: t("upload_id_warn") });

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      data.append("course", id);
      data.append("idCardImage", photo);

      await axios.post(`${API_BASE_URL}/api/enrollments/apply`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMsg({ type: "success", text: t("enroll_success") });
      setTimeout(() => navigate("/courses"), 2500);
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen p-6 flex items-center justify-center"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 md:p-10 max-w-xl w-full rounded-[2.5rem] relative overflow-hidden"
      >
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 text-text/40 hover:text-gold mb-6 text-[10px] font-black uppercase tracking-widest transition-colors ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />{" "}
          {t("back")}
        </button>

        <header className="mb-8 text-center">
          <div className="bg-gold/10 w-16 h-16 rounded-2xl flex items-center justify-center text-gold mx-auto mb-4 border border-gold/20 shadow-gold-glow">
            <Award size={32} />
          </div>
          <h2 className="text-2xl font-bold text-text leading-tight">
            {t("enroll_for")}{" "}
            <span className="text-gold uppercase">
              "{courseTitle || t("unknown_course")}"
            </span>{" "}
            {t("course_enroll_title")}
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1">
            <label
              className={`text-[10px] text-text/40 font-black uppercase tracking-widest ${
                isRTL ? "mr-4" : "ml-4"
              }`}
            >
              {t("full_name")}
            </label>
            <input
              required
              placeholder={t("full_name_ph")}
              className="input-field"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>

          {/* National ID */}
          <div className="space-y-1">
            <label
              className={`text-[10px] text-text/40 font-black uppercase tracking-widest ${
                isRTL ? "mr-4" : "ml-4"
              }`}
            >
              {t("national_id")}
            </label>
            <input
              required
              placeholder={t("id_number_ph")}
              className="input-field"
              value={formData.nationalId}
              onChange={(e) =>
                setFormData({ ...formData, nationalId: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone */}
            <div className="space-y-1">
              <label
                className={`text-[10px] text-text/40 font-black uppercase tracking-widest ${
                  isRTL ? "mr-4" : "ml-4"
                }`}
              >
                {t("phone")}
              </label>
              <input
                required
                type="tel"
                maxLength="10"
                placeholder="09..."
                className="input-field"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
              />
            </div>
            {/* Gender */}
            <div className="space-y-1">
              <label
                className={`text-[10px] text-text/40 font-black uppercase tracking-widest ${
                  isRTL ? "mr-4" : "ml-4"
                }`}
              >
                {t("gender")}
              </label>
              <select
                className="input-field cursor-pointer appearance-none"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              >
                <option value={t("male")} className="bg-[#0f172a]">
                  {t("male")}
                </option>
                <option value={t("female")} className="bg-[#0f172a]">
                  {t("female")}
                </option>
              </select>
            </div>
          </div>

          {/* ID Photo */}
          <ImageUpload
            label={t("id_photo")}
            preview={preview}
            onFileSelect={(file) => setPhoto(file)}
            icon={Camera}
            rounded="rounded-[1.25rem]"
            triggerClassName="min-h-[128px]"
            previewClassName="w-full h-full object-cover rounded-xl"
            uploadText={t("id_photo")}
            changeText={t("id_photo")}
            showHelperText={false}
          />

          <button
            disabled={loading}
            className="w-full btn-gold py-4 rounded-[1.25rem] font-black uppercase tracking-widest text-xs shadow-lg flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} className={isRTL ? "rotate-180" : ""} />
            )}
            {loading ? t("sending") : t("enroll_now")}
          </button>

          <AnimatePresence>
            {msg.text && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-4 rounded-xl text-[10px] font-bold text-center border uppercase tracking-widest ${
                  msg.type === "success"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-red/10 text-red border-red/20"
                }`}
              >
                {msg.text}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
}
