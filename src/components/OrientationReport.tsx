import React, { useState, useEffect } from 'react';
import { DownloadIcon, RefreshCwIcon, UserIcon, BrainIcon, GraduationCapIcon, TrendingUpIcon, ClockIcon, BarChart3Icon, MessageSquareIcon, MapPinIcon, BookOpenIcon, LanguagesIcon, ChevronDownIcon, ChevronUpIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon, CalculatorIcon, Loader2Icon } from 'lucide-react';
import RadarChart from './RadarChart';
import BarChart from './BarChart';
import { useTranslation } from '../utils/translations'; // Ajout de l'import
import PrintableReport from './PrintableReport';
import ReactDOMServer from 'react-dom/server';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { getAuthToken } from '../utils/auth';


interface OrientationReportProps {
  userData: any; // Les données complètes du test
  language: string;
  onRestart: () => void;
}

const riasecCategories = {
  fr: {
    "Réaliste": "Réaliste",
    "Investigateur": "Investigateur",
    "Artistique": "Artistique",
    "Social": "Social",
    "Entreprenant": "Entreprenant",
    "Conventionnel": "Conventionnel"
  },
  ar: {
    "Réaliste": "واقعي",
    "Realiste": "واقعي",
    "Investigateur": "استقصائي",
    "Artistique": "فني",
    "Social": "اجتماعي",
    "Entreprenant": "مبادر",
    "Conventionnel": "تقليدي"
  }
};

// Ajouter ces nouvelles traductions pour les traits de personnalité
const personalityTraits = {
  fr: {
    "Ouverture": "Ouverture",
    "Organisation": "Organisation",
    "Sociabilité": "Sociabilité",
    "Gestion du stress": "Gestion du stress",
    "Leadership": "Leadership",
    "Autonomie": "Autonomie",
    "Persévérance": "Persévérance",
    "Créativité": "Créativité",
    "Adaptabilité": "Adaptabilité"
  },
  ar: {
    "Ouverture": "الانفتاح",
    "Organisation": "التنظيم",
    "Sociabilité": "الاجتماعية",
    "Gestion du stress": "إدارة التوتر",
    "Leadership": "القيادة",
    "Autonomie": "الاستقلالية",
    "Persévérance": "المثابرة",
    "Créativité": "الإبداع",
    "Adaptabilité": "التكيف"
  }
};


const learningStyles = {
  fr: [
    { value: 'visual', label: 'Visuel', description: 'Schémas, graphiques, images' },
    { value: 'auditif', label: 'Auditif', description: 'Écoute, discussions, explications orales' },
    { value: 'kinesthesique', label: 'Kinesthésique', description: 'Pratique, manipulation, expérimentation' },
    { value: 'lecture', label: 'Lecture-écriture', description: 'Textes, notes, résumés écrits' }
  ],
  ar: [
    { value: 'visual', label: 'بصري', description: 'مخططات، رسوم بيانية، صور' },
    { value: 'auditif', label: 'سمعي', description: 'استماع، نقاشات، شروحات شفهية' },
    { value: 'kinesthesique', label: 'حركي', description: 'ممارسة، تلاعب، تجريب' },
    { value: 'lecture', label: 'قراءة-كتابة', description: 'نصوص، ملاحظات، ملخصات مكتوبة' }
  ]
};

const languages = {
  fr: [
    { code: 'ar', name: 'Arabe', description: 'Arabe littéraire et dialectal' },
    { code: 'fr', name: 'Français', description: 'Français académique et professionnel' },
    { code: 'en', name: 'Anglais', description: 'Anglais international' },
    { code: 'es', name: 'Espagnol', description: 'Espagnol général' },
    { code: 'de', name: 'Allemand', description: 'Allemand standard' },
    { code: 'it', name: 'Italien', description: 'Italien standard' },
    { code: 'zh', name: 'Chinois', description: 'Mandarin standard' },
    { code: 'ja', name: 'Japonais', description: 'Japonais standard' },
    { code: 'pt', name: 'Portugais', description: 'Portugais général' },
    { code: 'ru', name: 'Russe', description: 'Russe standard' }
  ],
  ar: [
    { code: 'ar', name: 'العربية', description: 'العربية الفصحى والدارجة' },
    { code: 'fr', name: 'الفرنسية', description: 'الفرنسية الأكاديمية والمهنية' },
    { code: 'en', name: 'الإنجليزية', description: 'الإنجليزية الدولية' },
    { code: 'es', name: 'الإسبانية', description: 'الإسبانية العامة' },
    { code: 'de', name: 'الألمانية', description: 'الألمانية المعيارية' },
    { code: 'it', name: 'الإيطالية', description: 'الإيطالية المعيارية' },
    { code: 'zh', name: 'الصينية', description: 'الماندرين المعياري' },
    { code: 'ja', name: 'اليابانية', description: 'اليابانية المعيارية' },
    { code: 'pt', name: 'البرتغالية', description: 'البرتغالية العامة' },
    { code: 'ru', name: 'الروسية', description: 'الروسية المعيارية' }
  ]
};

const aptitudeTypes = {
  fr: {
    "logique": "Logique",
    "spatial": "Spatial",
    "numerique": "Numérique",
    "abstrait": "Abstrait",
    "mecanique": "Mécanique",
    "critique": "Pensée critique",
    "culture": "Culture générale",
    "etudes": "Études supérieures"
  },
  ar: {
    "logique": "منطقي",
    "spatial": "مكاني",
    "numerique": "رقمي",
    "abstrait": "مجرد",
    "mecanique": "ميكانيكي",
    "critique": "تفكير نقدي",
    "culture": "ثقافة عامة",
    "etudes": "دراسات عليا"
  }
};

