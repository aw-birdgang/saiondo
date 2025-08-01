import React from "react";

interface MyPageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MyPageLayout: React.FC<MyPageLayoutProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
};

export default MyPageLayout; 