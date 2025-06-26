"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, BarChart3 } from "lucide-react";
import StatForm from "./StatForm";
import { useSettings } from "@/Context/SettingsContext";
import { toast } from "sonner";

export default function StatsManagement({ addStat }) {
  const { settings, updateSettings } = useSettings();
  const [showForm, setShowForm] = useState(false);
  const [editingStat, setEditingStat] = useState(null);

  const handleAddStat = async (newStat) => {
    console.log("handleAddStat triggered with newStat:", newStat);
    try {
      const response = await addStat(newStat);
      console.log("addStat response:", response);
      if (response.success) {
        toast.success("Statistic added successfully!");
        setShowForm(false);
      } else {
        toast.error(response.error || "Failed to add statistic");
      }
    } catch (err) {
      console.error("Error in handleAddStat:", err);
      toast.error("An unexpected error occurred while adding statistic");
    }
  };

  const handleEditStat = async (updatedStat) => {
    console.log("handleEditStat triggered with updatedStat:", updatedStat);
    const updatedStats = settings.stats.map((stat, index) =>
      index === editingStat.index ? updatedStat : stat
    );
    try {
      const response = await updateSettings({ stats: updatedStats });
      console.log("updateSettings response for stats:", response);
      if (response.success) {
        toast.success("Statistic updated successfully!");
        setEditingStat(null);
      } else {
        toast.error(response.error || "Failed to update statistic");
      }
    } catch (err) {
      console.error("Error in handleEditStat:", err);
      toast.error("An unexpected error occurred while updating statistic");
    }
  };

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Statistics
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
            disabled={showForm || editingStat}
            className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Stat
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && <StatForm onSave={handleAddStat} onCancel={() => setShowForm(false)} />}
        {editingStat && (
          <StatForm stat={editingStat.data} onSave={handleEditStat} onCancel={() => setEditingStat(null)} />
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {settings?.stats?.map((stat, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative group">
              <div className="text-center

">
                <div className="text-2xl font-bold text-blue-600 mb-1">{stat.number}</div>
                <div className="text-sm font-medium text-gray-700 mb-2">{stat.label}</div>
                <div className="text-xs text-gray-500">Icon: {stat.icon}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingStat({ data: stat, index })}
                disabled={showForm || editingStat}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        {!settings?.stats?.length && (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No statistics added yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}