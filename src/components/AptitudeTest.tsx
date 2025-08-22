import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, ArrowLeftIcon, ClockIcon, Loader2Icon, CheckIcon } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { getAuthToken } from '../utils/auth';

interface AptitudeTestProps {
  onComplete: (data: any) => void;
  onPrevious: () => void;
  canGoBack: boolean;
  language: string;
  sessionData?: any; // Ajout des données de session
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

// Remplacer la définition des tests existants par cette version améliorée

const aptitudeTests = {
  logique: {
    title: {
      fr: "Raisonnement logique",
      ar: "التفكير المنطقي"
    },
    timeLimit: 600, // 10 minutes
    questions: {
      fr: [
        {
          question: "Quelle est la prochaine valeur dans cette suite : 2, 6, 12, 20, 30, ?",
          options: ["40", "42", "38", "45"],
          correct: 1
        },
        {
          question: "Si tous les A sont B, et certains B sont C, alors :",
          options: ["Tous les A sont C", "Certains A peuvent être C", "Aucun A n'est C", "Tous les C sont A"],
          correct: 1
        },
        {
          question: "Dans une classe de 30 élèves, 18 pratiquent le sport, 12 font de la musique, et 8 font les deux. Combien ne font ni sport ni musique ?",
          options: ["8", "10", "6", "12"],
          correct: 0
        },
        {
          question: "Si 3x + 7 = 22, alors x = ?",
          options: ["5", "7", "3", "15"],
          correct: 0
        },
        {
          question: "Quelle figure complète logiquement cette série : ○, △, □, ○, △, ?",
          options: ["○", "△", "□", "◊"],
          correct: 2
        },
        {
          question: "Si A > B, B > C, et C > D, alors :",
          options: ["D > A", "A > D", "C > A", "B = D"],
          correct: 1
        },
        {
          question: "Quelle est la prochaine valeur : 1, 4, 9, 16, 25, ?",
          options: ["30", "36", "35", "49"],
          correct: 1
        },
        {
          question: "Si le train part à 14h30 et arrive à 17h15, combien de temps dure le voyage ?",
          options: ["2h45", "3h15", "2h30", "3h45"],
          correct: 0
        },
        {
          question: "Dans un groupe de 100 personnes, 60% parlent français, 40% parlent anglais, 25% parlent les deux. Combien parlent uniquement français ?",
          options: ["35", "25", "40", "60"],
          correct: 0
        },
        {
          question: "Si P implique Q, et Q implique R, alors :",
          options: ["R implique P", "P implique R", "P équivaut à R", "Aucune conclusion"],
          correct: 1
        }
      ],
      ar: [
        {
          question: "ما هي القيمة التالية في هذه المتتالية: 2، 6، 12، 20، 30، ؟",
          options: ["40", "42", "38", "45"],
          correct: 1
        },
        {
          question: "إذا كان كل A هو B، وبعض B هي C، إذن:",
          options: ["كل A هي C", "بعض A يمكن أن تكون C", "لا يوجد A هي C", "كل C هي A"],
          correct: 1
        },
        {
          question: "في فصل من 30 تلميذ، 18 يمارسون الرياضة، 12 يدرسون الموسيقى، و8 يفعلون الاثنين. كم عدد من لا يفعلون لا رياضة ولا موسيقى؟",
          options: ["8", "10", "6", "12"],
          correct: 0
        },
        {
          question: "إذا كان 3x + 7 = 22، إذن x = ؟",
          options: ["5", "7", "3", "15"],
          correct: 0
        },
        {
          question: "أي شكل يكمل منطقياً هذه السلسلة: ○, △, □, ○, △, ؟",
          options: ["○", "△", "□", "◊"],
          correct: 2
        },
        {
          question: "إذا كان A > B، B > C، و C > D، إذن:",
          options: ["D > A", "A > D", "C > A", "B = D"],
          correct: 1
        },
        {
          question: "ما هي القيمة التالية: 1، 4، 9، 16، 25، ؟",
          options: ["30", "36", "35", "49"],
          correct: 1
        },
        {
          question: "إذا غادر القطار في 14:30 ووصل في 17:15، كم تستغرق الرحلة؟",
          options: ["ساعتان و45 دقيقة", "3 ساعات و15 دقيقة", "ساعتان و30 دقيقة", "3 ساعات و45 دقيقة"],
          correct: 0
        },
        {
          question: "في مجموعة من 100 شخص، 60% يتحدثون الفرنسية، 40% يتحدثون الإنجليزية، 25% يتحدثون كلاهما. كم عدد من يتحدثون الفرنسية فقط؟",
          options: ["35", "25", "40", "60"],
          correct: 0
        },
        {
          question: "إذا كان P يستلزم Q، و Q يستلزم R، إذن:",
          options: ["R يستلزم P", "P يستلزم R", "P يساوي R", "لا استنتاج"],
          correct: 1
        }
      ]
    }
  },
  spatial: {
    title: {
      fr: "Raisonnement spatial",
      ar: "التفكير المكاني"
    },
    timeLimit: 360, // 6 minutes
    questions: {
      fr: [
        {
          question: "Si vous pliez un carré en deux puis que vous faites un trou au milieu, combien de trous aurez-vous en dépliant ?",
          options: ["1", "2", "4", "8"],
          correct: 1
        },
        {
          question: "Quelle est la vue de dessus d'un cube ?",
          options: ["Triangle", "Carré", "Cercle", "Rectangle"],
          correct: 1
        },
        {
          question: "Combien y a-t-il de cubes dans une structure 3x3x3 ?",
          options: ["9", "18", "27", "36"],
          correct: 2
        },
        {
          question: "Si vous tournez la lettre 'b' de 180°, vous obtenez :",
          options: ["d", "p", "q", "b"],
          correct: 2
        },
        {
          question: "Quelle forme obtient-on en assemblant deux triangles équilatéraux ?",
          options: ["Carré", "Losange", "Hexagone", "Rectangle"],
          correct: 1
        },
        {
          question: "Combien de faces a un tétraèdre ?",
          options: ["3", "4", "5", "6"],
          correct: 1
        },
        {
          question: "Si vous regardez un dé depuis le dessus et voyez 6 points, combien de points y a-t-il sur la face du dessous ?",
          options: ["1", "2", "3", "4"],
          correct: 0
        },
        {
          question: "Quelle figure 2D obtient-on en coupant un cylindre par un plan perpendiculaire à sa base ?",
          options: ["Triangle", "Carré", "Rectangle", "Cercle"],
          correct: 3
        },
        {
          question: "Combien d'arêtes a un cube ?",
          options: ["8", "10", "12", "14"],
          correct: 2
        },
        {
          question: "Si vous pliez une feuille rectangulaire en deux dans le sens de la longueur, puis encore en deux, combien de rectangles obtenez-vous en dépliant ?",
          options: ["2", "4", "6", "8"],
          correct: 1
        }
      ],
      ar: [
        {
          question: "إذا طويت مربعاً إلى النصف ثم صنعت ثقباً في الوسط، كم ثقباً ستحصل عليه عند فتحه؟",
          options: ["1", "2", "4", "8"],
          correct: 1
        },
        {
          question: "ما هو الشكل المرئي من أعلى المكعب؟",
          options: ["مثلث", "مربع", "دائرة", "مستطيل"],
          correct: 1
        },
        {
          question: "كم مكعباً يوجد في هيكل 3×3×3؟",
          options: ["9", "18", "27", "36"],
          correct: 2
        },
        {
          question: "إذا دورت الحرف 'ب' بـ 180°، تحصل على:",
          options: ["د", "ب", "ق", "ب"],
          correct: 2
        },
        {
          question: "أي شكل نحصل عليه عند تجميع مثلثين متساويي الأضلاع؟",
          options: ["مربع", "معين", "سداسي", "مستطيل"],
          correct: 1
        },
        {
          question: "كم وجهاً يملك الهرم الرباعي؟",
          options: ["3", "4", "5", "6"],
          correct: 1
        },
        {
          question: "إذا نظرت إلى حجر نرد من الأعلى ورأيت 6 نقاط، كم نقطة توجد على الوجه السفلي؟",
          options: ["1", "2", "3", "4"],
          correct: 0
        },
        {
          question: "أي شكل ثنائي الأبعاد نحصل عليه عند قطع أسطوانة بمستوى عمودي على قاعدتها؟",
          options: ["مثلث", "مربع", "مستطيل", "دائرة"],
          correct: 3
        },
        {
          question: "كم حافة يملك المكعب؟",
          options: ["8", "10", "12", "14"],
          correct: 2
        },
        {
          question: "إذا طويت ورقة مستطيلة إلى النصف طولياً، ثم إلى النصف مرة أخرى، كم مستطيلاً تحصل عليه عند الفتح؟",
          options: ["2", "4", "6", "8"],
          correct: 1
        }
      ]
    }
  },
  numerique: {
    title: {
      fr: "Raisonnement numérique",
      ar: "التفكير الرقمي"
    },
    timeLimit: 420, // 7 minutes
    questions: {
      fr: [
        {
          question: "Si 2x = 6, alors 3x + 4 = ?",
          options: ["10", "13", "16", "19"],
          correct: 1
        },
        {
          question: "Un article coûte 80€. Après une remise de 25%, combien coûte-t-il ?",
          options: ["55€", "60€", "65€", "70€"],
          correct: 0
        },
        {
          question: "Quel est le nombre manquant dans la série : 2, 5, 10, 17, 26, ?",
          options: ["35", "37", "39", "42"],
          correct: 1
        },
        {
          question: "Si le rapport entre deux nombres est 3:5 et leur somme est 32, quel est le plus petit nombre ?",
          options: ["12", "15", "18", "20"],
          correct: 0
        },
        {
          question: "Une voiture parcourt 240 km en 3 heures. Quelle est sa vitesse moyenne en km/h ?",
          options: ["60", "70", "80", "90"],
          correct: 2
        },
        {
          question: "Quelle est la valeur de x dans l'équation : 2(x-3) = 3x-8 ?",
          options: ["1", "2", "3", "4"],
          correct: 1
        },
        {
          question: "Un investissement de 1000€ rapporte 8% par an. Combien vaudra-t-il après 2 ans (intérêts composés) ?",
          options: ["1080€", "1160€", "1166€", "1200€"],
          correct: 2
        },
        {
          question: "Si 3 personnes peuvent peindre 3 murs en 3 heures, combien de personnes faudra-t-il pour peindre 6 murs en 6 heures ?",
          options: ["3", "6", "9", "12"],
          correct: 0
        },
        {
          question: "Quelle est la racine carrée de 169 ?",
          options: ["11", "12", "13", "14"],
          correct: 2
        },
        {
          question: "Si a:b = 2:3 et b:c = 4:5, alors a:c = ?",
          options: ["2:5", "8:15", "6:5", "4:5"],
          correct: 1
        }
      ],
      ar: [
        {
          question: "إذا كان 2x = 6، فإن 3x + 4 = ؟",
          options: ["10", "13", "16", "19"],
          correct: 1
        },
        {
          question: "سلعة تكلف 80 يورو. بعد خصم 25%، كم تكلف؟",
          options: ["55 يورو", "60 يورو", "65 يورو", "70 يورو"],
          correct: 0
        },
        {
          question: "ما هو العدد المفقود في السلسلة: 2، 5، 10، 17، 26، ؟",
          options: ["35", "37", "39", "42"],
          correct: 1
        },
        {
          question: "إذا كانت النسبة بين عددين هي 3:5 ومجموعهما 32، فما هو العدد الأصغر؟",
          options: ["12", "15", "18", "20"],
          correct: 0
        },
        {
          question: "سيارة تقطع 240 كم في 3 ساعات. ما هي سرعتها المتوسطة بالكيلومتر في الساعة؟",
          options: ["60", "70", "80", "90"],
          correct: 2
        },
        {
          question: "ما هي قيمة x في المعادلة: 2(x-3) = 3x-8 ؟",
          options: ["1", "2", "3", "4"],
          correct: 1
        },
        {
          question: "استثمار بقيمة 1000 يورو يجلب 8% سنويًا. كم ستكون قيمته بعد سنتين (فائدة مركبة)؟",
          options: ["1080 يورو", "1160 يورو", "1166 يورو", "1200 يورو"],
          correct: 2
        },
        {
          question: "إذا كان 3 أشخاص يمكنهم طلاء 3 جدران في 3 ساعات، فكم شخصًا سيلزم لطلاء 6 جدران في 6 ساعات؟",
          options: ["3", "6", "9", "12"],
          correct: 0
        },
        {
          question: "ما هو الجذر التربيعي لـ 169؟",
          options: ["11", "12", "13", "14"],
          correct: 2
        },
        {
          question: "إذا كان a:b = 2:3 و b:c = 4:5، فإن a:c = ؟",
          options: ["2:5", "8:15", "6:5", "4:5"],
          correct: 1
        }
      ]
    }
  },
  abstrait: {
    title: {
      fr: "Raisonnement abstrait",
      ar: "التفكير المجرد"
    },
    timeLimit: 480, // 8 minutes
    questions: {
      fr: [
        {
          question: "Quel motif complète logiquement cette séquence ? [Image: séquence de motifs géométriques avec un manquant]",
          options: ["Motif A", "Motif B", "Motif C", "Motif D"],
          correct: 2
        },
        {
          question: "Si ABCD est à EFGH comme IJKL est à ?",
          options: ["MNOP", "PMNO", "MNPO", "NMOP"],
          correct: 0
        },
        {
          question: "Quelle est la relation entre les éléments de cette série : 1→3, 2→6, 3→9, 4→12 ?",
          options: ["Multiplication par 3", "Addition de 2", "Carré + 1", "Multiplication par 2 + 1"],
          correct: 0
        },
        {
          question: "Si ○ ⊕ △ = □ et △ ⊕ □ = ○, alors ○ ⊕ □ = ?",
          options: ["○", "△", "□", "⊕"],
          correct: 1
        },
        {
          question: "Dans une certaine notation, 2*3 = 10, 3*4 = 14, 4*5 = 18. Que vaut 5*6 ?",
          options: ["20", "22", "24", "30"],
          correct: 1
        },
        {
          question: "Quel élément ne va pas avec les autres : Cube, Sphère, Cône, Triangle ?",
          options: ["Cube", "Sphère", "Cône", "Triangle"],
          correct: 3
        },
        {
          question: "Si aujourd'hui est mercredi, quel jour sera dans 100 jours ?",
          options: ["Lundi", "Mardi", "Mercredi", "Jeudi"],
          correct: 2
        },
        {
          question: "Quelle est la séquence logique de ces transformations ? A→B→C→?",
          options: ["A", "B", "C", "D"],
          correct: 3
        },
        {
          question: "Si ◊ → ○ et ○ → □, alors ◊ → ?",
          options: ["□", "○", "△", "◊"],
          correct: 0
        },
        {
          question: "Quelle règle explique cette suite : 3, 6, 11, 18, 27, ?",
          options: ["Ajouter 3, puis 5, puis 7...", "+3, +5, +7, +9...", "×2, +1, ×1.5, +2...", "×1.5 + 1.5"],
          correct: 1
        }
      ],
      ar: [
        {
          question: "أي نمط يكمل هذا التسلسل منطقياً؟ [صورة: سلسلة من الأنماط الهندسية مع واحد مفقود]",
          options: ["النمط A", "النمط B", "النمط C", "النمط D"],
          correct: 2
        },
        {
          question: "إذا كان ABCD يرتبط بـ EFGH كما IJKL يرتبط بـ ؟",
          options: ["MNOP", "PMNO", "MNPO", "NMOP"],
          correct: 0
        },
        {
          question: "ما هي العلاقة بين عناصر هذه السلسلة: 1→3، 2→6، 3→9، 4→12 ؟",
          options: ["الضرب في 3", "إضافة 2", "التربيع + 1", "الضرب في 2 + 1"],
          correct: 0
        },
        {
          question: "إذا كان ○ ⊕ △ = □ و △ ⊕ □ = ○، فإن ○ ⊕ □ = ؟",
          options: ["○", "△", "□", "⊕"],
          correct: 1
        },
        {
          question: "في تدوين معين، 2*3 = 10، 3*4 = 14، 4*5 = 18. ما قيمة 5*6 ؟",
          options: ["20", "22", "24", "30"],
          correct: 1
        },
        {
          question: "أي عنصر لا يتناسب مع الآخرين: مكعب، كرة، مخروط، مثلث؟",
          options: ["مكعب", "كرة", "مخروط", "مثلث"],
          correct: 3
        },
        {
          question: "إذا كان اليوم هو الأربعاء، فما هو اليوم بعد 100 يوم؟",
          options: ["الإثنين", "الثلاثاء", "الأربعاء", "الخميس"],
          correct: 2
        },
        {
          question: "ما هو التسلسل المنطقي لهذه التحولات؟ A→B→C→؟",
          options: ["A", "B", "C", "D"],
          correct: 3
        },
        {
          question: "إذا كان ◊ → ○ و ○ → □، فإن ◊ → ؟",
          options: ["□", "○", "△", "◊"],
          correct: 0
        },
        {
          question: "أي قاعدة تفسر هذه المتتالية: 3، 6، 11، 18، 27، ؟",
          options: ["إضافة 3، ثم 5، ثم 7...", "+3، +5، +7، +9...", "×2، +1، ×1.5، +2...", "×1.5 + 1.5"],
          correct: 1
        }
      ]
    }
  },
  mecanique: {
    title: {
      fr: "Raisonnement mécanique",
      ar: "التفكير الميكانيكي"
    },
    timeLimit: 300, // 5 minutes
    questions: {
      fr: [
        {
          question: "Si la roue A tourne dans le sens horaire, dans quel sens tourne la roue B qui est en contact direct avec A ?",
          options: ["Sens horaire", "Sens antihoraire", "Alternativement", "Ne tourne pas"],
          correct: 1
        },
        {
          question: "Lequel de ces leviers offre le plus grand avantage mécanique ?",
          options: ["Point d'appui au milieu", "Point d'appui près de la charge", "Point d'appui près de la force", "Tous sont équivalents"],
          correct: 2
        },
        {
          question: "Si un objet se déplace à vitesse constante, quelle est la somme des forces agissant sur lui ?",
          options: ["Positive", "Négative", "Zéro", "Variable"],
          correct: 2
        },
        {
          question: "Dans un système de poulies, si on tire la corde de 10 cm, de combien se déplace la charge avec 2 poulies mobiles ?",
          options: ["5 cm", "10 cm", "20 cm", "40 cm"],
          correct: 0
        },
        {
          question: "Quel objet a le plus d'inertie ?",
          options: ["Une balle de tennis", "Une boule de bowling", "Une plume", "Une feuille de papier"],
          correct: 1
        },
        {
          question: "Si deux engrenages de tailles différentes sont connectés, lequel tourne plus vite ?",
          options: ["Le plus grand", "Le plus petit", "Les deux à la même vitesse", "Ça dépend de la direction"],
          correct: 1
        },
        {
          question: "Quelle machine simple est utilisée dans une vis ?",
          options: ["Levier", "Plan incliné", "Poulie", "Roue"],
          correct: 1
        },
        {
          question: "Comment change la pression quand on double la force sur la même surface ?",
          options: ["Elle double", "Elle reste identique", "Elle diminue de moitié", "Elle quadruple"],
          correct: 0
        },
        {
          question: "Si un pendule oscille plus rapidement, qu'est-ce qui a pu changer ?",
          options: ["La masse a augmenté", "La longueur a augmenté", "La longueur a diminué", "L'amplitude a augmenté"],
          correct: 2
        },
        {
          question: "Quelle propriété permet à un objet de flotter dans l'eau ?",
          options: ["Sa masse", "Sa densité", "Son volume", "Sa forme"],
          correct: 1
        }
      ],
      ar: [
        {
          question: "إذا كانت العجلة A تدور في اتجاه عقارب الساعة، في أي اتجاه تدور العجلة B المتصلة مباشرة بـ A؟",
          options: ["اتجاه عقارب الساعة", "عكس اتجاه عقارب الساعة", "بالتناوب", "لا تدور"],
          correct: 1
        },
        {
          question: "أي من هذه الروافع يوفر أكبر ميزة ميكانيكية؟",
          options: ["نقطة الارتكاز في المنتصف", "نقطة الارتكاز قريبة من الحمل", "نقطة الارتكاز قريبة من القوة", "كلها متكافئة"],
          correct: 2
        },
        {
          question: "إذا كان جسم يتحرك بسرعة ثابتة، فما مجموع القوى المؤثرة عليه؟",
          options: ["موجب", "سالب", "صفر", "متغير"],
          correct: 2
        },
        {
          question: "في نظام البكرات، إذا سحبنا الحبل 10 سم، كم يتحرك الحمل مع بكرتين متحركتين؟",
          options: ["5 سم", "10 سم", "20 سم", "40 سم"],
          correct: 0
        },
        {
          question: "أي جسم لديه أكبر قصور ذاتي؟",
          options: ["كرة تنس", "كرة بولينج", "ريشة", "ورقة"],
          correct: 1
        },
        {
          question: "إذا كان هناك ترسان بحجمين مختلفين متصلان، أيهما يدور أسرع؟",
          options: ["الأكبر", "الأصغر", "كلاهما بنفس السرعة", "يعتمد على الاتجاه"],
          correct: 1
        },
        {
          question: "أي آلة بسيطة تُستخدم في البرغي؟",
          options: ["الرافعة", "المستوى المائل", "البكرة", "العجلة"],
          correct: 1
        },
        {
          question: "كيف يتغير الضغط عندما تتضاعف القوة على نفس المساحة؟",
          options: ["يتضاعف", "يبقى كما هو", "ينخفض إلى النصف", "يتضاعف أربع مرات"],
          correct: 0
        },
        {
          question: "إذا كان البندول يتذبذب بشكل أسرع، ما الذي قد يكون تغير؟",
          options: ["زادت الكتلة", "زاد الطول", "قل الطول", "زادت السعة"],
          correct: 2
        },
        {
          question: "أي خاصية تسمح لجسم بالطفو في الماء؟",
          options: ["كتلته", "كثافته", "حجمه", "شكله"],
          correct: 1
        }
      ]
    }
  },
  critique: {
    title: {
      fr: "Pensée critique",
      ar: "التفكير النقدي"
    },
    timeLimit: 540, // 9 minutes
    questions: {
      fr: [
        {
          question: "Quel énoncé est un fait plutôt qu'une opinion ?",
          options: [
            "La musique classique est plus belle que le jazz",
            "Paris est la capitale de la France",
            "Les chiens sont de meilleurs animaux de compagnie que les chats",
            "Les mathématiques sont plus importantes que l'art"
          ],
          correct: 1
        },
        {
          question: "Quel est l'argument fallacieux dans ce raisonnement : 'Il pleut aujourd'hui, donc le changement climatique est réel' ?",
          options: [
            "Généralisation excessive",
            "Fausse causalité",
            "Attaque personnelle",
            "Faux dilemme"
          ],
          correct: 1
        },
        {
          question: "Si toutes les licornes ont une corne et que Spirale a une corne, alors :",
          options: [
            "Spirale est certainement une licorne",
            "Spirale n'est pas une licorne",
            "On ne peut pas déterminer si Spirale est une licorne",
            "Les licornes existent"
          ],
          correct: 2
        },
        {
          question: "Quelle affirmation est la plus objective ?",
          options: [
            "Ce livre est le meilleur jamais écrit",
            "Ce livre a reçu cinq prix littéraires",
            "Ce livre est fascinant à lire",
            "Ce livre est plus intéressant que les films"
          ],
          correct: 1
        },
        {
          question: "Quel énoncé est une déduction valide des prémisses 'Tous les mammifères allaitent leurs petits' et 'Les baleines allaitent leurs petits' ?",
          options: [
            "Tous les animaux sont des mammifères",
            "Les baleines sont des mammifères",
            "Seuls les mammifères allaitent leurs petits",
            "Les humains sont des mammifères"
          ],
          correct: 1
        },
        {
          question: "Quelle est la meilleure source pour une information scientifique fiable ?",
          options: [
            "Un article de blog personnel",
            "Une étude publiée dans une revue à comité de lecture",
            "Un message sur les réseaux sociaux",
            "Un témoignage personnel"
          ],
          correct: 1
        },
        {
          question: "Identifiez le biais dans cette affirmation : 'Le médicament a fonctionné pour moi, donc il fonctionnera pour tout le monde.'",
          options: [
            "Biais de confirmation",
            "Biais d'autorité",
            "Biais d'échantillonnage",
            "Biais de disponibilité"
          ],
          correct: 2
        },
        {
          question: "Dans une expérience scientifique, quel est le rôle du groupe de contrôle ?",
          options: [
            "Fournir un groupe avec lequel comparer les résultats",
            "Assurer que l'expérience est menée correctement",
            "Surveiller les chercheurs",
            "Répéter l'expérience plusieurs fois"
          ],
          correct: 0
        },
        {
          question: "Quelle conclusion peut-on tirer si A implique B, et B est vrai ?",
          options: [
            "A est nécessairement vrai",
            "A est nécessairement faux",
            "On ne peut rien conclure sur A",
            "A est probablement vrai"
          ],
          correct: 2
        },
        {
          question: "Si un traitement médical montre une amélioration chez 40% des patients comparé à 35% dans le groupe placebo, quelle est l'interprétation la plus raisonnable ?",
          options: [
            "Le traitement est très efficace",
            "Le traitement a un effet modeste",
            "Le traitement est totalement inefficace",
            "Le placebo est presque aussi efficace que le traitement"
          ],
          correct: 1
        }
      ],
      ar: [
        {
          question: "أي عبارة تعد حقيقة وليست رأياً؟",
          options: [
            "الموسيقى الكلاسيكية أجمل من الجاز",
            "باريس هي عاصمة فرنسا",
            "الكلاب حيوانات أليفة أفضل من القطط",
            "الرياضيات أكثر أهمية من الفن"
          ],
          correct: 1
        },
        {
          question: "ما هي المغالطة في هذا الاستدلال: 'تمطر اليوم، إذن تغير المناخ حقيقي'؟",
          options: [
            "تعميم مفرط",
            "سببية خاطئة",
            "هجوم شخصي",
            "معضلة زائفة"
          ],
          correct: 1
        },
        {
          question: "إذا كانت جميع وحيدات القرن لديها قرن وسبيرال لديه قرن، إذن:",
          options: [
            "سبيرال بالتأكيد وحيد قرن",
            "سبيرال ليس وحيد قرن",
            "لا يمكن تحديد ما إذا كان سبيرال وحيد قرن",
            "وحيدات القرن موجودة"
          ],
          correct: 2
        },
        {
          question: "أي عبارة هي الأكثر موضوعية؟",
          options: [
            "هذا الكتاب هو الأفضل على الإطلاق",
            "هذا الكتاب حصل على خمس جوائز أدبية",
            "هذا الكتاب رائع للقراءة",
            "هذا الكتاب أكثر إثارة للاهتمام من الأفلام"
          ],
          correct: 1
        },
        {
          question: "أي عبارة تعد استنتاجاً صحيحاً من المقدمات 'جميع الثدييات ترضع صغارها' و'الحيتان ترضع صغارها'؟",
          options: [
            "جميع الحيوانات هي ثدييات",
            "الحيتان هي ثدييات",
            "الثدييات فقط ترضع صغارها",
            "البشر هم ثدييات"
          ],
          correct: 1
        },
        {
          question: "ما هو أفضل مصدر للحصول على معلومات علمية موثوقة؟",
          options: [
            "مقال في مدونة شخصية",
            "دراسة منشورة في مجلة محكمة",
            "رسالة على وسائل التواصل الاجتماعي",
            "شهادة شخصية"
          ],
          correct: 1
        },
        {
          question: "حدد التحيز في هذه العبارة: 'الدواء عمل معي، لذا سيعمل مع الجميع.'",
          options: [
            "تحيز التأكيد",
            "تحيز السلطة",
            "تحيز العينة",
            "تحيز التوافر"
          ],
          correct: 2
        },
        {
          question: "في تجربة علمية، ما هو دور المجموعة الضابطة؟",
          options: [
            "توفير مجموعة للمقارنة معها",
            "ضمان إجراء التجربة بشكل صحيح",
            "مراقبة الباحثين",
            "تكرار التجربة عدة مرات"
          ],
          correct: 0
        },
        {
          question: "أي استنتاج يمكن استخلاصه إذا كان A يستلزم B، و B صحيح؟",
          options: [
            "A صحيح بالضرورة",
            "A خاطئ بالضرورة",
            "لا يمكن استنتاج شيء عن A",
            "A صحيح على الأرجح"
          ],
          correct: 2
        },
        {
          question: "إذا أظهر علاج طبي تحسناً لدى 40% من المرضى مقارنة بـ 35% في مجموعة الدواء الوهمي، فما هو التفسير الأكثر معقولية؟",
          options: [
            "العلاج فعال جداً",
            "العلاج له تأثير متواضع",
            "العلاج غير فعال تماماً",
            "الدواء الوهمي فعال تقريباً مثل العلاج"
          ],
          correct: 1
        }
      ]
    }
  },

  culture: {
    title: {
      fr: "Culture générale",
      ar: "الثقافة العامة"
    },
    timeLimit: 420, // 7 minutes
    questions: {
      fr: [
        {
          question: "Quelle est la capitale du Japon ?",
          options: ["Pékin", "Séoul", "Tokyo", "Bangkok"],
          correct: 2
        },
        {
          question: "Qui a peint 'La Joconde' ?",
          options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
          correct: 2
        },
        {
          question: "Quel est l'élément chimique le plus abondant dans l'univers ?",
          options: ["Oxygène", "Hydrogène", "Carbone", "Fer"],
          correct: 1
        },
        {
          question: "En quelle année la Première Guerre mondiale a-t-elle commencé ?",
          options: ["1905", "1914", "1918", "1939"],
          correct: 1
        },
        {
          question: "Quelle planète est connue comme 'la planète rouge' ?",
          options: ["Mars", "Vénus", "Jupiter", "Saturne"],
          correct: 0
        },
        {
          question: "Qui a écrit 'Les Misérables' ?",
          options: ["Albert Camus", "Victor Hugo", "Émile Zola", "Gustave Flaubert"],
          correct: 1
        },
        {
          question: "Quel est le plus grand océan du monde ?",
          options: ["Océan Atlantique", "Océan Indien", "Océan Arctique", "Océan Pacifique"],
          correct: 3
        },
        {
          question: "Quel est le pays le plus peuplé du monde ?",
          options: ["Inde", "États-Unis", "Chine", "Indonésie"],
          correct: 2
        },
        {
          question: "Qui a découvert la pénicilline ?",
          options: ["Louis Pasteur", "Marie Curie", "Alexander Fleming", "Albert Einstein"],
          correct: 2
        },
        {
          question: "Quelle est la plus haute montagne du monde ?",
          options: ["K2", "Mont Blanc", "Kilimandjaro", "Mont Everest"],
          correct: 3
        }
      ],
      ar: [
        {
          question: "ما هي عاصمة اليابان؟",
          options: ["بكين", "سيول", "طوكيو", "بانكوك"],
          correct: 2
        },
        {
          question: "من رسم لوحة 'الموناليزا'؟",
          options: ["فينسنت فان غوخ", "بابلو بيكاسو", "ليوناردو دا فينشي", "كلود مونيه"],
          correct: 2
        },
        {
          question: "ما هو العنصر الكيميائي الأكثر وفرة في الكون؟",
          options: ["الأكسجين", "الهيدروجين", "الكربون", "الحديد"],
          correct: 1
        },
        {
          question: "في أي عام بدأت الحرب العالمية الأولى؟",
          options: ["1905", "1914", "1918", "1939"],
          correct: 1
        },
        {
          question: "أي كوكب يُعرف باسم 'الكوكب الأحمر'؟",
          options: ["المريخ", "الزهرة", "المشتري", "زحل"],
          correct: 0
        },
        {
          question: "من كتب رواية 'البؤساء'؟",
          options: ["ألبير كامو", "فيكتور هوغو", "إميل زولا", "غوستاف فلوبير"],
          correct: 1
        },
        {
          question: "ما هو أكبر محيط في العالم؟",
          options: ["المحيط الأطلسي", "المحيط الهندي", "المحيط المتجمد الشمالي", "المحيط الهادئ"],
          correct: 3
        },
        {
          question: "ما هي الدولة الأكثر سكاناً في العالم؟",
          options: ["الهند", "الولايات المتحدة", "الصين", "إندونيسيا"],
          correct: 2
        },
        {
          question: "من اكتشف البنسلين؟",
          options: ["لويس باستور", "ماري كوري", "ألكسندر فلمنج", "ألبرت أينشتاين"],
          correct: 2
        },
        {
          question: "ما هو أعلى جبل في العالم؟",
          options: ["K2", "مون بلان", "كليمنجارو", "جبل إفرست"],
          correct: 3
        }
      ]
    }
  },
  etudes: {
    title: {
      fr: "Connaissance des études supérieures",
      ar: "معرفة التعليم العالي"
    },
    timeLimit: 480, // 8 minutes
    questions: {
      fr: [
        {
          question: "Quel diplôme est requis pour exercer la médecine au Maroc ?",
          options: ["Licence", "Master", "Doctorat", "DUT"],
          correct: 2
        },
        {
          question: "Que signifie le sigle 'CPGE' ?",
          options: [
            "Centre de Préparation à la Gestion d'Entreprise",
            "Classes Préparatoires aux Grandes Écoles",
            "Certificat de Préparation aux Grades de l'État",
            "Centre Polytechnique de Génie Électrique"
          ],
          correct: 1
        },
        {
          question: "Quelle est la durée normale d'études pour obtenir une licence au Maroc ?",
          options: ["2 ans", "3 ans", "4 ans", "5 ans"],
          correct: 1
        },
        {
          question: "Quel concours permet d'intégrer les écoles d'ingénieurs après les classes préparatoires ?",
          options: ["Concours National Commun (CNC)", "TAGE MAGE", "DELF", "CAPES"],
          correct: 0
        },
        {
          question: "Quelle filière d'études est généralement recommandée pour devenir architecte ?",
          options: [
            "École Nationale des Sciences Appliquées",
            "École Nationale d'Architecture",
            "Faculté des Sciences Juridiques",
            "École de Commerce"
          ],
          correct: 1
        },
        {
          question: "Que signifie le sigle 'ENCG' ?",
          options: [
            "École Normale de Commerce et de Gestion",
            "École Nationale de Commerce et de Gestion",
            "Établissement National des Cours de Gestion",
            "École Numérique de Comptabilité Générale"
          ],
          correct: 1
        },
        {
          question: "Quel baccalauréat est le plus adapté pour poursuivre des études en informatique ?",
          options: ["Bac Littéraire", "Bac Sciences Économiques", "Bac Sciences Mathématiques", "Bac Arts Appliqués"],
          correct: 2
        },
        {
          question: "Combien d'années d'études après le baccalauréat faut-il pour devenir avocat au Maroc ?",
          options: ["3 ans", "5 ans", "7 ans", "9 ans"],
          correct: 2
        },
        {
          question: "Quelle institution forme les enseignants du primaire et du secondaire au Maroc ?",
          options: [
            "Les Centres Régionaux des Métiers de l'Éducation et de la Formation (CRMEF)",
            "Les Écoles Normales Supérieures (ENS)",
            "Les deux réponses précédentes",
            "Aucune des réponses précédentes"
          ],
          correct: 2
        },
        {
          question: "Quel diplôme correspond à 'bac+5' ?",
          options: ["Licence", "Master", "Doctorat", "BTS"],
          correct: 1
        }
      ],
      ar: [
        {
          question: "ما هي الشهادة المطلوبة لممارسة الطب في المغرب؟",
          options: ["الإجازة", "الماستر", "الدكتوراه", "الدبلوم الجامعي للتكنولوجيا"],
          correct: 2
        },
        {
          question: "ماذا يعني مختصر 'CPGE'؟",
          options: [
            "مركز التحضير لإدارة الأعمال",
            "الأقسام التحضيرية للمدارس العليا",
            "شهادة التحضير لدرجات الدولة",
            "المركز متعدد التقنيات للهندسة الكهربائية"
          ],
          correct: 1
        },
        {
          question: "ما هي المدة العادية للدراسة للحصول على الإجازة في المغرب؟",
          options: ["سنتان", "3 سنوات", "4 سنوات", "5 سنوات"],
          correct: 1
        },
        {
          question: "أي مباراة تسمح بالالتحاق بمدارس الهندسة بعد الأقسام التحضيرية؟",
          options: ["المباراة الوطنية المشتركة (CNC)", "TAGE MAGE", "DELF", "CAPES"],
          correct: 0
        },
        {
          question: "أي مسار دراسي يوصى به عادة لتصبح مهندسًا معماريًا؟",
          options: [
            "المدرسة الوطنية للعلوم التطبيقية",
            "المدرسة الوطنية للهندسة المعمارية",
            "كلية العلوم القانونية",
            "مدرسة التجارة"
          ],
          correct: 1
        },
        {
          question: "ماذا يعني مختصر 'ENCG'؟",
          options: [
            "المدرسة العادية للتجارة والتسيير",
            "المدرسة الوطنية للتجارة والتسيير",
            "المؤسسة الوطنية لدروس التسيير",
            "المدرسة الرقمية للمحاسبة العامة"
          ],
          correct: 1
        },
        {
          question: "أي بكالوريا هي الأنسب لمتابعة الدراسات في المعلوميات؟",
          options: ["بكالوريا أدبية", "بكالوريا العلوم الاقتصادية", "بكالوريا العلوم الرياضية", "بكالوريا الفنون التطبيقية"],
          correct: 2
        },
        {
          question: "كم عدد سنوات الدراسة بعد البكالوريا للتخرج كمحامي في المغرب؟",
          options: ["3 سنوات", "5 سنوات", "7 سنوات", "9 سنوات"],
          correct: 2
        },
        {
          question: "أي مؤسسة تدرب معلمي المرحلة الابتدائية والثانوية في المغرب؟",
          options: [
            "المراكز الجهوية لمهن التربية والتكوين (CRMEF)",
            "المدارس العليا للأساتذة (ENS)",
            "الإجابتان السابقتان",
            "لا شيء مما سبق"
          ],
          correct: 2
        },
        {
          question: "أي شهادة تقابل 'باك+5'؟",
          options: ["الإجازة", "الماستر", "الدكتوراه", "شهادة التقني العالي"],
          correct: 1
        }
      ]
    }
  }
};

const translations = {
  fr: {
    testTitle: "Test d'aptitudes",
    testSubtitle: "Évaluez vos capacités de raisonnement",
    timeLimited: "Temps limité",
    timerStarts: "Le chronomètre démarrera dès que vous cliquerez sur \"Commencer\"",
    startTest: "Commencer le test",
    previous: "Précédent",
    question: "Question",
    of: "sur",
    thisTestHas: "Ce test comporte",
    questionsToSolve: "questions à résoudre en",
    minutes: "minutes"
  },
  ar: {
    testTitle: "اختبار القدرات",
    testSubtitle: "قيم قدراتك على التفكير",
    timeLimited: "وقت محدود",
    timerStarts: "سيبدأ العد التنازلي بمجرد النقر على \"بدء الاختبار\"",
    startTest: "بدء الاختبار",
    previous: "السابق",
    question: "السؤال",
    of: "من",
    thisTestHas: "يحتوي هذا الاختبار على",
    questionsToSolve: "أسئلة يجب حلها في",
    minutes: "دقائق"
  }
};
const APTITUDE_TEST_KEYS = Object.keys(aptitudeTests);

const AptitudeTest: React.FC<AptitudeTestProps> = ({ onComplete, onPrevious, canGoBack, language = 'fr', sessionData }) => {
  // Ajouter cette ligne avec les autres états
  const [scores, setScores] = useState<Record<string, number>>({});
  const [currentTest, setCurrentTest] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testStarted, setTestStarted] = useState(false);

