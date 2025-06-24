import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/Context/AuthContext";
import { CarProvider } from "@/Context/CarContext";
import { SettingsProvider } from "@/Context/SettingsContext";
import { BulkImportProvider } from "@/Context/BulkImportContext";
import { StatsProvider } from "@/Context/StatsContext";
import { EnquiryProvider } from "@/Context/EnquiryContext";

import ToasterClient from "@/components/ToasterClient";

export const metadata: Metadata = {
  title: "Ahsan Auto's",
  description:
    "Ahsan Auto's - Premium Cars for Discerning Drivers - Quality, Luxury, and Exceptional Service in Every Ride. Now is Available in Bangladesh!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CarProvider>
            <SettingsProvider>
              <BulkImportProvider>
                <StatsProvider>
                  <EnquiryProvider>
                    {children}
                    <ToasterClient />
                  </EnquiryProvider>
                </StatsProvider>
              </BulkImportProvider>
            </SettingsProvider>
          </CarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
