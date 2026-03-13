import { create } from 'zustand';

type DashboardCardCountStore = {
    cardCounts: Record<string, number>;
    setCardCounts: (counts: Record<string, number>) => void;
    updateCardCount: (key: string, value: number) => void;
    resetCardCounts: () => void;
}

export const useDashboardCardCountStore = create<DashboardCardCountStore>()(
    (set) => ({
        cardCounts: {},
        setCardCounts: (counts) => set({ cardCounts: counts }),
        updateCardCount: (key, value) =>
            set((state) => ({
                cardCounts: { ...state.cardCounts, [key]: value },
            })),
        resetCardCounts: () => set({ cardCounts: {} }),
    })
);