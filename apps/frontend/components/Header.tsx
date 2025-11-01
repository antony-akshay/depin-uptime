import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  onCreateWebsite: () => void;
}

export default function Header({ onCreateWebsite }: HeaderProps) {
  return (
    <header className="border-b border-gray-700 bg-gray-800 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white">
                UptimeGuard
              </h1>
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={onCreateWebsite}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add where
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
