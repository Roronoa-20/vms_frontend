"use client"
import Image from "next/image";
import { dashboardCardData, DashboardPOTableData, DashboardPOTableItem, DashboardTableType, TvendorRegistrationDropdown, VendorDashboardPOTableData, RFQTable } from "@/src/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PurchaseAndOngoingOrders from "./VendorPurchase-and-Ongoing-Orders";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../atoms/select";
import { Command, CommandInput, CommandItem, CommandList, CommandGroup, CommandEmpty, } from "@/components/ui/command";
import { useMultipleVendorCodeStore } from "@/src/store/MultipleVendorCodeStore";
import { useEffect, useState, useRef } from "react";
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
  dispatchTableData: dispatchTable["dispatches"]
  dispatchCardCount: string | number;
}

const VendorDashboardCards = ({ ...Props }: Props) => {
  const { MultipleVendorCode, addMultipleVendorCode, reset, setSelectedVendorCode, selectedVendorCode } = useMultipleVendorCodeStore();

  const [open, setOpen] = useState(false);
  const [cardCount, setCardCount] = useState(Props?.cardData);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCardCount = async () => {
      const dashboardCardApi: AxiosResponse = await requestWrapper({
        url: `${API_END_POINTS?.VendorCodeBasedCardCount}?vendor_code=${selectedVendorCode}`,
        method: "GET"
      });

      if (dashboardCardApi?.status == 200) {
        setCardCount(dashboardCardApi?.data?.message);
      }
    }
    fetchCardCount();
  }, [selectedVendorCode])

  const cardData = [
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
      count: Props.cardData?.total_vendor_count ?? 0,
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
      {/* <div className="flex justify-start pb-4 gap-6">
        <Select onValueChange={(value) => { setSelectedVendorCode(value) }} value={selectedVendorCode} >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Vendor code" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className="w-full">
              {
                MultipleVendorCode?.map((item, index) => (
                  <SelectItem key={index} value={item?.vendor_code}>{item?.company_name} - {item?.vendor_code}</SelectItem>
                ))
              }
            </SelectGroup>
          </SelectContent>
        </Select>
      </div> */}
      {/* Vendor Selector */}
      <div className="flex justify-start pb-4 gap-6 relative w-[280px]" ref={dropdownRef}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex justify-between items-center rounded-xl border px-3 py-2 shadow-sm text-sm text-gray-700 bg-white hover:border-blue-400 focus:ring-2 focus:ring-blue-500 transition-all relative"
        >
          {selectedVendorCode
            ? MultipleVendorCode.find(
              (v) => v.vendor_code === selectedVendorCode
            )?.company_name +
            " - " +
            selectedVendorCode
            : "🔍 Select Vendor Code"}

          {!selectedVendorCode && <span className="text-gray-400">⌄</span>}

          {selectedVendorCode && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setSelectedVendorCode("");
              }}
              className="ml-2 text-gray-400 hover:text-red-500 cursor-pointer text-sm"
            >
              ✕
            </span>
          )}
        </button>


        {open && (
          <div className="absolute mt-2 w-full rounded-xl border bg-white shadow-lg z-50">
            <Command>
              <CommandInput
                placeholder="Search vendor..."
                className="px-3 py-2"
              />
              <CommandList className="max-h-64 overflow-y-auto">
                <CommandEmpty>No vendors found.</CommandEmpty>
                <CommandGroup>
                  {MultipleVendorCode?.map((item, index) => (
                    <CommandItem
                      key={index}
                      value={item.vendor_code}
                      onSelect={(value) => {
                        setSelectedVendorCode(value);
                        setOpen(false); // close after select
                      }}
                      className="flex flex-col items-start px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-50 data-[selected=true]:bg-blue-100 transition-all"
                    >
                      <span className="font-semibold text-gray-900">
                        {item.company_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        Vendor Code: {item.vendor_code}
                      </span>

                      {selectedVendorCode === item.vendor_code && (
                        <span className="ml-auto text-blue-600 font-bold">
                          ✓
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}
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
        {cardData.map((item, index) => {

          return (

            <TabsContent key={item.name || index} value={item.name}>
              {item.name === "Purchase & Ongoing Orders" && <PurchaseAndOngoingOrders dashboardPOTableData={Props?.dashboardPOTableData} companyDropdown={Props?.companyDropdown} />}
              {/* {item.name === "Quotation" && <DashboardTotalVendorsTable dashboardTableData={Props.dashboardTotalVendorTableData} companyDropdown={Props?.companyDropdown} />} */}
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