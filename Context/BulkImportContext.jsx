"use client";

import { createContext, useContext, useState } from "react";
import API from "@/lib/api";

// Create context
const BulkImportContext = createContext();

// Provider component
export const BulkImportProvider = ({ children }) => {
  const [jobId, setJobId] = useState(null);
  const [preview, setPreview] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Upload Excel file
  const uploadExcel = async (file) => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("excel", file);

      const res = await API.post("/cars/bulk-import/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setJobId(res.data.jobId);
      setPreview(res.data.preview);
      setTotal(res.data.total);
      setStatus("pending");

      return { success: true, jobId: res.data.jobId };
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to upload Excel file";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Confirm import
  const confirmImport = async (jobId) => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.post("/cars/bulk-import/confirm", { jobId });

      setStatus(res.data.status);
      setErrors(res.data.errors || []);
      setJobId(res.data.jobId);

      return { success: true, status: res.data.status, errors: res.data.errors };
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to confirm import";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Get import status
  const getImportStatus = async (jobId) => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get(`/cars/bulk-import/status/${jobId}`);

      setStatus(res.data.status);
      setErrors(res.data.errors || []);
      setJobId(res.data.jobId);

      return { success: true, status: res.data.status, errors: res.data.errors };
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to get import status";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Download template
  const downloadTemplate = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.get("/cars/bulk-import/template", {
        responseType: "blob",
      });

      // Create a download link for the Excel file
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "car-import-template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to download template";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Cancel import
  const cancelImport = async (jobId) => {
    try {
      setLoading(true);
      setError(null);

      await API.delete(`/cars/bulk-import/session/${jobId}`);

      // Reset state
      setJobId(null);
      setPreview([]);
      setTotal(0);
      setStatus(null);
      setErrors([]);

      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to cancel import";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Reset context state
  const resetImport = () => {
    setJobId(null);
    setPreview([]);
    setTotal(0);
    setStatus(null);
    setErrors([]);
    setError(null);
    setLoading(false);
  };

  return (
    <BulkImportContext.Provider
      value={{
        jobId,
        preview,
        total,
        status,
        errors,
        loading,
        error,
        uploadExcel,
        confirmImport,
        getImportStatus,
        downloadTemplate,
        cancelImport,
        resetImport,
      }}
    >
      {children}
    </BulkImportContext.Provider>
  );
};

export const useBulkImport = () => {
  const context = useContext(BulkImportContext);
  if (!context) {
    throw new Error("useBulkImport must be used within a BulkImportProvider");
  }
  return context;
};