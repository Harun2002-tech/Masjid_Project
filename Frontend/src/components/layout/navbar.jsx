import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

import LogoImg from "../../assets/logo.jpg";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

import {
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="w-full flex h-20 items-center justify-between px-4 lg:px-8 max-w-[1400px] mx-auto">
        {/* Logo Section - shrink-0 ታክሎበታል እንዳይጨፈለቅ */}
        <Link to="/" className="flex items-center gap-3 group shrink-0 mr-4">
          <div className="relative h-12 w-12 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-full border border-gold/50 group-hover:border-gold transition-colors duration-500" />
            <div className="h-[85%] w-[85%] rounded-full overflow-hidden bg-white shadow-lg transition-transform duration-500 group-hover:scale-95">
              <img
                src={LogoImg}
                alt="Ruhama Logo"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col border-l border-white/20 pl-3 shrink-0">
            <p className="text-lg md:text-xl font-black tracking-tighter text-white group-hover:text-gold transition-colors leading-none">
              Ruhama
            </p>
            <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-gold/80 mt-1">
              Islamic Center
            </p>
          </div>
        </Link>

        {/* Desktop Navigation - ክፍተቶች (gap) ተስተካክለዋል */}
        <nav className="hidden lg:flex items-center gap-x-1 flex-nowrap overflow-hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="relative px-3 py-2 group shrink-0"
            >
              <span
                className={`text-[13px] xl:text-[14px] font-bold tracking-tight transition-all duration-300 ${
                  isActive(link.href)
                    ? "text-gold"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </span>
              {isActive(link.href) && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold shadow-[0_0_10px_#fbbf24]"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Controls Section - shrink-0 እዚህም ያስፈልጋል */}
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-gold hover:bg-white/5 rounded-full shrink-0"
              >
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 glass border-white/10 p-1 mt-2"
            >
              {languageOptions.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`rounded-lg px-3 py-2 cursor-pointer flex items-center justify-between text-white hover:bg-white/10 ${
                    language === lang.code ? "bg-white/10 text-gold" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span className="text-sm font-bold">{lang.label}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 p-1 pr-3 rounded-full border border-white/10 hover:bg-white/5 text-white shrink-0"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-black font-bold shrink-0">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold hidden xl:inline max-w-[100px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-50 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 glass border-white/10 p-2 mt-2 shadow-2xl"
              >
                <div className="px-3 py-3">
                  <p className="text-sm font-bold text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-white/50 truncate">
                    {user?.email}
                  </p>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  asChild
                  className="hover:bg-white/10 rounded-lg"
                >
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 p-2 text-white"
                  >
                    <LayoutDashboard size={16} className="text-gold" />
                    <span className="text-sm font-bold">{t("dashboard")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-3 p-2 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer"
                >
                  <LogOut size={16} />
                  <span className="text-sm font-bold">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                asChild
                className="text-white hover:text-gold font-bold"
              >
                <Link to="/login">{t("login")}</Link>
              </Button>
              <Button asChild className="btn-gold px-5 rounded-full shrink-0">
                <Link to="/register">{t("register")}</Link>
              </Button>
            </div>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/5 shrink-0"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] glass border-l border-white/10 text-white p-0"
            >
              <SheetHeader className="p-8 text-left border-b border-white/10">
                <SheetTitle className="text-white font-bold text-2xl">
                  Menu<span className="text-gold">.</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col px-4 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${
                      isActive(link.href)
                        ? "bg-gold text-black font-black"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.icon && <link.icon size={20} />}
                    <span className="text-base font-bold">{link.label}</span>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
