export interface Translation {
  // Welcome Screen
  welcomeTitle: string;
  welcomeSubtitle: string;
  scientificTests: string;
  scientificTestsDesc: string;
  completeAnalysis: string;
  completeAnalysisDesc: string;
  detailedReport: string;
  detailedReportDesc: string;
  estimatedTime: string;
  estimatedTimeDesc: string;
  whatYouDiscover: string;
  riasecProfile: string;
  aptitudesPerformances: string;
  recommendedDomains: string;
  careersOpportunities: string;
  startTest: string;
  freeConfidentialScientific: string;
  
  // Navigation
  previous: string;
  next: string;
  continue: string;
  finish: string;
  
  // Personal Info
  personalInfoTitle: string;
  personalInfoSubtitle: string;
  generalInfo: string;
  firstName: string;
  lastName: string;
  age: string;
  city: string;
  academicPath: string;
  bacType: string;
  graduationYear: string;
  averageGrades: string;
  mathematics: string;
  sciences: string;
  french: string;
  languages: string;
  arabic: string;
  english: string;
  spanish: string;
  level: string;
  beginner: string;
  intermediate: string;
  advanced: string;
  fluent: string;
  native: string;
  
  // RIASEC Test
  riasecTestTitle: string;
  riasecTestSubtitle: string;
  riasecInstruction: string;
  realistic: string;
  investigative: string;
  artistic: string;
  social: string;
  enterprising: string;
  conventional: string;
  
  // Personality Test
  personalityTestTitle: string;
  personalityTestSubtitle: string;
  personalityInstruction: string;
  openness: string;
  organization: string;
  sociability: string;
  stressManagement: string;
  leadership: string;
  learningStyle: string;
  visual: string;
  auditory: string;
  kinesthetic: string;
  readingWriting: string;
  
  // Aptitude Test
  aptitudeTestTitle: string;
  aptitudeTestSubtitle: string;
  logicalReasoning: string;
  verbalComprehension: string;
  spatialReasoning: string;
  timeLimit: string;
  startTest: string;
  question: string;
  
  // Interests Test
  interestsTestTitle: string;
  interestsTestSubtitle: string;
  interest: string;
  motivation: string;
  acceptableByEffort: string;
  yes: string;
  no: string;
  
  // Career Compatibility
  careerCompatibilityTitle: string;
  careerCompatibilitySubtitle: string;
  attraction: string;
  accessible: string;
  workPreferences: string;
  preferredWorkType: string;
  mainPriority: string;
  preferredSector: string;
  
  // Constraints Test
  constraintsTestTitle: string;
  constraintsTestSubtitle: string;
  geographicMobility: string;
  changeCity: string;
  studyAbroad: string;
  internationalCareer: string;
  financialConstraints: string;
  annualBudget: string;
  scholarshipEligible: string;
  familySupport: string;
  studyPreferences: string;
  maxLevel: string;
  preferredDuration: string;
  studyMode: string;
  careerPriorities: string;
  highSalary: string;
  jobStability: string;
  passionForJob: string;
  socialPrestige: string;
  workLifeBalance: string;
  
  // Language Test
  languageTestTitle: string;
  languageTestSubtitle: string;
  languagePreferences: string;
  preferredTeachingLanguage: string;
  comfortableStudyingIn: string;
  willingToImprove: string;
  
  // Report
  orientationReport: string;
  executiveSummary: string;
  riasecProfile: string;
  personalityProfile: string;
  aptitudesPerformances: string;
  recommendedDomains: string;
  careersOpportunities: string;
  recommendedInstitutions: string;
  print: string;
  newTest: string;
  
  // Common
  select: string;
  required: string;
  optional: string;
  devMode: string;
  fillTestData: string;
  viewReport: string;
}

