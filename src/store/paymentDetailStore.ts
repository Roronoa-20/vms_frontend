import { create } from 'zustand';

type paymentDetail = {
    bank_name:string,
    ifsc_code:string,
    account_number:string,
    name_of_account_holder:string,
    type_of_account:string,
    currency:string
    rtgs:number,
    neft:number,
    ift:number
}

type paymentStore = {
    paymentDetail:Partial<paymentDetail>,
    updatePaymentDetail:(field: keyof paymentDetail,value:any)=>void
}

export const usePaymentDetailStore = create<paymentStore>((set)=>({
    paymentDetail:{rtgs:1,neft:1,ift:1},
    updatePaymentDetail(field, value) {
        set((state)=>({
            paymentDetail:{
                ...state?.paymentDetail,
                [field]:value
            }
        }))
    },
}))