import React from 'react';
import { UserIcon, BrainIcon, GraduationCapIcon, TrendingUpIcon, MapPinIcon, BookOpenIcon, LanguagesIcon, CheckCircleIcon } from 'lucide-react';

interface PrintableReportProps {
    userData: any;
    language: string;
}


// Dictionnaire pour les contraintes et préférences
const translations = {
    fr: {
        // Mobilité
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

        // Budget
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

        // Éducation
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

        directorSignature: "Signature du Directeur",
        counselorSignature: "Signature du Conseiller d'Orientation",
        shareTest: "Partagez ce test d'orientation",
    },
    ar: {
        // Mobilité
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

        // Budget
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

        // Éducation
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

        directorSignature: "توقيع المدير",
        counselorSignature: "توقيع مستشار التوجيه",
        shareTest: "شارك اختبار التوجيه هذا",
    }
};

// Ajout d'un dictionnaire de traduction pour les spécialités du Bac Mission
const bacMissionSpecialites = {
    fr: {
        math: 'Mathématiques',
        pc: 'Physique-Chimie',
        svt: 'SVT (Sciences de la Vie et de la Terre)',
        nsi: 'Numérique et Sciences Informatiques (NSI)',
        ses: 'SES (Sciences Économiques et Sociales)',
        hggsp: 'HGGSP (Histoire-Géo, Géopolitique, Sciences Politiques)',
        hlp: 'HLP (Humanités, Littérature, Philosophie)',
        llce: 'LLCE (Langues, Littératures et Cultures Étrangères)',
        arts: 'Arts (Théâtre, Musique, Arts Plastiques...)',
        technologique: 'Technologique (STMG, STI2D, STL, ...)'
    },
    ar: {
        math: 'الرياضيات',
        pc: 'الفيزياء والكيمياء',
        svt: 'علوم الحياة والأرض',
        nsi: 'الرقمية وعلوم الكمبيوتر',
        ses: 'العلوم الاقتصادية والاجتماعية',
        hggsp: 'التاريخ والجغرافيا والجيوسياسة والعلوم السياسية',
        hlp: 'العلوم الإنسانية والأدب والفلسفة',
        llce: 'اللغات والآداب والثقافات الأجنبية',
        arts: 'الفنون (المسرح، الموسيقى، الفنون التشكيلية...)',
        technologique: 'التكنولوجي (STMG، STI2D، STL، ...)'
    }
};

// Ajoutez également un dictionnaire pour les langues
const languages = {
    fr: [
        { code: 'fr', name: 'Français' },
        { code: 'en', name: 'Anglais' },
        { code: 'ar', name: 'Arabe' },
        { code: 'es', name: 'Espagnol' }
    ],
    ar: [
        { code: 'fr', name: 'الفرنسية' },
        { code: 'en', name: 'الإنجليزية' },
        { code: 'ar', name: 'العربية' },
        { code: 'es', name: 'الإسبانية' }
    ]
};


// Ajouter cette constante après les dictionnaires de traduction existants
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



