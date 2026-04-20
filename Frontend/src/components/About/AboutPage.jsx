import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/language-context";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Sparkles,
  ArrowRight,
  Star,
  ShieldCheck,
  GraduationCap,
  Heart,
  Quote,
  Target,
  Eye,
  FlameKindling,
  BookOpen,
  CheckCircle2,
  Languages,
  CalendarDays,
  Users2,
  Library,
  GraduationCap as Diploma,
  UserPlus,
  Handshake,
  Globe,
  Sprout,
  Info,
  Zap,
  Layout,
  Car,
} from "lucide-react";
import { motion } from "framer-motion";
import aboutBg from "../../assets/images/About.jpg";
import Ourservices from "../../assets/images/Ourservices.jpg";
import Educationalservices from "../../assets/images/Educationalservices.jpg";
import Youthprograms from "../../assets/images/Youthprograms.jpg";
import Familyandsocialservices from "../../assets/images/Familyandsocialservices.jpg";
import Womensparticipation from "../../assets/images/Womensparticipation.jpg";
import Communityinvolvement from "../../assets/images/Community involvement.jpg";
import SheikMohammedjud from "../../assets/images/Sheik Mohammed_jud.png";

// Translation content
const content = {
  am: {
    // Hero
    heroBadge: "የእውቀትና የርህራሄ ማዕከል",
    heroTitle: "ስለ እኛ",
    heroTitleGold: ".",
    historyTitle: "የጉዟችን",
    historyTitleGold: "ታሪክ",
    historyP1: "ሩሃማ እስላማዊ ማዕከል በኮምቦልቻ ላሉ ሙስሊሞች መንፈሳዊ ቤት ለመፍጠር በ",
    historyP1Year: "2011",
    historyP1End:
      "ተመሰረተ። እንደ ትንሽ የሶላት ቦታ የጀመረው አሁን በመቶዎች የሚቆጠሩ ምዕመናንን እና ቤተሰቦቻቸውን የሚያገለግል ትልቅ የማህበረሰብ ማእከል ሆኗል።",
    historyP2:
      "ባለፉት ዓመታት፣ በእምነት፣ በአንድነት እና በአገልግሎት እሴቶቻችን ላይ ጸንተን ቆይተናል። መስጊዳችን የአምልኮ ቦታ ብቻ ሳይሆን የትምህርት፣ የማህበረሰብ ድጋፍ እና የእርስ በእርስ ግንኙነት ማዕከል ነው።",
    quoteText:
      "ማዕከላችን የአምልኮ ቦታ ብቻ ሳይሆን፣ የትምህርት፣ የማህበረሰብ ድጋፍ እና የእርስ በርስ ግንኙነት ሚጠናከርበት",
    quoteTextGold: "ህያው ቤት",
    quoteTextEnd: "ነው።",
    quoteAuthor: "Ruhama Center",
    // Mission & Vision
    mission: "ተልእኳችን",
    missionText:
      "ትውልዱን በሸሪዓዊ እና በዘመናዊ እውቀት በማነፅ፣ መንፈሳዊ ማንነቱ የተገነባ እና ለሀገሩ የሚጠቅም ስብእና ያለው ማህበረሰብ መገንባት።",
    vision: "ራእያችን",
    visionText:
      "ባካባቢያችን ቀዳሚ የሆነ፣ በቴክኖሎጂ የተደገፈ እና ሁለንተናዊ አገልግሎት የሚሰጥ የእውቀት እና የርህራሄ ማዕከል ሆኖ ማየት።",
    // Core Values
    coreValuesBadge: "መሠረታችን",
    coreValuesTitle: "እሴቶቻችን",
    // Spiritual Services
    servicesBadge: "አገልግሎቶቻችን",
    servicesTitle: "ማህበረሰባችንን ለማገልገል የተዘጋጁ አጠቃላይ ፕሮግራሞች እና መንፈሳዊ አገልግሎቶች",
    spiritualServicesList: [
      "የዕለታዊ ሶላቶች እና የጁምዓ አገልግሎቶች",
      "ብቁ እና ተቀራራቢ ኢማሞች",
      "የተፍሲር፣ የሀዲስ፣ ዐረብኛ እና የፊቅህ ትምህርቶች",
      "ሀላል ስብስቦች እና መንፈሳዊ ንግግሮች",
      "የረመዳን ፕሮግራሞች (ተራዊህ እና ኢቲካፍን ጨምሮ)",
    ],
    // Educational Services
    eduBadge: "የትምህርት አገልግሎቶች",
    eduTitle: "ከሕጻናት እስከ አዋቂዎች—ለሁሉም የሚሆን ሁለንተናዊ እስላማዊ እውቀት",
    eduHighlights: [
      "ቁርኣን፡ አቀራረብ (ተጅዊድ) እና ሂፍዝ",
      "ቋንቋ፡ የአረብኛ ቋንቋ መሠረታዊ እውቀት",
      "ሲራ እና ታሪክ፡ የነቢያት እና የሶሃቦች ታሪክ",
      "አኽላቅ፡ እስላማዊ ስብዕና እና ማህበራዊ ግንኙነት",
    ],
    adultCoursesLabel: "የአዋቂዎች የትምህርት ዘርፍ",
    adultCourses: [
      "ተውሂድ፣ ፊቅህ፣ ተፍሲር እና ሀዲስ",
      "ተለዋዋጭ ክፍለ-ጊዜዎች (ምሽት እና ሳምንቱ መጨረሻ)",
    ],
    // Youth Development
    youthBadge: "የወጣቶች ልማት",
    youthTitle: "ቀጣዩን ትውልድ በልህቀት ክህሎት፣ በምክር እና ማህበራዊ ድጋፍ ማብቃት።",
    youthItems: [
      {
        t: "የወጣቶች ሃለቃዎች (Halaqas)",
        d: "በእውቀት እና በእምነት ላይ ያተኮሩ ሳምንታዊ የውይይት መድረኮች።",
        icon: Users2,
      },
      {
        t: "የቡድን እንቅስቃሴዎች",
        d: "አብሮ የመስራት እና የመቀራረብ መርሃ-ግብሮች።",
        icon: Handshake,
      },
      {
        t: "አስተማማኝ መድረክ",
        d: "ወጣቶች ሃሳባቸውን በነጻነት የሚገልጹበት ቦታ።",
        icon: Globe,
      },
    ],
    // Family & Social Services
    familyBadge: "ማህበራዊ አገልግሎቶች",
    familyTitle: "ቤተሰብን መገንባት፣ ማህበረሰብን ማገልገል እና በችግር ጊዜ መረዳዳት።",
    familySupportLabel: "ማህበራዊ ድጋፍ እና በጎ አድራጎት",
    familyItems: [
      "የዘካ እና የበጎ አድራጎት ስርጭት ለሚገባቸው ማድረስ።",
      "የማህበረሰብ ድጋፍ እና የአቅመ ደካሞች ድጋፍ ፕሮግራሞች።",
    ],
    familyUpcoming: "የጋብቻ እና የቤተሰብ ጉዳዮች",
    familyUpcomingText:
      "የትዳር አጋር መፈለጊያ እና የቤተሰብ ምክር አገልግሎቶችን ለማስጀመር በዝግጅት ላይ ነን።",
    // Women's Participation
    womenBadge: "የሴቶች ተሳትፎ",
    womenTitle: "ንቁ የሴቶች ተሳትፎን ማበረታታት፤ ምቹ እና ግላዊነትን የጠበቀ ቦታ መፍጠር።",
    womenEduLabel: "ትምህርታዊ እና መንፈሳዊ እድገት",
    womenEduItems: [
      "ትምህርታዊ ስብስቦች፦ እስላማዊ እና ወቅታዊ ጉዳዮች ላይ የሚሰጡ ትምህርቶች።",
      "መንፈሳዊ ውይይቶች፦ ለሴቶች ብቻ የተዘጋጁ የቁርኣን እና የዚክር ፕሮግራሞች።",
    ],
    womenUpcoming: "የሚጀመሩ አዳዲስ ፕሮግራሞች",
    womenUpcomingItems: ["የሴቶች ቦርድ ተሳትፎ", "የሙያ ስልጠናዎች"],
    // Community Involvement
    communityBadge: "የማህበረሰብ ተሳትፎ",
    communityTitle: "ግልጽ የውይይት መድረኮችን በመፍጠር ከሰፊው ማህበረሰብ ጋር ድልድዮችን መገንባት።",
    communityItems: [
      {
        t: "አብሮነት እና የጋራ እሴቶች",
        d: "ከሌሎች የእምነት ተከታዮች እና የሲቪክ ማህበራት ጋር በመተባበር ለሰላም እና ለልማት መስራት።",
      },
      {
        t: "ማህበራዊ ተልዕኮ እና ጥበቃ",
        d: "የአካባቢ ጥበቃ ተነሳሽነቶች (ጽዳት፣ ዛፍ መትከል) እና የበጎ አድራጎት ስራዎች።",
      },
    ],
    communityBadgeText: "ለጋራ ሰላም እና አንድነት!",
    // Facilities
    facilitiesBadge: "መሠረተ ልማት",
    facilitiesTitle: "መገልገያዎቻችን",
    facilitiesSubtitle:
      "ዘመናዊ፣ ተደራሽ እና ለአምልኮ፣ ለትምህርትና ለማህበረሰብ አገልግሎት በሚገባ የታጠቁ ስፍራዎች።",
    facilitiesList: [
      { t: "የአምልኮ ቦታዎች", d: "ሰፊ ሙሰላ፣ የሴቶች የሶላት ክፍል እና ዲጂታል የቂብላ ሰዓት የታጠቁ።" },
      { t: "የትምህርት ማዕከላት", d: "መማሪያ ክፍሎች፣ ቤተ-መጽሐፍት እና ሁለገብ አዳራሽ (በቅርቡ)።" },
      { t: "የወጣቶች መዝናኛ", d: "የጥናት ማዕከል፣ የህጻናት መጫወቻ እና የእናትና ህጻን ክፍሎች።" },
      { t: "አስተዳደር እና ደህንነት", d: "የምክር ቢሮዎች፣ የCCTV ጥበቃ እና የበጎ አድራጎት ማስተባበሪያ።" },
      { t: "ንጽህና እና ምቾት", d: "ዘመናዊ የውዱእ ቦታዎች፣ ሻወር እና የጫማ ማስቀመጫዎች።" },
      { t: "ተደራሽነት", d: "የአየር ማቀዝቀዣ (AC)፣ የመኪና ማቆሚያ እና ለዊልቸር አመቺ መግቢያ።" },
    ],
    // Imams
    imamsBadge: "ኢማሞቻችን",
    imamsTitle: "ማህበረሰባችንን በሶላት፣ በእውቀት እና በጥበብ የሚመሩ የሀይማኖት ሊቃውንት።",
    imamsDesc:
      "የእምነት መሪዎቻችን የማህበረሰባችን መንፈሳዊ መሠረቶች ናቸው። ትውልዱን በቅንነት በመምራት፣ ለጥያቄዎች ምላሽ በመስጠት እና ሰላምን በመስበክ ትልቅ ሚና ይጫወታሉ።",
    imamsFeatures: [
      { t: "መንፈሳዊ መመሪያ", d: "በዕለታዊ ህይወት ላይ ለሚገጥሙ ጉዳዮች ጥልቅ እውቀት ያለው ምክር መስጠት።" },
      { t: "የትምህርት አርአያ", d: "የቁርኣን እና የሀዲስ ትምህርቶችን በተግባር ማስተላለፍ።" },
    ],
    imamName: "ሸይኽ መሐመድ ጁድ",
    imamTitle: "የመስጂዱ ዋና ኢማም",
    // CTA
    ctaTitle: "የጉዟችን አካል",
    ctaTitleGold: "ይሁኑ",
    ctaText: "በእውቀት፣ በበጎ አድራጎት እና በመንፈሳዊ አንድነት ማህበረሰባችንን አብረን እንገንባ።",
    ctaButton1: "ኮርሶችን ይመልከቱ",
    ctaButton2: "ልገሳ ያድርጉ",
  },
  en: {
    heroBadge: "CENTER OF KNOWLEDGE & COMPASSION",
    heroTitle: "About",
    heroTitleGold: "Us",
    historyTitle: "Our",
    historyTitleGold: "Journey",
    historyP1: "Ruhama Islamic Center was established in",
    historyP1Year: "2011",
    historyP1End:
      "to create a spiritual home for Muslims in Kombolcha. What started as a small prayer space has now become a large community center serving hundreds of worshippers and their families.",
    historyP2:
      "Over the years, we have remained steadfast in our values of faith, unity, and service. Our mosque is not just a place of worship but a center for education, community support, and social connection.",
    quoteText: "Our center is not just a place of worship, but a",
    quoteTextGold: "living home",
    quoteTextEnd:
      "where education, community support, and mutual connection are strengthened.",
    quoteAuthor: "Ruhama Center",
    mission: "Our Mission",
    missionText:
      "To build a community with a developed spiritual identity and a beneficial character for their country by nurturing the generation with Sharia and modern knowledge.",
    vision: "Our Vision",
    visionText:
      "To become a leading center of knowledge and compassion in our area, supported by technology and providing comprehensive services.",
    coreValuesBadge: "Our Foundation",
    coreValuesTitle: "Core Values",
    servicesBadge: "Our Services",
    servicesTitle:
      "Comprehensive Programs and Spiritual Services Prepared to Serve Our Community",
    spiritualServicesList: [
      "Daily Prayers and Jumu'ah Services",
      "Qualified and Approachable Imams",
      "Tafsir, Hadith, Arabic, and Fiqh Lessons",
      "Halal Gatherings and Spiritual Lectures",
      "Ramadan Programs (including Taraweeh and I'tikaf)",
    ],
    eduBadge: "Educational Services",
    eduTitle:
      "Comprehensive Islamic Knowledge for Everyone—From Children to Adults",
    eduHighlights: [
      "Qur'an: Recitation (Tajweed) and Memorization (Hifdh)",
      "Language: Foundational Knowledge of Arabic",
      "Seerah & History: Stories of Prophets and Companions",
      "Akhlaq: Islamic Character and Social Relations",
    ],
    adultCoursesLabel: "Adult Education Department",
    adultCourses: [
      "Tawheed, Fiqh, Tafsir, and Hadith",
      "Flexible Sessions (Evenings & Weekends)",
    ],
    youthBadge: "Youth Development",
    youthTitle:
      "Empowering the Next Generation with Excellence, Mentorship, and Social Support.",
    youthItems: [
      {
        t: "Youth Halaqas",
        d: "Weekly discussion forums focused on knowledge and faith.",
        icon: Users2,
      },
      {
        t: "Group Activities",
        d: "Collaboration and connection programs.",
        icon: Handshake,
      },
      {
        t: "Safe Platform",
        d: "A space where youth can freely express their ideas.",
        icon: Globe,
      },
    ],
    familyBadge: "Social Services",
    familyTitle:
      "Building Families, Serving the Community, and Supporting Each Other in Times of Need.",
    familySupportLabel: "Social Support & Charity",
    familyItems: [
      "Distribution of Zakat and charity to those who deserve it.",
      "Community support and assistance programs for the vulnerable.",
    ],
    familyUpcoming: "Marriage & Family Matters",
    familyUpcomingText:
      "We are preparing to launch matchmaking and family counseling services.",
    womenBadge: "Women's Participation",
    womenTitle:
      "Encouraging active women's participation; creating a comfortable and private space.",
    womenEduLabel: "Educational & Spiritual Growth",
    womenEduItems: [
      "Educational Sessions: Lessons on Islamic and contemporary issues.",
      "Spiritual Discussions: Qur'an and Dhikr programs exclusively for women.",
    ],
    womenUpcoming: "Upcoming Programs",
    womenUpcomingItems: ["Women's Board Participation", "Vocational Training"],
    communityBadge: "Community Involvement",
    communityTitle:
      "Building bridges with the wider community by creating open discussion forums.",
    communityItems: [
      {
        t: "Togetherness & Shared Values",
        d: "Collaborating with people of other faiths and civic organizations for peace and development.",
      },
      {
        t: "Social Mission & Protection",
        d: "Environmental initiatives (cleanup, tree planting) and charitable works.",
      },
    ],
    communityBadgeText: "For shared peace and unity!",
    facilitiesBadge: "Infrastructure",
    facilitiesTitle: "Our Facilities",
    facilitiesSubtitle:
      "Modern, accessible, and well-equipped spaces for worship, education, and community service.",
    facilitiesList: [
      {
        t: "Prayer Spaces",
        d: "Spacious musalla, women's prayer hall, equipped with digital Qibla time.",
      },
      {
        t: "Educational Centers",
        d: "Classrooms, library, and multi-purpose hall (coming soon).",
      },
      {
        t: "Youth Recreation",
        d: "Study center, children's play area, and mother & child rooms.",
      },
      {
        t: "Administration & Security",
        d: "Counseling offices, CCTV surveillance, and charity coordination.",
      },
      {
        t: "Cleanliness & Comfort",
        d: "Modern wudu areas, showers, and shoe storage.",
      },
      {
        t: "Accessibility",
        d: "Air conditioning, parking, and wheelchair-accessible entrance.",
      },
    ],
    imamsBadge: "Our Imams",
    imamsTitle:
      "Religious scholars who lead our community in prayer, knowledge, and wisdom.",
    imamsDesc:
      "Our faith leaders are the spiritual foundations of our community. They play a vital role in guiding the generation with sincerity, answering questions, and preaching peace.",
    imamsFeatures: [
      {
        t: "Spiritual Guidance",
        d: "Providing knowledgeable counsel on daily life matters.",
      },
      {
        t: "Educational Role Model",
        d: "Practically transmitting the teachings of the Qur'an and Hadith.",
      },
    ],
    imamName: "Sheikh Mohammed Jud",
    imamTitle: "Head Imam of the Mosque",
    ctaTitle: "Become",
    ctaTitleGold: "Part of Our Journey",
    ctaText:
      "Together, let's build our community through knowledge, charity, and spiritual unity.",
    ctaButton1: "View Courses",
    ctaButton2: "Donate",
  },
  ar: {
    heroBadge: "مركز المعرفة والرحمة",
    heroTitle: "عن",
    heroTitleGold: "نـا",
    historyTitle: "رحلتـ",
    historyTitleGold: "نا",
    historyP1: "تأسس مركز رحمة الإسلامي في عام",
    historyP1Year: "٢٠١١",
    historyP1End:
      "لخلق بيت روحي للمسلمين في كومبولتشا. ما بدأ كمصلى صغير أصبح الآن مركزًا مجتمعيًا كبيرًا يخدم مئات المصلين وعائلاتهم.",
    historyP2:
      "على مر السنين، ظللنا ثابتين على قيمنا من الإيمان والوحدة والخدمة. مسجدنا ليس مجرد مكان للعبادة بل مركز للتعليم والدعم المجتمعي والتواصل الاجتماعي.",
    quoteText: "مركزنا ليس مجرد مكان للعبادة، بل",
    quoteTextGold: "بيت حي",
    quoteTextEnd: "حيث تتقوى التعليم والدعم المجتمعي والتواصل المتبادل.",
    quoteAuthor: "مركز رحمة",
    mission: "مهمتنا",
    missionText:
      "بناء مجتمع ذي هوية روحية متطورة وشخصية نافعة لوطنهم من خلال تنشئة الجيل بالمعرفة الشرعية والحديثة.",
    vision: "رؤيتنا",
    visionText:
      "أن نصبح مركزًا رائدًا للمعرفة والرحمة في منطقتنا، مدعومًا بالتكنولوجيا ويقدم خدمات شاملة.",
    coreValuesBadge: "أساسنا",
    coreValuesTitle: "قيمنا الجوهرية",
    servicesBadge: "خدماتنا",
    servicesTitle: "برامج شاملة وخدمات روحية معدة لخدمة مجتمعنا",
    spiritualServicesList: [
      "الصلوات اليومية وخدمات الجمعة",
      "أئمة مؤهلون وقريبون من المصلين",
      "دروس التفسير والحديث والعربية والفقه",
      "مجالس حلال ومحاضرات روحية",
      "برامج رمضان (بما فيها التراويح والاعتكاف)",
    ],
    eduBadge: "الخدمات التعليمية",
    eduTitle: "معرفة إسلامية شاملة للجميع - من الأطفال إلى البالغين",
    eduHighlights: [
      "القرآن: التلاوة (التجويد) والحفظ",
      "اللغة: المعرفة الأساسية للعربية",
      "السيرة والتاريخ: قصص الأنبياء والصحابة",
      "الأخلاق: الشخصية الإسلامية والعلاقات الاجتماعية",
    ],
    adultCoursesLabel: "قسم تعليم الكبار",
    adultCourses: [
      "التوحيد والفقه والتفسير والحديث",
      "جلسات مرنة (مسائية وعطلات نهاية الأسبوع)",
    ],
    youthBadge: "تنمية الشباب",
    youthTitle: "تمكين الجيل القادم بالتميز والإرشاد والدعم الاجتماعي.",
    youthItems: [
      {
        t: "حلقات الشباب",
        d: "منتديات نقاش أسبوعية تركز على المعرفة والإيمان.",
        icon: Users2,
      },
      {
        t: "الأنشطة الجماعية",
        d: "برامج التعاون والتواصل.",
        icon: Handshake,
      },
      {
        t: "منصة آمنة",
        d: "مساحة يمكن للشباب التعبير فيها بحرية عن أفكارهم.",
        icon: Globe,
      },
    ],
    familyBadge: "الخدمات الاجتماعية",
    familyTitle: "بناء الأسر، خدمة المجتمع، ودعم بعضنا البعض في أوقات الحاجة.",
    familySupportLabel: "الدعم الاجتماعي والصدقة",
    familyItems: [
      "توزيع الزكاة والصدقات على مستحقيها.",
      "برامج دعم المجتمع ومساعدة الضعفاء.",
    ],
    familyUpcoming: "شؤون الزواج والأسرة",
    familyUpcomingText: "نستعد لإطلاق خدمات التوفيق والاستشارات الأسرية.",
    womenBadge: "مشاركة المرأة",
    womenTitle: "تشجيع المشاركة النسائية النشطة؛ خلق مساحة مريحة وخاصة.",
    womenEduLabel: "النمو التعليمي والروحي",
    womenEduItems: [
      "جلسات تعليمية: دروس في القضايا الإسلامية والمعاصرة.",
      "مناقشات روحية: برامج قرآنية وذكر حصرية للنساء.",
    ],
    womenUpcoming: "البرامج القادمة",
    womenUpcomingItems: ["مشاركة مجلس النساء", "التدريب المهني"],
    communityBadge: "المشاركة المجتمعية",
    communityTitle:
      "بناء جسور مع المجتمع الأوسع من خلال خلق منتديات نقاش مفتوحة.",
    communityItems: [
      {
        t: "التكاتف والقيم المشتركة",
        d: "التعاون مع أتباع الديانات الأخرى والمنظمات المدنية من أجل السلام والتنمية.",
      },
      {
        t: "المهمة الاجتماعية والحماية",
        d: "المبادرات البيئية (التنظيف، غرس الأشجار) والأعمال الخيرية.",
      },
    ],
    communityBadgeText: "من أجل السلام والوحدة المشتركة!",
    facilitiesBadge: "البنية التحتية",
    facilitiesTitle: "مرافقنا",
    facilitiesSubtitle:
      "مساحات حديثة ويمكن الوصول إليها ومجهزة تجهيزًا جيدًا للعبادة والتعليم والخدمات المجتمعية.",
    facilitiesList: [
      {
        t: "أماكن الصلاة",
        d: "مصلى واسع، قاعة صلاة النساء، مجهزة بوقت القبلة الرقمي.",
      },
      {
        t: "المراكز التعليمية",
        d: "فصول دراسية، مكتبة، وقاعة متعددة الأغراض (قريبًا).",
      },
      {
        t: "ترفيه الشباب",
        d: "مركز دراسة، منطقة لعب للأطفال، وغرف للأم والطفل.",
      },
      {
        t: "الإدارة والأمن",
        d: "مكاتب استشارية، مراقبة كاميرات، وتنسيق الأعمال الخيرية.",
      },
      { t: "النظافة والراحة", d: "مناطق وضوء حديثة، دشات، وحفظ للأحذية." },
      {
        t: "سهولة الوصول",
        d: "تكييف هواء، مواقف سيارات، ومدخل مناسب للكراسي المتحركة.",
      },
    ],
    imamsBadge: "أئمتنا",
    imamsTitle: "علماء دين يقودون مجتمعنا في الصلاة والمعرفة والحكمة.",
    imamsDesc:
      "قادة إيماننا هم الأسس الروحية لمجتمعنا. يلعبون دورًا حيويًا في توجيه الجيل بإخلاص والإجابة على الأسئلة والدعوة للسلام.",
    imamsFeatures: [
      {
        t: "الإرشاد الروحي",
        d: "تقديم المشورة المثقفة في شؤون الحياة اليومية.",
      },
      { t: "القدوة التعليمية", d: "نقل تعاليم القرآن والحديث عمليًا." },
    ],
    imamName: "الشيخ محمد جود",
    imamTitle: "إمام المسجد الرئيسي",
    ctaTitle: "كن",
    ctaTitleGold: "جزءًا من رحلتنا",
    ctaText: "معًا، نبني مجتمعنا من خلال المعرفة والصدقة والوحدة الروحية.",
    ctaButton1: "عرض الدورات",
    ctaButton2: "تبرع",
  },
};

