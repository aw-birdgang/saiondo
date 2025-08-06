import React from 'react';
import { cn } from '@/utils/cn';
import type { AssistantGridProps } from '@/presentation/pages/assistant/types/assistantTypes';
import AssistantCard from '@/presentation/components/specific/assistant/AssistantCard';

const AssistantGrid: React.FC<AssistantGridProps> = ({
  assistants,
  onAssistantSelect,
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        'auto-rows-fr'
      )}
    >
      {assistants.map(assistant => (
        <AssistantCard
          key={assistant.id}
          assistant={assistant}
          onSelect={onAssistantSelect}
        />
      ))}
    </div>
  );
};

export default AssistantGrid;
