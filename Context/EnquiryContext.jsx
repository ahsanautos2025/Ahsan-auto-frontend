"use client";

import { createContext, useContext, useState, useEffect } from "react";
import API from "@/lib/api";

// Create context
const EnquiryContext = createContext();

// Provider component
export const EnquiryProvider = ({ children }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async (options = { page: 1, limit: 10 }) => {
    try {
      setLoading(true);
      const res = await API.get("/enquiries", { params: options });
      setEnquiries(res.data.enquiries);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  const createEnquiry = async (enquiryData) => {
    try {
      setLoading(true);
      const res = await API.post("/enquiries", enquiryData);
      setEnquiries((prev) => [...prev, res.data]);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create enquiry");
      return { success: false, error: err.response?.data?.error || "Failed to create enquiry" };
    } finally {
      setLoading(false);
    }
  };

  const updateEnquiry = async (enquiryId, updateData) => {
    try {
      setLoading(true);
      const res = await API.put(`/enquiries/${enquiryId}`, updateData);
      setEnquiries((prev) =>
        prev.map((enquiry) => (enquiry._id === enquiryId ? res.data : enquiry))
      );
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update enquiry");
      return { success: false, error: err.response?.data?.error || "Failed to update enquiry" };
    } finally {
      setLoading(false);
    }
  };

  return (
    <EnquiryContext.Provider
      value={{
        enquiries,
        loading,
        error,
        fetchEnquiries,
        createEnquiry,
        updateEnquiry,
      }}
    >
      {children}
    </EnquiryContext.Provider>
  );
};

export const useEnquiry = () => useContext(EnquiryContext);