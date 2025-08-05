import React, { useState, useRef } from 'react';
import { cn } from '../../../utils/cn';

interface DataPoint {
  x: number | string;
  y: number;
  label?: string;
  color?: string;
}

interface InteractiveChartProps {
  data: DataPoint[];
  type?: 'line' | 'bar' | 'area';
  width?: number;
  height?: number;
  className?: string;
  showGrid?: boolean;
  showLabels?: boolean;
  animate?: boolean;
  onPointClick?: (point: DataPoint, index: number) => void;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  type = 'line',
  width = 400,
  height = 200,
  className,
  showGrid = true,
  showLabels = true,
  animate = true,
  onPointClick,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-surface border border-border rounded-lg',
          className
        )}
        style={{ width, height }}
      >
        <p className='text-txt-secondary'>데이터가 없습니다</p>
      </div>
    );
  }

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxY = Math.max(...data.map(d => d.y));
  const minY = Math.min(...data.map(d => d.y));
  const yRange = maxY - minY;

  const getX = (index: number) =>
    (index / (data.length - 1)) * chartWidth + padding;
  const getY = (value: number) =>
    height - padding - ((value - minY) / yRange) * chartHeight;

  const points = data.map((point, index) => ({
    ...point,
    x: getX(index),
    y: getY(point.y),
    index,
  }));

  const handlePointClick = (index: number) => {
    setSelectedPoint(selectedPoint === index ? null : index);
    onPointClick?.(data[index], index);
  };

  const renderLine = () => {
    if (points.length < 2) return null;

    const pathData = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    return (
      <path
        d={pathData}
        fill='none'
        stroke='var(--color-primary)'
        strokeWidth='2'
        className={cn(animate && 'animate-dash')}
        style={{
          strokeDasharray: animate ? '5,5' : 'none',
          animation: animate ? 'dash 2s linear infinite' : 'none',
        }}
      />
    );
  };

  const renderArea = () => {
    if (points.length < 2) return null;

    const pathData =
      points
        .map(
          (point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
        )
        .join(' ') +
      ` L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return (
      <path
        d={pathData}
        fill='var(--color-primary)'
        fillOpacity='0.1'
        stroke='var(--color-primary)'
        strokeWidth='2'
      />
    );
  };

  const renderBars = () => {
    const barWidth = (chartWidth / data.length) * 0.8;
    // const barSpacing = (chartWidth / data.length) * 0.2;

    return points.map((point, index) => (
      <rect
        key={index}
        x={point.x - barWidth / 2}
        y={point.y}
        width={barWidth}
        height={height - padding - point.y}
        fill={point.color || 'var(--color-primary)'}
        className={cn(
          'transition-all duration-200 cursor-pointer',
          hoveredPoint === index && 'opacity-80',
          selectedPoint === index && 'opacity-60'
        )}
        onMouseEnter={() => setHoveredPoint(index)}
        onMouseLeave={() => setHoveredPoint(null)}
        onClick={() => handlePointClick(index)}
      />
    ));
  };

  const renderPoints = () => {
    return points.map((point, index) => (
      <circle
        key={index}
        cx={point.x}
        cy={point.y}
        r={hoveredPoint === index || selectedPoint === index ? 6 : 4}
        fill={point.color || 'var(--color-primary)'}
        stroke='var(--color-surface)'
        strokeWidth='2'
        className={cn(
          'transition-all duration-200 cursor-pointer',
          hoveredPoint === index && 'scale-125',
          selectedPoint === index && 'scale-150'
        )}
        onMouseEnter={() => setHoveredPoint(index)}
        onMouseLeave={() => setHoveredPoint(null)}
        onClick={() => handlePointClick(index)}
      />
    ));
  };

  const renderGrid = () => {
    if (!showGrid) return null;

    const gridLines = 5;
    const lines = [];

    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (i / gridLines) * chartHeight;
      lines.push(
        <line
          key={`grid-${i}`}
          x1={padding}
          y1={y}
          x2={width - padding}
          y2={y}
          stroke='var(--color-border)'
          strokeWidth='1'
          opacity='0.3'
        />
      );
    }

    return lines;
  };

  const renderLabels = () => {
    if (!showLabels) return null;

    return (
      <>
        {/* Y-axis labels */}
        {Array.from({ length: 6 }, (_, i) => {
          const y = padding + (i / 5) * chartHeight;
          const value = maxY - (i / 5) * yRange;
          return (
            <text
              key={`y-label-${i}`}
              x={padding - 10}
              y={y + 4}
              textAnchor='end'
              fontSize='12'
              fill='var(--color-txt-secondary)'
            >
              {value.toFixed(1)}
            </text>
          );
        })}

        {/* X-axis labels */}
        {points.map((point, index) => (
          <text
            key={`x-label-${index}`}
            x={point.x}
            y={height - 10}
            textAnchor='middle'
            fontSize='12'
            fill='var(--color-txt-secondary)'
          >
            {typeof data[index].x === 'string'
              ? data[index].x
              : data[index].x.toString()}
          </text>
        ))}
      </>
    );
  };

  const renderTooltip = () => {
    if (hoveredPoint === null) return null;

    const point = points[hoveredPoint];
    const dataPoint = data[hoveredPoint];

    return (
      <foreignObject
        x={point.x + 10}
        y={point.y - 40}
        width='120'
        height='60'
        className='pointer-events-none'
      >
        <div className='bg-surface border border-border rounded-lg p-2 shadow-lg'>
          <div className='text-xs font-medium text-txt'>
            {dataPoint.label || `Point ${hoveredPoint + 1}`}
          </div>
          <div className='text-xs text-txt-secondary'>{dataPoint.y}</div>
        </div>
      </foreignObject>
    );
  };

  return (
    <div className={cn('relative', className)}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className='overflow-visible'
      >
        {/* Grid */}
        {renderGrid()}

        {/* Chart content */}
        {type === 'area' && renderArea()}
        {type === 'line' && renderLine()}
        {type === 'bar' && renderBars()}

        {/* Points */}
        {(type === 'line' || type === 'area') && renderPoints()}

        {/* Labels */}
        {renderLabels()}

        {/* Tooltip */}
        {renderTooltip()}
      </svg>
    </div>
  );
};

// Convenience components for different chart types
export const LineChart: React.FC<
  Omit<InteractiveChartProps, 'type'>
> = props => <InteractiveChart {...props} type='line' />;

export const BarChart: React.FC<
  Omit<InteractiveChartProps, 'type'>
> = props => <InteractiveChart {...props} type='bar' />;

export const AreaChart: React.FC<
  Omit<InteractiveChartProps, 'type'>
> = props => <InteractiveChart {...props} type='area' />;

InteractiveChart.displayName = 'InteractiveChart';
