"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import WebsiteCard from "../components/WebsiteCard";
import CreateWebsiteModal from "../components/CreateWebsiteModal";
import { useDarkMode } from "../hooks/useDarkMode";
import { useWebsites } from "../hooks/useWebsites";
import {
  aggregateTicksBy3Minutes,
  calculateUptimePercentage,
  getLatestStatus,
  getAverageResponseTime,
  getLastCheckedTime
} from "../utils/tickAggregation";
import axios from "axios";
import { API_BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";

interface Website {
  id: string;
  url: string;
  ticks: {
    id: string;
    createdAt: string;
    status: string;
    latency: number;
  }[];
}

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

function App() {
  const [darkMode, setDarkMode] = useDarkMode();
  const { websites: rawWebsites, refreshWebsites } = useWebsites();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getToken } = useAuth();

  const handleCreateWebsite = async (data: { url: string }) => {
    try {
      const token = await getToken();
      await axios.post(
        `${API_BACKEND_URL}/api/v1/website`,
        { url: data.url },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refreshWebsites();
    } catch (error: any) {
      console.error("Error creating website:", error.response?.data || error.message);
    }
  };

  const websites: ProcessedWebsite[] = (rawWebsites || []).map((website) => ({
    id: website.id,
    name: new URL(website.url).hostname,
    url: website.url,
    status: getLatestStatus(website.ticks),
    uptimePercentage: calculateUptimePercentage(website.ticks),
    responseTime: getAverageResponseTime(website.ticks),
    uptimeData: aggregateTicksBy3Minutes(website.ticks),
    lastChecked: getLastCheckedTime(website.ticks)
  }));

  const overallStats = {
    totalSites: websites.length,
    operational: websites.filter((w) => w.status).length,
    avgUptime:
      websites.length > 0
        ? Math.round(
          websites.reduce((acc, w) => acc + w.uptimePercentage, 0) /
          websites.length *
          10
        ) / 10
        : 0
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header onCreateWebsite={() => setIsModalOpen(true)} />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Websites
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {overallStats.totalSites}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Operational
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {overallStats.operational}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg Uptime
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {overallStats.avgUptime}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Websites List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Monitored Websites
          </h2>

          {websites.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No websites monitored yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Get started by adding your first website to monitor.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
              >
                Add Your First Website
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {websites.map((website) => (
                <WebsiteCard key={website.id} website={website} />
              ))}
            </div>
          )}
        </div>
      </main>
      {websites.map((website) => (
        <WebsiteCard key={website.id} website={website} />
      ))}

      {/* Modal */}
      <CreateWebsiteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateWebsite}
      />
    </div>
  );
}

export default App;
