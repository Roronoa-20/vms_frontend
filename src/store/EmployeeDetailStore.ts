import { create } from 'zustand';

type TEmployeeDetail = {
    qaqc:string,
    logistics:string,
    marketing:string,
    r_d:string,
    hse:string,
    other:string,
    production:string
}

type EmployeeDetailStore = {
    employeeDetail:Partial<TEmployeeDetail>,
    updateEmployeeDetail:(field: keyof TEmployeeDetail, value:any)=>void
}

export const useEmployeeDetailStore = create<EmployeeDetailStore>((set)=>({
    employeeDetail:{},
    updateEmployeeDetail(field,value){
        set((state)=>({
            employeeDetail:{
                ...state?.employeeDetail,
                [field]:value
            }
        }))
    }
}))