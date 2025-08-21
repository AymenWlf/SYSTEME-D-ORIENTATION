import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, ArrowLeftIcon, PlusIcon, XIcon } from 'lucide-react';

import { Loader2Icon, CheckIcon } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { getAuthToken } from '../utils/auth';

interface LanguageTestProps {
  onComplete: (data: any) => void;
  onPrevious: () => void;
  canGoBack: boolean;
  language: string;
}

interface LanguageResponse {
  responseId: string;
  responseType: 'language_selection' | 'skill_assessment' | 'certificate' | 'preference';
  languageCode?: string;
  questionText: string;
  selectedValue: string | number | boolean | string[];
  responseTime: number;
  timestamp: Date;
  responseIndex: number;
  skillType?: 'speaking' | 'writing' | 'reading' | 'listening';
  certificateField?: 'hasCertificate' | 'certificateName' | 'score' | 'total';
}

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

const proficiencyLevels = {
  fr: [
    { level: 'A1', label: 'Débutant', description: 'Notions de base' },
    { level: 'A2', label: 'Élémentaire', description: 'Conversations simples' },
    { level: 'B1', label: 'Intermédiaire', description: 'Usage quotidien' },
    { level: 'B2', label: 'Intermédiaire+', description: 'Usage professionnel' },
    { level: 'C1', label: 'Avancé', description: 'Usage académique' },
    { level: 'C2', label: 'Maîtrise', description: 'Niveau natif' }
  ],
  ar: [
    { level: 'A1', label: 'مبتدئ', description: 'أساسيات' },
    { level: 'A2', label: 'أولي', description: 'محادثات بسيطة' },
    { level: 'B1', label: 'متوسط', description: 'استخدام يومي' },
    { level: 'B2', label: 'متوسط+', description: 'استخدام مهني' },
    { level: 'C1', label: 'متقدم', description: 'استخدام أكاديمي' },
    { level: 'C2', label: 'إتقان', description: 'مستوى أهل اللغة' }
  ]
};

const translations = {
  fr: {
    testTitle: "Compétences linguistiques",
    testSubtitle: "Sélectionnez les langues que vous maîtrisez et évaluez votre niveau",
    selectLanguages: "Sélection des langues",
    selectLanguagesDesc: "Choisissez les langues que vous connaissez (minimum 2)",
    addLanguage: "Ajouter une langue",
    removeLanguage: "Retirer cette langue",
    evaluateSkills: "Évaluation des compétences",
    speaking: "Expression orale",
    writing: "Expression écrite",
    reading: "Compréhension écrite",
    listening: "Compréhension orale",
    level: "Niveau",
    certificates: "Certificats",
    hasCertificate: "Possédez-vous un certificat pour cette langue ?",
    yes: "Oui",
    no: "Non",
    certificateName: "Nom du certificat",
    certificateScore: "Note obtenue",
    certificateTotal: "Note totale",
    certificateExample: "ex: TOEFL, DELF, DELE...",
    languagePreferences: "Préférences linguistiques",
    preferredTeachingLanguage: "Langue d'enseignement préférée",
    select: "Sélectionner",
    arabic: "Arabe",
    french: "Français",
    english: "Anglais",
    bilingual: "Bilingue (Arabe/Français)",
    comfortableStudyingIn: "Langues dans lesquelles vous pouvez étudier confortablement",
    willingToImprove: "Langues que vous souhaitez améliorer",
    advice: "Conseil",
    adviceText: "Soyez réaliste dans votre auto-évaluation. Ces informations nous aideront à vous recommander des formations dans les langues appropriées.",
    previous: "Précédent",
    generateReport: "Générer mon rapport"
  },
  ar: {
    testTitle: "المهارات اللغوية",
    testSubtitle: "اختر اللغات التي تتقنها وقيم مستواك",
    selectLanguages: "اختيار اللغات",
    selectLanguagesDesc: "اختر اللغات التي تعرفها (الحد الأدنى 2)",
    addLanguage: "إضافة لغة",
    removeLanguage: "إزالة هذه اللغة",
    evaluateSkills: "تقييم المهارات",
    speaking: "التعبير الشفهي",
    writing: "التعبير الكتابي",
    reading: "الفهم المكتوب",
    listening: "الفهم الشفهي",
    level: "المستوى",
    certificates: "الشهادات",
    hasCertificate: "هل لديك شهادة في هذه اللغة؟",
    yes: "نعم",
    no: "لا",
    certificateName: "اسم الشهادة",
    certificateScore: "النتيجة المحققة",
    certificateTotal: "النتيجة الإجمالية",
    certificateExample: "مثال: TOEFL, DELF, DELE...",
    languagePreferences: "التفضيلات اللغوية",
    preferredTeachingLanguage: "لغة التدريس المفضلة",
    select: "اختر",
    arabic: "العربية",
    french: "الفرنسية",
    english: "الإنجليزية",
    bilingual: "ثنائية اللغة (عربية/فرنسية)",
    comfortableStudyingIn: "اللغات التي يمكنك الدراسة بها براحة",
    willingToImprove: "اللغات التي تريد تحسينها",
    advice: "نصيحة",
    adviceText: "كن واقعياً في تقييمك الذاتي. ستساعدنا هذه المعلومات في اقتراح التكوينات باللغات المناسبة.",
    previous: "السابق",
    generateReport: "إنشاء تقريري"
  }
};

