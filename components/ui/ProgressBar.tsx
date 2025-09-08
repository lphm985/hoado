
import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, label, color = 'bg-blue-500' }) => {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-sm font-medium text-gray-400">{value.toLocaleString()} / {max.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-4">
        <div
          className={`${color} h-4 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
