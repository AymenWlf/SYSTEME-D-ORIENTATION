import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';// Ajouter ces imports en haut du fichier
import { Loader2Icon, CheckIcon } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { getAuthToken } from '../utils/auth';

interface CareerCompatibilityTestProps {
  onComplete: (data: any) => void;
  onPrevious: () => void;
  canGoBack: boolean;
  language: string;
  sessionData?: any; // Ajouter cette ligne
}

interface CareerResponse {
  careerId: string;
  careerName: string;
  sector: string;
  difficultyLevel: string;
  attractionLevel: number | null;
  accessibilityPerceived: boolean | null;
  attractionResponseTime: number | null;
  accessibilityResponseTime: number | null;
  timestamp: Date;
  careerIndex: number;
}

interface PreferenceResponse {
  preferenceType: 'workStyle' | 'priority' | 'sector';
  selectedValue: string;
  responseTime: number;
  timestamp: Date;
}

// Modification de la liste des métiers pour limiter à 7 par secteur

const careers = {
  fr: [
    // Santé (limité à 7)
    { name: 'Médecin généraliste', sector: 'Santé', accessibility: 'Difficile' },
    { name: 'Médecin spécialiste', sector: 'Santé', accessibility: 'Très difficile' },
    { name: 'Chirurgien', sector: 'Santé', accessibility: 'Très difficile' },
    { name: 'Pharmacien', sector: 'Santé', accessibility: 'Difficile' },
    { name: 'Infirmier', sector: 'Santé', accessibility: 'Moyenne' },
    { name: 'Kinésithérapeute', sector: 'Santé', accessibility: 'Moyenne' },
    { name: 'Psychologue clinicien', sector: 'Santé', accessibility: 'Moyenne' },

    // Technologie (limité à 7)
    { name: 'Ingénieur informatique', sector: 'Technologie', accessibility: 'Moyenne' },
    { name: 'Ingénieur civil', sector: 'Technologie', accessibility: 'Moyenne' },
    { name: 'Ingénieur électrique', sector: 'Technologie', accessibility: 'Moyenne' },
    { name: 'Architecte', sector: 'Technologie', accessibility: 'Moyenne' },
    { name: 'Développeur web', sector: 'Technologie', accessibility: 'Facile' },
    { name: 'Data scientist', sector: 'Technologie', accessibility: 'Moyenne' },
    { name: 'Expert en cybersécurité', sector: 'Technologie', accessibility: 'Moyenne' },

    // Éducation (limité à 7)
    { name: 'Enseignant primaire', sector: 'Éducation', accessibility: 'Moyenne' },
    { name: 'Enseignant secondaire', sector: 'Éducation', accessibility: 'Moyenne' },
    { name: 'Professeur universitaire', sector: 'Éducation', accessibility: 'Difficile' },
    { name: 'Professeur de langues', sector: 'Éducation', accessibility: 'Moyenne' },
    { name: 'Conseiller d\'orientation', sector: 'Éducation', accessibility: 'Moyenne' },
    { name: 'Directeur d\'école', sector: 'Éducation', accessibility: 'Difficile' },
    { name: 'Éducateur spécialisé', sector: 'Éducation', accessibility: 'Moyenne' },

    // Finance (limité à 7)
    { name: 'Expert-comptable', sector: 'Finance', accessibility: 'Moyenne' },
    { name: 'Contrôleur de gestion', sector: 'Finance', accessibility: 'Moyenne' },
    { name: 'Analyste financier', sector: 'Finance', accessibility: 'Moyenne' },
    { name: 'Banquier d\'affaires', sector: 'Finance', accessibility: 'Difficile' },
    { name: 'Conseiller financier', sector: 'Finance', accessibility: 'Moyenne' },
    { name: 'Auditeur', sector: 'Finance', accessibility: 'Moyenne' },
    { name: 'Gestionnaire de patrimoine', sector: 'Finance', accessibility: 'Moyenne' },

    // Juridique (limité à 7)
    { name: 'Avocat pénaliste', sector: 'Juridique', accessibility: 'Difficile' },
    { name: 'Avocat d\'affaires', sector: 'Juridique', accessibility: 'Difficile' },
    { name: 'Notaire', sector: 'Juridique', accessibility: 'Difficile' },
    { name: 'Juriste d\'entreprise', sector: 'Juridique', accessibility: 'Moyenne' },
    { name: 'Magistrat', sector: 'Juridique', accessibility: 'Très difficile' },
    { name: 'Médiateur', sector: 'Juridique', accessibility: 'Moyenne' },
    { name: 'Juriste en propriété intellectuelle', sector: 'Juridique', accessibility: 'Moyenne' },

    // Arts et Créatif (limité à 7)
    { name: 'Designer graphique', sector: 'Arts et Créatif', accessibility: 'Moyenne' },
    { name: 'Photographe', sector: 'Arts et Créatif', accessibility: 'Variable' },
    { name: 'Designer produit', sector: 'Arts et Créatif', accessibility: 'Moyenne' },
    { name: 'Styliste', sector: 'Arts et Créatif', accessibility: 'Variable' },
    { name: 'Décorateur d\'intérieur', sector: 'Arts et Créatif', accessibility: 'Moyenne' },
    { name: 'Musicien', sector: 'Arts et Créatif', accessibility: 'Variable' },
    { name: 'Réalisateur', sector: 'Arts et Créatif', accessibility: 'Difficile' },

    // Communication et Médias (limité à 7)
    { name: 'Journaliste', sector: 'Communication et Médias', accessibility: 'Difficile' },
    { name: 'Rédacteur web', sector: 'Communication et Médias', accessibility: 'Moyenne' },
    { name: 'Community manager', sector: 'Communication et Médias', accessibility: 'Moyenne' },
    { name: 'Responsable communication', sector: 'Communication et Médias', accessibility: 'Moyenne' },
    { name: 'Présentateur TV/Radio', sector: 'Communication et Médias', accessibility: 'Difficile' },
    { name: 'Producteur audiovisuel', sector: 'Communication et Médias', accessibility: 'Difficile' },
    { name: 'Relations publiques', sector: 'Communication et Médias', accessibility: 'Moyenne' },

    // Commerce et Vente (limité à 7)
    { name: 'Commercial B2B', sector: 'Commerce et Vente', accessibility: 'Moyenne' },
    { name: 'Responsable commercial', sector: 'Commerce et Vente', accessibility: 'Moyenne' },
    { name: 'Business developer', sector: 'Commerce et Vente', accessibility: 'Moyenne' },
    { name: 'Responsable export', sector: 'Commerce et Vente', accessibility: 'Moyenne' },
    { name: 'Négociateur immobilier', sector: 'Commerce et Vente', accessibility: 'Moyenne' },
    { name: 'E-commerce manager', sector: 'Commerce et Vente', accessibility: 'Moyenne' },
    { name: 'Acheteur', sector: 'Commerce et Vente', accessibility: 'Moyenne' },

    // Marketing (limité à 7)
    { name: 'Responsable marketing', sector: 'Marketing', accessibility: 'Moyenne' },
    { name: 'Digital marketer', sector: 'Marketing', accessibility: 'Moyenne' },
    { name: 'SEO/SEM specialist', sector: 'Marketing', accessibility: 'Moyenne' },
    { name: 'Brand manager', sector: 'Marketing', accessibility: 'Moyenne' },
    { name: 'Product marketing manager', sector: 'Marketing', accessibility: 'Moyenne' },
    { name: 'Growth hacker', sector: 'Marketing', accessibility: 'Moyenne' },
    { name: 'Analyste marketing', sector: 'Marketing', accessibility: 'Moyenne' },

    // Ressources Humaines (limité à 7)
    { name: 'Responsable RH', sector: 'Ressources Humaines', accessibility: 'Moyenne' },
    { name: 'Recruteur', sector: 'Ressources Humaines', accessibility: 'Moyenne' },
    { name: 'Consultant RH', sector: 'Ressources Humaines', accessibility: 'Moyenne' },
    { name: 'Responsable formation', sector: 'Ressources Humaines', accessibility: 'Moyenne' },
    { name: 'Compensation & benefits', sector: 'Ressources Humaines', accessibility: 'Moyenne' },
    { name: 'HRBP (Business partner)', sector: 'Ressources Humaines', accessibility: 'Moyenne' },
    { name: 'Chief happiness officer', sector: 'Ressources Humaines', accessibility: 'Moyenne' },

    // Transport et Logistique (limité à 7)
    { name: 'Pilote de ligne', sector: 'Transport et Logistique', accessibility: 'Difficile' },
    { name: 'Contrôleur aérien', sector: 'Transport et Logistique', accessibility: 'Très difficile' },
    { name: 'Capitaine de navire', sector: 'Transport et Logistique', accessibility: 'Difficile' },
    { name: 'Conducteur de train', sector: 'Transport et Logistique', accessibility: 'Moyenne' },
    { name: 'Logisticien', sector: 'Transport et Logistique', accessibility: 'Moyenne' },
    { name: 'Supply chain manager', sector: 'Transport et Logistique', accessibility: 'Moyenne' },
    { name: 'Responsable entrepôt', sector: 'Transport et Logistique', accessibility: 'Moyenne' },

    // Hôtellerie et Restauration (limité à 7)
    { name: 'Chef cuisinier', sector: 'Hôtellerie et Restauration', accessibility: 'Moyenne' },
    { name: 'Directeur d\'hôtel', sector: 'Hôtellerie et Restauration', accessibility: 'Moyenne' },
    { name: 'Réceptionniste', sector: 'Hôtellerie et Restauration', accessibility: 'Facile' },
    { name: 'Concierge', sector: 'Hôtellerie et Restauration', accessibility: 'Moyenne' },
    { name: 'Maître d\'hôtel', sector: 'Hôtellerie et Restauration', accessibility: 'Moyenne' },
    { name: 'Guide touristique', sector: 'Hôtellerie et Restauration', accessibility: 'Moyenne' },
    { name: 'Wedding planner', sector: 'Hôtellerie et Restauration', accessibility: 'Moyenne' },

    // Services Publics et Administration (limité à 7)
    { name: 'Diplomate', sector: 'Services Publics', accessibility: 'Très difficile' },
    { name: 'Administrateur civil', sector: 'Services Publics', accessibility: 'Difficile' },
    { name: 'Contrôleur des impôts', sector: 'Services Publics', accessibility: 'Moyenne' },
    { name: 'Douanier', sector: 'Services Publics', accessibility: 'Moyenne' },
    { name: 'Policier', sector: 'Services Publics', accessibility: 'Moyenne' },
    { name: 'Gendarme', sector: 'Services Publics', accessibility: 'Moyenne' },
    { name: 'Pompier', sector: 'Services Publics', accessibility: 'Moyenne' },

    // Entrepreneuriat et Conseil (limité à 7)
    { name: 'Chef d\'entreprise', sector: 'Entrepreneuriat', accessibility: 'Variable' },
    { name: 'Consultant en stratégie', sector: 'Conseil', accessibility: 'Difficile' },
    { name: 'Consultant IT', sector: 'Conseil', accessibility: 'Moyenne' },
    { name: 'Chef de projet', sector: 'Management', accessibility: 'Moyenne' },
    { name: 'Entrepreneur tech', sector: 'Entrepreneuriat', accessibility: 'Variable' },
    { name: 'Consultant freelance', sector: 'Conseil', accessibility: 'Variable' },
    { name: 'Business analyst', sector: 'Conseil', accessibility: 'Moyenne' },

    // Recherche et Sciences (limité à 7)
    { name: 'Chercheur scientifique', sector: 'Recherche', accessibility: 'Difficile' },
    { name: 'Ingénieur R&D', sector: 'Recherche', accessibility: 'Moyenne' },
    { name: 'Laboratoire privé', sector: 'Recherche', accessibility: 'Moyenne' },
    { name: 'Statisticien', sector: 'Recherche', accessibility: 'Moyenne' },
    { name: 'Économiste', sector: 'Recherche', accessibility: 'Moyenne' },
    { name: 'Biologiste', sector: 'Recherche', accessibility: 'Moyenne' },
    { name: 'Physicien', sector: 'Recherche', accessibility: 'Difficile' },

    // Langues et International (limité à 7)
    { name: 'Traducteur', sector: 'Langues', accessibility: 'Moyenne' },
    { name: 'Interprète', sector: 'Langues', accessibility: 'Moyenne' },
    { name: 'Professeur de langues', sector: 'Langues', accessibility: 'Moyenne' },
    { name: 'Attaché culturel', sector: 'International', accessibility: 'Difficile' },
    { name: 'Chargé de mission international', sector: 'International', accessibility: 'Moyenne' },
    { name: 'Directeur import-export', sector: 'International', accessibility: 'Difficile' },
    { name: 'Consultant en relations internationales', sector: 'International', accessibility: 'Difficile' },

    // Social et Humanitaire (limité à 7)
    { name: 'Travailleur social', sector: 'Social', accessibility: 'Moyenne' },
    { name: 'Psychologue', sector: 'Social', accessibility: 'Moyenne' },
    { name: 'Coordinateur ONG', sector: 'Humanitaire', accessibility: 'Moyenne' },
    { name: 'Responsable RSE', sector: 'Social', accessibility: 'Moyenne' },
    { name: 'Éducateur spécialisé', sector: 'Social', accessibility: 'Moyenne' },
    { name: 'Médecin humanitaire', sector: 'Humanitaire', accessibility: 'Difficile' },
    { name: 'Coordinateur de projets sociaux', sector: 'Social', accessibility: 'Moyenne' },

    // Agriculture et Environnement (limité à 7)
    { name: 'Ingénieur agronome', sector: 'Agriculture', accessibility: 'Moyenne' },
    { name: 'Vétérinaire rural', sector: 'Agriculture', accessibility: 'Difficile' },
    { name: 'Consultant environnement', sector: 'Environnement', accessibility: 'Moyenne' },
    { name: 'Responsable développement durable', sector: 'Environnement', accessibility: 'Moyenne' },
    { name: 'Écotoxicologue', sector: 'Environnement', accessibility: 'Difficile' },
    { name: 'Agriculteur', sector: 'Agriculture', accessibility: 'Variable' },
    { name: 'Paysagiste', sector: 'Environnement', accessibility: 'Moyenne' }
  ],
  ar: [
    // الصحة (7 مهن)
    { name: 'طبيب عام', sector: 'الصحة', accessibility: 'صعب' },
    { name: 'طبيب مختص', sector: 'الصحة', accessibility: 'صعب جداً' },
    { name: 'جراح', sector: 'الصحة', accessibility: 'صعب جداً' },
    { name: 'صيدلي', sector: 'الصحة', accessibility: 'صعب' },
    { name: 'ممرض', sector: 'الصحة', accessibility: 'متوسط' },
    { name: 'أخصائي علاج طبيعي', sector: 'الصحة', accessibility: 'متوسط' },
    { name: 'طبيب نفسي إكلينيكي', sector: 'الصحة', accessibility: 'متوسط' },

    // التكنولوجيا (7 مهن)
    { name: 'مهندس معلوماتية', sector: 'التكنولوجيا', accessibility: 'متوسط' },
    { name: 'مهندس مدني', sector: 'التكنولوجيا', accessibility: 'متوسط' },
    { name: 'مهندس كهربائي', sector: 'التكنولوجيا', accessibility: 'متوسط' },
    { name: 'مهندس معماري', sector: 'التكنولوجيا', accessibility: 'متوسط' },
    { name: 'مطور مواقع', sector: 'التكنولوجيا', accessibility: 'سهل' },
    { name: 'عالم بيانات', sector: 'التكنولوجيا', accessibility: 'متوسط' },
    { name: 'خبير أمن سيبراني', sector: 'التكنولوجيا', accessibility: 'متوسط' },

    // التعليم (7 مهن)
    { name: 'معلم ابتدائي', sector: 'التعليم', accessibility: 'متوسط' },
    { name: 'معلم ثانوي', sector: 'التعليم', accessibility: 'متوسط' },
    { name: 'أستاذ جامعي', sector: 'التعليم', accessibility: 'صعب' },
    { name: 'أستاذ لغات', sector: 'التعليم', accessibility: 'متوسط' },
    { name: 'مستشار توجيه', sector: 'التعليم', accessibility: 'متوسط' },
    { name: 'مدير مدرسة', sector: 'التعليم', accessibility: 'صعب' },
    { name: 'مربي متخصص', sector: 'التعليم', accessibility: 'متوسط' },

    // المالية (7 مهن)
    { name: 'محاسب خبير', sector: 'المالية', accessibility: 'متوسط' },
    { name: 'مراقب التسيير', sector: 'المالية', accessibility: 'متوسط' },
    { name: 'محلل مالي', sector: 'المالية', accessibility: 'متوسط' },
    { name: 'مصرفي أعمال', sector: 'المالية', accessibility: 'صعب' },
    { name: 'مستشار مالي', sector: 'المالية', accessibility: 'متوسط' },
    { name: 'مراجع حسابات', sector: 'المالية', accessibility: 'متوسط' },
    { name: 'مدير ممتلكات', sector: 'المالية', accessibility: 'متوسط' },

    // القانون (7 مهن)
    { name: 'محامي جنائي', sector: 'القانون', accessibility: 'صعب' },
    { name: 'محامي أعمال', sector: 'القانون', accessibility: 'صعب' },
    { name: 'موثق', sector: 'القانون', accessibility: 'صعب' },
    { name: 'مستشار قانوني', sector: 'القانون', accessibility: 'متوسط' },
    { name: 'قاضي', sector: 'القانون', accessibility: 'صعب جداً' },
    { name: 'وسيط', sector: 'القانون', accessibility: 'متوسط' },
    { name: 'مستشار ملكية فكرية', sector: 'القانون', accessibility: 'متوسط' },

    // الفنون والإبداع (7 مهن)
    { name: 'مصمم جرافيك', sector: 'الفنون والإبداع', accessibility: 'متوسط' },
    { name: 'مصور', sector: 'الفنون والإبداع', accessibility: 'متغير' },
    { name: 'مصمم منتجات', sector: 'الفنون والإبداع', accessibility: 'متوسط' },
    { name: 'مصمم أزياء', sector: 'الفنون والإبداع', accessibility: 'متغير' },
    { name: 'مصمم ديكور', sector: 'الفنون والإبداع', accessibility: 'متوسط' },
    { name: 'موسيقي', sector: 'الفنون والإبداع', accessibility: 'متغير' },
    { name: 'مخرج', sector: 'الفنون والإبداع', accessibility: 'صعب' },

    // الإعلام والاتصال (7 مهن)
    { name: 'صحفي', sector: 'الإعلام والاتصال', accessibility: 'صعب' },
    { name: 'محرر ويب', sector: 'الإعلام والاتصال', accessibility: 'متوسط' },
    { name: 'مدير مجتمع رقمي', sector: 'الإعلام والاتصال', accessibility: 'متوسط' },
    { name: 'مسؤول اتصال', sector: 'الإعلام والاتصال', accessibility: 'متوسط' },
    { name: 'مقدم برامج', sector: 'الإعلام والاتصال', accessibility: 'صعب' },
    { name: 'منتج سمعي بصري', sector: 'الإعلام والاتصال', accessibility: 'صعب' },
    { name: 'علاقات عامة', sector: 'الإعلام والاتصال', accessibility: 'متوسط' },

    // التجارة والمبيعات (7 مهن)
    { name: 'مندوب مبيعات شركات', sector: 'التجارة والمبيعات', accessibility: 'متوسط' },
    { name: 'مسؤول تجاري', sector: 'التجارة والمبيعات', accessibility: 'متوسط' },
    { name: 'مطور أعمال', sector: 'التجارة والمبيعات', accessibility: 'متوسط' },
    { name: 'مسؤول تصدير', sector: 'التجارة والمبيعات', accessibility: 'متوسط' },
    { name: 'وسيط عقاري', sector: 'التجارة والمبيعات', accessibility: 'متوسط' },
    { name: 'مدير تجارة إلكترونية', sector: 'التجارة والمبيعات', accessibility: 'متوسط' },
    { name: 'مشتري', sector: 'التجارة والمبيعات', accessibility: 'متوسط' },

    // التسويق (7 مهن)
    { name: 'مسؤول تسويق', sector: 'التسويق', accessibility: 'متوسط' },
    { name: 'مسوق رقمي', sector: 'التسويق', accessibility: 'متوسط' },
    { name: 'خبير تحسين محركات البحث', sector: 'التسويق', accessibility: 'متوسط' },
    { name: 'مدير علامة تجارية', sector: 'التسويق', accessibility: 'متوسط' },
    { name: 'مدير تسويق منتج', sector: 'التسويق', accessibility: 'متوسط' },
    { name: 'خبير نمو', sector: 'التسويق', accessibility: 'متوسط' },
    { name: 'محلل تسويق', sector: 'التسويق', accessibility: 'متوسط' },

    // الموارد البشرية (7 مهن)
    { name: 'مسؤول موارد بشرية', sector: 'الموارد البشرية', accessibility: 'متوسط' },
    { name: 'مختص توظيف', sector: 'الموارد البشرية', accessibility: 'متوسط' },
    { name: 'استشاري موارد بشرية', sector: 'الموارد البشرية', accessibility: 'متوسط' },
    { name: 'مسؤول تدريب', sector: 'الموارد البشرية', accessibility: 'متوسط' },
    { name: 'مسؤول تعويضات ومزايا', sector: 'الموارد البشرية', accessibility: 'متوسط' },
    { name: 'شريك أعمال موارد بشرية', sector: 'الموارد البشرية', accessibility: 'متوسط' },
    { name: 'مسؤول سعادة الموظفين', sector: 'الموارد البشرية', accessibility: 'متوسط' },

    // النقل واللوجستيك (7 مهن)
    { name: 'طيار مدني', sector: 'النقل واللوجستيك', accessibility: 'صعب' },
    { name: 'مراقب جوي', sector: 'النقل واللوجستيك', accessibility: 'صعب جداً' },
    { name: 'ربان سفينة', sector: 'النقل واللوجستيك', accessibility: 'صعب' },
    { name: 'سائق قطار', sector: 'النقل واللوجستيك', accessibility: 'متوسط' },
    { name: 'مختص لوجستيك', sector: 'النقل واللوجستيك', accessibility: 'متوسط' },
    { name: 'مدير سلسلة التوريد', sector: 'النقل واللوجستيك', accessibility: 'متوسط' },
    { name: 'مسؤول مخزن', sector: 'النقل واللوجستيك', accessibility: 'متوسط' },

    // الفندقة والمطاعم (7 مهن)
    { name: 'طباخ محترف', sector: 'الفندقة والمطاعم', accessibility: 'متوسط' },
    { name: 'مدير فندق', sector: 'الفندقة والمطاعم', accessibility: 'متوسط' },
    { name: 'موظف استقبال', sector: 'الفندقة والمطاعم', accessibility: 'سهل' },
    { name: 'بواب فندق', sector: 'الفندقة والمطاعم', accessibility: 'متوسط' },
    { name: 'رئيس نادل', sector: 'الفندقة والمطاعم', accessibility: 'متوسط' },
    { name: 'دليل سياحي', sector: 'الفندقة والمطاعم', accessibility: 'متوسط' },
    { name: 'منظم أفراح', sector: 'الفندقة والمطاعم', accessibility: 'متوسط' },

    // الخدمات العمومية (7 مهن)
    { name: 'دبلوماسي', sector: 'الخدمات العمومية', accessibility: 'صعب جداً' },
    { name: 'إداري مدني', sector: 'الخدمات العمومية', accessibility: 'صعب' },
    { name: 'مراقب ضرائب', sector: 'الخدمات العمومية', accessibility: 'متوسط' },
    { name: 'جمركي', sector: 'الخدمات العمومية', accessibility: 'متوسط' },
    { name: 'شرطي', sector: 'الخدمات العمومية', accessibility: 'متوسط' },
    { name: 'درك', sector: 'الخدمات العمومية', accessibility: 'متوسط' },
    { name: 'إطفائي', sector: 'الخدمات العمومية', accessibility: 'متوسط' },

    // ريادة الأعمال والاستشارة (7 مهن)
    { name: 'رائد أعمال', sector: 'ريادة الأعمال', accessibility: 'متغير' },
    { name: 'استشاري استراتيجي', sector: 'الاستشارة', accessibility: 'صعب' },
    { name: 'استشاري تقني', sector: 'الاستشارة', accessibility: 'متوسط' },
    { name: 'مدير مشروع', sector: 'الإدارة', accessibility: 'متوسط' },
    { name: 'رائد أعمال تقني', sector: 'ريادة الأعمال', accessibility: 'متغير' },
    { name: 'استشاري حر', sector: 'الاستشارة', accessibility: 'متغير' },
    { name: 'محلل أعمال', sector: 'الاستشارة', accessibility: 'متوسط' },

    // البحث والعلوم (7 مهن)
    { name: 'باحث علمي', sector: 'البحث', accessibility: 'صعب' },
    { name: 'مهندس بحث وتطوير', sector: 'البحث', accessibility: 'متوسط' },
    { name: 'باحث مختبر خاص', sector: 'البحث', accessibility: 'متوسط' },
    { name: 'إحصائي', sector: 'البحث', accessibility: 'متوسط' },
    { name: 'اقتصادي', sector: 'البحث', accessibility: 'متوسط' },
    { name: 'عالم أحياء', sector: 'البحث', accessibility: 'متوسط' },
    { name: 'فيزيائي', sector: 'البحث', accessibility: 'صعب' },

    // اللغات والدولي (7 مهن)
    { name: 'مترجم', sector: 'اللغات', accessibility: 'متوسط' },
    { name: 'مترجم فوري', sector: 'اللغات', accessibility: 'متوسط' },
    { name: 'أستاذ لغات', sector: 'اللغات', accessibility: 'متوسط' },
    { name: 'ملحق ثقافي', sector: 'الدولي', accessibility: 'صعب' },
    { name: 'مسؤول بعثات دولية', sector: 'الدولي', accessibility: 'متوسط' },
    { name: 'مدير استيراد وتصدير', sector: 'الدولي', accessibility: 'صعب' },
    { name: 'مستشار علاقات دولية', sector: 'الدولي', accessibility: 'صعب' },

    // الاجتماعي والإنساني (7 مهن)
    { name: 'أخصائي اجتماعي', sector: 'الاجتماعي', accessibility: 'متوسط' },
    { name: 'طبيب نفسي', sector: 'الاجتماعي', accessibility: 'متوسط' },
    { name: 'منسق منظمة غير حكومية', sector: 'الإنساني', accessibility: 'متوسط' },
    { name: 'مسؤول مسؤولية اجتماعية', sector: 'الاجتماعي', accessibility: 'متوسط' },
    { name: 'مربي متخصص', sector: 'الاجتماعي', accessibility: 'متوسط' },
    { name: 'طبيب إنساني', sector: 'الإنساني', accessibility: 'صعب' },
    { name: 'منسق مشاريع اجتماعية', sector: 'الاجتماعي', accessibility: 'متوسط' },

    // الفلاحة والبيئة (7 مهن)
    { name: 'مهندس فلاحي', sector: 'الفلاحة', accessibility: 'متوسط' },
    { name: 'طبيب بيطري ريفي', sector: 'الفلاحة', accessibility: 'صعب' },
    { name: 'استشاري بيئي', sector: 'البيئة', accessibility: 'متوسط' },
    { name: 'مسؤول تنمية مستدامة', sector: 'البيئة', accessibility: 'متوسط' },
    { name: 'خبير سموم بيئية', sector: 'البيئة', accessibility: 'صعب' },
    { name: 'مزارع', sector: 'الفلاحة', accessibility: 'متغير' },
    { name: 'مهندس مناظر طبيعية', sector: 'البيئة', accessibility: 'متوسط' }
  ]
};
const translations = {
  fr: {
    testTitle: "Compatibilité avec les métiers",
    testSubtitle: "Évaluez votre attirance pour différents métiers",
    careerPreferences: "Préférences de carrière",
    workTypePreferred: "Type de travail préféré",
    select: "Sélectionner",
    independentWork: "Travail indépendant",
    publicService: "Fonction publique",
    privateCompany: "Entreprise privée",
    ngoAssoc: "ONG / Associatif",
    mainPriority: "Priorité principale",
    jobStability: "Stabilité de l'emploi",
    highSalary: "Salaire élevé",
    passion: "Passion pour le métier",
    socialPrestige: "Prestige social",
    preferredSector: "Secteur préféré",
    publicOnly: "Secteur public uniquement",
    privateOnly: "Secteur privé uniquement",
    bothSectors: "Les deux secteurs",
    attraction: "Attirance",
    accessibleToYou: "Vous semble accessible ?",
    yes: "Oui",
    no: "Non",
    advice: "Conseil",
    adviceText: "Évaluez au moins 10 métiers pour obtenir des recommandations pertinentes. L'accessibilité correspond à votre perception actuelle de la difficulté d'accès au métier.",
    previous: "Précédent",
    continue: "Continuer",
    easy: "Facile",
    medium: "Moyenne",
    difficult: "Difficile",
    veryDifficult: "Très difficile",
    variable: "Variable"
  },
  ar: {
    testTitle: "التوافق مع المهن",
    testSubtitle: "قيم انجذابك للمهن المختلفة",
    careerPreferences: "تفضيلات المهنة",
    workTypePreferred: "نوع العمل المفضل",
    select: "اختر",
    independentWork: "عمل مستقل",
    publicService: "وظيفة عمومية",
    privateCompany: "شركة خاصة",
    ngoAssoc: "منظمة غير حكومية / جمعوية",
    mainPriority: "الأولوية الرئيسية",
    jobStability: "استقرار الوظيفة",
    highSalary: "راتب عالي",
    passion: "شغف بالمهنة",
    socialPrestige: "مكانة اجتماعية",
    preferredSector: "القطاع المفضل",
    publicOnly: "القطاع العام فقط",
    privateOnly: "القطاع الخاص فقط",
    bothSectors: "القطاعان معاً",
    attraction: "الانجذاب (1-5)",
    accessibleToYou: "يبدو متاحاً لك؟",
    yes: "نعم",
    no: "لا",
    advice: "نصيحة",
    adviceText: "قيم على الأقل 10 مهن للحصول على توصيات مناسبة. إمكانية الوصول تتوافق مع تصورك الحالي لصعوبة الوصول للمهنة.",
    previous: "السابق",
    continue: "متابعة",
    easy: "سهل",
    medium: "متوسط",
    difficult: "صعب",
    veryDifficult: "صعب جداً",
    variable: "متغير"
  }
};

