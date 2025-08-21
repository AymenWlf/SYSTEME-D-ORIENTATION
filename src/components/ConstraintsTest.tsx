import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';
// Ajouter ces imports en haut du fichier
import { Loader2Icon, CheckIcon } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { getAuthToken } from '../utils/auth';

interface ConstraintsTestProps {
  onComplete: (data: any) => void;
  onPrevious: () => void;
  canGoBack: boolean;
  language: string;
  sessionData?: any; // Ajouter cette ligne
}

interface ConstraintResponse {
  constraintId: string;
  constraintType: 'mobility' | 'budget' | 'education' | 'priority';
  constraintCategory: string;
  questionText: string;
  selectedValue: string | number;
  responseTime: number;
  timestamp: Date;
  constraintIndex: number;
}

const translations = {
  fr: {
    testTitle: "Contraintes et objectifs",
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
    fullTime: "Temps plein uniquement",
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
    continue: "Continuer"
  },
  ar: {
    testTitle: "القيود والأهداف",
    testSubtitle: "حدد قيودك وأولوياتك لتخصيص التوصيات",
    geographicMobility: "الحركية الجغرافية",
    changeCity: "تغيير المدينة؟",
    studyAbroad: "الدراسة في الخارج؟",
    internationalCareer: "مهنة دولية؟",
    select: "اختر",
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
    yes: "نعم",
    no: "لا",
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
    fullTime: "وقت كامل فقط",
    partTime: "وقت جزئي ممكن",
    alternance: "تناوب مفضل",
    distance: "تكوين عن بُعد",
    // Career priorities
    careerPriorities: "أولويات المهنة",
    prioritiesInstruction: "صنف أهمية كل معيار (1 = أقل أهمية، 5 = مهم جداً)",
    highSalary: "راتب عالي",
    jobStability: "استقرار الوظيفة",
    careerPassion: "شغف بالمهنة",
    socialPrestige: "مكانة اجتماعية",
    workLifeBalance: "توازن بين العمل والحياة",
    attractiveRemuneration: "أجر جذاب",
    professionalSecurity: "أمان مهني",
    personalFulfillment: "تحقق شخصي",
    socialRecognition: "اعتراف اجتماعي",
    personalTime: "وقت للحياة الشخصية",
    previous: "السابق",
    continue: "متابعة"
  }
};

// Les valeurs des inputs et des scores sont alignées avec les clés de traduction
const constraintsOptions = {
  mobility: {
    city: [
      { value: "stayInCity", label: "stayInCity" },
      { value: "stayInRegion", label: "stayInRegion" },
      { value: "stayInCountry", label: "stayInCountry" }
    ],
    country: [
      { value: "onlyMorocco", label: "onlyMorocco" },
      { value: "onlyFrance", label: "onlyFrance" },
      { value: "europe", label: "europe" },
      { value: "anywhere", label: "anywhere" }
    ],
    international: [
      { value: "careerMorocco", label: "careerMorocco" },
      { value: "maybe", label: "maybe" },
      { value: "yesInternational", label: "yesInternational" }
    ]
  },
  budget: {
    annualBudget: [
      { value: "budgetLow", label: "budgetLow" },
      { value: "budgetMedium", label: "budgetMedium" },
      { value: "budgetHigh", label: "budgetHigh" },
      { value: "budgetVeryHigh", label: "budgetVeryHigh" }
    ],
    scholarshipEligible: [
      { value: "yes", label: "yes" },
      { value: "no", label: "no" },
      { value: "unsure", label: "unsure" }
    ],
    familySupport: [
      { value: "supportFull", label: "supportFull" },
      { value: "supportPartial", label: "supportPartial" },
      { value: "supportMoral", label: "supportMoral" },
      { value: "supportNone", label: "supportNone" }
    ]
  },
  education: {
    maxLevel: [
      { value: "bacPlus2", label: "bacPlus2" },
      { value: "bacPlus3", label: "bacPlus3" },
      { value: "bacPlus5", label: "bacPlus5" },
      { value: "bacPlus8", label: "bacPlus8" }
    ],
    preferredDuration: [
      { value: "durationShort", label: "durationShort" },
      { value: "durationMedium", label: "durationMedium" },
      { value: "durationLong", label: "durationLong" }
    ],
    studyMode: [
      { value: "fullTime", label: "fullTime" },
      { value: "partTime", label: "partTime" },
      { value: "alternance", label: "alternance" },
      { value: "distance", label: "distance" }
    ]
  }
};

