import { Contact } from 'lucide-react';
import { create } from 'zustand';
import ContactDetail from '../components/templates/vendor-detail-form/ContactDetail';

export type TcontactDetail = {
    first_name:string,
    last_name:string,
    designation:string,
    email:string,
    contact_number:string,
    department_name:string
}


type contactDetailStore = {
    contactDetail:TcontactDetail[],
    addContactDetail:(data:any)=>void
    resetContactDetail:()=>void;
}

export const useContactDetailStore = create<contactDetailStore>((set)=>({
    contactDetail:[],
    addContactDetail:(data:TcontactDetail)=>set((state)=>({
        contactDetail:[...state?.contactDetail,data]
    })),
    resetContactDetail:()=>set({contactDetail:[]})
}))