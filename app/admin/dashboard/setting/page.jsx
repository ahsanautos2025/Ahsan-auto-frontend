"use client";

import { useSettings } from "@/Context/SettingsContext";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, AlertCircle, Pencil, X, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import CompanyInfo from "./components/CompanyInfo";
import BusinessHours from "./components/BusinessHours";
import SocialMedia from "./components/SocialMedia";
import SeoSettings from "./components/SeoSettings";
import LogoManagement from "./components/LogoManagement";
import TeamMembers from "./components/TeamMembers";
import StatsManagement from "./components/StatsManagement";

export default function Settings() {
  const {
    settings,
    loading,
    error,
    updateSettings,
    uploadLogo,
    deleteLogo,
    uploadTeamMemberImage,
    deleteTeamMemberImage,
    deleteTeamMember,
    addStat,
    addTeamMember,
  } = useSettings();

  const [formData, setFormData] = useState({
    companyInfo: {
      name: "",
      email: "",
      phone: "",
      whatsapp: "",
      address: "",
    },
    businessHours: {
      days: "",
      open: "",
      close: "",
    },
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
    seoSettings: {
      metaTitle: "",
      metaDescription: "",
      keywords: "",
    },
  });
  const [originalData, setOriginalData] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoAlt, setLogoAlt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (settings) {
      const newFormData = {
        companyInfo: {
          name: settings.companyInfo?.name || "",
          email: settings.companyInfo?.email || "",
          phone: settings.companyInfo?.phone || "",
          whatsapp: settings.companyInfo?.whatsapp || "",
          address: settings.companyInfo?.address || "",
        },
        businessHours: {
          days: settings.businessHours?.days || "",
          open: settings.businessHours?.open || "",
          close: settings.businessHours?.close || "",
        },
        socialMedia: {
          facebook: settings.socialMedia?.facebook || "",
          twitter: settings.socialMedia?.twitter || "",
          instagram: settings.socialMedia?.instagram || "",
          linkedin: settings.socialMedia?.linkedin || "",
        },
        seoSettings: {
          metaTitle: settings.seoSettings?.metaTitle || "",
          metaDescription: settings.seoSettings?.metaDescription || "",
          keywords: settings.seoSettings?.keywords || "",
        },
      };
      setFormData(newFormData);
      setOriginalData(newFormData);
      setLogoAlt(settings.logo?.alt || "");
    }
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      companyInfo: { ...prev.companyInfo, [name]: value },
    }));
  };

  const handleBusinessHoursChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      businessHours: { ...prev.businessHours, [name]: value },
    }));
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [name]: value },
    }));
  };

  const handleSeoSettingsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      seoSettings: { ...prev.seoSettings, [name]: value },
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
      setLogoAlt(settings?.logo?.alt || "");
    }
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("handleSubmit triggered with formData:", JSON.stringify(formData, null, 2));

    // Validate business hours
    if (
      formData.businessHours.days &&
      (!formData.businessHours.open || !formData.businessHours.close)
    ) {
      toast.error("Please set open and close times if business days are specified.");
      return;
    }

    // Validate social media URLs
    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
    const invalidUrls = Object.entries(formData.socialMedia).filter(
      ([key, value]) => value && !urlRegex.test(value)
    );
    if (invalidUrls.length > 0) {
      toast.error(
        `Invalid URLs for: ${invalidUrls
          .map(([key]) => key)
          .join(", ")}. Please provide valid URLs or leave them empty.`
      );
      return;
    }

    try {
      console.log("Calling updateSettings with:", formData);
      const response = await updateSettings(formData);
      console.log("updateSettings response:", response);
      if (response.success) {
        toast.success("Settings updated successfully!");
        setIsEditing(false);
        setOriginalData(formData);
      } else {
        toast.error(response.error || "Failed to update settings");
        console.error("Update settings error:", response.error);
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      toast.error("An unexpected error occurred while updating settings");
    }
  };

  const handleLogoUpload = async (e) => {
    e.preventDefault();
    if (!logoFile) {
      toast.error("Please select a logo file");
      return;
    }

    try {
      console.log("Calling uploadLogo with file and alt:", logoAlt);
      const response = await uploadLogo(logoFile, logoAlt);
      console.log("uploadLogo response:", response);
      if (response.success) {
        toast.success("Logo uploaded successfully!");
        setLogoFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error(response.error || "Failed to upload logo");
      }
    } catch (err) {
      console.error("Error in handleLogoUpload:", err);
      toast.error("An unexpected error occurred while uploading logo");
    }
  };

  const handleLogoDelete = async () => {
    try {
      console.log("Calling deleteLogo");
      const response = await deleteLogo();
      console.log("deleteLogo response:", response);
      if (response.success) {
        toast.success("Logo deleted successfully!");
        setLogoAlt("");
      } else {
        toast.error(response.error || "Failed to delete logo");
      }
    } catch (err) {
      console.error("Error in handleLogoDelete:", err);
      toast.error("An unexpected error occurred while deleting logo");
    }
  };

  if (loading && !settings) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  onClick={handleEdit}
                  className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Settings
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                    className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    form="settings-form" // ✅ Link to form ID
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-8 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <form id="settings-form" onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Basic Information</h2>
              <p className="text-sm text-gray-600">Manage your company's basic information and contact details.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <CompanyInfo
                formData={formData}
                isEditing={isEditing}
                handleInputChange={handleInputChange}
              />
              <BusinessHours
                formData={formData}
                isEditing={isEditing}
                handleBusinessHoursChange={handleBusinessHoursChange}
              />
            </div>
          </div>

          <Separator className="my-8" />

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Online Presence</h2>
              <p className="text-sm text-gray-600">Configure your social media links and SEO settings.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <SocialMedia
                formData={formData}
                isEditing={isEditing}
                handleSocialMediaChange={handleSocialMediaChange}
              />
              <SeoSettings
                formData={formData}
                isEditing={isEditing}
                handleSeoSettingsChange={handleSeoSettingsChange}
              />
            </div>
          </div>

          <Separator className="my-8" />

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Branding</h2>
              <p className="text-sm text-gray-600">Upload and manage your company logo.</p>
            </div>
            <div className="max-w-md">
              <LogoManagement
                settings={settings}
                loading={loading}
                logoFile={logoFile}
                setLogoFile={setLogoFile}
                logoAlt={logoAlt}
                setLogoAlt={setLogoAlt}
                handleLogoUpload={handleLogoUpload}
                handleLogoDelete={handleLogoDelete}
                fileInputRef={fileInputRef}
              />
            </div>
          </div>

          <Separator className="my-8" />

          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Team & Statistics</h2>
              <p className="text-sm text-gray-600">Manage your team members and company statistics.</p>
            </div>
            <TeamMembers
              settings={settings}
              uploadTeamMemberImage={uploadTeamMemberImage}
              deleteTeamMemberImage={deleteTeamMemberImage}
              deleteTeamMember={deleteTeamMember}
              addTeamMember={addTeamMember}
              loading={loading}
            />
            <StatsManagement addStat={addStat} />
          </div>
        </form>
      </div>
    </div>
  );
}