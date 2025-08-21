import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, ArrowLeftIcon, Loader2Icon, CheckIcon } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { getAuthToken } from '../utils/auth';

interface RiasecTestProps {
  onComplete: (data: any) => void;
  onPrevious: () => void;
  canGoBack: boolean;
  language: string;
  sessionData?: any; // Données de session existantes
}

interface QuestionResponse {
  questionId: string;
  questionText: string;
  userAnswer: number;
  responseTime: number;
  timestamp: Date;
  category: string;
  questionIndex: number;
}

const riasecQuestions = {
  Realiste: {
    fr: [
      "Travailler avec vos mains sur des projets concrets",
      "Réparer des appareils électroniques ou mécaniques",
      "Construire ou assembler des objets",
      "Travailler à l'extérieur dans la nature",
      "Utiliser des outils et des machines",
      "Faire des travaux pratiques et manuels",
      "Développer des solutions techniques",
      "Travailler dans l'agriculture ou l'ingénierie",
      "Manipuler des équipements scientifiques",
      "Créer des prototypes ou des modèles"
    ],
    ar: [
      "العمل بيديك في مشاريع ملموسة",
      "إصلاح الأجهزة الإلكترونية أو الميكانيكية",
      "بناء أو تجميع الأشياء",
      "العمل في الخارج في الطبيعة",
      "استخدام الأدوات والآلات",
      "القيام بأعمال عملية ويدوية",
      "تطوير حلول تقنية",
      "العمل في الزراعة أو الهندسة",
      "التعامل مع المعدات العلمية",
      "إنشاء نماذج أولية أو مجسمات"
    ]
  },
  Investigateur: {
    fr: [
      "Analyser des données et des informations complexes",
      "Mener des expériences et des recherches",
      "Résoudre des problèmes mathématiques ou scientifiques",
      "Étudier le comportement humain ou animal",
      "Travailler dans un laboratoire",
      "Découvrir de nouvelles connaissances",
      "Analyser des tendances et des patterns",
      "Faire de la recherche médicale ou scientifique",
      "Comprendre le fonctionnement des choses",
      "Développer des théories ou des hypothèses"
    ],
    ar: [
      "تحليل البيانات والمعلومات المعقدة",
      "إجراء التجارب والأبحاث",
      "حل المسائل الرياضية أو العلمية",
      "دراسة السلوك البشري أو الحيواني",
      "العمل في مختبر",
      "اكتشاف معارف جديدة",
      "تحليل الاتجاهات والأنماط",
      "إجراء البحوث الطبية أو العلمية",
      "فهم كيفية عمل الأشياء",
      "تطوير النظريات أو الفرضيات"
    ]
  },
  Artistique: {
    fr: [
      "Créer des œuvres d'art, de la musique ou de la littérature",
      "Exprimer votre créativité de manière libre",
      "Concevoir des espaces, des vêtements ou des objets",
      "Jouer d'un instrument ou chanter",
      "Écrire des histoires, des articles ou des poèmes",
      "Travailler dans le théâtre ou le cinéma",
      "Décorer ou aménager des espaces",
      "Photographier ou filmer",
      "Développer votre propre style artistique",
      "Inspirer les autres par votre créativité"
    ],
    ar: [
      "إنشاء أعمال فنية أو موسيقية أو أدبية",
      "التعبير عن إبداعك بحرية",
      "تصميم المساحات أو الملابس أو الأشياء",
      "العزف على آلة موسيقية أو الغناء",
      "كتابة القصص أو المقالات أو القصائد",
      "العمل في المسرح أو السينما",
      "تزيين أو تأثيث المساحات",
      "التصوير الفوتوغرافي أو التصوير السينمائي",
      "تطوير أسلوبك الفني الخاص",
      "إلهام الآخرين من خلال إبداعك"
    ]
  },
  Social: {
    fr: [
      "Aider les autres à résoudre leurs problèmes",
      "Enseigner et transmettre des connaissances",
      "Conseiller et orienter les personnes",
      "Travailler avec des enfants ou des adolescents",
      "Soigner et prendre soin des malades",
      "Organiser des activités de groupe",
      "Développer des programmes sociaux",
      "Défendre les droits des personnes",
      "Motiver et encourager les autres",
      "Créer des liens entre les personnes"
    ],
    ar: [
      "مساعدة الآخرين في حل مشاكلهم",
      "التدريس ونقل المعرفة",
      "تقديم المشورة وإرشاد الأشخاص",
      "العمل مع الأطفال أو المراهقين",
      "علاج ورعاية المرضى",
      "تنظيم الأنشطة الجماعية",
      "تطوير البرامج الاجتماعية",
      "الدفاع عن حقوق الأشخاص",
      "تحفيز وتشجيع الآخرين",
      "إنشاء روابط بين الأشخاص"
    ]
  },
  Entreprenant: {
    fr: [
      "Diriger une équipe ou un projet",
      "Négocier et convaincre les autres",
      "Créer votre propre entreprise",
      "Vendre des produits ou des services",
      "Prendre des décisions importantes",
      "Organiser des événements ou des campagnes",
      "Influencer les opinions des autres",
      "Gérer des budgets et des ressources",
      "Développer des stratégies commerciales",
      "Relever des défis et prendre des risques"
    ],
    ar: [
      "قيادة فريق أو مشروع",
      "التفاوض وإقناع الآخرين",
      "إنشاء شركتك الخاصة",
      "بيع المنتجات أو الخدمات",
      "اتخاذ قرارات مهمة",
      "تنظيم الأحداث أو الحملات",
      "التأثير على آراء الآخرين",
      "إدارة الميزانيات والموارد",
      "تطوير الاستراتيجيات التجارية",
      "مواجهة التحديات وتحمل المخاطر"
    ]
  },
  Conventionnel: {
    fr: [
      "Organiser et classer des informations",
      "Suivre des procédures établies et précises",
      "Travailler avec des chiffres et des données",
      "Gérer des documents administratifs",
      "Respecter des échéances et des délais",
      "Contrôler la qualité et la conformité",
      "Planifier et coordonner des activités",
      "Tenir des comptes et des budgets",
      "Assurer le bon fonctionnement de systèmes",
      "Maintenir l'ordre et la structure"
    ],
    ar: [
      "تنظيم وتصنيف المعلومات",
      "اتباع إجراءات محددة ودقيقة",
      "العمل مع الأرقام والبيانات",
      "إدارة الوثائق الإدارية",
      "احترام المواعيد النهائية والآجال",
      "مراقبة الجودة والامتثال",
      "التخطيط وتنسيق الأنشطة",
      "مسك الحسابات والميزانيات",
      "ضمان حسن سير النظم",
      "الحفاظ على النظام والهيكل"
    ]
  }
};

