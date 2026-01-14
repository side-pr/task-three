import React from "react";
import ReactDOM from "react-dom/client";
import { TodoPage } from "@pages/todos";
import { ReactQueryProvider } from "@app/providers";
import "@app/styles/globals.css";
import "@app/styles/font.css";
import { OverlayProvider } from "overlay-kit";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReactQueryProvider>
      <OverlayProvider>
        <div className="w-full h-full flex flex-col items-center font-pretendard">
          <TodoPage />
        </div>
      </OverlayProvider>
    </ReactQueryProvider>
  </React.StrictMode>
);
