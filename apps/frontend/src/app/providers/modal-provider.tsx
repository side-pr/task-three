"use client";

import { LoginDuplicateModal } from "@pages/auth/ui/login-duplicate-modal";
import { LoginFailModal } from "@pages/auth/ui/login-fail-modal";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setModalRoot(document.getElementById("modal-root"));
  }, []);
  return (
    <>
      {modalRoot
        ? createPortal(
            <>
              <LoginFailModal />
              <LoginDuplicateModal />
            </>,
            modalRoot
          )
        : null}
      {children}
    </>
  );
}
