"use client";

import { createContext, useContext, useState, useEffect } from "react";
import API from "@/lib/api";
import { toBase64 } from "@/lib/toBase64";

// Create context
const SettingsContext = createContext();

// Provider component
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await API.get("/settings");
      setSettings(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (data) => {
    try {
      setLoading(true);
      const res = await API.put("/settings", data);
      setSettings(res.data);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Failed to update settings",
      };
    } finally {
      setLoading(false);
    }
  };

  const uploadLogo = async (file, alt = "Logo") => {
    try {
      if (!file) {
        return { success: false, error: "No file selected" };
      }

      const base64 = await toBase64(file);

      const res = await API.post("/settings/logo", {
        imageBase64: base64,
        alt,
      });

      setSettings((prev) => ({
        ...prev,
        logo: res.data,
      }));

      return { success: true };
    } catch (err) {
      console.error("Frontend upload error:", err);
      return {
        success: false,
        error: err.response?.data?.error || "Failed to upload logo",
      };
    }
  };

  const deleteLogo = async () => {
    try {
      await API.delete("/settings/logo");
      setSettings((prev) => ({
        ...prev,
        logo: { url: null, alt: "" },
      }));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Failed to delete logo",
      };
    }
  };

  const uploadTeamMemberImage = async (file, teamMemberId, alt = "Team Member Photo") => {
    try {
      if (!file) {
        return { success: false, error: "No file selected" };
      }
      if (!teamMemberId) {
        return { success: false, error: "Team member ID is required" };
      }

      const base64 = await toBase64(file);

      const res = await API.post("/team-member-image", {
        imageBase64: base64,
        teamMemberId,
        alt,
      });

      setSettings((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.map((member) =>
          member._id === teamMemberId ? res.data : member
        ),
      }));

      return { success: true };
    } catch (err) {
      console.error("Frontend team member image upload error:", err);
      return {
        success: false,
        error: err.response?.data?.error || "Failed to upload team member image",
      };
    }
  };

  const deleteTeamMemberImage = async (teamMemberId) => {
    try {
      if (!teamMemberId) {
        return { success: false, error: "Team member ID is required" };
      }

      await API.delete("/team-member-image", {
        data: { teamMemberId },
      });

      setSettings((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.map((member) =>
          member._id === teamMemberId
            ? { ...member, image: "/placeholder.svg?height=400&width=400" }
            : member
        ),
      }));

      return { success: true };
    } catch (err) {
      console.error("Frontend team member image deletion error:", err);
      return {
        success: false,
        error: err.response?.data?.error || "Failed to delete team member image",
      };
    }
  };

  const deleteTeamMember = async (teamMemberId) => {
    try {
      if (!teamMemberId) {
        return { success: false, error: "Team member ID is required" };
      }

      const res = await API.delete("/team-member", {
        data: { teamMemberId },
      });

      setSettings((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.filter((member) => member._id !== teamMemberId),
      }));

      return { success: true };
    } catch (err) {
      console.error("Frontend team member deletion error:", err);
      return {
        success: false,
        error: err.response?.data?.error || "Failed to delete team member",
      };
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        fetchSettings,
        updateSettings,
        uploadLogo,
        deleteLogo,
        uploadTeamMemberImage,
        deleteTeamMemberImage,
        deleteTeamMember,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);