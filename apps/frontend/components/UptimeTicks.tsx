import React from 'react';

interface UptimeTicksProps {
  uptimeData: boolean[];
}

export default function UptimeTicks({ uptimeData }: UptimeTicksProps) {
  return (
    <div className="flex gap-1 items-center">
      <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
        Last 30 min:
      </span>
      <div className="flex gap-1">
        {uptimeData.map((isUp, index) => (
          <div
            key={index}
            className={`w-3 h-6 rounded-sm ${
              isUp 
                ? 'bg-green-500' 
                : 'bg-red-500'
            }`}
            title={`${isUp ? 'Up' : 'Down'} - ${30 - index * 3} min ago`}
          />
        ))}
      </div>
    </div>
  );
}