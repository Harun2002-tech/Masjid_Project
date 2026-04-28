import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../contexts/language-context";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Send,
  AlertCircle,
  CheckCircle,
  Hash,
  Type,
  Sparkles,
  Globe,
} from "lucide-react";

export const MESSAGE_URL =
  "http://https://masjid-project.onrender.com/api/messages";

export default function MessageAdminForm() {
  const { language, setLanguage, t, dir } = useLanguage();

  const initialFormState = {
    type: "Ayah",
    arabic: "",
    text: "", // ለትርጉሙ የምንጠቀመው ፊልድ
    reference: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      const token = localStorage.getItem("token");
      await axios.post(MESSAGE_URL, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // በ Context ውስጥ ባለው የ "success" ቁልፍ መሰረት መልዕክቱን ያሳያል
      setStatus({
        type: "success",
        msg: t("success"),
      });
      setFormData(initialFormState);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error occurred!";
      setStatus({ type: "error", msg: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen py-20 px-4 flex items-center justify-center"
      dir={dir}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-2xl rounded-[2.5rem] overflow-hidden border border-white/10"
      >
        {/* Header Section */}
        <div className="relative p-10 text-center border-b border-white/5 bg-white/5">
          <Sparkles className="absolute top-6 right-10 text-gold/20 animate-pulse" />
          <h2 className="text-3xl font-bold text-gold-glow tracking-tight uppercase">
            {t("adminTitle")}
          </h2>
          <p className="text-white/30 text-[10px] font-black tracking-[.3em] uppercase mt-2">
            Ruhama Islamic Center
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
          {/* 2. Message Type Selector */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gold/40 uppercase ml-2 tracking-widest flex items-center gap-2">
              <Hash size={12} /> {t("type")}
            </label>
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
              {["Ayah", "Hadith"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${
                    formData.type === type
                      ? "btn-gold shadow-lg shadow-gold/10"
                      : "text-white/20 hover:text-white"
                  }`}
                >
                  {type === "Ayah" ? t("ayah") : t("hadith")}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Message Inputs */}
          <div className="space-y-6">
            {/* Arabic Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold/40 uppercase ml-2 tracking-widest flex items-center gap-2">
                <Type size={12} /> {t("arabicLabel")}
              </label>
              <textarea
                dir="rtl"
                required
                value={formData.arabic}
                onChange={(e) =>
                  setFormData({ ...formData, arabic: e.target.value })
                }
                className="payment-input w-full rounded-3xl p-6 text-2xl font-serif min-h-[140px]"
                placeholder="... النص العربي"
              />
            </div>

            {/* Translation Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold/40 uppercase ml-2 tracking-widest flex items-center gap-2">
                <Type size={12} /> {t("translationLabel")}
              </label>
              <textarea
                required
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                className="payment-input w-full rounded-3xl p-6 text-lg min-h-[140px] italic"
                placeholder={t("placeholderText")}
              />
            </div>

            {/* Reference Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold/40 uppercase ml-2 tracking-widest">
                {t("reference")}
              </label>
              <input
                type="text"
                required
                value={formData.reference}
                onChange={(e) =>
                  setFormData({ ...formData, reference: e.target.value })
                }
                className="payment-input w-full rounded-2xl px-6 py-5 font-bold italic"
                placeholder="e.g. Quran 2:255"
              />
            </div>
          </div>

          {/* Status Alert */}
          <AnimatePresence>
            {status.msg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`p-5 rounded-2xl flex items-center gap-3 border ${
                  status.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-red/10 border-red/20 text-red"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                <p className="text-[11px] font-black uppercase tracking-widest">
                  {status.msg}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
            {loading ? t("loading") : t("save")}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
