// stores/useVendorStore.ts
import { create } from 'zustand';
import { VendorRegistrationData } from '../types/types';

// Default empty values for the form
// const defaultVendorData: VendorRegistrationData = {
//   vendor_title: '',
//   vendor_name: '',
//   office_email_primary: '',
//   search_term: '',
//   country: '',
//   mobile_number: '',
//   registered_date: '',
//   qa_required: '',
//   qms_required: 0,
//   multiple_company_data: [],
//   vendor_types: [],
//   purchase_organization: '',
//   account_group: '',
//   purchase_group: '',
//   terms_of_payment: '',
//   order_currency: '',
//   incoterms: '',
//   company_name:''
// };

// Define the store type
type VendorStore = {
  data: Partial<VendorRegistrationData>;

  // Update any single field
  updateField: (field: keyof VendorRegistrationData, value: any) => void;

  // Update company list
//   updateCompanyData: (companies: VendorRegistrationData['multiple_company_data']) => void;

  // Update vendor types
  updateVendorTypes: (types: VendorRegistrationData['vendor_types']) => void;

  // Reset the form
  resetForm: () => void;
};

// Zustand store (no persistence)
export const useVendorStore = create<VendorStore>((set) => ({
  data: "",

  updateField: (field, value) =>
    set((state) => ({
      data: {
        ...state.data,
        [field]: value,
      },
    })),

//   updateCompanyData: (companies) =>
//     set((state) => ({
//       data: {
//         ...state.data,
//         multiple_company_data: companies,
//       },
//     })),

  updateVendorTypes: (types) =>
    set((state) => ({
      data: {
        ...state.data,
        vendor_types: types,
      },
    })),

  resetForm: () => set({ data: {} }),
}));
