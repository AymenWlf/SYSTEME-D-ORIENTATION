import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';
// Ajouter ces imports en haut du fichier
import { Loader2Icon, CheckIcon } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { getAuthToken } from '../utils/auth';

interface InterestsTestProps {
  onComplete: (data: any) => void;
  onPrevious: () => void;
  canGoBack: boolean;
  language: string;
  sessionData?: any; // Ajouter cette ligne

}

interface FieldResponse {
  fieldId: string;
  fieldName: string;
  category: string;
  interestLevel: number | null;
  motivationLevel: number | null;
  effortSupported: boolean;
  interestResponseTime: number | null;
  motivationResponseTime: number | null;
  effortResponseTime: number | null;
  timestamp: Date;
  fieldIndex: number;
}

const academicFields = {
  fr: [
    { name: 'Mathématiques', category: 'Sciences' },
    { name: 'Physique', category: 'Sciences' },
    { name: 'Chimie', category: 'Sciences' },
    { name: 'Biologie', category: 'Sciences' },
    { name: 'Informatique', category: 'Sciences' },
    { name: 'Ingénierie', category: 'Sciences' },
    { name: 'Médecine', category: 'Santé' },
    { name: 'Pharmacie', category: 'Santé' },
    { name: 'Dentaire', category: 'Santé' },
    { name: 'Psychologie', category: 'Sciences humaines' },
    { name: 'Sociologie', category: 'Sciences humaines' },
    { name: 'Histoire', category: 'Sciences humaines' },
    { name: 'Géographie', category: 'Sciences humaines' },
    { name: 'Philosophie', category: 'Sciences humaines' },
    { name: 'Littérature française', category: 'Langues et littérature' },
    { name: 'Littérature arabe', category: 'Langues et littérature' },
    { name: 'Langues étrangères', category: 'Langues et littérature' },
    { name: 'Économie', category: 'Commerce et gestion' },
    { name: 'Gestion', category: 'Commerce et gestion' },
    { name: 'Comptabilité', category: 'Commerce et gestion' },
    { name: 'Marketing', category: 'Commerce et gestion' },
    { name: 'Droit', category: 'Juridique' },
    { name: 'Sciences politiques', category: 'Juridique' },
    { name: 'Arts plastiques', category: 'Arts' },
    { name: 'Musique', category: 'Arts' },
    { name: 'Design', category: 'Arts' },
    { name: 'Architecture', category: 'Arts' }
  ],
  ar: [
    { name: 'الرياضيات', category: 'العلوم' },
    { name: 'الفيزياء', category: 'العلوم' },
    { name: 'الكيمياء', category: 'العلوم' },
    { name: 'علم الأحياء', category: 'العلوم' },
    { name: 'المعلوماتية', category: 'العلوم' },
    { name: 'الهندسة', category: 'العلوم' },
    { name: 'الطب', category: 'الصحة' },
    { name: 'الصيدلة', category: 'الصحة' },
    { name: 'طب الأسنان', category: 'الصحة' },
    { name: 'علم النفس', category: 'العلوم الإنسانية' },
    { name: 'علم الاجتماع', category: 'العلوم الإنسانية' },
    { name: 'التاريخ', category: 'العلوم الإنسانية' },
    { name: 'الجغرافيا', category: 'العلوم الإنسانية' },
    { name: 'الفلسفة', category: 'العلوم الإنسانية' },
    { name: 'الأدب الفرنسي', category: 'اللغات والأدب' },
    { name: 'الأدب العربي', category: 'اللغات والأدب' },
    { name: 'اللغات الأجنبية', category: 'اللغات والأدب' },
    { name: 'الاقتصاد', category: 'التجارة والتسيير' },
    { name: 'التسيير', category: 'التجارة والتسيير' },
    { name: 'المحاسبة', category: 'التجارة والتسيير' },
    { name: 'التسويق', category: 'التجارة والتسيير' },
    { name: 'القانون', category: 'القانوني' },
    { name: 'العلوم السياسية', category: 'القانوني' },
    { name: 'الفنون التشكيلية', category: 'الفنون' },
    { name: 'الموسيقى', category: 'الفنون' },
    { name: 'التصميم', category: 'الفنون' },
    { name: 'الهندسة المعمارية', category: 'الفنون' }
  ]
};

