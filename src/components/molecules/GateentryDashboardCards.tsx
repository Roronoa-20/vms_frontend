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


export type TableData = {
  ref_no:string,
  vendor_name:string,
  company_name:string,
  date:string,
  status:string,
  rejected_by_designation:string,
  rejected_by:string
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
  console.log(Props?.cardData, "this is card data")
  const { MultipleVendorCode } = useMultipleVendorCodeStore();
  // const cookieStore = await cookies();
  const { designation } = useAuth();
  const user = designation;
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData,setTableData] = useState<TableData[]>([]);
  // const [tableParams,setTableParams] = useState<tableParams | null>({company:"",status:""});

  console.log(user, "this is desingation")
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
        name: "Total Entry",
        value:"",
        count: Props?.cardData?.total_count ?? 0,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-emerald-800",
        bg_color: "bg-emerald-100",
        hover: "hover:border-emerald-400",
      },
      {
        name: "MLSIPL Entry",
        count: Props?.cardData?.["3000-Meril Life Sciences India Private Limited"]?.count ?? 0,
        value:Props?.cardData?.["3000-Meril Life Sciences India Private Limited"]?.name,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-violet-800",
        bg_color: "bg-violet-100",
        hover: "hover:border-violet-400",
      },
      {
        name: "MLSPL Entry",
        count: Props?.cardData?.["2000-Meril Life Sciences Private Limited"]?.count ?? 0,
        value:Props?.cardData?.["2000-Meril Life Sciences Private Limited"]?.name,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-pink-800",
        bg_color: "bg-pink-100",
        hover: "hover:border-pink-400",
      },
   
      {
        name: "MEPL Entry",
        count: Props.cardData?.["8000-Meril Endo Surgery Private Limited"]?.count ?? 0,
        value:Props?.cardData?.["8000-Meril Endo Surgery Private Limited"]?.name,
        icon: "/dashboard-assests/cards_icon/doc.svg",
        text_color: "text-orange-800",
        bg_color: "bg-orange-100",
        hover: "hover:border-orange-400",
      },
      {
        name: "MDPL Entry",
        count: Props.cardData?.["7000-Meril Diagnostics Private Limited"]?.count ?? 0,
        value:Props?.cardData?.["7000-Meril Diagnostics Private Limited"]?.name,
        icon: "/dashboard-assests/cards_icon/tick.svg",
        text_color: "text-blue-800",
        bg_color: "bg-blue-100",
        hover: "hover:border-blue-400",
      },
      {
        name: "MCPL Entry",
        count: Props.cardData?.["1030-Meril Corporation I Pvt Ltd"]?.count ?? 0,
        value:Props?.cardData?.["1030-Meril Corporation I Pvt Ltd"]?.name,
        icon: "/dashboard-assests/cards_icon/doc.svg",
        text_color: "text-yellow-800",
        bg_color: "bg-yellow-100",
        hover: "hover:border-yellow-400",
      },
      {
        name: "MILSPL Entry",
        count: 0,
        value:"",
        icon: "/dashboard-assests/cards_icon/doc.svg",
        text_color: "text-green-800",
        bg_color: "bg-green-100",
        hover: "hover:border-green-400",
      },
      {
        name: "MMIPL Entry",
        count: Props.cardData?.["1022-Meril Medical Innovation Pvt. Ltd."]?.count ?? 0,
        value:Props?.cardData?.["1022-Meril Medical Innovation Pvt. Ltd."]?.name,
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-purple-800",
        bg_color: "bg-purple-200",
        hover: "hover:border-purple-400",
      },
      {
        name: "MNPL Entry",
        count: Props.cardData?.["1025-Merai Newage Pvt. Ltd."]?.count ?? 0,
        value:Props?.cardData?.["1025-Merai Newage Pvt. Ltd."]?.name,
        icon: "/dashboard-assests/cards_icon/package.svg",
        text_color: "text-yellow-800",
        bg_color: "bg-yellow-100",
        hover: "hover:border-yellow-400",
      },
      {
        name: "MCIPL Entry",
        count:  0,
        value:"",
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-pink-800",
        bg_color: "bg-pink-100",
        hover: "hover:border-pink-400",
      },
      {
        name: "Material Received",
        count: Props?.cardData?.gate_received_count ?? 0,
        value:"",
        icon: "/dashboard-assests/cards_icon/file-search.svg",
        text_color: "text-orange-800",
        bg_color: "bg-orange-100",
        hover: "hover:border-orange-400",
      },
  
      {
        name: "Material Handover",
        count: Props.cardData?.handover_count ?? 0,
        value:"",
        icon: "/dashboard-assests/cards_icon/doc.svg",
        text_color: "text-blue-800",
        bg_color: "bg-blue-100",
        hover: "hover:border-blue-400",
      },
    ];

  let cardData = allCardData;



  // useEffect(() => {
  //   if (user) {
  //     setLoading(false);
  //   }
  // }, [user])

  // useEffect(()=>{
  //   if(tableParams?.company || tableParams?.status){
  //     fetchTableData();
  //   }
  // },[tableParams])



  const fetchTableData = async(company?:string,status?:string)=>{
    const response:AxiosResponse = await requestWrapper({url:API_END_POINTS?.GateEntryTableData,method:"GET",params:{company:company,status:status}});
    if(response?.status == 200){
     setTableData(response?.data?.message?.data);
    }
  }


  const fetchPoBasedOnVendorCode = async () => {
    const url = `${API_END_POINTS?.vendorPOTable}?vendor_code`;
  }

  // if (loading) {
  //   return <div>Loading...</div>
  // }

  // console.log(Props?.prInquiryData, "this is PR table")
  // console.log(Props?.dashboardApprovedVendorTableData, "this is RFQ table");

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
          <TabsList className="grid grid-cols-4 gap-4 h-full pb-6 bg-white">
            {cardData?.map((item, index) => (
              <TabsTrigger onClick={()=>{fetchTableData(item?.value,"")}}
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
        {cardData?.map((item, index) => (
            <TabsContent key={item.name || index} value={item.name} >
              <DashboardGateEntryTable dashboardTableData={tableData} companyDropdown={Props?.companyDropdown}/>
            </TabsContent>
          ))}
      </Tabs>
    </div>
  );
};

export default GateEntryDashboardCards;
