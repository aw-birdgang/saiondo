import React from 'react';
import { InteractiveCard, Avatar, Text, Badge, StatusIndicator, AssistantStats, ChatAction, ArrowIcon } from '../../common';

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

interface AssistantCardProps {
  assistant: Assistant;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  onClick: (assistant: Assistant) => void;
  className?: string;
}

const AssistantCard: React.FC<AssistantCardProps> = ({
  assistant,
  categoryName,
  categoryIcon,
  onClick,
  className = '',
}) => {


  return (
    <InteractiveCard
      onClick={() => onClick(assistant)}
      hover="both"
      className={className}
    >
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <Avatar
          fallback={assistant.avatar || categoryIcon}
          size="lg"
          variant="gradient"
          className="flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <Text variant="h5" weight="bold">
                {assistant.name}
              </Text>
              <Badge variant="primary" size="sm">
                <span className="mr-1">{categoryIcon}</span>
                {categoryName}
              </Badge>
              {assistant.isActive && (
                <StatusIndicator status="active" size="sm" />
              )}
            </div>

            <AssistantStats
              messageCount={assistant.messageCount}
              lastUsed={assistant.lastUsed}
            />
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-3">
            {assistant.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ChatAction />
            </div>

            <ArrowIcon direction="right" />
          </div>
        </div>
      </div>
    </InteractiveCard>
  );
};

export default AssistantCard; 