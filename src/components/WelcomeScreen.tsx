import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, ClockIcon, FileTextIcon, BrainIcon, GlobeIcon, Loader2Icon, RefreshCwIcon, PlayCircleIcon } from 'lucide-react';
import axios from 'axios'; // Assurez-vous d'avoir axios installé
import { getAuthToken, isTokenValid, getUserFromToken, setAuthToken } from '../utils/auth';  // Ces fonctions devraient être implémentées dans un fichier utilitaire
import { API_BASE_URL } from '../config/api'; // Importer l'URL de l'API depuis le fichier config/api.ts

interface WelcomeScreenProps {
  onComplete: (data: any) => void;
  language: string;
  onLanguageChange?: (language: string) => void; // Rendre optionnel avec fallback
}


// Définition des champs académiques pour le calcul de la progression
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
    testInProgress: "Vous avez un test en cours",
    testProgress: "Progression du test",
    testStartedOn: "Commencé le",
    continueTest: "Continuer le test",
    restartTest: "Recommencer à zéro",
    lastActivity: "Dernière activité",
    completedSections: "Sections complétées",
    welcomeTitle: "Bienvenue dans votre Orientation Personnalisée",
    welcomeSubtitle: "Découvrez votre profil unique et explorez les formations et métiers qui vous correspondent vraiment",
    scientificTests: "Tests scientifiques",
    scientificTestsDesc: "Évaluations basées sur des méthodes psychométriques reconnues",
    completeAnalysis: "Analyse complète",
    completeAnalysisDesc: "Profil RIASEC, personnalité, aptitudes et intérêts académiques",
    detailedReport: "Rapport détaillé",
    detailedReportDesc: "Recommandations personnalisées d'études et de carrières",
    estimatedTime: "Durée estimée : 15-20 minutes",
    estimatedTimeDesc: "Prenez votre temps pour des résultats plus précis",
    whatYouDiscover: "Ce que vous allez découvrir :",
    riasecProfile: "Votre profil RIASEC (Réaliste, Investigateur, Artistique, Social, Entreprenant, Conventionnel)",
    aptitudesPerformances: "Vos aptitudes cognitives et performances",
    recommendedDomains: "Les domaines d'études qui vous correspondent",
    careersOpportunities: "Les métiers et opportunités de carrière adaptés à votre profil",
    startTest: "Commencer le test",
    freeConfidentialScientific: "Gratuit • Confidentiel • Scientifique",
    chooseLanguage: "Choisir la langue du test",
    languagePreference: "Langue préférée pour passer le test",
    french: "Français",
    arabic: "العربية",
    selectLanguage: "Sélectionnez votre langue"
  },
  ar: {
    testInProgress: "لديك اختبار قيد التقدم",
    testProgress: "تقدم الاختبار",
    testStartedOn: "بدأ في",
    continueTest: "متابعة الاختبار",
    restartTest: "إعادة البدء من الصفر",
    lastActivity: "آخر نشاط",
    completedSections: "الأقسام المكتملة",
    welcomeTitle: "مرحباً بك في توجيهك الشخصي",
    welcomeSubtitle: "اكتشف ملفك الفريد واستكشف التكوينات والمهن التي تناسبك حقاً",
    scientificTests: "اختبارات علمية",
    scientificTestsDesc: "تقييمات مبنية على أساليب نفسية معترف بها",
    completeAnalysis: "تحليل شامل",
    completeAnalysisDesc: "ملف RIASEC، الشخصية، القدرات والاهتمامات الأكاديمية",
    detailedReport: "تقرير مفصل",
    detailedReportDesc: "توصيات شخصية للدراسات والمهن",
    estimatedTime: "المدة المقدرة: 15-20 دقيقة",
    estimatedTimeDesc: "خذ وقتك للحصول على نتائج أكثر دقة",
    whatYouDiscover: "ما ستكتشفه:",
    riasecProfile: "ملفك الشخصي RIASEC (واقعي، باحث، فني، اجتماعي، مقاول، تقليدي)",
    aptitudesPerformances: "قدراتك المعرفية وأداؤك",
    recommendedDomains: "مجالات الدراسة التي تناسبك",
    careersOpportunities: "المهن وفرص المهنة المناسبة لملفك الشخصي",
    startTest: "بدء الاختبار",
    freeConfidentialScientific: "مجاني • سري • علمي",
    chooseLanguage: "اختر لغة الاختبار",
    languagePreference: "اللغة المفضلة لإجراء الاختبار",
    french: "Français",
    arabic: "العربية",
    selectLanguage: "اختر لغتك"
  }
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onComplete,
  language = 'fr', // Valeur par défaut
  onLanguageChange
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [isLoading, setIsLoading] = useState(false); // État pour gérer le chargement
  const [error, setError] = useState<string | null>(null); // État pour gérer les erreurs
  const t = translations[currentLanguage as 'fr' | 'ar'] || translations.fr;
  const [testStatus, setTestStatus] = useState<any>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Récupérer le token d'authentification
  const token = getAuthToken(); // Récupère le token depuis localStorage
  console.log('Token récupéré:', token);

  // Ajouter avant la fonction handleRestartTest
  const showRestartConfirmation = () => {
    setShowConfirmModal(true);
  };

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    setCurrentLanguage(lang);

    if (onLanguageChange && typeof onLanguageChange === 'function') {
      onLanguageChange(lang);
    }
  };

  // Fonction pour formater une date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(currentLanguage === 'ar' ? 'ar-MA' : 'fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = !!token;
  // Ajouter cette fonction après handleRestartTest


  const handleViewReport = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      // Récupérer les données complètes du test
      const response = await axios.get(`${API_BASE_URL}/orientation-test/my-test`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        console.group('📊 Generating Orientation Report');
        console.log('Récupération des données pour le rapport complet:', response.data);

        // Extraire les données du test
        const testData = response.data.data;

        // Restructurer les données pour qu'elles correspondent exactement à la structure
        // attendue par OrientationReport
        const formattedData = {
          // Données de base nécessaires pour le rapport
          personalInfo: testData.currentStep.personalInfo?.personalInfo || testData.currentStep.personalInfo || {},
          riasecScores: testData.currentStep.riasec?.riasec || testData.currentStep.riasec || {},
          personalityScores: testData.currentStep.personality?.personality || testData.currentStep.personality || {},
          aptitudeScores: testData.currentStep.aptitude?.aptitude || testData.currentStep.aptitude || {},
          academicInterests: testData.currentStep.interests?.interests || testData.currentStep.interests || {},
          careerCompatibility: testData.currentStep.careerCompatibility?.careers || testData.currentStep.careerCompatibility || {},
          constraints: testData.currentStep.constraints?.constraints || testData.currentStep.constraints || {},
          languageSkills: testData.currentStep.languageSkills?.languages || testData.currentStep.languageSkills || {},

          // Métadonnées du test
          testMetadata: {
            selectedLanguage: testStatus.language || selectedLanguage,
            completedAt: new Date().toISOString(),
            isCompleted: true,
            totalDuration: testData.totalDuration || 0,
            version: "1.0",
            startedAt: testData.metadata?.startedAt
          },

          // Indicateur pour App.tsx
          showReport: true,

          // Identifiant de session
          uuid: response.data.uuid
        };

        console.log('Données structurées pour le rapport:', formattedData);
        console.log('Redirection vers le rapport d\'orientation...');
        console.groupEnd();

        // Passer les données structurées au parent
        onComplete(formattedData);
      } else {
        setError(response.data.message || (currentLanguage === 'ar'
          ? 'حدث خطأ أثناء استرجاع تقرير التوجيه'
          : 'Une erreur est survenue lors de la récupération du rapport d\'orientation'));
      }
    } catch (err) {
      console.error('Erreur lors de la récupération du rapport', err);
      // Gestion des erreurs existante...
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifier le statut du test à la connexion
  useEffect(() => {

    const checkTestStatus = async () => {
      if (!isAuthenticated) {
        setIsCheckingStatus(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/orientation-test/my-test`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success && response.data.hasTest) {
          const testData = response.data.data;
          const isCompleted = response.data.isCompleted;

          // Récupérer les étapes explicitement complétées
          const completedSteps = testData.currentStep.completedSteps || [];

          // Calculer le nombre total d'étapes complétées en incluant les sous-étapes
          let completedSectionsCount = completedSteps.length;

          // Vérifier si des étapes supplémentaires sont complétées mais pas incluses dans completedSteps

          // Vérifier si le test RIASEC est complété
          if (testData.currentStep.riasec && testData.currentStep.riasec.riasec) {
            // Si riasec est présent dans currentStep mais pas dans completedSteps, l'ajouter au comptage
            if (!completedSteps.includes('riasec')) {
              completedSectionsCount++;
            }
          }

          // Ajouter d'autres vérifications pour d'autres étapes potentielles
          // Par exemple, si vous avez d'autres tests comme la personnalité, les aptitudes, etc.
          if (testData.currentStep.personality && !completedSteps.includes('personality')) {
            completedSectionsCount++;
          }

          // Vérifier si le test d'aptitude est complété
          if (testData.currentStep.aptitude) {
            // Accéder directement à aptitude sans vérifier .aptitude.aptitude
            const aptitudeData = testData.currentStep.aptitude;
            console.log("Données d'aptitude trouvées:", aptitudeData);

            // Vérifier si le test d'aptitude est marqué comme complété (plusieurs façons possibles)
            if (
              (aptitudeData.isCompleted) ||
              (aptitudeData.completedAt) ||
              (aptitudeData.aptitude && aptitudeData.aptitude.isCompleted) ||
              (aptitudeData.aptitude && aptitudeData.aptitude.completedAt) ||
              // Vérifier également si toutes les sessions de tests sont terminées
              (aptitudeData.aptitude && aptitudeData.aptitude.testStats &&
                aptitudeData.aptitude.testStats.length === 3 &&
                aptitudeData.aptitude.testStats.every((stat: any) => stat.totalQuestions > 0))
            ) {
              if (!completedSteps.includes('aptitude')) {
                completedSectionsCount++;
                console.log("Test d'aptitude considéré comme complété ✅");
              }
            } else if (!completedSteps.includes('aptitude')) {
              // Si le test d'aptitude a commencé mais n'est pas complété
              try {
                // Chercher les données de test soit dans aptitude, soit dans aptitude.aptitude
                const testStats = aptitudeData.aptitude?.testStats || aptitudeData.testStats;

                if (testStats && testStats.length > 0) {
                  const completedTests = testStats.filter(
                    (stat: any) => stat.totalQuestions > 0
                  ).length;

                  const totalTests = 3; // Le nombre total de tests d'aptitude
                  if (completedTests > 0) {
                    // Ajouter une fraction de la progression (0.33 par test complété)
                    const aptitudeProgress = (completedTests / totalTests);
                    completedSectionsCount += aptitudeProgress;
                    console.log(`Progrès partiel du test d'aptitude: ${completedTests}/${totalTests} tests terminés (${aptitudeProgress * 100}%) 🔄`);
                  }
                }
              } catch (err) {
                console.error("Erreur lors de l'analyse des données d'aptitude:", err);
              }
            }
          }

          // Vérifier si le test d'intérêts est complété
          if (testData.currentStep.interests) {
            console.log("Données d'intérêts trouvées:", testData.currentStep.interests);

            // Vérifier si le test d'intérêts est explicitement marqué comme complété
            if (
              (testData.currentStep.interests.isCompleted) ||
              (testData.currentStep.interests.completedAt) ||
              (testData.currentStep.interests.interests &&
                testData.currentStep.interests.interests.completedAt)
            ) {
              if (!completedSteps.includes('interests')) {
                completedSectionsCount++;
                console.log("Test d'intérêts considéré comme complété ✅");
              }
            } else if (!completedSteps.includes('interests') && testData.currentStep.interests.interests) {
              // Vérifier si le test est partiellement complété
              const interestsData = testData.currentStep.interests.interests;

              // Calculer le pourcentage de complétion en fonction des réponses
              if (interestsData.fieldInterests && Object.keys(interestsData.fieldInterests).length > 0) {
                const totalFields = academicFields[testData.metadata.selectedLanguage] ?
                  academicFields[testData.metadata.selectedLanguage].length : 27; // Nombre total de domaines académiques

                const completedFields = Object.keys(interestsData.fieldInterests).length;

                if (completedFields > 0) {
                  const interestsProgress = (completedFields / totalFields);
                  completedSectionsCount += interestsProgress;
                  console.log(`Progrès partiel du test d'intérêts: ${completedFields}/${totalFields} domaines (${interestsProgress * 100}%) 🔄`);
                }
              }
            }
          }


          // Vérifier si le test de compatibilité de carrière est complété
          if (testData.currentStep.careerCompatibility) {
            console.log("Données de compatibilité de carrière trouvées:", testData.currentStep.careerCompatibility);

            // Vérifier si le test de compatibilité de carrière est explicitement marqué comme complété
            if (
              (testData.currentStep.careerCompatibility.isCompleted) ||
              (testData.currentStep.careerCompatibility.completedAt) ||
              (testData.currentStep.careerCompatibility.careers &&
                testData.currentStep.careerCompatibility.careers.completedAt)
            ) {
              if (!completedSteps.includes('careerCompatibility')) {
                completedSectionsCount++;
                console.log("Test de compatibilité de carrière considéré comme complété ✅");
              }
            } else if (!completedSteps.includes('careerCompatibility') && testData.currentStep.careerCompatibility.careers) {
              // Vérifier si le test est partiellement complété
              const careerData = testData.currentStep.careerCompatibility.careers;

              // Calculer le pourcentage de complétion en fonction des réponses d'attraction
              if (careerData.careerAttractions && Object.keys(careerData.careerAttractions).length > 0) {
                const totalCareers = careers[testData.metadata.selectedLanguage] ?
                  careers[testData.metadata.selectedLanguage].length : 150; // Nombre total de carrières à évaluer

                const completedCareers = Object.keys(careerData.careerAttractions).length;

                // Si au moins 10 carrières ont été évaluées, considérer une progression partielle
                if (completedCareers >= 10) {
                  const careerProgress = Math.min(1, (completedCareers / 30)); // Limiter à 100% avec 30 carrières évaluées
                  completedSectionsCount += careerProgress;
                  console.log(`Progrès partiel du test de compatibilité de carrière: ${completedCareers}/30 carrières (${careerProgress * 100}%) 🔄`);
                } else if (completedCareers > 0) {
                  // Si moins de 10 carrières évaluées, progression moindre
                  const careerProgress = (completedCareers / 30) * 0.5; // 50% de la progression normale
                  completedSectionsCount += careerProgress;
                  console.log(`Progrès minimal du test de compatibilité de carrière: ${completedCareers}/30 carrières (${careerProgress * 100}%) 🔄`);
                }
              }
            }
          }


          // Vérifier si le test de contraintes est complété
          if (testData.currentStep.constraints) {
            console.log("Données de contraintes trouvées:", testData.currentStep.constraints);

            // Vérifier si le test de contraintes est explicitement marqué comme complété
            if (
              (testData.currentStep.constraints.isCompleted) ||
              (testData.currentStep.constraints.completedAt) ||
              (testData.currentStep.constraints.constraints &&
                testData.currentStep.constraints.constraints.completedAt)
            ) {
              if (!completedSteps.includes('constraints')) {
                completedSectionsCount++;
                console.log("Test de contraintes considéré comme complété ✅");
              }
            } else if (!completedSteps.includes('constraints') && testData.currentStep.constraints.constraints) {
              // Vérifier si le test est partiellement complété
              const constraintsData = testData.currentStep.constraints.constraints;

              // Calculer le pourcentage de complétion en fonction des réponses
              let fieldsCompleted = 0;
              let totalFields = 0;

              // Vérifier la section mobilité
              if (constraintsData.mobility) {
                totalFields += 3; // city, country, international
                fieldsCompleted += Object.values(constraintsData.mobility).filter(Boolean).length;
              }

              // Vérifier la section budget
              if (constraintsData.budget) {
                totalFields += 3; // annualBudget, scholarshipEligible, familySupport
                fieldsCompleted += Object.values(constraintsData.budget).filter(Boolean).length;
              }

              // Vérifier la section éducation
              if (constraintsData.education) {
                totalFields += 3; // maxLevel, preferredDuration, studyMode
                fieldsCompleted += Object.values(constraintsData.education).filter(Boolean).length;
              }

              // Vérifier les priorités
              if (constraintsData.priorities) {
                totalFields += 5; // salary, stability, passion, prestige, workLife
                fieldsCompleted += Object.values(constraintsData.priorities)
                  .filter(value => typeof value === 'number' && value > 1).length;
              }

              // Si au moins 3 champs ont été remplis, considérer une progression partielle
              if (fieldsCompleted >= 3) {
                const constraintsProgress = Math.min(1, (fieldsCompleted / totalFields));
                completedSectionsCount += constraintsProgress;
                console.log(`Progrès partiel du test de contraintes: ${fieldsCompleted}/${totalFields} champs (${constraintsProgress * 100}%) 🔄`);
              }
            }
          }


          // Vérifier si le test de compétences linguistiques est complété
          if (testData.currentStep.languageSkills) {
            console.log("Données de compétences linguistiques trouvées:", testData.currentStep.languageSkills);

            // Vérifier si le test de compétences linguistiques est explicitement marqué comme complété
            if (
              (testData.currentStep.languageSkills.isCompleted) ||
              (testData.currentStep.languageSkills.completedAt) ||
              (testData.currentStep.languageSkills.languages &&
                testData.currentStep.languageSkills.languages.completedAt)
            ) {
              if (!completedSteps.includes('languageSkills')) {
                completedSectionsCount++;
                console.log("Test de compétences linguistiques considéré comme complété ✅");
              }
            } else if (!completedSteps.includes('languageSkills') && testData.currentStep.languageSkills.languages) {
              // Vérifier si le test est partiellement complété
              const languageData = testData.currentStep.languageSkills.languages;

              // Calculer le pourcentage de complétion en fonction des réponses
              let completionScore = 0;

              // 1. Vérifier les langues sélectionnées (20% du score)
              if (languageData.selectedLanguages && languageData.selectedLanguages.length >= 2) {
                completionScore += 0.2;
              }

              // 2. Vérifier les compétences linguistiques (40% du score)
              if (languageData.languageSkills) {
                const languageCodes = languageData.selectedLanguages || [];
                const totalSkillsRequired = languageCodes.length * 4; // 4 compétences par langue
                let skillsCompleted = 0;

                Object.entries(languageData.languageSkills).forEach(([langCode, skills]) => {
                  if (langCode && typeof skills === 'object') {
                    skillsCompleted += Object.values(skills).filter(Boolean).length;
                  }
                });

                if (totalSkillsRequired > 0) {
                  const skillsProgress = Math.min(1, skillsCompleted / totalSkillsRequired);
                  completionScore += (skillsProgress * 0.4);
                }
              }

              // 3. Vérifier les certificats (10% du score)
              if (languageData.certificates) {
                let certificatesChecked = 0;

                Object.values(languageData.certificates).forEach((cert: any) => {
                  if (cert && typeof cert === 'object' && cert.hasCertificate !== undefined) {
                    certificatesChecked++;
                  }
                });

                const languageCodes = languageData.selectedLanguages || [];
                if (languageCodes.length > 0) {
                  const certProgress = Math.min(1, certificatesChecked / languageCodes.length);
                  completionScore += (certProgress * 0.1);
                }
              }

              // 4. Vérifier les préférences (30% du score)
              if (languageData.preferences) {
                const preferences = languageData.preferences;
                let preferencesCompleted = 0;

                if (preferences.preferredTeachingLanguage) preferencesCompleted++;
                if (preferences.comfortableStudyingIn && preferences.comfortableStudyingIn.length > 0) preferencesCompleted++;
                if (preferences.willingToImprove && preferences.willingToImprove.length > 0) preferencesCompleted++;

                const prefProgress = preferencesCompleted / 3;
                completionScore += (prefProgress * 0.3);
              }

              // Ajouter la part de progression pour ce test
              if (completionScore > 0) {
                completedSectionsCount += completionScore;
                console.log(`Progrès partiel du test de compétences linguistiques: ${Math.round(completionScore * 100)}% 🔄`);
              }
            }
          }

          // Calculer le pourcentage de progression avec le nouveau comptage
          const totalSteps = 8; // Nombre total d'étapes du test

          // Calculer les parties entières et décimales pour l'affichage
          const completedSectionsInt = Math.floor(completedSectionsCount);
          const hasPartialSection = completedSectionsCount > completedSectionsInt;

          // Arrondir à un chiffre après la virgule pour un affichage plus précis
          const progressPercentage = Math.round((completedSectionsCount / totalSteps) * 100);

          setTestStatus({
            startedAt: testData.metadata.startedAt,
            lastActivity: testData.completedAt || new Date().toISOString(),
            progressPercentage: progressPercentage,
            completedSections: completedSectionsInt,
            completedSectionsRaw: completedSectionsCount, // Garder la valeur non arrondie
            hasPartialSection: hasPartialSection, // Indiquer s'il y a une section partiellement complétée
            totalSections: totalSteps,
            isCompleted: isCompleted,
            language: testData.metadata.selectedLanguage || language
          });

        }
      } catch (err) {
        console.error('Erreur lors de la vérification du statut du test', err);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkTestStatus();
  }, [isAuthenticated, token, onLanguageChange, language]);

  // Vous pouvez ajouter une vérification de l'authentification
  useEffect(() => {
    if (!isAuthenticated) {
      setError(currentLanguage === 'ar'
        ? 'يجب عليك تسجيل الدخول لبدء اختبار التوجيه'
        : 'Vous devez être connecté pour démarrer un test d\'orientation');
    }
  }, [isAuthenticated, currentLanguage]);

  const handleStartTest = async () => {
    if (!isAuthenticated) {
      setError(currentLanguage === 'ar'
        ? 'يجب عليك تسجيل الدخول لبدء اختبار التوجيه'
        : 'Vous devez être connecté pour démarrer un test d\'orientation');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/orientation-test/start`, {
        selectedLanguage: selectedLanguage
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        console.log('Test d\'orientation démarré avec succès', response.data);
        if (response.data.uuid) {
          localStorage.setItem('orientationSessionUuid', response.data.uuid);
        }
        onComplete({
          uuid: response.data.uuid,
          selectedLanguage,
          isCompleted: response.data.isCompleted,
          ...response.data.data
        });
      } else {
        setError(response.data.message || (currentLanguage === 'ar'
          ? 'حدث خطأ أثناء بدء الاختبار'
          : 'Une erreur est survenue lors du démarrage du test'));
      }
    } catch (err) {
      console.error('Erreur lors du démarrage du test d\'orientation', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          localStorage.removeItem('orientation_token');
          setError(currentLanguage === 'ar'
            ? 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى'
            : 'Session expirée, veuillez vous reconnecter');
        } else {
          setError(err.response?.data?.message || (currentLanguage === 'ar'
            ? 'خطأ في الاتصال بالخادم'
            : 'Erreur de connexion au serveur'));
        }
      } else {
        setError(currentLanguage === 'ar'
          ? 'حدث خطأ غير متوقع'
          : 'Une erreur inattendue est survenue');
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleContinueTest = async () => {
    if (!testStatus || !isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      // Utiliser l'endpoint resume sans UUID (le backend utilise l'utilisateur authentifié)
      const response = await axios.get(`${API_BASE_URL}/orientation-test/resume`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        console.log('Reprise du test d\'orientation', response.data);

        // Préparer les données à passer à onComplete
        const testData = {
          ...response.data.data,
          uuid: response.data.uuid,
          selectedLanguage: response.data.data.currentStep.selectedLanguage || selectedLanguage,
          isCompleted: response.data.data.isCompleted
        };

        onComplete(testData);
      } else {
        setError(response.data.message || (currentLanguage === 'ar'
          ? 'حدث خطأ أثناء استئناف الاختبار'
          : 'Une erreur est survenue lors de la reprise du test'));
      }
    } catch (err) {
      console.error('Erreur lors de la reprise du test', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          localStorage.removeItem('orientation_token');
          setError(currentLanguage === 'ar'
            ? 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى'
            : 'Session expirée, veuillez vous reconnecter');
        } else {
          setError(err.response?.data?.message || (currentLanguage === 'ar'
            ? 'خطأ في الاتصال بالخادم'
            : 'Erreur de connexion au serveur'));
        }
      } else {
        setError(currentLanguage === 'ar'
          ? 'حدث خطأ غير متوقع'
          : 'Une erreur inattendue est survenue');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestartTest = async () => {
    setShowConfirmModal(false);

    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      // Utiliser l'endpoint reset au lieu de restart
      const response = await axios.post(`${API_BASE_URL}/orientation-test/reset`, {
        selectedLanguage: selectedLanguage
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        console.log('Test d\'orientation redémarré', response.data);
        if (response.data.uuid) {
          localStorage.setItem('orientationSessionUuid', response.data.uuid);
        }
        onComplete({
          uuid: response.data.uuid,
          selectedLanguage,
          isCompleted: false, // Le test vient d'être réinitialisé
          ...response.data.data
        });
      } else {
        setError(response.data.message || (currentLanguage === 'ar'
          ? 'حدث خطأ أثناء إعادة بدء الاختبار'
          : 'Une erreur est survenue lors du redémarrage du test'));
      }
    } catch (err) {
      console.error('Erreur lors du redémarrage du test', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          localStorage.removeItem('orientation_token');
          setError(currentLanguage === 'ar'
            ? 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى'
            : 'Session expirée, veuillez vous reconnecter');
        } else {
          setError(err.response?.data?.message || (currentLanguage === 'ar'
            ? 'خطأ في الاتصال بالخادم'
            : 'Erreur de connexion au serveur'));
        }
      } else {
        setError(currentLanguage === 'ar'
          ? 'حدث خطأ غير متوقع'
          : 'Une erreur inattendue est survenue');
      }
    } finally {
      setIsLoading(false);
    }
  };


  // Afficher un indicateur de chargement pendant la vérification du statut
  if (isCheckingStatus) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2Icon className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">
          {currentLanguage === 'ar' ? 'جاري التحقق من حالة الاختبار...' : 'Vérification du statut de votre test...'}
        </p>
      </div>
    );
  }

  return (
    <div className={`text-center max-w-3xl mx-auto ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <div className="mb-12">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <BrainIcon className="w-12 h-12 text-white" />
        </div>
        <h1 className={`text-4xl font-bold text-gray-900 mb-4 ${currentLanguage === 'ar' ? 'text-center' : ''}`}>
          {t.welcomeTitle}
        </h1>
        <p className={`text-xl text-gray-600 leading-relaxed ${currentLanguage === 'ar' ? 'text-center' : ''}`}>
          {t.welcomeSubtitle}
        </p>
      </div>

      {/* Test en cours - Affiché seulement si un test est en cours */}
      {testStatus && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12 border border-blue-200 shadow-md">
          <div className={`flex items-center justify-center space-x-3 mb-6 ${currentLanguage === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <PlayCircleIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">{t.testInProgress}</h2>
          </div>

          <div className="space-y-4">
            {/* Informations sur le test en cours */}
            <div className="grid grid-cols-2 gap-4 text-left mb-4">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-1">{t.testStartedOn}</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {testStatus.startedAt ? formatDate(testStatus.startedAt) : '-'}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-1">{t.lastActivity}</h3>
                <p className="text-lg font-semibold text-gray-900">
                  {testStatus.lastActivity ? formatDate(testStatus.lastActivity) : '-'}
                </p>
              </div>
            </div>

            {/* Progression du test */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-2">{t.testProgress}</h3>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${testStatus.progressPercentage || 0}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 text-right">
                {testStatus.progressPercentage || 0}% {t.completedSections}: {testStatus.completedSections || 0}
                {testStatus.hasPartialSection && (
                  <span className="text-blue-600">+</span>
                )}
                /{testStatus.totalSections || 8}
                {testStatus.hasPartialSection && (
                  <span className="text-blue-600 ml-1">
                    ({currentLanguage === 'ar' ? 'جزء مكتمل' : 'section partielle'})
                  </span>
                )}
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={handleContinueTest}
                disabled={isLoading}
                className={`flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <Loader2Icon className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <PlayCircleIcon className="w-5 h-5" />
                    <span>{t.continueTest}</span>
                  </>
                )}
              </button>
              <button
                onClick={showRestartConfirmation}
                disabled={isLoading}
                className={`flex items-center justify-center space-x-2 border border-gray-300 bg-white text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <RefreshCwIcon className="w-5 h-5" />
                <span>{t.restartTest}</span>
              </button>
            </div>


            {/* Bouton pour voir le rapport si test à 100% */}
            {testStatus && testStatus.progressPercentage === 100 && (
              <div className="mt-4">
                <button
                  onClick={handleViewReport}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-md ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <FileTextIcon className="w-5 h-5" />
                  <span>{currentLanguage === 'ar' ? 'عرض تقرير التوجيه الكامل' : 'Voir le rapport d\'orientation complet'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Language Selection - Affiché seulement si aucun test n'est en cours */}
      {!testStatus && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 mb-12 border border-indigo-100">
          <div className={`flex items-center justify-center space-x-3 mb-6 ${currentLanguage === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <GlobeIcon className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">{t.chooseLanguage}</h2>
          </div>

          <p className={`text-gray-600 mb-6 ${currentLanguage === 'ar' ? 'text-center' : ''}`}>
            {t.languagePreference}
          </p>

          <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
            <button
              onClick={() => handleLanguageSelect('fr')}
              className={`p-4 border-2 rounded-xl transition-all duration-300 ${selectedLanguage === 'fr'
                ? 'border-blue-500 bg-blue-100 text-blue-700 shadow-md'
                : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🇫🇷</div>
                <div className="font-semibold">{t.french}</div>
                <div className="text-sm text-gray-600">Français</div>
              </div>
            </button>

            <button
              onClick={() => handleLanguageSelect('ar')}
              className={`p-4 border-2 rounded-xl transition-all duration-300 ${selectedLanguage === 'ar'
                ? 'border-blue-500 bg-blue-100 text-blue-700 shadow-md'
                : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🇲🇦</div>
                <div className="font-semibold">{t.arabic}</div>
                <div className="text-sm text-gray-600">العربية</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <FileTextIcon className="w-10 h-10 text-blue-600 mx-auto mb-4" />
          <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${currentLanguage === 'ar' ? 'text-center' : ''}`}>
            {t.scientificTests}
          </h3>
          <p className={`text-gray-600 ${currentLanguage === 'ar' ? 'text-center' : ''}`}>
            {t.scientificTestsDesc}
          </p>
        </div>

        <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
          <BrainIcon className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
          <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${currentLanguage === 'ar' ? 'text-center' : ''}`}>
            {t.completeAnalysis}
          </h3>
          <p className={`text-gray-600 ${currentLanguage === 'ar' ? 'text-center' : ''}`}>
            {t.completeAnalysisDesc}
          </p>
        </div>

        <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
          <FileTextIcon className="w-10 h-10 text-purple-600 mx-auto mb-4" />
          <h3 className={`text-lg font-semibold text-gray-900 mb-2 ${currentLanguage === 'ar' ? 'text-center' : ''}`}>
            {t.detailedReport}
          </h3>
          <p className={`text-gray-600 ${currentLanguage === 'ar' ? 'text-center' : ''}`}>
            {t.detailedReportDesc}
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
        <div className={`flex items-center justify-center space-x-2 mb-3 ${currentLanguage === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <ClockIcon className="w-5 h-5 text-amber-600" />
          <span className="font-medium text-amber-800">{t.estimatedTime}</span>
        </div>
        <p className={`text-amber-700 ${currentLanguage === 'ar' ? 'text-center' : ''}`}>
          {t.estimatedTimeDesc}
        </p>
      </div>

      {/* What you'll discover */}
      <div className={`bg-gray-50 rounded-xl p-6 mb-8 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
        <h3 className={`text-lg font-semibold text-gray-900 mb-4 text-center`}>
          {t.whatYouDiscover}
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className={`flex items-start space-x-3 ${currentLanguage === 'ar' ? 'flex-row-reverse space-x-reverse text-right' : ''}`}>
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
            <span>{t.riasecProfile}</span>
          </li>
          <li className={`flex items-start space-x-3 ${currentLanguage === 'ar' ? 'flex-row-reverse space-x-reverse text-right' : ''}`}>
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
            <span>{t.aptitudesPerformances}</span>
          </li>
          <li className={`flex items-start space-x-3 ${currentLanguage === 'ar' ? 'flex-row-reverse space-x-reverse text-right' : ''}`}>
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
            <span>{t.recommendedDomains}</span>
          </li>
          <li className={`flex items-start space-x-3 ${currentLanguage === 'ar' ? 'flex-row-reverse space-x-reverse text-right' : ''}`}>
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
            <span>{t.careersOpportunities}</span>
          </li>
        </ul>
      </div>

      {/* Message si l'utilisateur n'est pas connecté */}
      {!isAuthenticated && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg mb-6">
          {currentLanguage === 'ar'
            ? 'يجب عليك تسجيل الدخول لبدء اختبار التوجيه. الرجاء تسجيل الدخول أولاً.'
            : 'Vous devez vous connecter pour démarrer un test d\'orientation. Veuillez vous connecter d\'abord.'}
          <div className="mt-2">
            <a
              href="/login"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {currentLanguage === 'ar' ? 'تسجيل الدخول' : 'Se connecter'}
            </a>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Bouton CTA - Affiché seulement si aucun test n'est en cours */}
      {!testStatus && (
        <>
          <button
            onClick={handleStartTest}
            disabled={isLoading || !isAuthenticated}
            className={`inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${currentLanguage === 'ar' ? 'flex-row-reverse space-x-reverse' : ''
              } ${(isLoading || !isAuthenticated) ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <Loader2Icon className="w-5 h-5 animate-spin" />
                <span>{currentLanguage === 'ar' ? 'جار التحميل...' : 'Chargement...'}</span>
              </>
            ) : (
              <>
                <span>{t.startTest}</span>
                <ArrowRightIcon className={`w-5 h-5 ${currentLanguage === 'ar' ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>

          <p className={`text-sm text-gray-500 mt-6 ${currentLanguage === 'ar' ? 'text-center' : ''}`}>
            {t.freeConfidentialScientific}
          </p>
        </>
      )}

      {/* Modal de confirmation pour redémarrer le test */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
            <h3 className="text-xl font-bold text-red-600 mb-4">
              {currentLanguage === 'ar' ? 'تأكيد إعادة البدء' : 'Confirmation de redémarrage'}
            </h3>

            <p className="text-gray-700 mb-6">
              {currentLanguage === 'ar'
                ? 'سيؤدي إعادة بدء الاختبار إلى فقدان جميع تقدمك الحالي. هل أنت متأكد أنك تريد البدء من جديد؟'
                : 'Redémarrer le test effacera toute votre progression actuelle. Êtes-vous sûr de vouloir recommencer à zéro ?'}
            </p>

            <div className={`flex justify-end space-x-3 ${currentLanguage === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                {currentLanguage === 'ar' ? 'إلغاء' : 'Annuler'}
              </button>

              <button
                onClick={handleRestartTest}
                className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700"
              >
                {currentLanguage === 'ar' ? 'نعم، إعادة البدء' : 'Oui, recommencer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;