// Dans le composant PrintableReport, modifiez le dictionnaire de traduction t pour inclure plus d'éléments
const t = {
    fr: {
        academicGrades: "Notes Académiques",
        orientationReport: "Rapport d'Orientation",
        personalInfo: "Informations personnelles",
        name: "Nom",
        age: "Âge",
        city: "Ville",
        studyLevel: "Niveau d'étude",
        bac: "Baccalauréat",
        notes: "Notes académiques",
        riasecProfile: "Profil RIASEC",
        personalityProfile: "Profil de personnalité",
        aptitudes: "Aptitudes",
        interests: "Intérêts académiques",
        careers: "Compatibilité professionnelle",
        constraints: "Contraintes et priorités",
        languages: "Compétences linguistiques",
        recommendations: "Recommandations",
        generatedOn: "Généré le",
        confidential: "CONFIDENTIEL",
        // Ajouts pour les sections de contraintes
        mobilityTitle: "Mobilité géographique",
        changeCity: "Changer de ville",
        studyAbroad: "Étudier à l'étranger",
        internationalCareer: "Carrière internationale",
        financialConstraints: "Contraintes financières",
        availableBudget: "Budget disponible",
        scholarshipEligible: "Éligible aux bourses",
        familySupport: "Soutien familial",
        educationPreferences: "Préférences d'études",
        maxLevel: "Niveau maximum",
        preferredDuration: "Durée préférée",
        studyMode: "Mode d'études",
        careerPriorities: "Priorités de carrière",
        salary: "Salaire élevé",
        stability: "Stabilité",
        passion: "Passion",
        prestige: "Prestige",
        workLife: "Équilibre vie-travail",
        // Compétences linguistiques
        speaking: "Expression orale",
        writing: "Expression écrite",
        listening: "Compréhension orale",
        reading: "Compréhension écrite",
        score: "Score",
        // Notes académiques
        regional: "Régional",
        national: "National",
        generalAverage: "Moyenne générale",
        firstYear: "Moyenne Première",
        finalYear: "Moyenne Terminale",
        bacAverage: "Moyenne Bac",
        // Profil RIASEC et personnalité
        dominantProfile: "Profil dominant",
        dominantTraits: "Traits dominants",
        globalScore: "Score global",
        level: "Niveau",
        annexe: "ANNEXE",
        questions: "Questions et Réponses",
        photoText: "Photo de l'étudiant",
        directorSignature: "Signature du Directeur",
        counselorSignature: "Signature du Conseiller d'Orientation",
        officialReport: "Rapport d'Orientation Officiel",
        photoPlaceholder: "Emplacement pour la photo officielle",
        calculationMethods: "Méthodes de calcul des seuils",
        calculationMethod1: "Méthode 1: 25% Régional + 25% CC + 50% National",
        calculationMethod2: "Méthode 2: 50% National + 50% Régional",
        calculationMethod3: "Méthode 3: 75% National + 25% Régional",
        riasecTitle: "Test RIASEC",
        personalityTitle: "Test de personnalité",
        aptitudeTitle: "Test d'aptitudes",
        interestsTitle: "Test d'intérêts académiques",
        careerTitle: "Test de compatibilité professionnelle",
        constraintsTitle: "Test de contraintes",
        languageTitle: "Test de compétences linguistiques",
        question: "Question",
        answer: "Réponse",
        timeSpent: "Temps passé",
        approved: "Approuvé par",
        date: "Date",
        studentSignature: "Signature de l'étudiant",
        // Ajouter ces nouvelles traductions
        subject: "Matière",
        field: "Domaine",
        interestLevel: "Niveau d'intérêt",
        detailedSubjects: "Matières détaillées",
        // Ajout des types d'aptitude
        logique: "Raisonnement logique",
        spatial: "Raisonnement spatial",
        numerique: "Raisonnement numérique",
        abstrait: "Raisonnement abstrait",
        mecanique: "Raisonnement mécanique",
        critique: "Pensée critique",
        culture: "Culture générale",
        etudes: "Études supérieures",

        // Ajout des traits de personnalité
        autonomie: "Autonomie",
        perseverance: "Persévérance",
        creativite: "Créativité",
        adaptabilite: "Adaptabilité",
        controleContinu: "Contrôle Continu",
        moyenneGenerale: "Moyenne Générale",

        // Catégories RIASEC
        Realiste: "Réaliste",
        Investigateur: "Investigateur",
        Artistique: "Artistique",
        Social: "Social",
        Entreprenant: "Entreprenant",
        Conventionnel: "Conventionnel",

        // Profil RIASEC et personnalité
        profilDominant: "Profil dominant",
        specialties: "Spécialités",
        bacYear: "Année d'obtention",
        bacPending: "En cours d'obtention",
        notAvailable: "Non disponible",
        estimatedAverage: "Moyenne estimée"
    },
    ar: {
        academicGrades: "النتائج الأكاديمية",
        orientationReport: "تقرير التوجيه",
        personalInfo: "معلومات شخصية",
        name: "الاسم",
        age: "العمر",
        city: "المدينة",
        studyLevel: "المستوى الدراسي",
        bac: "البكالوريا",
        notes: "النقط الدراسية",
        riasecProfile: "ملف RIASEC",
        personalityProfile: "ملف الشخصية",
        aptitudes: "القدرات",
        interests: "الاهتمامات الأكاديمية",
        careers: "التوافق المهني",
        constraints: "القيود والأولويات",
        languages: "المهارات اللغوية",
        recommendations: "التوصيات",
        generatedOn: "أُنشئ في",
        confidential: "سري",
        // Ajouts pour les sections de contraintes
        mobilityTitle: "الحركية الجغرافية",
        changeCity: "تغيير المدينة",
        studyAbroad: "الدراسة في الخارج",
        internationalCareer: "مهنة دولية",
        financialConstraints: "القيود المالية",
        availableBudget: "الميزانية المتاحة",
        scholarshipEligible: "مؤهل للمنح الدراسية",
        familySupport: "الدعم الأسري",
        educationPreferences: "تفضيلات الدراسة",
        maxLevel: "المستوى الأقصى",
        preferredDuration: "المدة المفضلة",
        studyMode: "نمط الدراسة",
        careerPriorities: "أولويات المهنة",
        salary: "راتب عالي",
        stability: "استقرار الوظيفة",
        passion: "شغف بالمهنة",
        prestige: "مكانة اجتماعية",
        workLife: "توازن بين العمل والحياة",
        // Compétences linguistiques
        speaking: "تحدث",
        writing: "كتابة",
        listening: "استماع",
        reading: "قراءة",
        score: "النتيجة",
        // Notes académiques
        regional: "الجهوي",
        national: "الوطني",
        generalAverage: "المعدل العام",
        firstYear: "معدل السنة الأولى",
        finalYear: "معدل السنة النهائية",
        bacAverage: "معدل البكالوريا",
        // Profil RIASEC et personnalité
        dominantProfile: "الملف المهيمن",
        dominantTraits: "السمات المهيمنة",
        globalScore: "النتيجة الإجمالية",
        level: "المستوى",
        annexe: "ملحق",
        questions: "الأسئلة والأجوبة",
        photoText: "صورة الطالب",
        directorSignature: "توقيع المدير",
        counselorSignature: "توقيع مستشار التوجيه",
        officialReport: "تقرير التوجيه الرسمي",
        photoPlaceholder: "مكان الصورة الرسمية",
        calculationMethods: "طرق حساب العتبات",
        calculationMethod1: "الطريقة 1: 25% جهوي + 25% مراقبة مستمرة + 50% وطني",
        calculationMethod2: "الطريقة 2: 50% وطني + 50% جهوي",
        calculationMethod3: "الطريقة 3: 75% وطني + 25% جهوي",
        riasecTitle: "اختبار RIASEC",
        personalityTitle: "اختبار الشخصية",
        aptitudeTitle: "اختبار القدرات",
        interestsTitle: "اختبار الاهتمامات الأكاديمية",
        careerTitle: "اختبار التوافق المهني",
        constraintsTitle: "اختبار القيود",
        languageTitle: "اختبار الكفاءات اللغوية",
        question: "سؤال",
        answer: "جواب",
        timeSpent: "الوقت المستغرق",
        approved: "المصادقة من طرف",
        date: "التاريخ",
        studentSignature: "توقيع الطالب",
        subject: "المادة",
        field: "المجال",
        interestLevel: "مستوى الاهتمام",
        detailedSubjects: "المواد التفصيلية",
        // Ajout des types d'aptitude
        logique: "التفكير المنطقي",
        spatial: "التفكير المكاني",
        numerique: "التفكير الرقمي",
        abstrait: "التفكير المجرد",
        mecanique: "التفكير الميكانيكي",
        critique: "التفكير النقدي",
        culture: "الثقافة العامة",
        etudes: "الدراسات العليا",

        // Ajout des traits de personnalité
        autonomie: "الاستقلالية",
        perseverance: "المثابرة",
        creativite: "الإبداع",
        adaptabilite: "التكيف",
        controleContinu: "المراقبة المستمرة",
        moyenneGenerale: "المعدل العام",

        // Catégories RIASEC
        Realiste: "الواقعي",
        Investigateur: "الباحث",
        Artistique: "الفني",
        Social: "الاجتماعي",
        Entreprenant: "المقاول",
        Conventionnel: "التقليدي",

        // Profil RIASEC et personnalité
        profilDominant: "الملف المهيمن",
        specialties: "التخصصات",
        bacYear: "سنة الحصول",
        bacPending: "قيد الإنجاز",
        notAvailable: "غير متوفر",
        estimatedAverage: "المعدل التقديري"
    }
};