const LanguageTest: React.FC<LanguageTestProps> = ({ onComplete, onPrevious, canGoBack, language = 'fr', sessionData }) => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['ar', 'fr']); // Langues par défaut
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

  const [languageSkills, setLanguageSkills] = useState<Record<string, {
    speaking: string;
    writing: string;
    reading: string;
    listening: string;
  }>>({});

  const [certificates, setCertificates] = useState<Record<string, {
    hasCertificate: boolean;
    certificateName: string;
    score: string;
    total: string;
  }>>({});

  const [preferences, setPreferences] = useState({
    preferredTeachingLanguage: '',
    comfortableStudyingIn: [] as string[],
    willingToImprove: [] as string[]
  });

  // Nouvelles states pour capturer les détails
  const [detailedResponses, setDetailedResponses] = useState<Record<string, LanguageResponse>>({});
  const [currentResponseStartTime, setCurrentResponseStartTime] = useState<Record<string, number>>({});
  const [sessionStartTime] = useState(Date.now());

  const currentLanguages = languages[language as 'fr' | 'ar'] || languages.fr;
  const currentLevels = proficiencyLevels[language as 'fr' | 'ar'] || proficiencyLevels.fr;
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
        if (sessionData && sessionData.currentStep && sessionData.currentStep.languageSkills) {
          console.log("Données de compétences linguistiques trouvées dans la session:", sessionData.currentStep.languageSkills);
          const langData = sessionData.currentStep.languageSkills.languages || {};

          // Restaurer les langues sélectionnées
          if (langData.selectedLanguages) {
            console.log("Restauration des langues sélectionnées:", langData.selectedLanguages);
            setSelectedLanguages(langData.selectedLanguages);
          }

          // Restaurer les compétences linguistiques
          if (langData.languageSkills) {
            console.log("Restauration des compétences linguistiques:", langData.languageSkills);
            setLanguageSkills(langData.languageSkills);
          }

          // Restaurer les certificats
          if (langData.certificates) {
            console.log("Restauration des certificats:", langData.certificates);
            setCertificates(langData.certificates);
          }

          // Restaurer les préférences
          if (langData.preferences) {
            console.log("Restauration des préférences:", langData.preferences);
            setPreferences(langData.preferences);
          }

          // Restaurer les réponses détaillées
          if (langData.detailedResponses) {
            console.log("Restauration des réponses détaillées:", langData.detailedResponses);
            setDetailedResponses(langData.detailedResponses);
          }

          setDataLoaded(true);
          setIsLoading(false);
          return;
        }

        // Sinon, récupérer les données depuis l'API
        console.log("Récupération des données de compétences linguistiques depuis l'API");
        const response = await axios.get(`${API_BASE_URL}/orientation-test/my-test`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success && response.data.hasTest) {
          console.log("Données de test récupérées avec succès:", response.data);
          // Extraire les données de langues si elles existent
          const testData = response.data.data;
          if (testData.currentStep && testData.currentStep.languageSkills) {
            console.log("Données de compétences linguistiques trouvées dans la réponse API:", testData.currentStep.languageSkills);
            const langData = testData.currentStep.languageSkills.languages || {};

            // Restaurer les langues sélectionnées
            if (langData.selectedLanguages) {
              console.log("Restauration des langues sélectionnées depuis l'API:", langData.selectedLanguages);
              setSelectedLanguages(langData.selectedLanguages);
            }

            // Restaurer les compétences linguistiques
            if (langData.languageSkills) {
              console.log("Restauration des compétences linguistiques depuis l'API:", langData.languageSkills);
              setLanguageSkills(langData.languageSkills);
            }

            // Restaurer les certificats
            if (langData.certificates) {
              console.log("Restauration des certificats depuis l'API:", langData.certificates);
              setCertificates(langData.certificates);
            }

            // Restaurer les préférences
            if (langData.preferences) {
              console.log("Restauration des préférences depuis l'API:", langData.preferences);
              setPreferences(langData.preferences);
            }

            // Restaurer les réponses détaillées
            if (langData.detailedResponses) {
              console.log("Restauration des réponses détaillées depuis l'API:", langData.detailedResponses);
              setDetailedResponses(langData.detailedResponses);
            }

            setDataLoaded(true);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données linguistiques:", err);
        // Ne pas afficher d'erreur à l'utilisateur, simplement continuer avec le formulaire vide
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, token, sessionData, language]);

  useEffect(() => {
    const available = currentLanguages
      .filter(lang => !selectedLanguages.includes(lang.code))
      .map(lang => lang.code);
    setAvailableLanguages(available);
  }, [selectedLanguages, currentLanguages]);


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
      console.log("Soumission des données linguistiques au backend:", completionData);

      // Préparer les données à envoyer
      const languageData = {
        stepName: 'languageSkills',
        stepData: {
          languages: completionData,
          timestamp: new Date().toISOString()
        },
        stepNumber: 3, // Supposons que c'est la 3ème étape 
        duration: completionData.sessionDuration || 0,
        isCompleted: true
      };

      // Envoyer les données à l'API
      const response = await axios.post(
        `${API_BASE_URL}/orientation-test/save-step`,
        languageData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        console.log('Test de compétences linguistiques enregistré avec succès', response.data);

        // Appeler onComplete pour passer à l'étape suivante
        onComplete({
          ...completionData,
          sessionData: response.data
        });
      } else {
        // Gérer le cas où l'API retourne success: false
        setError(response.data.message || (language === 'ar'
          ? 'حدث خطأ أثناء حفظ اختبار المهارات اللغوية'
          : 'Une erreur est survenue lors de l\'enregistrement du test de compétences linguistiques'));
      }
    } catch (err) {
      console.error('Erreur lors de la soumission du test de compétences linguistiques', err);

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

  // Initialiser les temps de départ
  useEffect(() => {
    const initialTimes: Record<string, number> = {};
    const now = Date.now();

    // Timer pour chaque type de réponse
    initialTimes['language_selection'] = now;
    initialTimes['preferred_teaching'] = now;
    initialTimes['comfortable_studying'] = now;
    initialTimes['willing_improve'] = now;

    // Timer pour chaque langue sélectionnée
    selectedLanguages.forEach(langCode => {
      ['speaking', 'writing', 'reading', 'listening'].forEach(skill => {
        initialTimes[`skill_${langCode}_${skill}`] = now;
      });
      ['hasCertificate', 'certificateName', 'score', 'total'].forEach(field => {
        initialTimes[`cert_${langCode}_${field}`] = now;
      });
    });

    setCurrentResponseStartTime(initialTimes);
  }, [selectedLanguages]);

  const captureLanguageResponse = (
    responseType: LanguageResponse['responseType'],
    questionText: string,
    selectedValue: any,
    responseIndex: number,
    languageCode?: string,
    skillType?: LanguageResponse['skillType'],
    certificateField?: LanguageResponse['certificateField']
  ) => {
    const responseKey = languageCode
      ? `${responseType}_${languageCode}_${skillType || certificateField || 'main'}`
      : `${responseType}_main`;

    const responseTime = Date.now() - (currentResponseStartTime[responseKey] || Date.now());
    const responseId = `${responseType}_${responseIndex}${languageCode ? `_${languageCode}` : ''}`;

    const response: LanguageResponse = {
      responseId,
      responseType,
      languageCode,
      questionText,
      selectedValue,
      responseTime,
      timestamp: new Date(),
      responseIndex,
      skillType,
      certificateField
    };

    setDetailedResponses(prev => ({
      ...prev,
      [responseKey]: response
    }));

    console.log(`🗣️ Language Response Captured:`, {
      responseType,
      languageCode: languageCode || 'general',
      selectedValue: typeof selectedValue === 'object' ? `Array(${selectedValue.length})` : selectedValue,
      responseTime: `${responseTime}ms`
    });

    // Reset timer
    setCurrentResponseStartTime(prev => ({
      ...prev,
      [responseKey]: Date.now()
    }));
  };

  React.useEffect(() => {
    const available = currentLanguages
      .filter(lang => !selectedLanguages.includes(lang.code))
      .map(lang => lang.code);
    setAvailableLanguages(available);
  }, [selectedLanguages, currentLanguages]);


  const addLanguage = (languageCode: string) => {
    setSelectedLanguages(prev => [...prev, languageCode]);

    captureLanguageResponse(
      'language_selection',
      `${t.addLanguage}: ${getLanguageName(languageCode)}`,
      languageCode,
      selectedLanguages.length,
      languageCode
    );
  };

  const removeLanguage = (languageCode: string) => {
    if (selectedLanguages.length > 2) {
      setSelectedLanguages(prev => prev.filter(code => code !== languageCode));

      // Clean up related data
      setLanguageSkills(prev => {
        const newSkills = { ...prev };
        delete newSkills[languageCode];
        return newSkills;
      });

      setCertificates(prev => {
        const newCerts = { ...prev };
        delete newCerts[languageCode];
        return newCerts;
      });

      captureLanguageResponse(
        'language_selection',
        `${t.removeLanguage}: ${getLanguageName(languageCode)}`,
        `remove_${languageCode}`,
        selectedLanguages.length,
        languageCode
      );
    }
  };

  const handleSkillChange = (languageCode: string, skill: string, level: string) => {
    setLanguageSkills(prev => ({
      ...prev,
      [languageCode]: {
        ...prev[languageCode] || { speaking: '', writing: '', reading: '', listening: '' },
        [skill]: level
      }
    }));

    const skillLabels: Record<string, string> = {
      speaking: t.speaking,
      writing: t.writing,
      reading: t.reading,
      listening: t.listening
    };

    captureLanguageResponse(
      'skill_assessment',
      `${skillLabels[skill]} - ${getLanguageName(languageCode)}`,
      level,
      selectedLanguages.indexOf(languageCode),
      languageCode,
      skill as LanguageResponse['skillType']
    );
  };

  const handleCertificateChange = (languageCode: string, field: string, value: string | boolean) => {
    setCertificates(prev => ({
      ...prev,
      [languageCode]: {
        ...prev[languageCode] || { hasCertificate: false, certificateName: '', score: '', total: '' },
        [field]: value
      }
    }));

    const certificateLabels: Record<string, string> = {
      hasCertificate: t.hasCertificate,
      certificateName: t.certificateName,
      score: t.certificateScore,
      total: t.certificateTotal
    };

    captureLanguageResponse(
      'certificate',
      `${certificateLabels[field]} - ${getLanguageName(languageCode)}`,
      value,
      selectedLanguages.indexOf(languageCode),
      languageCode,
      undefined,
      field as LanguageResponse['certificateField']
    );
  };

  const handlePreferenceChange = (key: string, value: string | string[]) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));

    const preferenceLabels: Record<string, string> = {
      preferredTeachingLanguage: t.preferredTeachingLanguage,
      comfortableStudyingIn: t.comfortableStudyingIn,
      willingToImprove: t.willingToImprove
    };

    captureLanguageResponse(
      'preference',
      preferenceLabels[key],
      value,
      Object.keys(preferences).indexOf(key)
    );
  };


  const toggleLanguageArray = (key: 'comfortableStudyingIn' | 'willingToImprove', languageCode: string) => {
    const newArray = preferences[key].includes(languageCode)
      ? preferences[key].filter(lang => lang !== languageCode)
      : [...preferences[key], languageCode];

    setPreferences(prev => ({
      ...prev,
      [key]: newArray
    }));

    const preferenceLabels: Record<string, string> = {
      comfortableStudyingIn: t.comfortableStudyingIn,
      willingToImprove: t.willingToImprove
    };

    captureLanguageResponse(
      'preference',
      `${preferenceLabels[key]} - ${getLanguageName(languageCode)}`,
      newArray,
      Object.keys(preferences).indexOf(key),
      languageCode
    );
  };
  const handleSubmit = () => {
    console.group('🗣️ Language Test Completion');
    console.log('Calculating comprehensive language skills analysis...');

    // Calculate overall proficiency scores
    const overallScores: Record<string, number> = {};

    Object.entries(languageSkills).forEach(([languageCode, skills]) => {
      const skillLevels = Object.values(skills).map(level => {
        const proficiency = currentLevels.find(p => p.level === level);
        return proficiency ? currentLevels.indexOf(proficiency) + 1 : 0;
      });

      const average = skillLevels.length > 0
        ? skillLevels.reduce((a, b) => a + b, 0) / skillLevels.length
        : 0;

      overallScores[languageCode] = Math.round((average / 6) * 100);
    });

    // Fonctions d'analyse avec accès à overallScores
    const calculateLanguageDiversityIndex = (): number => {
      const languageFamilies: Record<string, string[]> = {
        'semitic': ['ar'],
        'romance': ['fr', 'es', 'it', 'pt'],
        'germanic': ['en', 'de'],
        'sino_tibetan': ['zh'],
        'japonic': ['ja'],
        'slavic': ['ru']
      };

      const families = new Set();
      selectedLanguages.forEach(lang => {
        Object.entries(languageFamilies).forEach(([family, langs]) => {
          if (langs.includes(lang)) families.add(family);
        });
      });

      return Math.round((families.size / Object.keys(languageFamilies).length) * 100);
    };

    const calculateDominantLanguageReliance = (): number => {
      if (selectedLanguages.length === 0) return 0;

      const dominantScore = overallScores[selectedLanguages[0]] || 0;
      const otherScores = selectedLanguages.slice(1).map(lang => overallScores[lang] || 0);
      const avgOtherScore = otherScores.length > 0
        ? otherScores.reduce((sum, score) => sum + score, 0) / otherScores.length
        : 0;

      return dominantScore > 0 ? Math.round((dominantScore / (dominantScore + avgOtherScore)) * 100) : 50;
    };

    // Calculer les statistiques détaillées
    const responseStats = Object.values(detailedResponses);
    const completedResponses = responseStats.filter(r =>
      r.selectedValue !== '' && r.selectedValue !== false &&
      !(Array.isArray(r.selectedValue) && r.selectedValue.length === 0)
    );

    // Statistiques par type de réponse
    const responseTypeStats = ['language_selection', 'skill_assessment', 'certificate', 'preference'].map(type => {
      const typeResponses = responseStats.filter(r => r.responseType === type);
      const responseTimes = typeResponses.map(r => r.responseTime);

      return {
        responseType: type,
        responsesCount: typeResponses.length,
        avgResponseTime: responseTimes.length > 0
          ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length)
          : 0,
        completedCount: typeResponses.filter(r =>
          r.selectedValue !== '' && r.selectedValue !== false &&
          !(Array.isArray(r.selectedValue) && r.selectedValue.length === 0)
        ).length
      };
    });

    // Temps de réponse global
    const allResponseTimes = responseStats.map(r => r.responseTime);
    const avgResponseTime = allResponseTimes.length > 0
      ? Math.round(allResponseTimes.reduce((sum, time) => sum + time, 0) / allResponseTimes.length)
      : 0;

    // Analyser le profil linguistique
    const languageProfile = {
      totalLanguages: selectedLanguages.length,
      dominantLanguage: selectedLanguages[0],
      highestProficiency: Object.entries(overallScores).reduce((max, [lang, score]) =>
        score > max.score ? { language: lang, score } : max, { language: '', score: 0 }),
      multilingualIndex: Math.round(Object.values(overallScores).reduce((sum, score) => sum + score, 0) / selectedLanguages.length),
      certificationsCount: Object.values(certificates).filter(cert => cert.hasCertificate).length,
      studyFlexibility: preferences.comfortableStudyingIn.length,
      improvementMotivation: preferences.willingToImprove.length
    };

    // Créer la session
    const session = {
      testType: 'language_skills',
      startedAt: new Date(sessionStartTime),
      completedAt: new Date(),
      duration: Date.now() - sessionStartTime,
      language: language as 'fr' | 'ar',
      totalQuestions: responseStats.length,
      questions: responseStats.map(response => ({
        questionId: response.responseId,
        questionText: response.questionText,
        userAnswer: response.selectedValue,
        responseTime: response.responseTime,
        timestamp: response.timestamp
      }))
    };

    // Identifier les langues fortes et faibles
    const languageStrengths = Object.entries(overallScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([lang, score]) => ({ language: getLanguageName(lang), code: lang, score }));

    const skillBalanceAnalysis = selectedLanguages.map(langCode => {
      const skills = languageSkills[langCode];
      if (!skills) return null;

      const skillScores = Object.entries(skills).map(([skillType, level]) => {
        const proficiency = currentLevels.find(p => p.level === level);
        return {
          skill: skillType,
          score: proficiency ? currentLevels.indexOf(proficiency) + 1 : 0
        };
      });

      const avgScore = skillScores.reduce((sum, s) => sum + s.score, 0) / skillScores.length;
      const maxScore = Math.max(...skillScores.map(s => s.score));
      const minScore = Math.min(...skillScores.map(s => s.score));

      return {
        language: langCode,
        avgScore: Math.round(avgScore),
        balance: maxScore - minScore,
        strongestSkill: skillScores.reduce((max, skill) => skill.score > max.score ? skill : max),
        weakestSkill: skillScores.reduce((min, skill) => skill.score < min.score ? skill : min)
      };
    }).filter(Boolean);

    console.log('Language Profile Analysis:', {
      totalLanguages: languageProfile.totalLanguages,
      multilingualIndex: languageProfile.multilingualIndex,
      certificationsCount: languageProfile.certificationsCount,
      topLanguages: languageStrengths.map(l => `${l.language}: ${l.score}%`)
    });

    console.log('Response Statistics:', {
      avgResponseTime,
      fastestResponseType: responseTypeStats.reduce((min, type) =>
        type.avgResponseTime < min.avgResponseTime ? type : min),
      sessionDuration: Date.now() - sessionStartTime
    });
    console.groupEnd();

    const completionData = {
      selectedLanguages,
      languageSkills,
      certificates,
      preferences,
      overallScores,
      // Nouvelles données détaillées
      session,
      detailedResponses,
      responseTypeStats,
      avgResponseTime,
      sessionDuration: Date.now() - sessionStartTime,
      completedAt: new Date(),
      // Profils analysés
      languageProfile,
      languageStrengths,
      skillBalanceAnalysis: skillBalanceAnalysis.filter(Boolean),
      // Analyse comportementale
      behavioralAnalysis: {
        languageConfidence: languageProfile.multilingualIndex > 70 ? 'high' : languageProfile.multilingualIndex > 40 ? 'moderate' : 'developing',
        selfAssessmentPattern: avgResponseTime < 3000 ? 'quick_confident' : avgResponseTime > 8000 ? 'very_reflective' : 'thoughtful',
        studyPreference: preferences.preferredTeachingLanguage,
        adaptabilityScore: Math.round((preferences.comfortableStudyingIn.length / selectedLanguages.length) * 100),
        growthMindset: Math.round((preferences.willingToImprove.length / selectedLanguages.length) * 100),
        certificationOriented: languageProfile.certificationsCount > 0,
        languageDiversityIndex: calculateLanguageDiversityIndex(),
        dominantLanguageReliance: calculateDominantLanguageReliance()
      }
    };

    submitTestData(completionData);
  };

  // Fonctions d'analyse
  const calculateLanguageDiversityIndex = (): number => {
    // Plus on a de langues de familles différentes, plus l'index est élevé
    const languageFamilies: Record<string, string[]> = {
      'semitic': ['ar'],
      'romance': ['fr', 'es', 'it', 'pt'],
      'germanic': ['en', 'de'],
      'sino_tibetan': ['zh'],
      'japonic': ['ja'],
      'slavic': ['ru']
    };

    const families = new Set();
    selectedLanguages.forEach(lang => {
      Object.entries(languageFamilies).forEach(([family, langs]) => {
        if (langs.includes(lang)) families.add(family);
      });
    });

    return Math.round((families.size / Object.keys(languageFamilies).length) * 100);
  };


  const calculateDominantLanguageReliance = (): number => {
    if (selectedLanguages.length === 0) return 0;

    const dominantScore = overallScores[selectedLanguages[0]] || 0;
    const otherScores = selectedLanguages.slice(1).map(lang => overallScores[lang] || 0);
    const avgOtherScore = otherScores.length > 0
      ? otherScores.reduce((sum, score) => sum + score, 0) / otherScores.length
      : 0;

    return dominantScore > 0 ? Math.round((dominantScore / (dominantScore + avgOtherScore)) * 100) : 50;
  };

  const isComplete = selectedLanguages.length >= 2 &&
    preferences.preferredTeachingLanguage !== '' &&
    selectedLanguages.every(langCode =>
      languageSkills[langCode] &&
      Object.values(languageSkills[langCode]).every(skill => skill !== '')
    );

  const getLanguageName = (code: string) => {
    return currentLanguages.find(lang => lang.code === code)?.name || code;
  };

  // Calculer les statistiques de progression
  const getCompletionStats = () => {
    const totalSkillsRequired = selectedLanguages.length * 4; // 4 compétences par langue
    const skillsCompleted = Object.values(languageSkills).reduce((total, skills) =>
      total + Object.values(skills).filter(skill => skill !== '').length, 0);

    const certificatesCompleted = Object.values(certificates).filter(cert =>
      cert.hasCertificate !== undefined).length;

    const preferencesCompleted = [
      preferences.preferredTeachingLanguage !== '',
      preferences.comfortableStudyingIn.length > 0,
      preferences.willingToImprove.length > 0
    ].filter(Boolean).length;

    return {
      selectedLanguagesCount: selectedLanguages.length,
      skillsCompleted,
      totalSkillsRequired,
      certificatesCompleted,
      preferencesCompleted,
      overallCompletion: Math.round(((skillsCompleted + preferencesCompleted) / (totalSkillsRequired + 3)) * 100)
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
            ? 'جاري تحميل اختبار المهارات اللغوية...'
            : 'Chargement du test de compétences linguistiques...'}
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
        <div className="flex justify-end mb-6">
          <button
            type="button"
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition"
            onClick={() => {
              // Préremplir toutes les langues sélectionnées avec le niveau maximal et certificat "Oui"
              const maxLevel = currentLevels[currentLevels.length - 1].level; // C2 ou إتقان
              const newLanguageSkills: typeof languageSkills = {};
              const newCertificates: typeof certificates = {};

              selectedLanguages.forEach(langCode => {
                newLanguageSkills[langCode] = {
                  speaking: maxLevel,
                  writing: maxLevel,
                  reading: maxLevel,
                  listening: maxLevel
                };
                newCertificates[langCode] = {
                  hasCertificate: true,
                  certificateName: "Certificat",
                  score: "100",
                  total: "100"
                };

                // Capturer les réponses détaillées pour chaque compétence et certificat
                ['speaking', 'writing', 'reading', 'listening'].forEach((skill, idx) => {
                  captureLanguageResponse(
                    'skill_assessment',
                    `${t[skill]} - ${getLanguageName(langCode)}`,
                    maxLevel,
                    idx,
                    langCode,
                    skill as LanguageResponse['skillType']
                  );
                });
                ['hasCertificate', 'certificateName', 'score', 'total'].forEach((field, idx) => {
                  captureLanguageResponse(
                    'certificate',
                    `${t[field]} - ${getLanguageName(langCode)}`,
                    field === 'hasCertificate' ? true : "100",
                    idx,
                    langCode,
                    undefined,
                    field as LanguageResponse['certificateField']
                  );
                });
              });

              setLanguageSkills(newLanguageSkills);
              setCertificates(newCertificates);

              // Préférences : tout cocher
              setPreferences({
                preferredTeachingLanguage: 'fr',
                comfortableStudyingIn: [...selectedLanguages],
                willingToImprove: [...selectedLanguages]
              });

              // Capturer les réponses de préférences
              handlePreferenceChange('preferredTeachingLanguage', 'fr');
              handlePreferenceChange('comfortableStudyingIn', [...selectedLanguages]);
              handlePreferenceChange('willingToImprove', [...selectedLanguages]);
            }}
          >
            {language === 'ar' ? "تعبئة جميع الإجابات تلقائياً" : "Tout préremplir"}
          </button>
        </div>

        {/* Progress Statistics */}
        {completionStats.skillsCompleted > 0 && (
          <div className="bg-purple-50 rounded-lg p-3 mt-4">
            <div className={`text-sm text-purple-700 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {language === 'ar'
                ? `التقدم: ${completionStats.overallCompletion}% - اللغات: ${completionStats.selectedLanguagesCount}, المهارات: ${completionStats.skillsCompleted}/${completionStats.totalSkillsRequired}`
                : `Progression: ${completionStats.overallCompletion}% - Langues: ${completionStats.selectedLanguagesCount}, Compétences: ${completionStats.skillsCompleted}/${completionStats.totalSkillsRequired}`
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

      {/* Conseil/Remarque */}
      <div className="bg-amber-50 rounded-xl p-4 mb-8">
        <p className={`text-sm text-amber-700 ${language === 'ar' ? 'text-right' : ''}`}>
          <strong>{t.advice} :</strong> {t.adviceText}
        </p>
      </div>

      {/* Language Selection */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
        <div className={`flex justify-between items-center mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <h3 className="text-lg font-semibold text-gray-900">{t.selectLanguages}</h3>
          <div className="text-sm text-purple-600">
            {selectedLanguages.length} langues
          </div>
        </div>
        <p className={`text-gray-600 mb-4 ${language === 'ar' ? 'text-right' : ''}`}>
          {t.selectLanguagesDesc}
        </p>

        {/* Selected Languages */}
        <div className="mb-4">
          <div className={`flex flex-wrap gap-2 ${language === 'ar' ? 'justify-end' : ''}`}>
            {selectedLanguages.map(langCode => (
              <div key={langCode} className={`flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <span>{getLanguageName(langCode)}</span>
                {selectedLanguages.length > 2 && (
                  <button
                    onClick={() => removeLanguage(langCode)}
                    className="text-blue-500 hover:text-blue-700"
                    title={t.removeLanguage}
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add Language */}
        {availableLanguages.length > 0 && (
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'ar' ? 'text-right' : ''}`}>
              {t.addLanguage}
            </label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addLanguage(e.target.value);
                  e.target.value = '';
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t.select}</option>
              {availableLanguages.map(langCode => (
                <option key={langCode} value={langCode}>
                  {getLanguageName(langCode)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Language Skills Assessment */}
      <div className="space-y-6">
        <div className={`flex justify-between items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <h3 className="text-lg font-semibold text-gray-900">{t.evaluateSkills}</h3>
          <div className="text-sm text-blue-600">
            {completionStats.skillsCompleted}/{completionStats.totalSkillsRequired} compétences
          </div>
        </div>

        {selectedLanguages.map(langCode => {
          const lang = currentLanguages.find(l => l.code === langCode);
          if (!lang) return null;

          const langSkills = languageSkills[langCode];
          const skillsCompleted = langSkills ? Object.values(langSkills).filter(skill => skill !== '').length : 0;
          const hasCertInfo = certificates[langCode]?.hasCertificate !== undefined;

          return (
            <div key={langCode} className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border transition-all ${skillsCompleted === 4 && hasCertInfo ? 'border-blue-300 bg-blue-50' : 'border-transparent'
              }`}>
              <div className={`flex justify-between items-center mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <h4 className="text-lg font-semibold text-gray-900">{lang.name}</h4>
                <div className="text-right">
                  <div className="text-sm text-blue-600">
                    {skillsCompleted}/4 compétences
                  </div>
                  {skillsCompleted === 4 && hasCertInfo && (
                    <div className="text-xs text-green-600 font-medium">✓ Complété</div>
                  )}
                </div>
              </div>
              <p className={`text-gray-600 mb-4 ${language === 'ar' ? 'text-right' : ''}`}>
                {lang.description}
              </p>

              {/* Skills Assessment */}
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                {[
                  { key: 'speaking', label: t.speaking },
                  { key: 'writing', label: t.writing },
                  { key: 'reading', label: t.reading },
                  { key: 'listening', label: t.listening }
                ].map(skill => {
                  const currentValue = languageSkills[langCode]?.[skill.key as keyof typeof languageSkills[typeof langCode]] || '';
                  const isCompleted = currentValue !== '';

                  return (
                    <div key={skill.key}>
                      <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'ar' ? 'text-right' : ''}`}>
                        {skill.label} {isCompleted && <span className="text-xs text-green-600">✓</span>}
                      </label>
                      <select
                        value={currentValue}
                        onChange={(e) => handleSkillChange(langCode, skill.key, e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm transition-all ${isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-300'
                          }`}
                      >
                        <option value="">{t.level}</option>
                        {currentLevels.map(level => (
                          <option key={level.level} value={level.level}>
                            {level.level} - {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>

              {/* Certificate Information */}
              <div className={`bg-white rounded-lg p-4 border transition-all ${hasCertInfo ? 'border-blue-300' : 'border-gray-200'
                }`}>
                <h5 className={`font-medium text-gray-900 mb-3 ${language === 'ar' ? 'text-right' : ''}`}>
                  {t.certificates} {hasCertInfo && <span className="text-xs text-blue-600">✓</span>}
                </h5>

                {/* Has Certificate */}
                <div className="mb-4">
                  <label className={`block text-sm text-gray-600 mb-2 ${language === 'ar' ? 'text-right' : ''}`}>
                    {t.hasCertificate}
                  </label>
                  <div className={`flex gap-4 ${language === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
                    <button
                      onClick={() => handleCertificateChange(langCode, 'hasCertificate', true)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${certificates[langCode]?.hasCertificate === true
                        ? 'border-green-500 bg-green-100 text-green-700'
                        : 'border-gray-300 text-gray-600 hover:border-green-300'
                        }`}
                    >
                      {t.yes}
                    </button>
                    <button
                      onClick={() => handleCertificateChange(langCode, 'hasCertificate', false)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${certificates[langCode]?.hasCertificate === false
                        ? 'border-red-500 bg-red-100 text-red-700'
                        : 'border-gray-300 text-gray-600 hover:border-red-300'
                        }`}
                    >
                      {t.no}
                    </button>
                  </div>
                </div>

                {/* Certificate Details */}
                {certificates[langCode]?.hasCertificate && (
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-sm text-gray-600 mb-1 ${language === 'ar' ? 'text-right' : ''}`}>
                        {t.certificateName}
                      </label>
                      <input
                        type="text"
                        placeholder={t.certificateExample}
                        value={certificates[langCode]?.certificateName || ''}
                        onChange={(e) => handleCertificateChange(langCode, 'certificateName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm text-gray-600 mb-1 ${language === 'ar' ? 'text-right' : ''}`}>
                        {t.certificateScore}
                      </label>
                      <input
                        type="text"
                        placeholder="90"
                        value={certificates[langCode]?.score || ''}
                        onChange={(e) => handleCertificateChange(langCode, 'score', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm text-gray-600 mb-1 ${language === 'ar' ? 'text-right' : ''}`}>
                        {t.certificateTotal}
                      </label>
                      <input
                        type="text"
                        placeholder="100"
                        value={certificates[langCode]?.total || ''}
                        onChange={(e) => handleCertificateChange(langCode, 'total', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Language Preferences */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6">
        <div className={`flex justify-between items-center mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <h3 className="text-lg font-semibold text-gray-900">{t.languagePreferences}</h3>
          <div className="text-sm text-green-600">
            {completionStats.preferencesCompleted}/3 préférences
          </div>
        </div>

        <div className="space-y-6">
          {/* Preferred Teaching Language */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${language === 'ar' ? 'text-right' : ''}`}>
              {t.preferredTeachingLanguage} {preferences.preferredTeachingLanguage && <span className="text-xs text-green-600">✓</span>}
            </label>
            <select
              value={preferences.preferredTeachingLanguage}
              onChange={(e) => handlePreferenceChange('preferredTeachingLanguage', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all ${preferences.preferredTeachingLanguage ? 'border-green-300 bg-green-50' : 'border-gray-300'
                }`}
            >
              <option value="">{t.select}</option>
              <option value="ar">{t.arabic}</option>
              <option value="fr">{t.french}</option>
              <option value="en">{t.english}</option>
              <option value="mixed">{t.bilingual}</option>
            </select>
          </div>

          {/* Comfortable Studying In */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-3 ${language === 'ar' ? 'text-right' : ''}`}>
              {t.comfortableStudyingIn} {preferences.comfortableStudyingIn.length > 0 && <span className="text-xs text-green-600">✓ {preferences.comfortableStudyingIn.length}</span>}
            </label>
            <div className="grid md:grid-cols-3 gap-3">
              {selectedLanguages.map(langCode => (
                <button
                  key={langCode}
                  onClick={() => toggleLanguageArray('comfortableStudyingIn', langCode)}
                  className={`p-3 border-2 rounded-lg transition-all ${language === 'ar' ? 'text-center' : 'text-left'} ${preferences.comfortableStudyingIn.includes(langCode)
                    ? 'border-green-500 bg-green-100 text-green-700'
                    : 'border-gray-300 hover:border-green-300'
                    }`}
                >
                  {getLanguageName(langCode)}
                </button>
              ))}
            </div>
          </div>

          {/* Willing to Improve */}
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-3 ${language === 'ar' ? 'text-right' : ''}`}>
              {t.willingToImprove} {preferences.willingToImprove.length > 0 && <span className="text-xs text-blue-600">✓ {preferences.willingToImprove.length}</span>}
            </label>
            <div className="grid md:grid-cols-3 gap-3">
              {selectedLanguages.map(langCode => (
                <button
                  key={langCode}
                  onClick={() => toggleLanguageArray('willingToImprove', langCode)}
                  className={`p-3 border-2 rounded-lg transition-all ${language === 'ar' ? 'text-center' : 'text-left'} ${preferences.willingToImprove.includes(langCode)
                    ? 'border-blue-500 bg-blue-100 text-blue-700'
                    : 'border-gray-300 hover:border-blue-300'
                    }`}
                >
                  {getLanguageName(langCode)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={`flex justify-between items-center pt-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
        <button
          type="button"
          onClick={onPrevious}
          className={`inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all ${language === 'ar' ? 'flex-row-reverse' : ''
            }`}
        >
          {language === 'ar' ? (
            <>
              <ArrowRightIcon className="w-4 h-4" />
              <span>{t.previous}</span>
            </>
          ) : (
            <>
              <ArrowLeftIcon className="w-4 h-4" />
              <span>{t.previous}</span>
            </>
          )}
        </button>

        <button
          onClick={handleSubmit}
          disabled={!isComplete || isSubmitting}
          className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${language === 'ar' ? 'flex-row-reverse' : ''}`}
        >
          {isSubmitting ? (
            <>
              <Loader2Icon className="w-4 h-4 animate-spin" />
              <span>{language === 'ar' ? 'جار الحفظ...' : 'Enregistrement...'}</span>
            </>
          ) : language === 'ar' ? (
            <>
              <ArrowLeftIcon className="w-4 h-4" />
              <span>{t.generateReport}</span>
            </>
          ) : (
            <>
              <span>{t.generateReport}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LanguageTest;