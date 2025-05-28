import { create } from 'zustand';
import { TCompanyDetailForm } from '../types/types';


type CompanyDetailFormStore = {
    data:Partial<TCompanyDetailForm>

    updateField:(field: keyof TCompanyDetailForm, value:any)=>void,

    resetForm: () => void
}

export const useCompanyDetailFormStore = create<CompanyDetailFormStore>((set)=>({
    data:{},
    updateField(field, value) {
        set((state)=>({
            data:{
                ...state?.data,
                [field]: value,
            },
        }))
    },
    resetForm:()=>set({data:{}})
}))