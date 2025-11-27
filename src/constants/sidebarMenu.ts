import { SidebarItem } from "@/src/types/sidebar";


export const sidebarMenu: SidebarItem[] = [
  {
    logo: "/sidebar-assests/home-logo.svg",
    name: "Home",
    href: "/dashboard",
    defaultActive: true,
    children: []
  },
  {
    logo: "/sidebar-assests/vendor-icon.svg",
    name: "Vendor Registration",
    href: "/vendor-registration",
    children: []
  },
  {
    logo: "/sidebar-assests/vendor-icon.svg",
    name: "All Vendors",
    href:"/all-vendors",
    children: []
  },
  {
    logo: "/sidebar-assests/purchase-enquiry-logo.svg",
    name: "View Enquiry",
    href: "/view-pr-inquiry-table",
    children: []
  },
  {
    logo: "/sidebar-assests/view-pr.svg",
    name: "View PR",
    href: "/view-purchase-requisition",
    children: []
  },
  {
    logo: "/sidebar-assests/raise-rfq-logo.svg",
    name: "Raise RFQ",
    // href: "/create-rfq",
    children: [
      { logo: "/sidebar-assests/raise-rfq-logo.svg", name: "Create RFQ", href: "/create-rfq" },
      //{ logo: "/sidebar-assests/raise-rfq-logo.svg", name: "Shipment Status", href: "/view-shipment-status" },
      { logo: "/sidebar-assests/raise-rfq-logo.svg", name: "Shipment Status", href: "/shipment-status-dashboard" },
      { logo: "/sidebar-assests/raise-rfq-logo.svg", name: "Service Bill", href: "/service-bill-dashboard" },
    ],
  },
  {
    logo: "/sidebar-assests/po-details.svg",
    name: "View PO",
    href: "/view-po",
    children: []
  },
  {
    logo: "/sidebar-assests/dispatch-logo.svg",
    name: "View Dispatch",
    href: "/view-dispatch-table",
    children: []
  },
  {
    logo: "/sidebar-assests/view-pr.svg",
    name: "View MPN",
    href: "/pickup-dashboard",
    children: []
  },
  {
    logo: "/sidebar-assests/view-grn.svg",
    name: "View GRN",
    href: "/view-grn",
    children: []
  },
  {
    logo: "/sidebar-assests/view-grn.svg",
    name: "View GR Waiver",
    href: "/gr-waiver-dashboard",
    children: []
  },
  {
    logo: "/sidebar-assests/view-grn.svg",
    name: "View Payment",
    href: "/view-payment-requisition",
    children: []
  },
  {
    logo: "/sidebar-assests/view-grn.svg",
    name: "View Gate Entry",
    href: "/gate-entry-dashboard",
    children: []
  },
];

export const SuperHeadSidebarMenu: SidebarItem[] = [
  {
    logo: "/sidebar-assests/home-logo.svg",
    name: "Home",
    href: "/head-dashboard",
    defaultActive: true,
    children: []
  },
  {
    logo: "/sidebar-assests/vendor-icon.svg",
    name: "Vendor Registration",
    href: "/vendor-registration",
    children: []
  },
  {
    logo: "/sidebar-assests/vendor-icon.svg",
    name: "All Vendors",
    href:"/all-vendors",
    children: []
  },
  {
    logo: "/sidebar-assests/purchase-enquiry-logo.svg",
    name: "View Product Enquiry",
    href: "/view-pr-inquiry-table",
    children: []
  },
  {
    logo: "/sidebar-assests/view-pr.svg",
    name: "View PR",
    href: "/view-purchase-requisition",
    children: []
  },
  {
    logo: "/sidebar-assests/raise-rfq-logo.svg",
    name: "Raise RFQ",
    href: "/create-rfq",
    children: []
  },
  {
    logo: "/sidebar-assests/po-details.svg",
    name: "View PO",
    href: "/view-po",
    children: []
  },
  {
    logo: "/sidebar-assests/dispatch-logo.svg",
    name: "View Dispatch",
    href:"",
    children: []
  },
  {
    logo: "/sidebar-assests/view-grn.svg",
    name: "View GRN",
    href: "/view-grn",
    children: []
  },
  {
    logo: "/sidebar-assests/view-grn.svg",
    name: "GR Waiver",
    href: "/gr-waiver-dashboard",
    children: []
  },
  {
    logo: "/sidebar-assests/view-grn.svg",
    name: "Payment",
    href: "/view-payment-requisition",
    children: []
  },
  {
    logo: "/sidebar-assests/view-grn.svg",
    name: "Gate Entry",
    href: "/gate-entry-dashboard",
    children: []
  },
];

