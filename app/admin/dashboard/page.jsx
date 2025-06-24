"use client";

import React, { useState, useEffect } from "react";
import { useCars } from "@/Context/CarContext";
import AdminHeader from "../component/AdminHeader";
import DashboardHeader from "./components/DashboardHeader";
import DashboardStats from "./components/DashboardStats";
import CarTable from "./components/CarTable";
import AddCarDialog from "./components/AddCarDialog";
import EditCarDialog from "./components/EditCarDialog";
import DeleteCarDialog from "./components/DeleteCarDialog";
import BulkImportDialog from "./components/BulkImportDialog";


export default function AdminDashboardPage() {
  const {
    cars,
    getCars,
    createCar,
    updateCar,
    deleteCar,
    uploadImages,
    updateImage,
    deleteImage,
    loading,
    error,
    pagination,
  } = useCars();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);

  useEffect(() => {
    getCars({ page: pagination.page, limit: 10, search: searchTerm });
  }, [pagination.page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      getCars({ page: newPage, limit: 10, search: searchTerm });
    }
  };

  const openEditDialog = (car) => {
    setCurrentCar(car);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (car) => {
    setCurrentCar(car);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <main className="flex-1 container mx-auto px-4 py-8">
        <DashboardHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setIsAddDialogOpen={setIsAddDialogOpen}
          setIsImportDialogOpen={setIsImportDialogOpen}
        />
        <DashboardStats cars={cars} pagination={pagination} />
        <CarTable
          cars={cars}
          loading={loading}
          error={error}
          pagination={pagination}
          handlePageChange={handlePageChange}
          openEditDialog={openEditDialog}
          openDeleteDialog={openDeleteDialog}
        />
        <AddCarDialog
          isOpen={isAddDialogOpen}
          setIsOpen={setIsAddDialogOpen}
          createCar={createCar}
          uploadImages={uploadImages}
          refreshCars={() => getCars({ page: 1 })}
          error={error}
        />
        <EditCarDialog
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          currentCar={currentCar}
          updateCar={updateCar}
          uploadImages={uploadImages}
          updateImage={updateImage}
          deleteImage={deleteImage}
          refreshCars={() => getCars({ page: pagination.page })}
          error={error}
        />
        <DeleteCarDialog
          isOpen={isDeleteDialogOpen}
          setIsOpen={setIsDeleteDialogOpen}
          currentCar={currentCar}
          deleteCar={deleteCar}
          refreshCars={() => getCars({ page: pagination.page })}
        />
        <BulkImportDialog
          isOpen={isImportDialogOpen}
          setIsOpen={setIsImportDialogOpen}
          createCar={createCar}
          refreshCars={() => getCars({ page: 1 })}
        />
      </main>
    </>
  );
}