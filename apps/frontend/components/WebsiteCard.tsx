import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Globe, Clock, TrendingUp } from 'lucide-react';
import StatusCircle from './StatusCircle';
import UptimeTicks from './UptimeTicks';

interface ProcessedWebsite {
  id: string;
  name: string;
  url: string;
  status: boolean;
  uptimePercentage: number;
  responseTime: number;
  uptimeData: boolean[];
  lastChecked: string;
}

interface WebsiteCardProps {
  website: ProcessedWebsite;
}

export default function WebsiteCard({ website }: WebsiteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <StatusCircle isUp={website.status} size="lg" />
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {website.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {website.url}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {website.uptimePercentage}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                uptime
              </div>
            </div>
          </div>
          
          <div className="ml-4">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <div className="pt-4 space-y-6">
            {/* Uptime Visualization */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Uptime History
              </h4>
              <UptimeTicks uptimeData={website.uptimeData} />
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Response Time
                  </span>
                </div>
                <div className="mt-1">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {website.responseTime}ms
                  </span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Last Checked
                  </span>
                </div>
                <div className="mt-1">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {website.lastChecked}
                  </span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${
                    website.status ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Current Status
                  </span>
                </div>
                <div className="mt-1">
                  <span className={`text-sm font-medium ${
                    website.status 
                      ? 'text-green-700 dark:text-green-400' 
                      : 'text-red-700 dark:text-red-400'
                  }`}>
                    {website.status ? 'All systems operational' : 'Service unavailable'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}