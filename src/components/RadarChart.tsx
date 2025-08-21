import React from 'react';

interface RadarChartProps {
  data: Record<string, number>;
  title: string;
  language?: string;
  translations?: Record<string, string>;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, title, language = 'fr', translations = {} }) => {
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 120;
  const categories = Object.keys(data);
  const values = Object.values(data);
  const maxValue = Math.max(...values, 100);

  // Calculate points for each category
  const points = categories.map((category, index) => {
    const angle = (index * 2 * Math.PI) / categories.length - Math.PI / 2;
    const value = data[category] || 0;
    const radius = (value / maxValue) * maxRadius;
    // Utiliser la traduction si disponible, sinon utiliser la catégorie originale
    const translatedCategory = translations[category] || category;

    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      labelX: centerX + Math.cos(angle) * (maxRadius + 30),
      labelY: centerY + Math.sin(angle) * (maxRadius + 30),
      category,
      translatedCategory,
      value,
      angle
    };
  });

  // Create path for the polygon
  const pathData = points.map((point, index) =>
    `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`
  ).join(' ') + ' Z';

  return (
    <div className="w-full">
      <h3 className={`text-lg font-semibold text-gray-900 mb-4 text-center print:text-base print:mb-2 ${language === 'ar' ? 'rtl' : ''}`}>{title}</h3>

      <svg width="300" height="300" className="mx-auto print:w-64 print:h-64">
        {/* Grid circles */}
        {[20, 40, 60, 80, 100].map(percentage => (
          <circle
            key={percentage}
            cx={centerX}
            cy={centerY}
            r={(percentage / 100) * maxRadius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Grid lines */}
        {categories.map((_, index) => {
          const angle = (index * 2 * Math.PI) / categories.length - Math.PI / 2;
          const endX = centerX + Math.cos(angle) * maxRadius;
          const endY = centerY + Math.sin(angle) * maxRadius;

          return (
            <line
              key={index}
              x1={centerX}
              y1={centerY}
              x2={endX}
              y2={endY}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <path
          d={pathData}
          fill="rgba(59, 130, 246, 0.3)"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#3b82f6"
            stroke="white"
            strokeWidth="2"
          />
        ))}

        {/* Labels - with translations */}
        {points.map((point, index) => (
          <text
            key={index}
            x={point.labelX}
            y={point.labelY}
            textAnchor="middle"
            dominantBaseline="central"
            className={`text-xs font-medium fill-gray-700 print:text-[10px] ${language === 'ar' ? 'font-arabic' : ''}`}
          >
            {point.translatedCategory}
          </text>
        ))}

        {/* Values */}
        {points.map((point, index) => (
          <text
            key={`value-${index}`}
            x={point.labelX}
            y={point.labelY + 12}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-xs font-bold fill-blue-600 print:text-[9px]"
          >
            {point.value}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default RadarChart;