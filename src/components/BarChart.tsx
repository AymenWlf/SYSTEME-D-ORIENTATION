import React from 'react';

interface BarChartProps {
  data: Record<string, number>;
  title: string;
  color?: string;
  language?: string;
}

// Traductions des traits de personnalité et niveaux
const personalityTraits = {
  fr: {
    "Ouverture": "Ouverture",
    "Organisation": "Organisation",
    "Sociabilité": "Sociabilité",
    "Gestion du stress": "Gestion du stress",
    "Leadership": "Leadership",
    "Très élevé": "Très élevé",
    "Élevé": "Élevé",
    "Moyen": "Moyen",
    "Faible": "Faible",
    "Très faible": "Très faible",
    "Autonomie": "Autonomie",
    "Persévérance": "Persévérance",
    "Créativité": "Créativité",
    "Adaptabilité": "Adaptabilité"
  },
  ar: {
    "Ouverture": "الانفتاح",
    "Organisation": "التنظيم",
    "Sociabilité": "الاجتماعية",
    "Gestion du stress": "إدارة التوتر",
    "Leadership": "القيادة",
    "Très élevé": "مرتفع جداً",
    "Élevé": "مرتفع",
    "Moyen": "متوسط",
    "Faible": "منخفض",
    "Très faible": "منخفض جداً",
    "Autonomie": "الاستقلالية",
    "Persévérance": "المثابرة",
    "Créativité": "الإبداع",
    "Adaptabilité": "التكيف"
  }
};

// Traductions pour les aptitudes
const aptitudeTraits = {
  fr: {
    "logique": "Logique",
    "verbal": "Verbal",
    "spatial": "Spatial",
    "Numérique": "Numérique",
    "Raisonnement": "Raisonnement",
    "Mémoire": "Mémoire",
    "Très élevé": "Très élevé",
    "Élevé": "Élevé",
    "Moyen": "Moyen",
    "Faible": "Faible",
    "Très faible": "Très faible",
    "numerique": "Numérique",
    "abstrait": "Abstrait",
    "mecanique": "Mécanique",
    "critique": "Pensée critique",
    "culture": "Culture générale",
    "etudes": "Études supérieures"
  },
  ar: {
    "logique": "منطقي",
    "verbal": "لفظي",
    "spatial": "فضائي",
    "Numérique": "عددي",
    "Raisonnement": "استدلالي",
    "Mémoire": "ذاكرة",
    "Très élevé": "مرتفع جداً",
    "Élevé": "مرتفع",
    "Moyen": "متوسط",
    "Faible": "منخفض",
    "Très faible": "منخفض جداً",
    "numerique": "رقمي",
    "abstrait": "مجرد",
    "mecanique": "ميكانيكي",
    "critique": "تفكير نقدي",
    "culture": "ثقافة عامة",
    "etudes": "دراسات عليا"
  }
};

const BarChart: React.FC<BarChartProps> = ({ data, title, color = 'blue', language = 'fr' }) => {
  const maxValue = Math.max(...Object.values(data), 100);
  const isRTL = language === 'ar';

  // Sélectionner le dictionnaire de traduction approprié en fonction de la couleur
  // (qui indique généralement le type de données affichées)
  let translations;
  if (color === 'green') {
    translations = personalityTraits[language as 'fr' | 'ar'] || personalityTraits.fr;
  } else if (color === 'orange') {
    translations = aptitudeTraits[language as 'fr' | 'ar'] || aptitudeTraits.fr;
  } else {
    // Utiliser les traits de personnalité par défaut pour les autres couleurs
    translations = personalityTraits[language as 'fr' | 'ar'] || personalityTraits.fr;
  }

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-500',
          text: 'text-green-600'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500',
          text: 'text-purple-600'
        };
      case 'orange':
        return {
          bg: 'bg-orange-500',
          text: 'text-orange-600'
        };
      default:
        return {
          bg: 'bg-blue-500',
          text: 'text-blue-600'
        };
    }
  };

  const colorClasses = getColorClasses(color);

  const getLevel = (value: number): string => {
    if (value >= 80) return "Très élevé";
    if (value >= 60) return "Élevé";
    if (value >= 40) return "Moyen";
    if (value >= 20) return "Faible";
    return "Très faible";
  };

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center print:text-base print:mb-4">{title}</h3>

      <div className="space-y-4 print:space-y-3">
        {Object.entries(data)
          .sort(([, a], [, b]) => b - a)
          .map(([trait, value]) => {
            const translatedTrait = translations[trait as keyof typeof translations] || trait;
            const level = getLevel(value);
            const translatedLevel = translations[level as keyof typeof translations] || level;

            return (
              <div key={trait} className="bg-gray-50 rounded-lg p-4 print:p-3 print:bg-gray-100">
                <div className={`flex justify-between items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="font-medium text-gray-900 capitalize print:text-sm">{translatedTrait}</span>
                  <span className={`text-sm font-bold ${colorClasses.text} print:text-xs`}>{value}/100</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 print:h-2">
                  <div
                    className={`${colorClasses.bg} h-3 rounded-full transition-all duration-500 print:h-2`}
                    style={{
                      width: `${Math.min((value / maxValue) * 100, 100)}%`,
                      marginLeft: isRTL ? 'auto' : '0',
                      marginRight: isRTL ? '0' : 'auto'
                    }}
                  />
                </div>

                <div className={`mt-2 text-xs text-gray-600 print:text-[10px] print:mt-1 ${isRTL ? 'text-right' : ''}`}>
                  {translatedLevel}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default BarChart;