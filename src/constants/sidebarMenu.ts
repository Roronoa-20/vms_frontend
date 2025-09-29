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
    logo: "/sidebar-assests/view-pr.svg",
    name: "PR",
    href: "/pr-request",
    children: []
  },
  {
    logo: "/sidebar-assests/view-pr.svg",
    name: "MPR",
    href: "/view-pickup-request",
    children: []
  },
  // {
  //   logo: "/sidebar-assests/raise-rfq-logo.svg",
  //   name: "Raise RFQ",
  //   href: "/create-rfq"
  // },
  {
    logo: "/sidebar-assests/raise-rfq-logo.svg",
    name: "Raise RFQ",
    // href: "/create-rfq",
    children: [
      { logo: "/sidebar-assests/raise-rfq-logo.svg", name: "Create RFQ", href: "/create-rfq" },
      { logo: "/sidebar-assests/raise-rfq-logo.svg", name: "Shipment Status", href: "/view-shipment-status" },
      { logo: "/sidebar-assests/raise-rfq-logo.svg", name: "Service Bill", href: "/view-service-bill" },
    ],
  },
  {
    logo: "/sidebar-assests/po-details.svg",
    name: "View PO",
    href: "/view-po",
    children: []
  },
  {
    logo: "/sidebar-assests/purchase-enquiry-logo.svg",
    name: "Product Enquiry",
    href: "/pr-inquiry",
    children: []
  },
  {
    logo: "/sidebar-assests/view-pr.svg",
    name: "View PR",
    href: "/view-purchase-requisition",
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
    href: "/view-gr-waiver",
    children: []
  },
  // {
  //   logo: "/sidebar-assests/view-grn.svg",
  //   name: "Shipment Status",
  //   href: "/view-shipment-status",
  //   children: []
  // },
  // {
  //   logo: "/sidebar-assests/view-grn.svg",
  //   name: "Service bill",
  //   href: "/view-service-bill",
  //   children: []
  // },
  // {
  //   logo: "/sidebar-assests/dispatch-logo.svg",
  //   name: "View Dispatch",
  //   href:""
  // },
  // {
  //   logo: "/sidebar-assests/raise-payment-1.svg",
  //   name: "View Payment",
  //   href:""
  // },
  // {
  //   logo: "/sidebar-assests/purchase-enquiry-logo.svg",
  //   name: "Purchase Enquiry",
  //   href:""
  // },
  // {
  //   logo: "/sidebar-assests/complaint-box.svg",
  //   name: "Complain Box",
  //   href:""
  // },
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
    name: "Product Enquiry",
    href: "/pr-inquiry",
    children: []
  },
  {
    logo: "/sidebar-assests/view-pr.svg",
    name: "PR",
    href: "/pr-request",
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
  // {
  //   logo: "/sidebar-assests/raise-payment-1.svg",
  //   name: "View Payment",
  //   href:""
  // },
  // {
  //   logo: "/sidebar-assests/complaint-box.svg",
  //   name: "Complain Box",
  //   href:""
  // },
];


