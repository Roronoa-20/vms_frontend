import { create } from 'zustand';
import { TCompanyAddressDetail } from '../types/types';


type companyAddressFormStore = {
    billingAddress:TCompanyAddressDetail["billing_address"] | {},
    multiple_location_table: TCompanyAddressDetail["multiple_location_table"];
    updatebillingAddress:(field: keyof TCompanyAddressDetail["billing_address"], value:any)=>void,
  updateLocationAtIndex: (
    index: number,
    updatedData: Partial<TCompanyAddressDetail["multiple_location_table"]>
  ) => void;
    reset:()=>void
}


export const useCompanyAddressFormStore = create<companyAddressFormStore>((set)=>({
    billingAddress:{},
    multiple_location_table:[],
    updatebillingAddress(field, value) {
        set((state)=>({
            billingAddress:{
                ...state?.billingAddress,
                [field]: value,
            },
        }))
    },

  updateLocationAtIndex: (index, updatedData) =>
    set((state) => {
      const updated = [...state.multiple_location_table];
      if (index >= 0 && index < updated.length) {
        updated[index] = { ...updated[index], ...updatedData };
      }
      return { multiple_location_table: updated };
    }),
    reset:()=>set({billingAddress:{}})
}))