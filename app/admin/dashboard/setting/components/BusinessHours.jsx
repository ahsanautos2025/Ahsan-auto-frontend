import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar } from 'lucide-react';

export default function BusinessHours({
  formData,
  isEditing,
  handleBusinessHoursChange,
}) {
  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <Clock className="h-5 w-5 mr-2 text-blue-600" />
          Business Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="businessDays" className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Business Days
              </Label>
              <Input
                id="businessDays"
                name="days"
                value={formData.businessHours.days}
                onChange={handleBusinessHoursChange}
                placeholder="e.g., Sunday to Thursday"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openTime" className="text-sm font-medium text-gray-700">
                  Open Time
                </Label>
                <Input
                  id="openTime"
                  name="open"
                  value={formData.businessHours.open}
                  onChange={handleBusinessHoursChange}
                  placeholder="e.g., 9:00 AM"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="closeTime" className="text-sm font-medium text-gray-700">
                  Close Time
                </Label>
                <Input
                  id="closeTime"
                  name="close"
                  value={formData.businessHours.close}
                  onChange={handleBusinessHoursChange}
                  placeholder="e.g., 5:00 PM"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">Days:</span>
              <span className="text-sm text-gray-900">
                {formData.businessHours.days || "Not set"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-700">Hours:</span>
              <span className="text-sm text-gray-900">
                {formData.businessHours.open && formData.businessHours.close
                  ? `${formData.businessHours.open} - ${formData.businessHours.close}`
                  : "Not set"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
