export interface QuestionResponse {
    questionId: string;
    questionText: string;
    userAnswer: any; // Peut être number, string, boolean selon le type de question
    correctAnswer?: any; // Pour les tests d'aptitude
    isCorrect?: boolean; // Pour les tests d'aptitude
    responseTime?: number; // Temps de réponse en ms
    timestamp: Date;
}

export interface TestSession {
    testType: string;
    startedAt: Date;
    completedAt: Date;
    duration: number; // en ms
    questions: QuestionResponse[];
    totalQuestions: number;
    language: 'fr' | 'ar';
}

export interface PersonalInfo {
    firstName: string;
    lastName: string;
    age: string;
    city: string;
    bacType: 'sciences' | 'lettres' | 'economie' | 'technique' | string;
    bacYear: string;
    mathGrade: string;
    scienceGrade: string;
    frenchGrade: string;
    phoneNumber?: string;
    email?: string;
    // Ajouter la session pour capturer les réponses du formulaire
    session?: TestSession;
}

export interface RiasecScores {
    scores: {
        Realiste: number;
        Investigateur: number;
        Artistique: number;
        Social: number;
        Entreprenant: number;
        Conventionnel: number;
    };
    rawAnswers: Record<string, number>;
    dominantProfile: string[];
    // Nouvelle propriété pour les sessions détaillées
    sessions: TestSession[]; // Une session par catégorie RIASEC
    detailedResponses: Record<string, QuestionResponse[]>; // Réponses par catégorie
}

export interface PersonalityScores {
    scores: {
        Ouverture: number;
        Organisation: number;
        Sociabilité: number;
        'Gestion du stress': number;
        Leadership: number;
    };
    learningStyle: 'visual' | 'auditif' | 'kinesthesique' | 'lecture';
    rawAnswers: Record<string, number>;
    dominantTraits: string[];
    // Sessions détaillées
    session: TestSession;
    detailedResponses: QuestionResponse[];
}

export interface AptitudeScores {
    scores: {
        logique: number;
        verbal: number;
        spatial: number;
    };
    rawAnswers: Record<string, number>;
    detailedScores: Record<string, {
        correct: number;
        total: number;
        percentage: number;
    }>;
    overallScore: number;
    totalCorrect: number;
    totalQuestions: number;
    performanceLevel: 'faible' | 'acceptable' | 'moyen' | 'bon' | 'excellent';
    strongestAptitudes: string[];
    weakestAptitudes: string[];
    testDurations: Record<string, number>;
    completedAt: Date;
    // Sessions détaillées par test d'aptitude
    sessions: TestSession[]; // Une session par test (logique, verbal, spatial)
    detailedResponses: Record<string, QuestionResponse[]>; // Réponses par test
}

export interface AcademicInterests {
    fieldInterests: Record<string, number>;
    fieldMotivations: Record<string, number>;
    effortSupported: string[];
    categoryScores: Record<string, {
        interest: number;
        motivation: number;
    }>;
    topInterests: string[];
    topMotivations: string[];
    // Session détaillée
    session: TestSession;
    detailedResponses: Array<{
        field: string;
        category: string;
        interestLevel: number;
        motivationLevel: number;
        effortAcceptable: boolean;
        timestamp: Date;
    }>;
}

export interface CareerCompatibility {
    careerAttractions: Record<string, number>;
    careerAccessibility: Record<string, boolean>;
    workPreferences: {
        workStyle: 'independent' | 'public' | 'private' | 'ngo';
        priority: 'stability' | 'salary' | 'passion' | 'prestige';
        sector: 'public' | 'private' | 'mixed';
    };
    sectorScores: Record<string, number>;
    topCareers: string[];
    careersByCompatibility: Array<{
        name: string;
        attraction: number;
        accessible: boolean;
        sector: string;
    }>;
    // Session détaillée
    session: TestSession;
    detailedResponses: Array<{
        career: string;
        sector: string;
        attractionLevel: number;
        accessible: boolean;
        timestamp: Date;
    }>;
}

export interface Constraints {
    mobility: {
        city: 'no' | 'region' | 'country';
        country: 'no' | 'france' | 'europe' | 'anywhere';
        international: 'no' | 'maybe' | 'yes';
    };
    budget: {
        annualBudget: 'low' | 'medium' | 'high' | 'vhigh';
        scholarshipEligible: 'yes' | 'no' | 'unsure';
        familySupport: 'full' | 'partial' | 'moral' | 'none';
    };
    education: {
        maxLevel: 'bac+2' | 'bac+3' | 'bac+5' | 'bac+8';
        preferredDuration: 'short' | 'medium' | 'long';
        studyMode: 'fulltime' | 'parttime' | 'alternance' | 'distance';
    };
    priorities: {
        salary: number;
        stability: number;
        passion: number;
        prestige: number;
        workLife: number;
    };
    priorityScores: Record<string, number>;
    // Session détaillée
    session: TestSession;
    detailedResponses: Array<{
        category: 'mobility' | 'budget' | 'education' | 'priorities';
        question: string;
        answer: any;
        timestamp: Date;
    }>;
}

export interface Certificate {
    hasCertificate: boolean;
    certificateName: string;
    score: string;
    total: string;
}

export interface LanguageSkills {
    selectedLanguages: string[];
    languageSkills: Record<string, {
        speaking: string;
        writing: string;
        reading: string;
        listening: string;
    }>;
    certificates: Record<string, Certificate>;
    preferences: {
        preferredTeachingLanguage: 'ar' | 'fr' | 'en' | 'mixed';
        comfortableStudyingIn: string[];
        willingToImprove: string[];
    };
    overallScores: Record<string, number>;
    strongestLanguages: string[];
    // Session détaillée
    session: TestSession;
    detailedResponses: Array<{
        language: string;
        skillType: 'speaking' | 'writing' | 'reading' | 'listening';
        level: string;
        hasCertificate: boolean;
        certificateDetails?: Certificate;
        timestamp: Date;
    }>;
}