const translations = {
  fr: {
    language: 'Langue',
    personalInfo: "Informations personnelles",
    academicNotes: "Notes académiques",
    testData: "Données du test",
    name: "Nom",
    age: "Âge",
    city: "Ville",
    studyLevel: "Niveau d'étude",
    bac: "Bac",
    specialties: "Spécialités",
    stream: "Filière",
    estimatedNote: "Note estimée",
    estimation: "Estimation",
    regionalExam: "Régional (1ère Bac)",
    continuousControl: "Contrôle Continu",
    nationalExam: "National",
    calculatedNotes: "Notes calculées",
    method1: "25% Régional + 25% CC + 50% National",
    method2: "50% National + 50% Régional",
    method3: "75% National + 25% Régional",
    firstYearAverage: "Moyenne Première",
    finalYearAverage: "Moyenne Terminale",
    bacAverage: "Note générale Baccalauréat",
    estimationWarning: "Notes estimées par l'étudiant, les valeurs réelles peuvent différer.",
    date: "Date",
    totalDuration: "Durée totale",
    version: "Version",
    of: "sur",
    thisTestHas: "Ce test comporte",
    questionsToSolve: "questions à résoudre en",
    minutes: "minutes",
    testSubtitle: "Définissez vos contraintes et priorités pour personnaliser les recommandations",
    geographicMobility: "Mobilité géographique",
    changeCity: "Changer de ville ?",
    studyAbroad: "Étudier à l'étranger ?",
    internationalCareer: "Carrière internationale ?",
    select: "Sélectionner",
    // Mobility options
    stayInCity: "Non, rester dans ma ville",
    stayInRegion: "Oui, dans ma région",
    stayInCountry: "Oui, partout au Maroc",
    onlyMorocco: "Non, uniquement au Maroc",
    onlyFrance: "France uniquement",
    europe: "Europe",
    anywhere: "Partout dans le monde",
    careerMorocco: "Non, carrière au Maroc",
    maybe: "Pourquoi pas",
    yesInternational: "Oui, carrière internationale",
    // Financial constraints
    financialConstraints: "Contraintes financières",
    availableBudget: "Budget annuel disponible",
    scholarshipEligible: "Éligible aux bourses ?",
    familySupport: "Soutien familial",
    budgetLow: "Moins de 20 000 MAD",
    budgetMedium: "20 000 - 50 000 MAD",
    budgetHigh: "50 000 - 100 000 MAD",
    budgetVeryHigh: "Plus de 100 000 MAD",
    yes: "Oui",
    no: "Non",
    unsure: "Pas sûr(e)",
    supportFull: "Soutien financier complet",
    supportPartial: "Soutien partiel",
    supportMoral: "Soutien moral uniquement",
    supportNone: "Autonomie complète",
    // Education preferences
    studyPreferences: "Préférences d'études",
    maxLevel: "Niveau maximum souhaité",
    preferredDuration: "Durée d'études préférée",
    studyMode: "Mode d'études",
    bacPlus2: "Bac+2 (DUT, BTS)",
    bacPlus3: "Bac+3 (Licence)",
    bacPlus5: "Bac+5 (Master, Ingénieur)",
    bacPlus8: "Bac+8+ (Doctorat)",
    durationShort: "Courte (2-3 ans)",
    durationMedium: "Moyenne (4-5 ans)",
    durationLong: "Longue (6+ ans)",
    fulltime: "Temps plein uniquement",
    partTime: "Temps partiel possible",
    alternance: "Alternance préférée",
    distance: "Formation à distance",
    // Career priorities
    careerPriorities: "Priorités de carrière",
    prioritiesInstruction: "Classez l'importance de chaque critère (1 = Moins important, 5 = Très important)",
    highSalary: "Salaire élevé",
    jobStability: "Stabilité de l'emploi",
    careerPassion: "Passion pour le métier",
    socialPrestige: "Prestige social",
    workLifeBalance: "Équilibre vie-travail",
    attractiveRemuneration: "Rémunération attractive",
    professionalSecurity: "Sécurité professionnelle",
    personalFulfillment: "Épanouissement personnel",
    socialRecognition: "Reconnaissance sociale",
    personalTime: "Temps pour la vie personnelle",
    previous: "Précédent",
    continue: "Continuer",
    orientationReport: "Rapport d'Orientation Complet",
    print: "Imprimer",
    newTest: "Nouveau test",
    generatedOn: "Généré le",

    // Sections principales
    executiveSummary: "Résumé Exécutif",
    testAnalytics: "Analytics du Test",
    riasecResults: "Résultats RIASEC",
    personalityResults: "Profil de Personnalité",
    aptitudeResults: "Tests d'Aptitudes",
    interestsResults: "Intérêts Académiques",
    careerResults: "Compatibilité Professionnelle",
    constraintsResults: "Contraintes et Priorités",
    languageResults: "Compétences Linguistiques",
    recommendations: "Recommandations",

    // Analytics
    testDuration: "Durée totale du test",
    totalQuestions: "Questions répondues",
    avgResponseTime: "Temps de réponse moyen",
    completionRate: "Taux de completion",

    // Statuts
    excellent: "Excellent",
    good: "Bon",
    average: "Moyen",
    needsWork: "À améliorer",

    // Profils
    profile: "Profil",
    score: "Score",
    level: "Niveau",
    strength: "Point fort",
    weakness: "Point faible",

    // Recommandations
    recommendedDomains: "Domaines recommandés",
    recommendedCareers: "Métiers suggérés",
    recommendedInstitutions: "Établissements conseillés",
    developmentPlan: "Plan de développement",

    showDetails: "Voir les détails",
    hideDetails: "Masquer les détails",

    // Nouvelles traductions
    questionsAnswers: "Questions & Réponses",
    riasecQuestions: "Questions RIASEC",
    personalityQuestions: "Questions Personnalité",
    aptitudeQuestions: "Questions Aptitudes",
    interestsQuestions: "Questions Intérêts",
    constraintsQuestions: "Questions Contraintes",
    languageQuestions: "Questions Langues",

    question: "Question",
    answer: "Réponse",
    correct: "Correct",
    incorrect: "Incorrect",
    notApplicable: "Non applicable",

    detailedAnalytics: "Analytics Détaillées",
    responsePatterns: "Patterns de Réponse",
    timeAnalysis: "Analyse Temporelle",
    accuracyRate: "Taux de Réussite",
    difficultyLevel: "Niveau de Difficulté",

    testPerformance: "Performance par Test",
    responseDistribution: "Distribution des Réponses",
    timeSpentBySection: "Temps par Section",

    easy: "Facile",
    medium: "Moyen",
    hard: "Difficile",
    careerPreferences: "Préférences de carrière",
    workTypePreferred: "Type de travail préféré",
    independentWork: "Travail indépendant",
    publicService: "Fonction publique",
    privateCompany: "Entreprise privée",
    ngoAssoc: "ONG / Associatif",
    mainPriority: "Priorité principale",
    passion: "Passion pour le métier",
    preferredSector: "Secteur préféré",
    publicOnly: "Secteur public uniquement",
    privateOnly: "Secteur privé uniquement",
    bothSectors: "Les deux secteurs",
    attraction: "Attirance",
    accessibleToYou: "Vous semble accessible ?",
    advice: "Conseil",
    adviceText: "Évaluez au moins 10 métiers pour obtenir des recommandations pertinentes. L'accessibilité correspond à votre perception actuelle de la difficulté d'accès au métier.",
    difficult: "Difficile",
    veryDifficult: "Très difficile",
    variable: "Variable",
    testTitle: "Intérêts académiques",
    interestLevel: "Intérêt (1-5)",
    motivationLevel: "Motivation (1-5)",
    acceptableByEffort: "Acceptable par effort",
    adviceTitle: "Conseil",
    questionInstruction: "Indiquez votre niveau d'accord avec chaque affirmation (1 = Pas du tout d'accord, 5 = Tout à fait d'accord)",
    learningStyleTitle: "Style d'apprentissage préféré",
    learningStyleSubtitle: "Comment apprenez-vous le mieux ?", previousCategory: "Catégorie précédente",
    nextCategory: "Catégorie suivante",
    finishTest: "Terminer le test",
  },
  ar: {
    personalInfo: "معلومات شخصية",
    academicNotes: "النقط الدراسية",
    testData: "بيانات الاختبار",
    name: "الاسم",
    age: "العمر",
    city: "المدينة",
    studyLevel: "المستوى الدراسي",
    bac: "البكالوريا",
    specialties: "التخصصات",
    stream: "المسلك",
    estimatedNote: "النقطة المتوقعة",
    estimation: "تقدير",
    regionalExam: "الجهوي (السنة الأولى باك)",
    continuousControl: "المراقبة المستمرة",
    nationalExam: "الوطني",
    calculatedNotes: "النقط المحسوبة",
    method1: "25% جهوي + 25% مراقبة مستمرة + 50% وطني",
    method2: "50% وطني + 50% جهوي",
    method3: "75% وطني + 25% جهوي",
    firstYearAverage: "معدل السنة الأولى",
    finalYearAverage: "معدل السنة النهائية",
    bacAverage: "المعدل العام للبكالوريا",
    estimationWarning: "نقط مقدرة من طرف الطالب، قد تختلف القيم الحقيقية",
    date: "التاريخ",
    totalDuration: "المدة الإجمالية",
    version: "الإصدار",
    language: "اللغة",
    testTitle: "التوافق مع المهن",
    testSubtitle: "قيم انجذابك للمهن المختلفة",
    careerPreferences: "تفضيلات المهنة",
    workTypePreferred: "نوع العمل المفضل",
    select: "اختر",
    independentWork: "عمل مستقل",
    publicService: "وظيفة عمومية",
    privateCompany: "شركة خاصة",
    ngoAssoc: "منظمة غير حكومية / جمعوية",
    mainPriority: "الأولوية الرئيسية",
    jobStability: "استقرار الوظيفة",
    highSalary: "راتب عالي",
    passion: "شغف بالمهنة",
    socialPrestige: "مكانة اجتماعية",
    preferredSector: "القطاع المفضل",
    publicOnly: "القطاع العام فقط",
    privateOnly: "القطاع الخاص فقط",
    bothSectors: "القطاعان معاً",
    attraction: "الانجذاب (1-5)",
    accessibleToYou: "يبدو متاحاً لك؟",
    yes: "نعم",
    no: "لا",
    advice: "نصيحة",
    adviceText: "قيم على الأقل 10 مهن للحصول على توصيات مناسبة. إمكانية الوصول تتوافق مع تصورك الحالي لصعوبة الوصول للمهنة.",
    previous: "السابق",
    continue: "متابعة",
    easy: "سهل",
    medium: "متوسط",
    difficult: "صعب",
    veryDifficult: "صعب جداً",
    variable: "متغير",
    of: "من",
    thisTestHas: "يحتوي هذا الاختبار على",
    questionsToSolve: "أسئلة يجب حلها في",
    minutes: "دقائق",
    geographicMobility: "الحركية الجغرافية",
    changeCity: "تغيير المدينة؟",
    studyAbroad: "الدراسة في الخارج؟",
    internationalCareer: "مهنة دولية؟",
    // Mobility options
    stayInCity: "لا، البقاء في مدينتي",
    stayInRegion: "نعم، في منطقتي",
    stayInCountry: "نعم، في أي مكان في المغرب",
    onlyMorocco: "لا، في المغرب فقط",
    onlyFrance: "فرنسا فقط",
    europe: "أوروبا",
    anywhere: "في أي مكان في العالم",
    careerMorocco: "لا، مهنة في المغرب",
    maybe: "لِمَ لا",
    yesInternational: "نعم، مهنة دولية",
    // Financial constraints
    financialConstraints: "القيود المالية",
    availableBudget: "الميزانية السنوية المتاحة",
    scholarshipEligible: "مؤهل للمنح الدراسية؟",
    familySupport: "الدعم الأسري",
    budgetLow: "أقل من 20,000 درهم",
    budgetMedium: "20,000 - 50,000 درهم",
    budgetHigh: "50,000 - 100,000 درهم",
    budgetVeryHigh: "أكثر من 100,000 درهم",
    unsure: "غير متأكد",
    supportFull: "دعم مالي كامل",
    supportPartial: "دعم جزئي",
    supportMoral: "دعم معنوي فقط",
    supportNone: "استقلالية كاملة",
    // Education preferences
    studyPreferences: "تفضيلات الدراسة",
    maxLevel: "المستوى الأقصى المرغوب",
    preferredDuration: "مدة الدراسة المفضلة",
    studyMode: "نمط الدراسة",
    bacPlus2: "باك+2 (دبلوم تقني)",
    bacPlus3: "باك+3 (إجازة)",
    bacPlus5: "باك+5 (ماستر، مهندس)",
    bacPlus8: "باك+8+ (دكتوراه)",
    durationShort: "قصيرة (2-3 سنوات)",
    durationMedium: "متوسطة (4-5 سنوات)",
    durationLong: "طويلة (6+ سنوات)",
    fulltime: "وقت كامل فقط",
    partTime: "وقت جزئي ممكن",
    alternance: "تناوب مفضل",
    distance: "تكوين عن بُعد",
    // Career priorities
    careerPriorities: "أولويات المهنة",
    prioritiesInstruction: "صنف أهمية كل معيار (1 = أقل أهمية، 5 = مهم جداً)",
    careerPassion: "شغف بالمهنة",
    workLifeBalance: "توازن بين العمل والحياة",
    attractiveRemuneration: "أجر جذاب",
    professionalSecurity: "أمان مهني",
    personalFulfillment: "تحقق شخصي",
    socialRecognition: "اعتراف اجتماعي",
    personalTime: "وقت للحياة الشخصية",
    orientationReport: "تقرير التوجيه الشامل",
    print: "طباعة",
    newTest: "اختبار جديد",
    generatedOn: "أُنشئ في",

    executiveSummary: "الملخص التنفيذي",
    testAnalytics: "تحليلات الاختبار",
    riasecResults: "نتائج RIASEC",
    personalityResults: "الملف الشخصي للشخصية",
    aptitudeResults: "اختبارات القدرات",
    interestsResults: "الاهتمامات الأكاديمية",
    careerResults: "التوافق المهني",
    constraintsResults: "القيود والأولويات",
    languageResults: "المهارات اللغوية",
    recommendations: "التوصيات",

    testDuration: "المدة الإجمالية للاختبار",
    totalQuestions: "الأسئلة المجاب عليها",
    avgResponseTime: "متوسط وقت الاستجابة",
    completionRate: "معدل الإنجاز",

    excellent: "ممتاز",
    good: "جيد",
    average: "متوسط",
    needsWork: "يحتاج تحسين",

    profile: "الملف الشخصي",
    score: "النتيجة",
    level: "المستوى",
    strength: "نقطة قوة",
    weakness: "نقطة ضعف",

    recommendedDomains: "المجالات الموصى بها",
    recommendedCareers: "المهن المقترحة",
    recommendedInstitutions: "المؤسسات المنصوح بها",
    developmentPlan: "خطة التطوير",

    showDetails: "عرض التفاصيل",
    hideDetails: "إخفاء التفاصيل",

    // Nouvelles traductions
    questionsAnswers: "الأسئلة والإجابات",
    riasecQuestions: "أسئلة RIASEC",
    personalityQuestions: "أسئلة الشخصية",
    aptitudeQuestions: "أسئلة القدرات",
    interestsQuestions: "أسئلة الاهتمامات",
    constraintsQuestions: "أسئلة القيود",
    languageQuestions: "أسئلة اللغات",

    question: "السؤال",
    answer: "الإجابة",
    correct: "صحيح",
    incorrect: "خاطئ",
    notApplicable: "غير مطبق",

    detailedAnalytics: "التحليلات المفصلة",
    responsePatterns: "أنماط الاستجابة",
    timeAnalysis: "تحليل الوقت",
    accuracyRate: "معدل النجاح",
    difficultyLevel: "مستوى الصعوبة",

    testPerformance: "الأداء حسب الاختبار",
    responseDistribution: "توزيع الإجابات",
    timeSpentBySection: "الوقت حسب القسم",

    hard: "صعب",
    interestLevel: "الاهتمام (1-5)",
    motivationLevel: "التحفيز (1-5)",
    acceptableByEffort: "مقبول بالجهد",
    adviceTitle: "نصيحة",
    questionInstruction: "حدد مستوى موافقتك مع كل عبارة (1 = لا أوافق إطلاقاً، 5 = أوافق تماماً)",
    learningStyleTitle: "أسلوب التعلم المفضل",
    learningStyleSubtitle: "كيف تتعلم بشكل أفضل؟", previousCategory: "الفئة السابقة",
    nextCategory: "الفئة التالية",
    finishTest: "إنهاء الاختبار",
  }
};

