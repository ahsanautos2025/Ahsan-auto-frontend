"use client";

import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Upload, Check, X, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useBulkImportDialog } from "@/lib/useBulkImportDialog";

export default function BulkImportDialog({
  isOpen,
  setIsOpen,
  createCar,
  refreshCars,
}) {
  const {
    importStep,
    importProgress,
    loading,
    preview,
    errors,
    validCount,
    handleFileUpload,
    handleBulkImport,
    handleCancel,
    handleOpenChange,
    downloadTemplate,
  } = useBulkImportDialog({ isOpen, setIsOpen, refreshCars });

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileSpreadsheet className="h-5 w-5 mr-2" />
            Bulk Import Cars from Excel
          </DialogTitle>
          <DialogDescription>
            Upload an Excel file to import multiple cars at once. Make sure your file follows the required format.
            <Button variant="link" onClick={downloadTemplate} className="p-0 ml-2">
              Download Template
            </Button>
          </DialogDescription>
        </DialogHeader>
        {importStep === "upload" && (
          <div className="py-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Excel File</h3>
              <p className="text-gray-600 mb-4">Choose an Excel file (.xlsx, .xls) with your car inventory data</p>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="excel-upload"
                disabled={loading}
              />
              <label htmlFor="excel-upload">
                <Button asChild className="bg-[#245dc7] hover:bg-[#1e4da6]" disabled={loading}>
                  <span>{loading ? "Uploading..." : "Choose File"}</span>
                </Button>
              </label>
            </div>
            <div className="mt-6">
              <h4 className="font-medium mb-2">Required Excel Format:</h4>
              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                <p className="mb-2">Your Excel file should have the following columns:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li><strong>Name</strong> - Car name (e.g., "Mercedes-Benz S-Class")</li>
                  <li><strong>Price</strong> - Price in USD (e.g., 110000)</li>
                  <li><strong>Year</strong> - Manufacturing year (e.g., 2023)</li>
                  <li><strong>Mileage</strong> - Mileage in miles (e.g., 1500)</li>
                  <li><strong>Transmission</strong> - Transmission type (e.g., "Automatic")</li>
                  <li><strong>Body Type</strong> - Body type (e.g., "Sedan")</li>
                  <li><strong>Fuel Type</strong> - Fuel type (e.g., "Hybrid")</li>
                  <li><strong>Color</strong> - Car color (e.g., "Black")</li>
                  <li><strong>Featured</strong> - TRUE/FALSE for featured cars</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        {importStep === "preview" && (
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Preview Import Data</h3>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {validCount} Valid
                </Badge>
                {errors.length > 0 && (
                  <Badge variant="outline" className="text-red-600 border-red-600">
                    {errors.length} Errors
                  </Badge>
                )}
              </div>
            </div>
            {errors.length > 0 && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                  <h4 className="font-medium text-red-800">Validation Errors Found</h4>
                </div>
                <p className="text-sm text-red-700 mb-2">The following rows have errors and will be skipped during import:</p>
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.map((item, index) => (
                    <li key={index}>
                      <strong>Row {index + 2}:</strong> {item.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-left">Name</th>
                      <th className="px-3 py-2 text-left">Price</th>
                      <th className="px-3 py-2 text-left">Year</th>
                      <th className="px-3 py-2 text-left">Mileage</th>
                      <th className="px-3 py-2 text-left">Type</th>
                      <th className="px-3 py-2 text-left">Fuel</th>
                      <th className="px-3 py-2 text-left">Featured</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((item, index) => {
                      const hasError = errors.some((err) => err.data === item);
                      return (
                        <tr key={index} className={hasError ? "bg-red-50" : "bg-white"}>
                          <td className="px-3 py-2">
                            {hasError ? (
                              <X className="h-4 w-4 text-red-600" />
                            ) : (
                              <Check className="h-4 w-4 text-green-600" />
                            )}
                          </td>
                          <td className="px-3 py-2 font-medium">{item.name || "N/A"}</td>
                          <td className="px-3 py-2">
                            ${typeof item.price === "number" ? item.price.toLocaleString() : item.price || "N/A"}
                          </td>
                          <td className="px-3 py-2">{item.year || "N/A"}</td>
                          <td className="px-3 py-2">{item.mileage || "N/A"}</td>
                          <td className="px-3 py-2">{item.bodyType || "N/A"}</td>
                          <td className="px-3 py-2">{item.fuelType || "N/A"}</td>
                          <td className="px-3 py-2">{item.featured ? "Yes" : "No"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {importStep === "importing" && (
          <div className="py-8 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-[#245dc7] rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-medium mb-2">Importing Cars...</h3>
              <p className="text-gray-600">Please wait while we add the cars to your inventory.</p>
            </div>
            <div className="max-w-md mx-auto">
              <Progress value={importProgress} className="mb-2" />
              <p className="text-sm text-gray-600">{Math.round(importProgress)}% complete</p>
            </div>
          </div>
        )}
        {importStep === "complete" && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-medium mb-2">Import Complete!</h3>
            <p className="text-gray-600">
              Successfully imported {validCount} cars to your inventory.
              {errors.length > 0 && ` ${errors.length} rows skipped due to errors.`}
            </p>
          </div>
        )}
        {(importStep === "upload" || importStep === "preview") && (
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            {importStep === "preview" && (
              <Button
                onClick={handleBulkImport}
                className="bg-[#245dc7] hover:bg-[#1e4da6]"
                disabled={loading || validCount === 0}
              >
                Import {validCount} Cars
              </Button>
            )}
          </DialogFooter>
        )}
        {importStep === "complete" && (
          <DialogFooter>
            <Button onClick={handleCancel} className="bg-[#245dc7] hover:bg-[#1e4da6]">
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}