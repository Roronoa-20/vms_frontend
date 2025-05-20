import { create } from 'zustand';
import { TCompanyDetailForm } from '../types/types';

const defaultCompanyDetailForm:TCompanyDetailForm = {
    ref_no:"",
    vendor_onboarding:"",
    type_of_business:"",
    website:"",
    office_email_primary:"",
    office_email_secondary:"",
    telephone_number:"",
    whatsapp_number:"",
    cin_date:"",
    nature_of_company:"",
    size_of_company:"",
    registered_office_number:"",
    established_year:"",
    nature_of_business:"",
    corporate_identification_number:""
}


type CompanyDetailFormStore = {
    data:TCompanyDetailForm

    updateField:(field: keyof TCompanyDetailForm, value:any)=>void,

    resetForm: () => void
}

export const useCompanyDetailForm = create<CompanyDetailFormStore>((set)=>({
    data:defaultCompanyDetailForm,
    updateField(field, value) {
        set((state)=>({
            data:{
                ...state?.data,
                [field]: value,
            },
        }))
    },
    resetForm:()=>set({data:defaultCompanyDetailForm})
}))