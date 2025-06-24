import { create } from "zustand";
import { persist } from "zustand/middleware";

type TPurchaseTeamAprovalStore = {
  bank_proof: File[]
  setBankProof: (file: any) => void;
  is_file_uploaded: boolean;
  setIsFileUploaded: (data: boolean) => void;
};

export const UsePurchaseTeamApprovalStore = create<TPurchaseTeamAprovalStore>
// ()
(
// persist(
  (set) => ({
    bank_proof: [],
    is_file_uploaded: false,
    setBankProof: (file) =>
      set((state) => ({
        bank_proof: [...(state?.bank_proof ?? []), file],
      })),
    setIsFileUploaded: (data) =>
      set(() => ({
        is_file_uploaded: data,
      })),
  }),
//   {
//     name: 'purchase-team-approval-storage', // key in localStorage
//   }
// )
);
