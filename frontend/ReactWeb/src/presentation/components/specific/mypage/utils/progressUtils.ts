export const getProgressColor = (progress: number): 'success' | 'warning' | 'error' => {
  if (progress >= 80) return 'success';
  if (progress >= 60) return 'warning';
  return 'error';
};

export const getColorClass = (color: 'green' | 'yellow' | 'red'): string => {
  switch (color) {
    case 'green': return 'bg-green-500';
    case 'yellow': return 'bg-yellow-500';
    case 'red': return 'bg-red-500';
  }
}; 