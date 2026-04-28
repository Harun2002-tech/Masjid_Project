import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Mail,
  Loader2,
  CheckCircle,
  XCircle,
  HeartHandshake,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../../contexts/language-context";

// --- 1. የማረጋገጫ ክፍል (Verification Section) ---
const VerifySection = ({ tx_ref, language, dir, bodyFont }) => {
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(
          `https://masjid-project.onrender.com/api/payment/verify/${tx_ref}`
        );
        const data = await response.json();
        if (data.status === "success") setStatus("success");
        else setStatus("failed");
      } catch (error) {
        setStatus("failed");
      }
    };
    if (tx_ref) verify();
  }, [tx_ref]);

  return (
    <div className="text-center py-10 space-y-6">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-gold" size={50} />
          <p
            className={`font-bold uppercase tracking-widest text-gold/60 text-xs ${bodyFont}`}
          >
            {language === "am"
              ? "ክፍያውን በማረጋገጥ ላይ..."
              : language === "ar"
              ? "جاري التحقق من الدفع..."
              : "Verifying Payment..."}
          </p>
        </div>
      )}
      {status === "success" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <CheckCircle className="text-gold mx-auto" size={60} />
          <h2
            className={`text-3xl font-bold text-gold-glow italic ${bodyFont}`}
          >
            {language === "am"
              ? "ልገሳው ተሳክቷል!"
              : language === "ar"
              ? "تم التبرع بنجاح!"
              : "Donation Successful!"}
          </h2>
          <button
            onClick={() => navigate("/")}
            className={`w-full py-4 btn-gold rounded-2xl font-bold uppercase tracking-widest ${bodyFont}`}
          >
            {language === "am"
              ? "ወደ ዋና ገጽ ተመለስ"
              : language === "ar"
              ? "العودة للصفحة الرئيسية"
              : "Back to Home"}
          </button>
        </motion.div>
      )}
      {status === "failed" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <XCircle className="text-red-500 mx-auto" size={60} />
          <h2 className={`text-2xl font-bold text-red-glow italic ${bodyFont}`}>
            {language === "am"
              ? "ክፍያው አልተሳካም"
              : language === "ar"
              ? "فشلت عملية الدفع"
              : "Payment Failed"}
          </h2>
          <button
            onClick={() => (window.location.href = "/donations")}
            className={`w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold uppercase tracking-widest ${bodyFont}`}
          >
            {language === "am"
              ? "ድጋሚ ይሞክሩ"
              : language === "ar"
              ? "حاول مرة أخرى"
              : "Try Again"}
          </button>
        </motion.div>
      )}
    </div>
  );
};

