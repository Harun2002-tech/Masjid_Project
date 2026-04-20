import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Eye, Plus, Star, Loader2, User } from "lucide-react";
import axios from "@/api/axios";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "../../../contexts/language-context";

const BASE_URL = "http://localhost:5000";

const translations = {
  am: {
    title: "የምስክርነቶች ዝርዝር",
    subTitle: "የተጠቃሚዎች አስተያየቶች እና ምስክርነቶች",
    addNew: "አዲስ ምስክርነት ጨምር",
    tablePerson: "ሰው",
    tableRole: "የስራ ድርሻ",
    tableRating: "ደረጃ",
    tableAction: "ድርጊት",
    loading: "በመጫን ላይ...",
    noData: "ምንም አስተያየት አልተገኘም",
    total: "የተመዘገቡ ምስክርነቶች",
    deleteConfirm: "እርግጠኛ ነህ ይህ አስተያየት ይጥፋ?",
    deleteSuccess: "ተሰርዟል ✓",
    deleteError: "ማጥፋት አልተቻለም",
    fetchError: "መረጃውን መጫን አልተቻለም",
  },
  en: {
    title: "Testimonials List",
    subTitle: "User reviews and testimonials",
    addNew: "Add New Testimonial",
    tablePerson: "Person",
    tableRole: "Role",
    tableRating: "Rating",
    tableAction: "Action",
    loading: "Loading...",
    noData: "No testimonials found",
    total: "Total Testimonials",
    deleteConfirm: "Are you sure you want to delete this?",
    deleteSuccess: "Deleted successfully ✓",
    deleteError: "Could not delete",
    fetchError: "Failed to load data",
  },
  ar: {
    title: "قائمة الشهادات",
    subTitle: "آراء المستخدمين والشهادات",
    addNew: "إضافة شهادة جديدة",
    tablePerson: "الشخص",
    tableRole: "الدور",
    tableRating: "التقييم",
    tableAction: "إجراء",
    loading: "جاري التحميل...",
    noData: "لم يتم العثور على شهادات",
    total: "إجمالي الشهادات",
    deleteConfirm: "هل أنت متأكد أنك تريد حذف هذا؟",
    deleteSuccess: "تم الحذف بنجاح ✓",
    deleteError: "تعذر الحذف",
    fetchError: "فشل في تحميل البيانات",
  },
};

const TestimonialsList = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { language } = useLanguage();

  const t = translations[language || "am"];
  const isRTL = language === "ar";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios.get("/testimonials");
      setTestimonials(data?.data || []);
    } catch (error) {
      toast({ variant: "destructive", title: t.fetchError });
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.deleteConfirm)) return;
    try {
      await axios.delete(`/testimonials/${id}`);
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
      toast({ title: t.deleteSuccess });
    } catch (error) {
      toast({ variant: "destructive", title: t.deleteError });
    }
  };

  const formatImageUrl = (imagePath, name) => {
    if (!imagePath)
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=0f172a&color=fbbf24`;
    const cleanPath = imagePath.replace(/\\/g, "/");
    return `${BASE_URL}${
      cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`
    }`;
  };

  const renderStars = (rating = 0) => (
    <div
      className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
    >
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={`${
            i < rating
              ? "text-gold fill-gold shadow-gold-glow"
              : "text-gray-700"
          }`}
        />
      ))}
    </div>
  );

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-gold" size={40} />
        <p className="text-gold uppercase tracking-[0.3em] text-[10px] font-black">
          {t.loading}
        </p>
      </div>
    );

  return (
    <div
      className={`p-6 max-w-7xl mx-auto space-y-10 ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-gold-glow italic">
            {t.title}
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">
            {t.subTitle}
          </p>
        </div>
        <Link
          to="/admin/submit-testimonial"
          className="btn-gold px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest shadow-2xl"
        >
          <Plus size={18} /> {t.addNew}
        </Link>
      </div>

      {/* Table Section */}
      <div className="glass rounded-[2.5rem] overflow-hidden border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gold italic">
                  {t.tablePerson}
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gold italic">
                  {t.tableRole}
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gold italic">
                  {t.tableRating}
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gold italic text-center">
                  {t.tableAction}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {testimonials.length > 0 ? (
                testimonials.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden glass border-2 border-white/10 shadow-xl p-1">
                          <img
                            src={formatImageUrl(
                              item.image || item.photo,
                              item.name
                            )}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => {
                              e.currentTarget.src = formatImageUrl(
                                null,
                                item.name
                              );
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-black text-white text-base tracking-tight">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                            {new Date(item.createdAt).toLocaleDateString(
                              language === "am" ? "am-ET" : "en-US"
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="glass border border-white/10 text-gray-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {item.role || "Student"}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="space-y-1">
                        {renderStars(item.rating)}
                        <div className="text-[10px] font-black text-gold/60">
                          {item.rating}/5
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/admin/testimonial/${item._id}`}
                          className="p-3 glass hover:text-blue-400 rounded-xl transition-all hover:scale-110 border-white/5 shadow-inner"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/admin/testimonials/edit/${item._id}`}
                          className="p-3 glass hover:text-amber-400 rounded-xl transition-all hover:scale-110 border-white/5 shadow-inner"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-3 glass hover:text-red-500 rounded-xl transition-all hover:scale-110 border-white/5 shadow-inner"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-24 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <User size={40} className="text-gray-700" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-600">
                      {t.noData}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex justify-center items-center gap-4">
        <div className="h-px w-10 bg-white/10" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">
          {t.total}: <span className="text-gold">{testimonials.length}</span>
        </p>
        <div className="h-px w-10 bg-white/10" />
      </div>
    </div>
  );
};

export default TestimonialsList;
