export const restoreFormFromStorage = <T>(
  storageKey: string,
  updateFn: (data: T) => void
) => {
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      const parsed: T = JSON.parse(stored);
      updateFn(parsed);
    } catch (err) {
      console.error(`Error restoring ${storageKey} from localStorage`, err);
    }
  }
};
