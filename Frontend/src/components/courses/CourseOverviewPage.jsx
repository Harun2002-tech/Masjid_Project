import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { useLanguage } from "../../contexts/language-context";
import {
  Clock,
  Calendar,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  ListChecks,
  Award,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function CourseOverviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, dir } = useLanguage();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);

  const API_BASE_URL = "https://masjid-project.onrender.com";

  useEffect(() => {
    const fetchCourseAndStatus = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // 1. የኮርስ መረጃ ማምጣት
        const response = await fetch(`${API_BASE_URL}/api/courses/${id}`);
        const resData = await response.json();
        const courseData = resData.success ? resData.data : resData;
        setCourse(courseData);

        // 2. የምዝገባ ሁኔታ መፈተሽ
        if (token && id) {
          const statusRes = await fetch(
            `${API_BASE_URL}/api/enrollments/status/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const statusData = await statusRes.json();

          // ሁኔታው የጸደቀ ከሆነ በቀጥታ ወደ ትምህርት ገጽ ውሰደው
          if (statusData?.status?.toLowerCase() === "approved") {
            navigate(`/course-learn/${id}`);
            return;
          }
          setEnrollmentStatus(statusData?.status);
        }
      } catch (err) {
        console.error("Error fetching course data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndStatus();
  }, [id, navigate]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-gold mb-4" size={48} />
        <p className="text-gold-glow font-black uppercase tracking-widest text-[10px]">
          {language === "am" ? "ዝርዝሩን በማዘጋጀት ላይ..." : "LOADING DETAILS..."}
        </p>
      </div>
    );

  if (!course)
    return (
      <div
        dir={dir}
        className="min-h-screen flex flex-col items-center justify-center p-6"
      >
        <h1 className="text-2xl font-bold text-white">
          {language === "am" ? "ኮርሱ አልተገኘም" : "Course Not Found"}
        </h1>
        <Link
          to="/courses"
          className="mt-4 text-gold font-bold uppercase text-xs flex items-center gap-2"
        >
          <ArrowLeft size={14} />{" "}
          {language === "am" ? "ወደ ዝርዝር ተመለስ" : "Back to List"}
        </Link>
      </div>
    );

  const renderEnrollmentAction = () => {
    const status = enrollmentStatus?.toLowerCase();

    if (status === "pending") {
      return (
        <Button
          disabled
          className="w-full h-16 rounded-2xl glass text-gold/50 cursor-wait border-none font-black text-[11px] uppercase"
        >
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          {language === "am" ? "ጥያቄዎ በመታየት ላይ ነው..." : "Request Pending..."}
        </Button>
      );
    }

    if (status === "rejected") {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-red-400 justify-center bg-red-500/10 p-3 rounded-xl border border-red-500/20">
            <AlertCircle size={16} />
            <span className="text-[10px] font-bold uppercase">
              {language === "am" ? "ጥያቄዎ ውድቅ ተደርጓል" : "Application Rejected"}
            </span>
          </div>
          <Button
            className="w-full h-16 rounded-2xl btn-gold text-[11px] uppercase"
            asChild
          >
            <Link to={`/courses/${id}/enroll`}>
              {language === "am" ? "እንደገና አመልክት" : "RE-APPLY NOW"}
            </Link>
          </Button>
        </div>
      );
    }

    if (course.enrollmentOpen) {
      return (
        <Button
          className="w-full h-16 rounded-2xl btn-gold text-[11px] tracking-[0.2em] uppercase mb-8 shadow-2xl"
          asChild
        >
          <Link to={`/courses/${id}/enroll`}>
            {language === "am" ? "አሁኑኑ ይመዝገቡ" : "ENROLL NOW"}
            <ArrowRight className="ml-3 h-4 w-4" />
          </Link>
        </Button>
      );
    }

    return (
      <Button
        disabled
        className="w-full h-16 rounded-2xl glass text-white/40 border-none font-black text-[11px] uppercase"
      >
        {language === "am" ? "ምዝገባ ተዘግቷል" : "REGISTRATION CLOSED"}
      </Button>
    );
  };

  return (
    <div
      dir={dir}
      className="min-h-screen py-12 text-white relative pt-32 selection:bg-gold/30 bg-transparent"
    >
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            variant="ghost"
            className="mb-10 text-white/60 hover:text-gold hover:bg-white/5 transition-all rounded-full px-6"
            asChild
          >
            <Link to="/courses" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {language === "am" ? "ወደ ኮርሶች ዝርዝር ተመለስ" : "Back to Courses"}
            </Link>
          </Button>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="bg-gold text-black mb-6 uppercase font-black tracking-[0.3em] px-5 py-2 rounded-full border-none">
                {course.category || (language === "am" ? "ጠቅላላ" : "General")}
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-[1.1]">
                {course.title} <span className="text-gold">.</span>
              </h1>
            </motion.div>

            {course.thumbnail && (
              <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 glass">
                <img
                  src={
                    course.thumbnail.startsWith("http")
                      ? course.thumbnail
                      : `${API_BASE_URL}/${course.thumbnail.replace(/^\//, "")}`
                  }
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/600x400/064e3b/gold?text=Course+Image";
                  }}
                />
              </div>
            )}

            <div className="space-y-6 glass p-10 md:p-14 rounded-[2.5rem] relative overflow-hidden">
              <h2 className="text-gold-glow font-black uppercase tracking-[0.3em] text-[11px] flex items-center gap-3">
                <div className="h-1 w-8 bg-gold rounded-full" />
                {language === "am" ? "ስለ ኮርሱ ዝርዝር ማብራሪያ" : "COURSE DESCRIPTION"}
              </h2>
              <p className="text-white/80 text-xl leading-relaxed italic relative z-10 font-light">
                "{course.description}"
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <ListChecks className="text-gold h-6 w-6" />
                <h3 className="text-2xl font-bold text-white">
                  {language === "am" ? "የትምህርቱ ይዘቶች (Syllabus)" : "Syllabus"}
                </h3>
              </div>
              <div className="grid gap-4">
                {course.syllabus?.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group p-6 glass rounded-2xl border border-white/5 flex items-center gap-6 hover:border-gold/30 transition-all cursor-default"
                  >
                    <span className="flex-none w-10 h-10 rounded-xl bg-white/5 text-gold group-hover:bg-gold group-hover:text-black flex items-center justify-center text-xs font-black transition-all">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-white/80 font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="sticky top-32"
            >
              <Card className="glass border-none rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-center mb-8">
                    <div className="h-16 w-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <Award className="text-gold h-8 w-8" />
                    </div>
                  </div>

                  <div className="text-center mb-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-glow mb-3">
                      {language === "am" ? "የምዝገባ ሁኔታ" : "ENROLLMENT STATUS"}
                    </p>
                    <h3 className="text-2xl font-bold text-white">
                      {enrollmentStatus?.toLowerCase() === "pending"
                        ? language === "am"
                          ? "ጥያቄዎ በመታየት ላይ"
                          : "Pending"
                        : enrollmentStatus?.toLowerCase() === "rejected"
                        ? language === "am"
                          ? "ውድቅ ተደርጓል"
                          : "Rejected"
                        : course.enrollmentOpen
                        ? language === "am"
                          ? "ክፍት ነው"
                          : "Open"
                        : language === "am"
                        ? "ተዘግቷል"
                        : "Closed"}
                    </h3>
                  </div>

                  <div className="mb-8">{renderEnrollmentAction()}</div>

                  <div className="space-y-6 pt-8 border-t border-white/10">
                    <InfoRow
                      icon={<Clock size={16} />}
                      label={language === "am" ? "ቆይታ" : "Duration"}
                      value={course.duration || "N/A"}
                    />
                    <InfoRow
                      icon={<Calendar size={16} />}
                      label={language === "am" ? "የመጀመሪያ ቀን" : "Start Date"}
                      value={
                        course.startDate
                          ? new Date(course.startDate).toLocaleDateString(
                              language === "am" ? "am-ET" : "en-US"
                            )
                          : "TBA"
                      }
                    />
                    <InfoRow
                      icon={<ShieldCheck size={16} />}
                      label={language === "am" ? "ሰርተፍኬት" : "Certificate"}
                      value={language === "am" ? "ይሰጣል" : "Certified"}
                      valueClass="text-gold"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, valueClass }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 text-white/40">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest">
          {label}
        </span>
      </div>
      <span className={`text-[11px] font-bold ${valueClass || ""}`}>
        {value}
      </span>
    </div>
  );
}