export const PurchaseHeadsidebarMenu: SidebarItem[] = [
  {
    logo: "/sidebar-assests/home-logo.svg",
    name: "Home",
    href: "/dashboard",
    defaultActive: true,
    children: []
  },
  {
    logo: "/sidebar-assests/vendor-icon.svg",
    name: "All Vendors",
    href:"/all-vendors",
    children: []
  },
  {
    logo: "/sidebar-assests/purchase-enquiry-logo.svg",
    name: "View Enquiry",
    href: "/view-pr-inquiry-table",
    children: []
  },
  {
    logo: "/sidebar-assests/view-pr.svg",
    name: "View PR",
    href: "/view-purchase-requisition",
    children: []
  },
  {
    logo: "/sidebar-assests/po-details.svg",
    name: "View PO",
    href: "/view-po",
    children: []
  },
  {
    logo: "/sidebar-assests/dispatch-logo.svg",
    name: "View Dispatch",
    href: "/view-dispatch-table",
    children: []
  },
  {
    logo: "/sidebar-assests/view-grn.svg",
    name: "View GRN",
    href: "/view-grn",
    children: []
  },
  {
    logo: "/sidebar-assests/view-grn.svg",
    name: "GR Waiver",
    href: "/gr-waiver-dashboard",
    children: []
  },
  {
    logo: "/sidebar-assests/view-grn.svg",
    name: "Payment",
    href: "/view-payment-requisition",
    children: []
  },
  {
    logo: "/sidebar-assests/view-grn.svg",
    name: "Gate Entry",
    href: "/gate-entry-dashboard",
    children: []
  },
];

export const StoreSideBar: SidebarItem[] = [
  {
    logo: "/sidebar-assests/home-logo.svg",
    name: "Home",
    href: "/gate-entry-dashboard",
    children: []
  },
  {
    logo: "/sidebar-assests/vendor-icon.svg",
    name: "View Gate Entry",
    href: "/gate-entry",
    children: []
  }
]


export const MaterialUserSideBar: SidebarItem[] = [
  {
    logo: "/sidebar-assests/home-logo.svg",
    name: "Home",
    href: "/material-onboarding-dashboard",
    children: []
  },
  {
    logo: "/sidebar-assests/vendor-icon.svg",
    name: "Raise Request",
    href: "/new-material-code-request-table",
    children: []
  }
]

export const MaterialCPSideBar: SidebarItem[] = [
  {
    logo: "/sidebar-assests/home-logo.svg",
    name: "Home",
    href: "/material-onboarding-dashboard",
    children: []
  },
  {
    logo: "/sidebar-assests/vendor-icon.svg",
    name: "View Request",
    href: "/view-material-code-request",
    children: []
  }
]

export const HeadSidebar: SidebarItem[] = [
  {
    logo: "/sidebar-assests/home-logo.svg",
    name: "Home",
    href: "/dashboard",
    defaultActive: true,
    children: []
  },
  {
    logo: "/sidebar-assests/vendor-icon.svg",
    name: "All Vendors",
    href:"/all-vendors",
    children: []
  },
  {
    logo: "/sidebar-assests/po-details.svg",
    name: "View PO",
    href: "/view-po",
    children: []
  },
  {
    logo: "/sidebar-assests/view-pr.svg",
    name: "View PR",
    href: "/view-purchase-requisition",
    children: []
  },
  {
    logo: "/sidebar-assests/po-details.svg",
    name: "View PO",
    href: "/view-po",
    children: []
  },
  {
    logo: "/sidebar-assests/view-grn.svg",
    name: "View GRN",
    href: "/view-grn",
    children: []
  },
];

export const VendorsidebarMenu: SidebarItem[] = [
  {
    logo: "/sidebar-assests/home-logo.svg",
    name: "Home",
    href: "/vendor-dashboard",
    defaultActive: true,
    children: []
  },
  {
    logo: "/sidebar-assests/po-details.svg",
    name: "View PO",
    href: "/view-vendor-po",
    children: []
  },
  {
    logo: "/sidebar-assests/dispatch-logo.svg",
    name: "Dispatch",
    href: "/vendor-dispatch-table",
    children: []
  },
  {
    logo: "/sidebar-assests/view-pr.svg",
    name: "ASA Form",
    href: "/asa-form",
    children: []
  },
];

