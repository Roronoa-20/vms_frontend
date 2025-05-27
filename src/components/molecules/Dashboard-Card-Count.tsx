import Image from "next/image";
import React from "react";
import { dashboardCardData, DashboardPOTableData, DashboardPOTableItem, DashboardTableType } from "@/src/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PurchaseAndOngoingOrders from "./Purchase-and-Ongoing-Orders";
import DashboardTotalVendorsTable from "./Dashboard-Total-Vendors-Table";
import DashboardPendingVendorsTable from "./Dashboard-Pending-Vendors-Table";
import DashboardApprovedVendorsTable from "./Dashboard-Approved-Vendors-Table";
import DashboardRejectedVendorsTable from "./Dashboard-Rejected-Vendors-Table";
import DashboardDispatchVendorsTable from "./Dashboard-Dispatch-Vendors-Table";
import DashboardPaymentVendorsTable from "./Dashboard-Payment-Vendors-Table";
import DashboardCurrentMonthsVendorsTable from "./Dashboard-Current-Months-Vendors-Table";

type Props = {
  cardData: dashboardCardData
  dashboardPOTableData: DashboardPOTableItem[]
  dashboardTotalVendorTableData:DashboardTableType
  dashboardPendingVendorTableData: DashboardTableType
  dashboardApprovedVendorTableData:DashboardTableType
  dashboardRejectedVendorTableData: DashboardTableType
}

const DashboardCards = ({ ...Props }: Props) => {
  console.log(Props.cardData,"cardData")
  const cardData = [
    {
      name: "Total Vendors",
      count: Props.cardData?.total_vendor_count,
      icon: "/dashboard-assests/cards_icon/total_count.svg",
      text_color: "text-yellow-800",
      bg_color: "bg-yellow-100",
      hover: "hover:border-yellow-400",
    },
    {
      name: "Pending Vendors",
      count: Props.cardData?.pending_vendor_count,
      icon: "/dashboard-assests/cards_icon/hour_glass.svg",
      text_color: "text-rose-800",
      bg_color: "bg-rose-100",
      hover: "hover:border-rose-400",
    },
    {
      name: "Onboarded Vendors",
      count: Props.cardData?.approved_vendor_count,
      icon: "/dashboard-assests/cards_icon/tick.svg",
      text_color: "text-emerald-800",
      bg_color: "bg-emerald-100",
      hover: "hover:border-emerald-400",
    },
    {
      name: "Dispatch Details",
      count: 0,
      icon: "/dashboard-assests/cards_icon/truck.svg",
      text_color: "text-blue-800",
      bg_color: "bg-blue-100",
      hover: "hover:border-blue-400",
    },
    {
      name: "Purchase & Ongoing Orders",
      count: 0,
      icon: "/dashboard-assests/cards_icon/package.svg",
      text_color: "text-violet-800",
      bg_color: "bg-violet-100",
      hover: "hover:border-violet-400",
    },
    {
      name: "Payment Request",
      count: 0,
      icon: "/dashboard-assests/cards_icon/hand.svg",
      text_color: "text-orange-800",
      bg_color: "bg-orange-100",
      hover: "hover:border-orange-400",
    },
    {
      name: "Current Month Vendors",
      count: Props.cardData?.current_month_vendor,
      icon: "/dashboard-assests/cards_icon/calender.svg",
      text_color: "text-black-800",
      bg_color: "bg-gray-100",
      hover: "hover:border-gray-400",
    },
    {
      name: "Rejcted Vendors",
      count: Props.cardData?.rejected_vendor_count,
      icon: "/dashboard-assests/cards_icon/hour_glass.svg",
      text_color: "text-rose-800",
      bg_color: "bg-rose-100",
      hover: "hover:border-rose-400",
    },
  ];
  return (
    <div className="">
      {/* {cardData?.map((item, index) => (
        <div
          key={index}
          className={`group rounded-2xl ${item?.bg_color} flex flex-col p-3 ${item?.text_color} h-28 justify-between border-2 ${item?.hover} hover:scale-[1.06] transition duration-300 transform cursor-pointer shadow-md`}
        >
          <div className={`flex w-full justify-between`}>
            <h1 className="text-[13px]">{item?.name}</h1>
            <Image src={`${item?.icon}`} alt="" width={25} height={30} />
          </div>
          <div className="text-[20px] font-bold">{item?.count}</div>
        </div>
      ))} */}
      <Tabs defaultValue={cardData?.[0]?.name} className="">
        <div className="">
          <TabsList className="grid grid-cols-4 gap-4 h-full pb-6 bg-white">
            {cardData.map((item, index) => (
              <TabsTrigger
                key={item.name || index}
                value={item.name}
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-black text-gray-500 rounded-2xl p-0 transition-all duration-300 ease-in-out overflow-hidden"
              >
                <div
                  className={`group w-full h-full rounded-2xl ${item.bg_color} flex flex-col p-3 ${item.text_color} h-28 justify-between border-2 ${item.hover} hover:scale-[1.06] transition duration-300 transform cursor-pointer shadow-md`}
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
        {cardData.map((item, index) => (
          <TabsContent key={item.name || index} value={item.name}>
            {item.name === "Total Vendors" && <DashboardTotalVendorsTable dashboardTableData={Props.dashboardTotalVendorTableData} />}
            {item.name === "Pending Vendors" && <DashboardPendingVendorsTable dashboardTableData={Props.dashboardPendingVendorTableData} />}
            {item.name === "Onboarded Vendors" && <DashboardApprovedVendorsTable dashboardTableData={Props.dashboardApprovedVendorTableData} />}
            {item.name === "Dispatch Details" && <DashboardDispatchVendorsTable dashboardTableData={Props.dashboardPOTableData} />}
            {item.name === "Purchase & Ongoing Orders" && <PurchaseAndOngoingOrders dashboardPOTableData={Props.dashboardPOTableData} />}
            {item.name === "Payment Request" && <DashboardPaymentVendorsTable dashboardTableData={Props.dashboardPOTableData} />}
            {item.name === "Current Month Vendors" && <DashboardCurrentMonthsVendorsTable dashboardTableData={Props.dashboardPOTableData} />}
            {item.name === "Rejcted Vendors" && <DashboardRejectedVendorsTable dashboardTableData={Props.dashboardRejectedVendorTableData} />}
          </TabsContent>
        ))}
      </Tabs>
    </div>

  );
};

export default DashboardCards;
