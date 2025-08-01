import React from "react";
import { AssistantCard } from "./assistant";

interface Assistant {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  category: string;
  isActive: boolean;
  lastUsed?: Date;
  messageCount: number;
}

interface AssistantGridProps {
  assistants: Assistant[];
  onAssistantSelect: (assistant: Assistant) => void;
  className?: string;
}

const AssistantGrid: React.FC<AssistantGridProps> = ({ 
  assistants, 
  onAssistantSelect, 
  className = "" 
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'relationship': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400';
      case 'emotion': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'communication': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'conflict': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'planning': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'relationship': return '💕';
      case 'emotion': return '😊';
      case 'communication': return '💬';
      case 'conflict': return '🤝';
      case 'planning': return '🎯';
      default: return '🤖';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'relationship': return '관계';
      case 'emotion': return '감정';
      case 'communication': return '소통';
      case 'conflict': return '갈등';
      case 'planning': return '계획';
      default: return '기타';
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {assistants.map((assistant) => (
        <AssistantCard
          key={assistant.id}
          assistant={assistant}
          categoryName={getCategoryName(assistant.category)}
          categoryColor={getCategoryColor(assistant.category)}
          categoryIcon={getCategoryIcon(assistant.category)}
          onClick={onAssistantSelect}
        />
      ))}
    </div>
  );
};

export default AssistantGrid; 