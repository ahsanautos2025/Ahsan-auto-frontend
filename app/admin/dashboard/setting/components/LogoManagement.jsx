import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, Trash2, ImageIcon } from 'lucide-react';

export default function LogoManagement({
  settings,
  loading,
  logoFile,
  setLogoFile,
  logoAlt,
  setLogoAlt,
  handleLogoUpload,
  handleLogoDelete,
  fileInputRef,
}) {
  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <ImageIcon className="h-5 w-5 mr-2 text-blue-600" />
          Logo Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {settings?.logo?.url && (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <img
                src={settings.logo.url || "/placeholder.svg"}
                alt={settings.logo.alt}
                className="h-24 w-auto object-contain"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              onClick={handleLogoDelete}
              disabled={loading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Current Logo
            </Button>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo" className="text-sm font-medium text-gray-700">
              Upload New Logo
            </Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files[0])}
              ref={fileInputRef}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoAlt" className="text-sm font-medium text-gray-700">
              Logo Alt Text
            </Label>
            <Input
              id="logoAlt"
              value={logoAlt}
              onChange={(e) => setLogoAlt(e.target.value)}
              placeholder="Enter logo alt text"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
            onClick={handleLogoUpload}
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {loading ? "Uploading..." : "Upload Logo"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
