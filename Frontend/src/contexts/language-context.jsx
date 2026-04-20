import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

// የሚደገፉ ቋንቋዎች ዝርዝር
const translations = {
  en: {
    // Navigation
    home: "Home",
    about: "About Us",
    ustazs: "Teachers",
    courses: "Curriculum",
    prayer_times: "Prayer Times",
    events: "Events",
    blog: "Insights",
    library: "Kitab Library",
    donations: "Support Us",
    contact: "Contact",
    admissions: "Admissions",
    login: "Login",
    register: "Join Academy",
    dashboard: "Portal",

    // Hero Section
    heroTitle: "Welcome to Ruhama Islamic Center,",
    heroSubtitle:
      "Bridging the gap between classical Islamic scholarship and the modern world through the guidance of authentic scholars.",
    exploreCoures: "Explore Curriculum",

    // Features
    featuresTitle: "The Essence of Ruhama",
    featuresSubtitle: "A Sanctuary for Traditional Learning",
    qualifiedScholars: "Expert Faculty",
    qualifiedScholarsDesc:
      "Learn from certified scholars with authentic chains of transmission (Ijazah).",
    comprehensiveCurriculum: "Classical Kitab Studies",
    comprehensiveCurriculumDesc:
      "From Nahw and Sarf to Fiqh and Aqidah, structured for deep understanding.",
    flexibleLearning: "Virtual Madrasa",
    flexibleLearningDesc:
      "High-quality live and recorded lessons accessible from anywhere in the world.",
    communityFocused: "Spiritual Brotherhood",
    communityFocusedDesc:
      "Join a global community dedicated to Tazkiyah and service.",

    // General
    educationalExcellence: "Educational Excellence",
    learnMore: "Discover More",
    viewAll: "View All",
    loading: "Loading Wisdom...",
    allRightsReserved: "All rights reserved. Ruhama Academy",
    notFoundTitle: "Are you lost",
    notFoundDesc:
      "The page you are looking for doesn't exist or has been moved.",
    back: "Back",
    add_course: "Add New Course",
    edit_course: "Edit Course",
    view_course: "View Course",
    course_photo: "Course Photo",
    select_photo: "Select Photo",
    basic_info: "Basic Information",
    course_title: "Course Title",
    subject: "Subject",
    level: "Level",
    level_beginner: "Beginner",
    level_intermediate: "Intermediate",
    level_advanced: "Advanced",
    description: "Description",
    schedule: "Schedule",
    duration: "Duration",
    days: "Days",
    time: "Time",
    capacity: "Capacity",
    lessons: "Lessons",
    add_new: "Add New",
    save_course: "Save Course",
    update_changes: "Update Changes",
    loading: "Loading",
    add_course: "Add Course",
    add_new_book: "Add New Book",
    book_title: "Book Title",
    author_name: "Author Name",
    upload_book_btn: "Upload Book",
    sheikh_book_tag: "Sheikh Mohammed Jud's Kitab",
    library_admin: "Library Administration",
    add_new_book: "Add New Book",
    upload_file_label: "Upload Book (PDF, Word, Image)",
    drag_drop_text: "Drag & drop or click to upload",
    sheikh_book_tag: "Sheikh Mohammed Jud's Kitab",
    sheikh_tag_desc:
      "This will set the author to Sheikh Mohammed Jud automatically",
    book_title: "Book Title",
    book_title_ph: "e.g. Usulu Salasa",
    category: "Category",
    author_name: "Author Name",
    description: "Description",
    upload_book_btn: "Upload Book",
    adminTitle: "Message Admin",
    ayah: "AYAH",
    hadith: "HADITH",
    type: "Type",
    arabicLabel: "Arabic Text",
    translationLabel: "English Translation",
    placeholderText: "Enter translation here...",
    reference: "Reference",
    save: "SAVE MESSAGE",
    success: "Saved successfully!",
    loading: "Saving...",
    back: "Back to Dashboard",
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    about: "عن المؤسسة",
    ustazs: "العلماء",
    courses: "المناهج الدراسية",
    prayer_times: "مواقيت الصلاة",
    events: "الفعاليات",
    blog: "المقالات",
    library: "خزانة الكتب",
    donations: "ساهم معنا",
    contact: "اتصل بنا",
    admissions: "التسجيل",
    login: "دخول",
    register: "انضم إلينا",
    dashboard: "لوحة الطالب",

    // Hero Section
    heroTitle: "مرحباً بكم في مركز رحماء الإسلامي، أهلا وسهلا",
    heroSubtitle:
      "منبع الصفا لنهل العلوم الشرعية على نهج العلماء الأجلاء؛ نورٌ للقلوب وهديٌ للأرواح.",
    exploreCoures: "استكشف المناهج",

    // Features
    featuresTitle: "لماذا أكاديمية رحماء؟",
    featuresSubtitle: "تعليم إسلامي رصين لجيل واعد",
    qualifiedScholars: "نخبة من العلماء",
    qualifiedScholarsDesc:
      "تلقَّ العلم على أيدي مشايخ مجازين وذوي خبرة في التربية والتعليم.",
    comprehensiveCurriculum: "دراسة الكتب التأصيلية",
    comprehensiveCurriculumDesc:
      "منهج متكامل يشمل النحو والفقه والعقيدة والحديث.",
    flexibleLearning: "المدرسة الرقمية",
    flexibleLearningDesc: "دروس مباشرة ومسجلة بجودة عالية تصلك أينما كنت.",
    communityFocused: "صحبة صالحة",
    communityFocusedDesc: "كن جزءاً من بيئة إيمانية تسعى للتزكية والخدمة.",

    // General
    educationalExcellence: "التميز التعليمي",
    learnMore: "اكتشف المزيد",
    viewAll: "عرض الكل",
    loading: "جاري التحميل...",
    allRightsReserved: "جميع الحقوق محفوظة. مؤسسة رحماء",
    notFoundTitle: "هل ضللت الطريق",
    notFoundDesc: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
    back: "رجوع",
    add_course: "إضافة دورة جديدة",
    edit_course: "تعديل الدورة",
    view_course: "عرض الدورة",
    course_photo: "صورة الدورة",
    select_photo: "اختر صورة",
    basic_info: "معلومات أساسية",
    course_title: "عنوان الدورة",
    subject: "المادة",
    level: "المستوى",
    level_beginner: "مبتدئ",
    level_intermediate: "متوسط",
    level_advanced: "متقدم",
    description: "الوصف",
    schedule: "الجدول الزمني",
    duration: "المدة",
    days: "الأيام",
    time: "الوقت",
    capacity: "السعة",
    lessons: "الدروس",
    add_new: "إضافة جديد",
    save_course: "حفظ الدورة",
    update_changes: "تحديث التغييرات",
    loading: "جاري التحميل",
    library_admin: "إدارة المكتبة",
    add_new_book: "إضافة كتاب جديد",
    upload_file_label: "تحميل الكتاب (PDF, Word, صورة)",
    drag_drop_text: "اسحب الملف أو انقر للتحميل",
    sheikh_book_tag: "كتاب الشيخ محمد جود",
    sheikh_tag_desc: "سيتم تعيين المؤلف للشيخ محمد جود تلقائياً",
    book_title: "عنوان الكتاب",
    book_title_ph: "مثال: أصول الثلاثة",
    category: "الفئة",
    author_name: "اسم المؤلف",
    description: "الوصف",
    upload_book_btn: "تحميل الكتاب",
    enroll_for: "التسجيل في",
    course_enroll_title: "سجل الآن",
    full_name: "الاسم الكامل",
    full_name_ph: "أدخل اسمك الكامل",
    national_id: "الهوية الوطنية",
    id_number_ph: "رقم الهوية",
    phone: "رقم الهاتف",
    gender: "الجنس",
    male: "ذكر",
    female: "أنثى",
    id_photo: "صورة الهوية",
    enroll_now: "سجلني الآن",
    sending: "جاري الإرسال...",
    registration_closed: "التسجيل مغلق!",
    registration_closed_desc: "انتهت فترة التسجيل لهذه الدورة.",
    back_to_courses: "العودة إلى الدورات",
    invalid_phone: "يرجى إدخال رقم هاتف إثيوبي صحيح",
    upload_id_warn: "يرجى تحميل صورة الهوية!",
    enroll_success: "تم إرسال تسجيلك بنجاح!",
    login_required: "يرجى تسجيل الدخول أولاً!",
    unknown_course: "دورة غير معروفة",
    enrollment_control: "التحكم في التسجيل",
    status_open: "مفتوح",
    status_closed: "مغلق",
    toggle_success: "تم تغيير الحالة بنجاح",
    loading_courses: "جاري تحميل الدورات...",
    back: "رجوع",
    back_to_courses: "العودة إلى الدورات",
    loading: "جاري التحميل...",
    sending: "جاري الإرسال...",
    actions: "الإجراءات",
    status: "الحالة",
    search_placeholder_enroll: "البحث عن طريق الاسم أو الهوية...",

    // EnrollForm.jsx
    enroll_for: "التسجيل في",
    course_enroll_title: "يرجى ملء النموذج",
    full_name: "الاسم الكامل",
    full_name_ph: "اسم الطالب الكامل...",
    national_id: "الهوية الوطنية",
    id_number_ph: "رقم الهوية...",
    phone: "رقم الهاتف",
    gender: "الجنس",
    male: "ذكر",
    female: "أنثى",
    id_photo: "صورة الهوية",
    enroll_now: "سجل الآن",
    enroll_success: "تم التسجيل بنجاح!",
    registration_closed: "التسجيل مغلق",
    registration_closed_desc: "عذراً، فترة التسجيل لهذه الدورة قد انتهت.",
    upload_id_warn: "يرجى تحميل صورة الهوية",
    invalid_phone: "يرجى إدخال رقم هاتف صحيح",

    // EnrollmentToggle.jsx
    enrollment_control: "التحكم في التسجيل",
    status_open: "مفتوح",
    status_closed: "مغلق",
    loading_courses: "جاري تحميل الدورات...",

    // ManageEnrollments.jsx
    manage_enrollments: "إدارة التسجيلات",
    total_applications: "إجمالي الطلبات",
    student: "طالب",
    contact_info: "الهاتف / الجنس",
    view_id: "عرض الصورة",
    status_approved: "مقبول",
    status_rejected: "مرفوض",
    status_pending: "قيد الانتظار",
    confirm_delete_enrollment: "هل أنت متأكد من حذف هذا الطلب؟",
    unknown_course: "دورة غير معروفة",
    adminTitle: "إدارة الرسائل",
    ayah: "آية",
    hadith: "حديث",
    type: "نوع",
    arabicLabel: "النص العربي",
    translationLabel: "الترجمة",
    placeholderText: "اكتب الترجمة هنا...",
    reference: "المرجع",
    save: "حفظ الرسالة",
    success: "تم الحفظ بنجاح!",
    loading: "جاري الحفظ...",
    back: "العودة إلى لوحة التحكم",
  },
  am: {
    // Navigation
    home: "መነሻ",
    about: "ስለ ሩሃማ",
    ustazs: "ኡስታዞች",
    courses: "ትምህርቶች",
    prayer_times: "የሶላት መርሃ ግብር",
    events: "ዝግጅቶች",
    blog: "ወቅታዊ ትምህርቶች",
    library: "የሩሃማ ቤተ መጽሐፍት",
    donations: "ድጋፍ ያድርጉ",
    contact: "አድራሻ",
    admissions: "ምዝገባ",
    login: "ግባ",
    register: "አሁን ይመዝገቡ",
    dashboard: "ዳሽቦርድ",

    // Hero Section
    heroTitle: "ወደ ሩሃማ ኢስላሚክ ሴንተር፣ እንኳን በደህና መጡ",
    heroSubtitle: "በጥንታዊ ዕውቀት ታንጸው ለዘመናዊ ስኬት የሚበቁበት የሩሃማ የእውቀት ማዕድ።",
    exploreCoures: "ትምህርቶችን ጀምር",
    viewPrayerTimes: "የሶላት መርሃ ግብር",

    // Features
    featuresTitle: "የሩሃማ አካዳሚ ልዩ መገለጫዎች",
    featuresSubtitle: "ጥራት ያለው ትምህርት ለተሻለ ስብዕና",
    qualifiedScholars: "ብቁ ሊቃውንት",
    qualifiedScholarsDesc: "ጥንታዊ የእውቀት ሰንሰለታቸውን (ኢጃዛ) ጠብቀው ከቆዩ ሊቃውንት ይማሩ።",
    comprehensiveCurriculum: "ጥንታዊ የኪታብ ጥናቶች",
    comprehensiveCurriculumDesc:
      "ከነህውና ሶርፍ እስከ ፊቅህና አቂዳ፤ በጥልቀት የሚያስገነዝብ ስርዓተ ትምህርት።",
    flexibleLearning: "ዲጂታል መድረሳ",
    flexibleLearningDesc:
      "ከየትኛውም የዓለም ክፍል ሆነው የሚከታተሏቸው ጥራት ያላቸው የቀጥታና የተቀረጹ ትምህርቶች።",
    communityFocused: "መንፈሳዊ ወንድማማችነት",
    communityFocusedDesc: "ለነፍስ መጥራትና ለሰብአዊ አገልግሎት የተተጋ ማህበረሰብ አካል ይሁኑ።",

    // General
    educationalExcellence: "የጥራት ትምህርት",
    learnMore: "ተጨማሪ ይመልከቱ",
    viewAll: "ሁሉንም ተመልከት",
    loading: "ጥበብ በመጫን ላይ...",
    allRightsReserved: "መብቱ በህግ የተጠበቀ ነው። ሩሃማ አካዳሚ",
    notFoundTitle: "መንገዱ ጠፍቶብዎታል",
    notFoundDesc: "የፈለጉት ገጽ አልተገኘም ወይም ወደ ሌላ ቦታ ተዛውሯል።",
    back: "ተመለስ",
    add_course: "አዲስ ኮርስ ጨምር",
    edit_course: "ኮርስ አድስ",
    view_course: "ኮርሱን እይ",
    course_photo: "የኮርስ ፎቶ",
    select_photo: "ፎቶ ምረጥ",
    basic_info: "መሰረታዊ መረጃ",
    course_title: "የኮርሱ ርዕስ",
    subject: "ትምህርቱ",
    level: "ደረጃ",
    level_beginner: "ጀማሪ",
    level_intermediate: "መካከለኛ",
    level_advanced: "ከፍተኛ",
    description: "መግለጫ",
    schedule: "መርሃ ግብር",
    duration: "ቆይታ",
    days: "ቀናት",
    time: "ሰዓት",
    capacity: "የተማሪዎች ብዛት",
    lessons: "ትምህርቶች",
    add_new: "አዲስ ጨምር",
    save_course: "ኮርሱን መዝግብ",
    update_changes: "ለውጦችን አድስ",
    loading: "በመጫን ላይ",
    add_course: "አዲስ ኮርስ ጨምር",
    edit_course: "ኮርስ አድስ",
    back: "ተመለስ",
    course_photo: "የኮርስ ፎቶ",
    basic_info: "መሰረታዊ መረጃ",
    course_title: "የኮርሱ ርዕስ",
    save_course: "ኮርሱን መዝግብ",

    // ለቤተ መጽሐፍት (Books) ገጹ
    add_new_book: "አዲስ መጽሐፍ መመዝገቢያ",
    library_admin: "ቤተ መጽሐፍት አስተዳደር",
    upload_file_label: "መጽሐፉን ይጫኑ (PDF, Word, Image)",
    drag_drop_text: "ፋይሉን እዚህ ይጎትቱ ወይም ይጫኑ",
    sheikh_book_tag: "የሼክ ሙሀመድ ጁድ ኪታብ",
    sheikh_tag_desc: "ደራሲው 'ሼክ ሙሀመድ ጁድ' በራሱ እንዲሞላ ያደርጋል",
    book_title: "የመጽሐፉ ርዕስ",
    book_title_ph: "ለምሳሌ፡ ኡሱሉ ሰላሳ",
    author_name: "የደራሲው ስም",
    category: "ዘርፍ",
    description: "አጭር መግለጫ",
    upload_book_btn: "መጽሐፉን አፕሎድ አድርግ",
    enroll_for: "ለ",
    course_enroll_title: "ኮርስ ይመዝገቡ",
    full_name: "ሙሉ ስም",
    full_name_ph: "ሙሉ ስምዎን ያስገቡ",
    national_id: "ብሔራዊ መታወቂያ",
    id_number_ph: "የመታወቂያ ቁጥር",
    phone: "ስልክ",
    gender: "ጾታ",
    male: "ወንድ",
    female: "ሴት",
    id_photo: "የመታወቂያ ፎቶ",
    enroll_now: "አሁኑኑ መዝግቡኝ",
    sending: "በመላክ ላይ...",
    registration_closed: "ምዝገባው ተዘግቷል!",
    registration_closed_desc: "የዚህ ኮርስ የምዝገባ ጊዜ አብቅቷል።",
    back_to_courses: "ወደ ኮርሶች ተመለስ",
    invalid_phone: "እባክዎ ትክክለኛ የኢትዮጵያ ስልክ ቁጥር ያስገቡ",
    upload_id_warn: "እባክዎ የመታወቂያ ፎቶ ይጫኑ!",
    enroll_success: "ምዝገባዎ በትክክል ተልኳል!",
    login_required: "እባክዎ መጀመሪያ ይግቡ!",
    unknown_course: "ያልታወቀ ትምህርት",
    enrollment_control: "የኮርሶች ምዝገባ መቆጣጠሪያ",
    status_open: "ክፍት",
    status_closed: "የተዘጋ",
    toggle_success: "ሁኔታው ተቀይሯል",
    back: "ተመለስ",
    back_to_courses: "ወደ ኮርሶች ተመለስ",
    loading: "በመጫን ላይ...",
    sending: "በመላክ ላይ...",
    actions: "እርምጃ",
    status: "ሁኔታ",
    search_placeholder_enroll: "በተማሪ ስም ወይም መታወቂያ ፈልግ...",
    adminTitle: "መልዕክት መመዝገቢያ",
    ayah: "አያህ",
    hadith: "ሀዲስ",
    type: "ዓይነት",
    arabicLabel: "የአረብኛው ጽሑፍ",
    translationLabel: "የአማርኛ ትርጉም",
    placeholderText: "ትርጉሙን እዚህ ይጻፉ...",
    reference: "ማጣቀሻ",
    save: "መዝግብ",
    success: "በትክክል ተመዝግቧል!",
    loading: "በመመዝገብ ላይ...",
    back: "ወደ ዳሽቦርድ ተመለስ",
    // EnrollForm.jsx
    enroll_for: "ለ",
    course_enroll_title: "ለመመዝገብ ቅጹን ይሙሉ",
    full_name: "ሙሉ ስም",
    full_name_ph: "የተማሪው ሙሉ ስም...",
    national_id: "ብሔራዊ መታወቂያ",
    id_number_ph: "የመታወቂያ ቁጥር...",
    phone: "ስልክ ቁጥር",
    gender: "ጾታ",
    male: "ወንድ",
    female: "ሴት",
    id_photo: "የመታወቂያ ፎቶ (ID Card)",
    enroll_now: "አሁኑኑ መዝግብ",
    enroll_success: "ምዝገባው በተሳካ ሁኔታ ተጠናቋል!",
    registration_closed: "ምዝገባ ተዘግቷል",
    registration_closed_desc: "ይቅርታ፣ ለዚህ ኮርስ የነበረው የምዝገባ ጊዜ ተጠናቋል።",
    upload_id_warn: "እባክዎ የመታወቂያ ፎቶ ያያይዙ",
    invalid_phone: "ትክክለኛ የስልክ ቁጥር ያስገቡ",

    // EnrollmentToggle.jsx
    enrollment_control: "የኮርሶች ምዝገባ መቆጣጠሪያ",
    status_open: "ክፍት",
    status_closed: "የተዘጋ",
    loading_courses: "ኮርሶችን በመጫን ላይ...",

    // ManageEnrollments.jsx
    manage_enrollments: "የምዝገባ አስተዳደር",
    total_applications: "አጠቃላይ ማመልከቻዎች",
    student: "ተማሪ",
    contact_info: "ስልክ / ጾታ",
    view_id: "ፎቶውን እይ",
    status_approved: "የጸደቀ",
    status_rejected: "ውድቅ",
    status_pending: "በመጠባበቅ",
    confirm_delete_enrollment: "ይህንን ማመልከቻ ማጥፋት ትፈልጋለህ?",
    unknown_course: "ኮርስ አልተገኘም",
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("app_language") || "en";
    }
    return "en";
  });

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    localStorage.setItem("app_language", lang);

    if (typeof document !== "undefined") {
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lang;
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (key) => {
      return translations[language]?.[key] || translations["en"]?.[key] || key;
    },
    [language]
  );

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
