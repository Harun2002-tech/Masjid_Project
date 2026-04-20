import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../theme-provider";
import { useLanguage } from "../../contexts/language-context";
import { useAuth } from "../../contexts/auth-context";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

// ያንተን ሎጎ እዚህ ጋር ኢምፖርት አድርገናል
import LogoImg from "../../assets/logo.jpg";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

import {
  Moon,
  Sun,
  Menu,
  ChevronDown,
  Globe,
  LogOut,
  LayoutDashboard,
  BookOpen,
  Heart,
  GraduationCap,
  Phone,
  Info,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about"), icon: Info },
    { href: "/ustaz", label: t("ustazs"), icon: GraduationCap },
    { href: "/courses", label: t("courses"), icon: BookOpen },
    { href: "/prayer-times", label: t("prayer_times"), icon: Sparkles },
    { href: "/library", label: t("library"), icon: BookOpen },
    { href: "/donations", label: t("donations"), icon: Heart },
    { href: "/contact", label: t("contact"), icon: Phone },
  ];

  const isActive = (path) => location.pathname === path;

  const languageOptions = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
    { code: "am", label: "አማርኛ", flag: "🇪🇹" },
  ];

  const navFont = language === "am" ? "font-arefa" : "font-sans";

  return (
    <header className="site-header">
      <div className="w-full flex h-24 items-center justify-between px-4 lg:px-8">
        {/* Logo Section - ወደ ግራ ጥግ (Home) የተጠጋ */}
        <Link
          to="/"
          className="flex items-center gap-4 group shrink-0 transition-all duration-300 ml-0"
        >
          <div className="relative h-14 w-14 flex items-center justify-center">
            {/* Background Frame */}
            <div className="absolute inset-0 rounded-full border-2 border-gold/30 group-hover:border-gold transition-colors duration-500" />

            {/* Inner Logo (ወደ ውስጥ ገባ የሚለው አኒሜሽን) */}
            <div className="h-[90%] w-[90%] rounded-full overflow-hidden bg-white shadow-inner transition-all duration-500 ease-out group-hover:scale-90">
              <img
                src={LogoImg}
                alt="Ruhama Logo"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Text Part */}
          <div className="flex flex-col border-l border-gray-200/50 pl-4 py-1">
            <p className="text-2xl font-black leading-none tracking-tight text-emerald-deep font-display transition-colors group-hover:text-gold">
              Ruhama
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mt-1.5">
              Islamic Center
            </p>
          </div>
        </Link>

        {/* ቀሪው የNavbar ክፍል (Links, Buttons...) እዚህ ይቀጥላል */}

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="relative px-4 py-2 group"
            >
              <span
                className={`text-[14px] font-medium transition-colors ${navFont} ${
                  isActive(link.href)
                    ? "text-emerald-deep font-bold"
                    : "text-gray-500 hover:text-emerald-deep"
                }`}
              >
                {link.label}
              </span>
              {isActive(link.href) && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Controls: Language, Theme, Auth */}
        <div className="flex items-center gap-3">
          {/* Language Picker */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gold hover:bg-gray-50 rounded-xl transition-all"
              >
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-2xl border-gray-100 bg-white p-2 shadow-2xl"
            >
              {languageOptions.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`rounded-xl px-4 py-3 cursor-pointer mb-1 flex items-center justify-between ${
                    language === lang.code
                      ? "bg-gray-50 text-emerald-deep font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{lang.flag}</span>
                    <span
                      className={`text-sm ${
                        lang.code === "am" ? "font-arefa" : ""
                      }`}
                    >
                      {lang.label}
                    </span>
                  </div>
                  {language === lang.code && (
                    <div className="h-1.5 w-1.5 rounded-full bg-gold" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth Section */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="pl-1 pr-3 py-1 rounded-full border border-gray-100 hover:bg-gray-50 group transition-all"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-deep text-white text-xs font-bold shadow-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium text-emerald-deep hidden sm:inline ${navFont}`}
                  >
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="ml-1 h-3 w-3 text-gray-400 group-hover:translate-y-0.5 transition-transform" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-64 rounded-3xl border-gray-100 bg-white p-5 mt-2 shadow-2xl"
              >
                <div className="px-2 py-4 mb-2">
                  <p
                    className={`text-lg font-bold text-emerald-deep ${navFont}`}
                  >
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
                </div>

                <DropdownMenuSeparator className="bg-gray-100 mb-4" />

                <DropdownMenuItem
                  asChild
                  className="rounded-xl cursor-pointer p-0 overflow-hidden"
                >
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:text-emerald-deep hover:bg-gray-50 transition-all"
                  >
                    <LayoutDashboard size={18} className="text-gold" />
                    <span className={`text-sm font-medium ${navFont}`}>
                      {t("dashboard")}
                    </span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-100 my-4" />

                <DropdownMenuItem
                  onClick={logout}
                  className="rounded-xl text-rose-500 hover:bg-rose-50 cursor-pointer px-4 py-3 transition-all flex items-center gap-4"
                >
                  <LogOut size={18} />
                  <span className={`text-sm font-medium ${navFont}`}>
                    Logout
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button
                variant="ghost"
                asChild
                className={`text-sm font-medium text-gray-600 hover:text-emerald-deep rounded-xl px-5 ${navFont}`}
              >
                <Link to="/login">{t("login")}</Link>
              </Button>
              <Button
                asChild
                className={`bg-emerald-deep hover:bg-emerald-medium text-white text-sm font-bold rounded-xl px-6 shadow-md transition-all border-none ${navFont}`}
              >
                <Link to="/register">{t("register")}</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-emerald-deep hover:bg-gray-50 rounded-xl"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-full sm:w-80 bg-white border-none rounded-l-[2rem] p-0"
            >
              <SheetHeader className="text-left pt-12 px-8">
                <SheetTitle className="text-emerald-deep font-display text-3xl">
                  Menu<span className="text-gold">.</span>
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-12 flex flex-col gap-2 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                      isActive(link.href)
                        ? "bg-emerald-deep text-white shadow-lg shadow-emerald-900/10"
                        : "text-gray-500 hover:bg-gray-50 hover:text-emerald-deep"
                    }`}
                  >
                    <div
                      className={
                        isActive(link.href) ? "text-gold" : "text-emerald-deep"
                      }
                    >
                      {link.icon && <link.icon size={20} />}
                    </div>
                    <span className={`text-base font-medium ${navFont}`}>
                      {link.label}
                    </span>
                  </Link>
                ))}
              </nav>

              {!isAuthenticated && (
                <div className="absolute bottom-10 left-8 right-8 flex flex-col gap-4">
                  <Button
                    asChild
                    className={`w-full bg-emerald-deep text-white py-6 rounded-2xl font-bold text-lg shadow-xl ${navFont}`}
                  >
                    <Link to="/register">{t("register")}</Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className={`w-full border-gray-100 text-emerald-deep py-6 rounded-2xl font-bold text-lg ${navFont}`}
                  >
                    <Link to="/login">{t("login")}</Link>
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
