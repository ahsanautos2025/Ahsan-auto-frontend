"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Upload, Trash2, Edit, Users } from "lucide-react";
import { toast } from "sonner";
import TeamMemberForm from "./TeamMemberForm";
import { useSettings } from "@/Context/SettingsContext";

export default function TeamMembers({
  settings,
  uploadTeamMemberImage,
  deleteTeamMemberImage,
  deleteTeamMember,
  addTeamMember,
  loading,
}) {
  const { updateSettings } = useSettings();
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const fileInputRefs = useRef({});

 const handleAddTeamMember = async (newMember) => {
  const response = await addTeamMember(newMember);
  if (response.success) {
    const lastMember = response.teamMembers?.slice(-1)[0];
    return { success: true, newMemberId: lastMember?._id };
  } else {
    return { success: false };
  }
};

  const handleEditTeamMember = async (updatedMember) => {
    console.log(
      "handleEditTeamMember triggered with updatedMember:",
      updatedMember
    );
    const updatedTeamMembers = settings.teamMembers.map((member) =>
      member._id === editingMember._id
        ? { ...updatedMember, _id: member._id }
        : member
    );
    try {
      const response = await updateSettings({
        teamMembers: updatedTeamMembers,
      });
      console.log("updateSettings response for teamMembers:", response);
      if (response.success) {
        toast.success("Team member updated successfully!");
        setEditingMember(null);
      } else {
        toast.error(response.error || "Failed to update team member");
      }
    } catch (err) {
      console.error("Error in handleEditTeamMember:", err);
      toast.error("An unexpected error occurred while updating team member");
    }
  };

  const handleImageUpload = async (e, teamMemberId) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      console.log("Calling uploadTeamMemberImage for teamMemberId:", teamMemberId);
      const response = await uploadTeamMemberImage(file, teamMemberId);
      console.log("uploadTeamMemberImage response:", response);
      if (response.success) {
        toast.success("Team member image uploaded successfully!");
        if (fileInputRefs.current[teamMemberId]) {
          fileInputRefs.current[teamMemberId].value = "";
        }
      } else {
        toast.error(response.error || "Failed to upload team member image");
      }
    } catch (err) {
      console.error("Error in handleImageUpload:", err);
      toast.error("An unexpected error occurred while uploading team member image");
    }
  };

  const handleImageDelete = async (teamMemberId) => {
    try {
      console.log(
        "Calling deleteTeamMemberImage for teamMemberId:",
        teamMemberId
      );
      const response = await deleteTeamMemberImage(teamMemberId);
      console.log("deleteTeamMemberImage response:", response);
      if (response.success) {
        toast.success("Team member image deleted successfully!");
      } else {
        toast.error(response.error || "Failed to delete team member image");
      }
    } catch (err) {
      console.error("Error in handleImageDelete:", err);
      toast.error(
        "An unexpected error occurred while deleting team member image"
      );
    }
  };

  const handleDeleteTeamMember = async (teamMemberId) => {
    try {
      console.log("Calling deleteTeamMember for teamMemberId:", teamMemberId);
      const response = await deleteTeamMember(teamMemberId);
      console.log("deleteTeamMember response:", response);
      if (response.success) {
        toast.success("Team member deleted successfully!");
      } else {
        toast.error(response.error || "Failed to delete team member");
      }
    } catch (err) {
      console.error("Error in handleDeleteTeamMember:", err);
      toast.error("An unexpected error occurred while deleting team member");
    }
  };

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Team Members
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
            disabled={showForm || editingMember}
            className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && (
          <TeamMemberForm
            onSave={handleAddTeamMember}
            onCancel={() => setShowForm(false)}
            isEditing={showForm}
            setIsEditing={setShowForm}
          />
        )}
        {editingMember && (
          <TeamMemberForm
            teamMember={editingMember}
            onSave={handleEditTeamMember}
            onCancel={() => setEditingMember(null)}
            isEditing={!!editingMember}
            setIsEditing={() => setEditingMember(null)}
          />
        )}

        <div className="space-y-4">
          {settings?.teamMembers?.map((member) => (
            <div
              key={member._id}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900">{member.name}</h4>
                <p className="text-sm text-blue-600 font-medium">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {member.description}
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingMember(member)}
                  disabled={showForm || editingMember}
                  className="text-xs"
                >
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, member._id)}
                  ref={(el) => (fileInputRefs.current[member._id] = el)}
                  className="hidden"
                  id={`image-upload-${member._id}`}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRefs.current[member._id]?.click()}
                  disabled={loading}
                  className="text-xs"
                >
                  <Upload className="mr-1 h-3 w-3" />
                  Image
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteTeamMember(member._id)}
                  disabled={loading}
                  className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {!settings?.teamMembers?.length && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No team members added yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
