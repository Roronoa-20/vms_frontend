import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type TMultipleVendorCode = {
    company_name: string;
    state: string;
    gst_no: string;
    vendor_code: string;
  };
  


type MultipleVendorCodeStore = {
    MultipleVendorCode: TMultipleVendorCode[];
   addMultipleVendorCode: (code: TMultipleVendorCode) => void,

    reset: () => void
}


export const useMultipleVendorCodeStore = create<MultipleVendorCodeStore>()(
    persist(
      (set) => ({
        MultipleVendorCode: [],
        addMultipleVendorCode: (code) =>
          set((state) => ({
            MultipleVendorCode: [...state.MultipleVendorCode, code],
          })),
        reset: () => set({ MultipleVendorCode: [] }),
      }),
      {
        name: 'multiple-vendor-code-storage', // key in localStorage
      }
    )
  );