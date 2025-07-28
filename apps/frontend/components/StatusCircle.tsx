import React from 'react';

interface StatusCircleProps {
  isUp: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusCircle({ isUp, size = 'md' }: StatusCircleProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-full ${
          isUp ? 'bg-green-500' : 'bg-red-500'
        } shadow-sm`}
      />
      <span className={`text-sm font-medium ${
        isUp 
          ? 'text-green-700 dark:text-green-400' 
          : 'text-red-700 dark:text-red-400'
      }`}>
        {isUp ? 'Operational' : 'Down'}
      </span>
    </div>
  );
}