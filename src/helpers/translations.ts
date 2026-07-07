import type { Language } from "../types";

// ─── Translations ─────────────────────────────────────────────────────────────
// en  = English (LTR)
// ckb = Kurdish · Sorani (RTL, Arabic script)

export const translations = {
  en: {
    // App
    appName: "Zankoline",
    appTagline: "University Admission Guide",

    // Login
    loginTitle: "Enter your grade",
    loginSubtitle:
      "We'll show you eligible programs based on your total score.",
    loginGradeLabel: "Total Grade (%)",
    loginGradePlaceholder: "e.g. 94.5",
    loginError: "Please enter a valid grade between 50 and 100.",
    loginNameError: "Please enter your name",
    loginNameLabel: "Name",
    loginNamePlaceholder: "e.g., John Doe",
    loginSubmit: "Start Exploring",
    loginFooter: "Data sourced from KRG & official admission records 2024-2025",

    // Nav
    navSearch: "Search Programs",
    navSearchShort: "Search",
    navChoices: "My Choices",
    navChoicesShort: "Choices",
    navHistory: "History",
    navHistoryShort: "History",
    yourGrade: "Your Grade",
    yourName: "Your Name",
    editProfile: "Edit profile",
    editProfileTitle: "Update name & grade",
    saveProfile: "Save changes",
    profileUpdated: "Profile updated",
    signOut: "Sign Out",

    // Home / Search
    searchProgramsTitle: "Search Programs",
    searchProgramsSummary: "{count} programs · {selected} selected",
    searchPlaceholder: "Search university, faculty, or department…",
    allGovernorates: "All Governorates",
    allFaculties: "All Faculties",
    allStatuses: "All Statuses",
    clear: "Clear",
    colUniversity: "University",
    colFaculty: "Faculty",
    colDepartment: "Department",
    colGovernorate: "Governorate",
    colMinGrade: "Min Grade",
    colEvening: "Evening Grade",
    colParallel: "Parallel Grade",
    colStatus: "Status",
    noProgramsMatch: "No programs match your filters",
    clearFilters: "Clear filters",

    // Governorates
    govDuhok: "Duhok",
    govSul: "Sulaymaniyah",
    govErbil: "Erbil",
    govHalabja: "Halabja",

    // Theme
    themeLight: "Light",
    themeDark: "Dark",

    // Status labels
    statusQualified: "Qualified",
    statusBorderline: "Borderline",
    statusUnlikely: "Unlikely",
    statusUnknown: "—",

    // Shortlist
    myChoicesTitle: "My Choices",
    myChoicesSummary: "{count} programs selected · Grade: {grade}%",
    printForm: "Print",
    printFormTitle: "University Application Choices",
    printStudentLabel: "Student Name",
    printGradeLabel: "Total Grade",
    printDateLabel: "Date",
    printAcademicYear: "Academic Year 2024–2025",
    saveForLater: "Save",
    updateForm: "Update",
    printHeaderSubtitle: "Student Grade: {grade}% | Date: {date}",
    noProgramsSelected: "No programs selected yet",
    noProgramsSelectedHint: "Go to Search and check programs to add them here.",
    removeProgram: "Remove",

    // History
    historyTitle: "History",
    historySubtitle: "Previous admission planning sessions",
    noHistoryYet: "No history yet",
    noHistoryHint: "Your saved sessions will appear here.",
    gradeLabel: "Grade:",
    facultiesChosen: "faculties chosen",
    viewDetails: "View Details",
    moreCount: "+{count} more",

    // Language switcher
    language: "Language",
    languageEnglish: "English",
    languageKurdish: "Kurdish (Sorani)",

    // Popup Dialog
    headerText: "Save Application Form",
    headerTextUpdate: "Update Application Form",
    studentName: "Student",
    studentGrade: "Grade",
    formDescription: "Form Label",
    inputPlaceholder: "eg., if I get 95%",
    labelText:
      "Add a label to help you distinguish between different scenarios",
    buttonText: "Save Form",
    cancelText: "Cancel",

    // Toast messages
    formCreated: "Your form was successfully saved 😄",
    formUpdated: "Your form was successfully updated 😄",
    generalError: "Something went wrong",
    deletionMessage: "Form deleted successfully",
  },
  ckb: {
    // App
    appName: "زانکۆلاین",
    appTagline: "ڕێبەری وەرگرتن بۆ زانکۆ",

    // Login
    loginTitle: "نمرەو ناوەکەت بنووسە",
    loginSubtitle: "بەپێی کۆی نمرەکەت، بەشە گونجاوەکانت پێشان دەدەین.",
    loginGradeLabel: "کۆی نمرە (%)",
    loginGradePlaceholder: "نموونە: ٩٤.٥",
    loginError: "تکایە نمرەیەکی دروست لەنێوان ٥٠ و ١٠٠ بنووسە.",
    loginNameLabel: "ناو",
    loginNamePlaceholder: "نمونە: ئاکام ابراهیم",
    loginNameError: "تکایە ناوی خۆت بنوسە",
    loginSubmit: "دەستبکە بە گەڕان",
    loginFooter:
      "زانیاری لە حکومەتی هەرێمی کوردستان و تۆمارە فەرمییەکان ٢٠٢٤ - ٢٠٢٥",

    // Nav
    navSearch: "گەڕان بەدوای بەشەکان",
    navSearchShort: "گەڕان",
    navChoices: "هەلبژاردنەکانم",
    navChoicesShort: "هەلبژاردن",
    navHistory: "مێژوو",
    navHistoryShort: "مێژوو",
    yourGrade: "نمرەکەت",
    yourName: "ناوەکەت",
    editProfile: "گۆڕینی زانیاری",
    editProfileTitle: "ناو و نمرە بگۆڕە",
    saveProfile: "پاشەکەوتکردن",
    profileUpdated: "زانیارییەکانت نوێکرانەوە",
    signOut: "چوونەدەرەوە",

    // Home / Search
    searchProgramsTitle: "گەڕان بەدوای بەشەکان",
    searchProgramsSummary: "{count} بەش · {selected} هەلبژێردراوە",
    searchPlaceholder: "گەڕان بە زانکۆ، کۆلێژ، یان بەش…",
    allGovernorates: "هەموو پارێزگاکان",
    allFaculties: "هەموو کۆلێژەکان",
    allStatuses: "هەموو دۆخەکان",
    clear: "سڕینەوە",
    colUniversity: "زانکۆ",
    colFaculty: "کۆلێژ",
    colDepartment: "بەش",
    colGovernorate: "پارێزگا",
    colMinGrade: "کەمترین نمرە",
    colEvening: "ئێواران",
    colParallel: "پارالێڵ",
    colStatus: "دۆخ",
    noProgramsMatch: "هیچ بەشێک لەگەڵ پاڵاوتنەکانت یەک ناگرێتەوە",
    clearFilters: "سڕینەوەی پاڵاوتنەکان",

    // Governorates
    govDuhok: "دهۆک",
    govSul: "سلێمانی",
    govErbil: "هەولێر",
    govHalabja: "هەڵەبجە",

    // Theme
    themeLight: "ڕووناک",
    themeDark: "تاریک",

    // Status labels
    statusQualified: "شایستە",
    statusBorderline: "نزیک",
    statusUnlikely: "نەشیاو",
    statusUnknown: "—",

    // Shortlist
    myChoicesTitle: "هەلبژاردنەکانم",
    myChoicesSummary: "{count} بەش هەلبژێردراوە · نمرە: {grade}%",
    printForm: "چاپ بکە",
    printFormTitle: "هەلبژاردنەکانی وەرگرتن بۆ زانکۆ",
    printStudentLabel: "ناوی خوێندکار",
    printGradeLabel: "کۆی نمرە",
    printDateLabel: "بەروار",
    printAcademicYear: "ساڵی خوێندنی ٢٠٢٤–٢٠٢٥",
    saveForLater: "هەڵیبگرە",
    updateForm: "بگۆڕە",
    printHeaderSubtitle: "نمرەی خوێندکار: {grade}% | بەروار: {date}",
    noProgramsSelected: "هێشتا هیچ بەشێک هەلنەبژێردراوە",
    noProgramsSelectedHint:
      "بڕۆ بۆ بەشی گەڕان و بەشەکان هەلبژێرە بۆ ئەوەی لێرە زیاد بکرێن.",
    removeProgram: "سڕینەوە",

    // History
    historyTitle: "مێژوو",
    historySubtitle: "فۆڕمە هەڵگیراوەکانت ببینە",
    noHistoryYet: "هیچ فۆڕمێکی هەڵگیراوت نییە",
    noHistoryHint: "فۆڕمە پاشەکەوتکراوەکانت لێرە دەردەکەون.",
    gradeLabel: "نمرە:",
    facultiesChosen: "کۆلێژ هەلبژێردراوە",
    viewDetails: "بینینی وردەکاری",
    moreCount: "+{count} زیاتر",

    // Language switcher
    language: "زمان",
    languageEnglish: "ئینگلیزی",
    languageKurdish: "کوردی (سۆرانی)",

    // Popup Dialog
    headerText: "فۆڕمەکەت هەڵبگرە",
    headerTextUpdate: "فۆڕمەکەت بگۆڕە",
    studentName: "ناوی خوێندکار",
    studentGrade: "نمرەی خوێندکار",

    formDescription: "پێناسی فۆڕم",
    inputPlaceholder: "نمونە: ئەگەر نمرەکەم ٩٥ بێت",
    labelText: "پێناسێک بنوسە بۆ جیاکردنەوەی هەل و مەرجی جیاواز",
    buttonText: "هەڵگرتن",
    cancelText: "پاشگەزبونەوە",

    // Toast messages
    formCreated: "فۆڕمەکەت بە سەرکەوتووی هەڵگیرا 😄",
    formUpdated: "فۆڕمەکەت بە سەرکەوتووی گۆڕدرا 😄",
    generalError: "هەڵەیەک ڕویدا",
    deletionMessage: "فۆڕمەکەت بە سەرکەوتووی لابرا",
  },
} satisfies Record<Language, Record<string, string>>;

export type TranslationKey = keyof typeof translations.en;
