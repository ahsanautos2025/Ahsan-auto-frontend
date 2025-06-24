"use client";

import React, { useState } from "react";
import { Car, DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEnquiry } from "@/Context/EnquiryContext";

export default function DashboardStats({ cars, pagination }) {
  const { enquiries, fetchEnquiries, loading, error } = useEnquiry();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Group enquiries by carId to count enquiries per car
  const enquiryCounts = enquiries.reduce((acc, enquiry) => {
    acc[enquiry.carId._id] = (acc[enquiry.carId._id] || 0) + 1;
    return acc;
  }, {});

  console.log("Enquiry Counts:", enquiries);

  // Fetch car details for each carId with enquiries
  const carsWithEnquiries = cars.filter((car) =>
    enquiryCounts[car._id] > 0
  );

  const handleUserEnquiriesClick = async () => {
    await fetchEnquiries(); // Refresh enquiries data
    setIsDialogOpen(true);
  };

  const weeklyEnquiries = enquiries.filter((enquiry) => {
    const enquiryDate = new Date(enquiry.createdAt);
    const startOfWeek = new Date("2025-06-17T00:00:00Z"); // Start of week (Monday)
    return enquiryDate >= startOfWeek && enquiryDate <= new Date(); // Up to 01:23 PM IST, June 24, 2025
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pagination.total}</div>
          <p className="text-xs text-muted-foreground">
            {cars.filter((car) => car.featured).length} featured cars
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ৳ {cars.reduce((sum, car) => sum + car.price, 0).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground"> </p>
        </CardContent>
      </Card>
      <Card onClick={handleUserEnquiriesClick} className="cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">User Enquiries</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weeklyEnquiries}</div>
          <p className="text-xs text-muted-foreground">
            {weeklyEnquiries} new enquiries this week
          </p>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Enquiries Details</DialogTitle>
          </DialogHeader>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Car Name</TableHead>
                  <TableHead>Car ID</TableHead>
                  <TableHead>Enquiries</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carsWithEnquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3}>No enquiries found</TableCell>
                  </TableRow>
                ) : (
                  carsWithEnquiries.map((car) => (
                    <TableRow key={car._id}>
                      <TableCell>{car.name}</TableCell>
                      <TableCell>{car._id}</TableCell>
                      <TableCell>{enquiryCounts[car._id]}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}