
import {ReactQueryProvider } from "@app/providers";
import "@app/styles/globals.css";
import "@app/styles/font.css";
import { MaintenanceScreen, isUnderMaintenance } from "@shared/ui";
import { Metadata, Viewport } from "next";
import { OverlayProvider } from "overlay-kit";

export const metadata: Metadata = {
  title: "Task Three",
  description: "Task Three",
};

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const maintenance = isUnderMaintenance();
  return (
    <html lang="ko">
      <body className={`font-pretendard`}>
        <ReactQueryProvider>
          <OverlayProvider>
            <div id="modal-root"></div>
            <div className="w-full h-full flex flex-col items-center">
              {maintenance ? <MaintenanceScreen /> : children}
            </div>
          </OverlayProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}