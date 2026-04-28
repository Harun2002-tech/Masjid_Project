import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Upload,
  Save,
  ArrowLeft,
  Loader2,
  Star,
  CheckCircle2,
} from "lucide-react";
import axios from "@/api/axios";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "../../../contexts/language-context";

const BASE_URL = "https://masjid-project.onrender.com";

const translations = {
  am: {
    addTitle: "አዲስ አስተያየት ጨምር",
    editTitle: "አስተያየት አርም",
    fullName: "ሙሉ ስም",
    role: "የስራ ድርሻ",
    rating: "ደረጃ (ኮከብ)",
    photo: "ፎቶ",
    content: "አስተያየት",
    save: "መረጃውን መዝግብ",
    saving: "በመላክ ላይ...",
    fetchError: "መረጃውን ማግኘት አልተቻለም",
    successAdd: "በተሳካ ሁኔታ ተጨምሯል",
    successUpdate: "በተሳካ ሁኔታ ተስተካክሏል",
    errorOccurred: "ስህተት ተከስቷል",
    star: "ኮከብ",
  },
  en: {
    addTitle: "Add New Testimonial",
    editTitle: "Edit Testimonial",
    fullName: "Full Name",
    role: "Role / Position",
    rating: "Rating (Stars)",
    photo: "Photo",
    content: "Testimonial Content",
    save: "Save Information",
    saving: "Saving...",
    fetchError: "Could not fetch testimonial",
    successAdd: "Added successfully",
    successUpdate: "Updated successfully",
    errorOccurred: "An error occurred",
    star: "Stars",
  },
  ar: {
    addTitle: "إضافة شهادة جديدة",
    editTitle: "تعديل الشهادة",
    fullName: "الاسم الكامل",
    role: "الدور / الوظيفة",
    rating: "التقييم (نجوم)",
    photo: "الصورة",
    content: "محتوى الشهادة",
    save: "حفظ المعلومات",
    saving: "جاري الحفظ...",
    fetchError: "تعذر جلب البيانات",
    successAdd: "تم الإضافة بنجاح",
    successUpdate: "تم التعديل بنجاح",
    errorOccurred: "حدث خطأ ما",
    star: "نجوم",
  },
};

const TestimonialSection = ({ editMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();

  const t = translations[language || "am"];
  const isRTL = language === "ar";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
    initials: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (editMode && id) {
      const fetchTestimonial = async () => {
        try {
          const { data } = await axios.get(`/testimonials/${id}`);
          const res = data.data;
          setFormData({
            name: res.name || "",
            role: res.role || "",
            content: res.content || "",
            rating: res.rating || 5,
            initials: res.initials || "",
          });
          if (res.image) setPreview(`${BASE_URL}${res.image}`);
        } catch (error) {
          toast({ variant: "destructive", title: t.fetchError });
        }
      };
      fetchTestimonial();
    }
  }, [id, editMode, t.fetchError, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (image) data.append("image", image);

      if (editMode) {
        await axios.put(`/testimonials/${id}`, data);
        toast({ title: t.successUpdate });
      } else {
        await axios.post("/testimonials", data);
        toast({ title: t.successAdd });
      }
      navigate("/admin/testimonials");
    } catch (error) {
      toast({ variant: "destructive", title: t.errorOccurred });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full min-h-screen py-10 px-4 flex items-center justify-center`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`glass max-w-4xl w-full p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden border-white/5`}
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />

        {/* Header */}
        <div
          className={`flex flex-col md:flex-row justify-between items-center gap-6 mb-12`}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-gold transition-all uppercase text-[10px] font-black tracking-[0.3em]"
          >
            <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />{" "}
            {t.back || "Back"}
          </button>

          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-gold-glow italic">
            {editMode ? t.editTitle : t.addTitle}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10"
        >
          {/* Form Left Side */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] flex items-center gap-2">
                <CheckCircle2 size={12} className="text-gold" /> {t.fullName}
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="payment-input w-full p-4 rounded-2xl outline-none font-bold text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] flex items-center gap-2">
                <CheckCircle2 size={12} className="text-gold" /> {t.role}
              </label>
              <input
                name="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="payment-input w-full p-4 rounded-2xl outline-none font-bold text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] flex items-center gap-2">
                <Star size={12} className="text-gold" /> {t.rating}
              </label>
              <select
                name="rating"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
                className="payment-input w-full p-4 rounded-2xl outline-none font-bold text-sm appearance-none cursor-pointer"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n} className="bg-[#0b1220]">
                    {n} {t.star}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Right Side: Image Upload */}
          <div className="flex flex-col">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-4">
              {t.photo}
            </label>
            <div className="relative group flex-1 min-h-[200px] glass rounded-[2.5rem] border-dashed border-2 border-white/5 flex flex-col items-center justify-center transition-all hover:border-gold/30 overflow-hidden">
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover rounded-[2.4rem] transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <Upload className="text-gold" size={32} />
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Upload
                      className="text-gray-500 group-hover:text-gold"
                      size={24}
                    />
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                    Click to Upload
                  </p>
                </div>
              )}
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImage(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Full Width Content Area */}
          <div className="lg:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">
              {t.content}
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows="4"
              required
              className="payment-input w-full p-6 rounded-[2rem] outline-none font-bold text-sm resize-none leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="lg:col-span-2 btn-gold py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Save size={18} /> {t.save}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestimonialSection;
