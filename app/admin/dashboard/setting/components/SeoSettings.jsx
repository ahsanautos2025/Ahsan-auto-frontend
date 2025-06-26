import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FileText, Tag } from 'lucide-react';

export default function SeoSettings({
  formData,
  isEditing,
  handleSeoSettingsChange,
}) {
  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <Search className="h-5 w-5 mr-2 text-blue-600" />
          SEO Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="metaTitle" className="text-sm font-medium text-gray-700 flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                Meta Title
              </Label>
              <Input
                id="metaTitle"
                name="metaTitle"
                value={formData.seoSettings.metaTitle}
                onChange={handleSeoSettingsChange}
                placeholder="e.g., My Website Title"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription" className="text-sm font-medium text-gray-700">
                Meta Description
              </Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                value={formData.seoSettings.metaDescription}
                onChange={handleSeoSettingsChange}
                placeholder="e.g., Description of my website"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keywords" className="text-sm font-medium text-gray-700 flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Keywords
              </Label>
              <Input
                id="keywords"
                name="keywords"
                value={formData.seoSettings.keywords}
                onChange={handleSeoSettingsChange}
                placeholder="e.g., website, business, services"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Meta Title:</span>
              </div>
              <p className="text-sm text-gray-900 ml-6">
                {formData.seoSettings.metaTitle || "Not set"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-gray-700">Meta Description:</span>
              <p className="text-sm text-gray-900 leading-relaxed">
                {formData.seoSettings.metaDescription || "Not set"}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Keywords:</span>
              </div>
              <p className="text-sm text-gray-900 ml-6">
                {formData.seoSettings.keywords || "Not set"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
