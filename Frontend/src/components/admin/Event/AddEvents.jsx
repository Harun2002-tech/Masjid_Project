import { useState } from "react";
import axios from "axios";
import { 
  Calendar, MapPin, Tag, Users, Banknote, 
  FileText, Send, Loader2, ArrowLeft, Sparkles 
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { EVENT_URL } from "@/config/api";

export default function AdminEvents() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    category: "",
    maxAttendees: 100,
    price: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      await axios.post(EVENT_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("✅ ዝግጅቱ በተሳካ ሁኔታ ተለጥፏል!");
      setFormData({ 
        title: "", description: "", startDate: "", endDate: "", 
        location: "", category: "", maxAttendees: 100, price: 0 
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "❌ ስህተት ተፈጥሯል! እባክዎ ደግመው ይሞክሩ።");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-parchment min-h-screen py-20 px-4 pt-32">
      {/* Back Button */}
      <div className="max-w-3xl mx-auto mb-6">
        <Link 
          to="/admin/dashboard" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-900/40 hover:text-gold transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-emerald-900 group-hover:text-gold transition-all">
            <ArrowLeft size={14} />
          </div>
          ወደ ዳሽቦርድ ተመለስ
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white rounded-[3.5rem] border border-emerald-900/5 shadow-2xl overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-emerald-900 p-10 text-center relative overflow-hidden">
          {/* Decorative Background Icons */}
          <Calendar className="absolute -top-4 -right-4 w-32 h-32 text-white/5 -rotate-12" />
          <Sparkles className="absolute bottom-4 left-6 w-12 h-12 text-gold/20 animate-pulse" />
          
          <div className="relative z-10">
            <div className="inline-flex p-3 bg-white/10 rounded-2xl border border-white/5 mb-4">
              <Calendar className="w-8 h-8 text-gold" />
            </div>
            <h2 className="text-2xl font-serif italic font-bold text-white uppercase tracking-wider">
              አዲስ <span className="text-gold">ዝግጅት</span> መለጠፊያ
            </h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
              ለማህበረሰቡ የሚሆኑ ስልጠናዎችን ወይም ዝግጅቶችን እዚህ ይለጥፉ
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 md:p-14 space-y-8">
          
          {/* Title and Description */}
          <div className="space-y-6">
            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/30 ml-4 group-focus-within:text-gold transition-colors">የዝግጅቱ ርዕስ</label>
              <div className="relative">
                <input 
                  className="w-full bg-parchment/30 border border-emerald-900/5 rounded-2xl px-12 py-4 focus:outline-none focus:border-gold/50 focus:bg-white transition-all font-serif italic font-bold text-emerald-900 placeholder:text-emerald-900/20" 
                  placeholder="ርዕስ እዚህ ይጻፉ..." 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  required 
                />
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/20 w-5 h-5 group-focus-within:text-gold transition-colors" />
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/30 ml-4 group-focus-within:text-gold">ዝርዝር መግለጫ</label>
              <div className="relative">
                <textarea 
                  className="w-full bg-parchment/30 border border-emerald-900/5 rounded-[2rem] px-12 py-5 h-40 focus:outline-none focus:border-gold/50 focus:bg-white transition-all font-serif italic text-emerald-900 placeholder:text-emerald-900/20 leading-relaxed" 
                  placeholder="ስለ ዝግጅቱ ዝርዝር መግለጫ..." 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  required 
                />
                <FileText className="absolute left-4 top-6 text-emerald-900/20 w-5 h-5 group-focus-within:text-gold" />
              </div>
            </div>
          </div>

          <hr className="border-emerald-900/5" />

          {/* Date and Time Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/30 ml-4 group-focus-within:text-gold">የመጀመሪያ ቀን</label>
              <div className="relative">
                <input 
                  type="datetime-local" 
                  className="w-full bg-parchment/30 border border-emerald-900/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-gold/50 focus:bg-white transition-all text-emerald-900 font-mono text-sm" 
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/30 ml-4 group-focus-within:text-gold">የማብቂያ ቀን</label>
              <div className="relative">
                <input 
                  type="datetime-local" 
                  className="w-full bg-parchment/30 border border-emerald-900/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-gold/50 focus:bg-white transition-all text-emerald-900 font-mono text-sm" 
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})} 
                  required 
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="group space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/30 ml-4 group-focus-within:text-gold">ዝግጅቱ የሚካሄድበት ቦታ</label>
            <div className="relative">
              <input 
                className="w-full bg-parchment/30 border border-emerald-900/5 rounded-2xl px-12 py-4 focus:outline-none focus:border-gold/50 focus:bg-white transition-all font-serif italic text-emerald-900 placeholder:text-emerald-900/20" 
                placeholder="ለምሳሌ፡ የመስጂዱ አዳራሽ ወይም በዙም" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
                required 
              />
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/20 w-5 h-5 group-focus-within:text-gold" />
            </div>
          </div>

          {/* Additional Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/30 ml-4 group-focus-within:text-gold">ዘርፍ</label>
              <div className="relative">
                <input 
                  className="w-full bg-parchment/30 border border-emerald-900/5 rounded-2xl px-10 py-4 focus:outline-none focus:border-gold/50 focus:bg-white transition-all text-sm font-bold text-emerald-900" 
                  placeholder="Category" 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})} 
                  required 
                />
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-900/20 w-4 h-4 group-focus-within:text-gold" />
              </div>
            </div>
            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/30 ml-4 group-focus-within:text-gold">ተሳታፊ</label>
              <div className="relative">
                <input 
                  type="number" 
                  className="w-full bg-parchment/30 border border-emerald-900/5 rounded-2xl px-10 py-4 focus:outline-none focus:border-gold/50 focus:bg-white transition-all text-sm font-bold text-emerald-900" 
                  value={formData.maxAttendees}
                  onChange={(e) => setFormData({...formData, maxAttendees: e.target.value})} 
                />
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-900/20 w-4 h-4 group-focus-within:text-gold" />
              </div>
            </div>
            <div className="group space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/30 ml-4 group-focus-within:text-gold">ዋጋ (ETB)</label>
              <div className="relative">
                <input 
                  type="number" 
                  className="w-full bg-parchment/30 border border-emerald-900/5 rounded-2xl px-10 py-4 focus:outline-none focus:border-gold/50 focus:bg-white transition-all text-sm font-bold text-emerald-900" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})} 
                />
                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-900/20 w-4 h-4 group-focus-within:text-gold" />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-900 hover:bg-emerald-800 text-gold py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-xl shadow-emerald-900/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                አሁኑኑ ይለጥፉ <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}