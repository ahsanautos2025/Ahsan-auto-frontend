"use client";

import { useSettings } from "@/Context/SettingsContext";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Upload,
  Trash2,
  Save,
  AlertCircle,
  Pencil,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { formatPhone } from "@/lib/formatPhone";

export default function Settings() {
  const { settings, loading, error, updateSettings, uploadLogo, deleteLogo } =
    useSettings();

  // Initialize form data with all fields
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

  // Populate form data when settings load
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

  // Handle input changes for companyInfo
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      companyInfo: { ...prev.companyInfo, [name]: value },
    }));
  };

  // Handle input changes for businessHours
  const handleBusinessHoursChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      businessHours: { ...prev.businessHours, [name]: value },
    }));
  };

  // Handle input changes for socialMedia
  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [name]: value },
    }));
  };

  // Handle input changes for seoSettings
  const handleSeoSettingsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      seoSettings: { ...prev.seoSettings, [name]: value },
    }));
  };

  // Enable edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Cancel edit mode and revert changes
  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
      setLogoAlt(settings?.logo?.alt || "");
    }
    setIsEditing(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();

  // Log formData to debug
  console.log("Form Data being sent:", JSON.stringify(formData, null, 2));

  // Validate business hours: ensure open/close times are set if days are specified
  if (formData.businessHours.days && (!formData.businessHours.open || !formData.businessHours.close)) {
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
      `Invalid URLs for: ${invalidUrls.map(([key]) => key).join(", ")}. Please provide valid URLs or leave them empty.`
    );
    return;
  }

  const response = await updateSettings(formData);
  if (response.success) {
    toast.success("Settings updated successfully!");
    setIsEditing(false);
    setOriginalData(formData);
  } else {
    toast.error(response.error || "Failed to update settings");
    console.error("Update settings error:", response.error);
  }
};

  // Handle logo upload
  const handleLogoUpload = async (e) => {
    e.preventDefault();
    if (!logoFile) {
      toast.error("Please select a logo file");
      return;
    }

    const response = await uploadLogo(logoFile, logoAlt);
    if (response.success) {
      toast.success("Logo uploaded successfully!");
      setLogoFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      toast.error(response.error || "Failed to upload logo");
    }
  };

  // Handle logo deletion
  const handleLogoDelete = async () => {
    const response = await deleteLogo();
    if (response.success) {
      toast.success("Logo deleted successfully!");
      setLogoAlt("");
    } else {
      toast.error(response.error || "Failed to delete logo");
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  if (loading && !settings) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Link href="/admin/dashboard">
        <p className="text-sm font-medium text-primary-500 hover:underline mb-4 block">
          ← Back to Dashboard
        </p>
      </Link>

      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          {!isEditing && (
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {isEditing && (
            <div className="flex space-x-2">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleCancel}
                disabled={loading}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Company Info Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Company Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      name="name"
                      value={formData.companyInfo.name}
                      onChange={handleInputChange}
                      placeholder="Enter company name"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">
                      {formData.companyInfo.name || "Not set"}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.companyInfo.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">
                      {formData.companyInfo.email || "Not set"}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.companyInfo.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number (include country code e.g. +888)"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">
                      {formData.companyInfo.phone
                        ? formatPhone(formData.companyInfo.phone)
                        : "Not set"}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  {isEditing ? (
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.companyInfo.whatsapp}
                      onChange={handleInputChange}
                      placeholder="Enter WhatsApp number (include country code e.g. +888)"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">
                      {formData.companyInfo.whatsapp
                        ? formatPhone(formData.companyInfo.whatsapp)
                        : "Not set"}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.companyInfo.address}
                      onChange={handleInputChange}
                      placeholder="Enter company address"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">
                      {formData.companyInfo.address || "Not set"}
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Business Hours Card */}
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="businessDays">Business Days</Label>
                    <Input
                      id="businessDays"
                      name="days"
                      value={formData.businessHours.days}
                      onChange={handleBusinessHoursChange}
                      placeholder="e.g., Sunday to Thursday"
                    />
                  </div>
                  <div>
                    <Label htmlFor="openTime">Open Time</Label>
                    <Input
                      id="openTime"
                      name="open"
                      value={formData.businessHours.open}
                      onChange={handleBusinessHoursChange}
                      placeholder="e.g., 9 AM"
                    />
                  </div>
                  <div>
                    <Label htmlFor="closeTime">Close Time</Label>
                    <Input
                      id="closeTime"
                      name="close"
                      value={formData.businessHours.close}
                      onChange={handleBusinessHoursChange}
                      placeholder="e.g., 5 PM"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">
                    Days: {formData.businessHours.days || "Not set"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Hours:{" "}
                    {formData.businessHours.open && formData.businessHours.close
                      ? `${formData.businessHours.open} - ${formData.businessHours.close}`
                      : "Not set"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Media Card */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      name="facebook"
                      value={formData.socialMedia.facebook}
                      onChange={handleSocialMediaChange}
                      placeholder="e.g., https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      name="twitter"
                      value={formData.socialMedia.twitter}
                      onChange={handleSocialMediaChange}
                      placeholder="e.g., https://twitter.com/yourhandle"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      name="instagram"
                      value={formData.socialMedia.instagram}
                      onChange={handleSocialMediaChange}
                      placeholder="e.g., https://instagram.com/yourprofile"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      value={formData.socialMedia.linkedin}
                      onChange={handleSocialMediaChange}
                      placeholder="e.g., https://linkedin.com/company/yourcompany"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(formData.socialMedia).map(
                    ([platform, url]) => (
                      <p key={platform} className="text-sm text-gray-600">
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}:{" "}
                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {url}
                          </a>
                        ) : (
                          "Not set"
                        )}
                      </p>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* SEO Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      name="metaTitle"
                      value={formData.seoSettings.metaTitle}
                      onChange={handleSeoSettingsChange}
                      placeholder="e.g., My Website Title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      name="metaDescription"
                      value={formData.seoSettings.metaDescription}
                      onChange={handleSeoSettingsChange}
                      placeholder="e.g., Description of my website"
                    />
                  </div>
                  <div>
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      name="keywords"
                      value={formData.seoSettings.keywords}
                      onChange={handleSeoSettingsChange}
                      placeholder="e.g., website, business, services"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Meta Title: {formData.seoSettings.metaTitle || "Not set"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Meta Description:{" "}
                    {formData.seoSettings.metaDescription || "Not set"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Keywords: {formData.seoSettings.keywords || "Not set"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Logo Management Card */}
          <Card>
            <CardHeader>
              <CardTitle>Logo Management</CardTitle>
            </CardHeader>
            <CardContent>
              {settings?.logo?.url && (
                <div className="mb-4">
                  <img
                    src={settings.logo.url}
                    alt={settings.logo.alt}
                    className="h-24 w-auto object-contain border rounded"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    onClick={handleLogoDelete}
                    disabled={loading}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Logo
                  </Button>
                </div>
              )}
              <form onSubmit={handleLogoUpload} className="space-y-4">
                <div>
                  <Label htmlFor="logo">Upload New Logo</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </div>
                <div>
                  <Label htmlFor="logoAlt">Logo Alt Text</Label>
                  <Input
                    id="logoAlt"
                    value={logoAlt}
                    onChange={(e) => setLogoAlt(e.target.value)}
                    placeholder="Enter logo alt text"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading || !logoFile}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