const translations = {
  fr: {
    testTitle: "Intérêts académiques",
    testSubtitle: "Évaluez votre intérêt et motivation pour chaque domaine",
    interestLevel: "Intérêt (1-5)",
    motivationLevel: "Motivation (1-5)",
    acceptableByEffort: "Acceptable par effort",
    yes: "Oui",
    no: "Non",
    adviceTitle: "Conseil",
    adviceText: "Soyez honnête dans vos évaluations. L'intérêt mesure votre attirance naturelle, la motivation votre volonté de réussir, et \"acceptable par effort\" indique les domaines que vous pourriez étudier même sans passion particulière.",
    previous: "Précédent",
    continue: "Continuer"
  },
  ar: {
    testTitle: "الاهتمامات الأكاديمية",
    testSubtitle: "قيم اهتمامك وتحفيزك لكل مجال",
    interestLevel: "الاهتمام (1-5)",
    motivationLevel: "التحفيز (1-5)",
    acceptableByEffort: "مقبول بالجهد",
    yes: "نعم",
    no: "لا",
    adviceTitle: "نصيحة",
    adviceText: "كن صادقاً في تقييمك. الاهتمام يقيس انجذابك الطبيعي، والتحفيز يقيس إرادتك في النجاح، و\"مقبول بالجهد\" يشير إلى المجالات التي يمكنك دراستها حتى بدون شغف خاص.",
    previous: "السابق",
    continue: "متابعة"
  }
};

