"use client";

import { createContext, useContext, useState, useEffect } from "react";
import API from "@/lib/api";

// Create context
const StatsContext = createContext();

// Provider component
export const StatsProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchAnalytics();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get("/stats");
      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await API.get("/analytics");
      setAnalytics(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StatsContext.Provider
      value={{
        stats,
        analytics,
        loading,
        error,
        fetchStats,
        fetchAnalytics,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => useContext(StatsContext);