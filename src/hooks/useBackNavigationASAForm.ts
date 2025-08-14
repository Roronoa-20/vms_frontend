import { useRouter } from "next/navigation";
import { restoreFormFromStorage } from "@/src/app/utils/formStorageUtils";

export const useBackNavigation = <T>(
  storageKey: string,
  updateFn: (data: T) => void,
  previousTab: string,
  vmsRefNo: string
) => {
  const router = useRouter();

  const handleBack = () => {
    restoreFormFromStorage<T>(storageKey, updateFn);
    router.push(`asa-form?tabtype=${previousTab}&vms_ref_no=${vmsRefNo}`);
  };

  return handleBack;
};