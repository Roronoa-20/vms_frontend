"use client"
import Image from "next/image";
import { dashboardCardData, DashboardPOTableData, DashboardPOTableItem, DashboardTableType, PurchaseRequisition, TPRInquiryTable, TvendorRegistrationDropdown } from "@/src/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PurchaseAndOngoingOrders from "./Purchase-and-Ongoing-Orders";
import DashboardTotalVendorsTable from "./Dashboard-Total-Vendors-Table";
import DashboardPendingVendorsTable from "./Dashboard-Pending-Vendors-Table";
import DashboardApprovedVendorsTable from "./Dashboard-Approved-Vendors-Table";
import DashboardRejectedVendorsTable from "./Dashboard-Rejected-Vendors-Table";
import DashboardDispatchVendorsTable from "./Dashboard-Dispatch-Vendors-Table";
import DashboardPaymentVendorsTable from "./Dashboard-Payment-Vendors-Table";
import DashboardCurrentMonthsVendorsTable from "./Dashboard-Current-Months-Vendors-Table";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import Cookies from "js-cookie";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../atoms/select";
import { useMultipleVendorCodeStore } from "@/src/store/MultipleVendorCodeStore";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import DashboardPurchaseEnquiryTable from "./Dashboard-Purchase-Enquiry-Table";
import DashboardPurchaseRequisitionTable from "./Dashboard-Purchase-Requisition-Table";
import { FileSearch } from "lucide-react";

type Props = {
  cardData: dashboardCardData
  dashboardPOTableData?: DashboardTableType
  dashboardTotalVendorTableData: DashboardTableType
  dashboardPendingVendorTableData?: DashboardTableType
  dashboardApprovedVendorTableData?: DashboardTableType
  dashboardRejectedVendorTableData?: DashboardTableType
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"]
  prInquiryData: TPRInquiryTable[]
  prData: PurchaseRequisition[]
}

