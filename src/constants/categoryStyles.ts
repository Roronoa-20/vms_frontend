// src/constants/categoryStyles.ts

export const categoryColorMap: Record<
  string,
  { text: string; bg: string; hover: string }
> = {
  "IT GOODS": {
    text: "text-blue-800",
    bg: "bg-blue-100",
    hover: "hover:border-blue-400",
  },
  "IT Service": {
    text: "text-emerald-800",
    bg: "bg-emerald-100",
    hover: "hover:border-emerald-400",
  },
  "SUPPLYCHAIN": {
    text: "text-purple-800",
    bg: "bg-purple-100",
    hover: "hover:border-purple-400",
  },
  "IPR": {
    text: "text-yellow-800",
    bg: "bg-yellow-100",
    hover: "hover:border-yellow-400",
  },
  "INSURANCE": {
    text: "text-orange-800",
    bg: "bg-orange-100",
    hover: "hover:border-orange-400",
  },
  "REAL EST": {
    text: "text-rose-800",
    bg: "bg-rose-100",
    hover: "hover:border-rose-400",
  },
  "REGULATORY": {
    text: "text-indigo-800",
    bg: "bg-indigo-100",
    hover: "hover:border-indigo-400",
  },
  "R&D SERVIC": {
    text: "text-blue-800",
    bg: "bg-blue-100",
    hover: "hover:border-blue-400",
  },
  "SAFETY": {
    text: "text-indigo-800",
    bg: "bg-indigo-100",
    hover: "hover:border-indigo-400",
  },
  "HRD": {
    text: "text-indigo-800",
    bg: "bg-indigo-100",
    hover: "hover:border-indigo-400",
  },
  "DIGITAL MKTG": {
    text: "text-indigo-800",
    bg: "bg-indigo-100",
    hover: "hover:border-indigo-400",
  },
};

// fallback for categories not defined
export const fallbackColors = {
  text: "text-gray-700",
  bg: "bg-gray-100",
  hover: "hover:border-gray-400",
};

// -------- ICON MAP ---------

// export const categoryIconMap: Record<string, string> = {
//   "IT GOODS": "/dashboard-assests/cards_icon/it_goods.svg",
//   "IT Service": "/dashboard-assests/cards_icon/it_service.svg",
//   "MEDICAL EQUIPMENT": "/dashboard-assests/cards_icon/medical.svg",
//   "LAB EQUIPMENT": "/dashboard-assests/cards_icon/lab.svg",
//   "OFFICE SUPPLIES": "/dashboard-assests/cards_icon/office.svg",
//   "Purchase Enquiry": "/dashboard-assests/cards_icon/enquiry.svg",
//   "Purchase Requisition Request": "/dashboard-assests/cards_icon/pr.svg",
// };

// fallback icon
// export const fallbackIcon = "/dashboard-assests/cards_icon/doc.svg";