const OrientationReport: React.FC<OrientationReportProps> = ({ userData, language = 'fr', onRestart }) => {
  const constraints = userData.constraints || {};
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userReportData, setUserReportData] = useState<any>(userData);

  // Récupérer le token d'authentification
  const token = getAuthToken();
  const isAuthenticated = !!token;
  const t = translations[language as 'fr' | 'ar'] || translations.fr;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };


  // Fonction pour récupérer les données utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        // Si des données ont déjà été fournies par les props, les utiliser directement
        if (userData && Object.keys(userData).length > 0) {
          console.log("Utilisation des données utilisateur fournies par les props:", userData);
          setUserReportData(userData);
          setIsLoading(false);
          return;
        }

        // Sinon, récupérer les données depuis l'API
        console.log("Récupération des données utilisateur depuis l'API");
        const response = await axios.get(`${API_BASE_URL}/orientation-test/my-test`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success && response.data.hasTest) {
          console.log("Données de test récupérées avec succès:", response.data);

          // Formater les données pour le rapport
          const testData = response.data.data;
          const formattedData = {
            riasecScores: testData.currentStep.riasec || {},
            personalityScores: testData.currentStep.personality || {},
            aptitudeScores: testData.currentStep.aptitude || {},
            academicInterests: testData.currentStep.interests || {},
            careerCompatibility: testData.currentStep.careerCompatibility || {},
            constraints: testData.currentStep.constraints || {},
            languageSkills: testData.currentStep.languageSkills || {},
            personalInfo: testData.currentStep.personalInfo || {},
            testMetadata: {
              selectedLanguage: testData.metadata.selectedLanguage || language,
              completedAt: new Date(),
              isCompleted: true,
              totalDuration: testData.totalDuration || 0,
              version: "1.0"
            },
            uuid: response.data.uuid
          };

          console.log("Données formatées pour le rapport:", formattedData);
          setUserReportData(formattedData);
        } else {
          setError(response.data.message || (language === 'ar'
            ? 'لم يتم العثور على بيانات الاختبار'
            : 'Aucune donnée de test trouvée'));
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données utilisateur:", err);

        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            localStorage.removeItem('orientation_token');
            setError(language === 'ar'
              ? 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى'
              : 'Session expirée, veuillez vous reconnecter');
          } else {
            setError(err.response?.data?.message || (language === 'ar'
              ? 'خطأ في الاتصال بالخادم'
              : 'Erreur de connexion au serveur'));
          }
        } else {
          setError(language === 'ar'
            ? 'حدث خطأ غير متوقع'
            : 'Une erreur inattendue est survenue');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, token, userData, language]);

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}min ${seconds}s`;
  };

  const formatDate = () => {
    return new Date().toLocaleDateString(
      language === 'ar' ? 'ar-MA' : 'fr-FR',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    );
  };

  const generateExecutiveSummary = () => {
    const riasec = userData.riasecScores?.dominantProfile || [];
    const personality = userData.personalityScores?.dominantTraits || [];
    const topInterests = userData.academicInterests?.categoryStats || [];

    if (language === 'ar') {
      return `لديك ملف شخصي ${riasec.join('-')} مع سمات شخصية قوية في ${personality.slice(0, 2).join(' و ')}. اهتماماتك الأكاديمية تركز على المجالات عالية الدرجات، مع توجه نحو التخصصات التي تتطلب ${userData.constraints?.educationProfile?.ambitionLevel || 'مستوى عالي'} من الدراسة.`;
    }

    return `Vous présentez un profil ${riasec.join('-')} avec des traits de personnalité dominants en ${personality.slice(0, 2).join(' et ')}. Vos intérêts académiques se concentrent sur les domaines à forte compatibilité, avec une orientation vers des études de niveau ${userData.constraints?.educationProfile?.ambitionLevel || 'élevé'}.`;
  };

  const getRecommendations = () => {
    // Recommandations basées sur les résultats
    const recommendations = {
      domains: [
        {
          name: language === 'ar' ? 'الطب وعلوم الصحة' : 'Médecine et Sciences de la Santé',
          compatibility: 92,
          reason: language === 'ar' ? 'ملف اجتماعي قوي واهتمام بالصحة' : 'Profil social fort et intérêt pour la santé'
        },
        {
          name: language === 'ar' ? 'الهندسة والتكنولوجيا' : 'Ingénierie et Technologies',
          compatibility: 85,
          reason: language === 'ar' ? 'قدرات تحليلية واهتمام بالعلوم' : 'Capacités analytiques et intérêt scientifique'
        },
        {
          name: language === 'ar' ? 'إدارة الأعمال' : 'Management et Gestion',
          compatibility: 78,
          reason: language === 'ar' ? 'مهارات قيادية واهتمام تجاري' : 'Compétences entrepreneuriales et intérêt commercial'
        }
      ],
      careers: [
        language === 'ar' ? 'طبيب عام' : 'Médecin généraliste',
        language === 'ar' ? 'مهندس معلوماتي' : 'Ingénieur informatique',
        language === 'ar' ? 'مستشار التوجيه' : 'Conseiller d\'orientation',
        language === 'ar' ? 'مدير مشاريع' : 'Chef de projet',
        language === 'ar' ? 'باحث علمي' : 'Chercheur scientifique'
      ],
      institutions: [
        {
          name: language === 'ar' ? 'جامعة محمد الخامس - الرباط' : 'Université Mohammed V - Rabat',
          type: language === 'ar' ? 'عمومي' : 'Public',
          compatibility: 90
        },
        {
          name: language === 'ar' ? 'المدرسة الوطنية العليا للمعلوماتية' : 'ENSIAS',
          type: language === 'ar' ? 'عمومي' : 'Public',
          compatibility: 88
        },
        {
          name: language === 'ar' ? 'جامعة باريس ساكلاي' : 'Université Paris-Saclay',
          type: language === 'ar' ? 'دولي' : 'International',
          compatibility: 85
        }
      ]
    };

    return recommendations;
  };

  // Puis dans la fonction printReport :
  const printReport = () => {
    // Créer un élément iframe caché pour l'impression
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';

    document.body.appendChild(printFrame);

    // Rendu du composant PrintableReport dans l'iframe
    const printableContent = ReactDOMServer.renderToString(
      <PrintableReport userData={userData} language={language} />
    );

    printFrame.contentDocument?.open();
    printFrame.contentDocument?.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Rapport d'Orientation - ${userData.personalInfo?.firstName} ${userData.personalInfo?.lastName}</title>
        <meta charset="utf-8">
      </head>
      <body>
        ${printableContent}
      </body>
    </html>
  `);
    printFrame.contentDocument?.close();

    // Imprimer après le chargement
    printFrame.onload = () => {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();

      // Supprimer l'iframe après l'impression
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    };
  };

  const recommendations = getRecommendations();

  const getTestQuestions = (testType: string) => {
    // Simulation de données de questions/réponses
    const mockQuestions = {
      riasec: [
        { id: 1, question: "Préférez-vous travailler avec vos mains?", userAnswer: "Tout à fait d'accord", correctAnswer: null, category: "Réaliste" },
        { id: 2, question: "Aimez-vous résoudre des problèmes complexes?", userAnswer: "D'accord", correctAnswer: null, category: "Investigateur" },
        { id: 3, question: "Préférez-vous créer de nouvelles choses?", userAnswer: "Neutre", correctAnswer: null, category: "Artistique" },
        { id: 4, question: "Aimez-vous aider les autres?", userAnswer: "Tout à fait d'accord", correctAnswer: null, category: "Social" },
        { id: 5, question: "Êtes-vous à l'aise en position de leader?", userAnswer: "D'accord", correctAnswer: null, category: "Entreprenant" }
      ],
      personality: [
        { id: 1, question: "Vous êtes plutôt extraverti(e)", userAnswer: "D'accord", correctAnswer: null, category: "Extraversion" },
        { id: 2, question: "Vous préférez la routine", userAnswer: "Pas d'accord", correctAnswer: null, category: "Ouverture" },
        { id: 3, question: "Vous êtes organisé(e)", userAnswer: "Tout à fait d'accord", correctAnswer: null, category: "Conscienciosité" },
        { id: 4, question: "Vous gérez bien le stress", userAnswer: "D'accord", correctAnswer: null, category: "Stabilité émotionnelle" }
      ],
      aptitude: [
        { id: 1, question: "15 + 27 = ?", userAnswer: "42", correctAnswer: "42", isCorrect: true, category: "Numérique" },
        { id: 2, question: "Complétez la série: A, C, E, G, ?", userAnswer: "I", correctAnswer: "I", isCorrect: true, category: "Logique" },
        { id: 3, question: "Quel est l'antonyme de 'optimiste'?", userAnswer: "Pessimiste", correctAnswer: "Pessimiste", isCorrect: true, category: "Verbal" },
        { id: 4, question: "Dans quel sens tourne cette roue?", userAnswer: "Horaire", correctAnswer: "Anti-horaire", isCorrect: false, category: "Spatial" }
      ]
    };

    return mockQuestions[testType as keyof typeof mockQuestions] || [];
  };

  const getTestAnalytics = (testType: string) => {
    // Simulation d'analytics détaillées par test
    const mockAnalytics = {
      riasec: {
        totalQuestions: 60,
        completedQuestions: 60,
        averageTime: 45000,
        timeByCategory: {
          "Réaliste": 8200,
          "Investigateur": 9800,
          "Artistique": 7500,
          "Social": 6900,
          "Entreprenant": 8100,
          "Conventionnel": 7300
        },
        responseDistribution: {
          "Tout à fait d'accord": 18,
          "D'accord": 22,
          "Neutre": 8,
          "Pas d'accord": 9,
          "Pas du tout d'accord": 3
        }
      },
      personality: {
        totalQuestions: 45,
        completedQuestions: 45,
        averageTime: 38000,
        timeByCategory: {
          "Extraversion": 7200,
          "Agréabilité": 6800,
          "Conscienciosité": 8100,
          "Stabilité émotionnelle": 7900,
          "Ouverture": 8000
        },
        responseDistribution: {
          "Tout à fait d'accord": 12,
          "D'accord": 18,
          "Neutre": 6,
          "Pas d'accord": 7,
          "Pas du tout d'accord": 2
        }
      },
      aptitude: {
        totalQuestions: 30,
        completedQuestions: 30,
        averageTime: 120000,
        accuracyRate: 78,
        timeByCategory: {
          "Numérique": 35000,
          "Verbal": 28000,
          "Logique": 42000,
          "Spatial": 38000
        },
        difficultyDistribution: {
          "Facile": 12,
          "Moyen": 14,
          "Difficile": 4
        }
      }
    };

    return mockAnalytics[testType as keyof typeof mockAnalytics] || {};
  };

  // Helpers pour afficher les questions/réponses et analytics
  const renderQuestions = (questions: any[], type: string) => (
    <div className="space-y-2">
      {questions.map((q, idx) => (
        <div key={q.questionId || idx} className="bg-gray-50 rounded p-3">
          <div className="font-semibold">{q.questionText}</div>
          <div className="text-sm">
            <span className="font-medium">{t.answer}:</span> {q.selectedOption || q.userAnswer}
            {q.correctOption && (
              <span className="ml-2 text-green-600">({t.correct}: {q.correctOption})</span>
            )}
            {q.responseTime && (
              <span className="ml-2 text-gray-500">⏱ {formatDuration(q.responseTime)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const getDynamicRecommendations = (userData: any, t: any) => {
    const recs: string[] = [];
    // RIASEC
    if (userData.riasecScores?.dominantProfile?.includes('Social')) {
      recs.push("Vous excellez dans les métiers d'accompagnement, d'enseignement ou de santé.");
    }
    if (userData.riasecScores?.dominantProfile?.includes('Investigateur')) {
      recs.push("Les domaines scientifiques et d'ingénierie vous correspondent.");
    }
    // Personality
    if (userData.personalityScores?.dominantTraits?.includes('Organisation')) {
      recs.push("Vous êtes fait pour des postes de gestion, organisation ou management.");
    }
    if (userData.personalityScores?.dominantTraits?.includes('Ouverture')) {
      recs.push("Explorez des carrières créatives ou internationales.");
    }
    // Aptitudes
    if ((userData.aptitudeScores?.overallScore || 0) < 30) {
      recs.push("Renforcez vos compétences logiques et verbales par des exercices ciblés.");
    } else if ((userData.aptitudeScores?.overallScore || 0) > 70) {
      recs.push("Vous pouvez viser des filières sélectives et exigeantes.");
    }
    // Academic Interests
    if (userData.academicInterests?.categoryScores?.["Commerce et gestion"]?.interest > 80) {
      recs.push("Envisagez des études en commerce, gestion ou marketing.");
    }
    // Career
    if (userData.careerCompatibility?.sectorScores?.["Technologie"] > 70) {
      recs.push("Les métiers du numérique et de l'ingénierie sont adaptés à votre profil.");
    }
    // Constraints
    if (userData.constraints?.mobility?.international === "maybe") {
      recs.push("Explorez les opportunités d'études à l'étranger.");
    }
    // Langues
    if ((userData.languageSkills?.languageProfile?.multilingualIndex || 0) > 50) {
      recs.push("Votre profil multilingue est un atout pour les carrières internationales.");
    }
    return recs;
  };


  // Si le chargement est en cours, afficher un indicateur
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Loader2Icon className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-600">
          {language === 'ar'
            ? 'جاري تحميل تقرير التوجيه...'
            : 'Chargement du rapport d\'orientation...'}
        </p>
      </div>
    );
  }

  // Afficher un message d'erreur si nécessaire
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg max-w-2xl w-full">
          <h2 className="text-xl font-bold mb-4">
            {language === 'ar' ? 'خطأ في تحميل التقرير' : 'Erreur de chargement du rapport'}
          </h2>
          <p className="font-medium mb-6">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={onRestart}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
            >
              {language === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Retour à l\'accueil'}
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 print:bg-white ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 sm:py-8 print:bg-blue-600 print:py-6">
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
            <div className={language === 'ar' ? 'text-right w-full sm:w-auto' : 'w-full sm:w-auto'}>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 print:text-2xl">{t.orientationReport}</h1>
              <p className="text-blue-100 print:text-blue-200 text-xs sm:text-sm">
                {userData.personalInfo?.firstName} {userData.personalInfo?.lastName} • {t.generatedOn} {formatDate()}
              </p>
            </div>
            <div className={`flex space-x-2 sm:space-x-3 print:hidden mt-2 sm:mt-0 ${language === 'ar' ? 'flex-row-reverse space-x-reverse self-end sm:self-auto' : ''}`}>
              <button
                onClick={printReport}
                className={`flex items-center space-x-1 sm:space-x-2 bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-white/30 transition-all ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''} text-xs sm:text-sm`}
              >
                <DownloadIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{t.print}</span>
              </button>
              <button
                onClick={onRestart}
                className={`flex items-center space-x-1 sm:space-x-2 bg-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-white/30 transition-all ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''} text-xs sm:text-sm`}
              >
                <RefreshCwIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{t.newTest}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 print:px-0 print:py-4">
        {/* 1. Infos générales du test et personnelles */}
        <section className="bg-gradient-to-br from-blue-100 to-indigo-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className={`text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <UserIcon className="w-5 sm:w-6 md:w-7 h-5 sm:h-6 md:h-7 text-blue-600" />
            {t.orientationReport}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-8">
            <div className="bg-white rounded-lg sm:rounded-xl shadow p-3 sm:p-4 md:p-6 flex flex-col gap-2">
              <h3 className={`font-semibold text-blue-700 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base md:text-lg ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <UserIcon className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400" />
                {t.personalInfo}
              </h3>
              <ul className="text-xs sm:text-sm md:text-base space-y-1 sm:space-y-2">
                <li className={`flex ${language === 'ar' ? 'flex-row-reverse justify-start' : ''}`}>
                  <span className={`font-medium text-gray-700 ${language === 'ar' ? 'ml-1' : 'mr-1'}`}>{t.name} :</span>
                  <span className="font-bold">{userData.personalInfo?.firstName} {userData.personalInfo?.lastName}</span>
                </li>
                <li className={`flex ${language === 'ar' ? 'flex-row-reverse justify-start' : ''}`}>
                  <span className={`font-medium text-gray-700 ${language === 'ar' ? 'ml-1' : 'mr-1'}`}>{t.age} :</span>
                  <span className="font-bold">{userData.personalInfo?.age}</span>
                </li>
                <li className={`flex ${language === 'ar' ? 'flex-row-reverse justify-start' : ''}`}>
                  <span className={`font-medium text-gray-700 ${language === 'ar' ? 'ml-1' : 'mr-1'}`}>{t.city} :</span>
                  <span className="font-bold">{userData.personalInfo?.city}</span>
                </li>
                <li className={`flex ${language === 'ar' ? 'flex-row-reverse justify-start' : ''}`}>
                  <span className={`font-medium text-gray-700 ${language === 'ar' ? 'ml-1' : 'mr-1'}`}>{t.studyLevel} :</span>
                  <span className="font-bold">{userData.personalInfo?.studyLevel}</span>
                </li>
                <li className={`flex ${language === 'ar' ? 'flex-row-reverse justify-start' : ''}`}>
                  <span className={`font-medium text-gray-700 ${language === 'ar' ? 'ml-1' : 'mr-1'}`}>{t.bac} :</span>
                  <span className="font-bold">{userData.personalInfo?.bacType === "mission" ? "Mission Française" : userData.personalInfo?.bacType}</span>
                </li>
                {userData.personalInfo?.bacType === "mission" && (
                  <li className={`flex ${language === 'ar' ? 'flex-row-reverse justify-start' : ''}`}>
                    <span className={`font-medium text-gray-700 ${language === 'ar' ? 'ml-1' : 'mr-1'}`}>{t.specialties} :</span>
                    <span className="font-bold">
                      {userData.personalInfo?.bacSpecialites?.map((spe: string) => {
                        if (spe === "math") return language === 'ar' ? "الرياضيات" : "Mathématiques";
                        if (spe === "pc") return language === 'ar' ? "الفيزياء والكيمياء" : "Physique-Chimie";
                        if (spe === "svt") return language === 'ar' ? "علوم الحياة والأرض" : "SVT";
                        if (spe === "nsi") return language === 'ar' ? "العلوم الرقمية وعلوم الكمبيوتر" : "Numérique et Sciences Informatiques";
                        if (spe === "ses") return language === 'ar' ? "العلوم الاقتصادية والاجتماعية" : "Sciences Économiques et Sociales";
                        if (spe === "hggsp") return language === 'ar' ? "التاريخ والجغرافيا والجيوسياسية والعلوم السياسية" : "Histoire-Géo, Géopolitique et Sciences Politiques";
                        if (spe === "hlp") return language === 'ar' ? "الإنسانيات والأدب والفلسفة" : "Humanités, Littérature et Philosophie";
                        if (spe === "llce") return language === 'ar' ? "اللغات والآداب والثقافات الأجنبية" : "Langues, Littératures et Cultures Étrangères";
                        if (spe === "arts") return language === 'ar' ? "الفنون" : "Arts";
                        if (spe === "technologique") return language === 'ar' ? "التكنولوجيا" : "Technologique";
                        return spe;
                      }).join(", ")}
                    </span>
                  </li>
                )}
                {userData.personalInfo?.bacType === "marocain" && (
                  <li className={`flex ${language === 'ar' ? 'flex-row-reverse justify-start' : ''}`}>
                    <span className={`font-medium text-gray-700 ${language === 'ar' ? 'ml-1' : 'mr-1'}`}>{t.stream} :</span>
                    <span className="font-bold">{userData.personalInfo?.bacFiliere}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Notes académiques */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow p-3 sm:p-4 md:p-6 flex flex-col gap-2">
              <h3 className={`font-semibold text-emerald-700 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base md:text-lg ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <CalculatorIcon className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400" />
                {t.academicNotes}
                {userData.personalInfo?.noteAvailability === "estimation" && (
                  <span className="text-xs font-normal px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">{t.estimation}</span>
                )}
              </h3>

              {userData.personalInfo?.bacType === "marocain" && (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="bg-gray-50 rounded p-2">
                      <span className="text-xs text-gray-500 block">{t.regionalExam}</span>
                      <p className={`font-bold text-gray-900 ${language === 'ar' ? 'text-right' : ''}`}>
                        {userData.personalInfo?.noteAvailability === "estimation"
                          ? userData.personalInfo?.noteGenerale1ereBacEstimation
                          : userData.personalInfo?.noteGenerale1ereBac}/20
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <span className="text-xs text-gray-500 block">{t.continuousControl}</span>
                      <p className={`font-bold text-gray-900 ${language === 'ar' ? 'text-right' : ''}`}>
                        {userData.personalInfo?.noteAvailability === "estimation"
                          ? userData.personalInfo?.noteControleConinuEstimation
                          : userData.personalInfo?.noteControleContinu}/20
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <span className="text-xs text-gray-500 block">{t.nationalExam}</span>
                      <p className={`font-bold text-gray-900 ${language === 'ar' ? 'text-right' : ''}`}>
                        {userData.personalInfo?.noteAvailability === "estimation"
                          ? userData.personalInfo?.noteNationalEstimation
                          : userData.personalInfo?.noteNational}/20
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-2 mt-2">
                    <span className={`text-xs text-gray-500 font-medium block ${language === 'ar' ? 'text-right' : ''}`}>{t.calculatedNotes}:</span>
                    <div className="space-y-2 mt-2">
                      <div className={`bg-gradient-to-r from-green-50 to-emerald-50 rounded p-2 flex ${language === 'ar' ? 'flex-row-reverse' : ''} justify-between items-center`}>
                        <div className={language === 'ar' ? 'text-right' : ''}>
                          <span className="text-xs text-emerald-700 font-medium block">{t.method1}</span>
                          <p className="text-xs text-gray-500">{language === 'ar' ? "الطريقة 1" : "Méthode 1"}</p>
                        </div>
                        <span className="font-bold text-emerald-700">
                          {userData.personalInfo?.noteAvailability === "estimation"
                            ? userData.personalInfo?.noteCalculeeMethod1Estimation
                            : userData.personalInfo?.noteCalculeeMethod1}/20
                        </span>
                      </div>

                      <div className={`bg-gradient-to-r from-blue-50 to-cyan-50 rounded p-2 flex ${language === 'ar' ? 'flex-row-reverse' : ''} justify-between items-center`}>
                        <div className={language === 'ar' ? 'text-right' : ''}>
                          <span className="text-xs text-blue-700 font-medium block">{t.method2}</span>
                          <p className="text-xs text-gray-500">{language === 'ar' ? "الطريقة 2" : "Méthode 2"}</p>
                        </div>
                        <span className="font-bold text-blue-700">
                          {userData.personalInfo?.noteAvailability === "estimation"
                            ? userData.personalInfo?.noteCalculeeMethod2Estimation
                            : userData.personalInfo?.noteCalculeeMethod2}/20
                        </span>
                      </div>

                      <div className={`bg-gradient-to-r from-purple-50 to-indigo-50 rounded p-2 flex ${language === 'ar' ? 'flex-row-reverse' : ''} justify-between items-center`}>
                        <div className={language === 'ar' ? 'text-right' : ''}>
                          <span className="text-xs text-indigo-700 font-medium block">{t.method3}</span>
                          <p className="text-xs text-gray-500">{language === 'ar' ? "الطريقة 3" : "Méthode 3"}</p>
                        </div>
                        <span className="font-bold text-indigo-700">
                          {userData.personalInfo?.noteAvailability === "estimation"
                            ? userData.personalInfo?.noteCalculeeMethod3Estimation
                            : userData.personalInfo?.noteCalculeeMethod3}/20
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {userData.personalInfo?.bacType === "mission" && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {(userData.personalInfo?.noteGeneralePremiere || userData.personalInfo?.noteGeneralePremiereEstimation) && (
                      <div className="bg-gray-50 rounded p-2">
                        <span className="text-xs text-gray-500 block">{t.firstYearAverage}</span>
                        <p className={`font-bold text-gray-900 ${language === 'ar' ? 'text-right' : ''}`}>
                          {userData.personalInfo?.noteAvailability === "estimation"
                            ? userData.personalInfo?.noteGeneralePremiereEstimation
                            : userData.personalInfo?.noteGeneralePremiere}/20
                        </p>
                      </div>
                    )}

                    {(userData.personalInfo?.noteGeneraleTerminale || userData.personalInfo?.noteGeneraleTerminaleEstimation) && (
                      <div className="bg-gray-50 rounded p-2">
                        <span className="text-xs text-gray-500 block">{t.finalYearAverage}</span>
                        <p className={`font-bold text-gray-900 ${language === 'ar' ? 'text-right' : ''}`}>
                          {userData.personalInfo?.noteAvailability === "estimation"
                            ? userData.personalInfo?.noteGeneraleTerminaleEstimation
                            : userData.personalInfo?.noteGeneraleTerminale}/20
                        </p>
                      </div>
                    )}
                  </div>

                  {(userData.personalInfo?.noteGeneraleBac || userData.personalInfo?.noteGeneraleBacEstimation) && (
                    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded p-2 flex ${language === 'ar' ? 'flex-row-reverse' : ''} justify-between items-center`}>
                      <div className={language === 'ar' ? 'text-right' : ''}>
                        <span className="text-xs text-indigo-700 font-medium block">{t.bacAverage}</span>
                        {userData.personalInfo?.noteAvailability === "estimation" && (
                          <p className="text-xs text-gray-500">({t.estimation})</p>
                        )}
                      </div>
                      <span className="font-bold text-indigo-700">
                        {userData.personalInfo?.noteAvailability === "estimation"
                          ? userData.personalInfo?.noteGeneraleBacEstimation
                          : userData.personalInfo?.noteGeneraleBac}/20
                      </span>
                    </div>
                  )}
                </div>
              )}

              {userData.personalInfo?.noteAvailability === "estimation" && (
                <div className={`mt-2 bg-orange-50 p-2 rounded text-xs text-orange-600 flex items-center gap-1 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <AlertCircleIcon className="w-3 h-3" />
                  <span>{t.estimationWarning}</span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl shadow p-3 sm:p-4 md:p-6 flex flex-col gap-2">
              <h3 className={`font-semibold text-indigo-700 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base md:text-lg ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <ClockIcon className="w-4 sm:w-5 h-4 sm:h-5 text-indigo-400" />
                {t.testData}
              </h3>
              <ul className="text-xs sm:text-sm md:text-base space-y-1 sm:space-y-2">
                <li className={`flex ${language === 'ar' ? 'flex-row-reverse justify-start' : ''}`}>
                  <span className={`font-medium text-gray-700 ${language === 'ar' ? 'ml-1' : 'mr-1'}`}>{t.language} : </span>
                  <span className="font-bold">
                    {
                      (() => {
                        const langCode = userData.testMetadata?.selectedLanguage;
                        const langObj = languages[language as 'fr' | 'ar'].find(l => l.code === langCode);
                        return langObj ? langObj.name : langCode;
                      })()
                    }
                  </span>
                </li>
                <li className={`flex ${language === 'ar' ? 'flex-row-reverse justify-start' : ''}`}>
                  <span className={`font-medium text-gray-700 ${language === 'ar' ? 'ml-1' : 'mr-1'}`}>{t.date} :</span>
                  <span className="font-bold">{formatDate()}</span>
                </li>
                <li className={`flex ${language === 'ar' ? 'flex-row-reverse justify-start' : ''}`}>
                  <span className={`font-medium text-gray-700 ${language === 'ar' ? 'ml-1' : 'mr-1'}`}>{t.version} :</span>
                  <span className="font-bold">{userData.testMetadata?.version}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
        {/* 2. Pour chaque test, questions/réponses, durée, analytics, résultat */}

        {/* RIASEC */}
        <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className={`flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <BrainIcon className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
            <h2 className="text-base sm:text-lg md:text-xl font-bold">{t.riasecResults}</h2>
          </div>
          <h3 className="font-semibold mb-2 text-sm sm:text-base">{t.questionsAnswers}</h3>
          <div className="space-y-2">
            {Object.entries(userData.riasecScores?.detailedResponses || {}).map(([cat, questions]: [string, any]) => (
              <React.Fragment key={cat}>
                {questions.map((q: any) => (
                  <div key={q.questionId} className={`flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 bg-purple-50 rounded-lg p-2 sm:p-3 shadow-sm mb-2 text-xs sm:text-sm ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
                    <span className="font-bold text-purple-600 min-w-[80px] sm:min-w-[100px]">
                      {/* Utilisez la traduction appropriée selon la langue */}
                      {riasecCategories[language as 'fr' | 'ar'][cat as keyof typeof riasecCategories['fr']] || cat}
                    </span>
                    <span className="font-medium flex-1">{q.questionText}</span>
                    <span className={`text-gray-700 mt-1 sm:mt-0 ${language === 'ar' ? 'text-right' : ''}`}>
                      {t.answer}: <span className="font-bold">{q.userAnswer}</span>
                    </span>
                    <span className="text-gray-400 text-xs">⏱ {formatDuration(q.responseTime)}</span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Section visualisation RIASEC */}
        <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h3 className={`font-semibold mb-3 sm:mb-4 text-sm sm:text-base ${language === 'ar' ? 'text-right' : ''}`}>
            {language === 'ar' ? "تصور ملف RIASEC" : "Visualisation du profil RIASEC"}
          </h3>
          <div className="my-8 sm:my-10 md:my-12 flex flex-col items-center">
            <RadarChart
              data={userData.riasecScores?.scores || {}}
              title={language === 'ar' ? "ملف RIASEC" : "Profil RIASEC"}
              language={language}
              translations={riasecCategories[language as 'fr' | 'ar']}
            />
          </div>
          <div className={`flex flex-wrap gap-2 mt-3 sm:mt-4 ${language === 'ar' ? 'justify-end' : ''}`}>
            {userData.riasecScores?.dominantProfile?.map((p: string) => (
              <span key={p} className="px-2 sm:px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold text-xs sm:text-sm">
                {riasecCategories[language as 'fr' | 'ar'][p as keyof typeof riasecCategories['fr']] || p}
              </span>
            ))}
          </div>
          <div className={`mt-2 text-xs sm:text-sm text-gray-500 ${language === 'ar' ? 'text-right' : ''}`}>
            {language === 'ar' ? "متوسط الوقت لكل سؤال" : "Temps moyen par question"}:
            <span className="font-bold">{formatDuration(userData.riasecScores?.avgResponseTime)}</span>
          </div>
        </section>

        {/* Personnalité */}
        <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className={`flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <BrainIcon className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
            <h2 className="text-base sm:text-lg md:text-xl font-bold">{t.personalityResults}</h2>
          </div>
          <h3 className={`font-semibold mb-2 text-sm sm:text-base ${language === 'ar' ? 'text-right' : ''}`}>
            {t.questionsAnswers}
          </h3>
          <div className="space-y-2">
            {userData.personalityScores?.detailedResponses?.map((q: any) => (
              <div key={q.questionId} className={`flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 bg-green-50 rounded-lg p-2 sm:p-3 shadow-sm mb-2 text-xs sm:text-sm ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
                <span className={`font-medium flex-1 ${language === 'ar' ? 'text-right' : ''}`}>{q.questionText}</span>
                <span className={`text-gray-700 mt-1 sm:mt-0 ${language === 'ar' ? 'text-right flex flex-row-reverse' : ''}`}>
                  {t.answer}: <span className="font-bold">{q.userAnswer}</span>
                </span>
                <span className={`text-gray-400 text-xs ${language === 'ar' ? 'text-right' : ''}`}>⏱ {formatDuration(q.responseTime)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h3 className={`font-semibold mb-3 sm:mb-4 text-sm sm:text-base ${language === 'ar' ? 'text-right' : ''}`}>
            {language === 'ar' ? "تصور ملف الشخصية" : "Visualisation du profil de personnalité"}
          </h3>
          <BarChart
            data={userData.personalityScores?.scores || {}}
            title={language === 'ar' ? "سمات الشخصية" : "Traits de Personnalité"}
            color="green"
            language={language}
          />
          <div className={`flex flex-wrap gap-2 mt-3 sm:mt-4 ${language === 'ar' ? 'justify-end' : ''}`}>
            {userData.personalityScores?.dominantTraits?.map((trait: string) => (
              <span key={trait} className="px-2 sm:px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs sm:text-sm">
                {personalityTraits[language as 'fr' | 'ar'][trait as keyof typeof personalityTraits['fr']] || trait}
              </span>
            ))}
          </div>
          <div className={`mt-3 sm:mt-4 ${language === 'ar' ? 'text-right' : ''}`}>
            <span className="text-xs sm:text-sm text-gray-500 font-semibold">
              {language === 'ar' ? "أسلوب التعلم المفضل:" : "Style d'apprentissage préféré:"}
            </span>
            <div className={`mt-1 sm:mt-2 ${language === 'ar' ? 'flex flex-row-reverse items-start' : ''}`}>
              {(() => {
                const styleValue = userData.personalityScores?.learningStyle;
                const styleObj = learningStyles[language as 'fr' | 'ar'].find(ls => ls.value === styleValue);
                if (styleObj) {
                  return (
                    <span className={`inline-block px-2 sm:px-3 py-1 rounded-full bg-green-50 text-green-700 font-bold text-xs sm:text-sm ${language === 'ar' ? 'ml-2' : 'mr-2'}`}>
                      {styleObj.label}
                    </span>
                  );
                }
                return <span className="text-gray-400 text-xs sm:text-sm">{styleValue ?? '-'}</span>;
              })()}
              {(() => {
                const styleValue = userData.personalityScores?.learningStyle;
                const styleObj = learningStyles[language as 'fr' | 'ar'].find(ls => ls.value === styleValue);
                if (styleObj) {
                  return (
                    <span className={`text-gray-600 text-xs sm:text-sm ${language === 'ar' ? 'mr-1 sm:mr-2' : 'ml-1 sm:ml-2'}`}>
                      {styleObj.description}
                    </span>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </section>

        {/* Aptitudes */}
        <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className={`flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <GraduationCapIcon className="w-5 sm:w-6 h-5 sm:h-6 text-orange-600" />
            <h2 className="text-base sm:text-lg md:text-xl font-bold">{t.aptitudeResults}</h2>
          </div>
          <h3 className={`font-semibold mb-2 text-sm sm:text-base ${language === 'ar' ? 'text-right' : ''}`}>{t.questionsAnswers}</h3>
          <div className="space-y-2">
            {Object.entries(userData.aptitudeScores?.detailedResponses || {}).map(([type, questions]: [string, any]) => (
              <React.Fragment key={type}>
                {questions.map((q: any, idx: number) => (
                  <div key={idx} className={`bg-orange-50 rounded-lg p-3 sm:p-4 shadow-sm mb-2 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm ${language === 'ar' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 mb-1 ${language === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
                      <span className="font-bold text-orange-600 text-sm sm:text-base">
                        {aptitudeTypes[language as 'fr' | 'ar'][type as keyof typeof aptitudeTypes['fr']] || type}
                      </span>
                    </div>
                    <div className="mb-1 sm:mb-2">
                      <span className="font-semibold text-sm sm:text-base text-gray-800">{q.questionText || `Question ${idx + 1}`}</span>
                    </div>
                    <div className={`flex flex-wrap gap-2 sm:gap-4 items-center ${language === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
                      <span className="text-gray-700">
                        {language === 'ar' ? (
                          <><span className="float-left font-bold">{q.selectedOption || q.userAnswer}</span> :{t.answer}</>
                        ) : (
                          <>{t.answer}: <span className="font-bold">{q.selectedOption || q.userAnswer}</span></>
                        )}
                      </span>
                      {q.correctOption && (
                        <span className="text-green-600">
                          {language === 'ar' ? (
                            <><span className="float-left font-bold">{q.correctOption}</span> :{t.correct}</>
                          ) : (
                            <>{t.correct}: <span className="font-bold">{q.correctOption}</span></>
                          )}
                        </span>
                      )}
                      {typeof q.isCorrect !== "undefined" && (
                        <span className={`font-bold ${q.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {q.isCorrect ? t.correct : t.incorrect}
                        </span>
                      )}
                      <span className="text-gray-400 text-xs">⏱ {formatDuration(q.responseTime || 0)}</span>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Section visualisation Aptitudes */}
        <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h3 className={`font-semibold mb-3 sm:mb-4 text-sm sm:text-base ${language === 'ar' ? 'text-right' : ''}`}>
            {language === 'ar' ? "تصور ملف القدرات" : "Visualisation du profil d'aptitudes"}
          </h3>
          <BarChart
            data={userData.aptitudeScores?.scores || {}}
            title={language === 'ar' ? "القدرات" : "Aptitudes"}
            color="orange"
            language={language}
          />
        </section>

        {/* Intérêts académiques */}
        <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className={`flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <BookOpenIcon className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
            <h2 className="text-base sm:text-lg md:text-xl font-bold">{t.interestsResults}</h2>
          </div>
          <h3 className={`font-semibold mb-2 text-sm sm:text-base ${language === 'ar' ? 'text-right' : ''}`}>{t.questionsAnswers}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {Object.entries(userData.academicInterests?.detailedResponses || {}).map(([field, responses]: [string, any]) => (
              Array.isArray(responses)
                ? responses.map((q: any, idx: number) => (
                  <div key={field + idx} className={`bg-blue-50 rounded-lg p-3 sm:p-4 shadow-sm flex flex-col gap-1 sm:gap-2 mb-2 text-xs sm:text-sm ${language === 'ar' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 mb-1 ${language === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
                      <span className="font-bold text-blue-600 text-sm sm:text-base">{field}</span>
                    </div>
                    <div className="mb-1 sm:mb-2">
                      <span className="font-semibold text-sm sm:text-base text-gray-800">{q.questionText || field}</span>
                    </div>
                    <div className={`flex flex-wrap gap-2 sm:gap-4 items-center ${language === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
                      <span className="text-blue-700">
                        {language === 'ar' ? (
                          <span><span className="font-bold">{q.interestLevel}</span> :{t.interestLevel}</span>
                        ) : (
                          <span>{t.interestLevel}: <span className="font-bold">{q.interestLevel}</span></span>
                        )}
                      </span>
                      <span className="text-green-700">
                        {language === 'ar' ? (
                          <span><span className="font-bold">{q.motivationLevel}</span> :{t.motivationLevel}</span>
                        ) : (
                          <span>{t.motivationLevel}: <span className="font-bold">{q.motivationLevel}</span></span>
                        )}
                      </span>
                    </div>
                  </div>
                ))
                : (
                  <div key={field} className={`bg-blue-50 rounded-lg p-3 sm:p-4 shadow-sm flex flex-col gap-1 sm:gap-2 mb-2 text-xs sm:text-sm ${language === 'ar' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 mb-1 ${language === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
                      <span className="font-bold text-blue-600 text-sm sm:text-base">{field}</span>
                    </div>
                    <div className="mb-1 sm:mb-2">
                      <span className="font-semibold text-sm sm:text-base text-gray-800">{responses.questionText || field}</span>
                    </div>
                    <div className={`flex flex-wrap gap-2 sm:gap-4 items-center ${language === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
                      <span className="text-blue-700">
                        {language === 'ar' ? (
                          <span><span className="font-bold">{responses.interestLevel}</span> :{t.interestLevel}</span>
                        ) : (
                          <span>{t.interestLevel}: <span className="font-bold">{responses.interestLevel}</span></span>
                        )}
                      </span>
                      <span className="text-green-700">
                        {language === 'ar' ? (
                          <span><span className="font-bold">{responses.motivationLevel}</span> :{t.motivationLevel}</span>
                        ) : (
                          <span>{t.motivationLevel}: <span className="font-bold">{responses.motivationLevel}</span></span>
                        )}
                      </span>
                    </div>
                  </div>
                )
            ))}
          </div>
        </section>

        {/* Compatibilité carrière */}
        <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className={`flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <TrendingUpIcon className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
            <h2 className="text-base sm:text-lg md:text-xl font-bold">{t.careerResults}</h2>
          </div>
          <div>
            <h3 className={`font-semibold mb-2 text-sm sm:text-base ${language === 'ar' ? 'text-right' : ''}`}>{t.questionsAnswers}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {Object.entries(userData.careerCompatibility?.detailedResponses || {}).map(([career, q]: [string, any]) => (
                <div key={career} className={`bg-purple-50 rounded-lg p-3 sm:p-4 shadow-sm flex flex-col text-xs sm:text-sm ${language === 'ar' ? 'text-right' : ''}`}>
                  <span className="font-medium mb-1 text-purple-700">{career}</span>
                  <div className="mb-1 sm:mb-2">
                    <span className="text-sm sm:text-base text-gray-800">{q.questionText || career}</span>
                  </div>
                  <div className={`flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm items-center ${language === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
                    <span className="text-purple-700">
                      {language === 'ar' ? (
                        <span>قطاع : <span className="font-bold">{q.sector}</span> </span>
                      ) : (
                        <span>Secteur: <span className="font-bold">{q.sector}</span></span>
                      )}
                    </span>
                    <span className="text-blue-700">
                      {language === 'ar' ? (
                        <span>صعوبة : <span className="font-bold">{q.difficultyLevel}</span> </span>
                      ) : (
                        <span>Difficulté: <span className="font-bold">{q.difficultyLevel}</span></span>
                      )}
                    </span>
                    <span className="text-green-700">
                      {language === 'ar' ? (
                        <span>انجذاب :<span className="font-bold">{q.attractionLevel}</span> </span>
                      ) : (
                        <span>Attirance: <span className="font-bold">{q.attractionLevel}</span></span>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Résultat après questions */}
            <div className="mt-4 sm:mt-6 border-t pt-3 sm:pt-4">
              <div className={`font-semibold mb-2 text-sm sm:text-base ${language === 'ar' ? 'text-right' : ''}`}>
                {language === 'ar' ? "نتيجة المهنة" : "Résultat Carrière"}
              </div>
              <div className="space-y-1 sm:space-y-2">
                {Object.entries(userData.careerCompatibility?.sectorScores || {}).map(([sector, score]: [string, any]) => (
                  <div key={sector} className={`bg-purple-50 rounded p-2 flex justify-between items-center text-xs sm:text-sm ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <span className="font-medium">{sector}</span>
                    <div className="w-12 sm:w-16 h-2 bg-gray-200 rounded">
                      <div
                        className="h-2 rounded bg-purple-400"
                        style={{
                          width: `${score}%`,
                          marginLeft: language === 'ar' ? 'auto' : '0',
                          marginRight: language === 'ar' ? '0' : 'auto'
                        }}
                      />
                    </div>
                    <span className="text-xs">{score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* Contraintes */}
        <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className={`flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <MapPinIcon className="w-5 sm:w-6 h-5 sm:h-6 text-red-600" />
            <h2 className="text-base sm:text-lg md:text-xl font-bold">{t.constraintsResults}</h2>
          </div>
          <h3 className={`font-semibold mb-2 text-sm sm:text-base ${language === 'ar' ? 'text-right' : ''}`}>{t.questionsAnswers}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">

            {/* Mobilité */}
            <div className={`bg-red-50 rounded-lg p-3 sm:p-4 shadow-sm flex flex-col mb-2 text-xs sm:text-sm ${language === 'ar' ? 'text-right' : ''}`}>
              <span className="font-bold text-red-600 mb-2">{t.geographicMobility}</span>
              <span className="mb-1">
                {language === 'ar' ? (
                  <><span className="float-left font-bold">{t[constraints.mobility?.city as keyof typeof t] ?? constraints.mobility?.city ?? '-'}</span> :{t.changeCity}</>
                ) : (
                  <>{t.changeCity}: <span className="font-bold">{t[constraints.mobility?.city as keyof typeof t] ?? constraints.mobility?.city ?? '-'}</span></>
                )}
              </span>
              <span className="mb-1">
                {language === 'ar' ? (
                  <><span className="float-left font-bold">{t[constraints.mobility?.country as keyof typeof t] ?? constraints.mobility?.country ?? '-'}</span> :{t.studyAbroad}</>
                ) : (
                  <>{t.studyAbroad}: <span className="font-bold">{t[constraints.mobility?.country as keyof typeof t] ?? constraints.mobility?.country ?? '-'}</span></>
                )}
              </span>
              <span>
                {language === 'ar' ? (
                  <><span className="float-left font-bold">{t[constraints.mobility?.international as keyof typeof t] ?? constraints.mobility?.international ?? '-'}</span> :{t.internationalCareer}</>
                ) : (
                  <>{t.internationalCareer}: <span className="font-bold">{t[constraints.mobility?.international as keyof typeof t] ?? constraints.mobility?.international ?? '-'}</span></>
                )}
              </span>
            </div>

            {/* Budget */}
            <div className={`bg-green-50 rounded-lg p-3 sm:p-4 shadow-sm flex flex-col mb-2 text-xs sm:text-sm ${language === 'ar' ? 'text-right' : ''}`}>
              <span className="font-bold text-green-600 mb-2">{t.financialConstraints}</span>
              <span className="mb-1">
                {language === 'ar' ? (
                  <><span className="float-left font-bold">{t[constraints.budget?.annualBudget as keyof typeof t] ?? constraints.budget?.annualBudget ?? '-'}</span> :{t.availableBudget}</>
                ) : (
                  <>{t.availableBudget}: <span className="font-bold">{t[constraints.budget?.annualBudget as keyof typeof t] ?? constraints.budget?.annualBudget ?? '-'}</span></>
                )}
              </span>
              <span className="mb-1">
                {language === 'ar' ? (
                  <><span className="float-left font-bold">{t[constraints.budget?.scholarshipEligible as keyof typeof t] ?? constraints.budget?.scholarshipEligible ?? '-'}</span> :{t.scholarshipEligible}</>
                ) : (
                  <>{t.scholarshipEligible}: <span className="font-bold">{t[constraints.budget?.scholarshipEligible as keyof typeof t] ?? constraints.budget?.scholarshipEligible ?? '-'}</span></>
                )}
              </span>
              <span>
                {language === 'ar' ? (
                  <><span className="float-left font-bold">{t[constraints.budget?.familySupport as keyof typeof t] ?? constraints.budget?.familySupport ?? '-'}</span> :{t.familySupport}</>
                ) : (
                  <>{t.familySupport}: <span className="font-bold">{t[constraints.budget?.familySupport as keyof typeof t] ?? constraints.budget?.familySupport ?? '-'}</span></>
                )}
              </span>
            </div>

            {/* Education */}
            <div className={`bg-purple-50 rounded-lg p-3 sm:p-4 shadow-sm flex flex-col mb-2 text-xs sm:text-sm ${language === 'ar' ? 'text-right' : ''}`}>
              <span className="font-bold text-purple-600 mb-2">{t.studyPreferences}</span>
              <span className="mb-1">
                {language === 'ar' ? (
                  <><span className="float-left font-bold">{t[constraints.education?.maxLevel as keyof typeof t] ?? constraints.education?.maxLevel ?? '-'}</span> :{t.maxLevel}</>
                ) : (
                  <>{t.maxLevel}: <span className="font-bold">{t[constraints.education?.maxLevel as keyof typeof t] ?? constraints.education?.maxLevel ?? '-'}</span></>
                )}
              </span>
              <span className="mb-1">
                {language === 'ar' ? (
                  <><span className="float-left font-bold">{t[constraints.education?.preferredDuration as keyof typeof t] ?? constraints.education?.preferredDuration ?? '-'}</span> :{t.preferredDuration}</>
                ) : (
                  <>{t.preferredDuration}: <span className="font-bold">{t[constraints.education?.preferredDuration as keyof typeof t] ?? constraints.education?.preferredDuration ?? '-'}</span></>
                )}
              </span>
              <span>
                {language === 'ar' ? (
                  <><span className="float-left font-bold">{t[constraints.education?.studyMode as keyof typeof t] ?? constraints.education?.studyMode ?? '-'}</span> :{t.studyMode}</>
                ) : (
                  <>{t.studyMode}: <span className="font-bold">{t[constraints.education?.studyMode as keyof typeof t] ?? constraints.education?.studyMode ?? '-'}</span></>
                )}
              </span>
            </div>

            {/* Priorités */}
            <div className={`bg-orange-50 rounded-lg p-3 sm:p-4 shadow-sm flex flex-col mb-2 text-xs sm:text-sm ${language === 'ar' ? 'text-right' : ''}`}>
              <span className="font-bold text-orange-600 mb-2">{t.careerPriorities}</span>
              {[
                { key: 'salary', label: t.highSalary },
                { key: 'stability', label: t.jobStability },
                { key: 'passion', label: t.careerPassion },
                { key: 'prestige', label: t.socialPrestige },
                { key: 'workLife', label: t.workLifeBalance }
              ].map(({ key, label }) => (
                <span key={key} className="mb-1">
                  {language === 'ar' ? (
                    <><span className="float-left font-bold">{constraints.priorities?.[key] ?? '-'}/5</span> :{label}</>
                  ) : (
                    <>{label}: <span className="font-bold">{constraints.priorities?.[key] ?? '-'}</span>/5</>
                  )}
                </span>
              ))}
            </div>
          </div>
        </section>



        {/* Compétences Linguistiques */}
        <section className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className={`flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <LanguagesIcon className="w-5 sm:w-6 h-5 sm:h-6 text-indigo-600" />
            <h2 className="text-base sm:text-lg md:text-xl font-bold">{t.languageResults}</h2>
          </div>
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {(userData.languageSkills?.selectedLanguages || []).map((langKey: string) => {
              const langInfo = languages[language as 'fr' | 'ar'].find(l => l.code === langKey);
              const langLabel = langInfo ? langInfo.name : (t[langKey as keyof typeof t] ?? langKey);
              const langDesc = langInfo ? langInfo.description : '';
              const skills = userData.languageSkills?.languageSkills?.[langKey] || {};
              const cert = userData.languageSkills?.certificates?.[langKey] || {};
              const overallScore = userData.languageSkills?.overallScores?.[langKey];
              const comfortable = userData.languageSkills?.preferences?.comfortableStudyingIn?.includes(langKey);
              const willingToImprove = userData.languageSkills?.preferences?.willingToImprove?.includes(langKey);

              return (
                <div key={langKey} className="bg-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-sm w-full">
                  <div className={`flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <LanguagesIcon className="w-4 sm:w-5 h-4 sm:h-5 text-indigo-700" />
                    <span className="font-bold text-indigo-700 text-sm sm:text-base md:text-lg">{langLabel}</span>
                    <span className={`${language === 'ar' ? 'mr-1 sm:mr-2' : 'ml-1 sm:ml-2'} text-xs text-gray-500`}>
                      {overallScore !== undefined ? (language === 'ar' ? `${overallScore} :النتيجة` : `Score: ${overallScore}`) : null}
                    </span>
                  </div>
                  {langDesc && (
                    <div className={`mb-2 sm:mb-4 text-xs sm:text-sm text-gray-600 ${language === 'ar' ? 'text-right' : ''}`}>{langDesc}</div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-2 sm:mb-4">

                    <div>
                      <h4 className={`font-semibold mb-1 sm:mb-2 text-xs sm:text-sm ${language === 'ar' ? 'text-right' : ''}`}>
                        {language === 'ar' ? "المهارات" : "Compétences"}
                      </h4>
                      <ul className={`space-y-1 text-xs sm:text-sm ${language === 'ar' ? 'text-right' : ''}`}>
                        <li className={`${language === 'ar' ? 'text-right' : ''}`}>
                          {language === 'ar' ? (
                            <>
                              <span className="float-left font-bold">{skills.speaking ?? '-'}</span>
                              <span className="ml-1">:تحدث</span>
                            </>
                          ) : (
                            <>Expression orale: <span className="font-bold">{skills.speaking ?? '-'}</span></>
                          )}
                        </li>
                        <li className={`${language === 'ar' ? 'text-right' : ''}`}>
                          {language === 'ar' ? (
                            <>
                              <span className="float-left font-bold">{skills.writing ?? '-'}</span>
                              <span className="ml-1">:كتابة</span>
                            </>
                          ) : (
                            <>Expression écrite: <span className="font-bold">{skills.writing ?? '-'}</span></>
                          )}
                        </li>
                        <li className={`${language === 'ar' ? 'text-right' : ''}`}>
                          {language === 'ar' ? (
                            <>
                              <span className="float-left font-bold">{skills.reading ?? '-'}</span>
                              <span className="ml-1">:قراءة</span>
                            </>
                          ) : (
                            <>Compréhension écrite: <span className="font-bold">{skills.reading ?? '-'}</span></>
                          )}
                        </li>
                        <li className={`${language === 'ar' ? 'text-right' : ''}`}>
                          {language === 'ar' ? (
                            <>
                              <span className="float-left font-bold">{skills.listening ?? '-'}</span>
                              <span className="ml-1">:استماع</span>
                            </>
                          ) : (
                            <>Compréhension orale: <span className="font-bold">{skills.listening ?? '-'}</span></>
                          )}
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className={`font-semibold mb-1 sm:mb-2 text-xs sm:text-sm ${language === 'ar' ? 'text-right' : ''}`}>
                        {language === 'ar' ? "شهادة" : "Certificat"}
                      </h4>
                      {cert.hasCertificate ? (
                        <ul className={`space-y-1 text-xs sm:text-sm ${language === 'ar' ? 'text-right' : ''}`}>
                          <li className={`${language === 'ar' ? 'text-right' : ''}`}>
                            {language === 'ar' ? (
                              <>
                                <span className="float-left font-bold">{cert.certificateName}</span>
                                <span className="ml-1">:اسم الشهادة</span>
                              </>
                            ) : (
                              <>Nom du certificat: <span className="font-bold">{cert.certificateName}</span></>
                            )}
                          </li>
                          <li className={`${language === 'ar' ? 'text-right' : ''}`}>
                            {language === 'ar' ? (
                              <>
                                <span className="float-left font-bold">{cert.score}</span>
                                <span className="ml-1">:النقطة المحصل عليها</span>
                              </>
                            ) : (
                              <>Note obtenue: <span className="font-bold">{cert.score}</span></>
                            )}
                          </li>
                          <li className={`${language === 'ar' ? 'text-right' : ''}`}>
                            {language === 'ar' ? (
                              <>
                                <span className="float-left font-bold">{cert.total}</span>
                                <span className="ml-1">:النقطة الكلية</span>
                              </>
                            ) : (
                              <>Note totale: <span className="font-bold">{cert.total}</span></>
                            )}
                          </li>
                        </ul>
                      ) : (
                        <span className={`text-gray-500 text-xs sm:text-sm ${language === 'ar' ? 'text-right block' : ''}`}>
                          {language === 'ar' ? "لا توجد شهادة" : "Pas de certificat"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`flex flex-wrap gap-2 sm:gap-4 mt-1 sm:mt-2 ${language === 'ar' ? 'justify-end' : ''}`}>
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${comfortable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'} font-semibold text-xs sm:text-sm`}>
                      {language === 'ar' ? (
                        <span className="flex flex-row-reverse items-center gap-1">
                          <span>{comfortable ? t.yes : t.no}</span>
                          <span>:مرتاح للدراسة بهذه اللغة</span>
                        </span>
                      ) : (
                        <>À l'aise pour étudier: {comfortable ? t.yes : t.no}</>
                      )}
                    </span>
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${willingToImprove ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'} font-semibold text-xs sm:text-sm`}>
                      {language === 'ar' ? (
                        <span className="flex flex-row-reverse items-center gap-1">
                          <span>{willingToImprove ? t.yes : t.no}</span>
                          <span>:يرغب في التحسن</span>
                        </span>
                      ) : (
                        <>Souhaite s'améliorer: {willingToImprove ? t.yes : t.no}</>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recommandations dynamiques */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <TrendingUpIcon className="w-5 sm:w-6 h-5 sm:h-6" />
            <h2 className="text-base sm:text-lg md:text-xl font-bold">Recommandations personnalisées</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12">
            <AlertCircleIcon className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-yellow-300 mb-3 sm:mb-4" />
            <span className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-center">Cette section est en cours de développement.</span>
            <span className="text-white/80 text-xs sm:text-sm md:text-base text-center">Les recommandations personnalisées seront bientôt disponibles.</span>
          </div>
        </section>

        {/* Footer */}
        <footer className={`text-center py-6 sm:py-8 border-t border-gray-200 print:py-4 ${language === 'ar' ? 'text-right' : ''}`}>
          <p className="text-gray-600 mb-4 print:text-sm text-xs sm:text-sm">
            Ce rapport a été généré automatiquement basé sur vos réponses aux différents tests d'orientation.
            Il est recommandé de consulter un conseiller d'orientation pour un accompagnement personnalisé.
          </p>
          <button
            onClick={onRestart}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all print:hidden text-xs sm:text-sm md:text-base"
          >
            {t.newTest}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default OrientationReport;