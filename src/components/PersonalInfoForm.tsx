import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, ArrowLeftIcon, CheckIcon, XIcon, CalculatorIcon, AlertCircleIcon, Loader2Icon } from 'lucide-react';
import { useTranslation } from '../utils/translations';
import axios from 'axios';
import { API_BASE_URL } from '../config/api'; // Assurez-vous que ce fichier existe avec l'URL de l'API
import { getAuthToken, isTokenValid, getUserFromToken, setAuthToken } from '../utils/auth';  // Ces fonctions devraient être implémentées dans un fichier utilitaire

interface PersonalInfoFormProps {
  onComplete: (data: any) => void;
  onPrevious: () => void;
  canGoBack: boolean;
  language: string;
  sessionData?: any; // UUID de la session de test
}

// Niveaux d'études adaptés
const STUDY_LEVELS = [
  {
    value: '1ère année Baccalauréat',
    label: '1ère année Baccalauréat',
    labelArabic: 'السنة الأولى من البكالوريا'
  },
  {
    value: '2ème année Baccalauréat en cours',
    label: '2ème année Baccalauréat (en cours)',
    labelArabic: 'السنة الثانية من البكالوريا (جارية)'
  },
  {
    value: '2ème année Baccalauréat terminé',
    label: '2ème année Baccalauréat (terminé - bac obtenu)',
    labelArabic: 'السنة الثانية من البكالوريا (منتهية - بكالوريا محصلة)'
  },
  {
    value: 'Bachelier',
    label: 'Bachelier (années antérieures)',
    labelArabic: 'حاصل على البكالوريا (سنوات سابقة)'
  }
];

// Options pour la disponibilité des notes
const NOTE_AVAILABILITY = [
  {
    value: 'disponible',
    label: 'Notes disponibles (je peux les remplir)',
    labelArabic: 'النقط متوفرة (يمكنني ملؤها)'
  },
  {
    value: 'estimation',
    label: 'Notes non disponibles (estimation seulement)',
    labelArabic: 'النقط غير متوفرة (تقدير فقط)'
  }
];

// Types de bac
const BAC_TYPES = [
  { value: 'marocain', label: 'Baccalauréat Marocain', labelArabic: 'البكالوريا المغربية' },
  { value: 'mission', label: 'Baccalauréat Mission Française', labelArabic: 'بكالوريا البعثة الفرنسية' }
];

// Filières du Bac Marocain
const BAC_MAROCAIN_FILIERES = [
  { value: 'Sciences Math A', label: 'Sciences Math A', labelArabic: 'علوم رياضية أ' },
  { value: 'Sciences Math B', label: 'Sciences Math B', labelArabic: 'علوم رياضية ب' },
  { value: 'Sciences Physique', label: 'Sciences Physique', labelArabic: 'علوم فيزيائية' },
  { value: 'SVT', label: 'SVT', labelArabic: 'علوم الحياة والأرض' },
  { value: 'Sciences économique', label: 'Sciences Économiques', labelArabic: 'علوم اقتصادية' },
  { value: 'Sciences gestion comptable', label: 'Sciences de Gestion', labelArabic: 'علوم التدبير' },
  { value: 'Lettres', label: 'Lettres', labelArabic: 'آداب' },
  { value: 'Sciences humaines', label: 'Sciences Humaines', labelArabic: 'علوم إنسانية' },
  { value: 'Arts Appliqués', label: 'Arts Appliqués', labelArabic: 'فنون تطبيقية' },
  { value: 'Sciences et technologies électriques', label: 'Sciences et technologies électriques', labelArabic: 'العلوم والتقنيات الكهربائية' },
  { value: 'Sciences et technologies mécaniques', label: 'Sciences et technologies mécaniques', labelArabic: 'العلوم والتقنيات الميكانيكية' },
  { value: 'Sciences agronomiques', label: 'Sciences agronomiques', labelArabic: 'العلوم الزراعية' },
  { value: 'Sciences de la chariaa', label: 'Sciences de la chariaa', labelArabic: 'العلوم الشرعية' },
];

// Spécialités du Bac Mission
const BAC_MISSION_SPECIALITES = [
  { value: 'math', label: 'Mathématiques', labelArabic: 'الرياضيات' },
  { value: 'pc', label: 'Physique-Chimie', labelArabic: 'الفيزياء والكيمياء' },
  { value: 'svt', label: 'SVT (Sciences de la Vie et de la Terre)', labelArabic: 'علوم الحياة والأرض' },
  { value: 'nsi', label: 'Numérique et Sciences Informatiques (NSI)', labelArabic: 'الرقمية وعلوم الكمبيوتر' },
  { value: 'ses', label: 'SES (Sciences Économiques et Sociales)', labelArabic: 'العلوم الاقتصادية والاجتماعية' },
  { value: 'hggsp', label: 'HGGSP (Histoire-Géo, Géopolitique, Sciences Politiques)', labelArabic: 'التاريخ والجغرافيا والجيوسياسة والعلوم السياسية' },
  { value: 'hlp', label: 'HLP (Humanités, Littérature, Philosophie)', labelArabic: 'العلوم الإنسانية والأدب والفلسفة' },
  { value: 'llce', label: 'LLCE (Langues, Littératures et Cultures Étrangères)', labelArabic: 'اللغات والآداب والثقافات الأجنبية' },
  { value: 'arts', label: 'Arts (Théâtre, Musique, Arts Plastiques...)', labelArabic: 'الفنون (المسرح، الموسيقى، الفنون التشكيلية...)' },
  { value: 'technologique', label: 'Technologique (STMG, STI2D, STL, ...)', labelArabic: 'التكنولوجي (STMG، STI2D، STL، ...)' },
];