export const PurchaseHeadsidebarMenu: SidebarItem[] = [
  {
    logo: "/sidebar-assests/home-logo.svg",
    name: "Home",
    href: "/dashboard",
    defaultActive: true,
    children: []
  },
  // {
  //   logo: "/sidebar-assests/vendor-icon.svg",
  //   name: "Vendor Registration",
  //   href: "/vendor-registration"
  // },
  {
    logo: "/sidebar-assests/vendor-icon.svg",
    name: "All Vendors",
    href:"/all-vendors",
    children: []
  },
  // {
  //   logo: "/sidebar-assests/view-pr.svg",
  //   name: "PR",
  //   href:"/pr-request"
  // },
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
  // {
  //   logo: "/sidebar-assests/vendor-icon.svg",
  //   name: "PR",
  //   href:"/pr-request"
  // },
  {
    logo: "/sidebar-assests/purchase-enquiry-logo.svg",
    name: "Product Enquiry",
    href: "/pr-inquiry",
    children: []
  },
  // {
  //   logo: "/sidebar-assests/raise-rfq-logo.svg",
  //   name: "Raise RFQ",
  //   href:""
  // },
  {
    logo: "/sidebar-assests/view-pr.svg",
    name: "View PR",
    href: "/view-purchase-requisition",
    children: []
  },
  // {
  //   logo: "/sidebar-assests/po-details.svg",
  //   name: "View PO",
  //   href:""
  // },
  {
    logo: "/sidebar-assests/view-grn.svg",
    name: "View GRN",
    href: "/view-grn",
    children: []
  },
  // {
  //   logo: "/sidebar-assests/dispatch-logo.svg",
  //   name: "View Dispatch",
  //   href:""
  // },
  // {
  //   logo: "/sidebar-assests/raise-payment-1.svg",
  //   name: "View Payment",
  //   href:""
  // },
  // {
  //   logo: "/sidebar-assests/purchase-enquiry-logo.svg",
  //   name: "Purchase Enquiry",
  //   href:""
  // },
  // {
  //   logo: "/sidebar-assests/complaint-box.svg",
  //   name: "Complain Box",
  //   href:""
  // },
];


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
    logo: "/sidebar-assests/vendor-icon.svg",
    name: "PR",
    href: "/pr-request",
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
  // {
  //   logo: "/sidebar-assests/vendor-icon.svg",
  //   name: "Create PR",
  //   href: "/pr-request"
  // },
  {
    logo: "/sidebar-assests/raise-rfq-logo.svg",
    name: "Raise RFQ",
    href: "/create-rfq",
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
  // {
  //   logo: "/sidebar-assests/dispatch-logo.svg",
  //   name: "View Dispatch",
  //   href:""
  // },
  {
    logo: "/sidebar-assests/view-grn.svg",
    name: "View GRN",
    href: "/view-grn",
    children: []
  },

  // {
  //   logo: "/sidebar-assests/raise-payment-1.svg",
  //   name: "View Payment",
  //   href:""
  // },
  // {
  //   logo: "/sidebar-assests/complaint-box.svg",
  //   name: "Complain Box",
  //   href:""
  // },
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
    logo: "/sidebar-assests/dispatch-logo.svg",
    name: "Dispatch",
    href: "/dispatch",
    children: []
  },
  // {
  //   logo: "/sidebar-assests/raise-rfq-logo.svg",
  //   name: "Raise RFQ",
  //   href:""
  // },
  {
    logo: "/sidebar-assests/po-details.svg",
    name: "View PO",
    href: "/view-vendor-po",
    children: []
  },
  {
    logo: "/sidebar-assests/view-pr.svg",
    name: "ASA Form",
    href: "/asa-form",
    children: []
  },
  // {
  //   logo: "/sidebar-assests/po-details.svg",
  //   name: "View PO",
  //   href:""
  // },
  // {
  //   logo: "/sidebar-assests/view-grn.svg",
  //   name: "View GRN",
  //   href:""
  // },
  // {
  //   logo: "/sidebar-assests/dispatch-logo.svg",
  //   name: "View Dispatch",
  //   href:""
  // },
  // {
  //   logo: "/sidebar-assests/raise-payment-1.svg",
  //   name: "View Payment",
  //   href:""
  // },
  // {
  //   logo: "/sidebar-assests/purchase-enquiry-logo.svg",
  //   name: "Purchase Enquiry",
  //   href:""
  // },
  // {
  //   logo: "/sidebar-assests/complaint-box.svg",
  //   name: "Complain Box",
  //   href:""
  // },
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
    name: "Enquiry",
    href: "/pr-inquiry",
    children: []
  },
  {
    logo: "/sidebar-assests/view-pr.svg",
    name: "PR",
    href: "/pr-request",
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
    name: "PR",
    href: "/pr-request",
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
  // {
  //   logo: "/sidebar-assests/vendor-icon.svg",
  //   name: "Vendor Registration",
  //   href: "/vendor-registration"
  // },
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
