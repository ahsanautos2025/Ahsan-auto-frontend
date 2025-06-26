import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function SocialMedia({
  formData,
  isEditing,
  handleSocialMediaChange,
}) {
  const socialPlatforms = [
    { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/yourpage' },
    { key: 'twitter', label: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/yourhandle' },
    { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/yourprofile' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/company/yourcompany' },
  ];

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <Share2 className="h-5 w-5 mr-2 text-blue-600" />
          Social Media
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-5">
            {socialPlatforms.map(({ key, label, icon: Icon, placeholder }) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="text-sm font-medium text-gray-700 flex items-center">
                  <Icon className="h-4 w-4 mr-1" />
                  {label}
                </Label>
                <Input
                  id={key}
                  name={key}
                  value={formData.socialMedia[key]}
                  onChange={handleSocialMediaChange}
                  placeholder={placeholder}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {socialPlatforms.map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <Icon className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{label}:</span>
                </div>
                <span className="text-sm text-gray-900 max-w-xs truncate">
                  {formData.socialMedia[key] ? (
                    <a 
                      href={formData.socialMedia[key]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {formData.socialMedia[key]}
                    </a>
                  ) : (
                    "Not set"
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