// --- 2. ዋናው የክፍያ ፎርም ---
export default function BankPayment() {
  const { language, dir } = useLanguage();
  const [searchParams] = useSearchParams();
  const tx_ref = searchParams.get("tx_ref");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handlePaymentInit = async () => {
    const minAmount = 5;
    if (!amount || amount < minAmount) {
      const errorMsg =
        language === "am"
          ? `ዝቅተኛው የልገሳ መጠን ${minAmount} ብር ነው።`
          : language === "ar"
          ? `الحد الأدنى للتبرع هو ${minAmount} بر.`
          : `Minimum donation is ${minAmount} ETB.`;
      return alert(errorMsg);
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://masjid-project.onrender.com/api/payment/initialize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, email }),
        }
      );
      const result = await response.json();
      if (result.status === "success")
        window.location.href = result.data.checkout_url;
    } catch (error) {
      alert(
        language === "am"
          ? "ስህተት ተፈጥሯል። እባክዎ ደግመው ይሞክሩ።"
          : "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const bodyFont = language === "am" ? "font-amharic" : "font-sans";

  return (
    <div
      dir={dir}
      className="min-h-screen flex items-center justify-center p-6 relative selection:bg-gold/30"
    >
      <div className="w-full max-w-md relative z-10">
        {!tx_ref && (
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 text-white/40 hover:text-gold mb-6 transition-all group ${
              dir === "rtl" ? "flex-row-reverse" : ""
            }`}
          >
            {dir === "rtl" ? (
              <ArrowRight size={16} className="group-hover:translate-x-1" />
            ) : (
              <ArrowLeft size={16} className="group-hover:-translate-x-1" />
            )}
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${bodyFont}`}
            >
              {language === "am" ? "ተመለስ" : language === "ar" ? "رجوع" : "Back"}
            </span>
          </button>
        )}

        <div className="glass p-8 sm:p-10 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-gold to-red-500 opacity-50" />

          {tx_ref ? (
            <VerifySection
              tx_ref={tx_ref}
              language={language}
              dir={dir}
              bodyFont={bodyFont}
            />
          ) : (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <HeartHandshake className="text-gold mx-auto" size={40} />
                <h2
                  className={`text-3xl font-bold italic text-white ${bodyFont}`}
                >
                  {language === "am"
                    ? "ልገሳ ያድርጉ"
                    : language === "ar"
                    ? "تبرع الآن"
                    : "Make a Donation"}
                </h2>
                <p
                  className={`text-gold/50 text-[10px] font-bold uppercase tracking-[0.2em] ${bodyFont}`}
                >
                  {language === "am"
                    ? "ለሩሃማ ኢስላሚክ ሴንተር ድጋፍ ያድርጉ"
                    : language === "ar"
                    ? "ادعم مركز روهاما الإسلامي"
                    : "Support Ruhama Islamic Center"}
                </p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label
                    className={`text-[10px] font-bold text-white/40 uppercase tracking-widest block ${
                      dir === "rtl" ? "mr-2" : "ml-2"
                    } ${bodyFont}`}
                  >
                    {language === "am"
                      ? "ኢሜይል (ለደረሰኝ)"
                      : language === "ar"
                      ? "البريد الإلكتروني (للوصل)"
                      : "Email (for receipt)"}
                  </label>
                  <div className="relative">
                    <Mail
                      className={`absolute ${
                        dir === "rtl" ? "right-5" : "left-5"
                      } top-1/2 -translate-y-1/2 text-gold/40`}
                      size={18}
                    />
                    <input
                      type="email"
                      dir="ltr"
                      className={`payment-input w-full h-14 rounded-2xl outline-none text-sm bg-white/5 border border-white/10 text-white focus:border-gold/50 transition-all ${
                        dir === "rtl" ? "pr-14 pl-5 text-right" : "pl-14 pr-5"
                      }`}
                      placeholder="example@mail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className={`text-[10px] font-bold text-white/40 uppercase tracking-widest block ${
                      dir === "rtl" ? "mr-2" : "ml-2"
                    } ${bodyFont}`}
                  >
                    {language === "am"
                      ? "የልገሳ መጠን (ETB)"
                      : language === "ar"
                      ? "مبلغ التبرع (ETB)"
                      : "Donation Amount (ETB)"}
                  </label>
                  <div className="relative group">
                    <span
                      className={`absolute ${
                        dir === "rtl" ? "right-6" : "left-6"
                      } top-1/2 -translate-y-1/2 text-white/10 font-black text-xl group-focus-within:text-gold transition-colors`}
                    >
                      ETB
                    </span>
                    <input
                      type="number"
                      dir="ltr"
                      className={`payment-input w-full h-24 rounded-[2rem] outline-none text-4xl text-gold-glow font-bold placeholder:text-white/5 bg-white/5 border border-white/10 focus:border-gold/50 transition-all ${
                        dir === "rtl" ? "pr-20 pl-8 text-right" : "pl-20 pr-8"
                      }`}
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handlePaymentInit}
                disabled={!amount || loading}
                className={`w-full h-16 btn-gold rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl active:scale-[0.98] disabled:opacity-20 ${bodyFont}`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <ShieldCheck size={20} />
                )}
                {loading
                  ? language === "am"
                    ? "በማገናኘት ላይ..."
                    : "Connecting..."
                  : language === "am"
                  ? "ልገሳውን ቀጥል"
                  : language === "ar"
                  ? "متابعة التبرع"
                  : "Continue Donation"}
                {!loading &&
                  (dir === "rtl" ? (
                    <ArrowLeft size={18} className="opacity-40" />
                  ) : (
                    <ArrowRight size={18} className="opacity-40" />
                  ))}
              </button>

              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 opacity-30">
                  <Lock size={12} className="text-gold" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white">
                    Secure Payment via Chapa
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
