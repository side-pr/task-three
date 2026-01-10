import type { Metadata } from "next";
import { ModalProvider, ReactQueryProvider } from "@app/providers";
import "@app/styles/globals.css";
import "@app/styles/font.css";

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
        <div id="modal-root"></div>
        <ModalProvider>
          <ReactQueryProvider>
            <div className="w-full h-full flex flex-col items-center">
              {children}
            </div>
          </ReactQueryProvider>
        </ModalProvider>
      </body>
    </html>
  );
}
