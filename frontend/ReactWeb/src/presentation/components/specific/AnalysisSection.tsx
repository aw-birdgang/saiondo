import React from 'react';

interface AnalysisSectionProps {
  title: string;
  children: React.ReactNode;
}

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({ title, children }) => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {title}
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {children}
      </div>
    </section>
  );
}; 