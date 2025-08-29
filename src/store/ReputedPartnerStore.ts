import { create } from 'zustand';

export type TReputedPartner = {
    company_name: string,
    supplied_qtyyear: string,
    remarks: string
}

type ReputedPartnerStore = {
    reputedPartners: Partial<TReputedPartner>[],
    updateReputedPartner: (data: any) => void,
    reset: () => void
}

export const useReputedPartnerStore = create<ReputedPartnerStore>((set) => ({
    reputedPartners: [],
    updateReputedPartner: (data) => set((state) => ({
        reputedPartners: [...state.reputedPartners, data]
    })),
    reset: () => set({ reputedPartners: [] })
}))
