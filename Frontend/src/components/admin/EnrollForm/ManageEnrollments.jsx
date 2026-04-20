import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Trash2,
  FileImage,
  Loader2,
  Search,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../../../contexts/language-context";

export default function ManageEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { language, t } = useLanguage();
  const isRTL = language === "ar";

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/enrollments`, config);
      setEnrollments(res.data?.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleAction = async (id, action) => {
    try {
      setActionLoading(id);
      if (action === "delete") {
        if (!window.confirm(t("confirm_delete_enrollment") || "Are you sure?")) return;
        await axios.delete(`${API_BASE_URL}/api/enrollments/${id}`, config);
        setEnrollments((prev) => prev.filter((item) => item._id !== id));
      } else {
        const newStatus = action === "approve" ? "approved" : "rejected";
        await axios.patch(`${API_BASE_URL}/api/enrollments/${action}/${id}`, {}, config);
        setEnrollments((prev) =>
          prev.map((item) => (item._id === id ? { ...item, applicationStatus: newStatus } : item))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      rejected: "bg-red/10 text-red border-red/20",
      pending: "bg-gold/10 text-gold border-gold/20",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusConfig[status] || statusConfig.pending}`}>
        {t(`status_${status}`) || status}
      </span>
    );
  };

  if (loading) return (
    <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
      <Loader2 className="animate-spin w-10 h-10 text-gold shadow-gold-glow" />
      <p className="text-text/40 text-[10px] font-black uppercase tracking-widest animate-pulse">
        {t("loading_enrollments") || "Loading..."}
      </p>
    </div>
  );

  const filteredData = enrollments.filter(
    (app) => app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || app.nationalId?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen p-4 md:p-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <header>
            <h1 className="text-3xl font-bold text-text flex items-center gap-3">
              <UserCheck className="text-gold shadow-gold-glow" size={32} /> 
              {t("manage_enrollments") || "Manage Enrollments"}
            </h1>
            <p className="text-text/40 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
              <Sparkles size={12} className="text-gold" /> {t("total_applications")}: {enrollments.length}
            </p>
          </header>

          <div className="relative w-full md:w-96 group">
            <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-text/20 group-focus-within:text-gold transition-colors`} size={18} />
            <input
              type="text"
              placeholder={t("search_placeholder_enroll") || "Search by name..."}
              className="input-field !p-3 !pl-12"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop View: Table */}
        <div className="glass rounded-[2.5rem] overflow-hidden border-white/5 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" dir={isRTL ? "rtl" : "ltr"}>
              <thead className="bg-white/5 text-gold uppercase text-[9px] font-black tracking-[0.2em]">
                <tr>
                  <th className={`p-6 ${isRTL ? 'text-right' : ''}`}>{t("student")}</th>
                  <th className="p-6">{t("national_id")}</th>
                  <th className="p-6">{t("contact_info")}</th>
                  <th className="p-6 text-center">{t("id_photo")}</th>
                  <th className="p-6">{t("status")}</th>
                  <th className="p-6 text-center">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {filteredData.map((app) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={app._id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="p-6">
                        <div className="font-bold text-text text-sm">{app.fullName}</div>
                        <div className="text-[10px] text-text/30 font-medium italic mt-0.5">
                          {app.course?.title || t("unknown_course")}
                        </div>
                      </td>
                      <td className="p-6 font-mono text-xs text-text/60">{app.nationalId || "---"}</td>
                      <td className="p-6">
                        <div className="text-xs font-bold text-text/80">{app.phone}</div>
                        <div className="text-[9px] text-text/30 uppercase tracking-tighter">{app.gender}</div>
                      </td>
                      <td className="p-6 text-center">
                        {app.idCardImage && (
                          <a
                            href={app.idCardImage.startsWith("http") ? app.idCardImage : `${API_BASE_URL}/${app.idCardImage.replace(/\\/g, "/")}`}
                            target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-white/5 hover:bg-gold hover:text-bg px-4 py-2 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest"
                          >
                            <FileImage size={14} /> {t("view_id")}
                          </a>
                        )}
                      </td>
                      <td className="p-6">{getStatusBadge(app.applicationStatus)}</td>
                      <td className="p-6">
                        <div className="flex items-center justify-center gap-3">
                          {app.applicationStatus === "pending" && (
                            <>
                              <button
                                disabled={actionLoading === app._id}
                                onClick={() => handleAction(app._id, "approve")}
                                className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-30"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                disabled={actionLoading === app._id}
                                onClick={() => handleAction(app._id, "reject")}
                                className="p-2.5 bg-red/10 text-red rounded-xl hover:bg-red hover:text-white transition-all disabled:opacity-30"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                          <button
                            disabled={actionLoading === app._id}
                            onClick={() => handleAction(app._id, "delete")}
                            className="p-2.5 bg-white/5 text-text/20 rounded-xl hover:bg-red hover:text-white transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}