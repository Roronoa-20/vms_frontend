"use client";

import { createContext, useContext } from "react";
import { useASAForm as useASAFormHook } from "@/src/hooks/useASAForm";

const ASAFormContext = createContext<any>(null);

export const ASAFormProvider = ({ children }: { children: React.ReactNode }) => {
  const asaForm = useASAFormHook();
  return (
    <ASAFormContext.Provider value={asaForm}>
      {children}
    </ASAFormContext.Provider>
  );
};

export const useASAFormContext = () => {
  const ctx = useContext(ASAFormContext);
  if (!ctx) throw new Error("useASAFormContext must be used inside ASAFormProvider");
  return ctx;
};
