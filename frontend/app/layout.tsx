
import {ReactQueryProvider } from "@app/providers";
import "@app/styles/globals.css";
import "@app/styles/font.css";
import { Metadata } from "next";
import { OverlayProvider } from "overlay-kit";

export const metadata: Metadata = {
  title: "Task Three",
  description: "Task Three",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`font-pretendard`}>
        <OverlayProvider>
        <div id="modal-root"></div>
          <ReactQueryProvider>
            <div className="w-full h-full flex flex-col items-center">
              {children}
            </div>
          </ReactQueryProvider>
        </OverlayProvider>
      </body>
    </html>
  );
}