
import React from 'react';

interface StatDisplayProps {
  label: string;
  value: string | number;
}

const StatDisplay: React.FC<StatDisplayProps> = ({ label, value }) => {
  return (
    <div className="bg-gray-700 p-2 rounded-md">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-semibold text-lg">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </div>
  );
};

export default StatDisplay;
