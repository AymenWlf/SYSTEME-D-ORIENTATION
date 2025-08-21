import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, ArrowLeftIcon, Loader2Icon, CheckIcon } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { getAuthToken } from '../utils/auth';

interface PersonalityTestProps {
  onComplete: (data: any) => void;
  onPrevious: () => void;
  canGoBack: boolean;
  language: string;
  sessionData?: any; // Données de session existantes
}

interface LearningStyleResponse {
  selectedStyle: string;
  styleLabel: string;
  styleDescription: string;
  timestamp: Date;
  responseTime: number;
}

interface QuestionResponse {
  questionId: string;
  questionText: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  responseTime: number;
  timestamp: Date;
  testType: string;
  questionIndex: number;
  selectedOption: string;
  correctOption: string;
}

const personalityQuestions = {
  Ouverture: {
    fr: [
      "J'aime explorer de nouvelles idées et concepts",
      "Je suis curieux(se) des cultures et des façons de penser différentes",
      "J'apprécie l'art, la musique et la littérature",
      "J'aime résoudre des problèmes complexes",
      "Je préfère essayer de nouvelles méthodes plutôt que de suivre les traditions"
    ],
    ar: [
      "أحب استكشاف أفكار ومفاهيم جديدة",
      "أنا فضولي حول الثقافات وطرق التفكير المختلفة",
      "أقدر الفن والموسيقى والأدب",
      "أحب حل المشاكل المعقدة",
      "أفضل تجريب طرق جديدة بدلاً من اتباع التقاليد"
    ]
  },
  Organisation: {
    fr: [
      "Je planifie mes activités à l'avance",
      "Je respecte toujours mes échéances",
      "J'aime que mon espace de travail soit bien organisé",
      "Je préfère avoir une routine quotidienne stable",
      "Je termine toujours ce que j'ai commencé"
    ],
    ar: [
      "أخطط لأنشطتي مسبقاً",
      "أحترم دائماً مواعيدي النهائية",
      "أحب أن يكون مساحة عملي منظماً جيداً",
      "أفضل أن تكون لدي روتين يومي مستقر",
      "أنهي دائماً ما بدأته"
    ]
  },
  Sociabilité: {
    fr: [
      "J'aime rencontrer de nouvelles personnes",
      "Je me sens à l'aise lors de présentations publiques",
      "Je préfère travailler en équipe plutôt que seul(e)",
      "J'aime les fêtes et les événements sociaux",
      "Je commence facilement des conversations avec des inconnus"
    ],
    ar: [
      "أحب مقابلة أشخاص جدد",
      "أشعر بالراحة أثناء العروض التقديمية العامة",
      "أفضل العمل في فريق بدلاً من العمل وحدي",
      "أحب الحفلات والفعاليات الاجتماعية",
      "أبدأ المحادثات بسهولة مع الغرباء"
    ]
  },
  'Gestion du stress': {
    fr: [
      "Je reste calme sous la pression",
      "Je gère bien les situations d'urgence",
      "Les critiques ne m'affectent pas beaucoup",
      "Je rebondis rapidement après un échec",
      "Je dors bien même quand j'ai des soucis"
    ],
    ar: [
      "أبقى هادئاً تحت الضغط",
      "أتعامل جيداً مع حالات الطوارئ",
      "الانتقادات لا تؤثر علي كثيراً",
      "أتعافى بسرعة بعد الفشل",
      "أنام جيداً حتى عندما تكون لدي مشاكل"
    ]
  },
  Leadership: {
    fr: [
      "J'aime prendre des décisions importantes",
      "Les autres viennent souvent me demander des conseils",
      "J'aime convaincre les autres de mes idées",
      "Je me porte volontaire pour diriger des projets",
      "J'aime être responsable des résultats d'une équipe"
    ],
    ar: [
      "أحب اتخاذ قرارات مهمة",
      "يأتي الآخرون غالباً لطلب نصيحتي",
      "أحب إقناع الآخرين بأفكاري",
      "أتطوع لقيادة المشاريع",
      "أحب أن أكون مسؤولاً عن نتائج الفريق"
    ]
  },
  // NOUVEAUX TRAITS
  Autonomie: {
    fr: [
      "Je préfère résoudre mes problèmes par moi-même",
      "Je m'organise facilement sans avoir besoin de supervision",
      "Je prends souvent l'initiative sans attendre les instructions",
      "Je me fixe des objectifs personnels et je les atteins",
      "Je recherche activement des ressources pour apprendre par moi-même"
    ],
    ar: [
      "أفضل حل مشاكلي بنفسي",
      "أنظم نفسي بسهولة دون الحاجة إلى إشراف",
      "غالباً ما أخذ المبادرة دون انتظار التعليمات",
      "أضع لنفسي أهدافاً شخصية وأحققها",
      "أبحث بنشاط عن موارد للتعلم بنفسي"
    ]
  },
  Persévérance: {
    fr: [
      "Je continue à travailler sur une tâche difficile jusqu'à ce qu'elle soit terminée",
      "Les obstacles me motivent à redoubler d'efforts",
      "Je ne me décourage pas facilement face aux échecs",
      "Je suis prêt(e) à m'entraîner longtemps pour maîtriser une compétence",
      "Je préfère les projets qui demandent un effort soutenu"
    ],
    ar: [
      "أواصل العمل على مهمة صعبة حتى تكتمل",
      "العقبات تحفزني على مضاعفة جهودي",
      "لا أحبط بسهولة عند مواجهة الفشل",
      "أنا مستعد للتدرب لفترة طويلة لإتقان مهارة ما",
      "أفضل المشاريع التي تتطلب جهداً مستمراً"
    ]
  },
  Créativité: {
    fr: [
      "Je trouve souvent des solutions originales aux problèmes",
      "J'aime imaginer de nouvelles façons de faire les choses",
      "Je m'exprime facilement de manière artistique ou créative",
      "Je vois des connexions entre des idées apparemment sans rapport",
      "J'apprécie les activités qui me permettent d'inventer ou de créer"
    ],
    ar: [
      "غالباً ما أجد حلولاً مبتكرة للمشاكل",
      "أحب تخيل طرق جديدة للقيام بالأشياء",
      "أعبر عن نفسي بسهولة بطريقة فنية أو إبداعية",
      "أرى روابط بين أفكار تبدو غير مترابطة",
      "أقدر الأنشطة التي تسمح لي بالابتكار أو الإبداع"
    ]
  },
  Adaptabilité: {
    fr: [
      "Je m'adapte facilement aux changements de situation",
      "Je suis à l'aise dans des environnements nouveaux ou inconnus",
      "Je peux rapidement changer de stratégie si nécessaire",
      "Je suis ouvert(e) à modifier mes opinions face à de nouvelles informations",
      "Je réagis bien aux imprévus et aux surprises"
    ],
    ar: [
      "أتكيف بسهولة مع تغيرات الظروف",
      "أشعر بالراحة في بيئات جديدة أو غير مألوفة",
      "يمكنني تغيير استراتيجيتي بسرعة إذا لزم الأمر",
      "أنا منفتح على تعديل آرائي في مواجهة معلومات جديدة",
      "أتفاعل بشكل جيد مع المواقف غير المتوقعة والمفاجآت"
    ]
  }
};

