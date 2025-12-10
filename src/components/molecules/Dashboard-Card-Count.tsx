"use client";
import Image from "next/image";
import {
  dashboardCardData,
  DashboardPOTableData,
  DashboardPOTableItem,
  DashboardTableType,
  PurchaseRequisition,
  RFQTable,
  TPRInquiryTable,
  TvendorRegistrationDropdown,
} from "@/src/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PurchaseAndOngoingOrders from "./Purchase-and-Ongoing-Orders-Table";
import DashboardTotalVendorsTable from "./Dashboard-Total-Vendors-Table";
import DashboardPendingVendorsTable from "./Dashboard-Pending-Vendors-Table";
import DashboardApprovedVendorsTable from "./Dashboard-Approved-Vendors-Table";
import DashboardRejectedVendorsTable from "./Dashboard-Rejected-Vendors-Table";
import DashboardASAOnboardedVendorsList from "./Dashboard-ASA-Onboarded-Vendors-List";
import DashboardASAFormTable from "./Dashboard-ASA-Vendors-Form-Table";
import DashboardASAPendingVendorFormTableList from "./Dashboard-ASA-Pending-Vendor-List";
import DashboardDispatchVendorsTable from "./Dashboard-Dispatch-Vendors-Table";
import DashboardPaymentVendorsTable from "./Dashboard-Payment-Vendors-Table";
import DashboardCurrentMonthsVendorsTable from "./Dashboard-Current-Months-Vendors-Table";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import Cookies from "js-cookie";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/select";
import { useMultipleVendorCodeStore } from "@/src/store/MultipleVendorCodeStore";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import DashboardPurchaseEnquiryTable from "./Dashboard-Purchase-Enquiry-Table";
import DashboardPurchaseRequisitionTable from "./Dashboard-Purchase-Requisition-Table";
import { FileSearch } from "lucide-react";
import DashboardRFQTable from "./Dashboard-RFQ-Table";
import ASAVendorMonthWiseChart from "./ASAVendorMonthWiseChart";
import DashboardSAPErrorTable from "./Dashboard-SAPError-Table";
import DashboardAccountsPendingTable from "./Dashboard-Accounts-Pending-Table";
import DashboardAccountsOnboardedTable from "./Dashboard-Accounts-Onboarded-Table";
import DashboardAccountsRejectedTable from "./Dashboard-Accounts-Rejected-Table";
import DashboardAccountsSAPErrorTable from "./Dashboard-Accounts-SAPError-Table";

type Props = {
  cardData: dashboardCardData;
  dashboardPOTableData: DashboardPOTableData["message"];
  dashboardTotalVendorTableData: DashboardTableType;
  dashboardPendingVendorTableData: DashboardTableType;
  dashboardApprovedVendorTableData: DashboardTableType;
  dashboardRejectedVendorTableData: DashboardTableType["rejected_vendor_onboarding"];
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"];
  filterregisteredby: TvendorRegistrationDropdown["message"]["data"]["users_list"];
  prInquiryData: TPRInquiryTable;
  prData: PurchaseRequisition[];
  rfqData: RFQTable;
  dashboardASAFormTableData: DashboardTableType["asa_form_data"];
  dashboardASAPendingVendorListTableData: DashboardTableType["asa_form_data"];
  sapErrorDashboardData: DashboardTableType["sapErrorDashboardData"];
  dashboardAccountsPending: any;
  dashboardAccountsOnboarded: any;
  dashboardAccountsRejected: any;
  dashboardAccountsSapErrors: any;
  ASAdashboardOnboardedVendorListTableData: DashboardTableType["asa_form_data"];
};

