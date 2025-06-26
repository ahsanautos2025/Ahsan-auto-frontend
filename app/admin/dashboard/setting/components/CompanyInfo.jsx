import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPhone } from "@/lib/formatPhone";
import { Building2, Mail, Phone, MessageCircle, MapPin } from 'lucide-react';

export default function CompanyInfo({ formData, isEditing, handleInputChange }) {
  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <Building2 className="h-5 w-5 mr-2 text-blue-600" />
          Company Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Company Name
          </Label>
          {isEditing ? (
            <Input
              id="name"
              name="name"
              value={formData.companyInfo.name}
              onChange={handleInputChange}
              placeholder="Enter company name"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          ) : (
            <div className="flex items-center space-x-2 py-2">
              <span className="text-sm text-gray-900">
                {formData.companyInfo.name || "Not set"}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
            <Mail className="h-4 w-4 mr-1" />
            Email Address
          </Label>
          {isEditing ? (
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.companyInfo.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          ) : (
            <div className="flex items-center space-x-2 py-2">
              <span className="text-sm text-gray-900">
                {formData.companyInfo.email || "Not set"}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
            <Phone className="h-4 w-4 mr-1" />
            Phone Number
          </Label>
          {isEditing ? (
            <Input
              id="phone"
              name="phone"
              value={formData.companyInfo.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number (e.g., +1234567890)"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          ) : (
            <div className="flex items-center space-x-2 py-2">
              <span className="text-sm text-gray-900">
                {formData.companyInfo.phone
                  ? formatPhone(formData.companyInfo.phone)
                  : "Not set"}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp" className="text-sm font-medium text-gray-700 flex items-center">
            <MessageCircle className="h-4 w-4 mr-1" />
            WhatsApp
          </Label>
          {isEditing ? (
            <Input
              id="whatsapp"
              name="whatsapp"
              value={formData.companyInfo.whatsapp}
              onChange={handleInputChange}
              placeholder="Enter WhatsApp number (e.g., +1234567890)"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          ) : (
            <div className="flex items-center space-x-2 py-2">
              <span className="text-sm text-gray-900">
                {formData.companyInfo.whatsapp
                  ? formatPhone(formData.companyInfo.whatsapp)
                  : "Not set"}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            Address
          </Label>
          {isEditing ? (
            <Textarea
              id="address"
              name="address"
              value={formData.companyInfo.address}
              onChange={handleInputChange}
              placeholder="Enter company address"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
            />
          ) : (
            <div className="flex items-start space-x-2 py-2">
              <span className="text-sm text-gray-900 leading-relaxed">
                {formData.companyInfo.address || "Not set"}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