const traitNames = {
  fr: {
    Ouverture: "Ouverture",
    Organisation: "Organisation",
    Sociabilité: "Sociabilité",
    'Gestion du stress': "Gestion du stress",
    Leadership: "Leadership",
    Autonomie: "Autonomie",
    Persévérance: "Persévérance",
    Créativité: "Créativité",
    Adaptabilité: "Adaptabilité"
  },
  ar: {
    Ouverture: "الانفتاح",
    Organisation: "التنظيم",
    Sociabilité: "الاجتماعية",
    'Gestion du stress': "إدارة الضغط",
    Leadership: "القيادة",
    Autonomie: "الاستقلالية",
    Persévérance: "المثابرة",
    Créativité: "الإبداع",
    Adaptabilité: "التكيف"
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

const translations = {
  fr: {
    testTitle: "Test de personnalité académique",
    testSubtitle: "Découvrez vos traits de personnalité pour les études",
    questionInstruction: "Indiquez votre niveau d'accord avec chaque affirmation (1 = Pas du tout d'accord, 5 = Tout à fait d'accord)",
    learningStyleTitle: "Style d'apprentissage préféré",
    learningStyleSubtitle: "Comment apprenez-vous le mieux ?",
    previous: "Précédent",
    continue: "Continuer"
  },
  ar: {
    testTitle: "اختبار الشخصية الأكاديمية",
    testSubtitle: "اكتشف سمات شخصيتك للدراسات",
    questionInstruction: "حدد مستوى موافقتك مع كل عبارة (1 = لا أوافق إطلاقاً، 5 = أوافق تماماً)",
    learningStyleTitle: "أسلوب التعلم المفضل",
    learningStyleSubtitle: "كيف تتعلم بشكل أفضل؟",
    previous: "السابق",
    continue: "متابعة"
  }
};

const PersonalityTest: React.FC<PersonalityTestProps> = ({ onComplete, onPrevious, canGoBack, language = 'fr', sessionData }) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [learningStyle, setLearningStyle] = useState('');

  // Nouvelles states pour capturer les détails
  const [detailedResponses, setDetailedResponses] = useState<QuestionResponse[]>([]);
  const [learningStyleResponse, setLearningStyleResponse] = useState<LearningStyleResponse | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [sessionStartTime] = useState(Date.now());
  const [learningStyleStartTime, setLearningStyleStartTime] = useState<number | null>(null);

  // Nouveaux états pour l'intégration avec le backend
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Récupérer le token d'authentification
  const token = getAuthToken();

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = !!token;

  const t = translations[language as 'fr' | 'ar'] || translations.fr;
  const styles = learningStyles[language as 'fr' | 'ar'] || learningStyles.fr;
  const traits = Object.keys(personalityQuestions);

  // Créer une constante pour les traits afin d'éviter les recalculs à chaque rendu
  const PERSONALITY_TRAITS = Object.keys(personalityQuestions);

  // Vérifier si des données existent déjà et les charger
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        // Si des données de session sont fournies directement, les utiliser
        if (sessionData && sessionData.currentStep && sessionData.currentStep.personality) {
          console.log("Données de personnalité trouvées dans la session:", sessionData.currentStep.personality);
          const personalityData = sessionData.currentStep.personality.personality || {};

          // Restaurer les réponses si elles existent
          if (personalityData.rawAnswers) {
            console.log("Restauration des réponses:", personalityData.rawAnswers);
            setAnswers(personalityData.rawAnswers);
          }

          // Restaurer les réponses détaillées si elles existent
          if (personalityData.detailedResponses) {
            console.log("Restauration des réponses détaillées:", personalityData.detailedResponses);
            setDetailedResponses(personalityData.detailedResponses);
          }

          // Restaurer le style d'apprentissage
          if (personalityData.learningStyle) {
            console.log("Restauration du style d'apprentissage:", personalityData.learningStyle);
            setLearningStyle(personalityData.learningStyle);

            // Recréer la réponse du style d'apprentissage
            if (personalityData.learningStyleResponse) {
              setLearningStyleResponse(personalityData.learningStyleResponse);
            } else {
              // Si pas de réponse détaillée, créer une version simplifiée
              const selectedStyleData = styles.find(style => style.value === personalityData.learningStyle);
              if (selectedStyleData) {
                setLearningStyleResponse({
                  selectedStyle: personalityData.learningStyle,
                  styleLabel: selectedStyleData.label,
                  styleDescription: selectedStyleData.description,
                  timestamp: new Date(),
                  responseTime: 0
                });
              }
            }
          }

          setDataLoaded(true);
          setIsLoading(false);
          return;
        }

        // Sinon, récupérer les données depuis l'API
        console.log("Récupération des données de personnalité depuis l'API");
        const response = await axios.get(`${API_BASE_URL}/orientation-test/my-test`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success && response.data.hasTest) {
          console.log("Données de test récupérées avec succès:", response.data);
          // Extraire les données de personnalité si elles existent
          const testData = response.data.data;
          if (testData.currentStep && testData.currentStep.personality) {
            console.log("Données de personnalité trouvées dans la réponse API:", testData.currentStep.personality);
            const personalityData = testData.currentStep.personality.personality || {};

            // Restaurer les réponses si elles existent
            if (personalityData.rawAnswers) {
              console.log("Restauration des réponses depuis l'API:", personalityData.rawAnswers);
              setAnswers(personalityData.rawAnswers);
            }

            // Restaurer les réponses détaillées si elles existent
            if (personalityData.detailedResponses) {
              console.log("Restauration des réponses détaillées depuis l'API:", personalityData.detailedResponses);
              setDetailedResponses(personalityData.detailedResponses);
            }

            // Restaurer le style d'apprentissage
            if (personalityData.learningStyle) {
              console.log("Restauration du style d'apprentissage depuis l'API:", personalityData.learningStyle);
              setLearningStyle(personalityData.learningStyle);

              // Recréer la réponse du style d'apprentissage
              if (personalityData.learningStyleResponse) {
                setLearningStyleResponse(personalityData.learningStyleResponse);
              } else {
                // Si pas de réponse détaillée, créer une version simplifiée
                const selectedStyleData = styles.find(style => style.value === personalityData.learningStyle);
                if (selectedStyleData) {
                  setLearningStyleResponse({
                    selectedStyle: personalityData.learningStyle,
                    styleLabel: selectedStyleData.label,
                    styleDescription: selectedStyleData.description,
                    timestamp: new Date(),
                    responseTime: 0
                  });
                }
              }
            }

            setDataLoaded(true);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données de personnalité:", err);
        // Ne pas afficher d'erreur à l'utilisateur, simplement continuer avec le formulaire vide
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, token, sessionData, language, styles]);


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
      console.log("Soumission des données de personnalité au backend:", completionData);

      // Préparer les données à envoyer
      const personalityData = {
        stepName: 'personality',
        stepData: {
          personality: completionData,
          timestamp: new Date().toISOString()
        },
        stepNumber: 3, // Supposons que c'est la 3ème étape après riasec
        duration: completionData.sessionDuration || 0
      };

      // Envoyer les données à l'API
      const response = await axios.post(
        `${API_BASE_URL}/orientation-test/save-step`,
        personalityData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        console.log('Test de personnalité enregistré avec succès', response.data);

        // Appeler onComplete pour passer à l'étape suivante
        onComplete({
          ...completionData,
          sessionData: response.data
        });
      } else {
        // Gérer le cas où l'API retourne success: false
        setError(response.data.message || (language === 'ar'
          ? 'حدث خطأ أثناء حفظ اختبار الشخصية'
          : 'Une erreur est survenue lors de l\'enregistrement du test de personnalité'));
      }
    } catch (err) {
      console.error('Erreur lors de la soumission du test de personnalité', err);

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

  const handleAnswer = (trait: string, questionIndex: number, value: number) => {
    const key = `${trait}_${questionIndex}`;
    const responseTime = Date.now() - questionStartTime;

    // Enregistrer la réponse simple
    setAnswers(prev => ({ ...prev, [key]: value }));

    // Obtenir le texte de la question
    const traitData = personalityQuestions[trait as keyof typeof personalityQuestions];
    const questions = traitData?.[language as 'fr' | 'ar'] || [];
    const questionText = questions[questionIndex];

    if (questionText) {
      const questionResponse: QuestionResponse = {
        questionId: key,
        questionText,
        userAnswer: value,
        responseTime,
        timestamp: new Date(),
        trait,
        questionIndex
      };

      // Mettre à jour les réponses détaillées (remplacer si déjà répondu)
      setDetailedResponses(prevResponses => {
        const filteredResponses = prevResponses.filter(r => r.questionId !== key);
        const newResponses = [...filteredResponses, questionResponse].sort((a, b) => {
          if (a.trait !== b.trait) {
            return traits.indexOf(a.trait) - traits.indexOf(b.trait);
          }
          return a.questionIndex - b.questionIndex;
        });

        console.log(`🧠 Personality Response Captured:`, {
          trait,
          question: questionText.substring(0, 50) + '...',
          answer: value,
          responseTime: `${responseTime}ms`,
          totalResponses: newResponses.length
        });

        return newResponses;
      });
    }

    // Reset timer pour la prochaine question
    setQuestionStartTime(Date.now());
  };

  const handleLearningStyleChange = (value: string) => {
    const responseTime = learningStyleStartTime ? Date.now() - learningStyleStartTime : 0;
    const selectedStyleData = styles.find(style => style.value === value);

    setLearningStyle(value);

    if (selectedStyleData) {
      const styleResponse: LearningStyleResponse = {
        selectedStyle: value,
        styleLabel: selectedStyleData.label,
        styleDescription: selectedStyleData.description,
        timestamp: new Date(),
        responseTime
      };

      setLearningStyleResponse(styleResponse);

      console.log(`🎨 Learning Style Selected:`, {
        style: selectedStyleData.label,
        responseTime: `${responseTime}ms`,
        description: selectedStyleData.description
      });
    }
  };


  const handleSubmit = () => {
    console.group('🧠 Personality Test Completion');
    console.log('Calculating scores and preparing detailed data...');

    // Calculate scores for each trait
    const scores: Record<string, number> = {};
    let totalQuestions = 0;
    let totalResponses = detailedResponses.length;

    traits.forEach((trait) => {
      let total = 0;
      let answered = 0;

      const traitData = personalityQuestions[trait as keyof typeof personalityQuestions];
      const questions = traitData?.[language as 'fr' | 'ar'] || [];
      totalQuestions += questions.length;

      questions.forEach((_, index) => {
        const key = `${trait}_${index}`;
        if (answers[key] !== undefined) {
          total += answers[key];
          answered++;
        }
      });

      scores[trait] = answered > 0 ? Math.round((total / answered) * 20) : 0;
      console.log(`${trait}: ${answered}/${questions.length} answered, score: ${scores[trait]}`);
    });

    // Calculer les statistiques temporelles
    const avgResponseTime = detailedResponses.length > 0
      ? detailedResponses.reduce((sum, r) => sum + r.responseTime, 0) / detailedResponses.length
      : 0;

    // Identifier les traits dominants
    const sortedTraits = Object.entries(scores)
      .sort(([, a], [, b]) => (b as number) - (a as number));
    const dominantTraits = sortedTraits.slice(0, Math.ceil(sortedTraits.length / 2)).map(([trait]) => trait);

    // Créer la session
    const session = {
      testType: 'personality',
      startedAt: new Date(sessionStartTime),
      completedAt: new Date(),
      duration: Date.now() - sessionStartTime,
      language: language as 'fr' | 'ar',
      totalQuestions: totalQuestions + 1, // +1 pour le style d'apprentissage
      questions: [
        ...detailedResponses.map(response => ({
          questionId: response.questionId,
          questionText: response.questionText,
          userAnswer: response.userAnswer,
          responseTime: response.responseTime,
          timestamp: response.timestamp
        })),
        // Ajouter la réponse du style d'apprentissage comme "question"
        ...(learningStyleResponse ? [{
          questionId: 'learning_style',
          questionText: t.learningStyleSubtitle,
          userAnswer: learningStyleResponse.selectedStyle,
          responseTime: learningStyleResponse.responseTime,
          timestamp: learningStyleResponse.timestamp
        }] : [])
      ]
    };

    // Statistiques par trait
    const traitStats = traits.map(trait => {
      const traitResponses = detailedResponses.filter(r => r.trait === trait);
      return {
        trait,
        score: scores[trait],
        questionsAnswered: traitResponses.length,
        avgResponseTime: traitResponses.length > 0
          ? Math.round(traitResponses.reduce((sum, r) => sum + r.responseTime, 0) / traitResponses.length)
          : 0
      };
    });

    console.log('Final Statistics:', {
      totalQuestions,
      totalResponses,
      avgResponseTime: Math.round(avgResponseTime),
      dominantTraits,
      learningStyle,
      sessionDuration: session.duration
    });
    console.groupEnd();

    const completionData = {
      scores,
      learningStyle,
      rawAnswers: answers,
      session,
      detailedResponses,
      learningStyleResponse,
      totalQuestions,
      totalResponses,
      avgResponseTime: Math.round(avgResponseTime),
      dominantTraits,
      sessionDuration: session.duration,
      completedAt: new Date(),
      traitStats
    };

    // Appeler submitTestData au lieu de onComplete directement
    submitTestData(completionData);
  };

  const isComplete = traits.every((trait) => {
    const traitData = personalityQuestions[trait as keyof typeof personalityQuestions];
    const questions = traitData?.[language as 'fr' | 'ar'] || [];
    return questions.every((_, index) => answers[`${trait}_${index}`] !== undefined);
  }) && learningStyle;

  const getTraitName = (trait: string) => {
    return traitNames[language as 'fr' | 'ar'][trait as keyof typeof traitNames.fr] || trait;
  };

  // Calculer les statistiques de progression
  const getTotalQuestionsAnswered = () => {
    return Object.keys(answers).length;
  };

  const getTotalQuestions = () => {
    return traits.reduce((total, trait) => {
      const traitData = personalityQuestions[trait as keyof typeof personalityQuestions];
      const questions = traitData?.[language as 'fr' | 'ar'] || [];
      return total + questions.length;
    }, 0);
  };

  // Si le chargement est en cours, afficher un indicateur
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2Icon className="w-12 h-12 text-purple-600 animate-spin" />
        <p className="text-gray-600">
          {language === 'ar'
            ? 'جاري تحميل اختبار الشخصية...'
            : 'Chargement du test de personnalité...'}
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

        {/* Afficher un message si des données ont été chargées */}
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
          className="mt-6 mb-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 transition"
          onClick={() => {
            // Préremplir toutes les réponses à 5 pour chaque question
            const newAnswers: Record<string, number> = {};
            const newDetailedResponses: QuestionResponse[] = [];
            const now = Date.now();

            traits.forEach((trait) => {
              const traitData = personalityQuestions[trait as keyof typeof personalityQuestions];
              const questions = traitData?.[language as 'fr' | 'ar'] || [];
              questions.forEach((questionText, questionIndex) => {
                const key = `${trait}_${questionIndex}`;
                newAnswers[key] = 5;
                newDetailedResponses.push({
                  questionId: key,
                  questionText,
                  userAnswer: 5,
                  responseTime: 1000,
                  timestamp: new Date(),
                  trait,
                  questionIndex
                });
              });
            });

            setAnswers(newAnswers);
            setDetailedResponses(newDetailedResponses);

            // Préremplir le style d'apprentissage avec le premier style
            const selectedStyleData = styles[0];
            setLearningStyle(selectedStyleData.value);
            setLearningStyleResponse({
              selectedStyle: selectedStyleData.value,
              styleLabel: selectedStyleData.label,
              styleDescription: selectedStyleData.description,
              timestamp: new Date(),
              responseTime: 1000
            });
          }}
        >
          {language === 'ar' ? "تعبئة جميع الإجابات بـ 5" : "Tout préremplir (5/5)"}
        </button>
        {/* Progress Statistics */}
        {detailedResponses.length > 0 && (
          <div className="bg-purple-50 rounded-lg p-3 mt-4">
            <div className={`text-sm text-purple-700 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {language === 'ar'
                ? `التقدم: ${getTotalQuestionsAnswered()}/${getTotalQuestions()} أسئلة`
                : `Progression: ${getTotalQuestionsAnswered()}/${getTotalQuestions()} questions`
              }
              {detailedResponses.length > 0 && (
                <span className="ml-4">
                  {language === 'ar'
                    ? `متوسط الوقت: ${Math.round(detailedResponses.reduce((sum, r) => sum + r.responseTime, 0) / detailedResponses.length / 1000)}ث`
                    : `Temps moyen: ${Math.round(detailedResponses.reduce((sum, r) => sum + r.responseTime, 0) / detailedResponses.length / 1000)}s`
                  }
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Personality Questions */}
      {traits.map((trait, traitIndex) => {
        const traitData = personalityQuestions[trait as keyof typeof personalityQuestions];
        const questions = traitData?.[language as 'fr' | 'ar'] || [];
        const traitResponses = detailedResponses.filter(r => r.trait === trait);

        return (
          <div key={trait} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
            <div className={`flex justify-between items-center mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <h3 className="text-lg font-semibold text-gray-900">
                {getTraitName(trait)}
              </h3>
              <div className="text-right">
                <div className="text-sm text-purple-600">
                  {traitResponses.length}/{questions.length}
                </div>
                <div className="text-xs text-gray-500">
                  {language === 'ar' ? 'مُجاب عليها' : 'répondues'}
                </div>
              </div>
            </div>

            <p className={`text-sm text-gray-600 mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {t.questionInstruction}
            </p>

            <div className="space-y-4">
              {questions.map((question, questionIndex) => {
                const key = `${trait}_${questionIndex}`;
                const currentAnswer = answers[key];
                const hasAnswered = currentAnswer !== undefined;

                return (
                  <div key={questionIndex} className={`bg-white rounded-lg p-4 border shadow-sm transition-all ${hasAnswered ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
                    }`}>
                    <div className={`flex justify-between items-start mb-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <p className={`text-gray-800 flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        {question}
                      </p>
                      {hasAnswered && (
                        <span className="text-xs text-purple-600 font-medium ml-2">
                          ✓ {currentAnswer}/5
                        </span>
                      )}
                    </div>

                    <div className={`flex justify-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      {[1, 2, 3, 4, 5].map(value => (
                        <button
                          key={value}
                          onClick={() => handleAnswer(trait, questionIndex, value)}
                          className={`w-10 h-10 rounded-full border-2 font-medium transition-all ${currentAnswer === value
                            ? 'bg-purple-500 border-purple-500 text-white scale-110'
                            : 'border-gray-300 text-gray-600 hover:border-purple-300 hover:text-purple-600'
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
          </div>
        );
      })}

      {/* Learning Style */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6">
        <div className={`flex justify-between items-center mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <h3 className="text-lg font-semibold text-gray-900">{t.learningStyleTitle}</h3>
          {learningStyle && (
            <div className="text-right">
              <div className="text-sm text-green-600">✓</div>
              <div className="text-xs text-gray-500">
                {language === 'ar' ? 'مختار' : 'sélectionné'}
              </div>
            </div>
          )}
        </div>
        <p className={`text-gray-600 mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          {t.learningStyleSubtitle}
        </p>

        <div className="grid md:grid-cols-2 gap-3">
          {styles.map(({ value, label, description }) => (
            <button
              key={value}
              onClick={() => handleLearningStyleChange(value)}
              className={`p-4 rounded-lg border-2 transition-all ${learningStyle === value
                ? 'border-green-500 bg-green-100'
                : 'border-gray-300 hover:border-green-300'
                } ${language === 'ar' ? 'text-right' : 'text-left'}`}
            >
              <div className="font-medium text-gray-900">{label}</div>
              <div className="text-sm text-gray-600 mt-1">{description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Modifier le bouton de soumission pour afficher l'état de chargement */}
      <div className={`flex justify-between items-center pt-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
        <button
          type="button"
          onClick={onPrevious}
          disabled={isSubmitting}
          className={`inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            } ${language === 'ar' ? 'flex-row-reverse' : ''}`}
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

export default PersonalityTest;