  // Détails supplémentaires pour le test
  const [detailedResponses, setDetailedResponses] = useState<Record<string, QuestionResponse[]>>({});
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [testStartTimes, setTestStartTimes] = useState<Record<string, number>>({});
  const [sessionStartTime] = useState(Date.now());

  // Nouveaux états pour l'intégration avec le backend
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Récupérer le token d'authentification
  const token = getAuthToken();

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = !!token;

  const testKeys = APTITUDE_TEST_KEYS;
  const currentTestKey = testKeys[currentTest];
  const currentTestData = aptitudeTests[currentTestKey as keyof typeof aptitudeTests];
  const t = translations[language as 'fr' | 'ar'] || translations.fr;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Modifiez la fonction handleAnswer pour séparer la sélection et la validation
  const selectOption = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };


  // Nouvelle fonction pour confirmer la réponse et passer à la question suivante
  const confirmAnswer = () => {
    if (selectedOption === null) return; // Ne rien faire si aucune option n'est sélectionnée

    const questionKey = `${currentTestKey}_${currentQuestion}`;
    const responseTime = Date.now() - questionStartTime;
    const questions = currentTestData.questions[language as 'fr' | 'ar'] || currentTestData.questions.fr;
    const question = questions[currentQuestion];

    // Enregistrer la réponse simple
    setAnswers(prev => ({ ...prev, [questionKey]: selectedOption }));

    // Enregistrer la réponse détaillée
    if (question) {
      const isCorrect = selectedOption === question.correct;
      const questionResponse: QuestionResponse = {
        questionId: questionKey,
        questionText: question.question,
        userAnswer: selectedOption,
        correctAnswer: question.correct,
        isCorrect,
        responseTime,
        timestamp: new Date(),
        testType: currentTestKey,
        questionIndex: currentQuestion,
        selectedOption: question.options[selectedOption] || '',
        correctOption: question.options[question.correct] || ''
      };

      setDetailedResponses(prevResponses => ({
        ...prevResponses,
        [currentTestKey]: [
          ...(prevResponses[currentTestKey] || []),
          questionResponse
        ]
      }));

      console.log(`💡 Aptitude Response Captured:`, {
        test: currentTestKey,
        question: currentQuestion + 1,
        correct: isCorrect ? '✅' : '❌',
        responseTime: `${responseTime}ms`,
        userAnswer: question.options[selectedOption],
        correctAnswer: question.options[question.correct]
      });
    }

    // Passer à la question suivante ou terminer le test
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null); // Réinitialiser l'option sélectionnée
      setQuestionStartTime(Date.now());
    } else {
      handleTestComplete();
    }
  };


  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        // Si des données de session sont fournies directement, les utiliser
        if (sessionData && sessionData.currentStep && sessionData.currentStep.aptitude) {
          console.log("Données d'aptitude trouvées dans la session:", sessionData.currentStep.aptitude);
          const aptitudeData = sessionData.currentStep.aptitude.aptitude || {};

          // Restaurer les réponses si elles existent
          if (aptitudeData.rawAnswers) {
            console.log("Restauration des réponses:", aptitudeData.rawAnswers);
            setAnswers(aptitudeData.rawAnswers);
          }

          // Restaurer les réponses détaillées si elles existent
          if (aptitudeData.detailedResponses) {
            console.log("Restauration des réponses détaillées:", aptitudeData.detailedResponses);
            setDetailedResponses(aptitudeData.detailedResponses);
          }

          // Restaurer les temps de début des tests si disponibles
          if (aptitudeData.testStartTimes) {
            console.log("Restauration des temps de début:", aptitudeData.testStartTimes);
            setTestStartTimes(aptitudeData.testStartTimes);
          }

          // Vérifier si le test est déjà complété
          if (aptitudeData.isCompleted || aptitudeData.completedAt) {
            console.log("Le test d'aptitude est déjà complété, affichage du résumé");

            // Restaurer les scores si disponibles
            if (aptitudeData.scores) {
              setScores(aptitudeData.scores);
            } else if (aptitudeData.testStats) {
              // Ou les recalculer à partir des statistiques
              const tempScores: Record<string, number> = {};
              aptitudeData.testStats.forEach((stat: any) => {
                if (stat.testType && stat.score !== undefined) {
                  tempScores[stat.testType] = stat.score;
                }
              });
              setScores(tempScores);
            }

            // Afficher directement le résumé
            setShowSummary(true);
            setDataLoaded(true);
            setIsLoading(false);
            return;
          }

          // Sinon, vérifier si certains tests sont complétés
          if (aptitudeData.testStats && aptitudeData.testStats.length > 0) {
            // Récupérer les tests déjà complétés
            const completedTests = aptitudeData.testStats.filter(
              (stat: any) => stat.totalQuestions > 0
            );

            // Créer un objet scores provisoire pour l'affichage
            const tempScores: Record<string, number> = {};
            aptitudeData.testStats.forEach((stat: any) => {
              if (stat.testType && stat.score !== undefined) {
                tempScores[stat.testType] = stat.score;
              }
            });
            // Définir les scores dans l'état pour l'affichage
            setScores(tempScores);

            // Vérifier si tous les tests sont complétés
            if (completedTests.length === testKeys.length) {
              // Tous les tests sont complétés, afficher le résumé
              console.log("Tous les tests sont complétés, affichage du résumé");
              setShowSummary(true);
            } else if (completedTests.length > 0) {
              // Certains tests sont complétés, définir le prochain test à faire
              const nextTestIndex = Math.min(completedTests.length, testKeys.length - 1);
              console.log(`Définition du test actuel à ${nextTestIndex} (${testKeys[nextTestIndex]})`);
              setCurrentTest(nextTestIndex);
            }
          }

          setDataLoaded(true);
          setIsLoading(false);
          return;
        }

        // Sinon, récupérer les données depuis l'API
        console.log("Récupération des données d'aptitude depuis l'API");
        const response = await axios.get(`${API_BASE_URL}/orientation-test/my-test`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success && response.data.hasTest) {
          console.log("Données de test récupérées avec succès:", response.data);
          // Extraire les données d'aptitude si elles existent
          const testData = response.data.data;
          if (testData.currentStep && testData.currentStep.aptitude) {
            console.log("Données d'aptitude trouvées dans la réponse API:", testData.currentStep.aptitude);
            const aptitudeData = testData.currentStep.aptitude.aptitude || {};

            // Mêmes traitements que ci-dessus...
            // Restaurer les réponses si elles existent
            if (aptitudeData.rawAnswers) {
              console.log("Restauration des réponses depuis l'API:", aptitudeData.rawAnswers);
              setAnswers(aptitudeData.rawAnswers);
            }

            // Restaurer les réponses détaillées si elles existent
            if (aptitudeData.detailedResponses) {
              console.log("Restauration des réponses détaillées depuis l'API:", aptitudeData.detailedResponses);
              setDetailedResponses(aptitudeData.detailedResponses);
            }

            // Restaurer les temps de début des tests si disponibles
            if (aptitudeData.testStartTimes) {
              console.log("Restauration des temps de début depuis l'API:", aptitudeData.testStartTimes);
              setTestStartTimes(aptitudeData.testStartTimes);
            }

            // Vérifier si le test est déjà complété
            if (aptitudeData.isCompleted || aptitudeData.completedAt) {
              console.log("Le test d'aptitude est déjà complété, affichage du résumé");

              // Restaurer les scores si disponibles
              if (aptitudeData.scores) {
                setScores(aptitudeData.scores);
              } else if (aptitudeData.testStats) {
                const tempScores: Record<string, number> = {};
                aptitudeData.testStats.forEach((stat: any) => {
                  if (stat.testType && stat.score !== undefined) {
                    tempScores[stat.testType] = stat.score;
                  }
                });
                setScores(tempScores);
              }

              // Afficher directement le résumé
              setShowSummary(true);
              setDataLoaded(true);
              setIsLoading(false);
              return;
            }

            // Même logique pour les tests partiellement complétés...
            if (aptitudeData.testStats && aptitudeData.testStats.length > 0) {
              // ... Code similaire à ci-dessus ...
            }

            setDataLoaded(true);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données d'aptitude:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, token, sessionData, language, testKeys]);
  // Timer pour le test
  useEffect(() => {
    if (testStarted && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (testStarted && timeRemaining === 0) {
      handleTestComplete();
    }
  }, [timeRemaining, testStarted]);


  // Fonction pour soumettre les données au backend
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
      console.log("Soumission des données d'aptitude au backend:", completionData);

      // Préparer les données à envoyer
      const aptitudeData = {
        stepName: 'aptitude',
        stepData: {
          aptitude: completionData,
          timestamp: new Date().toISOString()
        },
        stepNumber: 4, // Supposons que c'est la 4ème étape après personality
        duration: completionData.sessionDuration || 0
      };

      // Envoyer les données à l'API
      const response = await axios.post(
        `${API_BASE_URL}/orientation-test/save-step`,
        aptitudeData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        console.log('Test d\'aptitude enregistré avec succès', response.data);

        // Appeler onComplete pour passer à l'étape suivante
        onComplete({
          ...completionData,
          sessionData: response.data
        });
      } else {
        // Gérer le cas où l'API retourne success: false
        setError(response.data.message || (language === 'ar'
          ? 'حدث خطأ أثناء حفظ اختبار القدرات'
          : 'Une erreur est survenue lors de l\'enregistrement du test d\'aptitude'));
      }
    } catch (err) {
      console.error('Erreur lors de la soumission du test d\'aptitude', err);

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
  // Ajouter cette fonction avant le return principal

  // Fonction pour vérifier si un test spécifique a été commencé
  const hasTestBeenStarted = (testKey: string) => {
    // Vérifier si on a des réponses détaillées pour ce test
    if (detailedResponses[testKey]?.length > 0) {
      return true;
    }

    // Vérifier si on a des réponses brutes pour ce test
    const testAnswers = Object.keys(answers).filter(key => key.startsWith(`${testKey}_`));
    if (testAnswers.length > 0) {
      return true;
    }

    // Vérifier si on a un temps de début pour ce test
    if (testStartTimes[testKey]) {
      return true;
    }

    return false;
  };

  // Utiliser cette fonction dans votre logique d'affichage des boutons
  const currentTestStarted = hasTestBeenStarted(currentTestKey);


  const startTest = () => {
    console.log(`Démarrage du test: ${currentTestKey}`);

    // Toujours commencer avec ces paramètres de base
    setTestStarted(true);
    setTimeRemaining(currentTestData.timeLimit);
    setCurrentQuestion(0);
    setQuestionStartTime(Date.now());

    // Enregistrer l'heure de début du test
    setTestStartTimes(prev => ({
      ...prev,
      [currentTestKey]: Date.now()
    }));

    console.log(`🚀 Starting ${currentTestKey} test with ${currentTestData.questions[language as 'fr' | 'ar']?.length || 0} questions`);
  };
  // Fonction pour enregistrer une réponse
  const handleAnswer = (answerIndex: number) => {
    const questionKey = `${currentTestKey}_${currentQuestion}`;
    const responseTime = Date.now() - questionStartTime;
    const questions = currentTestData.questions[language as 'fr' | 'ar'] || currentTestData.questions.fr;
    const question = questions[currentQuestion];

    // Enregistrer la réponse simple
    setAnswers(prev => ({ ...prev, [questionKey]: answerIndex }));

    // Enregistrer la réponse détaillée
    if (question) {
      const isCorrect = answerIndex === question.correct;
      const questionResponse: QuestionResponse = {
        questionId: questionKey,
        questionText: question.question,
        userAnswer: answerIndex,
        correctAnswer: question.correct,
        isCorrect,
        responseTime,
        timestamp: new Date(),
        testType: currentTestKey,
        questionIndex: currentQuestion,
        selectedOption: question.options[answerIndex] || '',
        correctOption: question.options[question.correct] || ''
      };

      setDetailedResponses(prevResponses => ({
        ...prevResponses,
        [currentTestKey]: [
          ...(prevResponses[currentTestKey] || []),
          questionResponse
        ]
      }));

      console.log(`💡 Aptitude Response Captured:`, {
        test: currentTestKey,
        question: currentQuestion + 1,
        correct: isCorrect ? '✅' : '❌',
        responseTime: `${responseTime}ms`,
        userAnswer: question.options[answerIndex],
        correctAnswer: question.options[question.correct]
      });
    }

    // Passer à la question suivante ou terminer le test
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setQuestionStartTime(Date.now());
    } else {
      handleTestComplete();
    }
  };

  // Fonction qui gère la fin d'un test d'aptitude
  const handleTestComplete = () => {
    const testEndTime = Date.now();
    const testStartTime = testStartTimes[currentTestKey] || sessionStartTime;
    const testDuration = testEndTime - testStartTime;

    console.log(`⏱️ ${currentTestKey} test completed in ${Math.round(testDuration / 1000)}s`);

    // Si ce n'est pas le dernier test, passer au suivant
    if (currentTest < testKeys.length - 1) {
      setCurrentTest(currentTest + 1);
      setTestStarted(false);
      setCurrentQuestion(0);
    } else {
      // Si c'est le dernier test, afficher le résumé au lieu d'envoyer directement
      setTestStarted(false);
      setShowSummary(true);
    }
  };

  // Fonction pour calculer et soumettre les données finales
  const handleFinalSubmit = () => {
    console.group('🧮 Aptitude Tests Completion');
    console.log('Calculating comprehensive scores and preparing detailed data...');

    // Calculate detailed scores
    const scores: Record<string, number> = {};
    const rawScores: Record<string, { correct: number; total: number; percentage: number }> = {};
    const testDurations: Record<string, number> = {};

    let totalCorrect = 0;
    let totalQuestions = 0;
    let totalResponseTime = 0;
    let totalResponses = 0;

    testKeys.forEach(testKey => {
      const testData = aptitudeTests[testKey as keyof typeof aptitudeTests];
      const questions = testData.questions[language as 'fr' | 'ar'] || testData.questions.fr;
      const testResponses = detailedResponses[testKey] || [];
      let correct = 0;

      questions.forEach((question, index) => {
        const questionKey = `${testKey}_${index}`;
        if (answers[questionKey] === question.correct) {
          correct++;
        }
      });

      const percentage = Math.round((correct / questions.length) * 100);
      scores[testKey] = percentage;
      rawScores[testKey] = {
        correct,
        total: questions.length,
        percentage
      };

      // Calculer la durée réelle du test
      const testStartTime = testStartTimes[testKey] || sessionStartTime;
      const testEndTime = testResponses.length > 0
        ? Math.max(...testResponses.map(r => {
          return typeof r.timestamp === 'object' && r.timestamp instanceof Date
            ? r.timestamp.getTime()
            : new Date(r.timestamp).getTime();
        }))
        : testStartTime;
      testDurations[testKey] = testEndTime - testStartTime;

      totalCorrect += correct;
      totalQuestions += questions.length;
      totalResponseTime += testResponses.reduce((sum, r) => sum + r.responseTime, 0);
      totalResponses += testResponses.length;

      console.log(`${testKey}: ${correct}/${questions.length} (${percentage}%) - Duration: ${Math.round((testEndTime - testStartTime) / 1000)}s`);
    });

    // Calculate overall score and performance level
    const overallScore = Math.round((totalCorrect / totalQuestions) * 100);
    const avgResponseTime = totalResponses > 0 ? Math.round(totalResponseTime / totalResponses) : 0;

    // Determine performance level
    let performanceLevel = 'faible';
    if (overallScore >= 80) performanceLevel = 'excellent';
    else if (overallScore >= 70) performanceLevel = 'bon';
    else if (overallScore >= 60) performanceLevel = 'moyen';
    else if (overallScore >= 50) performanceLevel = 'acceptable';

    // Find strongest and weakest aptitudes
    const sortedAptitudes = Object.entries(scores).sort(([, a], [, b]) => (b as number) - (a as number));
    const strongestAptitudes = sortedAptitudes.slice(0, Math.ceil(sortedAptitudes.length / 2)).map(([key]) => key);
    const weakestAptitudes = sortedAptitudes.slice(-Math.floor(sortedAptitudes.length / 2)).map(([key]) => key);

    // Préparer les sessions par test
    const sessions = testKeys.map(testKey => {
      const testResponses = detailedResponses[testKey] || [];
      const testStartTime = testStartTimes[testKey] || sessionStartTime;
      const testEndTime = testResponses.length > 0
        ? Math.max(...testResponses.map(r => {
          return typeof r.timestamp === 'object' && r.timestamp instanceof Date
            ? r.timestamp.getTime()
            : new Date(r.timestamp).getTime();
        }))
        : testStartTime;

      return {
        testType: `aptitude_${testKey}`,
        startedAt: new Date(testStartTime),
        completedAt: new Date(testEndTime),
        duration: testEndTime - testStartTime,
        language: language as 'fr' | 'ar',
        totalQuestions: testResponses.length,
        questions: testResponses.map(response => ({
          questionId: response.questionId,
          questionText: response.questionText,
          userAnswer: response.selectedOption,
          correctAnswer: response.correctOption,
          isCorrect: response.isCorrect,
          responseTime: response.responseTime,
          timestamp: typeof response.timestamp === 'string'
            ? response.timestamp
            : response.timestamp.toISOString()
        }))
      };
    });

    // Statistiques détaillées par test
    const testStats = testKeys.map(testKey => {
      const testResponses = detailedResponses[testKey] || [];
      const correctResponses = testResponses.filter(r => r.isCorrect);

      return {
        testType: testKey,
        title: aptitudeTests[testKey as keyof typeof aptitudeTests].title[language as 'fr' | 'ar'] || testKey,
        score: scores[testKey],
        correctAnswers: correctResponses.length,
        totalQuestions: testResponses.length,
        avgResponseTime: testResponses.length > 0
          ? Math.round(testResponses.reduce((sum, r) => sum + r.responseTime, 0) / testResponses.length)
          : 0,
        fastestResponse: testResponses.length > 0 ? Math.min(...testResponses.map(r => r.responseTime)) : 0,
        slowestResponse: testResponses.length > 0 ? Math.max(...testResponses.map(r => r.responseTime)) : 0,
        duration: testDurations[testKey]
      };
    });

    console.log('Final Statistics:', {
      overallScore,
      totalCorrect,
      totalQuestions,
      avgResponseTime,
      performanceLevel,
      strongestAptitudes,
      weakestAptitudes,
      totalDuration: Date.now() - sessionStartTime
    });
    console.groupEnd();

    const completionData = {
      scores,
      rawAnswers: answers,
      detailedScores: rawScores,
      overallScore,
      totalCorrect,
      totalQuestions,
      performanceLevel,
      strongestAptitudes,
      weakestAptitudes,
      testDurations,
      testStartTimes,
      completedAt: new Date(),
      // Nouvelles données détaillées
      sessions,
      detailedResponses,
      avgResponseTime,
      sessionDuration: Date.now() - sessionStartTime,
      testStats,
      // Analyse comportementale
      behavioralAnalysis: {
        quickestTest: testStats.reduce((min, test) =>
          test.totalQuestions > 0 && test.avgResponseTime < min.avgResponseTime ? test : min,
          testStats.find(t => t.totalQuestions > 0) || testStats[0]
        ),
        slowestTest: testStats.reduce((max, test) =>
          test.totalQuestions > 0 && test.avgResponseTime > max.avgResponseTime ? test : max,
          testStats.find(t => t.totalQuestions > 0) || testStats[0]
        ),
        mostAccurate: testStats.reduce((max, test) =>
          test.totalQuestions > 0 && test.score > max.score ? test : max,
          testStats.find(t => t.totalQuestions > 0) || testStats[0]
        ),
        leastAccurate: testStats.reduce((min, test) =>
          test.totalQuestions > 0 && test.score < min.score ? test : min,
          testStats.find(t => t.totalQuestions > 0) || testStats[0]
        )
      }
    };

    // Soumettre les données au backend
    submitTestData(completionData);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };


  // Si le chargement est en cours, afficher un indicateur
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2Icon className="w-12 h-12 text-yellow-600 animate-spin" />
        <p className="text-gray-600">
          {language === 'ar'
            ? 'جاري تحميل اختبار القدرات...'
            : 'Chargement du test d\'aptitude...'}
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


  if (!testStarted) {
    return (
      <div className={`space-y-6 text-center ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t.testTitle}</h2>
          <p className="text-gray-600">{t.testSubtitle}</p>
        </div>


        {dataLoaded && currentTestStarted ? (
          <div className="space-y-4">
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <h4 className="font-medium text-indigo-700 mb-2">
                {language === 'ar' ? 'لديك بالفعل اختبار قيد التقدم' : 'Vous avez déjà un test en cours'}
              </h4>
              <p className="text-sm text-indigo-600 mb-4">
                {language === 'ar'
                  ? 'يمكنك استئناف الاختبار أو الانتقال إلى الاختبار التالي غير المكتمل.'
                  : 'Vous pouvez reprendre le test ou passer au prochain test non complété.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                {/* Bouton reprendre - Modifié pour trouver le prochain test non complété */}
                <button
                  onClick={() => {
                    console.log("Recherche du prochain test non complété");

                    // Trouver le premier test non complété
                    let nextTestIndex = currentTest;

                    // Parcourir tous les tests pour trouver le premier non complété
                    for (let i = 0; i < testKeys.length; i++) {
                      const testKey = testKeys[i];
                      const testData = aptitudeTests[testKey as keyof typeof aptitudeTests];
                      const questions = testData.questions[language as 'fr' | 'ar'] || testData.questions.fr;
                      const testResponses = detailedResponses[testKey] || [];

                      // Vérifier si ce test est incomplet (moins de réponses que de questions)
                      if (testResponses.length < questions.length) {
                        nextTestIndex = i;
                        break;
                      }
                    }

                    // Si tous les tests sont complétés, aller au résumé
                    if (nextTestIndex === testKeys.length) {
                      setShowSummary(true);
                    } else {
                      // Sinon, aller au prochain test non complété
                      setCurrentTest(nextTestIndex);
                      startTest();
                    }
                  }}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all"
                >
                  {language === 'ar' ? 'استئناف الاختبار' : 'Reprendre le test'}
                </button>
              </div>
            </div>
          </div>
        ) : ('')}

        {/* Progress Statistics */}
        {Object.keys(detailedResponses).length > 0 && (
          <div className="bg-orange-50 rounded-lg p-3 mb-4">
            <div className={`text-sm text-orange-700 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {language === 'ar'
                ? `إجمالي الأسئلة المجابة: ${Object.values(detailedResponses).flat().length}`
                : `Total questions répondues: ${Object.values(detailedResponses).flat().length}`
              }
              {Object.values(detailedResponses).flat().length > 0 && (
                <>
                  <span className="ml-4">
                    {language === 'ar'
                      ? `الإجابات الصحيحة: ${Object.values(detailedResponses).flat().filter(r => r.isCorrect).length}`
                      : `Bonnes réponses: ${Object.values(detailedResponses).flat().filter(r => r.isCorrect).length}`
                    }
                  </span>
                  <span className="ml-4">
                    {language === 'ar'
                      ? `متوسط الوقت: ${Math.round(Object.values(detailedResponses).flat().reduce((sum, r) => sum + r.responseTime, 0) / Object.values(detailedResponses).flat().length / 1000)}ث`
                      : `Temps moyen: ${Math.round(Object.values(detailedResponses).flat().reduce((sum, r) => sum + r.responseTime, 0) / Object.values(detailedResponses).flat().length / 1000)}s`
                    }
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Test Progress Overview */}
        {currentTest > 0 && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h4 className={`font-semibold text-blue-900 mb-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {language === 'ar' ? 'التقدم المحرز' : 'Progression'}
            </h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              {testKeys.slice(0, currentTest).map((testKey) => {
                const testResponses = detailedResponses[testKey] || [];
                const correct = testResponses.filter(r => r.isCorrect).length;
                const total = testResponses.length;
                const score = total > 0 ? Math.round((correct / total) * 100) : (scores[testKey] || 0);
                const testData = aptitudeTests[testKey as keyof typeof aptitudeTests];

                return (
                  <div key={testKey} className="bg-white rounded-lg p-3 border border-blue-200">
                    <h5 className="font-medium text-gray-700 mb-1">
                      {testData.title[language as 'fr' | 'ar'] || testData.title.fr}
                    </h5>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {total}/{(testData.questions[language as 'fr' | 'ar'] || testData.questions.fr).length}
                      </span>
                      <span className={`font-bold ${score >= 70 ? 'text-green-600' :
                        score >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {score}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {currentTestData.title[language as 'fr' | 'ar'] || currentTestData.title.fr} ({currentTest + 1}/{testKeys.length})
          </h3>

          {/* Test Info */}
          <div className="bg-white rounded-lg p-4 mb-4 border border-orange-200">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className={`text-center ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <div className="font-semibold text-gray-900">
                  {language === 'ar' ? 'عدد الأسئلة' : 'Questions'}
                </div>
                <div className="text-orange-600 font-bold">
                  {(currentTestData.questions[language as 'fr' | 'ar'] || currentTestData.questions.fr).length}
                </div>
              </div>
              <div className={`text-center ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <div className="font-semibold text-gray-900">
                  {language === 'ar' ? 'الوقت المحدد' : 'Temps alloué'}
                </div>
                <div className="text-orange-600 font-bold">
                  {Math.floor(currentTestData.timeLimit / 60)} {t.minutes}
                </div>
              </div>
              <div className={`text-center ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <div className="font-semibold text-gray-900">
                  {language === 'ar' ? 'النوع' : 'Type'}
                </div>
                <div className="text-orange-600 font-bold">
                  {language === 'ar' ? 'اختيار متعدد' : 'QCM'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-100 border border-amber-300 rounded-lg p-4 mb-6">
            <div className={`flex items-center justify-center space-x-2 text-amber-700 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
              <ClockIcon className="w-5 h-5" />
              <span className="font-medium">{t.timeLimited} : {formatTime(currentTestData.timeLimit)}</span>
            </div>
            <p className="text-sm text-amber-600 mt-2">
              {t.timerStarts}
            </p>
          </div>

          <button
            onClick={startTest}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all"
          >
            {t.startTest}
          </button>
        </div>

        {/* Global Progress */}
        {currentTest > 0 && (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className={`text-sm text-gray-600 mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {language === 'ar' ? 'التقدم الإجمالي' : 'Progression globale'}: {currentTest}/{testKeys.length} tests complétés
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentTest / testKeys.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Modifier le bouton de navigation pour afficher l'état de chargement */}
        {currentTest > 0 && (
          <div className={`flex ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
            <button
              onClick={onPrevious}
              disabled={isSubmitting}
              className={`inline-flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                } ${language === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}
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
          </div>
        )}
      </div>
    );
  }


  // Si nous devons afficher le résumé des tests
  if (showSummary) {
    // Calculs pour le résumé
    const scores: Record<string, number> = {};
    const correctAnswers: Record<string, number> = {};
    const totalQuestionsByTest: Record<string, number> = {};

    testKeys.forEach(testKey => {
      const testData = aptitudeTests[testKey as keyof typeof aptitudeTests];
      const questions = testData.questions[language as 'fr' | 'ar'] || testData.questions.fr;
      const testResponses = detailedResponses[testKey] || [];
      let correct = 0;

      questions.forEach((question, index) => {
        const questionKey = `${testKey}_${index}`;
        if (answers[questionKey] === question.correct) {
          correct++;
        }
      });

      const percentage = Math.round((correct / questions.length) * 100);
      scores[testKey] = percentage;
      correctAnswers[testKey] = correct;
      totalQuestionsByTest[testKey] = questions.length;
    });

    // Calcul du score global
    let totalCorrect = Object.values(correctAnswers).reduce((sum, val) => sum + val, 0);
    let totalQuestions = Object.values(totalQuestionsByTest).reduce((sum, val) => sum + val, 0);
    const overallScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    return (
      <div className={`space-y-8 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {language === 'ar' ? 'ملخص اختبارات القدرات' : 'Résumé des tests d\'aptitude'}
          </h2>
          <p className="text-gray-600">
            {language === 'ar'
              ? 'لقد أكملت جميع اختبارات القدرات. راجع نتائجك أدناه.'
              : 'Vous avez terminé tous les tests d\'aptitude. Consultez vos résultats ci-dessous.'}
          </p>
        </div>

        {/* Résumé global */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className={`text-xl font-semibold text-blue-900 mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {language === 'ar' ? 'النتيجة الإجمالية' : 'Résultat global'}
          </h3>
          <div className="flex justify-center items-center mb-4">
            <div className="w-32 h-32 rounded-full bg-white border-4 border-blue-500 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-blue-600">{overallScore}%</span>
              <span className="text-sm text-gray-500">
                {totalCorrect}/{totalQuestions}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">
              {language === 'ar' ? 'نتائج التفصيلية' : 'Résultats détaillés'}
            </h4>
            <div className="space-y-3">
              {testKeys.map(testKey => (
                <div key={testKey} className="flex justify-between items-center">
                  <span className="font-medium">
                    {aptitudeTests[testKey as keyof typeof aptitudeTests].title[language as 'fr' | 'ar'] ||
                      aptitudeTests[testKey as keyof typeof aptitudeTests].title.fr}
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      {correctAnswers[testKey]}/{totalQuestionsByTest[testKey]}
                    </span>
                    <span className={`font-bold ${scores[testKey] >= 70 ? 'text-green-600' :
                      scores[testKey] >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                      {scores[testKey]}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Statistiques détaillées */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className={`text-xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {language === 'ar' ? 'إحصائيات إضافية' : 'Statistiques supplémentaires'}
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h5 className="font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الوقت المستغرق' : 'Temps de réponse moyen'}
              </h5>
              <p className="text-xl font-bold text-indigo-600">
                {Math.round(Object.values(detailedResponses).flat().reduce(
                  (sum, r) => sum + r.responseTime, 0) /
                  Math.max(1, Object.values(detailedResponses).flat().length) / 1000
                )}s
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h5 className="font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'أفضل اختبار' : 'Meilleur test'}
              </h5>
              <p className="text-xl font-bold text-green-600">
                {Object.entries(scores).sort(([, a], [, b]) => b - a)[0]?.[0] ?
                  aptitudeTests[Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0] as keyof typeof aptitudeTests]
                    .title[language as 'fr' | 'ar'] ||
                  aptitudeTests[Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0] as keyof typeof aptitudeTests]
                    .title.fr
                  : '-'}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h5 className="font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'اختبار للتحسين' : 'Test à améliorer'}
              </h5>
              <p className="text-xl font-bold text-amber-600">
                {(() => {
                  try {
                    // Si aucun score n'est disponible, afficher un tiret
                    if (Object.keys(scores).length === 0) return '-';

                    // Trier les scores par valeur (croissante)
                    const sortedTests = Object.entries(scores).sort(([, a], [, b]) => a - b);
                    if (sortedTests.length === 0) return '-';

                    // Obtenir la clé du test avec le score le plus bas
                    const lowestTestKey = sortedTests[0][0];

                    // Obtenir le titre du test
                    const testData = aptitudeTests[lowestTestKey as keyof typeof aptitudeTests];
                    if (!testData) return lowestTestKey;

                    return testData.title[language as 'fr' | 'ar'] || testData.title.fr;
                  } catch (error) {
                    console.error('Erreur lors du calcul du test à améliorer:', error);
                    return '-';
                  }
                })()}
              </p>
            </div>
          </div>
        </div>


        {/* Boutons pour refaire les tests */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mt-6">
          <h3 className={`text-xl font-semibold text-gray-900 mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {language === 'ar' ? 'إعادة الاختبارات' : 'Refaire les tests'}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                // Réinitialiser le test actuel seulement
                setShowSummary(false);
                setDetailedResponses(prevResponses => {
                  const newResponses = { ...prevResponses };
                  // Supprimer toutes les réponses pour tous les tests
                  testKeys.forEach(key => {
                    delete newResponses[key];
                  });
                  return newResponses;
                });
                setAnswers({});
                setTestStartTimes({});
                setCurrentTest(0);
                setCurrentQuestion(0);
              }}
              className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-all text-center"
            >
              <span className="font-medium text-orange-700">
                {language === 'ar' ? 'إعادة بدء كل الاختبارات' : 'Recommencer tous les tests'}
              </span>
              <p className="text-sm text-orange-600 mt-1">
                {language === 'ar' ? 'سيؤدي هذا إلى مسح جميع إجاباتك وإعادة بدء الاختبار من البداية' : 'Cela effacera toutes vos réponses et recommencera tous les tests depuis le début'}
              </p>
            </button>

            <button
              onClick={() => {
                // Trouver le test le moins bien réussi pour le refaire
                const worstTestEntry = Object.entries(scores).sort(([, a], [, b]) => a - b)[0];
                if (worstTestEntry) {
                  const worstTestKey = worstTestEntry[0];
                  const worstTestIndex = testKeys.indexOf(worstTestKey);

                  if (worstTestIndex >= 0) {
                    // Réinitialiser uniquement ce test
                    setShowSummary(false);
                    setDetailedResponses(prevResponses => {
                      const newResponses = { ...prevResponses };
                      delete newResponses[worstTestKey];
                      return newResponses;
                    });

                    // Supprimer les réponses de ce test
                    const newAnswers = { ...answers };
                    Object.keys(newAnswers).forEach(key => {
                      if (key.startsWith(`${worstTestKey}_`)) {
                        delete newAnswers[key];
                      }
                    });
                    setAnswers(newAnswers);

                    // Réinitialiser le temps de début pour ce test
                    const newTestStartTimes = { ...testStartTimes };
                    delete newTestStartTimes[worstTestKey];
                    setTestStartTimes(newTestStartTimes);

                    // Passer à ce test
                    setCurrentTest(worstTestIndex);
                  }
                }
              }}
              className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all text-center"
            >
              <span className="font-medium text-blue-700">
                {language === 'ar' ? 'إعادة الاختبار الأقل أداءً' : 'Refaire le test le moins réussi'}
              </span>
              <p className="text-sm text-blue-600 mt-1">
                {language === 'ar'
                  ? `الاختبار الأقل أداءً: ${Object.entries(scores).length > 0
                    ? aptitudeTests[Object.entries(scores).sort(([, a], [, b]) => a - b)[0][0] as keyof typeof aptitudeTests].title[language as 'fr' | 'ar']
                    : '-'}`
                  : `Test le moins réussi: ${Object.entries(scores).length > 0
                    ? aptitudeTests[Object.entries(scores).sort(([, a], [, b]) => a - b)[0][0] as keyof typeof aptitudeTests].title[language as 'fr' | 'ar']
                    : '-'}`
                }
              </p>
            </button>
          </div>
        </div>

        {/* Boutons de navigation */}
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
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className={`inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              } ${language === 'ar' ? 'flex-row-reverse' : ''}`}
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="w-4 h-4 animate-spin" />
                <span>{language === 'ar' ? 'جار التحميل...' : 'Chargement...'}</span>
              </>
            ) : language === 'ar' ? (
              <>
                <ArrowLeftIcon className="w-4 h-4" />
                <span>إنهاء الاختبار</span>
              </>
            ) : (
              <>
                <span>Terminer le test</span>
                <ArrowRightIcon className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  const questions = currentTestData.questions[language as 'fr' | 'ar'] || currentTestData.questions.fr;
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className={`space-y-6 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className={`flex justify-between items-center mb-2 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm font-medium text-gray-700">
            {currentTestData.title[language as 'fr' | 'ar'] || currentTestData.title.fr} - {t.question} {currentQuestion + 1}/{questions.length}
          </span>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${timeRemaining > 30 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            } ${language === 'ar' ? 'space-x-reverse' : ''}`}>
            <ClockIcon className="w-4 h-4" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>



      <div className="bg-gray-50 rounded-xl p-8">
        <h3 className={`text-lg font-semibold text-gray-900 mb-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          {question.question}
        </h3>


        {/* Bouton pour tout préremplir */}
        <button
          type="button"
          className="mb-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition"
          onClick={() => {
            // Préremplir toutes les réponses de ce test avec la bonne réponse
            const newAnswers: Record<string, number> = { ...answers };
            const questionsList = currentTestData.questions[language as 'fr' | 'ar'] || currentTestData.questions.fr;
            questionsList.forEach((q, idx) => {
              const questionKey = `${currentTestKey}_${idx}`;
              newAnswers[questionKey] = q.correct;

              // Enregistrer aussi dans detailedResponses
              const questionResponse: QuestionResponse = {
                questionId: questionKey,
                questionText: q.question,
                userAnswer: q.correct,
                correctAnswer: q.correct,
                isCorrect: true,
                responseTime: 1000,
                timestamp: new Date(),
                testType: currentTestKey,
                questionIndex: idx,
                selectedOption: q.options[q.correct],
                correctOption: q.options[q.correct]
              };
              setDetailedResponses(prevResponses => ({
                ...prevResponses,
                [currentTestKey]: [
                  ...(prevResponses[currentTestKey]?.filter(r => r.questionIndex !== idx) || []),
                  questionResponse
                ].sort((a, b) => a.questionIndex - b.questionIndex)
              }));
            });
            setAnswers(newAnswers);
            // Aller à la fin du test
            setCurrentQuestion(questionsList.length - 1);
          }}
        >
          {language === 'ar' ? "تعبئة جميع الإجابات الصحيحة" : "Tout préremplir (bonnes réponses)"}
        </button>


        <div className="grid gap-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => selectOption(index)}
              className={`p-4 border-2 ${selectedOption === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                } rounded-lg transition-all text-gray-800 font-medium ${language === 'ar' ? 'text-right' : 'text-left'
                }`}
            >
              <span className={`inline-flex items-center justify-center w-8 h-8 ${selectedOption === index
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
                } rounded-full font-semibold ${language === 'ar' ? 'ml-3' : 'mr-3'
                }`}>
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          ))}

          <div className="mt-6 flex justify-end">
            <button
              onClick={confirmAnswer}
              disabled={selectedOption === null}
              className={`px-6 py-3 rounded-lg font-medium ${selectedOption === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-all`}
            >
              {language === 'ar' ? 'التالي' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AptitudeTest;