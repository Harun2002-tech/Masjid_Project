import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "../../contexts/language-context";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  BookOpen,
  Search,
  Filter,
  Download,
  FileText,
  Loader2,
  Star,
  User as UserIcon,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const typeIcons = {
  pdf: FileText,
  book: BookOpen,
};

export default function LibraryPage() {
  const { language, dir } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showSheikhBooks, setShowSheikhBooks] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://https://masjid-project.onrender.com/api/library"
        );
        setItems(response.data.data || []);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredItems = items.filter((item) => {
    const title = item.title?.toLowerCase() || "";
    const author = item.author?.toLowerCase() || "";
    const search = searchQuery.toLowerCase();
    const matchesSearch = title.includes(search) || author.includes(search);
    const matchesCategory =
      selectedCategory === "all" ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();
    let matchesSheikh = true;
    if (showSheikhBooks) {
      matchesSheikh =
        item.isSheikhBook === true ||
        author.includes("jud") ||
        author.includes("ጁድ") ||
        author.includes("جود");
    }
    return matchesSearch && matchesCategory && matchesSheikh;
  });

  const displayedItems = [...filteredItems].sort((a, b) => {
    if (a.isSheikhBook && !b.isSheikhBook) return -1;
    if (!a.isSheikhBook && b.isSheikhBook) return 1;
    return 0;
  });

  const categories = Array.from(new Set(items.map((i) => i.category))).filter(
    Boolean
  );

  const titleFont =
    language === "am"
      ? "font-amharic"
      : language === "ar"
      ? "font-serif"
      : "font-display";
  const bodyFont = language === "am" ? "font-amharic" : "font-sans";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-gold" />
        <p
          className={`mt-4 text-gold/60 font-bold uppercase tracking-[0.3em] text-[10px] ${bodyFont}`}
        >
          {language === "am"
            ? "ኪታቦች በመጫን ላይ ናቸው..."
            : language === "ar"
            ? "جاري تحميل الكتب..."
            : "Loading Books..."}
        </p>
      </div>
    );
  }

  return (
    <div dir={dir} className="min-h-screen py-20 px-4 selection:bg-gold/30">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Header Section */}
        <header
          className={`mb-20 ${dir === "rtl" ? "text-right" : "text-left"}`}
        >
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-2 mb-4 ${
              dir === "rtl" ? "justify-end" : ""
            }`}
          >
            <Sparkles className="h-4 w-4 text-gold animate-pulse" />
            <span
              className={`text-[10px] font-black uppercase tracking-[0.4em] text-gold/50 ${bodyFont}`}
            >
              Digital Knowledge Hub
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-5xl md:text-7xl font-bold tracking-tight text-white ${titleFont}`}
          >
            {language === "am"
              ? "የኪታቦች ማከማቻ"
              : language === "ar"
              ? "مكتبة الكتب"
              : "Digital Library"}
            <span className="text-gold">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`mt-6 max-w-2xl text-lg text-white/60 leading-relaxed italic ${bodyFont}`}
          >
            {language === "am"
              ? "በሼክ ሙሀመድ ጁድ እና በሌሎችም ታዋቂ ኡስታዞች የተዘጋጁ ዲጂታል መጽሐፍትን እዚህ ያገኛሉ።"
              : language === "ar"
              ? "هنا تجد الكتب الرقمية التي أعدها الشيخ محمد جود وغيره من الأساتذة المشهورين."
              : "Access digital books prepared by Sheikh Mohammed Jud and other prominent scholars."}
          </motion.p>
        </header>

        {/* Search & Filters */}
        <div className="glass p-6 rounded-[2.5rem] mb-16 border-white/5 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-3">
              <button
                onClick={() => setShowSheikhBooks(!showSheikhBooks)}
                className={`w-full h-14 rounded-2xl transition-all duration-500 border flex items-center justify-center gap-3 ${bodyFont} ${
                  showSheikhBooks
                    ? "btn-gold shadow-lg shadow-gold/20 scale-105"
                    : "bg-white/5 text-white/60 border-white/10 hover:border-gold/50"
                }`}
              >
                <Star
                  className={`h-4 w-4 ${showSheikhBooks ? "fill-current" : ""}`}
                />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {language === "am"
                    ? "የሼክ ጁድ ኪታቦች"
                    : language === "ar"
                    ? "كتب الشيخ جود"
                    : "Sheikh Jud's Books"}
                </span>
              </button>
            </div>

            <div className="lg:col-span-6 relative group">
              <Search
                className={`absolute ${
                  dir === "rtl" ? "right-5" : "left-5"
                } top-1/2 h-5 w-5 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors`}
              />
              <input
                type="text"
                dir={dir}
                placeholder={
                  language === "am"
                    ? "ኪታብ ወይም ደራሲ ይፈልጉ..."
                    : language === "ar"
                    ? "ابحث عن كتاب أو مؤلف..."
                    : "Search books or authors..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`payment-input w-full h-14 rounded-2xl outline-none text-sm font-medium ${
                  dir === "rtl" ? "pr-14 pl-5" : "pl-14 pr-5"
                }`}
              />
            </div>

            <div className="lg:col-span-3">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger
                  dir={dir}
                  className="h-14 bg-white/5 border-white/10 rounded-2xl text-white outline-none focus:ring-1 focus:ring-gold"
                >
                  <div
                    className={`flex items-center gap-3 ${
                      dir === "rtl" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Filter className="h-4 w-4 text-gold" />
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${bodyFont}`}
                    >
                      <SelectValue placeholder="ዘርፍ" />
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent
                  dir={dir}
                  className="bg-[#0f172a] border-white/10 rounded-2xl text-white"
                >
                  <SelectItem
                    value="all"
                    className={`text-[10px] font-bold uppercase py-3 ${bodyFont}`}
                  >
                    {language === "am"
                      ? "ሁሉም ዘርፎች"
                      : language === "ar"
                      ? "جميع الفئات"
                      : "All Categories"}
                  </SelectItem>
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat}
                      value={cat}
                      className={`text-[10px] font-bold uppercase py-3 ${bodyFont}`}
                    >
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Library Grid */}
        <AnimatePresence mode="popLayout">
          {displayedItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-40 glass rounded-[4rem]"
            >
              <BookOpen className="mx-auto h-20 w-20 text-white/5 mb-4" />
              <h3
                className={`text-xl font-bold text-white/20 italic ${bodyFont}`}
              >
                {language === "am"
                  ? "ምንም መጽሐፍ አልተገኘም"
                  : language === "ar"
                  ? "لم يتم العثور على كتب"
                  : "No books found"}
              </h3>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {displayedItems.map((item) => (
                <LibraryCard
                  key={item._id}
                  item={item}
                  language={language}
                  dir={dir}
                  bodyFont={bodyFont}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function LibraryCard({ item, language, dir, bodyFont }) {
  const Icon = typeIcons[item.type] || FileText;
  const handleDownload = () => window.open(item.fileUrl, "_blank");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      className="h-full"
    >
      <Card
        className={`relative h-full flex flex-col rounded-[2.5rem] overflow-hidden transition-all duration-500 glass border-white/5 ${
          item.isSheikhBook
            ? "border-gold/30 shadow-[0_0_40px_rgba(251,191,36,0.05)]"
            : ""
        }`}
      >
        {item.isSheikhBook && (
          <div
            className={`absolute -top-4 ${
              dir === "rtl" ? "-left-4" : "-right-4"
            } p-8 opacity-10 pointer-events-none`}
          >
            <Sparkles className="h-32 w-32 text-gold" />
          </div>
        )}

        <CardContent
          className={`flex-1 p-8 flex flex-col relative z-10 ${
            dir === "rtl" ? "text-right" : "text-left"
          }`}
        >
          <div
            className={`flex items-start justify-between mb-8 ${
              dir === "rtl" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`p-4 rounded-2xl ${
                item.isSheikhBook
                  ? "bg-gold text-black shadow-lg shadow-gold/20"
                  : "bg-white/5 text-gold"
              }`}
            >
              {item.isSheikhBook ? (
                <Star className="h-7 w-7 fill-current" />
              ) : (
                <Icon className="h-7 w-7" />
              )}
            </div>
            <Badge
              className={`rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest border-none ${
                item.isSheikhBook
                  ? "bg-white text-black"
                  : "bg-gold/10 text-gold"
              } ${bodyFont}`}
            >
              {item.category}
            </Badge>
          </div>

          <div className="space-y-3">
            <h3
              className={`text-xl font-bold leading-tight group-hover:text-gold transition-colors ${
                item.isSheikhBook ? "text-white" : "text-white/90"
              } ${bodyFont}`}
            >
              {item.title}
            </h3>
            <div
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ${
                dir === "rtl" ? "justify-end" : ""
              }`}
            >
              {dir === "rtl" ? <span>{item.author}</span> : null}
              <UserIcon className="h-3 w-3 text-gold" />
              {dir !== "rtl" ? <span>{item.author}</span> : null}
            </div>
          </div>

          <p
            className={`mt-6 text-xs leading-relaxed line-clamp-3 text-white/40 italic ${bodyFont}`}
          >
            {item.description ||
              (language === "am"
                ? "ለዚህ መጽሐፍ ዝርዝር መግለጫ አልተሰጠም። በቅርቡ ይጨመራል..."
                : language === "ar"
                ? "لا يوجد وصف لهذا الكتاب حالياً."
                : "No description available yet.")}
          </p>

          <div className="mt-auto pt-8">
            <button
              onClick={handleDownload}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[9px] transition-all flex items-center justify-center gap-3 ${bodyFont} ${
                item.isSheikhBook
                  ? "btn-gold"
                  : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              <Download className="h-4 w-4" />
              {language === "am"
                ? "አውርድ / አንብብ"
                : language === "ar"
                ? "تحميل / قراءة"
                : "Download / Read"}
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
