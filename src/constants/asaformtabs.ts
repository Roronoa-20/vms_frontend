export const ASAFormTabs = [
  {
    label: "General Disclosures",
    key: "general_disclosures",
    children: [
      { label: "Company Information", key: "company_information" },
      { label: "General Disclosures", key: "general_disclosures_sub" }
    ]
  },
  {
    label: "Environment",
    key: "environment",
    children: [
      { label: "Environmental Management System", key: "ems" },
      { label: "Energy Consumption and Emissions", key: "ece" },
      { label: "Water Consumption and Management", key: "wcm" },
      { label: "Waste Management", key: "waste_management" },
      { label: "Green Products", key: "green_products" },
      { label: "Biodiversity", key: "biodiversity" }
    ]
  },
  {
    label: "Social",
    key: "social",
    children: [
      { label: "Labor Rights and Working Conditions", key: "labor_rights" },
      { label: "Grievance Mechanism", key: "grievance_mechanism" },
      { label: "Employee Well-being", key: "employee_wellbeing" },
      { label: "Health & Safety", key: "health_safety" },
      { label: "Employee Satisfaction", key: "employee_satisfaction" }
    ]
  },
  {
    label: "Governance",
    key: "governance",
    children: []
  }
];


export const PARENT_CHILD_MAP: Record<string, string[]> = {
  general_disclosures: [
    "company_information",
    "general_disclosures_sub",
  ],
  environment: [
    "ems",
    "ece",
    "wcm",
    "waste_management",
    "green_products",
    "biodiversity",
  ],
  social: [
    "labor_rights",
    "grievance_mechanism",
    "employee_wellbeing",
    "health_safety",
    "employee_satisfaction",
  ],
};


export const calculateParentProgress = (
  parentKey: string,
  progress: Record<string, number>
) => {
  const children = PARENT_CHILD_MAP[parentKey];
  if (!children || children.length === 0) return progress[parentKey] ?? 0;

  const total = children.reduce(
    (sum, key) => sum + (progress[key] ?? 0),
    0
  );

  return Math.round(total / children.length);
};
