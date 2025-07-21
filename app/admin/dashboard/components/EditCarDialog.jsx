"use client";

import React, { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Trash } from "lucide-react";
import { toast } from "sonner";

export default function EditCarDialog({
  isOpen,
  setIsOpen,
  currentCar,
  updateCar,
  uploadImages,
  updateImage,
  deleteImage,
  refreshCars,
  error,
  uploadVideo,
  deleteVideo,
}) {
  const normalizeAvailability = (value) => {
    const valid = ["available", "unavailable", "upcoming"];
    return valid.includes(value) ? value : "available";
  };

  const [carData, setCarData] = useState(
    currentCar
      ? {
          ...currentCar,
          price: currentCar.price.toString(),
          year: currentCar.year.toString(),
          mileage: currentCar.mileage.toString(),
          horsepower: currentCar.horsepower?.toString() || "",
          features: currentCar.features?.join(", ") || "",
          package: currentCar.package || "Base",
          expectedDeliveryTime: currentCar.expectedDeliveryTime
            ? new Date(currentCar.expectedDeliveryTime)
                .toISOString()
                .slice(0, 7) // Format YYYY-MM
            : "",
          availability: normalizeAvailability(currentCar.availability),
        }
      : null
  );
  const [imageFiles, setImageFiles] = useState([]);
  const [featuresInput, setFeaturesInput] = useState("");
  const [imageUpdates, setImageUpdates] = useState(
    currentCar?.images?.map((img) => ({
      imageId: img._id,
      alt: img.alt || "",
      isPrimary: img.isPrimary || false,
    })) || []
  );
  const [videoFile, setVideoFile] = useState(null);
  const [existingVideoUrl, setExistingVideoUrl] = useState(
    currentCar?.videoUrl || ""
  );
  const [loading, setLoading] = useState({
    images: false,
    video: false,
  });

  useEffect(() => {
    if (currentCar) {
      setCarData({
        ...currentCar,
        price: currentCar.price?.toString() || "",
        year: currentCar.year?.toString() || "",
        mileage: currentCar.mileage?.toString() || "",
        horsepower: currentCar.horsepower?.toString() || "",
        features: currentCar.features?.join(", ") || "",
        package: currentCar.package || "Base",
        expectedDeliveryTime: currentCar.expectedDeliveryTime
          ? new Date(currentCar.expectedDeliveryTime).toISOString().slice(0, 7)
          : "",
        availability: normalizeAvailability(currentCar.availability),
      });
      setImageUpdates(
        currentCar?.images?.map((img) => ({
          imageId: img._id,
          alt: img.alt || "",
          isPrimary: img.isPrimary || false,
        })) || []
      );
      setFeaturesInput(currentCar.features?.join(", ") || "");
      setExistingVideoUrl(currentCar.videoUrl || "");
    }
  }, [currentCar]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;
    setCarData((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const handleImageUpload = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleImageMetadataChange = (imageId, field, value) => {
  if (field === "isPrimary") {
    // Update the images in carData directly
    setCarData(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        isPrimary: img._id === imageId ? value : false
      }))
    }));
  } else {
    // Handle alt text updates
    setCarData(prev => ({
      ...prev,
      images: prev.images.map(img =>
        img._id === imageId ? { ...img, [field]: value } : img
      )
    }));
  }
};

  const handleDeleteImage = async (imageId) => {
    try {
      console.log("Deleting image:", imageId);
      const response = await deleteImage(carData._id, imageId);
      if (response.success) {
        setCarData((prev) => ({
          ...prev,
          images: prev.images.filter((img) => img._id !== imageId),
        }));
        setImageUpdates((prev) => prev.filter((u) => u.imageId !== imageId));
      } else {
        console.error("Delete image failed:", response.error);
        toast.error(response.error || "Failed to delete image");
      }
    } catch (err) {
      console.error("Delete image error:", err);
      toast.error("Failed to delete image");
    }
  };

  const handleEditCar = async () => {
    try {
      const { _id, images, ...rest } = carData;
      const updatedFeatures = featuresInput
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);

      const updatedCarData = {
        ...rest,
        price: Number.parseFloat(carData.price),
        year: Number.parseInt(carData.year),
        mileage: Number.parseInt(carData.mileage),
        horsepower: carData.horsepower ? Number(carData.horsepower) : 0,
        features: updatedFeatures,
        expectedDeliveryTime: carData.expectedDeliveryTime
          ? new Date(carData.expectedDeliveryTime + "-01")
          : null,
        availability: normalizeAvailability(carData.availability), // <-- Ensure valid value
      };

      const response = await updateCar(_id, updatedCarData);
      if (response.success) {
        if (imageFiles.length > 0) {
          setLoading((prev) => ({ ...prev, images: true }));
          console.log("Uploading new images:", imageFiles.length);
          const uploadResponse = await uploadImages(carData._id, imageFiles);
          setLoading((prev) => ({ ...prev, images: false }));
          if (!uploadResponse.success) {
            console.error("Image upload failed:", uploadResponse.error);
            toast.error(uploadResponse.error || "Failed to upload images");
          }
        }
        for (const update of imageUpdates) {
          const originalImage = carData.images.find(
            (img) => img._id === update.imageId
          );
          if (
            originalImage &&
            (originalImage.alt !== update.alt ||
              originalImage.isPrimary !== update.isPrimary)
          ) {
            console.log("Updating image:", update.imageId);
            const updateResponse = await updateImage(
              carData._id,
              update.imageId,
              {
                alt: update.alt,
                isPrimary: update.isPrimary,
              }
            );
            if (!updateResponse.success) {
              console.error("Image update failed:", updateResponse.error);
              toast.error(updateResponse.error || "Failed to update image");
            }
          }
        }
        if (videoFile) {
          setLoading((prev) => ({ ...prev, video: true }));
          const videoResponse = await uploadVideo(videoFile, _id);
          setLoading((prev) => ({ ...prev, video: false }));
          if (videoResponse.success) {
            console.log("Video uploaded:", videoResponse.data.url);
            await updateCar(_id, { videoUrl: videoResponse.data.url });
          } else {
            console.error("Video upload failed:", videoResponse.error);
            toast.error(videoResponse.error || "Failed to upload video");
          }
        }
        setIsOpen(false);
        setCarData(null);
        setImageFiles([]);
        setImageUpdates([]);
        refreshCars();
      } else {
        console.error("Car update failed:", response.error);
        toast.error(response.error || "Failed to update car");
      }
    } catch (err) {
      console.error("Edit car error:", err);
      toast.error("Failed to update car");
    }
  };

  const handleDeleteVideo = async () => {
    try {
      const res = await deleteVideo(carData._id);
      if (res.success) {
        setCarData((prev) => ({ ...prev, videoUrl: null }));
        toast.success("Video deleted successfully");
      } else {
        toast.error(res.error || "Failed to delete video");
      }
    } catch (err) {
      toast.error("Failed to delete video");
    }
  };

  if (!carData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Car</DialogTitle>
          <DialogDescription>
            Update the details for {carData.name}. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Car Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={carData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price ($)</Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                value={carData.price}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-year">Year</Label>
              <Input
                id="edit-year"
                name="year"
                type="number"
                value={carData.year}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-mileage">Mileage</Label>
              <Input
                id="edit-mileage"
                name="mileage"
                type="number"
                value={carData.mileage}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-bodyType">Body Type</Label>
              <Input
                id="edit-bodyType"
                name="bodyType"
                value={carData.bodyType}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-fuelType">Fuel Type</Label>
              <Input
                id="edit-fuelType"
                name="fuelType"
                value={carData.fuelType}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-color">Color</Label>
              <Input
                id="edit-color"
                name="color"
                value={carData.color}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-transmission">Transmission</Label>
              <Input
                id="edit-transmission"
                name="transmission"
                value={carData.transmission}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-engine">Engine</Label>
              <Input
                id="edit-engine"
                name="engine"
                value={carData.engine || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-horsepower">Horsepower</Label>
              <Input
                id="edit-horsepower"
                name="horsepower"
                type="number"
                value={carData.horsepower || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-package">Package</Label>
              <Select
                id="edit-package"
                name="package"
                value={carData.package}
                onValueChange={(value) =>
                  setCarData((prev) => ({ ...prev, package: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Base">Base</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-expectedDeliveryTime">
                Expected Delivery
              </Label>
              <Input
                id="edit-expectedDeliveryTime"
                name="expectedDeliveryTime"
                type="month"
                value={carData.expectedDeliveryTime}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-availability">Availability</Label>
              <Select
                id="edit-availability"
                name="availability"
                value={carData.availability}
                onValueChange={(value) =>
                  setCarData((prev) => ({ ...prev, availability: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <textarea
              id="edit-description"
              name="description"
              rows={4}
              className="w-full border rounded-md p-2"
              value={carData.description || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-features">Features (comma-separated)</Label>
            <Input
              id="edit-features"
              name="features"
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
            />
          </div>
          {carData.images?.length > 0 && (
            <div className="space-y-2">
              <Label>Existing Images</Label>
              <div className="grid grid-cols-2 gap-4">
                {carData.images.map((image) => (
                  <div key={image._id} className="border rounded-md p-2">
                    <Image
                      src={image.url}
                      width={100}
                      height={100}
                      alt={image.alt || "Car image"}
                      className="w-full h-24 object-cover rounded-md mb-2"
                    />
                    <div className="space-y-2">
                      <Input
                        placeholder="Alt text"
                        value={image.alt || ""}
                        onChange={(e) =>
                          handleImageMetadataChange(image._id, "alt", e.target.value)
                        }
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`primary-${image._id}`}
                          checked={image.isPrimary}
                          onChange={() =>
                            handleImageMetadataChange(image._id, "isPrimary", !image.isPrimary)
                          }
                          className="h-4 w-4 rounded border-gray-300 text-[#245dc7] focus:ring-[#245dc7]"
                        />
                        <Label htmlFor={`primary-${image._id}`}>Primary</Label>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => handleDeleteImage(image._id)}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {carData.videoUrl && (
            <div className="space-y-2">
              <Label>Current Video</Label>
              <video
                src={carData.videoUrl}
                controls
                className="w-full rounded-md"
              />
              <Button
                variant="destructive"
                size="sm"
                className="mt-2"
                onClick={handleDeleteVideo}
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete Video
              </Button>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="edit-images">Upload New Images</Label>
            <div className="relative">
              <input
                id="edit-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#245dc7] file:text-white hover:file:bg-[#1e4da6]"
                disabled={loading.images}
              />
              {loading.images && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 rounded-md">
                  <div className="w-6 h-6 border-2 border-[#245dc7] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            {imageFiles.length > 0 && (
              <p className="text-sm text-gray-600">
                {imageFiles.length} image(s) selected
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-video">Upload/Replace Video</Label>
            <div className="relative">
              <input
                id="edit-video"
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#245dc7] file:text-white hover:file:bg-[#1e4da6]"
                disabled={loading.video}
              />
              {loading.video && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 rounded-md">
                  <div className="w-6 h-6 border-2 border-[#245dc7] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            {videoFile && (
              <p className="text-sm text-gray-600">{videoFile.name} selected</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="edit-featured"
              name="featured"
              checked={carData.featured}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-300 text-[#245dc7] focus:ring-[#245dc7]"
            />
            <Label htmlFor="edit-featured">Featured Car</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={loading.images || loading.video}>
            Cancel
          </Button>
          <Button
            onClick={handleEditCar}
            className="bg-[#245dc7] hover:bg-[#1e4da6]"
            disabled={loading.images || loading.video}
          >
            {loading.images || loading.video ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}