const PrintableReport: React.FC<PrintableReportProps> = ({ userData, language = 'fr' }) => {
    // Dictionnaire de traduction simplifié pour l'impression


    // Ajouter cette fonction utilitaire dans le composant
    const getLocalizedFieldName = (subjectName: string) => {
        const fields = academicFields[language as 'fr' | 'ar'] || academicFields.fr;
        const field = fields.find(f => f.name === subjectName);
        return field ? field.category : "-";
    };

    const text = t[language as 'fr' | 'ar'] || t.fr;
    const isRTL = language === 'ar';

    const formatDate = () => {
        return new Date().toLocaleDateString(
            language === 'ar' ? 'ar-MA' : 'fr-FR',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }
        );
    };

    const formatDuration = (duration: number) => {
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        return `${minutes}min ${seconds}s`;
    };

    return (
        <div className={`print-only ${isRTL ? 'rtl' : 'ltr'}`}>
            <style jsx global>{`

    
    
    /* Style pour la liste des matières */
    .subjects-list {
      margin-top: 5px;
      font-size: 9pt;
      color: #4b5563;
    }
    
    .subject-item {
      margin-bottom: 3px;
      display: flex;
      justify-content: space-between;
    }
    
    .subject-name {
      font-weight: normal;
    }
    
    .subject-score {
      font-weight: bold;
    }
    
    /* Style pour un indicateur d'expansion */
    .expand-indicator {
      font-size: 10pt;
      color: #6b7280;
      cursor: pointer;
      text-align: center;
      margin-top: 5px;
    }
    .signature-section {
      margin-top: 40px;
      display: flex;
      justify-content: space-between; /* Écarte les signatures au maximum */
      width: 100%;
      page-break-inside: avoid;
    }
    
    .signature-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 45%; /* Largeur suffisante mais pas excessive */
      max-width: 300px; /* Limite la largeur maximale */
    }
    
    .signature-line {
      width: 100%;
      border-top: 1px solid #000;
      margin-top: 40px;
      margin-bottom: 5px;
    }

    .signature-left {
      align-items: flex-start; /* Aligne le contenu à gauche */
      text-align: left;
    }
    
    .signature-right {
      align-items: flex-end; /* Aligne le contenu à droite */
      text-align: right;
      margin-left: auto; /* Pousse la signature vers la droite */
    }
    
    .signature-title {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .signature-name {
      font-style: italic;
    }
    
    .signature-role {
      font-size: 9pt;
      color: #4b5563;
    }
    
    .stamp-placeholder {
      border: 1px dashed #dc2626;
      border-radius: 50%;
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 10px auto;
      color: #dc2626;
      font-size: 8pt;
      text-align: center;
      line-height: 1.2;
    }
    
    .qr-section {
      margin-top: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      page-break-inside: avoid;
    }
    
    .qr-container {
      border: 1px solid #e5e7eb;
      padding: 10px;
      background-color: white;
      display: inline-block;
      margin-bottom: 10px;
    }
    
    .qr-title {
      font-weight: bold;
      margin-bottom: 5px;
      text-align: center;
    }
    
    .qr-description {
      font-size: 9pt;
      color: #4b5563;
      text-align: center;
      max-width: 300px;
      margin: 0 auto;
    }
        @page {
          size: A4;
          margin: 1.5cm;
        }
        @media print {
          html, body {
            width: 210mm;
            height: 297mm;
            font-family: Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.3;
            color: #333;
          }
          .print-only {
            display: block !important;
          }
          .page-break {
            page-break-before: always;
          }
          .no-break {
            page-break-inside: avoid;
          }
          .rtl {
            direction: rtl;
            text-align: right;
          }

          .header-logo {
      height: 100px; /* Taille doublée par rapport à la valeur précédente de 50px */
      margin-bottom: 5px;
    }
    
    .avoid-break {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
       .section-group {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 20px;
    }
          .section {
      margin-bottom: 15px;
      break-inside: avoid;
    }
      .card > div:last-child {
      margin-bottom: 0;
    }
          .section-title {
            font-size: 14pt;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2563eb;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
          }
          .card {
            padding: 10px;
            border: 1px solid #e5e7eb;
            border-radius: 5px;
            margin-bottom: 10px;
            background-color: #f9fafb;
          }
          .flex {
            display: flex;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .grid-3 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
          .bold {
            font-weight: bold;
          }
          .text-primary {
            color: #2563eb;
          }
          .text-secondary {
            color: #4b5563;
          }
          .text-sm {
            font-size: 9pt;
          }
          .header-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
          }
.official-stamp {
  position: absolute;
  top: 120px;
  right: 40px;
  transform: rotate(-12deg);
  color: rgba(220, 38, 38, 0.2);  /* Rouge avec légère transparence */
  font-size: 32pt;
  font-weight: bold;
  border: 6px solid rgba(220, 38, 38, 0.2);  /* Bordure rouge avec légère transparence */
  padding: 12px 24px;
  text-transform: uppercase;
  white-space: nowrap;
  border-radius: 8px;
  letter-spacing: 1px;
  z-index: 10;
}
          .watermark {
            position: fixed;
            top: 50%;
            left: 0;
            width: 100%;
            text-align: center;
            opacity: 0.1;
            transform: rotate(-45deg);
            font-size: 100pt;
            font-weight: bold;
            z-index: -1;
            white-space: nowrap;
          }
          .mb-0 { margin-bottom: 0; }
          .mb-1 { margin-bottom: 5px; }
          .mb-2 { margin-bottom: 10px; }
          .mb-3 { margin-bottom: 15px; }
          .p-1 { padding: 5px; }
          .p-2 { padding: 10px; }
          .bar-container {
            height: 10px;
            background-color: #e5e7eb;
            border-radius: 5px;
            margin-top: 5px;
          }
          .bar {
            height: 10px;
            border-radius: 5px;
          }
          .bar-riasec { background-color: #8b5cf6; }
          .bar-personality { background-color: #10b981; }
          .bar-aptitude { background-color: #f59e0b; }
          .bar-interest { background-color: #3b82f6; }
          .bar-career { background-color: #6366f1; }
          .footer {
            position: fixed;
            bottom: 20px;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 9pt;
            color: #6b7280;
          }
             .signature-line {
      width: 100%;
      border-top: 1px solid #000;
      margin-top: 40px;
      margin-bottom: 5px;
    }
          .photo-box {
      border: 1px solid #e5e7eb;
      width: 120px;
      height: 150px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-left: 0;
      background-color: #f9fafb;
      border-radius: 5px;
    }
          .page-number:after {
            content: counter(page);
          }
            .personal-info-container {
      display: flex;
      gap: 10px;
      width: 100%;
    }
    
    .personal-info-card {
      flex: 1;
      width: auto;
    }
          .annexe-title {
            font-size: 20pt;
            font-weight: bold;
            text-align: center;
            margin: 30px 0;
            color: #2563eb;
          }
          .annexe-subtitle {
            font-size: 16pt;
            font-weight: bold;
            margin: 20px 0 10px 0;
            color: #4b5563;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 5px;
          }
          .question-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .question-table th, .question-table td {
            border: 1px solid #e5e7eb;
            padding: 8px;
            text-align: left;
          }
          .question-table th {
            background-color: #f3f4f6;
            font-weight: bold;
          }
          .question-table tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .calculation-methods {
            border: 1px solid #e5e7eb;
            border-radius: 5px;
            background-color: #f9fafb;
            padding: 15px;
            margin-top: 15px;
          }
          .calculation-title {
            font-size: 13pt;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2563eb;
          }
          .calculation-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e5e7eb;
          }
          .calculation-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
          }
          .calculation-method {
            font-weight: bold;
          }
          .calculation-score {
            font-weight: bold;
            color: #2563eb;
          }
          .grades-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          .grades-table th, .grades-table td {
            border: 1px solid #e5e7eb;
            padding: 8px;
            text-align: center;
          }
          .grades-table th {
            background-color: #f3f4f6;
            font-weight: bold;
          }
          .grades-table tr:nth-child(even) {
            background-color: #f9fafb;
          }
        }
      `}</style>

            {/* Watermark */}
            <div className="watermark">E-TAWJIHI.ma</div>

            {/* Official Stamp */}
            <div className="official-stamp">E-TAWJIHI.ma</div>

            {/* Header */}
            <div className="header-section">
                <div>
                    <h1 style={{ fontSize: '18pt', fontWeight: 'bold', color: '#2563eb', marginBottom: '5px' }}>
                        {text.officialReport}
                    </h1>
                    <p className="text-secondary">
                        {userData.personalInfo?.firstName} {userData.personalInfo?.lastName} • {text.generatedOn} {formatDate()}
                    </p>
                </div>

                {/* Logo en haut à droite - maintenant deux fois plus grand */}
                <img src="https://cdn.educalogy.fr/logo-rectangle-nobg.png" alt="E-TAWJIHI.ma" className="header-logo" />
            </div>

            {/* Photo et informations personnelles */}
            <div className="section">
                <h2 className="section-title">{text.personalInfo}</h2>
                <div className="personal-info-container">
                    <div className="card personal-info-card">
                        <div className="grid">
                            <div>
                                <div className="mb-2">
                                    <span className="text-secondary">{text.name}: </span>
                                    <span className="bold">{userData.personalInfo?.firstName} {userData.personalInfo?.lastName}</span>
                                </div>
                                <div className="mb-2">
                                    <span className="text-secondary">{text.age}: </span>
                                    <span className="bold">{userData.personalInfo?.age}</span>
                                </div>
                                <div className="mb-2">
                                    <span className="text-secondary">{text.bac}: </span>
                                    <span className="bold">{userData.personalInfo?.bacType === "mission" ? "Mission Française" : userData.personalInfo?.bacType}</span>
                                </div>

                                {/* Afficher les spécialités pour Bac Mission */}
                                {userData.personalInfo?.bacType === "mission" && userData.personalInfo?.bacSpecialites && userData.personalInfo.bacSpecialites.length > 0 && (
                                    <div className="mb-2">
                                        <span className="text-secondary">{text.specialties}: </span>
                                        <span className="bold">
                                            {userData.personalInfo.bacSpecialites.map((spe: string, index: number) => (
                                                <span key={spe}>
                                                    {index > 0 && ", "}
                                                    {bacMissionSpecialites[language as 'fr' | 'ar'][spe as keyof typeof bacMissionSpecialites.fr] || spe}
                                                </span>
                                            ))}
                                        </span>
                                    </div>
                                )}

                                {/* Afficher l'année d'obtention pour les bacheliers */}
                                {userData.personalInfo?.studyLevel === 'Bachelier' && (
                                    <div className="mb-2">
                                        <span className="text-secondary">{text.bacYear}: </span>
                                        <span className="bold">{userData.personalInfo?.bacYear || text.notAvailable}</span>
                                    </div>
                                )}

                                {/* Indiquer si le bac est en cours */}
                                {userData.personalInfo?.studyLevel === '2ème année Baccalauréat en cours' && (
                                    <div className="mb-2">
                                        <span className="text-secondary">{text.bacYear}: </span>
                                        <span className="bold">{text.bacPending}</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="mb-2">
                                    <span className="text-secondary">{text.city}: </span>
                                    <span className="bold">{userData.personalInfo?.city}</span>
                                </div>
                                <div className="mb-2">
                                    <span className="text-secondary">{text.studyLevel}: </span>
                                    <span className="bold">{userData.personalInfo?.studyLevel}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Photo box inchangée */}
                    <div className="photo-box">
                        <span className="text-sm text-gray-500">{text.photoPlaceholder}</span>
                    </div>
                </div>
            </div>

            {/* Notes académiques */}
            <div className="section no-break">
                <h2 className="section-title">{text.academicGrades}</h2>
                {userData.personalInfo?.bacType === "marocain" && (
                    <div className="card">
                        <div className="mb-2">
                            <table className="grades-table">
                                <thead>
                                    <tr>
                                        <th>{text.regional}</th>
                                        <th>{text.national}</th>
                                        <th>{text.controleContinu}</th>
                                        <th>{text.moyenneGenerale}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {userData.personalInfo?.noteAvailability === "estimation"
                                                ? userData.personalInfo?.noteGenerale1ereBacEstimation
                                                : userData.personalInfo?.noteGenerale1ereBac}/20
                                        </td>
                                        <td>
                                            {userData.personalInfo?.noteAvailability === "estimation"
                                                ? userData.personalInfo?.noteNationalEstimation
                                                : userData.personalInfo?.noteNational}/20
                                        </td>
                                        <td>
                                            {userData.personalInfo?.noteAvailability === "estimation"
                                                ? userData.personalInfo?.noteControleConinuEstimation
                                                : userData.personalInfo?.noteControleContinu}/20
                                        </td>
                                        <td className="bold">
                                            {userData.personalInfo?.noteAvailability === "estimation"
                                                ? userData.personalInfo?.noteCalculeeMethod1Estimation
                                                : userData.personalInfo?.noteCalculeeMethod1}/20
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {userData.personalInfo?.bacType === "mission" && (
                    <div className="card">
                        <div className="mb-2">
                            <table className="grades-table">
                                <thead>
                                    <tr>
                                        <th>{text.firstYear}</th>
                                        <th>{text.finalYear}</th>
                                        <th>{text.bacAverage}</th>
                                        <th>{userData.personalInfo?.noteAvailability === "estimation" ? text.estimatedAverage : text.generalAverage}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {userData.personalInfo?.noteAvailability === "estimation"
                                                ? `${userData.personalInfo?.noteGeneralePremiereEstimation || "-"}/20`
                                                : `${userData.personalInfo?.noteGeneralePremiere || "-"}/20`}
                                        </td>
                                        <td>
                                            {userData.personalInfo?.noteAvailability === "estimation"
                                                ? `${userData.personalInfo?.noteGeneraleTerminaleEstimation || "-"}/20`
                                                : `${userData.personalInfo?.noteGeneraleTerminale || "-"}/20`}
                                        </td>
                                        <td>
                                            {userData.personalInfo?.noteAvailability === "estimation"
                                                ? `${userData.personalInfo?.noteGeneraleBacEstimation || "-"}/20`
                                                : `${userData.personalInfo?.noteGeneraleBac || "-"}/20`}
                                        </td>
                                        <td className="bold">
                                            {userData.personalInfo?.noteAvailability === "estimation"
                                                ? `${((parseFloat(userData.personalInfo?.noteGeneralePremiereEstimation || "0") +
                                                    parseFloat(userData.personalInfo?.noteGeneraleTerminaleEstimation || "0") +
                                                    parseFloat(userData.personalInfo?.noteGeneraleBacEstimation || "0")) / 3).toFixed(2)}/20`
                                                : userData.personalInfo?.noteMoyenneGenerale
                                                    ? `${userData.personalInfo.noteMoyenneGenerale}/20`
                                                    : ((parseFloat(userData.personalInfo?.noteGeneralePremiere || "0") +
                                                        parseFloat(userData.personalInfo?.noteGeneraleTerminale || "0") +
                                                        parseFloat(userData.personalInfo?.noteGeneraleBac || "0")) / 3).toFixed(2) + "/20"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Méthodes de calcul des seuils */}
            {userData.personalInfo?.bacType === "marocain" && (
                <div className="section no-break">
                    <h2 className="section-title">{text.calculationMethods}</h2>
                    <div className="calculation-methods">
                        <div className="calculation-title">{text.thresholdCalculation}</div>
                        <div className="calculation-row">
                            <div className="calculation-method">{text.calculationMethod1}</div>
                            <div className="calculation-score">
                                {userData.personalInfo?.noteAvailability === "estimation"
                                    ? userData.personalInfo?.noteCalculeeMethod1Estimation
                                    : userData.personalInfo?.noteCalculeeMethod1}/20
                            </div>
                        </div>
                        <div className="calculation-row">
                            <div className="calculation-method">{text.calculationMethod2}</div>
                            <div className="calculation-score">
                                {userData.personalInfo?.noteAvailability === "estimation"
                                    ? userData.personalInfo?.noteCalculeeMethod2Estimation
                                    : userData.personalInfo?.noteCalculeeMethod2}/20
                            </div>
                        </div>
                        <div className="calculation-row">
                            <div className="calculation-method">{text.calculationMethod3}</div>
                            <div className="calculation-score">
                                {userData.personalInfo?.noteAvailability === "estimation"
                                    ? userData.personalInfo?.noteCalculeeMethod3Estimation
                                    : userData.personalInfo?.noteCalculeeMethod3}/20
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Grouper RIASEC et Personnalité ensemble pour éviter la séparation */}
            <div className="section-group">
                {/* RIASEC Profile */}
                <div className="section avoid-break">
                    <h2 className="section-title">
                        <BrainIcon style={{ verticalAlign: 'middle', width: '18px', height: '18px', marginRight: '5px', display: 'inline' }} />
                        {text.riasecProfile}
                    </h2>
                    <div className="card">
                        <div className="grid">
                            {Object.entries(userData.riasecScores?.scores || {}).map(([category, score]: [string, any]) => (
                                <div key={category} className="mb-2">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="bold">
                                            {text[category as keyof typeof text] || category}
                                        </span>
                                        <span>{score}%</span>
                                    </div>
                                    <div className="bar-container">
                                        <div className="bar bar-riasec" style={{ width: `${score}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <span className="text-secondary">{text.profilDominant}: </span>
                            <span className="bold">
                                {userData.riasecScores?.dominantProfile?.map(
                                    (profile: string) => text[profile as keyof typeof text] || profile
                                ).join('-')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="section avoid-break">
                    <h2 className="section-title">
                        <BrainIcon style={{ verticalAlign: 'middle', width: '18px', height: '18px', marginRight: '5px', display: 'inline' }} />
                        {text.personalityProfile}
                    </h2>
                    <div className="card">
                        <div className="grid">
                            {Object.entries(userData.personalityScores?.scores || {}).map(([trait, score]: [string, any]) => {
                                // Rechercher la traduction arabe du trait si nécessaire
                                const traitLabel = language === 'ar'
                                    ? (text[trait as keyof typeof text] ||
                                        (trait === "Ouverture" ? "الانفتاح" :
                                            trait === "Organisation" ? "التنظيم" :
                                                trait === "Sociabilité" ? "الاجتماعية" :
                                                    trait === "Gestion du stress" ? "إدارة التوتر" :
                                                        trait === "Leadership" ? "القيادة" :
                                                            trait === "Autonomie" ? "الاستقلالية" :
                                                                trait === "Persévérance" ? "المثابرة" :
                                                                    trait === "Créativité" ? "الإبداع" :
                                                                        trait === "Adaptabilité" ? "التكيف" : trait))
                                    : trait;

                                return (
                                    <div key={trait} className="mb-2">
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span className="bold">{traitLabel}</span>
                                            <span>{score}%</span>
                                        </div>
                                        <div className="bar-container">
                                            <div className="bar bar-personality" style={{ width: `${score}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <span className="text-secondary">{text.dominantTraits}: </span>
                            <span className="bold">
                                {userData.personalityScores?.dominantTraits?.map((trait: string) => {
                                    return language === 'ar'
                                        ? (trait === "Ouverture" ? "الانفتاح" :
                                            trait === "Organisation" ? "التنظيم" :
                                                trait === "Sociabilité" ? "الاجتماعية" :
                                                    trait === "Gestion du stress" ? "إدارة التوتر" :
                                                        trait === "Leadership" ? "القيادة" :
                                                            trait === "Autonomie" ? "الاستقلالية" :
                                                                trait === "Persévérance" ? "المثابرة" :
                                                                    trait === "Créativité" ? "الإبداع" :
                                                                        trait === "Adaptabilité" ? "التكيف" : trait)
                                        : trait;
                                }).join(', ')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Page Break */}
                <div className="page-break"></div>

                {/* Aptitudes */}

                <div className="section avoid-break">
                    <h2 className="section-title">
                        <BrainIcon style={{ verticalAlign: 'middle', width: '18px', height: '18px', marginRight: '5px', display: 'inline' }} />
                        {text.aptitudeTitle}
                    </h2>
                    <div className="card">
                        <div className="grid">
                            {Object.entries(userData.aptitudeScores?.scores || {}).map(([aptitude, score]: [string, any]) => (
                                <div key={aptitude} className="mb-2">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="bold">
                                            {text[aptitude as keyof typeof text] || aptitude}
                                        </span>
                                        <span>{score}%</span>
                                    </div>
                                    <div className="bar-container">
                                        <div className="bar bar-aptitude" style={{ width: `${score}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <span className="text-secondary">{text.globalScore}: </span>
                            <span className="bold">{userData.aptitudeScores?.overallScore}%</span>
                            <span className="text-secondary"> | {text.level}: </span>
                            <span className="bold">
                                {language === 'ar'
                                    ? userData.aptitudeScores?.performanceLevel === 'excellent' ? 'ممتاز'
                                        : userData.aptitudeScores?.performanceLevel === 'très bon' ? 'جيد جداً'
                                            : userData.aptitudeScores?.performanceLevel === 'bon' ? 'جيد'
                                                : userData.aptitudeScores?.performanceLevel === 'moyen' ? 'متوسط'
                                                    : userData.aptitudeScores?.performanceLevel === 'faible' ? 'ضعيف'
                                                        : userData.aptitudeScores?.performanceLevel
                                    : userData.aptitudeScores?.performanceLevel}
                            </span>
                        </div>
                    </div>
                </div>
            </div>


            {/* Intérêts académiques avec détails des matières et catégories */}
            <div className="section no-break">
                <h2 className="section-title">
                    <BookOpenIcon style={{ verticalAlign: 'middle', width: '18px', height: '18px', marginRight: '5px', display: 'inline' }} />
                    {text.interests}
                </h2>

                {/* Tableau détaillé des matières */}
                <div className="card">
                    <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '10px', color: '#4b5563' }}>
                        {text.detailedSubjects}
                    </h3>

                    <table className="grades-table">
                        <thead>
                            <tr>
                                <th>{text.subject}</th>
                                <th>{text.field}</th>
                                <th>{text.interestLevel}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Vérifier d'abord si nous avons des intérêts académiques structurés selon la nouvelle méthode */}
                            {userData.academicInterests && userData.academicInterests.detailedResponses &&
                                Object.entries(userData.academicInterests.detailedResponses)
                                    .sort(([, a]: [string, any], [, b]: [string, any]) => b.interestLevel - a.interestLevel)
                                    .slice(0, 10)
                                    .map(([fieldName, data]: [string, any], index: number) => (
                                        <tr key={index}>
                                            <td>{fieldName}</td>
                                            <td>{data.category}</td>
                                            <td className="bold">{data.interestLevel}/5</td>
                                        </tr>
                                    ))
                            }

                            {/* Alternative pour les anciennes données où interests n'a pas detailedResponses */}
                            {userData.academicInterests && !userData.academicInterests.detailedResponses &&
                                userData.academicInterests.fieldInterests &&
                                Object.entries(userData.academicInterests.fieldInterests)
                                    .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
                                    .slice(0, 10)
                                    .map(([fieldName, interestLevel]: [string, any], index: number) => {
                                        // Trouver la catégorie pour ce champ
                                        const field = academicFields[language as 'fr' | 'ar'].find(f => f.name === fieldName);
                                        const category = field ? field.category : "-";

                                        return (
                                            <tr key={index}>
                                                <td>{fieldName}</td>
                                                <td>{category}</td>
                                                <td className="bold">{interestLevel}/5</td>
                                            </tr>
                                        );
                                    })
                            }

                            {/* Autre alternative si nous avons un format encore différent */}
                            {userData.academicInterests && !userData.academicInterests.detailedResponses &&
                                !userData.academicInterests.fieldInterests && userData.academicInterests.subjects &&
                                Object.entries(userData.academicInterests.subjects)
                                    .sort(([, data]: [string, any], [, b]: [string, any]) => data.interest - b.interest)
                                    .slice(0, 10)
                                    .map(([fieldName, data]: [string, any], index: number) => {
                                        // Essayer de récupérer la catégorie, soit directement des données, soit du dictionnaire
                                        const category = data.category || getLocalizedFieldName(fieldName);

                                        return (
                                            <tr key={index}>
                                                <td>{fieldName}</td>
                                                <td>{category}</td>
                                                <td className="bold">{data.interest}/5</td>
                                            </tr>
                                        );
                                    })
                            }

                            {/* Si nous n'avons vraiment aucune donnée à afficher */}
                            {(!userData.academicInterests ||
                                (!userData.academicInterests.detailedResponses &&
                                    !userData.academicInterests.fieldInterests &&
                                    !userData.academicInterests.subjects)) && (
                                    <tr>
                                        <td colSpan={3} style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                                            {language === 'ar'
                                                ? 'لا توجد بيانات متاحة عن المواد المفضلة'
                                                : 'Aucune donnée disponible sur les matières préférées'}
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>

                {/* Matières principales par intérêt */}
                {userData.academicInterests && userData.academicInterests.topInterests &&
                    userData.academicInterests.topInterests.length > 0 && (
                        <div className="card mt-2">
                            <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '10px', color: '#4b5563' }}>
                                {language === 'ar' ? 'المواد الأكثر اهتماماً' : 'Matières préférées'}
                            </h3>
                            <div className="grid">
                                {userData.academicInterests.topInterests.slice(0, 5).map((interest: any, index: number) => {
                                    // Trouver la catégorie pour cette matière
                                    const field = academicFields[language as 'fr' | 'ar'].find(f => f.name === interest.field);
                                    const category = field ? field.category : "-";

                                    return (
                                        <div key={index} className="mb-2">
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div>
                                                    <span className="bold">{interest.field}</span>
                                                    <span className="text-sm text-secondary ml-2">({category})</span>
                                                </div>
                                                <span>{interest.score}/5</span>
                                            </div>
                                            <div className="bar-container">
                                                <div className="bar bar-interest" style={{ width: `${(interest.score / 5) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
            </div>
            {/* Compatibilité professionnelle */}
            <div className="section no-break">
                <h2 className="section-title">
                    <TrendingUpIcon style={{ verticalAlign: 'middle', width: '18px', height: '18px', marginRight: '5px', display: 'inline' }} />
                    {text.careers}
                </h2>
                <div className="card">
                    <div className="grid">
                        {Object.entries(userData.careerCompatibility?.sectorScores || {})
                            .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
                            .map(([sector, score]: [string, any]) => (
                                <div key={sector} className="mb-2">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="bold">{sector}</span>
                                        <span>{score}%</span>
                                    </div>
                                    <div className="bar-container">
                                        <div className="bar bar-career" style={{ width: `${score}%` }}></div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* Page Break */}
            <div className="page-break"></div>



            {/* Modifiez la section "Contraintes et priorités" */}
            <div className="section no-break">
                <h2 className="section-title">
                    <MapPinIcon style={{ verticalAlign: 'middle', width: '18px', height: '18px', marginRight: '5px', display: 'inline' }} />
                    {text.constraints}
                </h2>
                <div className="grid">
                    {/* Mobilité */}
                    <div className="card">
                        <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '10px', color: '#ef4444' }}>{text.mobilityTitle}</h3>
                        <div className="mb-2">
                            <span className="text-secondary">{text.changeCity}: </span>
                            <span className="bold">{translations[language as 'fr' | 'ar'][userData.constraints?.mobility?.city as keyof typeof translations.fr] || userData.constraints?.mobility?.city || '-'}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-secondary">{text.studyAbroad}: </span>
                            <span className="bold">{translations[language as 'fr' | 'ar'][userData.constraints?.mobility?.country as keyof typeof translations.fr] || userData.constraints?.mobility?.country || '-'}</span>
                        </div>
                        <div>
                            <span className="text-secondary">{text.internationalCareer}: </span>
                            <span className="bold">{translations[language as 'fr' | 'ar'][userData.constraints?.mobility?.international as keyof typeof translations.fr] || userData.constraints?.mobility?.international || '-'}</span>
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="card">
                        <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '10px', color: '#10b981' }}>{text.financialConstraints}</h3>
                        <div className="mb-2">
                            <span className="text-secondary">{text.availableBudget}: </span>
                            <span className="bold">{translations[language as 'fr' | 'ar'][userData.constraints?.budget?.annualBudget as keyof typeof translations.fr] || userData.constraints?.budget?.annualBudget || '-'}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-secondary">{text.scholarshipEligible}: </span>
                            <span className="bold">{translations[language as 'fr' | 'ar'][userData.constraints?.budget?.scholarshipEligible as keyof typeof translations.fr] || userData.constraints?.budget?.scholarshipEligible || '-'}</span>
                        </div>
                        <div>
                            <span className="text-secondary">{text.familySupport}: </span>
                            <span className="bold">{translations[language as 'fr' | 'ar'][userData.constraints?.budget?.familySupport as keyof typeof translations.fr] || userData.constraints?.budget?.familySupport || '-'}</span>
                        </div>
                    </div>

                    {/* Éducation */}
                    <div className="card">
                        <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '10px', color: '#8b5cf6' }}>{text.educationPreferences}</h3>
                        <div className="mb-2">
                            <span className="text-secondary">{text.maxLevel}: </span>
                            <span className="bold">{translations[language as 'fr' | 'ar'][userData.constraints?.education?.maxLevel as keyof typeof translations.fr] || userData.constraints?.education?.maxLevel || '-'}</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-secondary">{text.preferredDuration}: </span>
                            <span className="bold">{translations[language as 'fr' | 'ar'][userData.constraints?.education?.preferredDuration as keyof typeof translations.fr] || userData.constraints?.education?.preferredDuration || '-'}</span>
                        </div>
                        <div>
                            <span className="text-secondary">{text.studyMode}: </span>
                            <span className="bold">{translations[language as 'fr' | 'ar'][userData.constraints?.education?.studyMode as keyof typeof translations.fr] || userData.constraints?.education?.studyMode || '-'}</span>
                        </div>
                    </div>

                    {/* Priorités */}
                    <div className="card">
                        <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '10px', color: '#f59e0b' }}>{text.careerPriorities}</h3>
                        {userData.constraints?.priorities && Object.entries(userData.constraints.priorities).map(([key, value]: [string, any]) => {
                            let label = text[key as keyof typeof text] || '';
                            if (!label) {
                                if (key === 'salary') label = text.salary;
                                if (key === 'stability') label = text.stability;
                                if (key === 'passion') label = text.passion;
                                if (key === 'prestige') label = text.prestige;
                                if (key === 'workLife') label = text.workLife;
                            }

                            return (
                                <div key={key} className="mb-2">
                                    <span className="text-secondary">{label}: </span>
                                    <span className="bold">{value}/5</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>


            {/* Modifiez la section "Compétences linguistiques" */}
            <div className="section no-break">
                <h2 className="section-title">
                    <LanguagesIcon style={{ verticalAlign: 'middle', width: '18px', height: '18px', marginRight: '5px', display: 'inline' }} />
                    {text.languages}
                </h2>
                <div className="grid">
                    {(userData.languageSkills?.selectedLanguages || []).map((langKey: string) => {
                        const skills = userData.languageSkills?.languageSkills?.[langKey] || {};
                        const overallScore = userData.languageSkills?.overallScores?.[langKey];
                        const langInfo = languages[language as 'fr' | 'ar'].find(l => l.code === langKey);
                        const langLabel = langInfo ? langInfo.name : langKey;

                        return (
                            <div key={langKey} className="card">
                                <h3 style={{ fontSize: '12pt', fontWeight: 'bold', marginBottom: '10px', color: '#6366f1' }}>
                                    {langLabel}
                                    {overallScore && <span style={{ fontSize: '10pt', marginLeft: '10px' }}>{text.score}: {overallScore}</span>}
                                </h3>
                                <div className="grid mb-2">
                                    <div>
                                        <span className="text-secondary">{text.speaking}: </span>
                                        <span className="bold">{skills.speaking || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-secondary">{text.writing}: </span>
                                        <span className="bold">{skills.writing || '-'}</span>
                                    </div>
                                </div>
                                <div className="grid">
                                    <div>
                                        <span className="text-secondary">{text.listening}: </span>
                                        <span className="bold">{skills.listening || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="text-secondary">{text.reading}: </span>
                                        <span className="bold">{skills.reading || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>


            {/* Section de signatures et cachets */}
            <div className="signature-section">
                <div className="signature-box">
                    <div className="signature-line"></div>
                    <div className="signature-title">{text.directorSignature}</div>
                    <div className="signature-name">M. Ouallaf Aymen</div>
                    <div className="signature-role">Directeur de E-TAWJIHI.ma</div>
                    <div className="stamp-placeholder">Cachet officiel</div>
                </div>

                <div className="signature-box">
                    <div className="signature-line"></div>
                    <div className="signature-title">{text.counselorSignature}</div>
                    <div className="signature-name">Mme Fatima Zahra Sekhsokh</div>
                    <div className="signature-role">Responsable d'orientation</div>
                    <div className="stamp-placeholder">Cachet officiel</div>
                </div>
            </div>

            {/* Section QR code */}
            <div className="qr-section">
                <div className="qr-title">{text.shareTest}</div>
                <div className="qr-container">
                    {/* Placeholder pour le QR code - une image carrée grise */}
                    <div style={{
                        width: '100px',
                        height: '100px',
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9pt',
                        color: '#6b7280'
                    }}>
                        QR Code
                    </div>
                </div>
                <div className="qr-description">
                    {language === 'ar'
                        ? 'امسح رمز الاستجابة السريعة لمشاركة اختبار التوجيه أو للوصول إلى نسخة رقمية من هذا التقرير'
                        : 'Scannez ce QR code pour partager le test d\'orientation ou accéder à une version numérique de ce rapport'}
                </div>
            </div>

            {/* Footer */}
            <div className="footer">
                <div>{text.orientationReport} - {userData.personalInfo?.firstName} {userData.personalInfo?.lastName} - {formatDate()}</div>
            </div>
        </div >
    );
};



export default PrintableReport;