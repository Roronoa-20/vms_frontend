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
    selectedVendorCode:string
    setSelectedVendorCode:(code:string)=>void;
    reset: () => void,
    resetVendorCode:()=>void
}


export const useMultipleVendorCodeStore = create<MultipleVendorCodeStore>()(
    persist(
      (set) => ({
        MultipleVendorCode: [],
        selectedVendorCode:"",
        setSelectedVendorCode:(code)=>set((state)=>({
          selectedVendorCode:code
        })),
        addMultipleVendorCode: (code) =>
          set((state) => ({
            MultipleVendorCode: [...state.MultipleVendorCode, code],
          })),
        reset: () => set({ MultipleVendorCode: [] }),
        resetVendorCode:()=>set({selectedVendorCode:""})
      }),
      {
        name: 'multiple-vendor-code-storage', // key in localStorage
      }
    )
  );