// Années d'obtention du bac
const ANNEE_BAC = [
  { value: '2026-2027', label: '2026-2027', labelArabic: '2026-2027' },
  { value: '2025-2026', label: '2025-2026', labelArabic: '2025-2026' },
  { value: '2024-2025', label: '2024-2025', labelArabic: '2024-2025' },
  { value: '2023-2024', label: '2023-2024', labelArabic: '2023-2024' },
  { value: '2022-2023', label: '2022-2023', labelArabic: '2022-2023' },
  { value: '2021-2022', label: '2021-2022', labelArabic: '2021-2022' },
];

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onComplete, onPrevious, canGoBack, language, sessionData }) => {
  const t = useTranslation(language);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer le token d'authentification
  const token = getAuthToken(); // Récupère le token depuis localStorage

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = !!token;

  const [formData, setFormData] = useState({
    phoneNumber: '', // AJOUT DU NUMÉRO DE TÉLÉPHONE
    firstName: '',
    lastName: '',
    age: '',
    city: '',
    studyLevel: '',
    bacType: '',
    bacFiliere: '',
    bacSpecialites: [],
    bacYear: '',
    // Disponibilité des notes
    noteAvailability: '', // 'disponible' ou 'estimation'
    // Notes réelles pour Bac Marocain
    noteGenerale1ereBac: '',
    noteControleContinu: '',
    noteNational: '',
    // Estimations pour Bac Marocain
    noteGenerale1ereBacEstimation: '',
    noteControleConinuEstimation: '',
    noteNationalEstimation: '',
    // Notes calculées pour toutes les méthodes
    noteCalculeeMethod1: '',
    noteCalculeeMethod2: '',
    noteCalculeeMethod3: '',
    // Estimations calculées
    noteCalculeeMethod1Estimation: '',
    noteCalculeeMethod2Estimation: '',
    noteCalculeeMethod3Estimation: '',
    // Notes pour Bac Mission
    noteGeneralePremiere: '',
    noteGeneraleTerminale: '',
    noteGeneraleBac: '',
    // Estimations Bac Mission
    noteGeneralePremiereEstimation: '',
    noteGeneraleTerminaleEstimation: '',
    noteGeneraleBacEstimation: '',
    financialSituation: '',
    parentsProfessions: '',
    familyExpectations: ''
  });


  // Méthodes de calcul pour le Bac Marocain
  const CALCUL_METHODS = [
    {
      value: 'method1',
      label: '25% Régional + 25% CC + 50% National',
      labelArabic: '25% جهوي + 25% مراقبة مستمرة + 50% وطني',
      formula: (regional: number, cc: number, national: number) => (regional * 0.25 + cc * 0.25 + national * 0.5)
    },
    {
      value: 'method2',
      label: '50% National + 50% Régional',
      labelArabic: '50% وطني + 50% جهوي',
      formula: (regional: number, cc: number, national: number) => (national * 0.5 + regional * 0.5)
    },
    {
      value: 'method3',
      label: '75% National + 25% Régional',
      labelArabic: '75% وطني + 25% جهوي',
      formula: (regional: number, cc: number, national: number) => (national * 0.75 + regional * 0.25)
    }
  ];


  // Vérifier si des données existent déjà et les charger
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        // Si des données de session sont fournies directement, les utiliser
        if (sessionData && sessionData.currentStep && sessionData.currentStep.personalInfo) {
          const personalInfoData = sessionData.currentStep.personalInfo.personalInfo || {};
          setFormData(prevData => ({
            ...prevData,
            ...personalInfoData
          }));
          setIsLoading(false);
          return;
        }

        // Sinon, récupérer les données depuis l'API
        const response = await axios.get(`${API_BASE_URL}/orientation-test/my-test`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success && response.data.hasTest) {
          // Extraire les données personnelles si elles existent
          const testData = response.data.data;
          if (testData.currentStep && testData.currentStep.personalInfo) {
            const personalInfoData = testData.currentStep.personalInfo.personalInfo || {};
            setFormData(prevData => ({
              ...prevData,
              ...personalInfoData
            }));
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données personnelles:", err);
        // Ne pas afficher d'erreur à l'utilisateur, simplement continuer avec le formulaire vide
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, token, sessionData]);

  // Auto-calcul pour les notes réelles
  useEffect(() => {
    if (formData.bacType === 'marocain' && formData.noteAvailability === 'disponible' &&
      formData.noteGenerale1ereBac && formData.noteControleContinu && formData.noteNational) {

      const regional = parseFloat(formData.noteGenerale1ereBac);
      const cc = parseFloat(formData.noteControleContinu);
      const national = parseFloat(formData.noteNational);

      if (!isNaN(regional) && !isNaN(cc) && !isNaN(national)) {
        const method1Result = CALCUL_METHODS[0].formula(regional, cc, national);
        const method2Result = CALCUL_METHODS[1].formula(regional, cc, national);
        const method3Result = CALCUL_METHODS[2].formula(regional, cc, national);

        setFormData(prev => ({
          ...prev,
          noteCalculeeMethod1: method1Result.toFixed(2),
          noteCalculeeMethod2: method2Result.toFixed(2),
          noteCalculeeMethod3: method3Result.toFixed(2)
        }));
      }
    }
  }, [formData.noteGenerale1ereBac, formData.noteControleContinu, formData.noteNational, formData.bacType, formData.noteAvailability]);

  // Auto-calcul pour les estimations
  useEffect(() => {
    if (formData.bacType === 'marocain' && formData.noteAvailability === 'estimation' &&
      formData.noteGenerale1ereBacEstimation && formData.noteControleConinuEstimation && formData.noteNationalEstimation) {

      const regional = parseFloat(formData.noteGenerale1ereBacEstimation);
      const cc = parseFloat(formData.noteControleConinuEstimation);
      const national = parseFloat(formData.noteNationalEstimation);

      if (!isNaN(regional) && !isNaN(cc) && !isNaN(national)) {
        const method1Result = CALCUL_METHODS[0].formula(regional, cc, national);
        const method2Result = CALCUL_METHODS[1].formula(regional, cc, national);
        const method3Result = CALCUL_METHODS[2].formula(regional, cc, national);

        setFormData(prev => ({
          ...prev,
          noteCalculeeMethod1Estimation: method1Result.toFixed(2),
          noteCalculeeMethod2Estimation: method2Result.toFixed(2),
          noteCalculeeMethod3Estimation: method3Result.toFixed(2)
        }));
      }
    }
  }, [formData.noteGenerale1ereBacEstimation, formData.noteControleConinuEstimation, formData.noteNationalEstimation, formData.bacType, formData.noteAvailability]);


  // Logique pour déterminer le nombre de spécialités selon le niveau
  const getMaxSpecialites = () => {
    if (formData.bacType === 'mission') {
      if (formData.studyLevel === '1ère année Baccalauréat') return 3;
      if (formData.studyLevel === '2ème année Baccalauréat en cours') return 2;
      if (formData.studyLevel === '2ème année Baccalauréat terminé') return 2;
      if (formData.studyLevel === 'Bachelier') return 2;
    }
    return 0;
  };

  useEffect(() => {
    if (formData.noteAvailability) {
      setFormData(prev => ({
        ...prev,
        // Reset toutes les notes
        noteGenerale1ereBac: '',
        noteControleContinu: '',
        noteNational: '',
        noteGenerale1ereBacEstimation: '',
        noteControleConinuEstimation: '',
        noteNationalEstimation: '',
        noteGeneralePremiere: '',
        noteGeneraleTerminale: '',
        noteGeneraleBac: '',
        noteGeneralePremiereEstimation: '',
        noteGeneraleTerminaleEstimation: '',
        noteGeneraleBacEstimation: '',
        // Reset calculs
        noteCalculeeMethod1: '',
        noteCalculeeMethod2: '',
        noteCalculeeMethod3: '',
        noteCalculeeMethod1Estimation: '',
        noteCalculeeMethod2Estimation: '',
        noteCalculeeMethod3Estimation: ''
        // Suppression de la partie languages
      }));
    }
  }, [formData.noteAvailability]);


  const getLabel = (item: any) => {
    return language === 'ar' ? item.labelArabic : item.label;
  };

  const handleChange = (field: string, value: string | string[]) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  // Fonction pour déterminer si on a besoin de la disponibilité des notes
  const needsNoteAvailability = () => {
    return (formData.studyLevel === '2ème année Baccalauréat en cours' ||
      formData.studyLevel === '2ème année Baccalauréat terminé') ||
      (formData.bacType === 'mission' && (
        formData.studyLevel === '2ème année Baccalauréat en cours' ||
        formData.studyLevel === '2ème année Baccalauréat terminé' ||
        formData.studyLevel === 'Bachelier'
      ));
  };

  // Reset des données quand on change de type de bac
  useEffect(() => {
    if (formData.bacType) {
      setFormData(prev => ({
        ...prev,
        bacFiliere: '',
        bacSpecialites: []
      }));
    }
  }, [formData.bacType]);

  const handleSpecialiteToggle = (specialite: string) => {
    const maxSpecialites = getMaxSpecialites();
    setFormData(prev => {
      const currentSpecialites = prev.bacSpecialites;
      const isSelected = currentSpecialites.includes(specialite);

      if (isSelected) {
        return {
          ...prev,
          bacSpecialites: currentSpecialites.filter(s => s !== specialite)
        };
      } else if (currentSpecialites.length < maxSpecialites) {
        return {
          ...prev,
          bacSpecialites: [...currentSpecialites, specialite]
        };
      }
      return prev;
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    // Vérifier si l'utilisateur est authentifié
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
      const personalInfoData = {
        stepName: 'personalInfo',
        stepData: {
          personalInfo: formData,
          timestamp: new Date().toISOString()
        },
        stepNumber: 1,
        duration: 0 // Vous pourriez ajouter un timer pour mesurer la durée
      };

      // Envoyer les données à l'API
      // L'endpoint a changé - plus besoin d'UUID dans l'URL
      const response = await axios.post(
        `${API_BASE_URL}/orientation-test/save-step`,
        personalInfoData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        console.log('Informations personnelles enregistrées avec succès', response.data);

        // Si la réponse contient un UUID, on peut le stocker pour référence
        if (response.data.uuid) {
          localStorage.setItem('orientationSessionUuid', response.data.uuid);
        }

        // Appeler onComplete pour passer à l'étape suivante
        onComplete({
          ...formData,
          sessionData: response.data
        });
      } else {
        // Gérer le cas où l'API retourne success: false
        setError(response.data.message || (language === 'ar'
          ? 'حدث خطأ أثناء حفظ المعلومات الشخصية'
          : 'Une erreur est survenue lors de l\'enregistrement des informations personnelles'));
      }
    } catch (err) {
      console.error('Erreur lors de la soumission des informations personnelles', err);

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

  const isFormValid = formData.firstName && formData.phoneNumber && formData.lastName && formData.age && formData.city && formData.studyLevel;

  // Si le chargement est en cours, afficher un indicateur
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2Icon className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-600">
          {language === 'ar'
            ? 'جاري تحميل المعلومات الشخصية...'
            : 'Chargement de vos informations personnelles...'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {sessionData && sessionData.currentStep && sessionData.currentStep.personalInfo && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-2">
            <CheckIcon className="w-5 h-5" />
            <p>
              {language === 'ar'
                ? 'تم تحميل معلوماتك الشخصية. يمكنك تعديلها إذا لزم الأمر.'
                : 'Vos informations personnelles ont été chargées. Vous pouvez les modifier si nécessaire.'}
            </p>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{t.personalInfoTitle}</h2>
        <p className="text-gray-600">{t.personalInfoSubtitle}</p>

        {/* Bouton pour tout préremplir */}
        <button
          type="button"
          className="mt-6 mb-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition"
          onClick={() => {
            setFormData({
              phoneNumber: '+212612345678',
              firstName: 'Aymen',
              lastName: 'Ouallaf',
              age: '17',
              city: 'Casablanca',
              studyLevel: '2ème année Baccalauréat en cours',
              bacType: 'marocain',
              bacFiliere: 'Sciences Physique',
              bacSpecialites: [],
              bacYear: '2025-2026',
              noteAvailability: 'estimation',
              noteGenerale1ereBac: '',
              noteControleContinu: '',
              noteNational: '',
              noteGenerale1ereBacEstimation: '12',
              noteControleConinuEstimation: '15',
              noteNationalEstimation: '17.97',
              noteCalculeeMethod1: '',
              noteCalculeeMethod2: '',
              noteCalculeeMethod3: '',
              noteCalculeeMethod1Estimation: '15.73',
              noteCalculeeMethod2Estimation: '14.98',
              noteCalculeeMethod3Estimation: '16.48',
              noteGeneralePremiere: '',
              noteGeneraleTerminale: '',
              noteGeneraleBac: '',
              noteGeneralePremiereEstimation: '',
              noteGeneraleTerminaleEstimation: '',
              noteGeneraleBacEstimation: '',
              financialSituation: '',
              parentsProfessions: '',
              familyExpectations: ''
            });
          }}
        >
          {language === 'ar' ? "تعبئة جميع المعلومات تلقائياً" : "Tout préremplir"}
        </button>
      </div>

      {/* Informations générales */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.generalInfo}</h3>
        {/* NOUVEAU CHAMP NUMÉRO DE TÉLÉPHONE */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'رقم الهاتف' : 'Numéro de téléphone'} *
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder={language === 'ar' ? '06XXXXXXXX' : '06XXXXXXXX'}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {language === 'ar'
              ? 'مثال: 0612345678'
              : 'Exemple: 0612345678'
            }
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.firstName} *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.lastName} *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.age} *</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.city} *</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>
      </div>

      {/* Parcours scolaire */}
      <div className="bg-green-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.academicPath}</h3>

        {/* Niveau d'études */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'المستوى الدراسي' : 'Niveau d\'études'} *
          </label>
          <select
            value={formData.studyLevel}
            onChange={(e) => handleChange('studyLevel', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          >
            <option value="">{t.select}</option>
            {STUDY_LEVELS.map(level => (
              <option key={level.value} value={level.value}>
                {getLabel(level)}
              </option>
            ))}
          </select>
        </div>


        {/* Disponibilité des notes (pour 2ème année seulement) */}
        {needsNoteAvailability() && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'توفر النقط' : 'Disponibilité des notes'} *
            </label>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-3">
              <div className="flex items-center gap-2">
                <AlertCircleIcon className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-800">
                  {language === 'ar'
                    ? 'هل تتوفر على نقطك الحقيقية أم تريد تقديرها؟'
                    : 'Avez-vous vos notes réelles ou souhaitez-vous les estimer ?'
                  }
                </p>
              </div>
            </div>
            <select
              value={formData.noteAvailability}
              onChange={(e) => handleChange('noteAvailability', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">{t.select}</option>
              {NOTE_AVAILABILITY.map(option => (
                <option key={option.value} value={option.value}>
                  {getLabel(option)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Type de bac - affiché si niveau sélectionné ET (pas besoin de disponibilité OU disponibilité renseignée) */}
        {formData.studyLevel && (!needsNoteAvailability() || formData.noteAvailability) && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'نوع البكالوريا' : 'Type de Baccalauréat'} *
            </label>
            <select
              value={formData.bacType}
              onChange={(e) => handleChange('bacType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">{t.select}</option>
              {BAC_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {getLabel(type)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filière (Bac Marocain) */}
        {formData.bacType === 'marocain' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'الشعبة' : 'Filière'}
            </label>
            <select
              value={formData.bacFiliere}
              onChange={(e) => handleChange('bacFiliere', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">{t.select}</option>
              {BAC_MAROCAIN_FILIERES.map(filiere => (
                <option key={filiere.value} value={filiere.value}>
                  {getLabel(filiere)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Spécialités (Bac Mission) */}
        {formData.bacType === 'mission' && getMaxSpecialites() > 0 && (
          <div className="mb-6">
            {/* Header avec compteur */}
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {language === 'ar' ? 'التخصصات' : 'Spécialités'}
              </label>
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${formData.bacSpecialites.length === getMaxSpecialites()
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
                  }`}>
                  {formData.bacSpecialites.length}/{getMaxSpecialites()}
                </div>
                {formData.bacSpecialites.length === getMaxSpecialites() && (
                  <CheckIcon className="w-5 h-5 text-green-600" />
                )}
              </div>
            </div>

            {/* Instructions dynamiques */}
            <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">
                {formData.studyLevel === '1ère année Baccalauréat'
                  ? (language === 'ar'
                    ? '🎯 اختر 3 تخصصات للسنة الأولى من البكالوريا'
                    : '🎯 Sélectionnez 3 spécialités pour la Première')
                  : (language === 'ar'
                    ? '🎯 اختر تخصصين للسنة النهائية'
                    : '🎯 Sélectionnez 2 spécialités pour la Terminale')
                }
              </p>
              {formData.bacSpecialites.length > 0 && (
                <p className="text-xs text-blue-600 mt-1">
                  {language === 'ar'
                    ? `${getMaxSpecialites() - formData.bacSpecialites.length} تخصص(ات) متبقية`
                    : `${getMaxSpecialites() - formData.bacSpecialites.length} spécialité(s) restante(s)`
                  }
                </p>
              )}
            </div>

            {/* Spécialités sélectionnées */}
            {formData.bacSpecialites.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'التخصصات المختارة:' : 'Spécialités sélectionnées:'}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {formData.bacSpecialites.map(specialiteValue => {
                    const specialite = BAC_MISSION_SPECIALITES.find(s => s.value === specialiteValue);
                    return (
                      <div
                        key={specialiteValue}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        <CheckIcon className="w-4 h-4" />
                        <span>{getLabel(specialite!)}</span>
                        <button
                          type="button"
                          onClick={() => handleSpecialiteToggle(specialiteValue)}
                          className="ml-1 hover:bg-white/20 rounded-full p-1 transition-colors"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Grille des spécialités disponibles */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-gray-700">
                {language === 'ar' ? 'التخصصات المتاحة:' : 'Spécialités disponibles:'}
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {BAC_MISSION_SPECIALITES.map(specialite => {
                  const isSelected = formData.bacSpecialites.includes(specialite.value);
                  const isDisabled = !isSelected && formData.bacSpecialites.length >= getMaxSpecialites();

                  return (
                    <button
                      key={specialite.value}
                      type="button"
                      onClick={() => !isDisabled && handleSpecialiteToggle(specialite.value)}
                      disabled={isDisabled}
                      className={`
                        relative p-4 rounded-xl border-2 text-left transition-all duration-300 transform hover:scale-102
                        ${isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
                          : isDisabled
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25 hover:shadow-md'
                        }
                      `}
                    >
                      {/* Badge de sélection */}
                      <div className="absolute top-3 right-3">
                        {isSelected ? (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckIcon className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className={`w-6 h-6 border-2 rounded-full ${isDisabled ? 'border-gray-300' : 'border-gray-400'
                            }`} />
                        )}
                      </div>

                      {/* Contenu de la spécialité */}
                      <div className="pr-8">
                        <h6 className={`font-medium text-sm mb-1 ${isSelected ? 'text-blue-900' : isDisabled ? 'text-gray-400' : 'text-gray-900'
                          }`}>
                          {getLabel(specialite)}
                        </h6>

                        {/* Icônes par spécialité */}
                        <div className="text-xs text-gray-500">
                          {specialite.value === 'math'}
                          {specialite.value === 'pc'}
                          {specialite.value === 'svt'}
                          {specialite.value === 'nsi'}
                          {specialite.value === 'ses'}
                          {specialite.value === 'hggsp'}
                          {specialite.value === 'hlp'}
                          {specialite.value === 'llce'}
                          {specialite.value === 'arts'}
                          {specialite.value === 'technologique'}
                        </div>
                      </div>

                      {/* Animation de sélection */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-blue-500/5 rounded-xl animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message d'état */}
            {formData.bacSpecialites.length === getMaxSpecialites() && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckIcon className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-800 font-medium">
                    {language === 'ar'
                      ? '✅ تم اختيار جميع التخصصات المطلوبة'
                      : '✅ Toutes les spécialités requises ont été sélectionnées'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Année d'obtention pour bacheliers des années antérieures */}
        {formData.studyLevel === 'Bachelier' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'سنة الحصول على البكالوريا' : 'Année d\'obtention du Baccalauréat'}
            </label>
            <select
              value={formData.bacYear}
              onChange={(e) => handleChange('bacYear', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">{t.select}</option>
              {ANNEE_BAC.map(annee => (
                <option key={annee.value} value={annee.value}>
                  {annee.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.bacType && (
          formData.studyLevel === '1ère année Baccalauréat' ||
          formData.noteAvailability ||
          formData.studyLevel === 'Bachelier'
        ) && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center gap-2">
                <CalculatorIcon className="w-5 h-5" />
                {language === 'ar' ? 'النقط والمعدلات' : 'Notes et Moyennes'}
                {formData.noteAvailability === 'estimation' && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                    {language === 'ar' ? 'تقدير' : 'Estimation'}
                  </span>
                )}
              </h4>

              {/* Notes pour Bac Marocain */}
              {formData.bacType === 'marocain' && (
                <div className="space-y-4">
                  {/* Informations contextuelles */}
                  <div className={`p-3 border rounded-lg ${formData.noteAvailability === 'estimation'
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-blue-50 border-blue-200'
                    }`}>
                    <p className={`text-sm font-medium mb-1 ${formData.noteAvailability === 'estimation'
                      ? 'text-orange-800'
                      : 'text-blue-800'
                      }`}>
                      {formData.noteAvailability === 'estimation'
                        ? (language === 'ar'
                          ? '📝 تقدير النقط - قدر النقط التي تتوقع الحصول عليها'
                          : '📝 Estimation des notes - Estimez les notes que vous pensez obtenir')
                        : (language === 'ar'
                          ? 'ℹ️ طريقة الحساب المستخدمة لعتبات المدارس العليا'
                          : 'ℹ️ Méthode de calcul utilisée pour les seuils des écoles supérieures')
                      }
                    </p>
                    <p className={`text-xs ${formData.noteAvailability === 'estimation'
                      ? 'text-orange-600'
                      : 'text-blue-600'
                      }`}>
                      {formData.noteAvailability === 'estimation'
                        ? (language === 'ar'
                          ? 'ستحسب النقط التقديرية تلقائياً'
                          : 'Les notes estimées seront calculées automatiquement')
                        : (language === 'ar'
                          ? 'ستحسب النقط العامة تلقائياً بجميع الطرق'
                          : 'Les notes générales seront calculées automatiquement avec toutes les méthodes')
                      }
                    </p>
                  </div>

                  {/* Saisie des notes */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Note 1ère Bac */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'النقطة العامة للسنة الأولى (جهوي)' : 'Note générale 1ère Bac (Régional)'}
                        {formData.noteAvailability === 'estimation' && (
                          <span className="text-xs text-orange-600 ml-1">
                            {language === 'ar' ? '(تقدير)' : '(estimation)'}
                          </span>
                        )}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="20"
                        value={formData.noteAvailability === 'estimation'
                          ? formData.noteGenerale1ereBacEstimation
                          : formData.noteGenerale1ereBac}
                        onChange={(e) => handleChange(
                          formData.noteAvailability === 'estimation'
                            ? 'noteGenerale1ereBacEstimation'
                            : 'noteGenerale1ereBac',
                          e.target.value
                        )}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Note contrôle continu */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'نقطة المراقبة المستمرة' : 'Note Contrôle Continu'}
                        {formData.noteAvailability === 'estimation' && (
                          <span className="text-xs text-orange-600 ml-1">
                            {language === 'ar' ? '(تقدير)' : '(estimation)'}
                          </span>
                        )}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="20"
                        value={formData.noteAvailability === 'estimation'
                          ? formData.noteControleConinuEstimation
                          : formData.noteControleContinu}
                        onChange={(e) => handleChange(
                          formData.noteAvailability === 'estimation'
                            ? 'noteControleConinuEstimation'
                            : 'noteControleContinu',
                          e.target.value
                        )}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>

                    {/* Note national */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'ar' ? 'نقطة الامتحان الوطني' : 'Note Examen National'}
                        {formData.noteAvailability === 'estimation' && (
                          <span className="text-xs text-orange-600 ml-1">
                            {language === 'ar' ? '(تقدير)' : '(estimation)'}
                          </span>
                        )}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="20"
                        value={formData.noteAvailability === 'estimation'
                          ? formData.noteNationalEstimation
                          : formData.noteNational}
                        onChange={(e) => handleChange(
                          formData.noteAvailability === 'estimation'
                            ? 'noteNationalEstimation'
                            : 'noteNational',
                          e.target.value
                        )}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Résultats calculés */}
                  {((formData.noteAvailability === 'disponible' && (formData.noteCalculeeMethod1 || formData.noteCalculeeMethod2 || formData.noteCalculeeMethod3)) ||
                    (formData.noteAvailability === 'estimation' && (formData.noteCalculeeMethod1Estimation || formData.noteCalculeeMethod2Estimation || formData.noteCalculeeMethod3Estimation))) && (
                      <div className="mt-6 space-y-3">
                        <h5 className="text-sm font-semibold text-gray-800 mb-3">
                          {formData.noteAvailability === 'estimation'
                            ? (language === 'ar' ? 'النقط التقديرية المحسوبة:' : 'Notes estimées calculées:')
                            : (language === 'ar' ? 'النقط العامة المحسوبة:' : 'Notes générales calculées:')
                          }
                        </h5>

                        {/* Méthode 1 */}
                        {(formData.noteCalculeeMethod1 || formData.noteCalculeeMethod1Estimation) && (
                          <div className={`p-4 bg-gradient-to-r border rounded-lg ${formData.noteAvailability === 'estimation'
                            ? 'from-orange-50 to-yellow-50 border-orange-200'
                            : 'from-green-50 to-emerald-50 border-green-200'
                            }`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className={`text-sm font-medium ${formData.noteAvailability === 'estimation' ? 'text-orange-800' : 'text-green-800'
                                  }`}>
                                  {language === 'ar'
                                    ? '25% جهوي + 25% مراقبة مستمرة + 50% وطني'
                                    : '25% Régional + 25% CC + 50% National'
                                  }
                                </p>
                                <p className={`text-xs mt-1 ${formData.noteAvailability === 'estimation' ? 'text-orange-600' : 'text-green-600'
                                  }`}>
                                  {language === 'ar' ? 'الطريقة الأولى' : 'Méthode 1'}
                                  {formData.noteAvailability === 'estimation' && (
                                    <span className="ml-1">({language === 'ar' ? 'تقدير' : 'estimation'})</span>
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <CalculatorIcon className={`w-4 h-4 ${formData.noteAvailability === 'estimation' ? 'text-orange-600' : 'text-green-600'
                                  }`} />
                                <span className={`text-lg font-bold ${formData.noteAvailability === 'estimation' ? 'text-orange-800' : 'text-green-800'
                                  }`}>
                                  {formData.noteAvailability === 'estimation'
                                    ? formData.noteCalculeeMethod1Estimation
                                    : formData.noteCalculeeMethod1}/20
                                </span>
                              </div>
                            </div>
                          </div>
                        )}


                        {/* Méthode 2: 50% National + 50% Régional */}
                        {(formData.noteCalculeeMethod2 || formData.noteCalculeeMethod2Estimation) && (
                          <div className={`p-4 bg-gradient-to-r border rounded-lg ${formData.noteAvailability === 'estimation'
                            ? 'from-orange-50 to-yellow-50 border-orange-200'
                            : 'from-blue-50 to-cyan-50 border-blue-200'
                            }`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className={`text-sm font-medium ${formData.noteAvailability === 'estimation' ? 'text-orange-800' : 'text-blue-800'
                                  }`}>
                                  {language === 'ar'
                                    ? '50% وطني + 50% جهوي'
                                    : '50% National + 50% Régional'
                                  }
                                </p>
                                <p className={`text-xs mt-1 ${formData.noteAvailability === 'estimation' ? 'text-orange-600' : 'text-blue-600'
                                  }`}>
                                  {language === 'ar' ? 'الطريقة الثانية' : 'Méthode 2'}
                                  {formData.noteAvailability === 'estimation' && (
                                    <span className="ml-1">({language === 'ar' ? 'تقدير' : 'estimation'})</span>
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <CalculatorIcon className={`w-4 h-4 ${formData.noteAvailability === 'estimation' ? 'text-orange-600' : 'text-blue-600'
                                  }`} />
                                <span className={`text-lg font-bold ${formData.noteAvailability === 'estimation' ? 'text-orange-800' : 'text-blue-800'
                                  }`}>
                                  {formData.noteAvailability === 'estimation'
                                    ? formData.noteCalculeeMethod2Estimation
                                    : formData.noteCalculeeMethod2}/20
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Méthode 3: 75% National + 25% Régional */}
                        {(formData.noteCalculeeMethod3 || formData.noteCalculeeMethod3Estimation) && (
                          <div className={`p-4 bg-gradient-to-r border rounded-lg ${formData.noteAvailability === 'estimation'
                            ? 'from-orange-50 to-yellow-50 border-orange-200'
                            : 'from-purple-50 to-indigo-50 border-purple-200'
                            }`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className={`text-sm font-medium ${formData.noteAvailability === 'estimation' ? 'text-orange-800' : 'text-purple-800'
                                  }`}>
                                  {language === 'ar'
                                    ? '75% وطني + 25% جهوي'
                                    : '75% National + 25% Régional'
                                  }
                                </p>
                                <p className={`text-xs mt-1 ${formData.noteAvailability === 'estimation' ? 'text-orange-600' : 'text-purple-600'
                                  }`}>
                                  {language === 'ar' ? 'الطريقة الثالثة' : 'Méthode 3'}
                                  {formData.noteAvailability === 'estimation' && (
                                    <span className="ml-1">({language === 'ar' ? 'تقدير' : 'estimation'})</span>
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <CalculatorIcon className={`w-4 h-4 ${formData.noteAvailability === 'estimation' ? 'text-orange-600' : 'text-purple-600'
                                  }`} />
                                <span className={`text-lg font-bold ${formData.noteAvailability === 'estimation' ? 'text-orange-800' : 'text-purple-800'
                                  }`}>
                                  {formData.noteAvailability === 'estimation'
                                    ? formData.noteCalculeeMethod3Estimation
                                    : formData.noteCalculeeMethod3}/20
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Note explicative adaptée */}
                        <div className={`p-3 border rounded-lg ${formData.noteAvailability === 'estimation'
                          ? 'bg-orange-50 border-orange-200'
                          : 'bg-gray-50 border-gray-200'
                          }`}>
                          <p className={`text-xs ${formData.noteAvailability === 'estimation' ? 'text-orange-600' : 'text-gray-600'
                            }`}>
                            {formData.noteAvailability === 'estimation'
                              ? (language === 'ar'
                                ? '⚠️ هذه تقديرات فقط بناءً على توقعاتك. النقط الحقيقية قد تختلف.'
                                : '⚠️ Ces sont des estimations basées sur vos attentes. Les notes réelles peuvent différer.')
                              : (language === 'ar'
                                ? '💡 هذه النقط محسوبة حسب معايير المدارس العليا. كل مؤسسة قد تستخدم طريقة مختلفة.'
                                : '💡 Ces notes sont calculées selon les critères des écoles supérieures. Chaque établissement peut utiliser une méthode différente.')
                            }
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Notes pour Bac Mission - reste inchangé */}
              {formData.bacType === 'mission' && (
                <div className="space-y-4">
                  {/* Information Mission */}
                  <div className={`p-3 border rounded-lg ${formData.noteAvailability === 'estimation'
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-purple-50 border-purple-200'
                    }`}>
                    <p className={`text-sm font-medium ${formData.noteAvailability === 'estimation'
                      ? 'text-orange-800'
                      : 'text-purple-800'
                      }`}>
                      {formData.noteAvailability === 'estimation'
                        ? (language === 'ar'
                          ? '📝 تقدير النقط - قدر النقط التي تتوقع الحصول عليها'
                          : '📝 Estimation des notes - Estimez les notes que vous pensez obtenir')
                        : (language === 'ar'
                          ? 'ℹ️ نظام البكالوريا الفرنسية - أدخل النقط يدوياً'
                          : 'ℹ️ Système Baccalauréat Français - Saisie manuelle des notes')
                      }
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Note générale Première */}
                    {(formData.studyLevel === '2ème année Baccalauréat en cours' ||
                      formData.studyLevel === '2ème année Baccalauréat terminé' ||
                      formData.studyLevel === 'Bachelier') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {language === 'ar' ? 'المعدل العام للسنة الأولى' : 'Moyenne générale Première'}
                            {formData.noteAvailability === 'estimation' && (
                              <span className="text-xs text-orange-600 ml-1">
                                {language === 'ar' ? '(تقدير)' : '(estimation)'}
                              </span>
                            )}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="20"
                            value={formData.noteAvailability === 'estimation'
                              ? formData.noteGeneralePremiereEstimation
                              : formData.noteGeneralePremiere}
                            onChange={(e) => handleChange(
                              formData.noteAvailability === 'estimation'
                                ? 'noteGeneralePremiereEstimation'
                                : 'noteGeneralePremiere',
                              e.target.value
                            )}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                      )}

                    {/* Note générale Terminale */}
                    {(formData.studyLevel === '2ème année Baccalauréat en cours' ||
                      formData.studyLevel === '2ème année Baccalauréat terminé' ||
                      formData.studyLevel === 'Bachelier') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {language === 'ar' ? 'المعدل العام للسنة النهائية' : 'Moyenne générale Terminale'}
                            {formData.noteAvailability === 'estimation' && (
                              <span className="text-xs text-orange-600 ml-1">
                                {language === 'ar' ? '(تقدير)' : '(estimation)'}
                              </span>
                            )}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="20"
                            value={formData.noteAvailability === 'estimation'
                              ? formData.noteGeneraleTerminaleEstimation
                              : formData.noteGeneraleTerminale}
                            onChange={(e) => handleChange(
                              formData.noteAvailability === 'estimation'
                                ? 'noteGeneraleTerminaleEstimation'
                                : 'noteGeneraleTerminale',
                              e.target.value
                            )}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                          />
                        </div>
                      )}

                    {/* Note générale du Bac */}
                    {(formData.studyLevel === '2ème année Baccalauréat en cours' ||
                      formData.studyLevel === '2ème année Baccalauréat terminé' ||
                      formData.studyLevel === 'Bachelier') && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {language === 'ar' ? 'النقطة العامة للبكالوريا' : 'Note générale du Baccalauréat'}
                            {formData.noteAvailability === 'estimation' && (
                              <span className="text-xs text-orange-600 ml-1">
                                {language === 'ar' ? '(تقدير)' : '(estimation)'}
                              </span>
                            )}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="20"
                            value={formData.noteAvailability === 'estimation'
                              ? formData.noteGeneraleBacEstimation
                              : formData.noteGeneraleBac}
                            onChange={(e) => handleChange(
                              formData.noteAvailability === 'estimation'
                                ? 'noteGeneraleBacEstimation'
                                : 'noteGeneraleBac',
                              e.target.value
                            )}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                          />
                          <p className={`text-xs mt-1 ${formData.noteAvailability === 'estimation' ? 'text-orange-600' : 'text-gray-500'
                            }`}>
                            {formData.noteAvailability === 'estimation'
                              ? (language === 'ar'
                                ? 'قدر النقطة العامة التي تتوقع الحصول عليها في البكالوريا'
                                : 'Estimez la note générale que vous pensez obtenir au Baccalauréat')
                              : (language === 'ar'
                                ? 'أدخل النقطة العامة التي حصلت عليها في البكالوريا'
                                : 'Saisissez la note générale obtenue au Baccalauréat')
                            }
                          </p>
                        </div>
                      )}
                  </div>

                  {/* Message d'avertissement pour les estimations */}
                  {formData.noteAvailability === 'estimation' && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircleIcon className="w-4 h-4 text-orange-600" />
                        <p className="text-xs text-orange-600">
                          {language === 'ar'
                            ? '⚠️ هذه تقديرات فقط بناءً على توقعاتك. النقط الحقيقية قد تختلف.'
                            : '⚠️ Ces sont des estimations basées sur vos attentes. Les notes réelles peuvent différer.'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
      </div>


      {/* Afficher un message d'erreur si nécessaire */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Navigation - mise à jour pour afficher l'état de chargement */}
      <div className="flex justify-between items-center pt-6">
        {canGoBack && (
          <button
            type="button"
            onClick={onPrevious}
            disabled={isSubmitting}
            className={`inline-flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>{t.previous}</span>
          </button>
        )}

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed ml-auto ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
        >
          {isSubmitting ? (
            <>
              <Loader2Icon className="w-4 h-4 animate-spin" />
              <span>{language === 'ar' ? 'جار الحفظ...' : 'Enregistrement...'}</span>
            </>
          ) : (
            <>
              <span>{t.continue}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;