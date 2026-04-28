import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Mail,
  Search,
  Loader2,
  Lock,
  User,
  Edit,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useLanguage } from "../../../contexts/language-context";

export default function AdminNewProfile() {
  const { dir, language } = useLanguage();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin", // ✅ ወደ lowercase ቀይረነዋል
  });

  const API_BASE_URL = "https://masjid-project.onrender.com/api/users";
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    if (token) {
      fetchAdmins();
    } else {
      setError("Please login as SuperAdmin first");
      setLoading(false);
    }
  }, [token]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE_URL}/admins`, config);
      const data = Array.isArray(res.data) ? res.data : res.data.data;
      setAdmins(data || []);
    } catch (err) {
      const msg = err.response?.data?.message || "Could not fetch admins";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // ✅ ሮሉን ወደ lowercase መቀየር (ለጥንቃቄ)
    const finalData = {
      ...formData,
      role: formData.role.toLowerCase(),
    };

    try {
      if (editingId) {
        await axios.put(
          `${API_BASE_URL}/admins/${editingId}`,
          finalData,
          config
        );
        alert(
          language === "am" ? "በተሳካ ሁኔታ ተስተካክሏል!" : "Updated successfully!"
        );
      } else {
        await axios.post(`${API_BASE_URL}/admins`, finalData, config);
        alert(
          language === "am" ? "አዲስ አስተዳዳሪ ተመዝግቧል!" : "Registered successfully!"
        );
      }
      resetForm();
      fetchAdmins();
    } catch (err) {
      const msg = err.response?.data?.message || "An error occurred";
      setError(msg);
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const msg =
      language === "am" ? "ይህንን አስተዳዳሪ መሰረዝ እርግጠኛ ነዎት?" : "Are you sure?";
    if (!window.confirm(msg)) return;
    try {
      await axios.delete(`${API_BASE_URL}/admins/${id}`, config);
      setAdmins(admins.filter((a) => a._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleEdit = (admin) => {
    setEditingId(admin._id);
    setFormData({
      name: admin.name,
      email: admin.email,
      role: admin.role?.toLowerCase() || "admin", // ✅ Safe role access
      password: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", email: "", password: "", role: "admin" });
    setError("");
  };

  const filteredAdmins = admins.filter(
    (a) =>
      a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="min-h-screen pb-12 pt-32 px-4 md:px-8 bg-[#0a0a0a]"
      dir={dir}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass border-none rounded-[3rem] overflow-hidden sticky top-32 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-gold" />
              <CardHeader className="p-10 pb-4">
                <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mb-6 border border-gold/10">
                  {editingId ? <Edit size={28} /> : <UserPlus size={28} />}
                </div>
                <CardTitle className="text-2xl font-bold text-white italic">
                  {editingId
                    ? language === "am"
                      ? "አስተዳዳሪ ማስተካከያ"
                      : "Edit Admin"
                    : language === "am"
                    ? "አዲስ አስተዳዳሪ"
                    : "New Admin"}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-10 pt-4">
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <InputField
                    label={language === "am" ? "ሙሉ ስም" : "Full Name"}
                    icon={User}
                    value={formData.name}
                    onChange={(v) => setFormData({ ...formData, name: v })}
                  />
                  <InputField
                    label={language === "am" ? "ኢሜይል" : "Email"}
                    icon={Mail}
                    type="email"
                    value={formData.email}
                    onChange={(v) => setFormData({ ...formData, email: v })}
                  />
                  <InputField
                    label={
                      editingId
                        ? language === "am"
                          ? "አዲስ ይለፍ ቃል (አማራጭ)"
                          : "New Password (Optional)"
                        : language === "am"
                        ? "የይለፍ ቃል"
                        : "Password"
                    }
                    icon={Lock}
                    type="password"
                    value={formData.password}
                    onChange={(v) => setFormData({ ...formData, password: v })}
                  />

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gold/60 ml-2">
                      Role
                    </label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:bg-white/10 outline-none"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    >
                      <option value="admin" className="bg-black">
                        Admin
                      </option>
                      <option value="superadmin" className="bg-black">
                        SuperAdmin
                      </option>
                      <option value="masjid_admin" className="bg-black">
                        Masjid Admin
                      </option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-gold flex-1 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg flex items-center justify-center gap-3"
                    >
                      {submitting ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : editingId ? (
                        "Update"
                      ) : (
                        "Register"
                      )}
                    </button>
                    {editingId && (
                      <button
                        onClick={resetForm}
                        type="button"
                        className="px-6 rounded-2xl bg-white/5 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Side List */}
        <div className="lg:col-span-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <h2 className="text-3xl font-bold text-white italic flex items-center gap-4">
              {language === "am" ? "አስተዳዳሪዎች" : "Admins"}
              <span className="text-gold text-xs bg-gold/10 border border-gold/10 px-4 py-1.5 rounded-full font-mono">
                {admins.length}
              </span>
            </h2>
            <div className="relative w-full md:w-80">
              <input
                placeholder={language === "am" ? "ፈልግ..." : "Search..."}
                className="glass w-full border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-gold/30 outline-none transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className={`absolute ${
                  dir === "rtl" ? "right-4" : "left-4"
                } top-1/2 -translate-y-1/2 text-white/20`}
                size={18}
              />
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center py-24 gap-4">
                <Loader2 className="animate-spin text-gold" size={40} />
                <p className="text-[10px] text-white/20 tracking-widest uppercase font-black">
                  Syncing Database...
                </p>
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="text-center py-20 text-white/20 uppercase tracking-[0.3em] text-[10px] font-black italic glass rounded-[3rem]">
                No admins found
              </div>
            ) : (
              <AnimatePresence>
                {filteredAdmins.map((admin, idx) => (
                  <motion.div
                    key={admin._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass p-6 rounded-[2.5rem] border-white/5 hover:border-gold/20 transition-all flex items-center justify-between group shadow-lg"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center justify-center text-gold text-2xl font-serif italic shadow-inner">
                        {admin.name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg flex items-center gap-2 group-hover:text-gold transition-colors">
                          {admin.name}
                          {admin.role?.toLowerCase() === "superadmin" ? (
                            <ShieldCheck size={16} className="text-gold" />
                          ) : (
                            <ShieldAlert size={16} className="text-white/20" />
                          )}
                        </h4>
                        <p className="text-[11px] text-white/40 font-mono mt-1 italic uppercase tracking-tighter flex items-center gap-2">
                          <Mail size={12} className="text-gold/40" />{" "}
                          {admin.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="p-3 text-white/10 hover:text-gold hover:bg-gold/5 rounded-xl transition-all"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="p-3 text-white/10 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, icon: Icon, type = "text", value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-gold/60 ml-2">
        {label}
      </label>
      <div className="relative">
        <input
          required={type !== "password" || !value}
          type={type}
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white focus:bg-white/10 focus:border-gold/30 outline-none transition-all"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Icon
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
          size={18}
        />
      </div>
    </div>
  );
}
