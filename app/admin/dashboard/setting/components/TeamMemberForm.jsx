"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useSettings } from "@/Context/SettingsContext";
import { toBase64 } from "@/lib/toBase64";

export default function TeamMemberForm({
  teamMember,
  onSave,
  onCancel,
  isEditing,
  setIsEditing,
}) {
  const { uploadTeamMemberImage } = useSettings();
  const [form, setForm] = useState({
    name: teamMember?.name || "",
    role: teamMember?.role || "",
    image: teamMember?.image || "",
    description: teamMember?.description || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.role || !form.description) {
      toast.error("Please fill out all required fields");
      return;
    }

    // Step 1: Add member with temporary placeholder image (not a blob!)
    const addRes = await onSave({
      ...form,
      image: "/placeholder.svg?height=400&width=400",
    });

    // Step 2: Upload image to imgbb (only if imageFile is selected and newMemberId is returned)
    if (addRes?.success && addRes?.newMemberId && imageFile) {
      try {
        const base64 = await toBase64(imageFile); // this is the correct input
        const uploadRes = await uploadTeamMemberImage(
          base64,
          addRes.newMemberId
        );

        if (uploadRes.success) {
          toast.success("Image uploaded successfully!");
        } else {
          toast.error(uploadRes.error || "Failed to upload image");
        }
      } catch (err) {
        console.error("Image upload error:", err);
        toast.error("Unexpected error during image upload");
      }
    }

    setIsEditing(false);
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {teamMember ? "Edit Team Member" : "Add Team Member"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter name"
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-gray-700">
              Role *
            </Label>
            <Input
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="Enter role"
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {isEditing && (
            <div className="space-y-2">
              <Label
                htmlFor="image"
                className="text-sm font-medium text-gray-700"
              >
                Image
              </Label>
              <div className="flex items-center space-x-2">
                <img
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile)
                      : teamMember?.image || "/placeholder.svg"
                  }
                  alt="Team member preview"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description *
            </Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description"
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
            />
          </div>
          <div className="flex space-x-2 pt-2">
            <Button
              type="submit"
              disabled={!form.name || !form.role || !form.description}
              onClick={handleSubmit}
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
