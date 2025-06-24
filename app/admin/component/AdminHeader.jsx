"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/Assests/AhsanAutosLogo-black";
import { LogOut, AlertTriangle, Settings } from "lucide-react";
import { useAuth } from "@/Context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getImageUrl } from "@/lib/getImageUrl";
import { useSettings } from "@/Context/SettingsContext";
import Image from "next/image";

function AdminHeader() {
  const { logout } = useAuth();
  const { settings } = useSettings();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/admin");
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto border-b">
        <div className="flex items-center space-x-5">
          {settings?.logo?.url ? (
            <>
              <Image
                src={settings?.logo?.url}
                alt="Logo"
                width={120}
                height={0}
              />
            </>
          ) : (
            <Image
              src="/images/backup_logo.png"
              alt="Backup Logo"
              width={120}
              height={60}
            />
          )}
          <span className="text-sm font-bold italic">Admin Panel</span>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/admin/dashboard/setting"
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <Settings className="w-5 h-5" />
          </Link>
          <Button
            variant="ghost"
            className="flex items-center text-red-500 hover:text-red-600"
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
            <LogOut className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="text-yellow-500 w-6 h-6" />
              <h3 className="text-lg font-semibold">Confirm Logout</h3>
            </div>
            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminHeader;
