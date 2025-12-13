"use client";

import React from "react";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getImageUrl } from "@/lib/getImageUrl";

export default function CarTable({
  cars,
  loading,
  error,
  pagination,
  handlePageChange,
  openEditDialog,
  openDeleteDialog,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Car Inventory</CardTitle>
        <CardDescription>
          Manage your car listings. Add, edit, or remove cars from your
          inventory.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {loading && <p className="text-gray-600 mb-4">Loading...</p>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.length === 0 && !loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  No cars found. Try a different search or add a new car.
                </TableCell>
              </TableRow>
            ) : (
              cars.map((car) => {
                const getStatusBadge = (availability) => {
                  switch (availability) {
                    case "available":
                      return (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white">
                          Available
                        </Badge>
                      );
                    case "sold":
                      return (
                        <Badge className="bg-red-500 hover:bg-red-600 text-white">
                          Sold
                        </Badge>
                      );
                    case "upcoming":
                      return (
                        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                          Upcoming
                        </Badge>
                      );
                    default:
                      return (
                        <Badge className="bg-gray-500 hover:bg-gray-600 text-white">
                          {availability || "N/A"}
                        </Badge>
                      );
                  }
                };

                return (
                  <TableRow key={car._id}>
                    <TableCell>
                      {(() => {
                        const primaryImage = car.images?.find(
                          (img) => img.isPrimary
                        );
                        return primaryImage?.url ? (
                          <Image
                            src={primaryImage.url}
                            width={64}
                            height={64}
                            alt={primaryImage.alt || car.name}
                            className="aspect-square rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                            No Image
                          </div>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="font-medium">{car.name}</TableCell>
                    <TableCell>{car.year}</TableCell>
                    <TableCell>৳{car.price.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(car.availability)}</TableCell>
                    <TableCell>{car.featured ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link
                          href={`/cars/${car._id}`}
                          passHref
                          target="_blank"
                        >
                          <DropdownMenuItem className="cursor-pointer">
                            <Trash className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={() => openEditDialog(car)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(car)}
                          className="text-red-600"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        {pagination.pages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <p>
              Page {pagination.page} of {pagination.pages}
            </p>
            <Button
              variant="outline"
              disabled={pagination.page === pagination.pages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
