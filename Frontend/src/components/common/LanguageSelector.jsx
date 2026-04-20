import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  CheckIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const languages = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    dir: "ltr",
  },
  {
    code: "am",
    name: "Amharic",
    nativeName: "አማርኛ",
    flag: "🇪🇹",
    dir: "ltr",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    dir: "rtl",
  },
];

const LanguageSelector = ({
  className = "",
  showFlag = true,
  showNativeName = true,
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    localStorage.setItem("preferredLanguage", languageCode);

    const selectedLanguage = languages.find(
      (lang) => lang.code === languageCode
    );
    document.documentElement.dir = selectedLanguage?.dir || "ltr";
    document.documentElement.lang = languageCode;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main Button - የተሻሻለ ስታይል */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-black uppercase tracking-tighter text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-amber-500/50 transition-all shadow-lg backdrop-blur-md group"
      >
        {showFlag && (
          <span className="text-lg group-hover:scale-110 transition-transform">
            {currentLanguage.flag}
          </span>
        )}
        <GlobeAltIcon className="h-4 w-4 text-amber-500" />
        <span className="hidden md:block italic">
          {showNativeName ? currentLanguage.nativeName : currentLanguage.name}
        </span>
        <ChevronDownIcon
          className={`h-3 w-3 text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-amber-500" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu - ይበልጥ ዘመናዊ እና ግልጽ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute right-0 mt-3 w-56 bg-[#111827] border border-white/10 rounded-[1.5rem] shadow-2xl z-[100] overflow-hidden backdrop-blur-xl"
          >
            <div className="p-2 space-y-1">
              <div className="px-3 py-2 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">
                ቋንቋ ይምረጡ / Select Language
              </div>

              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 text-sm rounded-xl transition-all ${
                    language.code === i18n.language
                      ? "bg-amber-500 text-black font-black"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-xl leading-none">{language.flag}</span>
                  <div className="flex-1 text-left">
                    <div className="font-bold leading-tight">
                      {language.nativeName}
                    </div>
                    <div
                      className={`text-[9px] uppercase tracking-widest ${
                        language.code === i18n.language
                          ? "text-black/60"
                          : "text-gray-600"
                      }`}
                    >
                      {language.name}
                    </div>
                  </div>
                  {language.code === i18n.language && (
                    <motion.div layoutId="activeCheck">
                      <CheckIcon className="h-4 w-4 stroke-[4px]" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
