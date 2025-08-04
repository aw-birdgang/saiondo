import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../common';
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
  className
}) => {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in", className)} style={{ animationDelay: '0.6s' }}>
      <Card variant="elevated" hover="glow">
        <CardHeader withDivider>
          <CardTitle size="lg">월별 성과</CardTitle>
          <CardDescription>최근 6개월간의 성과 추이</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            data={lineChartData}
            width={400}
            height={200}
            onPointClick={onChartPointClick}
            animate
          />
        </CardContent>
      </Card>

      <Card variant="elevated" hover="glow">
        <CardHeader withDivider>
          <CardTitle size="lg">기능별 사용률</CardTitle>
          <CardDescription>주요 기능들의 사용 통계</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            data={barChartData}
            width={400}
            height={200}
            onPointClick={onChartPointClick}
            animate
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection; 