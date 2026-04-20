import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/auth-context";
import { useLanguage } from "../../contexts/language-context";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isLoading: authLoading } = useAuth();
  const { language, t, dir } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  /**
   * 🚀 Redirection Logic - ከዳታቤዝህ ሮሎች ጋር የተዛመደ
   */
  const handleRedirection = useCallback(
    (userData) => {
      // 1. መጀመሪያ ሊገባበት የፈለገው ገጽ ካለ (ለምሳሌ /admin ሊከፍት ሲል ሎጊን የጠየቀው ከሆነ)
      const from = location.state?.from?.pathname;

      // 2. የተጠቃሚውን ሮል ለይተን እናውጣ
      const role = userData.role?.toLowerCase();
      const adminRoles = ["admin", "superadmin", "super_admin", "masjid_admin"];

      if (from && from !== "/login") {
        navigate(from, { replace: true });
      } else if (adminRoles.includes(role)) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    },
    [navigate, location]
  );

  // ተጠቃሚው ገብቶ ከሆነ ወዲያውኑ Redirect አድርገው
  useEffect(() => {
    if (user && !authLoading) {
      handleRedirection(user);
    }
  }, [user, authLoading, handleRedirection]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLocalLoading(true);

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError(
        language === "am" ? "እባክዎ ሁሉንም ክፍተቶች ይሙሉ" : "Please fill all fields"
      );
      setLocalLoading(false);
      return;
    }

    try {
      const loggedInUser = await login(cleanEmail, password);
      // login ስኬታማ ከሆነ handleRedirection ይጠራል
      if (loggedInUser) {
        handleRedirection(loggedInUser);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (language === "am" ? "የገቡት መረጃ ትክክል አይደለም" : "Invalid credentials");
      setError(errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  const isAnyLoading = authLoading || localLoading;

  return (
    <div
      dir={dir}
      className="min-h-screen flex items-center justify-center bg-[#05080f] px-4 py-20 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-[-15%] left-[-10%] w-[70%] h-[70%] bg-gold/5 rounded-full blur-[150px] animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gold shadow-lg ring-4 ring-gold/20">
            <ShieldCheck className="text-black w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            {language === "am" ? "እንኳን ተመለሱ" : "Welcome Back"}
          </h1>
        </div>

        <Card className="bg-white/[0.02] border-white/10 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl overflow-hidden">
          <CardHeader className="text-center pt-10">
            <CardTitle className="text-xl text-white font-medium">
              {t("login")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert
                      variant="destructive"
                      className="bg-red-500/10 border-red-500/20 text-red-400 rounded-xl"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        {error}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label className="text-white/40 text-[10px] uppercase ml-2 tracking-widest">
                  Email
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/50 group-focus-within:text-gold transition-colors" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 bg-white/5 border-white/10 h-14 rounded-xl text-white focus:border-gold/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white/40 text-[10px] uppercase ml-2 tracking-widest">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gold/50 group-focus-within:text-gold transition-colors" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 bg-white/5 border-white/10 h-14 rounded-xl text-white focus:border-gold/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gold hover:bg-white text-black font-bold rounded-xl transition-all active:scale-[0.98]"
                disabled={isAnyLoading}
              >
                {isAnyLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    {language === "am" ? "ግባ" : "Login"}{" "}
                    <ArrowRight size={18} />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
