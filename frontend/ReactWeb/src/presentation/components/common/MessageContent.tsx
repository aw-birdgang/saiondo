import React from 'react';

interface MessageContentProps {
  content: string;
  type?: 'text' | 'image' | 'file' | 'system';
  className?: string;
}

const MessageContent: React.FC<MessageContentProps> = ({
  content,
  type = 'text',
  className = '',
}) => {
  const renderTextContent = () => (
    <p className="text-sm break-words whitespace-pre-wrap">{content}</p>
  );

  const renderImageContent = () => (
    <div className="space-y-2">
      <img 
        src={content} 
        alt="Message image" 
        className="max-w-xs rounded-lg shadow-sm"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      <p className="text-xs text-gray-500">📷 Image</p>
    </div>
  );

  const renderFileContent = () => (
    <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <span className="text-lg">📎</span>
      <span className="text-sm font-medium">{content}</span>
    </div>
  );

  const renderSystemContent = () => (
    <div className="text-center">
      <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
        {content}
      </span>
    </div>
  );

  const contentRenderers = {
    text: renderTextContent,
    image: renderImageContent,
    file: renderFileContent,
    system: renderSystemContent,
  };

  const renderContent = contentRenderers[type] || renderTextContent;

  return (
    <div className={className}>
      {renderContent()}
    </div>
  );
};

export default MessageContent; 