import { create } from 'zustand';

export type TEmployeeDetail = {
    qaqc:string,
    logistics:string,
    marketing:string,
    r_d:string,
    hse:string,
    other:string,
    production:string
}

type EmployeeDetailStore = {
    employeeDetail:Partial<TEmployeeDetail>[],
    updateEmployeeDetail:(data:any)=>void
}

export const useEmployeeDetailStore = create<EmployeeDetailStore>((set)=>({
    employeeDetail:[],
    updateEmployeeDetail:(data)=>set((state)=>({
        employeeDetail:[...state?.employeeDetail,data]
    }))
}))