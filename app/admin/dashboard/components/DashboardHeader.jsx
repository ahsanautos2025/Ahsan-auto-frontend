"use client";

import React from "react";
import { Search, Upload, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export default function DashboardHeader({
  searchTerm,
  setSearchTerm,
  setIsAddDialogOpen,
  setIsImportDialogOpen,
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          Manage your inventory and website content
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search cars..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-[#245dc7] text-[#245dc7] hover:bg-[#245dc7] hover:text-white"
              onClick={() => setIsImportDialogOpen(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
          </DialogTrigger>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="bg-[#245dc7] hover:bg-[#1e4da6]"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Car
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
    </div>
  );
}
