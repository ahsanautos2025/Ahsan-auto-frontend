"use client";

import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DeleteCarDialog({
  isOpen,
  setIsOpen,
  currentCar,
  deleteCar,
  refreshCars,
}) {
  const handleDeleteCar = async () => {
    try {
      const response = await deleteCar(currentCar._id);
      if (response.success) {
        setIsOpen(false);
        refreshCars();
      } else {
        alert(response.error);
      }
    } catch (err) {
      alert("Failed to delete car");
    }
  };

  if (!currentCar) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {currentCar.name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteCar}>
            Delete Car
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}