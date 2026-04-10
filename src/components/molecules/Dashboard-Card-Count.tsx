"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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
import DashboardMyVendorsTable from "./Dashboard-My-Vendors-Table";
import DashboardMyApprovalsTable from "./Dashboard-My-Approvals-Table";
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
import { useDashboardCardCountStore } from "@/src/store/DashboardCardCountStore";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/src/context/AuthContext";
import DashboardPurchaseEnquiryTable from "./Dashboard-Purchase-Enquiry-Table";
import DashboardPurchaseRequisitionTable from "./Dashboard-Purchase-Requisition-Table";
import { FileSearch } from "lucide-react";
import DashboardRFQTable from "./Dashboard-RFQ-Table";
import ASAVendorMonthWiseChart from "./ASAVendorMonthWiseChart";
import ASAESGPieChart from "./ASAESGPieChart";
import ASAESGDashboardStats from "./ASAESGDashboardStats";
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
  // dashboardAccountsPending: any;
  dashboardAccountsOnboarded: any;
  dashboardAccountsRejected: any;
  dashboardAccountsSapErrors: any;
  ASAdashboardOnboardedVendorListTableData: DashboardTableType["asa_form_data"];
  myVendorsData: any;
  myApprovalsData: any;
};

const DashboardCards = ({ ...Props }: Props) => {
  console.log(Props?.cardData, "this is card data");
  const { MultipleVendorCode } = useMultipleVendorCodeStore();
  const { cardCounts, setCardCounts, updateCardCount } = useDashboardCardCountStore();
  const { designation, asaResponsibleUser } = useAuth();
  const user = designation as string;
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("");

  console.log(user, "this is desingation");
  let allCardData: any[] = [];

  const asaCards = [
    {
      name: "Total ASA Vendor",
      count: cardCounts.asa_onboarded_count ?? 0,
      icon: "/dashboard-assests/cards_icon/file-search.svg",
      text_color: "text-emerald-800",
      bg_color: "bg-emerald-100",
      hover: "hover:border-emerald-400",
    },
    {
      name: "Submitted ASA Form",
      count: cardCounts.asa_form_count ?? 0,
      icon: "/dashboard-assests/cards_icon/file-search.svg",
      text_color: "text-violet-800",
      bg_color: "bg-violet-100",
      hover: "hover:border-violet-400",
    },
    {
      name: "Pending ASA Form",
      count: cardCounts.asa_pending_count ?? 0,
      icon: "/dashboard-assests/cards_icon/file-search.svg",
      text_color: "text-rose-800",
      bg_color: "bg-rose-100",
      hover: "hover:border-rose-400",
    },
  ];

  if (user === "ASA") {
    allCardData = [...asaCards];
  } else if (user == "Purchase Team" || user == "Purchase Head") {
    allCardData = [
      {
        name: "Pending Vendors",
        count: cardCounts.pending_vendor_count ?? 0,
        icon: "/dashboard-assests/cards_icon/doc.svg",
        text_color: "text-rose-800",
        bg_color: "bg-rose-100",
        hover: "hover:border-rose-400",
      },
      {
        name: "Onboarded Vendors",
        count: cardCounts.approved_vendor_count ?? 0,
        icon: "/dashboard-assests/cards_icon/tick.svg",
        text_color: "text-emerald-800",
        bg_color: "bg-emerald-100",
        hover: "hover:border-emerald-400",
      },
      {
        name: "Rejcted Vendors",
        count: cardCounts.rejected_vendor_count ?? 0,
        icon: "/dashboard-assests/cards_icon/doc.svg",
        text_color: "text-rose-800",
        bg_color: "bg-rose-100",
        hover: "hover:border-rose-400",
      },
      {
        name: "Purchase Enquiry",
        count: cardCounts.cart_count ?? 0,
        icon: "/dashboard-assests/cards_icon/doc.svg",
        text_color: "text-rose-800",
        bg_color: "bg-rose-100",
        hover: "hover:border-rose-400",
      },
      {
        name: "Purchase Requisition Request",
        subname: "Generated through VMS",
        count: cardCounts.pr_count ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-rose-800",
        bg_color: "bg-green-200",
        hover: "hover:border-rose-400",
      },
      {
        name: "Purchase & Ongoing Orders",
        count: cardCounts.purchase_order_count ?? 0,
        icon: "/dashboard-assests/cards_icon/package.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
      {
        name: "RFQ Comparision",
        count: cardCounts.overall_total_rfq ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
      {
        name: "SAP Error Log",
        count: cardCounts.sap_error_vendor_count ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
    ];
  } else if (designation === "Treasury") {
    allCardData = [
      {
        name: "Onboarded Vendors",
        count: cardCounts.approved_vendor_count ?? 0,
        icon: "/dashboard-assests/cards_icon/tick.svg",
        text_color: "text-emerald-800",
        bg_color: "bg-emerald-100",
        hover: "hover:border-emerald-400",
      },
      {
        name: "Accounts Onboarded Vendors",
        count: cardCounts.approved_vendor_count_by_accounts_team ?? 0,
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
        count: cardCounts.pending_vendor_count ?? 0,
        icon: "/dashboard-assests/cards_icon/doc.svg",
        text_color: "text-rose-800",
        bg_color: "bg-rose-100",
        hover: "hover:border-rose-400",
      },
      {
        name: "Onboarded Vendors",
        count: cardCounts.approved_vendor_count ?? 0,
        icon: "/dashboard-assests/cards_icon/tick.svg",
        text_color: "text-emerald-800",
        bg_color: "bg-emerald-100",
        hover: "hover:border-emerald-400",
      },
      {
        name: "Rejcted Vendors",
        count: cardCounts.rejected_vendor_count ?? 0,
        icon: "/dashboard-assests/cards_icon/doc.svg",
        text_color: "text-rose-800",
        bg_color: "bg-rose-100",
        hover: "hover:border-rose-400",
      },
      {
        name: "SAP Error Log",
        count: cardCounts.sap_error_vendor_count ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
      {
        name: "My Vendors",
        count: cardCounts.my_vendors_count ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
      {
        name: "My Approvals",
        count: cardCounts.my_approvals_count ?? 0,
        icon: "/dashboard-assests/cards_icon/tick.svg",
        text_color: "text-emerald-800",
        bg_color: "bg-emerald-100",
        hover: "hover:border-emerald-400",
      },
      {
        name: "Accounts Rejected Vendors",
        count: cardCounts.rejected_vendor_count_by_accounts_team ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
      {
        name: "Accounts SAP Error Log",
        count: cardCounts.sap_error_vendor_count_by_accounts_team ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
    ];
  }

  const cardData = useMemo(() => {
    const EnquirerCard = [
      {
        name: "Purchase Enquiry",
        count: cardCounts.cart_count ?? 0,
        icon: "/dashboard-assests/cards_icon/doc.svg",
        text_color: "text-rose-800",
        bg_color: "bg-rose-100",
        hover: "hover:border-rose-400",
      },
      {
        name: "Purchase Requisition Request",
        subname: "Generated through VMS",
        count: cardCounts.pr_count ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-rose-800",
        bg_color: "bg-green-200",
        hover: "hover:border-rose-400",
      },
    ];

    return user === "Enquirer" ? EnquirerCard : allCardData;
  }, [user, cardCounts]);

  useEffect(() => {
    const counts: Record<string, number> = {
      pending_vendor_count: Props.cardData?.pending_vendor_count ?? 0,
      approved_vendor_count: Props.cardData?.approved_vendor_count ?? 0,
      rejected_vendor_count: Props.cardData?.rejected_vendor_count ?? 0,
      purchase_order_count: Props.cardData?.purchase_order_count ?? 0,
      pr_count: Props.cardData?.pr_count ?? 0,
      cart_count: Props.cardData?.cart_count ?? 0,
      sap_error_vendor_count: Props.cardData?.sap_error_vendor_count ?? 0,
      current_month_vendor: Props.cardData?.current_month_vendor ?? 0,
      sap_error_vendor_count_by_accounts_team: Props.cardData?.sap_error_vendor_count_by_accounts_team ?? 0,
      rejected_vendor_count_by_accounts_team: Props.cardData?.rejected_vendor_count_by_accounts_team ?? 0,
      approved_vendor_count_by_accounts_team: Props.cardData?.approved_vendor_count_by_accounts_team ?? 0,
      overall_total_rfq: Number(Props?.rfqData?.overall_total_rfq) || 0,
      asa_onboarded_count: Props.ASAdashboardOnboardedVendorListTableData?.overall_count ?? 0,
      asa_form_count: Props.dashboardASAFormTableData?.overall_total_asa ?? 0,
      asa_pending_count: Props.dashboardASAPendingVendorListTableData?.overall_count ?? 0,
      my_vendors_count: Props?.myVendorsData?.message?.total_count ?? 0,
      my_approvals_count: Props?.myApprovalsData?.message?.total_count ?? 0,
    };
    setCardCounts(counts);
  }, [Props.cardData, Props.rfqData, Props.ASAdashboardOnboardedVendorListTableData, Props.dashboardASAFormTableData, Props.dashboardASAPendingVendorListTableData, Props.myVendorsData, Props.myApprovalsData]);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    } else if (cardData.length > 0) {
      setActiveTab(cardData[0].name);
    }
  }, [searchParams, cardData]);

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabName);
    router.push(`?${params.toString()}`);
  };

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
      <Tabs value={activeTab} onValueChange={handleTabChange} className="">
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
          if (asaCards.some(ac => ac.name === item.name)) {
            return (
              <TabsContent key={item.name} value={item.name}>
                {item.name === "Total ASA Vendor" && (
                  <DashboardASAOnboardedVendorsList
                    dashboardTableData={
                      Props.ASAdashboardOnboardedVendorListTableData
                    }
                    companyDropdown={Props?.companyDropdown}
                  />
                )}
                {item.name === "Submitted ASA Form" && (
                  <Tabs defaultValue="list" className="w-full">
                    <div className="flex items-center justify-between mb-4 bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 px-2">
                        <FileSearch className="w-5 h-5 text-violet-600" />
                        <h3 className="text-sm font-bold text-gray-700 tracking-tight uppercase">Submitted Forms Management</h3>
                      </div>
                      <TabsList className="bg-white shadow-sm border border-gray-100 rounded-lg h-9">
                        <TabsTrigger value="list" className="text-xs font-semibold data-[state=active]:bg-violet-600 data-[state=active]:text-white">Table View</TabsTrigger>
                        <TabsTrigger value="graph" className="text-xs font-semibold data-[state=active]:bg-violet-600 data-[state=active]:text-white">Analytics View</TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="list" className="mt-0">
                      <DashboardASAFormTable
                        dashboardTableData={Props.dashboardASAFormTableData}
                        companyDropdown={Props?.companyDropdown}
                      />
                    </TabsContent>

                    <TabsContent value="graph" className="mt-0 space-y-6">
                      <ASAESGDashboardStats
                        tableData={Props.dashboardASAFormTableData.data || []}
                      />
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ASAVendorMonthWiseChart
                          tableData={Props.dashboardASAFormTableData.data || []}
                        />
                        <ASAESGPieChart
                          tableData={Props.dashboardASAFormTableData.data || []}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
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
              {item.name === "My Approvals" && (
                <DashboardMyApprovalsTable
                  dashboardTableData={Props?.myApprovalsData}
                  companyDropdown={Props?.companyDropdown}
                />
              )}
              {item.name === "My Vendors" && (
                <DashboardMyVendorsTable
                  dashboardTableData={Props?.myVendorsData}
                  companyDropdown={Props?.companyDropdown}
                />
              )}
              {/* {item.name === "Accounts Pending Vendors" && (
                <DashboardAccountsPendingTable
                  dashboardTableData={Props?.dashboardAccountsPending}
                  companyDropdown={Props?.companyDropdown}
                />
              )} */}
              {/* {item.name === "Accounts Onboarded Vendors" && (
                <DashboardAccountsOnboardedTable
                  dashboardTableData={Props?.dashboardAccountsOnboarded}
                  companyDropdown={Props?.companyDropdown}
                />
              )} */}
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
