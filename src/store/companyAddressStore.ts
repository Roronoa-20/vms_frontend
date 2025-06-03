import { create } from 'zustand';
import { TCompanyAddressDetail, TmultipleLocation } from '../types/types';


type companyAddressFormStore = {
    billingAddress:Partial<TCompanyAddressDetail["billing_address"]>,
    shippingAddress:Partial<TCompanyAddressDetail["shipping_address"]>
    multiple_location_table: TCompanyAddressDetail["multiple_location_table"];
    updatebillingAddress:(field: keyof TCompanyAddressDetail["billing_address"], value:any)=>void,
    updateshippingAddress:(field: keyof TCompanyAddressDetail["shipping_address"], value:any)=>void,
  updateLocationAtIndex: (
    index: number,
    updatedData: Partial<TCompanyAddressDetail["multiple_location_table"]>
  ) => void;
  addMultipleLocation: (location: TmultipleLocation) => void,
    resetMultiple:()=>void
}


export const useCompanyAddressFormStore = create<companyAddressFormStore>((set)=>({
    billingAddress:{},
    shippingAddress:{},
    multiple_location_table:[],
    updatebillingAddress(field, value) {
        set((state)=>({
            billingAddress:{
                ...state?.billingAddress,
                [field]: value,
            },
        }))
    },
    updateshippingAddress(field, value) {
        set((state)=>({
            shippingAddress:{
                ...state?.shippingAddress,
                [field]: value,
            },
        }))
    },

    addMultipleLocation: (location) => set((state) => ({
        multiple_location_table: [...state.multiple_location_table, location]
      })),

  updateLocationAtIndex: (index, updatedData) =>
    set((state) => {
      const updated = [...state.multiple_location_table];
      if (index >= 0 && index < updated.length) {
        updated[index] = { ...updated[index], ...updatedData };
      }
      return { multiple_location_table: updated };
    }),
    resetMultiple:()=>set({multiple_location_table:[]})
}))