const InterestsTest: React.FC<InterestsTestProps> = ({ onComplete, onPrevious, canGoBack, language = 'fr', sessionData }) => {
  // États existants...
  const [interests, setInterests] = useState<Record<string, number>>({});
  const [motivations, setMotivations] = useState<Record<string, number>>({});
  const [effortSupported, setEffortSupported] = useState<string[]>([]);
  const [detailedResponses, setDetailedResponses] = useState<Record<string, FieldResponse>>({});
  const [currentFieldStartTime, setCurrentFieldStartTime] = useState<Record<string, number>>({});
  const [sessionStartTime] = useState(Date.now());

  // Nouveaux états pour l'intégration avec le backend
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Récupérer le token d'authentification
  const token = getAuthToken();

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = !!token;

  // Sélectionner les champs en fonction de la langue
  const currentFields = academicFields[language as 'fr' | 'ar'] || academicFields.fr;

  // Alias pour les traductions en fonction de la langue
  const t = translations[language as 'fr' | 'ar'] || translations.fr;

  // Ajouter un useEffect pour récupérer les données
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        // Si des données de session sont fournies directement, les utiliser
        if (sessionData && sessionData.currentStep && sessionData.currentStep.interests) {
          console.log("Données d'intérêts trouvées dans la session:", sessionData.currentStep.interests);
          const interestsData = sessionData.currentStep.interests.interests || {};

          // Restaurer les intérêts si ils existent
          if (interestsData.fieldInterests) {
            console.log("Restauration des intérêts:", interestsData.fieldInterests);
            setInterests(interestsData.fieldInterests);
          }

          // Restaurer les motivations si elles existent
          if (interestsData.fieldMotivations) {
            console.log("Restauration des motivations:", interestsData.fieldMotivations);
            setMotivations(interestsData.fieldMotivations);
          }

          // Restaurer les efforts supportés
          if (interestsData.effortSupported) {
            console.log("Restauration des efforts supportés:", interestsData.effortSupported);
            setEffortSupported(interestsData.effortSupported);
          }

          // Restaurer les réponses détaillées si elles existent
          if (interestsData.detailedResponses) {
            console.log("Restauration des réponses détaillées:", interestsData.detailedResponses);
            setDetailedResponses(interestsData.detailedResponses);
          }

          setDataLoaded(true);
          setIsLoading(false);
          return;
        }

        // Sinon, récupérer les données depuis l'API
        console.log("Récupération des données d'intérêts depuis l'API");
        const response = await axios.get(`${API_BASE_URL}/orientation-test/my-test`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success && response.data.hasTest) {
          console.log("Données de test récupérées avec succès:", response.data);
          // Extraire les données d'intérêts si elles existent
          const testData = response.data.data;
          if (testData.currentStep && testData.currentStep.interests) {
            console.log("Données d'intérêts trouvées dans la réponse API:", testData.currentStep.interests);
            const interestsData = testData.currentStep.interests.interests || {};

            // Restaurer les intérêts si ils existent
            if (interestsData.fieldInterests) {
              console.log("Restauration des intérêts depuis l'API:", interestsData.fieldInterests);
              setInterests(interestsData.fieldInterests);
            }

            // Restaurer les motivations si elles existent
            if (interestsData.fieldMotivations) {
              console.log("Restauration des motivations depuis l'API:", interestsData.fieldMotivations);
              setMotivations(interestsData.fieldMotivations);
            }

            // Restaurer les efforts supportés
            if (interestsData.effortSupported) {
              console.log("Restauration des efforts supportés depuis l'API:", interestsData.effortSupported);
              setEffortSupported(interestsData.effortSupported);
            }

            // Restaurer les réponses détaillées si elles existent
            if (interestsData.detailedResponses) {
              console.log("Restauration des réponses détaillées depuis l'API:", interestsData.detailedResponses);
              setDetailedResponses(interestsData.detailedResponses);
            }

            setDataLoaded(true);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données d'intérêts:", err);
        // Ne pas afficher d'erreur à l'utilisateur, simplement continuer avec le formulaire vide
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, token, sessionData, language]);

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
      console.log("Soumission des données d'intérêts au backend:", completionData);

      // Préparer les données à envoyer en suivant la même structure que PersonalityTest
      const interestsData = {
        stepName: 'interests',
        stepData: {
          interests: completionData,
          timestamp: new Date().toISOString()
        },
        stepNumber: 4, // Supposons que c'est la 4ème étape après personality
        duration: completionData.sessionDuration || 0,
        isCompleted: true // Ajouter ce flag explicite
      };

      // Envoyer les données à l'API avec le même endpoint que PersonalityTest
      const response = await axios.post(
        `${API_BASE_URL}/orientation-test/save-step`,
        interestsData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        console.log('Test d\'intérêts enregistré avec succès', response.data);

        // Appeler onComplete pour passer à l'étape suivante
        onComplete({
          ...completionData,
          sessionData: response.data
        });
      } else {
        // Gérer le cas où l'API retourne success: false
        setError(response.data.message || (language === 'ar'
          ? 'حدث خطأ أثناء حفظ اختبار الاهتمامات'
          : 'Une erreur est survenue lors de l\'enregistrement du test d\'intérêts'));
      }
    } catch (err) {
      console.error('Erreur lors de la soumission du test d\'intérêts', err);

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


  const updateFieldResponse = (
    fieldName: string,
    fieldIndex: number,
    category: string,
    updates: Partial<FieldResponse>
  ) => {
    const fieldId = `${category}_${fieldIndex}`;

    setDetailedResponses(prev => ({
      ...prev,
      [fieldName]: {
        fieldId,
        fieldName,
        category,
        interestLevel: null,
        motivationLevel: null,
        effortSupported: false,
        interestResponseTime: null,
        motivationResponseTime: null,
        effortResponseTime: null,
        timestamp: new Date(),
        fieldIndex,
        ...prev[fieldName],
        ...updates
      }
    }));
  };

  const handleInterestChange = (field: string, value: number) => {
    const responseTime = Date.now() - (currentFieldStartTime[field] || Date.now());
    const fieldIndex = currentFields.findIndex(f => f.name === field);
    const fieldData = currentFields[fieldIndex];

    setInterests(prev => ({ ...prev, [field]: value }));

    updateFieldResponse(field, fieldIndex, fieldData.category, {
      interestLevel: value,
      interestResponseTime: responseTime,
      timestamp: new Date()
    });

    console.log(`🎯 Interest Response Captured:`, {
      field: field.substring(0, 30) + '...',
      category: fieldData.category,
      interestLevel: value,
      responseTime: `${responseTime}ms`
    });

    // Reset timer pour cette question
    setCurrentFieldStartTime(prev => ({
      ...prev,
      [field]: Date.now()
    }));
  };

  const handleMotivationChange = (field: string, value: number) => {
    const responseTime = Date.now() - (currentFieldStartTime[field] || Date.now());
    const fieldIndex = currentFields.findIndex(f => f.name === field);
    const fieldData = currentFields[fieldIndex];

    setMotivations(prev => ({ ...prev, [field]: value }));

    updateFieldResponse(field, fieldIndex, fieldData.category, {
      motivationLevel: value,
      motivationResponseTime: responseTime,
      timestamp: new Date()
    });

    console.log(`💪 Motivation Response Captured:`, {
      field: field.substring(0, 30) + '...',
      category: fieldData.category,
      motivationLevel: value,
      responseTime: `${responseTime}ms`
    });

    // Reset timer pour cette question
    setCurrentFieldStartTime(prev => ({
      ...prev,
      [field]: Date.now()
    }));
  };

  const handleEffortToggle = (field: string) => {
    const responseTime = Date.now() - (currentFieldStartTime[field] || Date.now());
    const fieldIndex = currentFields.findIndex(f => f.name === field);
    const fieldData = currentFields[fieldIndex];
    const isCurrentlySupported = effortSupported.includes(field);
    const newValue = !isCurrentlySupported;

    setEffortSupported(prev =>
      isCurrentlySupported
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );

    updateFieldResponse(field, fieldIndex, fieldData.category, {
      effortSupported: newValue,
      effortResponseTime: responseTime,
      timestamp: new Date()
    });

    console.log(`🤔 Effort Response Captured:`, {
      field: field.substring(0, 30) + '...',
      category: fieldData.category,
      effortSupported: newValue,
      responseTime: `${responseTime}ms`
    });

    // Reset timer pour cette question
    setCurrentFieldStartTime(prev => ({
      ...prev,
      [field]: Date.now()
    }));
  };

  const handleSubmit = () => {
    console.group('🎯 Interests Test Completion');
    console.log('Calculating comprehensive interest analysis...');

    // Group by categories
    const categorizedInterests: Record<string, number[]> = {};
    const categorizedMotivations: Record<string, number[]> = {};

    currentFields.forEach(field => {
      if (!categorizedInterests[field.category]) {
        categorizedInterests[field.category] = [];
        categorizedMotivations[field.category] = [];
      }

      if (interests[field.name]) {
        categorizedInterests[field.category].push(interests[field.name]);
      }
      if (motivations[field.name]) {
        categorizedMotivations[field.category].push(motivations[field.name]);
      }
    });

    // Calculate category averages
    const categoryScores: Record<string, { interest: number; motivation: number }> = {};

    Object.keys(categorizedInterests).forEach(category => {
      const interestAvg = categorizedInterests[category].length > 0
        ? categorizedInterests[category].reduce((a, b) => a + b, 0) / categorizedInterests[category].length
        : 0;

      const motivationAvg = categorizedMotivations[category].length > 0
        ? categorizedMotivations[category].reduce((a, b) => a + b, 0) / categorizedMotivations[category].length
        : 0;

      categoryScores[category] = {
        interest: Math.round(interestAvg * 20),
        motivation: Math.round(motivationAvg * 20)
      };

      console.log(`${category}: Interest ${Math.round(interestAvg * 20)}%, Motivation ${Math.round(motivationAvg * 20)}%`);
    });

    // Calculer les statistiques détaillées
    const responseStats = Object.values(detailedResponses);
    const completedResponses = responseStats.filter(r =>
      r.interestLevel !== null && r.motivationLevel !== null
    );

    // Statistiques temporelles
    const allResponseTimes = responseStats.flatMap(r =>
      [r.interestResponseTime, r.motivationResponseTime, r.effortResponseTime]
        .filter(time => time !== null) as number[]
    );

    const avgResponseTime = allResponseTimes.length > 0
      ? Math.round(allResponseTimes.reduce((sum, time) => sum + time, 0) / allResponseTimes.length)
      : 0;

    // Identifier les domaines d'intérêt les plus élevés
    const topInterests = Object.entries(interests)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([field, score]) => ({ field, score }));

    const topMotivations = Object.entries(motivations)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([field, score]) => ({ field, score }));

    // Domaines acceptables par effort
    const effortFields = effortSupported.length;

    // Créer la session
    const session = {
      testType: 'interests',
      startedAt: new Date(sessionStartTime),
      completedAt: new Date(),
      duration: Date.now() - sessionStartTime,
      language: language as 'fr' | 'ar',
      totalQuestions: currentFields.length * 3, // 3 questions par domaine
      questions: responseStats.flatMap(response => {
        const questions = [];

        if (response.interestLevel !== null) {
          questions.push({
            questionId: `${response.fieldId}_interest`,
            questionText: `${t.interestLevel} - ${response.fieldName}`,
            userAnswer: response.interestLevel,
            responseTime: response.interestResponseTime,
            timestamp: response.timestamp
          });
        }

        if (response.motivationLevel !== null) {
          questions.push({
            questionId: `${response.fieldId}_motivation`,
            questionText: `${t.motivationLevel} - ${response.fieldName}`,
            userAnswer: response.motivationLevel,
            responseTime: response.motivationResponseTime,
            timestamp: response.timestamp
          });
        }

        questions.push({
          questionId: `${response.fieldId}_effort`,
          questionText: `${t.acceptableByEffort} - ${response.fieldName}`,
          userAnswer: response.effortSupported ? 1 : 0,
          responseTime: response.effortResponseTime,
          timestamp: response.timestamp
        });

        return questions;
      })
    };

    // Statistiques par catégorie avec détails comportementaux
    const categoryStats = Object.entries(categoryScores).map(([category, scores]) => {
      const categoryResponses = responseStats.filter(r => r.category === category);
      const categoryResponseTimes = categoryResponses.flatMap(r =>
        [r.interestResponseTime, r.motivationResponseTime, r.effortResponseTime]
          .filter(time => time !== null) as number[]
      );

      return {
        category,
        interestScore: scores.interest,
        motivationScore: scores.motivation,
        fieldsCount: categoryResponses.length,
        avgResponseTime: categoryResponseTimes.length > 0
          ? Math.round(categoryResponseTimes.reduce((sum, time) => sum + time, 0) / categoryResponseTimes.length)
          : 0,
        effortFieldsCount: categoryResponses.filter(r => r.effortSupported).length
      };
    });

    console.log('Final Statistics:', {
      completedFields: completedResponses.length,
      totalFields: currentFields.length,
      avgResponseTime,
      topInterests: topInterests.slice(0, 3),
      effortFields,
      sessionDuration: Date.now() - sessionStartTime
    });
    console.groupEnd();

    const completionData = {
      fieldInterests: interests,
      fieldMotivations: motivations,
      effortSupported,
      categoryScores,
      // Nouvelles données détaillées
      session,
      detailedResponses,
      topInterests,
      topMotivations,
      avgResponseTime,
      sessionDuration: Date.now() - sessionStartTime,
      completedAt: new Date(),
      categoryStats,
      // Analyse comportementale
      behavioralAnalysis: {
        mostInterestedCategory: categoryStats.reduce((max, cat) =>
          cat.interestScore > max.interestScore ? cat : max, categoryStats[0]),
        mostMotivatedCategory: categoryStats.reduce((max, cat) =>
          cat.motivationScore > max.motivationScore ? cat : max, categoryStats[0]),
        quickestCategory: categoryStats.reduce((min, cat) =>
          cat.avgResponseTime < min.avgResponseTime ? cat : min, categoryStats[0]),
        effortWillingnessRate: Math.round((effortFields / currentFields.length) * 100)
      }
    };

    submitTestData(completionData);
  };

  const isComplete = currentFields.some(field => interests[field.name] && motivations[field.name]);

  // Group fields by category for better display
  const groupedFields = currentFields.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field.name);
    return acc;
  }, {} as Record<string, string[]>);

  // Calculer les statistiques de progression
  const getCompletionStats = () => {
    const totalFields = currentFields.length;
    const interestCompleted = Object.keys(interests).length;
    const motivationCompleted = Object.keys(motivations).length;
    const effortCompleted = effortSupported.length;

    return {
      totalFields,
      interestCompleted,
      motivationCompleted,
      effortCompleted,
      avgCompletion: Math.round(((interestCompleted + motivationCompleted) / (totalFields * 2)) * 100)
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
            ? 'جاري تحميل اختبار الاهتمامات...'
            : 'Chargement du test d\'intérêts...'}
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
              // Préremplir tous les champs avec intérêt et motivation à 5, effort à true
              const newInterests: Record<string, number> = {};
              const newMotivations: Record<string, number> = {};
              const newEffortSupported: string[] = [];
              const now = Date.now();

              currentFields.forEach((field, idx) => {
                newInterests[field.name] = 5;
                newMotivations[field.name] = 5;
                newEffortSupported.push(field.name);

                // Met à jour les réponses détaillées
                updateFieldResponse(
                  field.name,
                  idx,
                  field.category,
                  {
                    interestLevel: 5,
                    motivationLevel: 5,
                    effortSupported: true,
                    interestResponseTime: 1000,
                    motivationResponseTime: 1000,
                    effortResponseTime: 1000,
                    timestamp: new Date()
                  }
                );
              });

              setInterests(newInterests);
              setMotivations(newMotivations);
              setEffortSupported(newEffortSupported);
            }}
          >
            {language === 'ar' ? "تعبئة جميع الإجابات بـ 5 ونعم" : "Tout préremplir (5 & Oui)"}
          </button>
        </div>
        {/* Progress Statistics */}
        {completionStats.interestCompleted > 0 && (
          <div className="bg-green-50 rounded-lg p-3 mt-4">
            <div className={`text-sm text-green-700 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {language === 'ar'
                ? `التقدم: ${completionStats.avgCompletion}% - الاهتمام: ${completionStats.interestCompleted}/${completionStats.totalFields}, التحفيز: ${completionStats.motivationCompleted}/${completionStats.totalFields}`
                : `Progression: ${completionStats.avgCompletion}% - Intérêt: ${completionStats.interestCompleted}/${completionStats.totalFields}, Motivation: ${completionStats.motivationCompleted}/${completionStats.totalFields}`
              }
              {Object.values(detailedResponses).length > 0 && (
                <span className="ml-4">
                  {language === 'ar'
                    ? `متوسط الوقت: ${Math.round(Object.values(detailedResponses).flatMap(r => [r.interestResponseTime, r.motivationResponseTime].filter(t => t !== null) as number[]).reduce((sum, time) => sum + time, 0) / Math.max(1, Object.values(detailedResponses).flatMap(r => [r.interestResponseTime, r.motivationResponseTime].filter(t => t !== null)).length) / 1000)}ث`
                    : `Temps moyen: ${Math.round(Object.values(detailedResponses).flatMap(r => [r.interestResponseTime, r.motivationResponseTime].filter(t => t !== null) as number[]).reduce((sum, time) => sum + time, 0) / Math.max(1, Object.values(detailedResponses).flatMap(r => [r.interestResponseTime, r.motivationResponseTime].filter(t => t !== null)).length) / 1000)}s`
                  }
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Conseil/Remarque déplacé en haut */}
      <div className="bg-blue-50 rounded-xl p-4 mb-8">
        <p className={`text-sm text-blue-700 ${language === 'ar' ? 'text-right' : ''}`}>
          <strong>{t.adviceTitle} :</strong> {t.adviceText}
        </p>
      </div>

      {Object.entries(groupedFields).map(([category, fields]) => {
        const categoryResponses = fields.map(field => detailedResponses[field]).filter(Boolean);
        const categoryCompletion = categoryResponses.length > 0
          ? Math.round((categoryResponses.filter(r => r.interestLevel !== null && r.motivationLevel !== null).length / fields.length) * 100)
          : 0;

        return (
          <div key={category} className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6">
            <div className={`flex justify-between items-center mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <h3 className={`text-lg font-semibold text-gray-900 ${language === 'ar' ? 'text-right' : ''}`}>
                {category}
              </h3>
              <div className="text-right">
                <div className="text-sm text-green-600">
                  {categoryCompletion}%
                </div>
                <div className="text-xs text-gray-500">
                  {language === 'ar' ? 'مكتمل' : 'complété'}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {fields.map(field => {
                const hasInterest = interests[field] !== undefined;
                const hasMotivation = motivations[field] !== undefined;
                const hasEffort = effortSupported.includes(field);
                const isComplete = hasInterest && hasMotivation;

                return (
                  <div key={field} className={`bg-white rounded-lg p-4 border transition-all ${isComplete ? 'border-green-300 bg-green-50' : 'border-gray-200'
                    }`}>
                    <div className={`flex justify-between items-center mb-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                      <h4 className={`font-medium text-gray-900 ${language === 'ar' ? 'text-right' : ''}`}>
                        {field}
                      </h4>
                      {isComplete && (
                        <div className="text-xs text-green-600 font-medium">
                          ✓ I:{interests[field]} M:{motivations[field]} E:{hasEffort ? 'Oui' : 'Non'}
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Interest Level */}
                      <div>
                        <label className={`block text-sm text-gray-600 mb-2 ${language === 'ar' ? 'text-right' : ''}`}>
                          {t.interestLevel}
                        </label>
                        <div className={`flex gap-2 ${language === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
                          {[1, 2, 3, 4, 5].map(value => (
                            <button
                              key={value}
                              onClick={() => handleInterestChange(field, value)}
                              className={`w-8 h-8 rounded-full border-2 text-sm font-medium transition-all ${interests[field] === value
                                ? 'bg-blue-500 border-blue-500 text-white scale-110'
                                : 'border-gray-300 text-gray-600 hover:border-blue-300'
                                }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Motivation Level */}
                      <div>
                        <label className={`block text-sm text-gray-600 mb-2 ${language === 'ar' ? 'text-right' : ''}`}>
                          {t.motivationLevel}
                        </label>
                        <div className={`flex gap-2 ${language === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
                          {[1, 2, 3, 4, 5].map(value => (
                            <button
                              key={value}
                              onClick={() => handleMotivationChange(field, value)}
                              className={`w-8 h-8 rounded-full border-2 text-sm font-medium transition-all ${motivations[field] === value
                                ? 'bg-green-500 border-green-500 text-white scale-110'
                                : 'border-gray-300 text-gray-600 hover:border-green-300'
                                }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Effort Support */}
                      <div>
                        <label className={`block text-sm text-gray-600 mb-2 ${language === 'ar' ? 'text-right' : ''}`}>
                          {t.acceptableByEffort}
                        </label>
                        <div className={`flex ${language === 'ar' ? 'justify-end' : ''}`}>
                          <button
                            onClick={() => handleEffortToggle(field)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${effortSupported.includes(field)
                              ? 'bg-orange-500 border-orange-500 text-white'
                              : 'border-gray-300 text-gray-600 hover:border-orange-300'
                              }`}
                          >
                            {effortSupported.includes(field) ? t.yes : t.no}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Navigation */}
      <button
        onClick={handleSubmit}
        disabled={!isComplete || isSubmitting}
        className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}
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
  );
};

export default InterestsTest;