export const EnquirysidebarMenu: SidebarItem[] = [
  {
    logo: "/sidebar-assests/home-logo.svg",
    name: "Home",
    href: "/dashboard",
    defaultActive: true,
    children: []
  },
  {
    logo: "/sidebar-assests/purchase-enquiry-logo.svg",
    name: "Raise Enquiry",
    href: "/pr-inquiry",
    children: []
  },
  {
    logo: "/sidebar-assests/view-pr.svg",
    name: "View PR",
    href: "/view-purchase-requisition",
    children: []
  },
];

export const ASASideBarMenu: SidebarItem[] = [
  {
    logo: "/sidebar-assests/home-logo.svg",
    name: "Home",
    href: "/dashboard",
    defaultActive: true,
    children: []
  },
  {
    logo: "/sidebar-assests/vendor-icon.svg",
    name: "ASA",
    href: "/view-vendor-asa",
    children: []
  },
];

export const QASideBarMenu: SidebarItem[] = [
  {
    logo: "/sidebar-assests/home-logo.svg",
    name: "Home",
    href: "/qa-dashboard",
    defaultActive: true,
    children: []
  },
  {
    logo: "/sidebar-assests/vendor-icon.svg",
    name: "QMS Form List",
    href:"/all-qms-forms",
    children: []
  },
  {
    logo: "/sidebar-assests/vendor-icon.svg",
    name: "ASL",
    href:"/view-asl",
    children: []
  },
];

export const AccountSideBarMenu: SidebarItem[] = [
  {
    logo: "/sidebar-assests/home-logo.svg",
    name: "Home",
    href: "/dashboard",
    defaultActive: true,
    children: []
  },
  {
    logo: "/sidebar-assests/vendor-icon.svg",
    name: "Vendor Registration",
    href: "/vendor-registration",
    children: []
  },
  {
    logo: "/sidebar-assests/vendor-icon.svg",
    name: "All Vendors",
    href:"/all-vendors",
    children: []
  },
  {
    logo: "/sidebar-assests/view-pr.svg",
    name: "View PR",
    href: "/view-purchase-requisition",
    children: []
  },
  {
    logo: "/sidebar-assests/po-details.svg",
    name: "View PO",
    href: "/view-po",
    children: []
  },
  {
    logo: "/sidebar-assests/view-grn.svg",
    name: "View GRN",
    href: "/view-grn",
    children: []
  }
];


export const AccountHeadSideBarMenu: SidebarItem[] = [
  {
    logo: "/sidebar-assests/home-logo.svg",
    name: "Home",
    href: "/dashboard",
    defaultActive: true,
    children: []
  },
  {
    logo: "/sidebar-assests/vendor-icon.svg",
    name: "All Vendors",
    href:"/all-vendors",
    children: []
  },
  {
    logo: "/sidebar-assests/view-pr.svg",
    name: "View PR",
    href: "/view-purchase-requisition",
    children: []
  },
  {
    logo: "/sidebar-assests/po-details.svg",
    name: "View PO",
    href: "/view-po",
    children: []
  },
  {
    logo: "/sidebar-assests/view-grn.svg",
    name: "View GRN",
    href: "/view-grn",
    children: []
  }
];

export const TreasurySideBarMenu: SidebarItem[] = [
  {
    logo: "/sidebar-assests/home-logo.svg",
    name: "Home",
    href: "/dashboard",
    defaultActive: true,
    children: []
  },
   {
    logo: "/sidebar-assests/vendor-icon.svg",
    name: "All Vendors",
    href:"/all-vendors",
    children: []
  },
  {
    logo: "/sidebar-assests/po-details.svg",
    name: "View PO",
    href: "/view-po",
    children: []
  },
  {
    logo: "/sidebar-assests/view-grn.svg",
    name: "View GRN",
    href: "/view-grn",
    children: []
  },
];

export const FinanceSideBarMenu: SidebarItem[] = [
  {
    logo: "/sidebar-assests/home-logo.svg",
    name: "Home",
    href: "/finance-dashboard",
    defaultActive: true,
    children: []
  },
   {
    logo: "/sidebar-assests/vendor-icon.svg",
    name: "All Vendors",
    href:"/all-vendors",
    children: []
  },
  {
    logo: "/sidebar-assests/view-pr.svg",
    name: "View PR",
    href: "/view-purchase-requisition",
    children: []
  },
  {
    logo: "/sidebar-assests/po-details.svg",
    name: "View PO",
    href: "/view-po",
    children: []
  },
];
