"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X } from "lucide-react";
import { toast } from "sonner";

export default function StatForm({ stat, onSave, onCancel }) {
  const [form, setForm] = useState({
    number: stat?.number || "",
    label: stat?.label || "",
    icon: stat?.icon || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.number || !form.label || !form.icon) {
      toast.error("Please fill out all required fields");
      return;
    }
    onSave(form);
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {stat ? "Edit Statistic" : "Add Statistic"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="number"
              className="text-sm font-medium text-gray-700"
            >
              Number *
            </Label>
            <Input
              id="number"
              name="number"
              value={form.number}
              onChange={handleChange}
              placeholder="e.g., 500+"
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="label"
              className="text-sm font-medium text-gray-700"
            >
              Label *
            </Label>
            <Input
              id="label"
              name="label"
              value={form.label}
              onChange={handleChange}
              placeholder="e.g., Happy Customers"
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon" className="text-sm font-medium text-gray-700">
              Icon *
            </Label>
            <Input
              id="icon"
              name="icon"
              value={form.icon}
              onChange={handleChange}
              placeholder="e.g., users"
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-2 pt-2">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!form.number || !form.label || !form.icon}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