export default function AboutPage() {
  const { language, dir } = useLanguage();
  const bodyFont = language === "am" ? "font-amharic" : "font-sans";
  const t = content[language] || content.en;

  return (
    <div
      className={`min-h-screen bg-parchment pb-20 overflow-hidden relative ${bodyFont}`}
      dir={dir}
    >
      {/* 1. HERO & HISTORY */}
      <section className="relative w-full pt-48 pb-32 bg-transparent overflow-hidden">
        {/* Background Pattern/Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={aboutBg}
            alt=""
            className="w-full h-full object-cover opacity-20 grayscale"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220] via-[#0b1220]/80 to-[#0b1220]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          {/* Hero Title Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center items-center gap-3 mb-8">
              <div className="h-px w-12 bg-gold/50" />
              <Sparkles size={20} className="text-gold animate-pulse" />
              <span className="text-gold text-xs font-black uppercase tracking-[0.5em]">
                {t.heroBadge}
              </span>
              <div className="h-px w-12 bg-gold/50" />
            </div>

            <h1 className="text-6xl md:text-9xl font-bold text-white mb-8 tracking-tighter">
              {t.heroTitle}{" "}
              <span className="text-gold text-gold-glow">
                {t.heroTitleGold}
              </span>
            </h1>
          </motion.div>

          {/* History Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center text-left mt-24">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold mb-10 border-l-4 border-gold pl-8">
                <span className="text-white block">{t.historyTitle}</span>
                <span className="text-gold uppercase tracking-widest text-3xl mt-2 block">
                  {t.historyTitleGold}
                </span>
              </h2>

              <div className="space-y-8 text-lg leading-relaxed text-gray-400 font-light">
                <p>
                  {t.historyP1}{" "}
                  <span className="text-gold font-bold mx-2">
                    {t.historyP1Year}
                  </span>{" "}
                  {t.historyP1End}
                </p>
                <p className="border-t border-white/5 pt-8">{t.historyP2}</p>
              </div>
            </motion.div>

            {/* Quote Card (Glassmorphism) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass p-12 md:p-16 rounded-[4rem] border border-white/10 shadow-2xl relative group overflow-hidden"
            >
              <div className="absolute -right-10 -bottom-10 text-gold/5 group-hover:text-gold/10 transition-colors duration-700">
                <Quote size={200} />
              </div>

              <Quote className="text-gold h-12 w-12 mb-8" />
              <p className="text-2xl md:text-3xl text-white italic font-medium leading-snug relative z-10">
                {t.quoteText}{" "}
                <span className="text-gold not-italic font-bold">
                  {t.quoteTextGold}
                </span>{" "}
                {t.quoteTextEnd}
              </p>

              <div className="mt-10 flex items-center gap-4">
                <div className="h-1 w-12 bg-gold rounded-full" />
                <span className="text-gold font-bold tracking-widest uppercase text-xs">
                  {t.quoteAuthor}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] -z-10" />
      </section>

      {/* 2. MISSION & VISION */}
      <section className="relative w-full py-24 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass group p-12 rounded-[4rem] relative overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-gold/30"
            >
              <Target className="absolute -right-12 -top-12 text-gold/5 w-72 h-72 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12" />

              <div className="relative z-10 text-left">
                <div className="inline-flex p-5 bg-gold/10 rounded-3xl mb-8 group-hover:bg-gold group-hover:text-[#0b1220] transition-all duration-500">
                  <Target size={38} />
                </div>
                <h2 className="text-4xl font-bold mb-6 text-white group-hover:text-gold transition-colors">
                  {t.mission}
                </h2>
                <p className="text-xl leading-relaxed text-gray-400 group-hover:text-gray-200 transition-colors">
                  {t.missionText}
                </p>
                <div className="mt-8 w-16 h-1 bg-gold rounded-full group-hover:w-32 transition-all duration-500" />
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass group p-12 rounded-[4rem] relative overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-gold/30"
            >
              <Eye className="absolute -right-12 -top-12 text-gold/5 w-72 h-72 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12" />

              <div className="relative z-10 text-left">
                <div className="inline-flex p-5 bg-gold/10 rounded-3xl mb-8 group-hover:bg-gold group-hover:text-[#0b1220] transition-all duration-500">
                  <Eye size={38} />
                </div>
                <h2 className="text-4xl font-bold mb-6 text-white group-hover:text-gold transition-colors">
                  {t.vision}
                </h2>
                <p className="text-xl leading-relaxed text-gray-400 group-hover:text-gray-200 transition-colors">
                  {t.visionText}
                </p>
                <div className="mt-8 w-16 h-1 bg-gold rounded-full group-hover:w-32 transition-all duration-500" />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -z-10" />
      </section>

      {/* 3. CORE VALUES */}
      <section className="relative w-full py-24 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-gold/50" />
              <span className="text-gold font-bold tracking-[0.4em] uppercase text-xs">
                {t.coreValuesBadge}
              </span>
              <div className="h-px w-10 bg-gold/50" />
            </div>
            <h2 className="text-5xl font-bold text-white text-gold-glow uppercase tracking-wider">
              {t.coreValuesTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {[
              {
                title:
                  language === "am"
                    ? "ኢህሳን (ምርጥነት)"
                    : language === "ar"
                    ? "الإحسان (الإتقان)"
                    : "Ihsan (Excellence)",
                desc:
                  language === "am"
                    ? "በአምልኮም ሆነ በአገልግሎት አሰጣጥ ላይ ጥራትን ማረጋገጥ መርሀችን ነው።"
                    : language === "ar"
                    ? "ضمان الجودة في العبادة وتقديم الخدمات هو مبدأنا."
                    : "Ensuring quality in both worship and service delivery is our principle.",
                icon: Star,
              },
              {
                title:
                  language === "am"
                    ? "ታማኝነትና አደራ"
                    : language === "ar"
                    ? "الأمانة والثقة"
                    : "Trustworthiness & Integrity",
                desc:
                  language === "am"
                    ? "ከማህበረሰባችን የተሰጠንን አደራ በታማኝነት መወጣት መሰረታችን ነው።"
                    : language === "ar"
                    ? "الوفاء بالأمانة الممنوحة لنا من مجتمعنا بأمانة هو أساسنا."
                    : "Fulfilling the trust given to us by our community with honesty is our foundation.",
                icon: ShieldCheck,
              },
              {
                title:
                  language === "am"
                    ? "ሁለንተናዊ እውቀት"
                    : language === "ar"
                    ? "المعرفة الشاملة"
                    : "Comprehensive Knowledge",
                desc:
                  language === "am"
                    ? "ትውልዱን በሸሪዓዊ እና በዘመናዊ እውቀት በማነፅ ለሀገር ጠቃሚ ዜጋ እናደርጋለን።"
                    : language === "ar"
                    ? "نربي الجيل بالمعرفة الشرعية والحديثة ليكون مواطنًا نافعًا لوطنه."
                    : "We nurture the generation with Sharia and modern knowledge to make them valuable citizens for their country.",
                icon: GraduationCap,
              },
              {
                title:
                  language === "am"
                    ? "ርህራሄና ትህትና"
                    : language === "ar"
                    ? "الرحمة والتواضع"
                    : "Compassion & Humility",
                desc:
                  language === "am"
                    ? "ማዕከላችን የድሆች መጠለያ እና የሁሉም ሰው እኩል መስተንግዶ ማዕከል ነው።"
                    : language === "ar"
                    ? "مركزنا ملجأ للفقراء ومركز ترحيب متساوٍ للجميع."
                    : "Our center is a shelter for the poor and an equal welcoming center for everyone.",
                icon: Heart,
              },
            ].map((val, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -15 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <div className="glass group rounded-[3.5rem] p-10 h-full flex flex-col items-center text-center transition-all duration-500 hover:bg-white/10 hover:border-gold/30">
                  <div className="mb-8 p-6 rounded-[2rem] bg-gold/10 text-gold group-hover:scale-110 group-hover:bg-gold group-hover:text-[#0b1220] transition-all duration-500 shadow-lg">
                    <val.icon size={38} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gold transition-colors duration-300">
                    {val.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {val.desc}
                  </p>
                  <div className="mt-6 w-12 h-1 bg-gold/20 rounded-full group-hover:w-20 group-hover:bg-gold transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* 4. SPIRITUAL SERVICES */}
      <section className="relative w-full py-24 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-4 mb-8 glass p-2 pr-6 rounded-full shadow-xl">
                <div className="p-3 bg-gold rounded-full text-[#0b1220]">
                  <FlameKindling size={24} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide uppercase">
                  {t.servicesBadge}
                </h2>
              </div>

              <div className="mb-10 p-8 glass rounded-[2.5rem] border-l-4 border-gold shadow-2xl text-left">
                <h3 className="text-2xl text-white font-bold leading-tight">
                  {t.servicesTitle}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {t.spiritualServicesList.map((service, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(251, 191, 36, 0.1)",
                    }}
                    className="flex items-center gap-4 p-5 glass text-white rounded-2xl border border-white/5 transition-all duration-300 cursor-default group"
                  >
                    <div className="p-3 bg-gold/10 rounded-xl group-hover:bg-gold/20 transition-colors">
                      <CheckCircle2 className="text-gold" size={22} />
                    </div>
                    <span className="font-semibold text-base group-hover:text-gold transition-colors">
                      {service}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative h-[600px] rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220]/60 via-transparent to-transparent z-10" />
              <img
                src={Ourservices}
                alt="Spiritual Services"
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute top-8 right-8 z-20 w-24 h-24 border-t-2 border-r-2 border-gold/30 rounded-tr-[3rem]" />
              <div className="absolute bottom-8 left-8 z-20 w-24 h-24 border-b-2 border-l-2 border-gold/30 rounded-bl-[3rem]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. EDUCATIONAL SERVICES */}
      <section className="relative w-full py-24 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[650px] rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white/10 order-2 lg:order-1"
            >
              <img
                src={Educationalservices}
                alt="Educational Services"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220]/60 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 text-left"
            >
              <div className="inline-flex items-center gap-4 mb-8 glass p-2 pr-6 rounded-full">
                <div className="p-3 bg-gold rounded-full text-[#0b1220]">
                  <GraduationCap size={24} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide uppercase">
                  {t.eduBadge}
                </h2>
              </div>

              <h3 className="text-3xl font-bold text-white mb-10 border-l-4 border-gold pl-6 text-gold-glow">
                {t.eduTitle}
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {t.eduHighlights.map((edu, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-5 glass rounded-2xl border border-white/5 hover:bg-white/10 transition-all"
                    >
                      <BookOpen className="text-gold" size={20} />
                      <span className="text-gray-200 font-medium">{edu}</span>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-gold/5 border border-gold/20 rounded-[2.5rem]">
                  <h4 className="text-lg font-bold text-gold mb-4 flex items-center gap-2">
                    <Star size={18} fill="currentColor" /> {t.adultCoursesLabel}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t.adultCourses.map((adult, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 text-gray-400 italic text-sm"
                      >
                        <Diploma size={16} className="text-gold" />
                        <span>{adult}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. YOUTH DEVELOPMENT */}
      <section className="relative w-full py-24 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-4 mb-8 glass p-2 pr-6 rounded-full">
                <div className="p-3 bg-gold rounded-full text-[#0b1220]">
                  <UserPlus size={24} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide uppercase">
                  {t.youthBadge}
                </h2>
              </div>

              <h3 className="text-3xl font-bold text-white mb-10 border-l-4 border-gold pl-6 text-gold-glow">
                {t.youthTitle}
              </h3>

              <div className="grid gap-4">
                {t.youthItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 glass rounded-[2rem] border border-white/5 hover:border-gold/30 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <item.icon className="text-gold" size={20} />
                      <span className="font-bold text-white group-hover:text-gold transition-colors">
                        {item.t}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 ml-8">{item.d}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative h-[650px] rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white/10"
            >
              <img
                src={Youthprograms}
                alt="Youth Development"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. FAMILY & SOCIAL SERVICES */}
      <section className="relative w-full py-24 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative h-[650px] rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white/10 order-2 lg:order-1"
            >
              <img
                src={Familyandsocialservices}
                alt="Family Services"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#0b1220]/20" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="order-1 lg:order-2 text-left"
            >
              <div className="inline-flex items-center gap-4 mb-8 glass p-2 pr-6 rounded-full">
                <div className="p-3 bg-gold rounded-full text-[#0b1220]">
                  <Heart size={24} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide uppercase">
                  {t.familyBadge}
                </h2>
              </div>

              <h3 className="text-3xl font-bold text-white mb-10 border-l-4 border-gold pl-6 text-gold-glow">
                {t.familyTitle}
              </h3>

              <div className="space-y-8">
                <div className="p-8 glass rounded-[2.5rem]">
                  <h4 className="flex items-center gap-3 font-bold text-xl text-white mb-6">
                    <ShieldCheck className="text-gold" size={24} />{" "}
                    {t.familySupportLabel}
                  </h4>
                  <div className="grid gap-4">
                    {t.familyItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl text-gray-300"
                      >
                        <CheckCircle2
                          size={18}
                          className="text-gold shrink-0"
                        />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-gold/5 border border-gold/20 rounded-3xl relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-rose-500 text-white text-[10px] px-2 py-1 rounded-full font-bold animate-pulse">
                      {language === "am"
                        ? "በቅርቡ"
                        : language === "ar"
                        ? "قريبًا"
                        : "Soon"}
                    </span>
                    <h4 className="font-bold text-white">{t.familyUpcoming}</h4>
                  </div>
                  <p className="text-gray-400 text-sm italic">
                    {t.familyUpcomingText}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. WOMEN'S PARTICIPATION */}
      <section className="relative w-full py-24 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[650px] rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white/10 order-2 lg:order-1"
            >
              <img
                src={Womensparticipation}
                alt="Women's Participation"
                className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b1220]/40 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 text-left"
            >
              <div className="inline-flex items-center gap-4 mb-8 glass p-2 pr-6 rounded-full shadow-xl">
                <div className="p-3 bg-gold rounded-full text-[#0b1220]">
                  <Star size={24} fill="currentColor" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide uppercase">
                  {t.womenBadge}
                </h2>
              </div>

              <h3 className="text-3xl font-bold text-white mb-10 border-l-4 border-gold pl-6 leading-tight text-gold-glow">
                {t.womenTitle}
              </h3>

              <div className="space-y-6">
                <div className="p-8 glass rounded-[2.5rem] border border-white/5 hover:bg-white/10 transition-all group">
                  <h4 className="flex items-center gap-3 font-bold text-xl text-white mb-5 group-hover:text-gold transition-colors">
                    <BookOpen className="text-gold" size={24} />{" "}
                    {t.womenEduLabel}
                  </h4>
                  <ul className="space-y-4 text-gray-400">
                    {t.womenEduItems.map((item, idx) => (
                      <li key={idx} className="flex gap-3 items-start">
                        <span className="text-gold mt-1">✦</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-8 bg-gold/5 border border-gold/20 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="btn-gold text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                      {language === "am"
                        ? "በቅርቡ"
                        : language === "ar"
                        ? "قريبًا"
                        : "Soon"}
                    </span>
                    <h4 className="font-bold text-lg text-white">
                      {t.womenUpcoming}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-300">
                    {t.womenUpcomingItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. COMMUNITY INVOLVEMENT */}
      <section className="relative w-full py-24 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-4 mb-8 glass p-2 pr-6 rounded-full shadow-xl">
                <div className="p-3 bg-gold rounded-full text-[#0b1220]">
                  <Globe size={24} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide uppercase">
                  {t.communityBadge}
                </h2>
              </div>

              <p className="text-3xl font-bold text-white mb-10 border-l-4 border-gold pl-6 leading-tight text-gold-glow">
                {t.communityTitle}
              </p>

              <div className="grid gap-6">
                {t.communityItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-8 glass rounded-[2.5rem] group hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gold/10 rounded-2xl group-hover:bg-gold/20 transition-colors">
                        {idx === 0 ? (
                          <Handshake className="text-gold" size={24} />
                        ) : (
                          <Sprout className="text-gold" size={24} />
                        )}
                      </div>
                      <h4 className="font-bold text-xl text-white group-hover:text-gold transition-colors">
                        {item.t}
                      </h4>
                    </div>
                    <p className="text-gray-400 leading-relaxed ml-14 group-hover:text-gray-200">
                      {item.d}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[650px] rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220]/80 via-transparent to-transparent z-10" />
              <img
                src={Communityinvolvement}
                alt="Community Involvement"
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100"
              />
              <div className="absolute bottom-10 left-10 z-20 glass p-6 rounded-3xl backdrop-blur-md">
                <p className="text-gold font-bold text-lg italic">
                  {t.communityBadgeText}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 10. FACILITIES */}
      <section className="relative w-full py-24 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gold/50" />
              <span className="text-gold font-bold tracking-[0.3em] uppercase text-xs">
                {t.facilitiesBadge}
              </span>
              <div className="h-px w-12 bg-gold/50" />
            </div>
            <h2 className="text-5xl font-bold mb-4 text-white text-gold-glow">
              {t.facilitiesTitle}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              {t.facilitiesSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.facilitiesList.map((facility, idx) => {
              const icons = [Zap, Layout, Users2, ShieldCheck, Info, Car];
              const IconComp = icons[idx % icons.length];
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -10 }}
                  className="glass p-8 rounded-[2.5rem] transition-all duration-300 group"
                >
                  <div className="p-4 bg-gold/10 rounded-2xl inline-block mb-6 group-hover:bg-gold/20 transition-colors">
                    <IconComp className="text-gold" size={28} />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-white group-hover:text-gold transition-colors">
                    {facility.t}
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-200">
                    {facility.d}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. OUR IMAMS */}
      <section className="relative w-full py-28 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-4 glass p-2 pr-6 rounded-full shadow-xl">
                <div className="p-3 bg-gold rounded-full text-[#0b1220]">
                  <Users2 size={24} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide uppercase">
                  {t.imamsBadge}
                </h2>
              </div>

              <h3 className="text-3xl font-bold text-white border-l-4 border-gold pl-6 leading-tight text-gold-glow">
                {t.imamsTitle}
              </h3>

              <p className="text-lg text-gray-400 leading-relaxed font-light">
                {t.imamsDesc}
              </p>

              <div className="grid gap-4">
                {t.imamsFeatures.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 10 }}
                    className="p-6 glass rounded-[2rem] border border-white/5 group hover:border-gold/30 transition-all duration-300"
                  >
                    <h4 className="font-bold text-white flex items-center gap-3 group-hover:text-gold transition-colors">
                      <CheckCircle2 size={20} className="text-gold" />
                      {item.t}
                    </h4>
                    <p className="text-sm text-gray-400 mt-2 ml-8">{item.d}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative h-[650px] md:h-[750px] rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white/10 group"
            >
              <img
                src={SheikMohammedjud.src || SheikMohammedjud}
                alt="Sheik Mohammed"
                className="w-full h-full object-cover transition duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-12 left-0 w-full px-10 z-20">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  className="glass p-8 rounded-[2.5rem] border border-gold/20 text-center backdrop-blur-xl"
                >
                  <h3 className="text-white text-3xl font-bold tracking-tight">
                    {t.imamName}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <div className="h-px w-8 bg-gold/50" />
                    <p className="text-gold font-medium tracking-widest text-sm uppercase">
                      {t.imamTitle}
                    </p>
                    <div className="h-px w-8 bg-gold/50" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute -right-20 top-1/2 w-96 h-96 bg-gold/5 rounded-full blur-[120px] -z-10" />
      </section>

      {/* CTA SECTION */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-32 mb-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass p-16 md:p-24 rounded-[4.5rem] text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              className="inline-block p-4 bg-gold/10 rounded-3xl mb-8 border border-gold/20"
            >
              <Sparkles size={32} className="text-gold" />
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-bold mb-10 text-white tracking-tighter leading-tight">
              {t.ctaTitle}{" "}
              <span className="text-gold text-gold-glow italic">
                {t.ctaTitleGold}
              </span>
            </h2>

            <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-12 font-light">
              {t.ctaText}
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Button
                className="bg-gold text-[#0b1220] hover:bg-white h-16 px-14 rounded-2xl font-black text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] active:scale-95 group"
                asChild
              >
                <Link to="/courses">
                  {t.ctaButton1}
                  <div className="ml-2 w-2 h-2 bg-[#0b1220] rounded-full group-hover:w-4 transition-all" />
                </Link>
              </Button>

              <Button
                variant="outline"
                className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold h-16 px-14 rounded-2xl font-bold text-lg transition-all duration-300 active:scale-95"
                asChild
              >
                <Link to="/donations" className="flex items-center gap-3">
                  {t.ctaButton2}{" "}
                  <ArrowRight
                    size={22}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </Link>
              </Button>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-gold/10 rounded-tr-[4.5rem]" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-gold/10 rounded-bl-[4.5rem]" />
        </motion.div>
      </div>
    </div>
  );
}
