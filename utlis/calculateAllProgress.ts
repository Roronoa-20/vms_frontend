import { ASAFormTabs } from "@/src/constants/asaformtabs";
import { calculateSectionProgress } from "./calculateSectionProgress";

export const calculateAllProgress = (allForms: any) => {
  const progress: Record<string, number> = {};

  // First calculate all child sections
  Object.keys(allForms).forEach((key) => {
    progress[key] = calculateSectionProgress(allForms[key]);
  });

  // Now dynamically calculate parent tabs
  ASAFormTabs.forEach((tab) => {
    if (tab.children.length > 0) {
      const childProgress = tab.children
        .map(child => progress[child.key] || 0);

      const avg =
        childProgress.reduce((a, b) => a + b, 0) /
        childProgress.length;

      progress[tab.key] = Math.round(avg);
    }
  });

  return progress;
};