const DashboardCards = ({ ...Props }: Props) => {
  const { MultipleVendorCode } = useMultipleVendorCodeStore();
  // const cookieStore = await cookies();
  const { designation } = useAuth();
  const user = designation;
  const [loading, setLoading] = useState<boolean>(true);

  console.log(user, "this is desingation")
  // const user = cookieStore.get("designation")?.value;
  let allCardData: any[] = [
    {
      name: "Pending Vendors",
      count: Props.cardData?.pending_vendor_count ?? 0,
      icon: "/dashboard-assests/cards_icon/doc.svg",
      text_color: "text-rose-800",
      bg_color: "bg-rose-100",
      hover: "hover:border-rose-400",
    },
    // {
    //   name: "Total Vendors",
    //   count: Props.cardData?.total_vendor_count ?? 0,
    //   icon: "/dashboard-assests/cards_icon/total_count.svg",
    //   text_color: "text-yellow-800",
    //   bg_color: "bg-yellow-100",
    //   hover: "hover:border-yellow-400",
    // },
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
      name: "Purchase Inquiry",
      count: Props.cardData?.cart_count ?? 0,
      icon: "/dashboard-assests/cards_icon/doc.svg",
      text_color: "text-rose-800",
      bg_color: "bg-rose-100",
      hover: "hover:border-rose-400",
    },
    {
      name: "Purchase Requisition",
      count: Props.cardData?.pr_count ?? 0,
      icon: "/dashboard-assests/cards_icon/file-search.svg",
      text_color: "text-rose-800",
      bg_color: "bg-green-200",
      hover: "hover:border-rose-400",
    },
    // {
    //   name: "Purchase & Ongoing Orders",
    //   count: 0,
    //   icon: "/dashboard-assests/cards_icon/package.svg",
    //   text_color: "text-violet-800",
    //   bg_color: "bg-violet-100",
    //   hover: "hover:border-violet-400",
    // },
  ];

  let cardData = user === "Enquirer"
  ? allCardData.filter(item => item.name === "Purchase Inquiry" || item.name === "Purchase Requisition") : allCardData;

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user])


  const fetchPoBasedOnVendorCode = async () => {
    const url = `${API_END_POINTS?.vendorPOTable}?vendor_code`;
  }

  if (loading) {
    return <div>Loading...</div>
  }

  console.log(Props?.dashboardPOTableData, "this is po table")

  return (
    <div className="">
      {
        user == "Vendor" &&
        <div className="flex justify-start pb-4 gap-6">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Vendor code" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="w-full">
                {
                  MultipleVendorCode?.map((item, index) => (
                    <SelectItem key={index} value={item?.vendor_code}>{item?.company_name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      }
      <Tabs defaultValue={cardData?.[0]?.name} className="">
        <div className="">
          <TabsList className="grid grid-cols-4 gap-4 h-full pb-6 bg-white">
            {cardData.map((item, index) => (
              <TabsTrigger
                key={item.name || index}
                value={item.name}
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-black text-gray-500 rounded-2xl p-0 transition-all duration-300 ease-in-out"
              >
                <div
                  className={`group w-full h-full rounded-2xl ${item.bg_color} flex flex-col p-3 ${item.text_color} h-28 justify-between border-2 ${item.hover} hover:scale-105 transition duration-300 transform cursor-pointer shadow-md`}
                >
                  <div className="flex w-full justify-between">
                    <h1 className="text-[13px]">{item.name}</h1>
                    <Image src={item.icon} alt="" width={25} height={30} />
                  </div>
                  <div className="text-[20px] text-start font-bold">{item.count}</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {cardData.map((item, index) => {
          const isEnquirerAllowed =
            user !== "Enquirer" ||
            item.name === "Purchase Inquiry" ||
            item.name === "Purchase Requisition";

          return isEnquirerAllowed ? (
            <TabsContent key={item.name || index} value={item.name}>
              {item.name === "Total Vendors" && (
                <DashboardTotalVendorsTable
                  dashboardTableData={Props.dashboardTotalVendorTableData}
                  companyDropdown={Props?.companyDropdown}
                />
              )}
              {item.name === "Pending Vendors" && (
                <DashboardPendingVendorsTable
                  dashboardTableData={Props.dashboardPendingVendorTableData}
                  companyDropdown={Props?.companyDropdown}
                />
              )}
              {item.name === "Onboarded Vendors" && (
                <DashboardApprovedVendorsTable
                  dashboardTableData={Props.dashboardApprovedVendorTableData}
                  companyDropdown={Props?.companyDropdown}
                />
              )}
              {/* {item.name === "Dispatch Details" && <DashboardDispatchVendorsTable dashboardTableData={Props.dashboardPOTableData} />} */}
              {item.name === "Purchase & Ongoing Orders" && (
                <PurchaseAndOngoingOrders dashboardPOTableData={Props.dashboardPOTableData} />
              )}
              {/* {item.name === "Payment Request" && <DashboardPaymentVendorsTable dashboardTableData={Props.dashboardPOTableData} />} */}
              {/* {item.name === "Current Month Vendors" && <DashboardCurrentMonthsVendorsTable dashboardTableData={Props.dashboardPOTableData} />} */}
              {item.name === "Rejcted Vendors" && (
                <DashboardRejectedVendorsTable
                  dashboardTableData={Props.dashboardRejectedVendorTableData}
                  companyDropdown={Props?.companyDropdown}
                />
              )}
              {item.name === "Purchase Inquiry" && (user === "Enquirer" || user === "Purchase Team") && (
                <DashboardPurchaseEnquiryTable
                  dashboardTableData={Props.prInquiryData}
                  companyDropdown={Props?.companyDropdown}
                />
              )}
              {item.name === "Purchase Requisition" && (user === "Enquirer" || user === "Purchase Team") && (
                <DashboardPurchaseRequisitionTable
                  dashboardTableData={Props.prData}
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
