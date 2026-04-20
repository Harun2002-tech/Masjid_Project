import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/auth-context";
import { useLanguage } from "../../contexts/language-context";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { Checkbox } from "../ui/checkbox";
import {
  Loader2,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  UserPlus,
  Sparkles,
} from "lucide-react";

export function RegisterForm() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const { language, t, dir } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Password Match Validation
    if (formData.password !== formData.confirmPassword) {
      setError(
        language === "am"
          ? "የይለፍ ቃሎቹ አይመሳሰሉም"
          : language === "ar"
          ? "كلمات المرور غير متطابقة"
          : "Passwords do not match"
      );
      return;
    }

    // 2. Terms Validation
    if (!agreeTerms) {
      setError(
        language === "am"
          ? "እባክዎ የደንብና ግዴታዎችን ስምምነት ያረጋግጡ"
          : language === "ar"
          ? "يرجى الموافقة على الشروط والأحكام"
          : "Please agree to the terms and conditions"
      );
      return;
    }

    try {
      // 3. Call Register from AuthContext
      const success = await register(
        formData.name,
        formData.email,
        formData.password,
        "student" // በቋሚነት ተማሪ ሆኖ ይመዘገባል
      );

      if (success) {
        // ምዝገባው ከተሳካ ወደ ዳሽቦርድ ይሂድ
        navigate("/dashboard");
      }
    } catch (err) {
      // ከባክኤንድ የሚመጣውን ስህተት አውጥቶ ያሳያል
      const backendMessage = err.response?.data?.message || err.message;
      setError(
        backendMessage ||
          (language === "am"
            ? "ምዝገባው አልተሳካም። እባክዎ ደግመው ይሞክሩ።"
            : "Registration failed. Please try again.")
      );
    }
  };

  const titleFont =
    language === "am"
      ? "font-amharic"
      : language === "ar"
      ? "font-serif"
      : "font-display";
  const bodyFont = language === "am" ? "font-amharic" : "font-sans";

  return (
    <div
      dir={dir}
      className="min-h-screen flex items-center justify-center bg-[#05080f] px-4 py-20 relative overflow-hidden selection:bg-gold/30"
    >
      {/* Background Decor */}
      <div
        className={`absolute top-[-10%] ${
          dir === "rtl" ? "left-[-10%]" : "right-[-10%]"
        } w-[60%] h-[60%] bg-gold/5 rounded-full blur-[150px] animate-pulse`}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl z-10"
      >
        <div className="text-center mb-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-gold shadow-[0_20px_50px_rgba(212,175,55,0.2)] relative group"
          >
            <UserPlus className="text-black w-10 h-10" />
            <div className="absolute inset-0 rounded-[2.5rem] border-2 border-white/20 scale-110 group-hover:scale-125 transition-transform duration-700" />
          </motion.div>

          <h1
            className={`text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4 ${titleFont}`}
          >
            {language === "am"
              ? "አዲስ"
              : language === "ar"
              ? "ابدأ"
              : "Start Your"}{" "}
            <span className="text-gold-glow italic">
              {language === "am"
                ? "ጉዞ ይጀምሩ"
                : language === "ar"
                ? "رحلتك"
                : "Journey"}{" "}
              .
            </span>
          </h1>
          <p
            className={`text-white/30 text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 ${bodyFont}`}
          >
            <Sparkles size={14} className="text-gold" />
            {language === "ar"
              ? "انضم إلى مجتمع أكاديمية رحماء"
              : "Join the Ruhama Academy Community"}
          </p>
        </div>

        <Card className="bg-white/[0.02] border-white/10 shadow-2xl rounded-[3.5rem] backdrop-blur-3xl overflow-hidden border-t-white/20">
          <CardHeader className="p-10 md:p-14 pb-4 text-center">
            <CardTitle
              className={`text-2xl font-bold text-white mb-2 ${titleFont}`}
            >
              {t("register") ||
                (language === "am" ? "አካውንት ይፍጠሩ" : "Create Account")}
            </CardTitle>
            <CardDescription
              className={`text-white/20 text-[10px] uppercase font-black tracking-[0.2em] ${bodyFont}`}
            >
              {language === "am"
                ? "ትምህርትዎን በሩሃማ ለመጀመር ጥቂት ደረጃዎች ብቻ ቀርተውዎታል"
                : "A few steps away from starting your education"}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-10 md:p-14 pt-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert
                      variant="destructive"
                      className="bg-red-500/10 border-red-500/20 text-red-400 rounded-2xl border-dashed"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription
                        className={`text-xs font-bold italic ${bodyFont}`}
                      >
                        {error}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-start">
                {/* Full Name */}
                <div className="space-y-3">
                  <Label
                    className={`text-white/40 text-[9px] font-black uppercase mx-4 tracking-widest ${bodyFont}`}
                  >
                    {language === "am" ? "ሙሉ ስም" : "Full Name"}
                  </Label>
                  <div className="relative group">
                    <User
                      className={`absolute ${
                        dir === "rtl" ? "right-6" : "left-6"
                      } top-1/2 h-4 w-4 -translate-y-1/2 text-gold/40 group-focus-within:text-gold transition-colors`}
                    />
                    <Input
                      name="name"
                      placeholder={language === "am" ? "አበበ ከበደ" : "John Doe"}
                      value={formData.name}
                      onChange={handleChange}
                      className={`${
                        dir === "rtl" ? "pr-16" : "pl-16"
                      } bg-white/[0.03] border-white/10 rounded-[1.2rem] h-16 text-white focus:ring-gold/20 focus:border-gold/50 transition-all`}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <Label
                    className={`text-white/40 text-[9px] font-black uppercase mx-4 tracking-widest ${bodyFont}`}
                  >
                    {language === "am" ? "ኢሜይል" : "Email"}
                  </Label>
                  <div className="relative group">
                    <Mail
                      className={`absolute ${
                        dir === "rtl" ? "right-6" : "left-6"
                      } top-1/2 h-4 w-4 -translate-y-1/2 text-gold/40 group-focus-within:text-gold transition-colors`}
                    />
                    <Input
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${
                        dir === "rtl" ? "pr-16" : "pl-16"
                      } bg-white/[0.03] border-white/10 rounded-[1.2rem] h-16 text-white focus:ring-gold/20 focus:border-gold/50 transition-all`}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-3">
                  <Label
                    className={`text-white/40 text-[9px] font-black uppercase mx-4 tracking-widest ${bodyFont}`}
                  >
                    {language === "am" ? "የይለፍ ቃል" : "Password"}
                  </Label>
                  <div className="relative group">
                    <Lock
                      className={`absolute ${
                        dir === "rtl" ? "right-6" : "left-6"
                      } top-1/2 h-4 w-4 -translate-y-1/2 text-gold/40 group-focus-within:text-gold transition-colors`}
                    />
                    <Input
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={`${
                        dir === "rtl" ? "pr-16" : "pl-16"
                      } bg-white/[0.03] border-white/10 rounded-[1.2rem] h-16 text-white focus:ring-gold/20 focus:border-gold/50 transition-all`}
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-3">
                  <Label
                    className={`text-white/40 text-[9px] font-black uppercase mx-4 tracking-widest ${bodyFont}`}
                  >
                    {language === "am" ? "ማረጋገጫ" : "Confirm"}
                  </Label>
                  <div className="relative group">
                    <Lock
                      className={`absolute ${
                        dir === "rtl" ? "right-6" : "left-6"
                      } top-1/2 h-4 w-4 -translate-y-1/2 text-gold/40 group-focus-within:text-gold transition-colors`}
                    />
                    <Input
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`${
                        dir === "rtl" ? "pr-16" : "pl-16"
                      } bg-white/[0.03] border-white/10 rounded-[1.2rem] h-16 text-white focus:ring-gold/20 focus:border-gold/50 transition-all`}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div
                className={`flex items-center ${
                  dir === "rtl" ? "space-x-reverse space-x-4" : "space-x-4"
                } p-5 rounded-2xl bg-white/[0.02] border border-white/5 transition-colors hover:border-gold/20`}
              >
                <Checkbox
                  id="terms"
                  className="border-gold/30 data-[state=checked]:bg-gold data-[state=checked]:text-black rounded-md"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                />
                <label
                  htmlFor="terms"
                  className={`text-[10px] text-white/40 leading-snug font-medium cursor-pointer ${bodyFont}`}
                >
                  {language === "am"
                    ? "በሩሃማ ደንቦች እና መመሪያዎች እስማማለሁ"
                    : "I agree to Ruhama's Terms and Privacy Policy"}
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-16 bg-gold hover:bg-white text-black font-black uppercase text-[11px] tracking-[0.3em] rounded-2xl shadow-2xl transition-all active:scale-95 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    {language === "am" ? "አሁን መዝግብ" : "Create Account"}
                    {dir === "rtl" ? (
                      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-2 transition-transform" />
                    ) : (
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                    )}
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-12 pt-10 border-t border-white/5 text-center">
              <span
                className={`text-white/20 text-[10px] font-black uppercase tracking-widest ${bodyFont}`}
              >
                {language === "am" ? "አካውንት አለዎት?" : "Already have an account?"}
              </span>
              <Link
                to="/login"
                className={`text-gold hover:text-white font-black text-[10px] uppercase tracking-widest mx-3 transition-colors underline underline-offset-8 decoration-gold/30 ${bodyFont}`}
              >
                {language === "am" ? "ይግቡ" : "Sign In"}
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
