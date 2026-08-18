import React, { useState } from "react";
import axios from "axios";
import { Loader2, MapPin, Upload, CheckCircle, AlertCircle, Building2, Globe } from "lucide-react";
import { useLanguage } from "../../../contexts/language-context";
import ImageUpload from "../../../components/ui/ImageUpload";

export default function AddMasjid() {
  const { language, t } = useLanguage();
  const isRTL = language === "ar";

  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    city: "Kombolcha",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const handleFileChange = (selected) => {
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setStatus({ type: "", msg: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.latitude || !formData.longitude) return;

    setLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (file) data.append("image", file);

      await axios.post("https://api.ruhamaislamiccenter.com/api/masjids", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStatus({ type: "success", msg: "መስጂዱ በትክክል ተመዝግቧል!" });
      setFormData({ name: "", latitude: "", longitude: "", city: "Kombolcha" });
      setFile(null);
      setPreview(null);
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || "መስጂዱን መመዝገብ አልተቻለም";
      setStatus({ type: "error", msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 flex items-center justify-center" dir={isRTL ? "rtl" : "ltr"}>
      <div className="glass max-w-2xl w-full rounded-[3rem] overflow-hidden shadow-2xl border border-glass-border">
        <div className="bg-emerald-900/40 p-10 text-center relative border-b border-glass-border">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Building2 className="h-32 w-32 text-gold" strokeWidth={1} />
          </div>
          <div className="flex items-center justify-center gap-2 text-gold mb-3 relative z-10">
            <MapPin size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70">
              Admin
            </span>
          </div>
          <h2 className="text-3xl font-bold text-text relative z-10 text-gold-glow">
            አዲስ መስጂድ መዝግብ
          </h2>
        </div>

        <div className="p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-text/40 uppercase ml-4 tracking-widest">
                የመስጂድ ስም
              </label>
              <input
                required
                className="payment-input w-full p-5 rounded-2xl outline-none"
                placeholder="ለምሳሌ፦ ኑር መስጂድ"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text/40 uppercase tracking-widest ml-2">
                  ላቲቲዩድ
                </label>
                <input
                  required
                  type="number"
                  step="any"
                  className="payment-input w-full p-5 rounded-2xl outline-none"
                  placeholder="9.0"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text/40 uppercase tracking-widest ml-2">
                  ሎንጊቲዩድ
                </label>
                <input
                  required
                  type="number"
                  step="any"
                  className="payment-input w-full p-5 rounded-2xl outline-none"
                  placeholder="39.0"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text/40 uppercase tracking-widest ml-2">
                ከተማ
              </label>
              <div className="relative">
                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-text/20" size={18} />
                <input
                  className="payment-input w-full p-5 pl-14 rounded-2xl outline-none"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <ImageUpload
                label="የመስጂድ ፎቶ"
                preview={preview}
                onFileSelect={handleFileChange}
                icon={Upload}
                rounded="rounded-[2rem]"
                triggerClassName="min-h-[180px]"
                uploadText="ፎቶ ምረጥ"
                changeText="ፎቶ ለውጥ"
                showHelperText={false}
              />
            </div>

            {status.msg && (
              <div className={`p-5 rounded-2xl flex items-center gap-4 border animate-pulse ${
                status.type === "success"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}>
                {status.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span className="text-xs font-bold uppercase tracking-tight">{status.msg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !formData.name || !formData.latitude || !formData.longitude}
              className="btn-gold w-full py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin mx-auto h-5 w-5" /> : "መስጂዱን መዝግብ"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}