"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddCarDialog({
  isOpen,
  setIsOpen,
  createCar,
  uploadImages,
  refreshCars,
  error,
  uploadVideo,
}) {
  const [newCar, setNewCar] = useState({
    name: "",
    price: "",
    year: "2024",
    mileage: "",
    transmission: "Automatic",
    bodyType: "",
    fuelType: "",
    color: "",
    featured: false,
  });
  const [newCarImages, setNewCarImages] = useState([]);
  const [newCarVideo, setNewCarVideo] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;
    setNewCar((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const handleImageUpload = (e) => {
    setNewCarImages(Array.from(e.target.files));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    setNewCarVideo(file);
  };

  const handleAddCar = async () => {
    try {
      const carData = {
        ...newCar,
        price: Number.parseFloat(newCar.price),
        year: Number.parseInt(newCar.year),
        mileage: Number.parseInt(newCar.mileage),
      };
  
      // Step 1: Create the car first
      const response = await createCar(carData);
      if (!response.success) {
        console.error("Car creation failed:", response.error);
        alert(response.error);
        return;
      }
  
      const carId = response.data._id;
      console.log("Car created with ID:", carId);
  
      // Step 2: Upload images
      if (newCarImages.length > 0) {
        console.log("Uploading images for new car:", newCarImages.length);
        const uploadResponse = await uploadImages(carId, newCarImages);
        if (!uploadResponse.success) {
          console.error("Image upload failed:", uploadResponse.error);
          alert(`Car created, but failed to upload images: ${uploadResponse.error}`);
        }
      } else {
        console.log("No images selected for upload");
      }
  
      // Step 3: Upload video
      if (newCarVideo) {
        console.log("Uploading video for new car:", newCarVideo.name);
        const videoResponse = await uploadVideo(newCarVideo, carId);
        if (videoResponse.success) {
          console.log("Video uploaded successfully:", videoResponse.data.url);
          // Optional: attach video URL to the car via update
          await updateCar(carId, { videoUrl: videoResponse.data.url });
        } else {
          console.error("Video upload failed:", videoResponse.error);
          alert(`Video upload failed: ${videoResponse.error}`);
        }
      } else {
        console.log("No video selected for upload");
      }
  
      // Step 4: Reset form
      setIsOpen(false);
      setNewCar({
        name: "",
        price: "",
        year: "",
        mileage: "",
        transmission: "Automatic",
        bodyType: "",
        fuelType: "",
        color: "",
        featured: false,
      });
      setNewCarImages([]);
      setNewCarVideo(null); // <-- reset video
      refreshCars();
    } catch (err) {
      console.error("Add car error:", err);
      alert("Failed to add car");
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Car</DialogTitle>
          <DialogDescription>
            Fill in the details for the new car. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Car Name</Label>
              <Input
                id="name"
                name="name"
                value={newCar.name}
                onChange={handleInputChange}
                placeholder="e.g. Mercedes-Benz S-Class"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (৳)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={newCar.price}
                onChange={handleInputChange}
                placeholder="e.g. 110000"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={newCar.year}
                onChange={handleInputChange}
                placeholder="e.g. 2023"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                value={newCar.mileage}
                onChange={handleInputChange}
                placeholder="e.g. 1500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bodyType">Body Type</Label>
              <Input
                id="bodyType"
                name="bodyType"
                value={newCar.bodyType}
                onChange={handleInputChange}
                placeholder="e.g. Sedan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Input
                id="fuelType"
                name="fuelType"
                value={newCar.fuelType}
                onChange={handleInputChange}
                placeholder="e.g. Hybrid"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                name="color"
                value={newCar.color}
                onChange={handleInputChange}
                placeholder="e.g. Black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Input
                id="transmission"
                name="transmission"
                value={newCar.transmission}
                onChange={handleInputChange}
                placeholder="e.g. Automatic"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-images">Upload Images</Label>
            <input
              id="add-images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#245dc7] file:text-white hover:file:bg-[#1e4da6]"
            />
            {newCarImages.length > 0 && (
              <p className="text-sm text-gray-600">
                {newCarImages.length} image(s) selected
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-video">Upload Video</Label>
            <input
              id="add-video"
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#245dc7] file:text-white hover:file:bg-[#1e4da6]"
            />
            {newCarVideo && (
              <p className="text-sm text-gray-600">
                {newCarVideo.name} selected
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={newCar.featured}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-300 text-[#245dc7] focus:ring-[#245dc7]"
            />
            <Label htmlFor="featured">Featured Car</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddCar}
            className="bg-[#245dc7] hover:bg-[#1e4da6]"
          >
            Save Car
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
