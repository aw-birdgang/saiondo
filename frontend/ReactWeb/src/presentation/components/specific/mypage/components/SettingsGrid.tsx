import React from 'react';
import SettingsCard from './SettingsCard';
import type { SettingsOption } from './SettingsCard';

interface SettingsGridProps {
  options: SettingsOption[];
  onSettings: () => void;
}

const SettingsGrid: React.FC<SettingsGridProps> = ({ options, onSettings }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {options.map((option) => (
      <SettingsCard
        key={option.id}
        option={option}
        onClick={onSettings}
      />
    ))}
  </div>
);

export default SettingsGrid; 