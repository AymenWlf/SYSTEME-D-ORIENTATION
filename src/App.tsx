import React, { useState, useEffect } from 'react';
import { UserIcon, BookOpenIcon, BrainIcon, GraduationCapIcon, BugIcon } from 'lucide-react';
import { useTranslation } from './utils/translations';
import { User, UserTestData } from './types/user.tsx';
import LanguageSelector from './components/LanguageSelector';
import PersonalInfoForm from './components/PersonalInfoForm';
import RiasecTest from './components/RiasecTest';
import PersonalityTest from './components/PersonalityTest';
import AptitudeTest from './components/AptitudeTest';
import InterestsTest from './components/InterestsTest';
import CareerCompatibilityTest from './components/CareerCompatibilityTest';
import ConstraintsTest from './components/ConstraintsTest';
import LanguageTest from './components/LanguageTest';
import OrientationReport from './components/OrientationReport';
import ProgressBar from './components/ProgressBar';
import WelcomeScreen from './components/WelcomeScreen';
import ErrorBoundary from './components/ErrorBoundary';
import AuthGuard from './components/AuthGuard.tsx';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';


function AppContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<Partial<UserTestData>>({
    testMetadata: {
      selectedLanguage: 'fr',
      startedAt: new Date(),
      stepDurations: {},
      version: '1.0'
    }
  });
  const [showReport, setShowReport] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [showDebug, setShowDebug] = useState(false);

  const t = useTranslation(language);

  // Debug: Log userData changes
  useEffect(() => {
    console.group('🔍 USER DATA UPDATE');
    console.log('Current Step:', currentStep);
    console.log('Step Name:', steps[currentStep]?.name || 'Report');
    console.log('User Data:', JSON.parse(JSON.stringify(userData)));
    console.log('Data Completeness:', {
      personalInfo: !!userData.personalInfo,
      riasecScores: !!userData.riasecScores,
      personalityScores: !!userData.personalityScores,
      aptitudeScores: !!userData.aptitudeScores,
      academicInterests: !!userData.academicInterests,
      careerCompatibility: !!userData.careerCompatibility,
      constraints: !!userData.constraints,
      languageSkills: !!userData.languageSkills,
      analysis: !!userData.analysis
    });
    console.groupEnd();
  }, [userData, currentStep]);

  const steps = [
    { name: t.welcomeTitle, icon: UserIcon, component: WelcomeScreen },
    { name: t.personalInfoTitle, icon: UserIcon, component: PersonalInfoForm },
    { name: t.riasecTestTitle, icon: BrainIcon, component: RiasecTest },
    { name: t.personalityTestTitle, icon: BrainIcon, component: PersonalityTest },
    { name: t.aptitudeTestTitle, icon: GraduationCapIcon, component: AptitudeTest },
    { name: t.interestsTestTitle, icon: BookOpenIcon, component: InterestsTest },
    { name: t.careerCompatibilityTitle, icon: BrainIcon, component: CareerCompatibilityTest },
    { name: t.constraintsTestTitle, icon: UserIcon, component: ConstraintsTest },
    { name: t.languageTestTitle, icon: BookOpenIcon, component: LanguageTest },
  ];

  const handleStepComplete = (stepData: any) => {
    console.group(`✅ STEP ${currentStep + 1} COMPLETED OR DATA RECEIVED`);
    console.log('Step Data:', stepData);

    // Vérifier si c'est une demande directe d'affichage du rapport
    if (stepData.showReport === true) {
      console.log('🚀 Direct request to show report detected!');
      console.log('Report data structure:', Object.keys(stepData));

      // Vérifier que les données essentielles sont présentes
      const essentialDataPresent =
        stepData.personalInfo &&
        stepData.riasecScores &&
        stepData.testMetadata;

      if (!essentialDataPresent) {
        console.warn('⚠️ Warning: Essential data missing in report request');
      }

      // Définir les données utilisateur pour le rapport
      setUserData(stepData);

      // Afficher le rapport
      setShowReport(true);
      console.groupEnd();
      return;
    }

    const stepKeys = [
      'welcome',
      'personalInfo',
      'riasecScores',
      'personalityScores',
      'aptitudeScores',
      'academicInterests',
      'careerCompatibility',
      'constraints',
      'languageSkills'
    ];

    const stepStartTime = Date.now();
    const stepEndTime = Date.now();

    console.group(`✅ STEP ${currentStep + 1} COMPLETED OR DATA RECEIVED`);
    console.log('Step Data:', stepData);
    console.log('Previous User Data:', JSON.parse(JSON.stringify(userData)));

    // Vérifier si c'est une demande directe d'affichage du rapport
    if (stepData.showReport === true) {
      console.log('🚀 Direct request to show report detected!');
      setUserData(stepData); // Utiliser directement les données complètes du rapport
      setShowReport(true);
      console.groupEnd();
      return;
    }

    // Mettre à jour les données utilisateur
    setUserData(prev => {
      const newData = { ...prev };

      // Enregistrer les données de l'étape avec session détaillée
      if (stepKeys[currentStep]) {
        const sessionData = {
          ...stepData,
          session: {
            testType: stepKeys[currentStep],
            startedAt: prev.testMetadata?.startedAt || new Date(),
            completedAt: new Date(stepEndTime),
            duration: stepEndTime - (prev.testMetadata?.startedAt?.getTime() || stepStartTime),
            language: language as 'fr' | 'ar',
            totalQuestions: stepData.totalQuestions || 0,
            questions: stepData.detailedResponses || stepData.questions || []
          }
        };

        (newData as any)[stepKeys[currentStep]] = sessionData;
        console.log(`✅ Added ${stepKeys[currentStep]} with detailed session to userData`);
        console.log('Session Data:', sessionData.session);
        console.log('Detailed Responses:', sessionData.session.questions?.length || 0, 'questions captured');
      }

      // Mettre à jour les métadonnées
      if (newData.testMetadata) {
        newData.testMetadata.stepDurations[stepKeys[currentStep]] = stepEndTime - stepStartTime;
        console.log(`⏱️ Step duration recorded: ${newData.testMetadata.stepDurations[stepKeys[currentStep]]}ms`);
      }

      // Si c'est la dernière étape, marquer comme terminé
      if (currentStep === steps.length - 1) {
        if (newData.testMetadata) {
          newData.testMetadata.completedAt = new Date();
          newData.testMetadata.totalDuration = Date.now() - (newData.testMetadata.startedAt?.getTime() || Date.now());
          console.log('🏁 Test completed! Total duration:', newData.testMetadata.totalDuration);

          // Log des statistiques finales
          console.group('📊 FINAL STATISTICS');
          const totalQuestions = Object.values(newData)
            .filter(section => section && typeof section === 'object' && 'session' in section)
            .reduce((total, section: any) => total + (section.session?.totalQuestions || 0), 0);

          const totalSessions = Object.values(newData)
            .filter(section => section && typeof section === 'object' && ('session' in section || 'sessions' in section))
            .length;

          console.log(`Total Questions Answered: ${totalQuestions}`);
          console.log(`Total Test Sessions: ${totalSessions}`);
          console.log('Session Details:', Object.keys(newData)
            .filter(key => key !== 'testMetadata' && newData[key as keyof typeof newData])
            .map(key => ({
              test: key,
              hasSession: !!(newData[key as keyof typeof newData] as any)?.session,
              hasSessions: !!(newData[key as keyof typeof newData] as any)?.sessions,
              questionsCount: (newData[key as keyof typeof newData] as any)?.session?.questions?.length ||
                (newData[key as keyof typeof newData] as any)?.sessions?.reduce((acc: number, s: any) => acc + (s.questions?.length || 0), 0) || 0
            }))
          );
          console.groupEnd();
        }
      }

      console.log('New User Data:', JSON.parse(JSON.stringify(newData)));
      console.groupEnd();
      return newData;
    });

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Générer l'analyse avant d'afficher le rapport
      console.log('🧮 Generating analysis...');
      generateAnalysis();
      setShowReport(true);
    }
  };

  const generateAnalysis = () => {
    console.group('🧮 ANALYSIS GENERATION');
    console.log('Generating analysis based on collected data...');

    // Générer l'analyse basée sur toutes les données collectées
    setUserData(prev => {
      const analysis = {
        dominantRiasecProfile: getDominantRiasecProfile(prev.riasecScores),
        personalityType: getDominantPersonalityType(prev.personalityScores),
        learningProfile: prev.personalityScores?.learningStyle || 'mixed',
        academicCompatibility: calculateAcademicCompatibility(prev),
        careerCompatibility: calculateCareerCompatibility(prev),
        recommendedPath: getRecommendedPath(prev),
        confidenceLevel: calculateConfidenceLevel(prev),
        recommendations: generateRecommendations(prev)
      };

      console.log('Generated Analysis:', analysis);
      console.groupEnd();

      return {
        ...prev,
        analysis
      };
    });
  };

  // Fonctions d'analyse (à implémenter selon la logique métier)
  const getDominantRiasecProfile = (riasecScores: any): string => {
    if (!riasecScores?.scores) {
      console.warn('⚠️ No RIASEC scores available');
      return 'Non déterminé';
    }

    const sortedScores = Object.entries(riasecScores.scores)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 2);

    const profile = sortedScores.map(([key]) => key).join('-');
    console.log('🎯 Dominant RIASEC Profile:', profile, sortedScores);
    return profile;
  };

  const getDominantPersonalityType = (personalityScores: any): string => {
    if (!personalityScores?.scores) {
      console.warn('⚠️ No personality scores available');
      return 'Non déterminé';
    }

    const dominant = Object.entries(personalityScores.scores)
      .sort(([, a], [, b]) => (b as number) - (a as number))[0];

    const type = dominant ? dominant[0] : 'Non déterminé';
    console.log('🧠 Dominant Personality Type:', type, dominant);
    return type;
  };

  const calculateAcademicCompatibility = (userData: any): Record<string, number> => {
    console.log('📚 Calculating academic compatibility...');
    // Logic pour calculer la compatibilité académique
    return {};
  };

  const calculateCareerCompatibility = (userData: any): Record<string, number> => {
    console.log('💼 Calculating career compatibility...');
    // Logic pour calculer la compatibilité professionnelle
    return {};
  };

  const getRecommendedPath = (userData: any): 'academic' | 'professional' | 'entrepreneurial' => {
    console.log('🛤️ Determining recommended path...');
    // Logic pour déterminer la voie recommandée
    return 'academic';
  };

  const calculateConfidenceLevel = (userData: any): number => {
    console.log('📊 Calculating confidence level...');
    // Logic pour calculer le niveau de confiance
    const level = 85;
    console.log('Confidence Level:', level);
    return level;
  };

  const generateRecommendations = (userData: any): any => {
    console.log('💡 Generating recommendations...');
    // Logic pour générer les recommandations détaillées
    return {
      domains: [],
      careers: [],
      institutions: [],
      developmentPlan: {
        shortTerm: [],
        mediumTerm: [],
        longTerm: []
      }
    };
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      console.log(`⬅️ Going back from step ${currentStep + 1} to ${currentStep}`);
      setCurrentStep(currentStep - 1);
    }
  };

  if (showReport) {
    return (
      <>
        {/* Debug Panel pour le rapport */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
            title="Toggle Debug"
          >
            <BugIcon className="w-5 h-5" />
          </button>
        </div>

        {showDebug && (
          <div className="fixed top-16 right-4 w-96 max-h-96 bg-black text-green-400 p-4 rounded-lg overflow-auto z-40 text-xs font-mono">
            <div className="mb-2 text-green-300 font-bold">🔍 FINAL USER DATA</div>
            <pre>{JSON.stringify(userData, null, 2)}</pre>
          </div>
        )}

        <OrientationReport
          userData={userData as User}
          language={language}
          onRestart={() => {
            console.log('🔄 Restarting application...');
            setCurrentStep(0);
            setUserData({
              testMetadata: {
                selectedLanguage: language as 'fr' | 'ar',
                startedAt: new Date(),
                stepDurations: {},
                version: '1.0'
              }
            });
            setShowReport(false);
            setShowDebug(false);
          }}
        />
      </>
    );
  }

  const CurrentComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Debug Panel */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg"
          title="Toggle Debug"
        >
          <BugIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Debug Window Enhanced */}
      {showDebug && (
        <div className="fixed top-16 right-4 w-96 max-h-96 bg-black text-green-400 p-4 rounded-lg overflow-auto z-40 text-xs font-mono shadow-2xl border border-green-500">
          <div className="mb-2 text-green-300 font-bold">
            🔍 DEBUG - Step {currentStep + 1}/{steps.length}
          </div>
          <div className="mb-2 text-yellow-400">
            📍 Current: {steps[currentStep]?.name}
          </div>
          <div className="mb-3 text-blue-300">
            📊 Completion: {Object.keys(userData).filter(key => key !== 'testMetadata' && userData[key as keyof typeof userData]).length}/8 sections
          </div>
          <div className="border-t border-gray-600 pt-2">
            <div className="text-white mb-1">Data Status:</div>
            {[
              { key: 'personalInfo', label: '👤 Personal' },
              { key: 'riasecScores', label: '🎯 RIASEC' },
              { key: 'personalityScores', label: '🧠 Personality' },
              { key: 'aptitudeScores', label: '💡 Aptitude' },
              { key: 'academicInterests', label: '📚 Interests' },
              { key: 'careerCompatibility', label: '💼 Career' },
              { key: 'constraints', label: '⚖️ Constraints' },
              { key: 'languageSkills', label: '🌍 Languages' }
            ].map(({ key, label }) => {
              const section = userData[key as keyof typeof userData] as any;
              const hasSession = section?.session || section?.sessions;
              const questionCount = section?.session?.questions?.length ||
                (section?.sessions?.reduce((acc: number, s: any) => acc + (s.questions?.length || 0), 0)) || 0;

              return (
                <div key={key} className={`text-xs ${userData[key as keyof typeof userData] ? 'text-green-400' : 'text-gray-500'}`}>
                  {userData[key as keyof typeof userData] ? '✅' : '⭕'} {label}
                  {hasSession && <span className="text-blue-300"> ({questionCount}Q)</span>}
                </div>
              );
            })}
          </div>
          <div className="border-t border-gray-600 pt-2 mt-2">
            <div className="text-white mb-1">Session Summary:</div>
            {Object.entries(userData)
              .filter(([key, value]) => key !== 'testMetadata' && value && typeof value === 'object')
              .map(([key, value]) => {
                const session = (value as any)?.session;
                const sessions = (value as any)?.sessions;
                if (!session && !sessions) return null;

                return (
                  <div key={key} className="text-xs text-cyan-300 mb-1">
                    {key}: {session ?
                      `${session.questions?.length || 0}Q in ${Math.round(session.duration / 1000)}s` :
                      `${sessions?.length || 0} sessions`
                    }
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {currentStep > 0 && (
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <ProgressBar
              currentStep={currentStep}
              totalSteps={steps.length}
              steps={steps}
              language={language}
            />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {currentStep > 0 && (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
              <div className={`flex items-center space-x-3 ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {React.createElement(steps[currentStep].icon, { className: "w-6 h-6" })}
                <h1 className="text-2xl font-bold">{steps[currentStep].name}</h1>
              </div>
              <div className="mt-2 bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="p-8">
            <CurrentComponent
              onComplete={handleStepComplete}
              onPrevious={handlePrevStep}
              canGoBack={currentStep > 1}
              onLanguageChange={setLanguage}
              userData={userData}
              language={language}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


function App() {
  return (
    <ErrorBoundary>
      <AuthGuard onAuthSuccess={() => { }}>
        <Router>
          <AppContent />
        </Router>
      </AuthGuard>
    </ErrorBoundary>
  );
}


export default App;