const CareerCompatibilityTest: React.FC<CareerCompatibilityTestProps> = ({ onComplete, onPrevious, canGoBack, language = 'fr', sessionData }) => {
  const [attractions, setAttractions] = useState<Record<string, number>>({});
  const [accessibility, setAccessibility] = useState<Record<string, boolean>>({});
  const [workPreferences, setWorkPreferences] = useState({
    workStyle: '', // independent, public, private, ngo
    priority: '', // stability, salary, passion, prestige
    sector: '' // public, private, mixed
  });

  // Nouvelles states pour capturer les détails
  const [detailedResponses, setDetailedResponses] = useState<Record<string, CareerResponse>>({});
  const [preferenceResponses, setPreferenceResponses] = useState<Record<string, PreferenceResponse>>({});
  const [currentCareerStartTime, setCurrentCareerStartTime] = useState<Record<string, number>>({});
  const [sessionStartTime] = useState(Date.now());

  const currentCareers = careers[language as 'fr' | 'ar'] || careers.fr;
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
        if (sessionData && sessionData.currentStep && sessionData.currentStep.careerCompatibility) {
          console.log("Données de compatibilité de carrière trouvées dans la session:", sessionData.currentStep.careerCompatibility);
          const careerData = sessionData.currentStep.careerCompatibility.careers || {};

          // Restaurer les attractions si elles existent
          if (careerData.careerAttractions) {
            console.log("Restauration des attractions:", careerData.careerAttractions);
            setAttractions(careerData.careerAttractions);
          }

          // Restaurer les accessibilités si elles existent
          if (careerData.careerAccessibility) {
            console.log("Restauration des accessibilités:", careerData.careerAccessibility);
            setAccessibility(careerData.careerAccessibility);
          }

          // Restaurer les préférences de travail
          if (careerData.workPreferences) {
            console.log("Restauration des préférences de travail:", careerData.workPreferences);
            setWorkPreferences(careerData.workPreferences);
          }

          // Restaurer les réponses détaillées si elles existent
          if (careerData.detailedResponses) {
            console.log("Restauration des réponses détaillées:", careerData.detailedResponses);
            setDetailedResponses(careerData.detailedResponses);
          }

          // Restaurer les réponses de préférence
          if (careerData.preferenceResponses) {
            console.log("Restauration des réponses de préférence:", careerData.preferenceResponses);
            setPreferenceResponses(careerData.preferenceResponses);
          }

          setDataLoaded(true);
          setIsLoading(false);
          return;
        }

        // Sinon, récupérer les données depuis l'API
        console.log("Récupération des données de carrière depuis l'API");
        const response = await axios.get(`${API_BASE_URL}/orientation-test/my-test`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success && response.data.hasTest) {
          console.log("Données de test récupérées avec succès:", response.data);
          // Extraire les données de carrière si elles existent
          const testData = response.data.data;
          if (testData.currentStep && testData.currentStep.careerCompatibility) {
            console.log("Données de carrière trouvées dans la réponse API:", testData.currentStep.careerCompatibility);
            const careerData = testData.currentStep.careerCompatibility.careers || {};

            // Restaurer les attractions si elles existent
            if (careerData.careerAttractions) {
              console.log("Restauration des attractions depuis l'API:", careerData.careerAttractions);
              setAttractions(careerData.careerAttractions);
            }

            // Restaurer les accessibilités si elles existent
            if (careerData.careerAccessibility) {
              console.log("Restauration des accessibilités depuis l'API:", careerData.careerAccessibility);
              setAccessibility(careerData.careerAccessibility);
            }

            // Restaurer les préférences de travail
            if (careerData.workPreferences) {
              console.log("Restauration des préférences de travail depuis l'API:", careerData.workPreferences);
              setWorkPreferences(careerData.workPreferences);
            }

            // Restaurer les réponses détaillées si elles existent
            if (careerData.detailedResponses) {
              console.log("Restauration des réponses détaillées depuis l'API:", careerData.detailedResponses);
              setDetailedResponses(careerData.detailedResponses);
            }

            // Restaurer les réponses de préférence
            if (careerData.preferenceResponses) {
              console.log("Restauration des réponses de préférence depuis l'API:", careerData.preferenceResponses);
              setPreferenceResponses(careerData.preferenceResponses);
            }

            setDataLoaded(true);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données de carrière:", err);
        // Ne pas afficher d'erreur à l'utilisateur, simplement continuer avec le formulaire vide
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, token, sessionData, language]);


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
      console.log("Soumission des données de compatibilité de carrière au backend:", completionData);

      // Préparer les données à envoyer
      const careerData = {
        stepName: 'careerCompatibility',
        stepData: {
          careers: completionData,
          timestamp: new Date().toISOString()
        },
        stepNumber: 5, // Supposons que c'est la 5ème étape
        duration: completionData.sessionDuration || 0,
        isCompleted: true
      };

      // Envoyer les données à l'API
      const response = await axios.post(
        `${API_BASE_URL}/orientation-test/save-step`,
        careerData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        console.log('Test de compatibilité de carrière enregistré avec succès', response.data);

        // Appeler onComplete pour passer à l'étape suivante
        onComplete({
          ...completionData,
          sessionData: response.data
        });
      } else {
        // Gérer le cas où l'API retourne success: false
        setError(response.data.message || (language === 'ar'
          ? 'حدث خطأ أثناء حفظ اختبار توافق المهن'
          : 'Une erreur est survenue lors de l\'enregistrement du test de compatibilité de carrière'));
      }
    } catch (err) {
      console.error('Erreur lors de la soumission du test de compatibilité de carrière', err);

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

  // Fonction pour mettre à jour les réponses détaillées pour une carrière
  const updateCareerResponse = (
    careerId: string,
    careerIndex: number,
    sector: string,
    difficultyLevel: string,
    updates: Partial<CareerResponse>
  ) => {
    // Récupérer la réponse existante ou créer une nouvelle
    const existingResponse = detailedResponses[careerId] || {
      careerId,
      careerName: careerId,
      sector,
      difficultyLevel,
      attractionLevel: null,
      accessibilityPerceived: null,
      attractionResponseTime: null,
      accessibilityResponseTime: null,
      timestamp: new Date(),
      careerIndex
    };

    // Mettre à jour avec les nouvelles valeurs
    const updatedResponse: CareerResponse = {
      ...existingResponse,
      ...updates
    };

    // Mettre à jour l'état
    setDetailedResponses(prev => ({
      ...prev,
      [careerId]: updatedResponse
    }));
  };

  const handleAttractionChange = (career: string, value: number) => {
    const responseTime = Date.now() - (currentCareerStartTime[career] || Date.now());
    const careerIndex = currentCareers.findIndex(c => c.name === career);
    const careerData = currentCareers[careerIndex];

    setAttractions(prev => ({ ...prev, [career]: value }));

    updateCareerResponse(career, careerIndex, careerData.sector, careerData.accessibility, {
      attractionLevel: value,
      attractionResponseTime: responseTime,
      timestamp: new Date()
    });

    console.log(`💼 Career Attraction Captured:`, {
      career: career.substring(0, 30) + '...',
      sector: careerData.sector,
      attractionLevel: value,
      difficulty: careerData.accessibility,
      responseTime: `${responseTime}ms`
    });

    // Reset timer pour ce métier
    setCurrentCareerStartTime(prev => ({
      ...prev,
      [career]: Date.now()
    }));
  };

  const handleAccessibilityChange = (career: string, accessible: boolean) => {
    const responseTime = Date.now() - (currentCareerStartTime[career] || Date.now());
    const careerIndex = currentCareers.findIndex(c => c.name === career);
    const careerData = currentCareers[careerIndex];

    setAccessibility(prev => ({ ...prev, [career]: accessible }));

    updateCareerResponse(career, careerIndex, careerData.sector, careerData.accessibility, {
      accessibilityPerceived: accessible,
      accessibilityResponseTime: responseTime,
      timestamp: new Date()
    });

    console.log(`🎯 Career Accessibility Captured:`, {
      career: career.substring(0, 30) + '...',
      sector: careerData.sector,
      accessibilityPerceived: accessible,
      officialDifficulty: careerData.accessibility,
      responseTime: `${responseTime}ms`
    });

    // Reset timer pour ce métier
    setCurrentCareerStartTime(prev => ({
      ...prev,
      [career]: Date.now()
    }));
  };

  const handleWorkPreferenceChange = (key: string, value: string) => {
    const startTime = Date.now();
    setWorkPreferences(prev => ({ ...prev, [key]: value }));

    const preferenceResponse: PreferenceResponse = {
      preferenceType: key as 'workStyle' | 'priority' | 'sector',
      selectedValue: value,
      responseTime: 100, // Approximatif pour les selects
      timestamp: new Date()
    };

    setPreferenceResponses(prev => ({
      ...prev,
      [key]: preferenceResponse
    }));

    console.log(`⚙️ Work Preference Captured:`, {
      preferenceType: key,
      selectedValue: value,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const getAccessibilityColor = (accessibility: string) => {
    switch (accessibility) {
      case 'Facile':
      case 'سهل':
        return 'bg-green-100 text-green-700';
      case 'Moyenne':
      case 'متوسط':
        return 'bg-yellow-100 text-yellow-700';
      case 'Difficile':
      case 'صعب':
        return 'bg-orange-100 text-orange-700';
      case 'Très difficile':
      case 'صعب جداً':
        return 'bg-red-100 text-red-700';
      case 'Variable':
      case 'متغير':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleSubmit = () => {
    console.group('💼 Career Compatibility Test Completion');
    console.log('Calculating comprehensive career compatibility analysis...');

    // Group careers by sector and calculate averages
    const sectorScores: Record<string, { attraction: number; count: number }> = {};

    currentCareers.forEach(career => {
      if (attractions[career.name]) {
        if (!sectorScores[career.sector]) {
          sectorScores[career.sector] = { attraction: 0, count: 0 };
        }
        sectorScores[career.sector].attraction += attractions[career.name];
        sectorScores[career.sector].count += 1;
      }
    });

    // Calculate final sector scores
    const finalSectorScores: Record<string, number> = {};
    Object.entries(sectorScores).forEach(([sector, data]) => {
      finalSectorScores[sector] = Math.round((data.attraction / data.count) * 20);
    });

    // Get top careers (attraction >= 4 and accessible)
    const topCareers = currentCareers.filter(career =>
      attractions[career.name] >= 4 && accessibility[career.name] === true
    );

    // Calculer les statistiques détaillées
    const responseStats = Object.values(detailedResponses);
    const completedResponses = responseStats.filter(r =>
      r.attractionLevel !== null && r.accessibilityPerceived !== null
    );

    // Statistiques temporelles
    const allResponseTimes = responseStats.flatMap(r =>
      [r.attractionResponseTime, r.accessibilityResponseTime]
        .filter(time => time !== null) as number[]
    );

    const avgResponseTime = allResponseTimes.length > 0
      ? Math.round(allResponseTimes.reduce((sum, time) => sum + time, 0) / allResponseTimes.length)
      : 0;

    // Analyser les perceptions vs réalité
    const perceptionAnalysis = responseStats.map(response => {
      const officialDifficulty = response.difficultyLevel;
      const perceivedAccessible = response.accessibilityPerceived;

      // Score de réalisme (comparaison perception vs difficulté officielle)
      let realismScore = 'neutral';
      if (officialDifficulty === 'Facile' || officialDifficulty === 'سهل') {
        realismScore = perceivedAccessible ? 'realistic' : 'pessimistic';
      } else if (officialDifficulty === 'Très difficile' || officialDifficulty === 'صعب جداً') {
        realismScore = perceivedAccessible ? 'optimistic' : 'realistic';
      }

      return {
        career: response.careerName,
        sector: response.sector,
        attraction: response.attractionLevel,
        officialDifficulty,
        perceivedAccessible,
        realismScore
      };
    }).filter(r => r.attraction !== null);

    // Créer la session
    const session = {
      testType: 'career_compatibility',
      startedAt: new Date(sessionStartTime),
      completedAt: new Date(),
      duration: Date.now() - sessionStartTime,
      language: language as 'fr' | 'ar',
      totalQuestions: (Object.keys(detailedResponses).length * 2) + 3, // 2 questions par métier + 3 préférences
      questions: [
        // Questions de préférences
        ...Object.entries(preferenceResponses).map(([key, pref]) => ({
          questionId: `preference_${key}`,
          questionText: `${key === 'workStyle' ? t.workTypePreferred : key === 'priority' ? t.mainPriority : t.preferredSector}`,
          userAnswer: pref.selectedValue,
          responseTime: pref.responseTime,
          timestamp: pref.timestamp
        })),
        // Questions sur les métiers
        ...responseStats.flatMap(response => {
          const questions = [];

          if (response.attractionLevel !== null) {
            questions.push({
              questionId: `${response.careerId}_attraction`,
              questionText: `${t.attraction} - ${response.careerName}`,
              userAnswer: response.attractionLevel,
              responseTime: response.attractionResponseTime,
              timestamp: response.timestamp
            });
          }

          if (response.accessibilityPerceived !== null) {
            questions.push({
              questionId: `${response.careerId}_accessibility`,
              questionText: `${t.accessibleToYou} - ${response.careerName}`,
              userAnswer: response.accessibilityPerceived ? 1 : 0,
              responseTime: response.accessibilityResponseTime,
              timestamp: response.timestamp
            });
          }

          return questions;
        })
      ]
    };

    // Statistiques par secteur avec analyse comportementale
    const sectorStats = Object.entries(finalSectorScores).map(([sector, score]) => {
      const sectorResponses = responseStats.filter(r => r.sector === sector);
      const sectorResponseTimes = sectorResponses.flatMap(r =>
        [r.attractionResponseTime, r.accessibilityResponseTime]
          .filter(time => time !== null) as number[]
      );

      return {
        sector,
        attractionScore: score,
        careersEvaluated: sectorResponses.length,
        avgResponseTime: sectorResponseTimes.length > 0
          ? Math.round(sectorResponseTimes.reduce((sum, time) => sum + time, 0) / sectorResponseTimes.length)
          : 0,
        accessibleCareersCount: sectorResponses.filter(r => r.accessibilityPerceived === true).length,
        highAttractionCount: sectorResponses.filter(r => r.attractionLevel && r.attractionLevel >= 4).length
      };
    });

    // Analyse comportementale avancée
    const optimismRate = Math.round(
      (perceptionAnalysis.filter(p => p.realismScore === 'optimistic').length / perceptionAnalysis.length) * 100
    );

    const pessimismRate = Math.round(
      (perceptionAnalysis.filter(p => p.realismScore === 'pessimistic').length / perceptionAnalysis.length) * 100
    );

    console.log('Final Statistics:', {
      careersEvaluated: completedResponses.length,
      topCareers: topCareers.length,
      avgResponseTime,
      optimismRate,
      pessimismRate,
      sessionDuration: Date.now() - sessionStartTime
    });

    console.log('Top Career Matches:', topCareers.slice(0, 5).map(c => c.name));
    console.log('Sector Preferences:', sectorStats.slice(0, 3).map(s => `${s.sector}: ${s.attractionScore}%`));
    console.groupEnd();

    const completionData = {
      careerAttractions: attractions,
      careerAccessibility: accessibility,
      workPreferences,
      sectorScores: finalSectorScores,
      topCareers: topCareers.map(c => c.name),
      // Nouvelles données détaillées
      session,
      detailedResponses,
      preferenceResponses,
      perceptionAnalysis,
      avgResponseTime,
      sessionDuration: Date.now() - sessionStartTime,
      completedAt: new Date(),
      sectorStats,
      // Analyse comportementale
      behavioralAnalysis: {
        preferredSector: sectorStats.reduce((max, sector) =>
          sector.attractionScore > max.attractionScore ? sector : max, sectorStats[0]),
        mostAccessibleSector: sectorStats.reduce((max, sector) =>
          sector.accessibleCareersCount > max.accessibleCareersCount ? sector : max, sectorStats[0]),
        quickestSector: sectorStats.reduce((min, sector) =>
          sector.avgResponseTime < min.avgResponseTime ? sector : min, sectorStats[0]),
        optimismRate,
        pessimismRate,
        realismRate: 100 - optimismRate - pessimismRate,
        careerAmbition: Math.round(Object.values(attractions).reduce((sum, val) => sum + val, 0) / Object.keys(attractions).length * 20)
      }
    };

    submitTestData(completionData);
  };

  const isComplete = Object.keys(attractions).length >= 10 &&
    Object.values(workPreferences).every(pref => pref !== '');

  // Group careers by sector
  const groupedCareers = currentCareers.reduce((acc, career) => {
    if (!acc[career.sector]) {
      acc[career.sector] = [];
    }
    acc[career.sector].push(career);
    return acc;
  }, {} as Record<string, typeof currentCareers>);

  // Calculer les statistiques de progression
  const getCompletionStats = () => {
    const totalCareers = currentCareers.length;
    const attractionCompleted = Object.keys(attractions).length;
    const accessibilityCompleted = Object.keys(accessibility).length;
    const preferencesCompleted = Object.values(workPreferences).filter(pref => pref !== '').length;

    return {
      totalCareers,
      attractionCompleted,
      accessibilityCompleted,
      preferencesCompleted,
      avgCompletion: Math.round(((attractionCompleted + accessibilityCompleted) / (totalCareers * 2)) * 100),
      isMinimumMet: attractionCompleted >= 10
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
            ? 'جاري تحميل اختبار توافق المهن...'
            : 'Chargement du test de compatibilité de carrière...'}
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

        {/* Progress Statistics */}
        {completionStats.attractionCompleted > 0 && (
          <div className={`rounded-lg p-3 mt-4 ${completionStats.isMinimumMet ? 'bg-green-50' : 'bg-orange-50'}`}>
            <div className={`text-sm ${completionStats.isMinimumMet ? 'text-green-700' : 'text-orange-700'} ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {language === 'ar'
                ? `المهن المقيمة: ${completionStats.attractionCompleted} (الحد الأدنى: 10) - التقدم: ${completionStats.avgCompletion}%`
                : `Métiers évalués: ${completionStats.attractionCompleted} (minimum: 10) - Progression: ${completionStats.avgCompletion}%`
              }
              {Object.values(detailedResponses).length > 0 && (
                <span className="ml-4">
                  {language === 'ar'
                    ? `متوسط الوقت: ${Math.round(Object.values(detailedResponses).flatMap(r => [r.attractionResponseTime, r.accessibilityResponseTime].filter(t => t !== null) as number[]).reduce((sum, time) => sum + time, 0) / Math.max(1, Object.values(detailedResponses).flatMap(r => [r.attractionResponseTime, r.accessibilityResponseTime].filter(t => t !== null)).length) / 1000)}ث`
                    : `Temps moyen: ${Math.round(Object.values(detailedResponses).flatMap(r => [r.attractionResponseTime, r.accessibilityResponseTime].filter(t => t !== null) as number[]).reduce((sum, time) => sum + time, 0) / Math.max(1, Object.values(detailedResponses).flatMap(r => [r.attractionResponseTime, r.accessibilityResponseTime].filter(t => t !== null)).length) / 1000)}s`
                  }
                </span>
              )}
            </div>
          </div>
        )}
      </div>


      {/* Bouton pour tout préremplir */}
      <div className="flex justify-end mb-6">
        <button
          type="button"
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition"
          onClick={() => {
            // Préremplir toutes les carrières avec attraction = 5 et accessibilité = true
            const newAttractions: Record<string, number> = {};
            const newAccessibility: Record<string, boolean> = {};
            const now = Date.now();

            currentCareers.forEach((career, idx) => {
              newAttractions[career.name] = 5;
              newAccessibility[career.name] = true;

              // Met à jour les réponses détaillées
              updateCareerResponse(
                career.name,
                idx,
                career.sector,
                career.accessibility,
                {
                  attractionLevel: 5,
                  accessibilityPerceived: true,
                  attractionResponseTime: 1000,
                  accessibilityResponseTime: 1000,
                  timestamp: new Date()
                }
              );
            });

            setAttractions(newAttractions);
            setAccessibility(newAccessibility);
          }}
        >
          {language === 'ar' ? "تعبئة جميع الإجابات بـ 5 ونعم" : "Tout préremplir (5 & Oui)"}
        </button>
      </div>

      <div className="bg-amber-50 rounded-xl p-4">
        <p className={`text-sm text-amber-700 ${language === 'ar' ? 'text-right' : ''}`}>
          <strong>{t.advice}:</strong> {t.adviceText}
        </p>
      </div>

      {/* Work Preferences */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <div className={`flex justify-between items-center mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <h3 className="text-lg font-semibold text-gray-900">{t.careerPreferences}</h3>
          <div className="text-sm text-blue-600">
            {completionStats.preferencesCompleted}/3
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.workTypePreferred}</label>
            <select
              value={workPreferences.workStyle}
              onChange={(e) => handleWorkPreferenceChange('workStyle', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t.select}</option>
              <option value="independent">{t.independentWork}</option>
              <option value="public">{t.publicService}</option>
              <option value="private">{t.privateCompany}</option>
              <option value="ngo">{t.ngoAssoc}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.mainPriority}</label>
            <select
              value={workPreferences.priority}
              onChange={(e) => handleWorkPreferenceChange('priority', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t.select}</option>
              <option value="stability">{t.jobStability}</option>
              <option value="salary">{t.highSalary}</option>
              <option value="passion">{t.passion}</option>
              <option value="prestige">{t.socialPrestige}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.preferredSector}</label>
            <select
              value={workPreferences.sector}
              onChange={(e) => handleWorkPreferenceChange('sector', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t.select}</option>
              <option value="public">{t.publicOnly}</option>
              <option value="private">{t.privateOnly}</option>
              <option value="mixed">{t.bothSectors}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Career Evaluations */}
      {Object.entries(groupedCareers).map(([sector, sectorCareers]) => {
        const sectorResponses = sectorCareers.map(career => detailedResponses[career.name]).filter(Boolean);
        const sectorCompletion = sectorResponses.length > 0
          ? Math.round((sectorResponses.filter(r => r.attractionLevel !== null && r.accessibilityPerceived !== null).length / sectorCareers.length) * 100)
          : 0;

        return (
          <div key={sector} className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6">
            <div className={`flex justify-between items-center mb-4 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <h3 className="text-lg font-semibold text-gray-900">{sector}</h3>
              <div className="text-right">
                <div className="text-sm text-green-600">
                  {sectorCompletion}%
                </div>
                <div className="text-xs text-gray-500">
                  {sectorResponses.filter(r => r.attractionLevel !== null).length}/{sectorCareers.length}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {sectorCareers.map(career => {
                const hasAttraction = attractions[career.name] !== undefined;
                const hasAccessibility = accessibility[career.name] !== undefined;
                const isComplete = hasAttraction && hasAccessibility;

                return (
                  <div key={career.name} className={`bg-white rounded-lg p-4 border transition-all ${isComplete ? 'border-green-300 bg-green-50' : 'border-gray-200'
                    }`}>
                    <div className={`flex items-start mb-3 ${language === 'ar' ? 'flex-row-reverse' : 'justify-between'}`}>
                      <div className={language === 'ar' ? 'text-right' : ''}>
                        <h4 className="font-medium text-gray-900">{career.name}</h4>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getAccessibilityColor(career.accessibility)}`}>
                          {career.accessibility}
                        </span>
                      </div>
                      {isComplete && (
                        <div className="text-xs text-green-600 font-medium">
                          ✓ A:{attractions[career.name]} Acc:{accessibility[career.name] ? 'Oui' : 'Non'}
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Attraction */}
                      <div>
                        <label className={`block text-sm text-gray-600 mb-2 ${language === 'ar' ? 'text-right' : ''}`}>
                          {t.attraction}
                        </label>
                        <div className={`flex gap-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                          {[1, 2, 3, 4, 5].map(value => (
                            <button
                              key={value}
                              onClick={() => handleAttractionChange(career.name, value)}
                              className={`w-8 h-8 rounded-full border-2 text-sm font-medium transition-all ${attractions[career.name] === value
                                ? 'bg-blue-500 border-blue-500 text-white scale-110'
                                : 'border-gray-300 text-gray-600 hover:border-blue-300'
                                }`}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Accessibility */}
                      <div>
                        <label className={`block text-sm text-gray-600 mb-2 ${language === 'ar' ? 'text-right' : ''}`}>
                          {t.accessibleToYou}
                        </label>
                        <div className={`flex gap-3 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
                          <button
                            onClick={() => handleAccessibilityChange(career.name, true)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${accessibility[career.name] === true
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 text-gray-600 hover:border-green-300'
                              }`}
                          >
                            {t.yes}
                          </button>
                          <button
                            onClick={() => handleAccessibilityChange(career.name, false)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${accessibility[career.name] === false
                              ? 'bg-red-500 border-red-500 text-white'
                              : 'border-gray-300 text-gray-600 hover:border-red-300'
                              }`}
                          >
                            {t.no}
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
      <div className={`flex justify-between items-center pt-6 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
        <button
          type="button"
          onClick={onPrevious}
          className={`inline-flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
        >
          <ArrowLeftIcon className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
          <span>{t.previous}</span>
        </button>


        <button
          onClick={handleSubmit}
          disabled={!isComplete || isSubmitting}
          className={`inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}
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
    </div>
  );
};

export default CareerCompatibilityTest;