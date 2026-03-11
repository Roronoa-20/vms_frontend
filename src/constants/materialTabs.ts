export const getMaterialTabs = (
  role: string,
  showAllFields: boolean,
  isZCAP: boolean
) => {
  const tabs = [
    {
      id: "basic-data",
      label: "Requestor Master",
    },
  ];

  if (showAllFields && ["Material CP", "Store"].includes(role)) {
    tabs.push({ id: "store-data", label: "Store Data" });
    tabs.push({ id: "purchasing-data", label: "Purchasing Data" });
    tabs.push({ id: "mrp-data", label: "MRP Data" });

    if (!isZCAP) {
      tabs.push({ id: "qa-qc-data", label: "QA/QC Data" });
    }

    tabs.push({ id: "others-data", label: "Others Data" });

    if (!isZCAP) {
      tabs.push({
        id: "specifications",
        label: "Character and specification",
      });
    }

    tabs.push({ id: "comments", label: "Comment" });
  }

  return tabs;
};