export const translations: Record<string, Translation> = {
  fr: {
    // Welcome Screen
    welcomeTitle: "Découvrez votre orientation idéale",
    welcomeSubtitle: "Un système d'orientation complet et personnalisé pour vous guider vers les études et la carrière qui vous correspondent vraiment.",
    scientificTests: "Tests Scientifiques",
    scientificTestsDesc: "Basé sur le modèle RIASEC et des tests de personnalité reconnus",
    completeAnalysis: "Analyse Complète",
    completeAnalysisDesc: "Évaluation des intérêts, aptitudes, personnalité et contraintes",
    detailedReport: "Rapport Détaillé",
    detailedReportDesc: "Recommandations personnalisées d'études et de carrières",
    estimatedTime: "Durée estimée : 25-30 minutes",
    estimatedTimeDesc: "Prenez votre temps et répondez honnêtement pour obtenir les meilleurs résultats. Vos réponses resteront confidentielles.",
    whatYouDiscover: "Ce que vous découvrirez :",
    riasecProfile: "Votre profil RIASEC et vos types de personnalité dominants",
    aptitudesPerformances: "Vos aptitudes et domaines académiques recommandés",
    recommendedDomains: "Les métiers les plus compatibles avec votre profil",
    careersOpportunities: "Des recommandations d'établissements et de formations",
    startTest: "Commencer mon test d'orientation",
    freeConfidentialScientific: "Gratuit • Confidentiel • Basé sur des méthodes scientifiques",
    
    // Navigation
    previous: "Précédent",
    next: "Suivant",
    continue: "Continuer",
    finish: "Terminer",
    
    // Personal Info
    personalInfoTitle: "Parlez-nous de vous",
    personalInfoSubtitle: "Ces informations nous aideront à personnaliser vos recommandations",
    generalInfo: "Informations générales",
    firstName: "Prénom",
    lastName: "Nom",
    age: "Âge",
    city: "Ville",
    academicPath: "Parcours scolaire",
    bacType: "Type de Baccalauréat",
    graduationYear: "Année d'obtention",
    averageGrades: "Notes moyennes (sur 20)",
    mathematics: "Mathématiques",
    sciences: "Sciences",
    french: "Français",
    languages: "Compétences linguistiques",
    arabic: "Arabe",
    english: "Anglais",
    spanish: "Espagnol",
    level: "Niveau",
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
    fluent: "Courant",
    native: "Natif",
    
    // RIASEC Test
    riasecTestTitle: "Test RIASEC",
    riasecTestSubtitle: "Évaluez votre intérêt pour différents types d'activités",
    riasecInstruction: "À quel point êtes-vous intéressé(e) par ces activités ? (1 = Pas du tout, 5 = Énormément)",
    realistic: "Réaliste",
    investigative: "Investigateur",
    artistic: "Artistique",
    social: "Social",
    enterprising: "Entreprenant",
    conventional: "Conventionnel",
    
    // Personality Test
    personalityTestTitle: "Test de personnalité académique",
    personalityTestSubtitle: "Découvrez vos traits de personnalité pour les études",
    personalityInstruction: "Indiquez votre niveau d'accord avec chaque affirmation (1 = Pas du tout d'accord, 5 = Tout à fait d'accord)",
    openness: "Ouverture",
    organization: "Organisation",
    sociability: "Sociabilité",
    stressManagement: "Gestion du stress",
    leadership: "Leadership",
    learningStyle: "Style d'apprentissage préféré",
    visual: "Visuel",
    auditory: "Auditif",
    kinesthetic: "Kinesthésique",
    readingWriting: "Lecture-écriture",
    
    // Aptitude Test
    aptitudeTestTitle: "Test d'aptitudes",
    aptitudeTestSubtitle: "Évaluez vos capacités de raisonnement",
    logicalReasoning: "Raisonnement logique",
    verbalComprehension: "Compréhension verbale",
    spatialReasoning: "Raisonnement spatial",
    timeLimit: "Temps limité",
    startTest: "Commencer le test",
    question: "Question",
    
    // Interests Test
    interestsTestTitle: "Intérêts académiques",
    interestsTestSubtitle: "Évaluez votre intérêt et motivation pour chaque domaine",
    interest: "Intérêt (1-5)",
    motivation: "Motivation (1-5)",
    acceptableByEffort: "Acceptable par effort",
    yes: "Oui",
    no: "Non",
    
    // Career Compatibility
    careerCompatibilityTitle: "Compatibilité avec les métiers",
    careerCompatibilitySubtitle: "Évaluez votre attirance pour différents métiers",
    attraction: "Attirance (1-5)",
    accessible: "Vous semble accessible ?",
    workPreferences: "Préférences de carrière",
    preferredWorkType: "Type de travail préféré",
    mainPriority: "Priorité principale",
    preferredSector: "Secteur préféré",
    
    // Constraints Test
    constraintsTestTitle: "Contraintes et objectifs",
    constraintsTestSubtitle: "Définissez vos contraintes et priorités pour personnaliser les recommandations",
    geographicMobility: "Mobilité géographique",
    changeCity: "Changer de ville ?",
    studyAbroad: "Étudier à l'étranger ?",
    internationalCareer: "Carrière internationale ?",
    financialConstraints: "Contraintes financières",
    annualBudget: "Budget annuel disponible",
    scholarshipEligible: "Éligible aux bourses ?",
    familySupport: "Soutien familial",
    studyPreferences: "Préférences d'études",
    maxLevel: "Niveau maximum souhaité",
    preferredDuration: "Durée d'études préférée",
    studyMode: "Mode d'études",
    careerPriorities: "Priorités de carrière",
    highSalary: "Salaire élevé",
    jobStability: "Stabilité de l'emploi",
    passionForJob: "Passion pour le métier",
    socialPrestige: "Prestige social",
    workLifeBalance: "Équilibre vie-travail",
    
    // Language Test
    languageTestTitle: "Compétences linguistiques",
    languageTestSubtitle: "Évaluez vos compétences dans différentes langues",
    languagePreferences: "Préférences linguistiques",
    preferredTeachingLanguage: "Langue d'enseignement préférée",
    comfortableStudyingIn: "Langues dans lesquelles vous pouvez étudier confortablement",
    willingToImprove: "Langues que vous souhaitez améliorer",
    
    // Report
    orientationReport: "Rapport d'Orientation Personnalisé",
    executiveSummary: "Résumé Exécutif",
    riasecProfile: "Profil RIASEC",
    personalityProfile: "Profil de Personnalité",
    aptitudesPerformances: "Aptitudes et Performances",
    recommendedDomains: "Domaines Académiques Recommandés",
    careersOpportunities: "Métiers et Débouchés",
    recommendedInstitutions: "Établissements Recommandés",
    print: "Imprimer",
    newTest: "Nouveau test",
    
    // Common
    select: "Sélectionner",
    required: "Requis",
    optional: "Optionnel",
    devMode: "Mode Dev",
    fillTestData: "Remplir données test",
    viewReport: "Voir rapport"
  },
  
  ar: {
    // Welcome Screen
    welcomeTitle: "اكتشف توجهك المثالي",
    welcomeSubtitle: "نظام توجيه شامل ومخصص لإرشادك نحو الدراسات والمهنة التي تناسبك حقاً.",
    scientificTests: "اختبارات علمية",
    scientificTestsDesc: "مبني على نموذج RIASEC واختبارات الشخصية المعترف بها",
    completeAnalysis: "تحليل شامل",
    completeAnalysisDesc: "تقييم الاهتمامات والقدرات والشخصية والقيود",
    detailedReport: "تقرير مفصل",
    detailedReportDesc: "توصيات مخصصة للدراسات والمهن",
    estimatedTime: "المدة المقدرة: 25-30 دقيقة",
    estimatedTimeDesc: "خذ وقتك وأجب بصدق للحصول على أفضل النتائج. ستبقى إجاباتك سرية.",
    whatYouDiscover: "ما ستكتشفه:",
    riasecProfile: "ملفك الشخصي RIASEC وأنواع شخصيتك المهيمنة",
    aptitudesPerformances: "قدراتك والمجالات الأكاديمية الموصى بها",
    recommendedDomains: "المهن الأكثر توافقاً مع ملفك الشخصي",
    careersOpportunities: "توصيات المؤسسات والتكوينات",
    startTest: "ابدأ اختبار التوجيه",
    freeConfidentialScientific: "مجاني • سري • مبني على طرق علمية",
    
    // Navigation
    previous: "السابق",
    next: "التالي",
    continue: "متابعة",
    finish: "إنهاء",
    
    // Personal Info
    personalInfoTitle: "أخبرنا عن نفسك",
    personalInfoSubtitle: "ستساعدنا هذه المعلومات في تخصيص توصياتك",
    generalInfo: "معلومات عامة",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    age: "العمر",
    city: "المدينة",
    academicPath: "المسار الأكاديمي",
    bacType: "نوع البكالوريا",
    graduationYear: "سنة الحصول",
    averageGrades: "المعدلات (من 20)",
    mathematics: "الرياضيات",
    sciences: "العلوم",
    french: "الفرنسية",
    languages: "المهارات اللغوية",
    arabic: "العربية",
    english: "الإنجليزية",
    spanish: "الإسبانية",
    level: "المستوى",
    beginner: "مبتدئ",
    intermediate: "متوسط",
    advanced: "متقدم",
    fluent: "طلق",
    native: "أصلي",
    
    // RIASEC Test
    riasecTestTitle: "اختبار RIASEC",
    riasecTestSubtitle: "قيم اهتمامك بأنواع مختلفة من الأنشطة",
    riasecInstruction: "إلى أي مدى أنت مهتم بهذه الأنشطة؟ (1 = لا على الإطلاق، 5 = كثيراً جداً)",
    realistic: "واقعي",
    investigative: "استقصائي",
    artistic: "فني",
    social: "اجتماعي",
    enterprising: "ريادي",
    conventional: "تقليدي",
    
    // Personality Test
    personalityTestTitle: "اختبار الشخصية الأكاديمية",
    personalityTestSubtitle: "اكتشف سمات شخصيتك للدراسات",
    personalityInstruction: "حدد مستوى موافقتك مع كل عبارة (1 = لا أوافق إطلاقاً، 5 = أوافق تماماً)",
    openness: "الانفتاح",
    organization: "التنظيم",
    sociability: "الاجتماعية",
    stressManagement: "إدارة الضغط",
    leadership: "القيادة",
    learningStyle: "أسلوب التعلم المفضل",
    visual: "بصري",
    auditory: "سمعي",
    kinesthetic: "حركي",
    readingWriting: "قراءة-كتابة",
    
    // Aptitude Test
    aptitudeTestTitle: "اختبار القدرات",
    aptitudeTestSubtitle: "قيم قدراتك في التفكير",
    logicalReasoning: "التفكير المنطقي",
    verbalComprehension: "الفهم اللفظي",
    spatialReasoning: "التفكير المكاني",
    timeLimit: "وقت محدود",
    startTest: "ابدأ الاختبار",
    question: "سؤال",
    
    // Interests Test
    interestsTestTitle: "الاهتمامات الأكاديمية",
    interestsTestSubtitle: "قيم اهتمامك ودافعيتك لكل مجال",
    interest: "الاهتمام (1-5)",
    motivation: "الدافعية (1-5)",
    acceptableByEffort: "مقبول بالجهد",
    yes: "نعم",
    no: "لا",
    
    // Career Compatibility
    careerCompatibilityTitle: "التوافق مع المهن",
    careerCompatibilitySubtitle: "قيم انجذابك لمهن مختلفة",
    attraction: "الانجذاب (1-5)",
    accessible: "يبدو لك متاحاً؟",
    workPreferences: "تفضيلات المهنة",
    preferredWorkType: "نوع العمل المفضل",
    mainPriority: "الأولوية الرئيسية",
    preferredSector: "القطاع المفضل",
    
    // Constraints Test
    constraintsTestTitle: "القيود والأهداف",
    constraintsTestSubtitle: "حدد قيودك وأولوياتك لتخصيص التوصيات",
    geographicMobility: "التنقل الجغرافي",
    changeCity: "تغيير المدينة؟",
    studyAbroad: "الدراسة في الخارج؟",
    internationalCareer: "مهنة دولية؟",
    financialConstraints: "القيود المالية",
    annualBudget: "الميزانية السنوية المتاحة",
    scholarshipEligible: "مؤهل للمنح؟",
    familySupport: "الدعم العائلي",
    studyPreferences: "تفضيلات الدراسة",
    maxLevel: "أقصى مستوى مرغوب",
    preferredDuration: "مدة الدراسة المفضلة",
    studyMode: "نمط الدراسة",
    careerPriorities: "أولويات المهنة",
    highSalary: "راتب عالي",
    jobStability: "استقرار الوظيفة",
    passionForJob: "شغف بالمهنة",
    socialPrestige: "المكانة الاجتماعية",
    workLifeBalance: "توازن العمل والحياة",
    
    // Language Test
    languageTestTitle: "المهارات اللغوية",
    languageTestSubtitle: "قيم مهاراتك في لغات مختلفة",
    languagePreferences: "التفضيلات اللغوية",
    preferredTeachingLanguage: "لغة التدريس المفضلة",
    comfortableStudyingIn: "اللغات التي يمكنك الدراسة بها براحة",
    willingToImprove: "اللغات التي تريد تحسينها",
    
    // Report
    orientationReport: "تقرير التوجيه المخصص",
    executiveSummary: "الملخص التنفيذي",
    riasecProfile: "الملف الشخصي RIASEC",
    personalityProfile: "ملف الشخصية",
    aptitudesPerformances: "القدرات والأداء",
    recommendedDomains: "المجالات الأكاديمية الموصى بها",
    careersOpportunities: "المهن والفرص",
    recommendedInstitutions: "المؤسسات الموصى بها",
    print: "طباعة",
    newTest: "اختبار جديد",
    
    // Common
    select: "اختر",
    required: "مطلوب",
    optional: "اختياري",
    devMode: "وضع التطوير",
    fillTestData: "ملء بيانات الاختبار",
    viewReport: "عرض التقرير"
  },
  
  en: {
    // Welcome Screen
    welcomeTitle: "Discover Your Ideal Path",
    welcomeSubtitle: "A comprehensive and personalized guidance system to guide you towards the studies and career that truly suit you.",
    scientificTests: "Scientific Tests",
    scientificTestsDesc: "Based on the RIASEC model and recognized personality tests",
    completeAnalysis: "Complete Analysis",
    completeAnalysisDesc: "Assessment of interests, aptitudes, personality and constraints",
    detailedReport: "Detailed Report",
    detailedReportDesc: "Personalized study and career recommendations",
    estimatedTime: "Estimated time: 25-30 minutes",
    estimatedTimeDesc: "Take your time and answer honestly to get the best results. Your answers will remain confidential.",
    whatYouDiscover: "What you will discover:",
    riasecProfile: "Your RIASEC profile and dominant personality types",
    aptitudesPerformances: "Your aptitudes and recommended academic domains",
    recommendedDomains: "Careers most compatible with your profile",
    careersOpportunities: "Institution and training recommendations",
    startTest: "Start my orientation test",
    freeConfidentialScientific: "Free • Confidential • Based on scientific methods",
    
    // Navigation
    previous: "Previous",
    next: "Next",
    continue: "Continue",
    finish: "Finish",
    
    // Personal Info
    personalInfoTitle: "Tell us about yourself",
    personalInfoSubtitle: "This information will help us personalize your recommendations",
    generalInfo: "General information",
    firstName: "First Name",
    lastName: "Last Name",
    age: "Age",
    city: "City",
    academicPath: "Academic path",
    bacType: "Baccalaureate Type",
    graduationYear: "Graduation Year",
    averageGrades: "Average grades (out of 20)",
    mathematics: "Mathematics",
    sciences: "Sciences",
    french: "French",
    languages: "Language skills",
    arabic: "Arabic",
    english: "English",
    spanish: "Spanish",
    level: "Level",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    fluent: "Fluent",
    native: "Native",
    
    // RIASEC Test
    riasecTestTitle: "RIASEC Test",
    riasecTestSubtitle: "Assess your interest in different types of activities",
    riasecInstruction: "How interested are you in these activities? (1 = Not at all, 5 = Very much)",
    realistic: "Realistic",
    investigative: "Investigative",
    artistic: "Artistic",
    social: "Social",
    enterprising: "Enterprising",
    conventional: "Conventional",
    
    // Personality Test
    personalityTestTitle: "Academic Personality Test",
    personalityTestSubtitle: "Discover your personality traits for studies",
    personalityInstruction: "Indicate your level of agreement with each statement (1 = Strongly disagree, 5 = Strongly agree)",
    openness: "Openness",
    organization: "Organization",
    sociability: "Sociability",
    stressManagement: "Stress Management",
    leadership: "Leadership",
    learningStyle: "Preferred learning style",
    visual: "Visual",
    auditory: "Auditory",
    kinesthetic: "Kinesthetic",
    readingWriting: "Reading-writing",
    
    // Aptitude Test
    aptitudeTestTitle: "Aptitude Test",
    aptitudeTestSubtitle: "Assess your reasoning abilities",
    logicalReasoning: "Logical reasoning",
    verbalComprehension: "Verbal comprehension",
    spatialReasoning: "Spatial reasoning",
    timeLimit: "Time limit",
    startTest: "Start test",
    question: "Question",
    
    // Interests Test
    interestsTestTitle: "Academic Interests",
    interestsTestSubtitle: "Assess your interest and motivation for each domain",
    interest: "Interest (1-5)",
    motivation: "Motivation (1-5)",
    acceptableByEffort: "Acceptable by effort",
    yes: "Yes",
    no: "No",
    
    // Career Compatibility
    careerCompatibilityTitle: "Career Compatibility",
    careerCompatibilitySubtitle: "Assess your attraction to different careers",
    attraction: "Attraction (1-5)",
    accessible: "Seems accessible to you?",
    workPreferences: "Career preferences",
    preferredWorkType: "Preferred work type",
    mainPriority: "Main priority",
    preferredSector: "Preferred sector",
    
    // Constraints Test
    constraintsTestTitle: "Constraints and Objectives",
    constraintsTestSubtitle: "Define your constraints and priorities to personalize recommendations",
    geographicMobility: "Geographic mobility",
    changeCity: "Change city?",
    studyAbroad: "Study abroad?",
    internationalCareer: "International career?",
    financialConstraints: "Financial constraints",
    annualBudget: "Available annual budget",
    scholarshipEligible: "Eligible for scholarships?",
    familySupport: "Family support",
    studyPreferences: "Study preferences",
    maxLevel: "Desired maximum level",
    preferredDuration: "Preferred study duration",
    studyMode: "Study mode",
    careerPriorities: "Career priorities",
    highSalary: "High salary",
    jobStability: "Job stability",
    passionForJob: "Passion for the job",
    socialPrestige: "Social prestige",
    workLifeBalance: "Work-life balance",
    
    // Language Test
    languageTestTitle: "Language Skills",
    languageTestSubtitle: "Assess your skills in different languages",
    languagePreferences: "Language preferences",
    preferredTeachingLanguage: "Preferred teaching language",
    comfortableStudyingIn: "Languages you can study comfortably in",
    willingToImprove: "Languages you want to improve",
    
    // Report
    orientationReport: "Personalized Orientation Report",
    executiveSummary: "Executive Summary",
    riasecProfile: "RIASEC Profile",
    personalityProfile: "Personality Profile",
    aptitudesPerformances: "Aptitudes and Performance",
    recommendedDomains: "Recommended Academic Domains",
    careersOpportunities: "Careers and Opportunities",
    recommendedInstitutions: "Recommended Institutions",
    print: "Print",
    newTest: "New test",
    
    // Common
    select: "Select",
    required: "Required",
    optional: "Optional",
    devMode: "Dev Mode",
    fillTestData: "Fill test data",
    viewReport: "View report"
  }
};

export const useTranslation = (language: string) => {
  return translations[language] || translations.fr;
};