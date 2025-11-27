"use client"
import Image from "next/image";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import API_END_POINTS from "@/src/services/apiEndPoints";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../atoms/select";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import DashboardGRWaiverTable from "./Dashboard-GR-Waiver-Table";
import { cardCount, CompanyCountKey } from "../pages/GR-Waiver-Dashboard";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";
import { useRouter } from "next/navigation";
import { formDataType } from "@/src/types/GR-waiverIterm";

type Props = {
  cardData: cardCount
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"]
}


const GRWaiverDashboardCards = ({ ...Props }: Props) => {
  console.log("rijgbwivbsvbiwgbw", Props.cardData);
  const { designation } = useAuth();
  const [tableData, setTableData] = useState<formDataType[]>([]);
  const [tableTitle, setTableTitle] = useState("Total GR Waiver");
  const [selectedDivisionCode, setSelectedDivisionCode] = useState("ALL");
  const router = useRouter();

  useEffect(() => {
    const defaultDivision = "ALL";
    const defaultTitle = "Total GR Waiver";

    setTableTitle(defaultTitle);
    fetchTableData(defaultDivision, defaultTitle);
  }, []);


  const formatTableTitle = (item: { name: string; short_name: string }) => {
    if (item.short_name === "Total") return "Total GR Waiver List";
    return `${item.short_name} GR Waiver List`;
  };


  const divisionConfig = [
    { code: "1000", icon: "/dashboard-assests/cards_icon/file-search.svg", text: "text-sky-800", bg: "bg-sky-100", hover: "hover:border-sky-400" },
    { code: "1012", icon: "/dashboard-assests/cards_icon/file-search.svg", text: "text-lime-800", bg: "bg-lime-100", hover: "hover:border-lime-400" },
    { code: "1022", icon: "/dashboard-assests/cards_icon/file-search.svg", text: "text-purple-800", bg: "bg-purple-200", hover: "hover:border-purple-400" },
    { code: "1025", icon: "/dashboard-assests/cards_icon/package.svg", text: "text-yellow-800", bg: "bg-yellow-100", hover: "hover:border-yellow-400" },
    { code: "1030", icon: "/dashboard-assests/cards_icon/doc.svg", text: "text-green-800", bg: "bg-green-100", hover: "hover:border-green-400" },
    { code: "2000", icon: "/dashboard-assests/cards_icon/doc.svg", text: "text-pink-800", bg: "bg-pink-100", hover: "hover:border-pink-400" },
    { code: "3000", icon: "/dashboard-assests/cards_icon/doc.svg", text: "text-violet-800", bg: "bg-violet-100", hover: "hover:border-violet-400" },
    { code: "7000", icon: "/dashboard-assests/cards_icon/doc.svg", text: "text-blue-800", bg: "bg-blue-100", hover: "hover:border-blue-400" },
    { code: "8000", icon: "/dashboard-assests/cards_icon/file-search.svg", text: "text-orange-800", bg: "bg-orange-100", hover: "hover:border-orange-400" },
    { code: "9000", icon: "/dashboard-assests/cards_icon/file-search.svg", text: "text-rose-800", bg: "bg-rose-100", hover: "hover:border-rose-400" },
  ];

  const allCardData = [
    {
      name: "Total GR Waiver",
      count: Props.cardData?.total_count ?? 0,
      divisionCode: "ALL",
      icon: "/dashboard-assests/cards_icon/file-search.svg",
      text_color: "text-emerald-800",
      bg_color: "bg-emerald-100",
      hover: "hover:border-emerald-400",
      short_name: "Total"
    },
    ...divisionConfig.map((div) => {
      const key = `${div.code}_count` as CompanyCountKey;
      const data = Props.cardData?.[key];

      return {
        name: `${data?.company_name || div.code}`,
        short_name: data?.short_name || div.code,
        count: data?.count ?? 0,
        divisionCode: div.code,
        icon: div.icon,
        text_color: div.text,
        bg_color: div.bg,
        hover: div.hover,
      };
    }),
  ];


  let cardData = allCardData;

  console.log(tableTitle, "this is table title")

  const fetchTableData = async (divisionCode: string, title?: string) => {
    setTableTitle(title ?? "");
    const filter = divisionCode === "ALL" ? "{}" : `{"division":"${divisionCode}"}`;

    const api = `${API_END_POINTS?.GRwaiverDashboardTable}?filters=${filter}`;
    const response: AxiosResponse = await requestWrapper({ url: api, method: "GET" });

    if (response?.status == 200) {
      if (response?.data?.message?.data?.length > 0) {
        setTableData(response?.data?.message?.data);
      } else {
        setTableData([]);
      }
    }
  };

  return (
    <div>
      <Tabs defaultValue={cardData?.[0]?.name}>
        <div className="">
          <TabsList className="grid md:grid-cols-4 grid-cols-2 gap-4 h-full pb-6 bg-white">
            {cardData?.map((item, index) => (
              <TabsTrigger
                onClick={() => {
                  const title = formatTableTitle(item);
                  setSelectedDivisionCode(item.divisionCode);
                  fetchTableData(item.divisionCode, title);
                }}
                key={item.name || index}
                value={item.name}
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-black text-gray-500 rounded-2xl p-0 transition-all duration-300 ease-in-out">
                <div
                  className={`group w-full h-full rounded-2xl ${item.bg_color} flex flex-col p-3 ${item.text_color} h-28 justify-between border-2 ${item.hover} hover:scale-105 transition duration-300 transform cursor-pointer shadow-md`}>
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
          <TabsContent key={item.name || index} value={item.name}>
            <DashboardGRWaiverTable dashboardTableData={tableData} TableTitle={tableTitle} divisionCode={selectedDivisionCode} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default GRWaiverDashboardCards;