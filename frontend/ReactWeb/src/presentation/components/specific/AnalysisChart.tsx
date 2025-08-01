import React from 'react';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface AnalysisChartProps {
  title: string;
  data: ChartData[];
  type?: 'bar' | 'pie' | 'line' | 'radar';
  maxValue?: number;
  className?: string;
}

const AnalysisChart: React.FC<AnalysisChartProps> = ({
  title,
  data,
  type = 'bar',
  maxValue,
  className = ''
}) => {
  const max = maxValue || Math.max(...data.map(d => d.value));

  const getBarChart = () => (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-20 text-sm text-gray-600 dark:text-gray-400 truncate">
            {item.label}
          </div>
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                item.color || 'bg-blue-500'
              }`}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
          <div className="w-12 text-sm font-medium text-gray-900 dark:text-white text-right">
            {item.value}%
          </div>
        </div>
      ))}
    </div>
  );

  const getPieChart = () => (
    <div className="flex justify-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {data.map((item, index) => {
            const percentage = (item.value / max) * 100;
            const circumference = 2 * Math.PI * 45; // radius = 45
            const strokeDasharray = (percentage / 100) * circumference;
            const strokeDashoffset = index === 0 ? 0 : 
              data.slice(0, index).reduce((acc, d) => acc + (d.value / max) * circumference, 0);
            
            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={item.color || '#3B82F6'}
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {Math.round(data.reduce((acc, item) => acc + item.value, 0) / data.length)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">평균</div>
          </div>
        </div>
      </div>
    </div>
  );

  const getRadarChart = () => (
    <div className="flex justify-center">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Grid lines */}
          {[20, 40, 60, 80].map((radius) => (
            <circle
              key={radius}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="0.5"
              className="dark:stroke-gray-600"
            />
          ))}
          
          {/* Data points */}
          {data.map((item, index) => {
            const angle = (index / data.length) * 2 * Math.PI - Math.PI / 2;
            const radius = (item.value / max) * 40;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={item.color || '#3B82F6'}
                className="transition-all duration-500"
              />
            );
          })}
          
          {/* Connect points */}
          <polygon
            points={data.map((item, index) => {
              const angle = (index / data.length) * 2 * Math.PI - Math.PI / 2;
              const radius = (item.value / max) * 40;
              const x = 50 + radius * Math.cos(angle);
              const y = 50 + radius * Math.sin(angle);
              return `${x},${y}`;
            }).join(' ')}
            fill="rgba(59, 130, 246, 0.1)"
            stroke="#3B82F6"
            strokeWidth="1"
            className="transition-all duration-500"
          />
        </svg>
      </div>
    </div>
  );

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return getPieChart();
      case 'radar':
        return getRadarChart();
      default:
        return getBarChart();
    }
  };

  return (
    <div className={`bg-white dark:bg-dark-secondary-container rounded-lg p-6 shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      {renderChart()}
      
      {/* Legend */}
      {type === 'pie' && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color || '#3B82F6' }}
              />
              <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisChart; 