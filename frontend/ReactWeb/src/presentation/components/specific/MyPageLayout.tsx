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
    <div className={`min-h-screen bg-bg ${className}`}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
};

export default MyPageLayout; 