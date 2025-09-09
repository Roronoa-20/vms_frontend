"use client"
import Image from "next/image";
import { dashboardCardData, DashboardPOTableData, DashboardPOTableItem, DashboardTableType, TvendorRegistrationDropdown, VendorDashboardPOTableData, RFQTable } from "@/src/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PurchaseAndOngoingOrders from "./VendorPurchase-and-Ongoing-Orders";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../atoms/select";
import { useMultipleVendorCodeStore } from "@/src/store/MultipleVendorCodeStore";
import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { dispatchTable } from "@/src/types/dispatchTableType";
import DashboardDispatchVendorsTable from "./Dashboard-Dispatch-Vendors-Table";
import DashboardRFQTable from "./ViewRFQ/Dashboard-Vendor-RFQ-Table";

type Props = {
  cardData: dashboardCardData
  dashboardPOTableData?: VendorDashboardPOTableData["message"]
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"]
  dispatchTableData:dispatchTable["dispatches"]
  dispatchCardCount:string | number;
  rfqData: RFQTable
}

const VendorDashboardCards = ({ ...Props }: Props) => {
const {MultipleVendorCode,addMultipleVendorCode,reset,setSelectedVendorCode,selectedVendorCode} = useMultipleVendorCodeStore();
const [cardCount,setCardCount] = useState(Props?.cardData);
useEffect(()=>{
  const fetchCardCount = async()=>{
    const dashboardCardApi: AxiosResponse = await requestWrapper({
        url: `${API_END_POINTS?.VendorCodeBasedCardCount}?vendor_code=${selectedVendorCode}`,
        method: "GET"
      });
      
       if( dashboardCardApi?.status == 200) {
         setCardCount(dashboardCardApi?.data?.message);
       }
  }
  fetchCardCount();
},[selectedVendorCode])

const cardData =  [
    {
      name: "Purchase & Ongoing Orders",
      count: cardCount?.purchase_order_count ?? 0,
      icon: "/dashboard-assests/cards_icon/bar.svg",
      text_color: "text-rose-800",
      bg_color: "bg-rose-100",
      hover: "hover:border-rose-400",
    },
      {
        name: "Quotation",
        count: Props?.rfqData?.overall_total_rfq ?? 0,
        icon: "/dashboard-assests/cards_icon/doc.svg",
        text_color: "text-blue-800",
        bg_color: "bg-blue-100",
        hover: "hover:border-blue-400",
      },
      {
        name: "Dispatch Details",
        count: Props?.dispatchCardCount ?? 0,
        icon: "/dashboard-assests/cards_icon/truck.svg",
        text_color: "text-emerald-800",
        bg_color: "bg-emerald-100",
        hover: "hover:border-emerald-400",
      },
      {
        name: "Purchase Order History",
        count: 0,
        icon: "/dashboard-assests/cards_icon/clock.svg",
        text_color: "text-blue-800",
        bg_color: "bg-blue-100",
        hover: "hover:border-blue-400",
      },
    ];
  
  return (
    <div className="">
        <div className="flex justify-start pb-4 gap-6">
        <Select onValueChange={(value)=>{setSelectedVendorCode(value)}} value={selectedVendorCode} >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Vendor code" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="w-full">
            {
              MultipleVendorCode?.map((item,index)=>(
                <SelectItem key={index} value={item?.vendor_code}>{item?.company_name}</SelectItem>
              ))
            }
          </SelectGroup>
        </SelectContent>
      </Select>
        </div>
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
        { cardData.map((item, index) => {
          
            return(

              <TabsContent key={item.name || index} value={item.name}>
              {item.name === "Purchase & Ongoing Orders" && <PurchaseAndOngoingOrders dashboardPOTableData={Props?.dashboardPOTableData} companyDropdown={Props?.companyDropdown}/>}
              {item.name === "Quotation" && <DashboardRFQTable dashboardTableData={Props?.rfqData?.data} companyDropdown={Props?.companyDropdown} />}
              {/* {item.name === "Dispatch Details" && <DashboardApprovedVendorsTable dashboardTableData={Props.dashboardApprovedVendorTableData} companyDropdown={Props?.companyDropdown}/>} */}
              {item.name === "Dispatch Details" && <DashboardDispatchVendorsTable dashboardTableData={Props?.dispatchTableData} />}
              {/* {item.name === "Payment History" && <PurchaseAndOngoingOrders dashboardPOTableData={Props.dashboardPOTableData} />} */}
              {/* {item.name === "Payment Request" && <DashboardPaymentVendorsTable dashboardTableData={Props.dashboardPOTableData} />} */}
              {/* {item.name === "Current Month Vendors" && <DashboardCurrentMonthsVendorsTable dashboardTableData={Props.dashboardPOTableData} />} */}
              {/* {item.name === "Purchase Order History" && <DashboardRejectedVendorsTable dashboardTableData={Props.dashboardRejectedVendorTableData} companyDropdown={Props?.companyDropdown} />} */}
            </TabsContent>
            )
          }
        )
        }
      </Tabs>
    </div>

  );
};

export default VendorDashboardCards;
