import React from "react";
import ReactDOM from "react-dom/client";
import { TodoPage } from "@pages/todos";
import { ModalProvider, ReactQueryProvider } from "@app/providers";
import "@app/styles/globals.css";
import "@app/styles/font.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ModalProvider>
      <ReactQueryProvider>
        <div className="w-full h-full flex flex-col items-center font-pretendard">
          <TodoPage />
        </div>
      </ReactQueryProvider>
    </ModalProvider>
  </React.StrictMode>
);
