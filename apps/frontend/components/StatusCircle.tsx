import React from 'react';

interface StatusCircleProps {
  status: 'good' | 'bad' | 'unknown';
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusCircle({ status, size = 'md' }: StatusCircleProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const statusConfig = {
    good: { color: 'bg-green-500', label: 'Operational', text: 'text-green-700 dark:text-green-400' },
    bad: { color: 'bg-red-500', label: 'Down', text: 'text-red-700 dark:text-red-400' },
    unknown: { color: 'bg-gray-400', label: 'Unknown', text: 'text-gray-700 dark:text-gray-400' }
  };

  const { color, label, text } = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} rounded-full ${color} shadow-sm`} />
      <span className={`text-sm font-medium ${text}`}>{label}</span>
    </div>
  );
}