const DashboardCards = ({ ...Props }: Props) => {
  console.log(Props?.cardData, "this is card data");
  const { MultipleVendorCode } = useMultipleVendorCodeStore();
  const { designation } = useAuth();
  const user = designation as string;
  const [loading, setLoading] = useState<boolean>(true);

  console.log(user, "this is desingation");
  let allCardData: any[] = [];

  if (user === "ASA") {
    allCardData = [
      {
        name: "Total Onboarded Vendor",
        count: Props.ASAdashboardOnboardedVendorListTableData?.overall_count ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-emerald-800",
        bg_color: "bg-emerald-100",
        hover: "hover:border-emerald-400",
      },
      {
        name: "Submitted ASA Form",
        count: Props.dashboardASAFormTableData?.overall_total_asa ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
      {
        name: "Pending ASA Form",
        count: Props.dashboardASAPendingVendorListTableData?.overall_count ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-rose-800",
        bg_color: "bg-rose-100",
        hover: "hover:border-rose-400",
      },
    ];
  } else if (user == "Purchase Team" || user == "Purchase Head") {
    allCardData = [
      {
        name: "Pending Vendors",
        count: Props.cardData?.pending_vendor_count ?? 0,
        icon: "/dashboard-assests/cards_icon/doc.svg",
        text_color: "text-rose-800",
        bg_color: "bg-rose-100",
        hover: "hover:border-rose-400",
      },
      {
        name: "Onboarded Vendors",
        count: Props.cardData?.approved_vendor_count ?? 0,
        icon: "/dashboard-assests/cards_icon/tick.svg",
        text_color: "text-emerald-800",
        bg_color: "bg-emerald-100",
        hover: "hover:border-emerald-400",
      },
      {
        name: "Rejcted Vendors",
        count: Props.cardData?.rejected_vendor_count ?? 0,
        icon: "/dashboard-assests/cards_icon/doc.svg",
        text_color: "text-rose-800",
        bg_color: "bg-rose-100",
        hover: "hover:border-rose-400",
      },
      // {
      //   name: "Dispatch Details",
      //   count: 0,
      //   icon: "/dashboard-assests/cards_icon/truck.svg",
      //   text_color: "text-blue-800",
      //   bg_color: "bg-blue-100",
      //   hover: "hover:border-blue-400",
      // },

      // {
      //   name: "Payment Request",
      //   count: 0,
      //   icon: "/dashboard-assests/cards_icon/hand.svg",
      //   text_color: "text-orange-800",
      //   bg_color: "bg-orange-100",
      //   hover: "hover:border-orange-400",
      // },
      // {
      //   name: "Current Month Vendors",
      //   count: Props.cardData?.current_month_vendor ?? 0,
      //   icon: "/dashboard-assests/cards_icon/calender.svg",
      //   text_color: "text-black-800",
      //   bg_color: "bg-gray-100",
      //   hover: "hover:border-gray-400",
      // },

      {
        name: "Purchase Enquiry",
        count: Props.cardData?.cart_count ?? 0,
        icon: "/dashboard-assests/cards_icon/doc.svg",
        text_color: "text-rose-800",
        bg_color: "bg-rose-100",
        hover: "hover:border-rose-400",
      },
      {
        name: "Purchase Requisition Request",
        subname: "Generated through VMS",
        count: Props.cardData?.pr_count ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-rose-800",
        bg_color: "bg-green-200",
        hover: "hover:border-rose-400",
      },
      {
        name: "Purchase & Ongoing Orders",
        count: Props.cardData?.purchase_order_count ?? 0,
        icon: "/dashboard-assests/cards_icon/package.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
      {
        name: "RFQ Comparision",
        count: Props?.rfqData?.overall_total_rfq ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
      {
        name: "SAP Error Log",
        count: Props?.cardData?.sap_error_vendor_count ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
    ];
  } else if (designation === "Treasury") {
    allCardData = [
      {
        name: "Pending Vendors",
        count: Props.cardData?.pending_vendor_count ?? 0,
        icon: "/dashboard-assests/cards_icon/doc.svg",
        text_color: "text-rose-800",
        bg_color: "bg-rose-100",
        hover: "hover:border-rose-400",
      },
      {
        name: "Accounts Pending Vendors",
        count: Props?.cardData?.pending_vendor_count_by_accounts_team ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
      {
        name: "Onboarded Vendors",
        count: Props.cardData?.approved_vendor_count ?? 0,
        icon: "/dashboard-assests/cards_icon/tick.svg",
        text_color: "text-emerald-800",
        bg_color: "bg-emerald-100",
        hover: "hover:border-emerald-400",
      },
      {
        name: "Accounts Onboarded Vendors",
        count: Props?.cardData?.approved_vendor_count_by_accounts_team ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
    ];
  } else {
    allCardData = [
      {
        name: "Pending Vendors",
        count: Props.cardData?.pending_vendor_count ?? 0,
        icon: "/dashboard-assests/cards_icon/doc.svg",
        text_color: "text-rose-800",
        bg_color: "bg-rose-100",
        hover: "hover:border-rose-400",
      },
      {
        name: "Onboarded Vendors",
        count: Props.cardData?.approved_vendor_count ?? 0,
        icon: "/dashboard-assests/cards_icon/tick.svg",
        text_color: "text-emerald-800",
        bg_color: "bg-emerald-100",
        hover: "hover:border-emerald-400",
      },
      {
        name: "Rejcted Vendors",
        count: Props.cardData?.rejected_vendor_count ?? 0,
        icon: "/dashboard-assests/cards_icon/doc.svg",
        text_color: "text-rose-800",
        bg_color: "bg-rose-100",
        hover: "hover:border-rose-400",
      },
      {
        name: "SAP Error Log",
        count: Props?.cardData?.sap_error_vendor_count ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
      {
        name: "Accounts Pending Vendors",
        count: Props?.cardData?.pending_vendor_count_by_accounts_team ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
      {
        name: "Accounts Onboarded Vendors",
        count: Props?.cardData?.approved_vendor_count_by_accounts_team ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
      {
        name: "Accounts Rejected Vendors",
        count: Props?.cardData?.rejected_vendor_count_by_accounts_team ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
      {
        name: "Accounts SAP Error Log",
        count: Props?.cardData?.sap_error_vendor_count_by_accounts_team ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
    ];
  }

  let EnquirerCard = [
    {
      name: "Purchase Enquiry",
      count: Props.cardData?.cart_count ?? 0,
      icon: "/dashboard-assests/cards_icon/doc.svg",
      text_color: "text-rose-800",
      bg_color: "bg-rose-100",
      hover: "hover:border-rose-400",
    },
    {
      name: "Purchase Requisition Request",
      subname: "Generated through VMS",
      count: Props.cardData?.pr_count ?? 0,
      icon: "/dashboard-assests/cards_icon/file-search.svg",
      text_color: "text-rose-800",
      bg_color: "bg-green-200",
      hover: "hover:border-rose-400",
    },
  ];


  let cardData = user === "Enquirer" ? EnquirerCard : allCardData;

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const fetchPoBasedOnVendorCode = async () => {
    const url = `${API_END_POINTS?.vendorPOTable}?vendor_code`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      {user === "Vendor" && (
        <div className="flex justify-start pb-4 gap-6">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Vendor code" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="w-full">
                {MultipleVendorCode?.map((item, index) => (
                  <SelectItem key={index} value={item?.vendor_code as string}>
                    {item?.company_name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
      <Tabs defaultValue={cardData?.[0]?.name} className="">
        <div className="">
          <TabsList className="grid grid-cols-4 gap-4 h-full pb-6 bg-white">
            {cardData?.map((item, index) => (
              <TabsTrigger
                key={item.name || index}
                value={item.name}
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-black text-gray-500 rounded-2xl p-0 transition-all duration-300 ease-in-out">
                <div className={`group w-full h-full rounded-2xl ${item.bg_color} flex flex-col p-3 ${item.text_color} h-28 justify-between border-2 ${item.hover} hover:scale-105 transition duration-300 transform cursor-pointer shadow-md`}>
                  <div className="flex w-full justify-between items-center">
                    <div className="flex flex-col">
                      <h1 className="text-[14px] leading-none">{item.name}</h1>
                      {item.subname && (
                        <span className="text-left text-[12px] text-gray-600">({item.subname})</span>
                      )}
                    </div>
                    <Image src={item.icon} alt="" width={25} height={30} />
                  </div>
                  <div className="text-[20px] text-start font-bold">
                    {item.count}
                  </div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {cardData.map((item, index) => {
          if (user === "ASA") {
            return (
              <TabsContent key={item.name} value={item.name}>
                {item.name === "Total Onboarded Vendor" && (
                  <DashboardASAOnboardedVendorsList
                    dashboardTableData={
                      Props.ASAdashboardOnboardedVendorListTableData
                    }
                    companyDropdown={Props?.companyDropdown}
                  />
                )}
                {item.name === "Submitted ASA Form" && (
                  <>
                    <DashboardASAFormTable
                      dashboardTableData={Props.dashboardASAFormTableData}
                      companyDropdown={Props?.companyDropdown}
                    />
                    <ASAVendorMonthWiseChart
                      tableData={Props.dashboardASAFormTableData.data || []}
                    />
                  </>
                )}
                {item.name === "Pending ASA Form" && (
                  <DashboardASAPendingVendorFormTableList
                    dashboardTableData={
                      Props.dashboardASAPendingVendorListTableData
                    }
                    companyDropdown={Props?.companyDropdown}
                  />
                )}
              </TabsContent>
            );
          }
          const isEnquirerAllowed =
            user !== "Enquirer" ||
            item.name === "Purchase Enquiry" ||
            item.name === "Purchase Requisition Request";

          return isEnquirerAllowed ? (
            <TabsContent key={item.name || index} value={item.name}>
              {item.name === "Total Vendors" && (
                <DashboardTotalVendorsTable
                  dashboardTableData={Props.dashboardTotalVendorTableData}
                  companyDropdown={Props?.companyDropdown}
                  filterregisteredby={Props?.filterregisteredby}
                />
              )}
              {item.name === "Pending Vendors" && (
                <DashboardPendingVendorsTable
                  dashboardTableData={Props.dashboardPendingVendorTableData}
                  companyDropdown={Props?.companyDropdown}
                  filterregisteredby={Props?.filterregisteredby}

                />
              )}
              {item.name === "Onboarded Vendors" && (
                <DashboardApprovedVendorsTable
                  dashboardTableData={
                    Props.dashboardApprovedVendorTableData
                      .approved_vendor_onboarding
                  }
                  companyDropdown={Props?.companyDropdown}
                />
              )}
              {/* {item.name === "Dispatch Details" && <DashboardDispatchVendorsTable dashboardTableData={Props.dashboardPOTableData} />} */}
              {item.name === "Purchase & Ongoing Orders" && (
                <PurchaseAndOngoingOrders
                  dashboardPOTableData={Props.dashboardPOTableData}
                  companyDropdown={Props?.companyDropdown}
                />
              )}
              {/* {item.name === "Payment Request" && <DashboardPaymentVendorsTable dashboardTableData={Props.dashboardPOTableData} />} */}
              {/* {item.name === "Current Month Vendors" && <DashboardCurrentMonthsVendorsTable dashboardTableData={Props.dashboardPOTableData} />} */}
              {item.name === "Rejcted Vendors" && (
                <DashboardRejectedVendorsTable
                  dashboardTableData={Props?.dashboardRejectedVendorTableData}
                  companyDropdown={Props?.companyDropdown}
                />
              )}
              {item.name === "Purchase Enquiry" &&
                (user === "Enquirer" || user === "Purchase Team" || user == "Purchase Head" || user === "Category Master") && (
                  <DashboardPurchaseEnquiryTable
                    dashboardTableData={Props?.prInquiryData?.cart_details}
                    companyDropdown={Props?.companyDropdown}
                  />
                )}
              {item.name === "Purchase Requisition Request" &&
                (user === "Enquirer" || user === "Purchase Team" || user == "Purchase Head" || user === "Category Master") && (
                  <DashboardPurchaseRequisitionTable
                    dashboardTableData={Props?.prData}
                    companyDropdown={Props?.companyDropdown}
                  />
                )}

              {item.name === "RFQ Comparision" && (
                <DashboardRFQTable
                  dashboardTableData={Props?.rfqData?.data}
                  companyDropdown={Props?.companyDropdown}
                />
              )}

              {item.name === "SAP Error Log" && (
                <DashboardSAPErrorTable
                  dashboardTableData={Props?.sapErrorDashboardData}
                  companyDropdown={Props?.companyDropdown}
                />
              )}
              {item.name === "Accounts Pending Vendors" && (
                <DashboardAccountsPendingTable
                  dashboardTableData={Props?.dashboardAccountsPending}
                  companyDropdown={Props?.companyDropdown}
                />
              )}
              {item.name === "Accounts Onboarded Vendors" && (
                <DashboardAccountsOnboardedTable
                  dashboardTableData={Props?.dashboardAccountsOnboarded}
                  companyDropdown={Props?.companyDropdown}
                />
              )}
              {item.name === "Accounts Rejected Vendors" && (
                <DashboardAccountsRejectedTable
                  dashboardTableData={Props?.dashboardAccountsRejected}
                  companyDropdown={Props?.companyDropdown}
                />
              )}
              {item.name === "Accounts SAP Error Log" && (
                <DashboardAccountsSAPErrorTable
                  dashboardTableData={Props?.dashboardAccountsSapErrors}
                  companyDropdown={Props?.companyDropdown}
                />
              )}
            </TabsContent>
          ) : null;
        })}
      </Tabs>
    </div>
  );
};

export default DashboardCards;
