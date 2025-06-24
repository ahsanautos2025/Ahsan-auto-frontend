"use client";

import React, { createContext, useState, useContext } from "react";
import API from "@/lib/api";
import { toBase64 } from "@/lib/toBase64";

export const CarContext = createContext();

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [featuredCars, setFeaturedCars] = useState([]);
  const [currentCar, setCurrentCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const handleError = (err) => {
    const message = err.response?.data?.error || "An unexpected error occurred";
    setError(message);
    console.error("Car API error:", err);
    return message;
  };

  const getCars = async ({
    page = 1,
    limit = 10,
    sort = "createdAt",
    filters = {},
  } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/cars", {
        params: { page, limit, sort, ...filters },
      });
      setCars(response.data.cars);
      setPagination({
        page: response.data.page,
        pages: response.data.pages,
        total: response.data.total,
      });
      return { success: true, data: response.data };
    } catch (err) {
      const message = handleError(err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const getFeaturedCars = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/cars/featured");
      setFeaturedCars(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const message = handleError(err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const getCarById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/cars/${id}`);
      setCurrentCar(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const message = handleError(err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const createCar = async (carData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post("/cars", carData);
      setCars((prev) => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      const message = handleError(err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateCar = async (id, carData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.put(`/cars/${id}`, carData);
      setCars((prev) =>
        prev.map((car) => (car._id === id ? response.data : car))
      );
      if (currentCar?._id === id) setCurrentCar(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const message = handleError(err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await API.delete(`/cars/${id}`);
      setCars((prev) => prev.filter((car) => car._id !== id));
      if (currentCar?._id === id) setCurrentCar(null);
      return { success: true };
    } catch (err) {
      const message = handleError(err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (carId, files) => {
    setLoading(true);
    setError(null);
    try {
      const base64Images = await Promise.all(
        files.map(async (file) => {
          const dataUrl = await toBase64(file);
          const base64 = dataUrl.split(",")[1];
          return base64;
        })
      );
  
      const response = await API.post(`/cars/${carId}/images`, {
        images: base64Images,
      });
  
      if (currentCar?._id === carId) {
        setCurrentCar((prev) => ({
          ...prev,
          images: response.data.images,
        }));
      }
  
      return { success: true, data: response.data.images };
    } catch (err) {
      const message = handleError(err);
      console.error("Upload images error:", err.response?.data || err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateImage = async (carId, imageId, imageData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        alt: imageData.alt,
        isPrimary: imageData.isPrimary,
      };
      console.log(
        "Updating image for carId:",
        carId,
        "imageId:",
        imageId,
        "payload:",
        payload
      );
      const response = await API.put(
        `/cars/${carId}/images/${imageId}`,
        payload
      );
      if (currentCar?._id === carId) {
        setCurrentCar((prev) => ({
          ...prev,
          images: prev.images.map((img) =>
            img._id === imageId ? response.data : img
          ),
        }));
      }
      return { success: true, data: response.data };
    } catch (err) {
      const message = handleError(err);
      console.error("Update image error:", err.response?.data || err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (carId, imageId) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Deleting image for carId:", carId, "imageId:", imageId);
      await API.delete(`/cars/${carId}/images/${imageId}`);
      if (currentCar?._id === carId) {
        setCurrentCar((prev) => ({
          ...prev,
          images: prev.images.filter((img) => img._id !== imageId),
        }));
      }
      return { success: true };
    } catch (err) {
      const message = handleError(err);
      console.error("Delete image error:", err.response?.data || err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cars,
    featuredCars,
    currentCar,
    loading,
    error,
    pagination,
    getCars,
    getFeaturedCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar,
    uploadImages,
    updateImage,
    deleteImage,
    clearError: () => setError(null),
  };

  return <CarContext.Provider value={value}>{children}</CarContext.Provider>;
};

export const useCars = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error("useCars must be used within a CarProvider");
  }
  return context;
};