const categoryNames = {
  fr: {
    Realiste: "Réaliste",
    Investigateur: "Investigateur",
    Artistique: "Artistique",
    Social: "Social",
    Entreprenant: "Entreprenant",
    Conventionnel: "Conventionnel"
  },
  ar: {
    Realiste: "الواقعي",
    Investigateur: "الباحث",
    Artistique: "الفني",
    Social: "الاجتماعي",
    Entreprenant: "المقاول",
    Conventionnel: "التقليدي"
  }
};

const categoryDescriptions = {
  fr: {
    Realiste: "Préférence pour les activités concrètes et pratiques",
    Investigateur: "Goût pour la recherche, l'analyse et la résolution de problèmes",
    Artistique: "Attirance pour la créativité et l'expression personnelle",
    Social: "Orientation vers l'aide aux autres et les interactions humaines",
    Entreprenant: "Intérêt pour le leadership, la persuasion et la gestion",
    Conventionnel: "Préférence pour l'organisation, la structure et les détails"
  },
  ar: {
    Realiste: "تفضيل الأنشطة الملموسة والعملية",
    Investigateur: "الميل للبحث والتحليل وحل المشاكل",
    Artistique: "الانجذاب للإبداع والتعبير الشخصي",
    Social: "التوجه نحو مساعدة الآخرين والتفاعلات الإنسانية",
    Entreprenant: "الاهتمام بالقيادة والإقناع والإدارة",
    Conventionnel: "تفضيل التنظيم والهيكل والتفاصيل"
  }
};

