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
}

export interface AptitudeScores {
    scores: {
        logique: number;
        verbal: number;
        spatial: number;
    };
    rawAnswers: Record<string, number>;
    strongestAptitudes: string[];
    testDurations: Record<string, number>; // Temps passé sur chaque test
}

export interface AcademicInterests {
    fieldInterests: Record<string, number>; // Nom du domaine -> Score intérêt (1-5)
    fieldMotivations: Record<string, number>; // Nom du domaine -> Score motivation (1-5)
    effortSupported: string[]; // Domaines acceptables par effort
    categoryScores: Record<string, {
        interest: number;
        motivation: number;
    }>; // Scores par catégorie (Sciences, Santé, etc.)
    topInterests: string[];
    topMotivations: string[];
}

export interface CareerCompatibility {
    careerAttractions: Record<string, number>; // Nom métier -> Score attraction (1-5)
    careerAccessibility: Record<string, boolean>; // Nom métier -> Accessible ou non
    workPreferences: {
        workStyle: 'independent' | 'public' | 'private' | 'ngo';
        priority: 'stability' | 'salary' | 'passion' | 'prestige';
        sector: 'public' | 'private' | 'mixed';
    };
    sectorScores: Record<string, number>; // Score d'attraction par secteur
    topCareers: string[]; // Métiers les plus compatibles (attraction >= 4 + accessible)
    careersByCompatibility: Array<{
        name: string;
        attraction: number;
        accessible: boolean;
        sector: string;
    }>;
}

export interface Constraints {
    mobility: {
        city: 'no' | 'region' | 'country'; // Mobilité géographique
        country: 'no' | 'france' | 'europe' | 'anywhere'; // Études à l'étranger
        international: 'no' | 'maybe' | 'yes'; // Carrière internationale
    };
    budget: {
        annualBudget: 'low' | 'medium' | 'high' | 'vhigh'; // Budget annuel
        scholarshipEligible: 'yes' | 'no' | 'unsure'; // Éligibilité aux bourses
        familySupport: 'full' | 'partial' | 'moral' | 'none'; // Soutien familial
    };
    education: {
        maxLevel: 'bac+2' | 'bac+3' | 'bac+5' | 'bac+8'; // Niveau maximum souhaité
        preferredDuration: 'short' | 'medium' | 'long'; // Durée préférée
        studyMode: 'fulltime' | 'parttime' | 'alternance' | 'distance'; // Mode d'études
    };
    priorities: {
        salary: number;
        stability: number;
        passion: number;
        prestige: number;
        workLife: number;
    };
    priorityScores: Record<string, number>; // Scores normalisés (0-100)
}

export interface Certificate {
    hasCertificate: boolean;
    certificateName: string;
    score: string;
    total: string;
}

export interface LanguageSkills {
    selectedLanguages: string[]; // Codes des langues (ar, fr, en, etc.)
    languageSkills: Record<string, {
        speaking: string; // Niveau CECR (A1, A2, B1, B2, C1, C2)
        writing: string;
        reading: string;
        listening: string;
    }>;
    certificates: Record<string, Certificate>; // Certificats par langue
    preferences: {
        preferredTeachingLanguage: 'ar' | 'fr' | 'en' | 'mixed';
        comfortableStudyingIn: string[]; // Langues pour étudier confortablement
        willingToImprove: string[]; // Langues à améliorer
    };
    overallScores: Record<string, number>; // Score global par langue (0-100)
    strongestLanguages: string[];
}

// Interface principale User
export interface User {
    // Informations de base
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;

    // Données des tests
    personalInfo: PersonalInfo;
    riasecScores: RiasecScores;
    personalityScores: PersonalityScores;
    aptitudeScores: AptitudeScores;
    academicInterests: AcademicInterests;
    careerCompatibility: CareerCompatibility;
    constraints: Constraints;
    languageSkills: LanguageSkills;

    // Métadonnées du test
    testMetadata: {
        selectedLanguage: 'fr' | 'ar'; // Langue choisie pour passer le test
        startedAt: Date;
        completedAt?: Date;
        totalDuration?: number; // Durée totale en secondes
        stepDurations: Record<string, number>; // Durée par étape
        version: string; // Version du test
    };

    // Scores et analyses générés
    analysis: {
        dominantRiasecProfile: string; // Ex: "Investigateur-Réaliste"
        personalityType: string; // Type de personnalité dominant
        learningProfile: string; // Profil d'apprentissage recommandé
        academicCompatibility: Record<string, number>; // Score de compatibilité par domaine
        careerCompatibility: Record<string, number>; // Score de compatibilité par métier
        recommendedPath: 'academic' | 'professional' | 'entrepreneurial'; // Voie recommandée
        confidenceLevel: number; // Niveau de confiance des recommandations (0-100)

        // Recommandations détaillées
        recommendations: {
            domains: Array<{
                name: string;
                compatibility: number;
                justification: string;
                requirements: string[];
            }>;
            careers: Array<{
                name: string;
                compatibility: number;
                accessibility: 'easy' | 'medium' | 'difficult' | 'very_difficult';
                sector: string;
                description: string;
                requiredSkills: string[];
            }>;
            institutions: Array<{
                name: string;
                type: 'public' | 'semi-public' | 'private';
                location: string;
                cost: string;
                programs: string[];
                contact: string;
                requirements: string[];
            }>;
            developmentPlan: {
                shortTerm: string[]; // Actions à court terme (1-2 ans)
                mediumTerm: string[]; // Actions à moyen terme (3-5 ans)
                longTerm: string[]; // Objectifs à long terme (5+ ans)
            };
        };
    };
}

// Types d'aide pour l'utilisation
export type UserTestData = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'analysis'>;

export interface UserSummary {
    id: string;
    name: string;
    dominantProfile: string;
    completedAt: Date;
    confidenceLevel: number;
    topRecommendation: string;
}