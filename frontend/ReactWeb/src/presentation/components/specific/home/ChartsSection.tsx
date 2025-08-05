import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../common';
import { BarChart, LineChart } from '../../common/InteractiveChart';
import { cn } from '../../../../utils/cn';

interface ChartData {
  x: string;
  y: number;
  label?: string;
  color?: string;
}

interface ChartsSectionProps {
  lineChartData: ChartData[];
  barChartData: ChartData[];
  onChartPointClick?: (point: any, index: number) => void;
  className?: string;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({
  lineChartData,
  barChartData,
  onChartPointClick,
  className,
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in',
        className
      )}
      style={{ animationDelay: '0.6s' }}
    >
      {/* Line Chart Card */}
      <Card
        variant='elevated'
        hover='glow'
        className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg'
      >
        <CardHeader
          withDivider
          className='border-gray-200 dark:border-gray-700'
        >
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center'>
              <svg
                className='w-5 h-5 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z'
                />
              </svg>
            </div>
            <div>
              <CardTitle size='lg' className='text-gray-900 dark:text-white'>
                월별 성과
              </CardTitle>
              <CardDescription className='text-gray-600 dark:text-gray-400'>
                최근 6개월간의 성과 추이
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='relative'>
            <LineChart
              data={lineChartData}
              width={400}
              height={200}
              onPointClick={onChartPointClick}
              animate
            />
            {/* Chart Overlay Info */}
            <div className='absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-700'>
              <div className='text-xs text-gray-500 dark:text-gray-400'>
                총 성과
              </div>
              <div className='text-lg font-bold text-gray-900 dark:text-white'>
                {lineChartData
                  .reduce((sum, item) => sum + item.y, 0)
                  .toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart Card */}
      <Card
        variant='elevated'
        hover='glow'
        className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg'
      >
        <CardHeader
          withDivider
          className='border-gray-200 dark:border-gray-700'
        >
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center'>
              <svg
                className='w-5 h-5 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
            </div>
            <div>
              <CardTitle size='lg' className='text-gray-900 dark:text-white'>
                기능별 사용률
              </CardTitle>
              <CardDescription className='text-gray-600 dark:text-gray-400'>
                주요 기능들의 사용 통계
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='relative'>
            <BarChart
              data={barChartData}
              width={400}
              height={200}
              onPointClick={onChartPointClick}
              animate
            />
            {/* Chart Overlay Info */}
            <div className='absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-700'>
              <div className='text-xs text-gray-500 dark:text-gray-400'>
                평균 사용률
              </div>
              <div className='text-lg font-bold text-gray-900 dark:text-white'>
                {Math.round(
                  barChartData.reduce((sum, item) => sum + item.y, 0) /
                    barChartData.length
                )}
                %
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className='grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                {Math.max(...barChartData.map(item => item.y))}%
              </div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>
                최고 사용률
              </div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                {barChartData.length}
              </div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>
                활성 기능
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;