const prioritiesList = [
  { key: "salary", label: "highSalary", description: "attractiveRemuneration" },
  { key: "stability", label: "jobStability", description: "professionalSecurity" },
  { key: "passion", label: "careerPassion", description: "personalFulfillment" },
  { key: "prestige", label: "socialPrestige", description: "socialRecognition" },
  { key: "workLife", label: "workLifeBalance", description: "personalTime" }
];

const ConstraintsTest: React.FC<ConstraintsTestProps> = ({ onComplete, onPrevious, canGoBack, language = 'fr', sessionData }) => {
  const [constraints, setConstraints] = useState({
    mobility: {
      city: '',
      country: '',
      international: ''
    },
    budget: {
      annualBudget: '',
      scholarshipEligible: '',
      familySupport: ''
    },
    education: {
      maxLevel: '',
      preferredDuration: '',
      studyMode: ''
    },
    priorities: {
      salary: 1,
      stability: 1,
      passion: 1,
      prestige: 1,
      workLife: 1
    }
  });

  // Nouvelles states pour capturer les détails
  const [detailedResponses, setDetailedResponses] = useState<Record<string, ConstraintResponse>>({});
  const [currentConstraintStartTime, setCurrentConstraintStartTime] = useState<Record<string, number>>({});
  const [sessionStartTime] = useState(Date.now());

  const t = translations[language as 'fr' | 'ar'] || translations.fr;

  // Nouveaux états pour l'intégration avec le backend
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Récupérer le token d'authentification
  const token = getAuthToken();

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = !!token;




  // Ajouter un useEffect pour récupérer les données
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        // Si des données de session sont fournies directement, les utiliser
        if (sessionData && sessionData.currentStep && sessionData.currentStep.constraints) {
          console.log("Données de contraintes trouvées dans la session:", sessionData.currentStep.constraints);
          const constraintsData = sessionData.currentStep.constraints.constraints || {};

          // Restaurer les contraintes si elles existent
          if (constraintsData.mobility) {
            console.log("Restauration des contraintes de mobilité:", constraintsData.mobility);
            setConstraints(prev => ({
              ...prev,
              mobility: constraintsData.mobility
            }));
          }

          // Restaurer les contraintes budgétaires
          if (constraintsData.budget) {
            console.log("Restauration des contraintes budgétaires:", constraintsData.budget);
            setConstraints(prev => ({
              ...prev,
              budget: constraintsData.budget
            }));
          }

          // Restaurer les préférences d'éducation
          if (constraintsData.education) {
            console.log("Restauration des préférences d'éducation:", constraintsData.education);
            setConstraints(prev => ({
              ...prev,
              education: constraintsData.education
            }));
          }

          // Restaurer les priorités
          if (constraintsData.priorities) {
            console.log("Restauration des priorités:", constraintsData.priorities);
            setConstraints(prev => ({
              ...prev,
              priorities: constraintsData.priorities
            }));
          }

          // Restaurer les réponses détaillées si elles existent
          if (constraintsData.detailedResponses) {
            console.log("Restauration des réponses détaillées:", constraintsData.detailedResponses);
            setDetailedResponses(constraintsData.detailedResponses);
          }

          setDataLoaded(true);
          setIsLoading(false);
          return;
        }

        // Sinon, récupérer les données depuis l'API
        console.log("Récupération des données de contraintes depuis l'API");
        const response = await axios.get(`${API_BASE_URL}/orientation-test/my-test`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success && response.data.hasTest) {
          console.log("Données de test récupérées avec succès:", response.data);
          // Extraire les données de contraintes si elles existent
          const testData = response.data.data;
          if (testData.currentStep && testData.currentStep.constraints) {
            console.log("Données de contraintes trouvées dans la réponse API:", testData.currentStep.constraints);
            const constraintsData = testData.currentStep.constraints.constraints || {};

            // Restaurer les contraintes si elles existent
            if (constraintsData.mobility) {
              console.log("Restauration des contraintes de mobilité depuis l'API:", constraintsData.mobility);
              setConstraints(prev => ({
                ...prev,
                mobility: constraintsData.mobility
              }));
            }

            // Restaurer les contraintes budgétaires
            if (constraintsData.budget) {
              console.log("Restauration des contraintes budgétaires depuis l'API:", constraintsData.budget);
              setConstraints(prev => ({
                ...prev,
                budget: constraintsData.budget
              }));
            }

            // Restaurer les préférences d'éducation
            if (constraintsData.education) {
              console.log("Restauration des préférences d'éducation depuis l'API:", constraintsData.education);
              setConstraints(prev => ({
                ...prev,
                education: constraintsData.education
              }));
            }

            // Restaurer les priorités
            if (constraintsData.priorities) {
              console.log("Restauration des priorités depuis l'API:", constraintsData.priorities);
              setConstraints(prev => ({
                ...prev,
                priorities: constraintsData.priorities
              }));
            }

            // Restaurer les réponses détaillées si elles existent
            if (constraintsData.detailedResponses) {
              console.log("Restauration des réponses détaillées depuis l'API:", constraintsData.detailedResponses);
              setDetailedResponses(constraintsData.detailedResponses);
            }

            setDataLoaded(true);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données de contraintes:", err);
        // Ne pas afficher d'erreur à l'utilisateur, simplement continuer avec le formulaire vide
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, token, sessionData, language]);


  // Fonction pour envoyer les données au backend
  const submitTestData = async (completionData: any) => {
    if (!isAuthenticated) {
      setError(language === 'ar'
        ? 'يجب عليك تسجيل الدخول لإكمال الاختبار'
        : 'Vous devez être connecté pour compléter le test');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Soumission des données de contraintes au backend:", completionData);

      // Préparer les données à envoyer
      const constraintsData = {
        stepName: 'constraints',
        stepData: {
          constraints: completionData,
          timestamp: new Date().toISOString()
        },
        stepNumber: 6, // Supposons que c'est la 6ème étape
        duration: completionData.sessionDuration || 0,
        isCompleted: true
      };

      // Envoyer les données à l'API
      const response = await axios.post(
        `${API_BASE_URL}/orientation-test/save-step`,
        constraintsData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        console.log('Test de contraintes enregistré avec succès', response.data);

        // Appeler onComplete pour passer à l'étape suivante
        onComplete({
          ...completionData,
          sessionData: response.data
        });
      } else {
        // Gérer le cas où l'API retourne success: false
        setError(response.data.message || (language === 'ar'
          ? 'حدث خطأ أثناء حفظ اختبار القيود'
          : 'Une erreur est survenue lors de l\'enregistrement du test de contraintes'));
      }
    } catch (err) {
      console.error('Erreur lors de la soumission du test de contraintes', err);

      // Gestion des erreurs
      if (axios.isAxiosError(err)) {
        // Erreur d'authentification
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
      setIsSubmitting(false);
    }
  };

  const captureConstraintResponse = (
    constraintType: 'mobility' | 'budget' | 'education' | 'priority',
    field: string,
    questionText: string,
    selectedValue: string | number,
    constraintIndex: number
  ) => {
    const constraintKey = `${constraintType}_${field}`;
    const responseTime = Date.now() - (currentConstraintStartTime[constraintKey] || Date.now());
    const constraintId = `${constraintType}_${constraintIndex}`;

    const response: ConstraintResponse = {
      constraintId,
      constraintType,
      constraintCategory: field,
      questionText,
      selectedValue,
      responseTime,
      timestamp: new Date(),
      constraintIndex
    };

    setDetailedResponses(prev => ({
      ...prev,
      [constraintKey]: response
    }));

    console.log(`🎯 Constraint Response Captured:`, {
      constraintType,
      field,
      selectedValue,
      responseTime: `${responseTime}ms`
    });

    // Reset timer pour cette contrainte
    setCurrentConstraintStartTime(prev => ({
      ...prev,
      [constraintKey]: Date.now()
    }));
  };

  const handleConstraintChange = (category: string, field: string, value: string) => {
    setConstraints(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev] as any,
        [field]: value
      }
    }));

    // Mapper les champs aux clés de traduction correctes
    const fieldToTranslationKey: Record<string, string> = {
      city: 'changeCity',
      country: 'studyAbroad',
      international: 'internationalCareer',
      annualBudget: 'availableBudget',
      scholarshipEligible: 'scholarshipEligible',
      familySupport: 'familySupport',
      maxLevel: 'maxLevel',
      preferredDuration: 'preferredDuration',
      studyMode: 'studyMode'
    };

    // Utiliser la bonne clé de traduction pour ce champ
    const translationKey = fieldToTranslationKey[field] || field;
    const questionText = t[translationKey] || field;

    const constraintIndex = Object.keys(constraints[category as keyof typeof constraints] as object).indexOf(field);

    captureConstraintResponse(
      category as 'mobility' | 'budget' | 'education',
      field,
      questionText,
      value,
      constraintIndex
    );
  };

  const handlePriorityChange = (priority: string, value: number) => {
    setConstraints(prev => ({
      ...prev,
      priorities: {
        ...prev.priorities,
        [priority]: value
      }
    }));

    const questionText = t[priority];
    const constraintIndex = Object.keys(constraints.priorities).indexOf(priority);

    captureConstraintResponse(
      'priority',
      priority,
      questionText,
      value,
      constraintIndex
    );
  };

  const handleSubmit = () => {
    console.group('🎯 Constraints Test Completion');
    console.log('Calculating comprehensive constraints and priorities analysis...');

    // Calculate priority scores
    const maxPriority = Math.max(...Object.values(constraints.priorities));
    const priorityScores = Object.entries(constraints.priorities).reduce((acc, [key, value]) => {
      acc[key] = Math.round((value / maxPriority) * 100);
      return acc;
    }, {} as Record<string, number>);

    // Calculer les statistiques détaillées
    const responseStats = Object.values(detailedResponses);
    const completedResponses = responseStats.filter(r => r.selectedValue !== '' && r.selectedValue !== 1);

    // Statistiques temporelles par type de contrainte
    const constraintTypeStats = ['mobility', 'budget', 'education', 'priority'].map(type => {
      const typeResponses = responseStats.filter(r => r.constraintType === type);
      const responseTimes = typeResponses.map(r => r.responseTime);

      return {
        constraintType: type,
        responsesCount: typeResponses.length,
        avgResponseTime: responseTimes.length > 0
          ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length)
          : 0,
        completionRate: Math.round((typeResponses.filter(r => r.selectedValue !== '' && r.selectedValue !== 1).length / typeResponses.length) * 100)
      };
    });

    // Temps de réponse global
    const allResponseTimes = responseStats.map(r => r.responseTime);
    const avgResponseTime = allResponseTimes.length > 0
      ? Math.round(allResponseTimes.reduce((sum, time) => sum + time, 0) / allResponseTimes.length)
      : 0;

    // Analyser le profil de contraintes
    const mobilityProfile = {
      geographic: constraints.mobility.city,
      studyAbroad: constraints.mobility.country,
      international: constraints.mobility.international,
      flexibilityScore: calculateMobilityFlexibility()
    };

    const budgetProfile = {
      budgetLevel: constraints.budget.annualBudget,
      scholarshipStatus: constraints.budget.scholarshipEligible,
      familySupport: constraints.budget.familySupport,
      financialAutonomy: calculateFinancialAutonomy()
    };

    const educationProfile = {
      ambitionLevel: constraints.education.maxLevel,
      timeCommitment: constraints.education.preferredDuration,
      studyStyle: constraints.education.studyMode,
      academicAmbition: calculateAcademicAmbition()
    };

    // Créer la session
    const session = {
      testType: 'constraints',
      startedAt: new Date(sessionStartTime),
      completedAt: new Date(),
      duration: Date.now() - sessionStartTime,
      language: language as 'fr' | 'ar',
      totalQuestions: 14, // 3 mobilité + 3 budget + 3 éducation + 5 priorités
      questions: responseStats.map(response => ({
        questionId: response.constraintId,
        questionText: response.questionText,
        userAnswer: response.selectedValue,
        responseTime: response.responseTime,
        timestamp: response.timestamp
      }))
    };

    // Identifier les priorités dominantes
    const topPriorities = Object.entries(constraints.priorities)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([key, value]) => ({ priority: key, score: value, percentage: priorityScores[key] }));

    console.log('Final Constraint Analysis:', {
      mobilityFlexibility: mobilityProfile.flexibilityScore,
      financialAutonomy: budgetProfile.financialAutonomy,
      academicAmbition: educationProfile.academicAmbition,
      topPriorities: topPriorities.map(p => `${p.priority}: ${p.score}/5`)
    });

    console.log('Response Statistics:', {
      avgResponseTime,
      fastestCategory: constraintTypeStats.reduce((min, cat) =>
        cat.avgResponseTime < min.avgResponseTime ? cat : min),
      sessionDuration: Date.now() - sessionStartTime
    });
    console.groupEnd();

    const completionData = {
      ...constraints,
      priorityScores,
      // Nouvelles données détaillées
      session,
      detailedResponses,
      constraintTypeStats,
      avgResponseTime,
      sessionDuration: Date.now() - sessionStartTime,
      completedAt: new Date(),
      // Profils analysés
      mobilityProfile,
      budgetProfile,
      educationProfile,
      topPriorities,
      // Analyse comportementale
      behavioralAnalysis: {
        decisionSpeed: avgResponseTime < 3000 ? 'fast' : avgResponseTime > 7000 ? 'reflective' : 'moderate',
        mobilityFlexibility: mobilityProfile.flexibilityScore,
        financialRealism: budgetProfile.financialAutonomy,
        academicAmbition: educationProfile.academicAmbition,
        priorityClarityScore: Math.round((Math.max(...Object.values(constraints.priorities)) / Math.min(...Object.values(constraints.priorities))) * 20),
        constraintProfile: categorizeConstraintProfile()
      }
    };

    submitTestData(completionData);
  };

  // --- Fonctions d'analyse adaptées ---
  const calculateMobilityFlexibility = (): number => {
    const mobilityScores: Record<string, number> = {
      stayInCity: 0, stayInRegion: 30, stayInCountry: 70,
      onlyMorocco: 0, onlyFrance: 50, europe: 70, anywhere: 100,
      careerMorocco: 0, maybe: 50, yesInternational: 100
    };

    const cityScore = mobilityScores[constraints.mobility.city] || 0;
    const countryScore = mobilityScores[constraints.mobility.country] || 0;
    const internationalScore = mobilityScores[constraints.mobility.international] || 0;

    return Math.round((cityScore + countryScore + internationalScore) / 3);
  };

  const calculateFinancialAutonomy = (): number => {
    const budgetScores: Record<string, number> = {
      budgetLow: 20, budgetMedium: 40, budgetHigh: 70, budgetVeryHigh: 100
    };
    const scholarshipScores: Record<string, number> = {
      yes: 30, no: 0, unsure: 15
    };
    const supportScores: Record<string, number> = {
      supportFull: 100, supportPartial: 60, supportMoral: 30, supportNone: 0
    };

    const budgetScore = budgetScores[constraints.budget.annualBudget] || 0;
    const scholarshipBonus = scholarshipScores[constraints.budget.scholarshipEligible] || 0;
    const supportScore = supportScores[constraints.budget.familySupport] || 0;

    return Math.round((budgetScore + scholarshipBonus + supportScore) / 2.3);
  };

  const calculateAcademicAmbition = (): number => {
    const levelScores: Record<string, number> = {
      bacPlus2: 40, bacPlus3: 60, bacPlus5: 80, bacPlus8: 100
    };
    const durationScores: Record<string, number> = {
      durationShort: 40, durationMedium: 70, durationLong: 100
    };

    const levelScore = levelScores[constraints.education.maxLevel] || 0;
    const durationScore = durationScores[constraints.education.preferredDuration] || 0;

    return Math.round((levelScore + durationScore) / 2);
  };

  const categorizeConstraintProfile = (): string => {
    const mobility = calculateMobilityFlexibility();
    const budget = calculateFinancialAutonomy();
    const ambition = calculateAcademicAmbition();

    if (mobility > 70 && budget > 70 && ambition > 70) return 'ambitious_international';
    if (mobility < 30 && budget < 30) return 'local_budget_conscious';
    if (ambition > 80) return 'academically_ambitious';
    if (mobility > 70) return 'internationally_minded';
    if (budget > 80) return 'financially_flexible';
    return 'balanced_profile';
  };

  const isComplete = constraints.mobility.city &&
    constraints.budget.annualBudget &&
    constraints.education.maxLevel;

  // Calculer les statistiques de progression
  const getCompletionStats = () => {
    const totalBasicConstraints = 9; // 3 + 3 + 3
    const totalPriorities = 5;

    const basicCompleted = [
      constraints.mobility.city, constraints.mobility.country, constraints.mobility.international,
      constraints.budget.annualBudget, constraints.budget.scholarshipEligible, constraints.budget.familySupport,
      constraints.education.maxLevel, constraints.education.preferredDuration, constraints.education.studyMode
    ].filter(Boolean).length;

    const prioritiesSet = Object.values(constraints.priorities).filter(p => p > 1).length;

    return {
      basicCompleted,
      totalBasicConstraints,
      prioritiesSet,
      totalPriorities,
      overallCompletion: Math.round(((basicCompleted + prioritiesSet) / (totalBasicConstraints + totalPriorities)) * 100)
    };
  };

  const completionStats = getCompletionStats();

  // Si le chargement est en cours, afficher un indicateur
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2Icon className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-600">
          {language === 'ar'
            ? 'جاري تحميل اختبار القيود والأهداف...'
            : 'Chargement du test de contraintes et objectifs...'}
        </p>
      </div>
    );
  }

  // Afficher un message d'erreur si nécessaire
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
        <p className="font-medium">{error}</p>
        <button
          onClick={() => setError(null)}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
        >
          {language === 'ar' ? 'حاول مرة أخرى' : 'Réessayer'}
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{t.testTitle}</h2>
        <p className="text-gray-600">{t.testSubtitle}</p>

        {dataLoaded && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mt-4">
            <div className="flex items-center space-x-2">
              <CheckIcon className="w-5 h-5" />
              <p>
                {language === 'ar'
                  ? 'تم تحميل إجاباتك السابقة. يمكنك متابعة الاختبار من حيث توقفت.'
                  : 'Vos réponses précédentes ont été chargées. Vous pouvez continuer le test là où vous vous étiez arrêté.'}
              </p>
            </div>
          </div>
        )}

        {/* Bouton pour tout préremplir */}
        <button
          type="button"
          className="mt-6 mb-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition"

          onClick={() => {
            // Préremplir toutes les contraintes avec des valeurs par défaut
            setConstraints({
              mobility: {
                city: "stayInCountry",
                country: "anywhere",
                international: "yesInternational"
              },
              budget: {
                annualBudget: "budgetVeryHigh",
                scholarshipEligible: "yes",
                familySupport: "supportFull"
              },
              education: {
                maxLevel: "bacPlus8",
                preferredDuration: "durationLong",
                studyMode: "fullTime"
              },
              priorities: {
                salary: 5,
                stability: 5,
                passion: 5,
                prestige: 5,
                workLife: 5
              }
            });

            // Mettre à jour les détails de réponse avec les bonnes valeurs
            [
              // Mobilité
              { type: 'mobility', field: 'city', question: t.changeCity, value: "stayInCountry", idx: 0 },
              { type: 'mobility', field: 'country', question: t.studyAbroad, value: "anywhere", idx: 1 },
              { type: 'mobility', field: 'international', question: t.internationalCareer, value: "yesInternational", idx: 2 },
              // Budget
              { type: 'budget', field: 'annualBudget', question: t.availableBudget, value: "budgetVeryHigh", idx: 0 },
              { type: 'budget', field: 'scholarshipEligible', question: t.scholarshipEligible, value: "yes", idx: 1 },
              { type: 'budget', field: 'familySupport', question: t.familySupport, value: "supportFull", idx: 2 },
              // Education
              { type: 'education', field: 'maxLevel', question: t.maxLevel, value: "bacPlus8", idx: 0 },
              { type: 'education', field: 'preferredDuration', question: t.preferredDuration, value: "durationLong", idx: 1 },
              { type: 'education', field: 'studyMode', question: t.studyMode, value: "fullTime", idx: 2 },
              // ... le reste reste inchangé
            ].forEach(({ type, field, question, value, idx }) => {
              captureConstraintResponse(
                type as 'mobility' | 'budget' | 'education' | 'priority',
                field,
                question,
                value,
                idx
              );
            });
          }}
        >
          {language === 'ar' ? "تعبئة جميع الإجابات تلقائياً" : "Tout préremplir"}
        </button>

        {/* Progress Statistics */}
        {completionStats.basicCompleted > 0 && (
          <div className="bg-blue-50 rounded-lg p-3 mt-4">
            <div className={`text-sm text-blue-700 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {language === 'ar'
                ? `التقدم: ${completionStats.overallCompletion}% - القيود: ${completionStats.basicCompleted}/${completionStats.totalBasicConstraints}, الأولويات: ${completionStats.prioritiesSet}/${completionStats.totalPriorities}`
                : `Progression: ${completionStats.overallCompletion}% - Contraintes: ${completionStats.basicCompleted}/${completionStats.totalBasicConstraints}, Priorités: ${completionStats.prioritiesSet}/${completionStats.totalPriorities}`
              }
              {Object.values(detailedResponses).length > 0 && (
                <span className="ml-4">
                  {language === 'ar'
                    ? `متوسط الوقت: ${Math.round(Object.values(detailedResponses).map(r => r.responseTime).reduce((sum, time) => sum + time, 0) / Object.values(detailedResponses).length / 1000)}ث`
                    : `Temps moyen: ${Math.round(Object.values(detailedResponses).map(r => r.responseTime).reduce((sum, time) => sum + time, 0) / Object.values(detailedResponses).length / 1000)}s`
                  }
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobility Constraints */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900">{t.geographicMobility}</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.changeCity}</label>
            <select
              value={constraints.mobility.city}
              onChange={e => handleConstraintChange('mobility', 'city', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t.select}</option>
              {constraintsOptions.mobility.city.map(opt => (
                <option key={opt.value} value={opt.value}>{t[opt.label]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.studyAbroad}</label>
            <select
              value={constraints.mobility.country}
              onChange={e => handleConstraintChange('mobility', 'country', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t.select}</option>
              {constraintsOptions.mobility.country.map(opt => (
                <option key={opt.value} value={opt.value}>{t[opt.label]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.internationalCareer}</label>
            <select
              value={constraints.mobility.international}
              onChange={e => handleConstraintChange('mobility', 'international', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t.select}</option>
              {constraintsOptions.mobility.international.map(opt => (
                <option key={opt.value} value={opt.value}>{t[opt.label]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Budget Constraints */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900">{t.financialConstraints}</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.availableBudget}</label>
            <select
              value={constraints.budget.annualBudget}
              onChange={e => handleConstraintChange('budget', 'annualBudget', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t.select}</option>
              {constraintsOptions.budget.annualBudget.map(opt => (
                <option key={opt.value} value={opt.value}>{t[opt.label]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.scholarshipEligible}</label>
            <select
              value={constraints.budget.scholarshipEligible}
              onChange={e => handleConstraintChange('budget', 'scholarshipEligible', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t.select}</option>
              {constraintsOptions.budget.scholarshipEligible.map(opt => (
                <option key={opt.value} value={opt.value}>{t[opt.label]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.familySupport}</label>
            <select
              value={constraints.budget.familySupport}
              onChange={e => handleConstraintChange('budget', 'familySupport', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t.select}</option>
              {constraintsOptions.budget.familySupport.map(opt => (
                <option key={opt.value} value={opt.value}>{t[opt.label]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Education Preferences */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900">{t.studyPreferences}</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.maxLevel}</label>
            <select
              value={constraints.education.maxLevel}
              onChange={e => handleConstraintChange('education', 'maxLevel', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t.select}</option>
              {constraintsOptions.education.maxLevel.map(opt => (
                <option key={opt.value} value={opt.value}>{t[opt.label]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.preferredDuration}</label>
            <select
              value={constraints.education.preferredDuration}
              onChange={e => handleConstraintChange('education', 'preferredDuration', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t.select}</option>
              {constraintsOptions.education.preferredDuration.map(opt => (
                <option key={opt.value} value={opt.value}>{t[opt.label]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.studyMode}</label>
            <select
              value={constraints.education.studyMode}
              onChange={e => handleConstraintChange('education', 'studyMode', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t.select}</option>
              {constraintsOptions.education.studyMode.map(opt => (
                <option key={opt.value} value={opt.value}>{t[opt.label]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Priorities */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900">{t.careerPriorities}</h3>
        <p className="text-gray-600 mb-4">{t.prioritiesInstruction}</p>
        <div className="space-y-4">
          {prioritiesList.map(({ key, label, description }) => (
            <div key={key} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{t[label]}</h4>
                    <span className="text-xs text-orange-600 font-medium">
                      {constraints.priorities[key]}/5
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{t[description]}</p>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(value => (
                    <button
                      key={value}
                      onClick={() => handlePriorityChange(key, value)}
                      className={`w-8 h-8 rounded-full border-2 text-sm font-medium transition-all ${constraints.priorities[key] === value
                        ? 'bg-orange-500 border-orange-500 text-white scale-110'
                        : 'border-gray-300 text-gray-600 hover:border-orange-300'
                        }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className={`flex justify-between items-center pt-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
        <button
          type="button"
          onClick={onPrevious}
          className={`inline-flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
        >
          <ArrowLeftIcon className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
          <span>{t.previous}</span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={!isComplete || isSubmitting}
          className={`inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}
        >
          {isSubmitting ? (
            <>
              <Loader2Icon className="w-4 h-4 animate-spin" />
              <span>{language === 'ar' ? 'جار الحفظ...' : 'Enregistrement...'}</span>
            </>
          ) : language === 'ar' ? (
            <>
              <ArrowLeftIcon className="w-4 h-4 rotate-180" />
              <span>{t.continue}</span>
            </>
          ) : (
            <>
              <span>{t.continue}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ConstraintsTest;