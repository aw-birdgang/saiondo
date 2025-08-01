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
    <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">{content}</p>
  );

  const renderImageContent = () => (
    <div className="space-y-3">
      <img 
        src={content} 
        alt="Message image" 
        className="max-w-xs rounded-lg shadow-md border border-border"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      <p className="text-xs text-text-secondary font-medium">📷 Image</p>
    </div>
  );

  const renderFileContent = () => (
    <div className="flex items-center space-x-3 p-3 bg-secondary rounded-lg border border-border">
      <span className="text-lg">📎</span>
      <span className="text-sm font-semibold text-text">{content}</span>
    </div>
  );

  const renderSystemContent = () => (
    <div className="text-center">
      <span className="text-xs text-text-secondary bg-secondary px-4 py-2 rounded-full font-medium">
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