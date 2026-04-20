import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  ChevronDownIcon,
  CheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const themes = [
  {
    value: "light",
    name: "Light",
    description: "ለቀን ክፍለ ጊዜ የሚመች",
    icon: SunIcon,
    preview: {
      bg: "bg-white",
      border: "border-gray-200",
      text: "text-gray-900",
      accent: "text-amber-600",
    },
  },
  {
    value: "dark",
    name: "Dark",
    description: "ለማታ ክፍለ ጊዜ የሚመች",
    icon: MoonIcon,
    preview: {
      bg: "bg-gray-950",
      border: "border-white/10",
      text: "text-white",
      accent: "text-amber-500",
    },
  },
  {
    value: "system",
    name: "System",
    description: "በስልክዎ ቅንብር መሰረት",
    icon: ComputerDesktopIcon,
    preview: {
      bg: "bg-gradient-to-br from-gray-100 to-gray-900",
      border: "border-gray-400",
      text: "text-gray-500",
      accent: "text-blue-500",
    },
  },
];

const ThemeSelector = ({
  className = "",
  showPreview = true,
  compact = false,
}) => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeChange = (themeValue) => {
    setTheme(themeValue);
    setIsOpen(false);
    localStorage.setItem("preferredTheme", themeValue);
  };

  const CurrentIcon = currentTheme.icon;

  // --- COMPACT MODE ---
  if (compact) {
    return (
      <div
        className={`flex p-1.5 bg-black/20 backdrop-blur-md border border-white/5 rounded-2xl ${className}`}
      >
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isActive = theme === themeOption.value;
          return (
            <button
              key={themeOption.value}
              onClick={() => handleThemeChange(themeOption.value)}
              className={`flex-1 flex justify-center p-2.5 rounded-xl transition-all relative ${
                isActive
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="h-5 w-5" />
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // --- FULL DROPDOWN MODE ---
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-black uppercase tracking-tighter text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-amber-500/50 transition-all backdrop-blur-md group"
      >
        <CurrentIcon className="h-4 w-4 text-amber-500" />
        <span className="hidden sm:block italic">{currentTheme.name}</span>
        <ChevronDownIcon
          className={`h-3 w-3 text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-amber-500" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="absolute right-0 mt-3 w-72 bg-[#111827] border border-white/10 rounded-[2rem] shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
          >
            <div className="p-3 space-y-1">
              <div className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">
                ገጽታ ይምረጡ / Select Theme
              </div>

              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isActive = theme === themeOption.value;
                return (
                  <button
                    key={themeOption.value}
                    onClick={() => handleThemeChange(themeOption.value)}
                    className={`w-full flex items-center space-x-4 p-3 rounded-[1.2rem] transition-all ${
                      isActive
                        ? "bg-amber-500 text-black"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl ${
                        isActive
                          ? "bg-black/10"
                          : "bg-slate-900 border border-white/5 shadow-inner"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isActive ? "text-black" : "text-amber-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black uppercase tracking-tight italic">
                          {themeOption.name}
                        </span>
                        {isActive && (
                          <CheckIcon className="h-4 w-4 stroke-[4px]" />
                        )}
                      </div>
                      <p
                        className={`text-[10px] leading-tight font-bold ${
                          isActive ? "text-black/60" : "text-gray-500"
                        }`}
                      >
                        {themeOption.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {showPreview && (
              <div className="bg-black/40 p-5 border-t border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <SparklesIcon className="h-4 w-4 text-amber-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                    Live Preview
                  </span>
                </div>
                <div
                  className={`rounded-2xl p-4 shadow-2xl ${currentTheme.preview.bg} border ${currentTheme.preview.border} transition-all duration-500`}
                >
                  <div className="flex gap-1.5 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                  </div>
                  <p
                    className={`text-[11px] font-bold leading-relaxed italic ${currentTheme.preview.text}`}
                  >
                    ይህ የእርስዎ{" "}
                    <span className={currentTheme.preview.accent}>
                      {currentTheme.name}
                    </span>{" "}
                    ገጽታ አጠቃላይ እይታ ነው።
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
