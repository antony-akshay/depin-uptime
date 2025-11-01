"use client";

import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useWebsites } from "../hooks/useWebsites"; // still separate
// API_BACKEND_URL inline
const API_BACKEND_URL = "postgresql://akshay:jaya@localhost:5432/noah";

/* --------------------- useDarkMode Hook --------------------- */
import { useEffect } from "react";
function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("darkMode");
      if (stored) {
        return JSON.parse(stored);
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return [darkMode, setDarkMode] as const;
}

/* --------------------- StatusCircle --------------------- */
function StatusCircle({
  status,
  size = "md",
}: {
  status: "good" | "bad" | "unknown";
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  const statusConfig = {
    good: {
      color: "bg-green-500",
      label: "Operational",
      text: "text-green-700 dark:text-green-400",
    },
    bad: {
      color: "bg-red-500",
      label: "Down",
      text: "text-red-700 dark:text-red-400",
    },
    unknown: {
      color: "bg-gray-400",
      label: "Unknown",
      text: "text-gray-700 dark:text-gray-400",
    },
  };

  const { color, label, text } = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} rounded-full ${color} shadow-sm`} />
      <span className={`text-sm font-medium ${text}`}>{label}</span>
    </div>
  );
}

/* --------------------- UptimeTicks --------------------- */
function UptimeTicks({ uptimeData }: { uptimeData: boolean[] }) {
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
              isUp ? "bg-green-500" : "bg-red-500"
            }`}
            title={`${isUp ? "Up" : "Down"} - ${30 - index * 3} min ago`}
          />
        ))}
      </div>
    </div>
  );
}

/* --------------------- Tick Aggregation Utils --------------------- */
function aggregateTicksBy3Minutes(ticks: any[]): boolean[] {
  if (!ticks || ticks.length === 0) {
    return Array(10).fill(false);
  }

  const sortedTicks = [...ticks].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const now = new Date();
  const aggregatedTicks: any[] = [];

  for (let i = 0; i < 10; i++) {
    const windowEnd = new Date(now.getTime() - i * 3 * 60 * 1000);
    const windowStart = new Date(windowEnd.getTime() - 3 * 60 * 1000);

    const windowTicks = sortedTicks.filter((tick) => {
      const tickTime = new Date(tick.createdAt);
      return tickTime >= windowStart && tickTime < windowEnd;
    });

    if (windowTicks.length > 0) {
      const upTicks = windowTicks.filter(
        (tick) =>
          tick.status === "up" ||
          tick.status === "online" ||
          tick.status === "success"
      );
      const isUp = upTicks.length > windowTicks.length / 2;
      aggregatedTicks.push({ isUp });
    } else {
      aggregatedTicks.push({ isUp: false });
    }
  }

  return aggregatedTicks.map((tick) => tick.isUp);
}

function getLatestStatus(ticks: any[]): "good" | "bad" | "unknown" {
  if (!ticks || ticks.length === 0) return "unknown";
  const latestTick = [...ticks].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];
  if (
    latestTick.status === "up" ||
    latestTick.status === "online" ||
    latestTick.status === "success"
  )
    return "good";
  if (
    latestTick.status === "down" ||
    latestTick.status === "offline" ||
    latestTick.status === "failure"
  )
    return "bad";
  return "unknown";
}

/* --------------------- WebsiteCard --------------------- */
function WebsiteCard({
  website,
}: {
  website: { id: string; url: string; ticks: any[] };
}) {
  const uptimeData = aggregateTicksBy3Minutes(website.ticks);
  const status = getLatestStatus(website.ticks);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-2">{website.url}</h2>
      <StatusCircle status={status} />
      <UptimeTicks uptimeData={uptimeData} />
    </div>
  );
}

/* --------------------- Header --------------------- */
function Header({
  onAddClick,
}: {
  onAddClick: () => void;
}) {
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <header className="flex justify-between p-4 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-xl font-bold">Website Monitor</h1>
      <div className="flex gap-2">
        <button onClick={() => setDarkMode(!darkMode)}>🌙</button>
        <button
          onClick={onAddClick}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Add Website
        </button>
      </div>
    </header>
  );
}

/* --------------------- CreateWebsiteModal --------------------- */
function CreateWebsiteModal({
  onClose,
  onWebsiteAdded,
}: {
  onClose: () => void;
  onWebsiteAdded: () => void;
}) {
  const [url, setUrl] = useState("");
  const { getToken } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = await getToken();
    await axios.post(
      `${API_BACKEND_URL}/api/v1/websites`,
      { url },
      { headers: { Authorization: token } }
    );
    onWebsiteAdded();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Add Website</h2>
        <form onSubmit={handleSubmit}>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-2 rounded w-full mb-4"
            placeholder="https://example.com"
          />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded">
              Addz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* --------------------- Main Page --------------------- */
export default function Page() {
  const { websites, refreshWebsites } = useWebsites();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onAddClick={() => setIsModalOpen(true)} />
      <main className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {websites.map((w) => (
          <WebsiteCard key={w.id} website={w} />
        ))}
      </main>
      {isModalOpen && (
        <CreateWebsiteModal
          onClose={() => setIsModalOpen(false)}
          onWebsiteAdded={refreshWebsites}
        />
      )}
    </div>
  );
}