const translations = {
  fr: {
    testTitle: "Test RIASEC",
    testSubtitle: "Évaluez votre intérêt pour différents types d'activités",
    questionInstruction: "À quel point êtes-vous intéressé(e) par ces activités ? (1 = Pas du tout, 5 = Énormément)",
    previousCategory: "Catégorie précédente",
    nextCategory: "Catégorie suivante",
    finishTest: "Terminer le test",
    previous: "Précédent"
  },
  ar: {
    testTitle: "اختبار RIASEC",
    testSubtitle: "قيم اهتمامك بأنواع مختلفة من الأنشطة",
    questionInstruction: "ما مدى اهتمامك بهذه الأنشطة؟ (1 = لا أهتم إطلاقاً، 5 = أهتم كثيراً)",
    previousCategory: "الفئة السابقة",
    nextCategory: "الفئة التالية",
    finishTest: "إنهاء الاختبار",
    previous: "السابق"
  }
};
const RIASEC_CATEGORIES = Object.keys(riasecQuestions);


const RiasecTest: React.FC<RiasecTestProps> = ({ onComplete, onPrevious, canGoBack, language = 'fr', sessionData }) => {
  const [currentCategory, setCurrentCategory] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [detailedResponses, setDetailedResponses] = useState<Record<string, QuestionResponse[]>>({});
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [sessionStartTime] = useState(Date.now());
  const [categoryStartTimes, setCategoryStartTimes] = useState<Record<string, number>>({});

  // Nouveaux états pour l'intégration avec le backend
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Récupérer le token d'authentification
  const token = getAuthToken();

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = !!token;

  const categories = RIASEC_CATEGORIES;
  const currentCategoryName = categories[currentCategory];

  const currentCategoryData = riasecQuestions[currentCategoryName as keyof typeof riasecQuestions];
  const currentQuestions = currentCategoryData?.[language as 'fr' | 'ar'] || [];
  const t = translations[language as 'fr' | 'ar'] || translations.fr;

  // Vérifier si des données existent déjà et les charger
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        // Si des données de session sont fournies directement, les utiliser
        if (sessionData && sessionData.currentStep && sessionData.currentStep.riasec) {
          console.log("Données RIASEC trouvées dans la session:", sessionData.currentStep.riasec);
          const riasecData = sessionData.currentStep.riasec.riasec || {};

          // Restaurer les réponses si elles existent
          if (riasecData.rawAnswers) {
            console.log("Restauration des réponses:", riasecData.rawAnswers);
            setAnswers(riasecData.rawAnswers);
          }

          // Restaurer les réponses détaillées si elles existent
          if (riasecData.detailedResponses) {
            console.log("Restauration des réponses détaillées:", riasecData.detailedResponses);
            setDetailedResponses(riasecData.detailedResponses);
          }

          // Déterminer la catégorie la plus avancée pour y placer l'utilisateur
          if (riasecData.categoryStats) {
            const completedCategories = riasecData.categoryStats.filter(
              (stat: any) => stat.questionsAnswered > 0
            );

            if (completedCategories.length > 0) {
              // Trouver l'index de la catégorie la plus avancée
              const lastCompletedCategory = completedCategories[completedCategories.length - 1];
              const categoryIndex = categories.findIndex(cat => cat === lastCompletedCategory.category);

              // Si toutes les questions sont répondues dans cette catégorie, passer à la catégorie suivante
              const categoryQuestions = riasecQuestions[lastCompletedCategory.category as keyof typeof riasecQuestions]?.[language as 'fr' | 'ar'] || [];
              const allQuestionsAnswered = categoryQuestions.length === lastCompletedCategory.questionsAnswered;

              const nextCategoryIndex = allQuestionsAnswered && categoryIndex < categories.length - 1 ?
                categoryIndex + 1 :
                categoryIndex;

              console.log(`Définition de la catégorie actuelle à ${nextCategoryIndex} (${categories[nextCategoryIndex]})`);
              setCurrentCategory(nextCategoryIndex);
            }
          }

          setDataLoaded(true);
          setIsLoading(false);
          return;
        }

        // Sinon, récupérer les données depuis l'API
        console.log("Récupération des données RIASEC depuis l'API");
        const response = await axios.get(`${API_BASE_URL}/orientation-test/my-test`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success && response.data.hasTest) {
          console.log("Données de test récupérées avec succès:", response.data);
          // Extraire les données RIASEC si elles existent
          const testData = response.data.data;
          if (testData.currentStep && testData.currentStep.riasec) {
            console.log("Données RIASEC trouvées dans la réponse API:", testData.currentStep.riasec);
            const riasecData = testData.currentStep.riasec.riasec || {};

            // Restaurer les réponses si elles existent
            if (riasecData.rawAnswers) {
              console.log("Restauration des réponses depuis l'API:", riasecData.rawAnswers);
              setAnswers(riasecData.rawAnswers);
            }

            // Restaurer les réponses détaillées si elles existent
            if (riasecData.detailedResponses) {
              console.log("Restauration des réponses détaillées depuis l'API:", riasecData.detailedResponses);
              setDetailedResponses(riasecData.detailedResponses);
            }

            // Déterminer la catégorie la plus avancée pour y placer l'utilisateur
            if (riasecData.categoryStats) {
              const completedCategories = riasecData.categoryStats.filter(
                (stat: any) => stat.questionsAnswered > 0
              );

              if (completedCategories.length > 0) {
                // Trouver l'index de la catégorie la plus avancée
                const lastCompletedCategory = completedCategories[completedCategories.length - 1];
                const categoryIndex = categories.findIndex(cat => cat === lastCompletedCategory.category);

                // Si toutes les questions sont répondues dans cette catégorie, passer à la catégorie suivante
                const categoryQuestions = riasecQuestions[lastCompletedCategory.category as keyof typeof riasecQuestions]?.[language as 'fr' | 'ar'] || [];
                const allQuestionsAnswered = categoryQuestions.length === lastCompletedCategory.questionsAnswered;

                const nextCategoryIndex = allQuestionsAnswered && categoryIndex < categories.length - 1 ?
                  categoryIndex + 1 :
                  categoryIndex;

                console.log(`Définition de la catégorie actuelle à ${nextCategoryIndex} (${categories[nextCategoryIndex]})`);
                setCurrentCategory(nextCategoryIndex);
              }
            }

            setDataLoaded(true);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données RIASEC:", err);
        // Ne pas afficher d'erreur à l'utilisateur, simplement continuer avec le formulaire vide
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, token, sessionData, language]); // Supprimez categories des dépendances

  // Démarrer le timer pour une nouvelle catégorie
  useEffect(() => {
    if (!categoryStartTimes[currentCategoryName]) {
      setCategoryStartTimes(prev => ({
        ...prev,
        [currentCategoryName]: Date.now()
      }));
    }
    setQuestionStartTime(Date.now());
  }, [currentCategory, currentCategoryName]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswer = (questionIndex: number, value: number) => {
    const questionKey = `${currentCategoryName}_${questionIndex}`;
    const responseTime = Date.now() - questionStartTime;
    const question = currentQuestions[questionIndex];

    // Enregistrer la réponse simple
    setAnswers(prev => ({
      ...prev,
      [questionKey]: value
    }));

    // Enregistrer la réponse détaillée
    if (question) {
      const questionResponse: QuestionResponse = {
        questionId: questionKey,
        questionText: question,
        userAnswer: value,
        responseTime,
        timestamp: new Date(),
        category: currentCategoryName,
        questionIndex
      };

      setDetailedResponses(prevResponses => ({
        ...prevResponses,
        [currentCategoryName]: [
          ...(prevResponses[currentCategoryName]?.filter(r => r.questionIndex !== questionIndex) || []),
          questionResponse
        ].sort((a, b) => a.questionIndex - b.questionIndex)
      }));

      console.log(`📝 RIASEC Response Captured:`, {
        category: currentCategoryName,
        question: question.substring(0, 50) + '...',
        answer: value,
        responseTime: `${responseTime}ms`,
        totalResponses: detailedResponses[currentCategoryName]?.length || 0
      });
    }

    // Reset timer pour la prochaine question
    setQuestionStartTime(Date.now());
  };


  // Nouvelle fonction pour envoyer les données au backend
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
      // Préparer les données à envoyer
      const riasecData = {
        stepName: 'riasec',
        stepData: {
          riasec: completionData,
          timestamp: new Date().toISOString()
        },
        stepNumber: 2, // Supposons que c'est la 2ème étape après personalInfo
        duration: completionData.sessionDuration || 0
      };

      // Envoyer les données à l'API
      const response = await axios.post(
        `${API_BASE_URL}/orientation-test/save-step`,
        riasecData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        console.log('Test RIASEC enregistré avec succès', response.data);

        // Appeler onComplete pour passer à l'étape suivante
        onComplete({
          ...completionData,
          sessionData: response.data
        });
      } else {
        // Gérer le cas où l'API retourne success: false
        setError(response.data.message || (language === 'ar'
          ? 'حدث خطأ أثناء حفظ اختبار RIASEC'
          : 'Une erreur est survenue lors de l\'enregistrement du test RIASEC'));
      }
    } catch (err) {
      console.error('Erreur lors de la soumission du test RIASEC', err);

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


  // Modifier handleNext pour inclure la soumission au backend
  const handleNext = () => {
    if (currentCategory < categories.length - 1) {
      setCurrentCategory(currentCategory + 1);
      scrollToTop();
    } else {
      scrollToTop();

      console.group('🎯 RIASEC Test Completion');
      console.log('Calculating scores and preparing detailed data...');

      // Calculate scores
      const scores: Record<string, number> = {};
      let totalQuestions = 0;
      let totalResponses = 0;

      categories.forEach(category => {
        let total = 0;
        let count = 0;

        const categoryData = riasecQuestions[category as keyof typeof riasecQuestions];
        const questions = categoryData?.[language as 'fr' | 'ar'] || [];
        totalQuestions += questions.length;

        for (let i = 0; i < questions.length; i++) {
          const questionKey = `${category}_${i}`;
          if (answers[questionKey]) {
            total += answers[questionKey];
            count++;
            totalResponses++;
          }
        }

        scores[category] = count > 0 ? Math.round((total / count) * 20) : 0;
        console.log(`${category}: ${count}/${questions.length} answered, score: ${scores[category]}`);
      });

      // Préparer les sessions par catégorie
      const sessions = categories.map(category => {
        const categoryResponses = detailedResponses[category] || [];
        const categoryStartTime = categoryStartTimes[category] || sessionStartTime;

        // Protection contre les tableaux vides et conversion des timestamps
        const categoryEndTime = categoryResponses.length > 0
          ? Math.max(
            ...categoryResponses.map(r => {
              // Vérifier si timestamp est un objet Date ou une chaîne
              return typeof r.timestamp === 'object' && r.timestamp instanceof Date
                ? r.timestamp.getTime()
                : new Date(r.timestamp).getTime();
            }),
            categoryStartTime
          )
          : categoryStartTime;

        return {
          testType: `riasec_${category}`,
          startedAt: new Date(categoryStartTime),
          completedAt: new Date(categoryEndTime),
          duration: categoryEndTime - categoryStartTime,
          language: language as 'fr' | 'ar',
          totalQuestions: categoryResponses.length,
          questions: categoryResponses.map(response => ({
            questionId: response.questionId,
            questionText: response.questionText,
            userAnswer: response.userAnswer,
            responseTime: response.responseTime,
            // Assurer que timestamp est toujours une chaîne dans l'objet retourné
            timestamp: typeof response.timestamp === 'string'
              ? response.timestamp
              : response.timestamp.toISOString()
          }))
        };
      });

      // Calculer les réponses les plus rapides/lentes
      const allResponses = Object.values(detailedResponses).flat();
      const avgResponseTime = allResponses.length > 0
        ? allResponses.reduce((sum, r) => sum + r.responseTime, 0) / allResponses.length
        : 0;

      const sortedByScore = Object.entries(scores)
        .sort(([, a], [, b]) => (b as number) - (a as number));
      const dominantProfile = sortedByScore.slice(0, 2).map(([category]) => category);

      console.log('Final Statistics:', {
        totalQuestions,
        totalResponses,
        avgResponseTime: `${Math.round(avgResponseTime)}ms`,
        dominantProfile,
        sessionsCreated: sessions.length,
        detailedResponsesCount: allResponses.length
      });
      console.groupEnd();

      const completionData = {
        scores,
        rawAnswers: answers,
        sessions,
        detailedResponses,
        totalQuestions,
        totalResponses,
        avgResponseTime: Math.round(avgResponseTime),
        dominantProfile,
        sessionDuration: Date.now() - sessionStartTime,
        completedAt: new Date(),
        // Statistiques supplémentaires
        categoryStats: categories.map(category => ({
          category,
          score: scores[category],
          questionsAnswered: detailedResponses[category]?.length || 0,
          avgResponseTime: detailedResponses[category]?.length > 0
            ? Math.round(detailedResponses[category].reduce((sum, r) => sum + r.responseTime, 0) / detailedResponses[category].length)
            : 0
        }))
      };

      // Soumettre les données au backend au lieu d'appeler directement onComplete
      submitTestData(completionData);
    }
  };
  const handlePrevious = () => {
    if (currentCategory > 0) {
      console.log(`⬅️ RIASEC: Going back from ${currentCategoryName} to ${categories[currentCategory - 1]}`);
      setCurrentCategory(currentCategory - 1);
      scrollToTop();
    } else {
      console.log('⬅️ RIASEC: Going back to previous test');
      onPrevious();
    }
  };

  const getCategoryName = (category: string) => {
    return categoryNames[language as 'fr' | 'ar'][category as keyof typeof categoryNames.fr];
  };

  const getCategoryDescription = (category: string) => {
    return categoryDescriptions[language as 'fr' | 'ar'][category as keyof typeof categoryDescriptions.fr];
  };


  // Si le chargement est en cours, afficher un indicateur
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2Icon className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-600">
          {language === 'ar'
            ? 'جاري تحميل اختبار RIASEC...'
            : 'Chargement du test RIASEC...'}
        </p>
      </div>
    );
  }

  // CORRECTION : Vérification complète avant d'utiliser .every()
  const isCurrentCategoryComplete = currentQuestions &&
    currentQuestions.length > 0 &&
    currentQuestions.every((_, index) => {
      const questionKey = `${currentCategoryName}_${index}`;
      return answers[questionKey] !== undefined;
    });

  // CORRECTION : Vérification plus robuste
  if (!currentCategoryName || !currentQuestions || currentQuestions.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">
          {language === 'ar' ? 'جاري تحميل الأسئلة...' : 'Chargement des questions...'}
        </p>
      </div>
    );
  }


  return (
    <div className={`space-y-6 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Afficher un message si des données ont été chargées */}
      {dataLoaded && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">
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

      {/* Afficher un message d'erreur si nécessaire */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{t.testTitle}</h2>
        <p className="text-gray-600 mb-4">{t.testSubtitle}</p>

        {/* Category Progress */}
        <div className={`flex justify-center gap-2 mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          {categories.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${index < currentCategory ? 'bg-green-500' :
                index === currentCategory ? 'bg-blue-500' : 'bg-gray-300'
                }`}
            />
          ))}
        </div>

        {/* Progress Statistics */}
        {Object.keys(detailedResponses).length > 0 && (
          <div className="bg-blue-50 rounded-lg p-3 mt-4">
            <div className={`text-sm text-blue-700 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {language === 'ar'
                ? `إجمالي الإجابات: ${Object.values(detailedResponses).flat().length}`
                : `Total réponses: ${Object.values(detailedResponses).flat().length}`
              }
              {Object.values(detailedResponses).flat().length > 0 && (
                <span className="ml-4">
                  {language === 'ar'
                    ? `متوسط وقت الإجابة: ${Math.round(Object.values(detailedResponses).flat().reduce((sum, r) => sum + r.responseTime, 0) / Object.values(detailedResponses).flat().length / 1000)}ث`
                    : `Temps moyen: ${Math.round(Object.values(detailedResponses).flat().reduce((sum, r) => sum + r.responseTime, 0) / Object.values(detailedResponses).flat().length / 1000)}s`
                  }
                </span>
              )}
            </div>
          </div>
        )}
      </div>


      {/* Current Category */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
        <div className={`flex justify-between items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {getCategoryName(currentCategoryName)} ({currentCategory + 1}/{categories.length})
            </h3>
            <p className="text-gray-700">{getCategoryDescription(currentCategoryName)}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-600">
              {detailedResponses[currentCategoryName]?.length || 0}/{currentQuestions.length}
            </div>
            <div className="text-xs text-gray-500">
              {language === 'ar' ? 'مُجاب عليها' : 'répondues'}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mb-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition"
        onClick={() => {
          // Préremplir toutes les réponses de la catégorie courante avec la valeur maximale (5)
          const newAnswers: Record<string, number> = { ...answers };
          currentQuestions.forEach((_, index) => {
            const questionKey = `${currentCategoryName}_${index}`;
            newAnswers[questionKey] = 5;
            // Enregistrer aussi dans detailedResponses
            const questionText = currentQuestions[index];
            const questionResponse: QuestionResponse = {
              questionId: questionKey,
              questionText,
              userAnswer: 5,
              responseTime: 1000,
              timestamp: new Date(),
              category: currentCategoryName,
              questionIndex: index
            };
            setDetailedResponses(prevResponses => ({
              ...prevResponses,
              [currentCategoryName]: [
                ...(prevResponses[currentCategoryName]?.filter(r => r.questionIndex !== index) || []),
                questionResponse
              ].sort((a, b) => a.questionIndex - b.questionIndex)
            }));
          });
          setAnswers(newAnswers);
        }}
      >
        {language === 'ar' ? "تعبئة جميع الإجابات بـ 5" : "Tout préremplir (5/5)"}
      </button>

      {/* Questions */}
      <div className="space-y-4">
        <p className="text-sm text-gray-600 mb-6">
          {t.questionInstruction}
        </p>

        {currentQuestions.map((question, index) => {
          const questionKey = `${currentCategoryName}_${index}`;
          const currentAnswer = answers[questionKey];
          const hasAnswered = currentAnswer !== undefined;

          return (
            <div key={index} className={`bg-white rounded-lg p-4 border shadow-sm transition-all ${hasAnswered ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}>
              <div className={`flex justify-between items-start mb-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <p className={`text-gray-800 flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <span className="text-sm text-gray-500">
                    {index + 1}.
                  </span>
                  {question}
                </p>
                {hasAnswered && (
                  <span className="text-xs text-green-600 font-medium ml-2">
                    ✓ {currentAnswer}/5
                  </span>
                )}
              </div>

              <div className={`flex justify-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                {[1, 2, 3, 4, 5].map(value => (
                  <button
                    key={value}
                    onClick={() => handleAnswer(index, value)}
                    className={`w-10 h-10 rounded-full border-2 font-medium transition-all ${currentAnswer === value
                      ? 'bg-blue-500 border-blue-500 text-white scale-110'
                      : 'border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                      }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>


      {/* Navigation - mise à jour pour afficher l'état de chargement */}
      <div className={`flex justify-between items-center pt-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
        <button
          type="button"
          onClick={handlePrevious}
          disabled={isSubmitting}
          className={`inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            } ${language === 'ar' ? 'flex-row-reverse' : ''}`}
        >
          {language === 'ar' ? (
            <>
              <ArrowRightIcon className="w-4 h-4" />
              <span>{currentCategory > 0 ? t.previousCategory : t.previous}</span>
            </>
          ) : (
            <>
              <ArrowLeftIcon className="w-4 h-4" />
              <span>{currentCategory > 0 ? t.previousCategory : t.previous}</span>
            </>
          )}
        </button>

        <button
          onClick={handleNext}
          disabled={!isCurrentCategoryComplete || isSubmitting}
          className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${language === 'ar' ? 'flex-row-reverse' : ''
            }`}
        >
          {isSubmitting ? (
            <>
              <Loader2Icon className="w-4 h-4 animate-spin" />
              <span>{language === 'ar' ? 'جار الحفظ...' : 'Enregistrement...'}</span>
            </>
          ) : language === 'ar' ? (
            <>
              <ArrowLeftIcon className="w-4 h-4" />
              <span>{currentCategory < categories.length - 1 ? t.nextCategory : t.finishTest}</span>
            </>
          ) : (
            <>
              <span>{currentCategory < categories.length - 1 ? t.nextCategory : t.finishTest}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RiasecTest;