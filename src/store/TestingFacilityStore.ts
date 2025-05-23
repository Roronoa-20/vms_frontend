import { create } from 'zustand';

export type TTestingFacility = {
    equipment_name:string,
    equipment_qty:string,
    capacity:string,
    remarks:string
}

type TestingDetailStore = {
    testingDetail:Partial<TTestingFacility>[],
    updateTestingDetail:(data:any)=>void
}


export const useTestingStore = create<TestingDetailStore>((set)=>({
    testingDetail:[],
    updateTestingDetail:(data)=>set((state)=>({
        testingDetail:[...state?.testingDetail,data]
    }))
}))