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
  className = '',
}) => {
  const max = maxValue || Math.max(...data.map(d => d.value));

  const getBarChart = () => (
    <div className='space-y-4'>
      {data.map((item, index) => (
        <div key={index} className='flex items-center gap-4'>
          <div className='w-24 text-sm text-txt-secondary truncate font-medium'>
            {item.label}
          </div>
          <div className='flex-1 bg-secondary rounded-full h-4 overflow-hidden'>
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${
                item.color || 'bg-primary'
              }`}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
          <div className='w-16 text-sm font-semibold text-txt text-right'>
            {item.value}%
          </div>
        </div>
      ))}
    </div>
  );

  const getPieChart = () => (
    <div className='flex justify-center'>
      <div className='relative w-40 h-40'>
        <svg
          className='w-full h-full transform -rotate-90'
          viewBox='0 0 100 100'
        >
          {data.map((item, index) => {
            const percentage = (item.value / max) * 100;
            const circumference = 2 * Math.PI * 45; // radius = 45
            const strokeDasharray = (percentage / 100) * circumference;
            const strokeDashoffset =
              index === 0
                ? 0
                : data
                    .slice(0, index)
                    .reduce(
                      (acc, d) => acc + (d.value / max) * circumference,
                      0
                    );

            return (
              <circle
                key={index}
                cx='50'
                cy='50'
                r='45'
                fill='none'
                stroke={item.color || '#d21e1d'}
                strokeWidth='10'
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className='transition-all duration-700 ease-out'
              />
            );
          })}
        </svg>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='text-center'>
            <div className='text-xl font-bold text-txt'>
              {Math.round(
                data.reduce((acc, item) => acc + item.value, 0) / data.length
              )}
              %
            </div>
            <div className='text-xs text-txt-secondary'>평균</div>
          </div>
        </div>
      </div>
    </div>
  );

  const getRadarChart = () => (
    <div className='flex justify-center'>
      <div className='relative w-56 h-56'>
        <svg className='w-full h-full' viewBox='0 0 100 100'>
          {/* Grid lines */}
          {[20, 40, 60, 80].map(radius => (
            <circle
              key={radius}
              cx='50'
              cy='50'
              r={radius}
              fill='none'
              stroke='#E5E7EB'
              strokeWidth='0.5'
              className='dark:stroke-gray-600'
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
                r='3'
                fill={item.color || '#d21e1d'}
                className='transition-all duration-700 ease-out'
              />
            );
          })}

          {/* Connect points */}
          <polygon
            points={data
              .map((item, index) => {
                const angle = (index / data.length) * 2 * Math.PI - Math.PI / 2;
                const radius = (item.value / max) * 40;
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                return `${x},${y}`;
              })
              .join(' ')}
            fill='rgba(210, 30, 29, 0.1)'
            stroke='#d21e1d'
            strokeWidth='2'
            className='transition-all duration-700 ease-out'
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
    <div className={`card p-6 ${className}`}>
      <h3 className='text-xl font-bold text-txt mb-6'>{title}</h3>
      {renderChart()}

      {/* Legend */}
      {type === 'pie' && (
        <div className='mt-6 grid grid-cols-2 gap-3'>
          {data.map((item, index) => (
            <div key={index} className='flex items-center gap-3 text-sm'>
              <div
                className='w-4 h-4 rounded-full shadow-sm'
                style={{ backgroundColor: item.color || '#d21e1d' }}
              />
              <span className='text-txt-secondary font-medium'>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisChart;
