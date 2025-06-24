"use client";

import React, { createContext, useState, useEffect } from "react";
import API from "@/lib/api"; // axios instance
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await API.get("/auth/verify"); // token sent automatically in cookie
        setUser(response.data.user);
      } catch (error) {
        console.error("Verification error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post("/auth/login", { email, password });
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Logout failed",
      };
    }
  };

  const verifyToken = async () => {
    try {
      const response = await API.get("/auth/verify");
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      console.error("Verification error:", error);
      setUser(null);
      return {
        success: false,
        error: error.response?.data?.error || "Token invalid or expired",
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
