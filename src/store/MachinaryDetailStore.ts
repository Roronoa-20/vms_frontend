import { create } from 'zustand';

export type TMachineDetail = {
    equipment_name:string,
    equipment_qty:string,
    capacity:string,
    remarks:string,
}

type MachineDetailStore = {
    machineDetail:Partial<TMachineDetail>[],
    updateMachineDetail:(data:any)=>void,
    resetMachineDetail:()=>void
}


export const useMachineDetailStore = create<MachineDetailStore>((set)=>({
    machineDetail:[],
    updateMachineDetail:(data)=>set((state)=>({
        machineDetail:[...state?.machineDetail,data]
    })),
    resetMachineDetail:()=>set({machineDetail:[]})
}))