"use client"
import Image from "next/image";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import API_END_POINTS from "@/src/services/apiEndPoints";
// import { AxiosResponse } from "axios";
// import requestWrapper from "@/src/services/apiCall";
// import Cookies from "js-cookie";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../atoms/select";
import { useMultipleVendorCodeStore } from "@/src/store/MultipleVendorCodeStore";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import DashboardGateEntryTable from "./DashboardGateEntryTable";
import { cardCount } from "../pages/GateEntryDashboard";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { Button } from "../atoms/button";
import { useRouter } from "next/navigation";


export type TableData = {
   gate_entry_date: string;
  eway_bill_date: string;
  eway_bill_no: string;
  creation: string;
  gate_entry_no: string;           // Use empty string if no value
  remarks: string;
  handover_to_person: string;
  invoice_value: string;
  name: string;
  vendor: string;
  received_remark: string;
  challan_no: string;
  name_of_vendor: string;
  airway_bill: string;
  docstatus: number;
  idx: number;
  vendor_address: string;
  handover_remark: string;
  owner: string;
  modified: string;
  posting_time: string;
  created_date: string;
  created_by: string;
  vendor_gst: string;
  status: string;
  challan_date: string;
  modified_by: string;
  naming_series: string;
  scan_barcode: string;
  inward_location: string;
  transport: string;
  currency: string;
  name_of_company: string;
  bill_of_entry_date: string;
  bill_of_entry_no: string;
  is_submitted: number;
  gate_entry_details:PurchaseItemsList[]
} 

export type PurchaseItemsList = {
   name: string;
  owner: string;
  creation: string;            // datetime string
  modified: string;            // datetime string
  modified_by: string;
  docstatus: number;
  idx: number;
  purchase_order: string;
  purchase_order_date: string;  // originally null, use empty string if no value
  rate: string;                 // originally null, use empty string if no value
  received_qty: string;
  po_pending_qty: string;       // originally null, use empty string if no value
  uom: string;
  amount: string;
  product_code: string;
  product_name: string;
  description: string;
  parent: string;
  parentfield: string;
  parenttype: string;
  doctype: string;
}

type Props = {
  cardData:cardCount
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"]
}

type tableParams = {
  company?:string,
  status?:string,
}

const GateEntryDashboardCards = ({ ...Props }: Props) => {
  const { MultipleVendorCode } = useMultipleVendorCodeStore();
  // const cookieStore = await cookies();
  const { designation } = useAuth();
  const user = designation;
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData,setTableData] = useState<TableData[]>([]);
  const [tableTitle,setTableTitle] = useState<string>("Total Entry");
  const router = useRouter()
  // const [tableParams,setTableParams] = useState<tableParams | null>({company:"",status:""});
  // const user = cookieStore.get("designation")?.value;
  let allCardData: {
    name:string,
    value:string,
    count:number,
    icon:string,
    text_color:string,
    bg_color:string,
    hover:string,
  }[] = [

      {
        name: "Pending Request",
        value:"",
        count: Props?.cardData?.total_count ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-emerald-800",
        bg_color: "bg-emerald-100",
        hover: "hover:border-emerald-400",
      },
      {
        name: "Approved Request",
        count: Props?.cardData?.["3000-Meril Life Sciences India Private Limited"]?.count ?? 0,
        value:Props?.cardData?.["3000-Meril Life Sciences India Private Limited"]?.name,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
    ];

  let cardData = allCardData;

console.log(tableTitle,"this is table title")

  const fetchTableData = async(company?:string,status?:string,title?:string)=>{
    setTableTitle(title?title:"");
    console.log(status,"this is status inside api calls")
    const api = `${API_END_POINTS?.GateEntryTableData}?company=${company?company:""}&status=${status?status:""}&fields=["*"]`;
    const response:AxiosResponse = await requestWrapper({url:api,method:"GET"});
    if(response?.status == 200){
      if(response?.data?.message?.data?.length > 0){

        setTableData(response?.data?.message?.data);
      }else{
        setTableData([]);
      }
    }
  };


  return (
    <div className="">
      {user === "Vendor" &&
        <div className="flex justify-start pb-4 gap-6">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Vendor code" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="w-full">
                {
                  MultipleVendorCode?.map((item, index) => (
                    <SelectItem key={index} value={item?.vendor_code as string}>{item?.company_name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      }
      <Tabs defaultValue={cardData?.[0]?.name} className="">
        <div className="">
          <TabsList className="grid md:grid-cols-4 grid-cols-2 gap-4 h-full pb-6 bg-white">
            {cardData?.map((item, index) => (
              <TabsTrigger onClick={()=>{
                if(item?.name == "Material Received"){
                  fetchTableData("","Received",item?.name)
                }else if(item?.name == "Material Handover"){
                  fetchTableData("","HandOver",item?.name);
                }
                else{
                  fetchTableData(item?.value,"",item?.name)
                }
              }}
                key={item.name || index}
                value={item.name}
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-black text-gray-500 rounded-2xl p-0 transition-all duration-300 ease-in-out">
                <div
                  className={`group w-full h-full rounded-2xl ${item.bg_color} flex flex-col p-3 ${item.text_color} h-28 justify-between border-2 ${item.hover} hover:scale-105 transition duration-300 transform cursor-pointer shadow-md`}>
                  <div className="flex w-full justify-between">
                    <h1 className="text-[13px]">{item.name}</h1>
                    <Image src={item.icon} alt="" width={25} height={30}/>
                  </div>
                  <div className="text-[20px] text-start font-bold">{item.count}</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {cardData?.map((item, index) => (
            <TabsContent key={item.name || index} value={item.name} >
              {
                tableData?.length > 0 && 
                <DashboardGateEntryTable dashboardTableData={tableData} companyDropdown={Props?.companyDropdown} TableTitle={tableTitle} />
              }
            </TabsContent>
          ))}
      </Tabs>
    </div>
  );
};

export default GateEntryDashboardCards;
