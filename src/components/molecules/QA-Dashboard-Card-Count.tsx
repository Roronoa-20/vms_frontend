"use client"
import Image from "next/image";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import { QMSOnboardingRecord, BaseQMSResponse, TotalQMSOnboardingResponse, ApprovedSupplierQMSResponse, PendingQMSOnboardingResponse, RejectedSupplierQMSResponse, FullyFilledSupplierQMSResponse } from '@/src/types/QAdashboardtypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react";
import QMSApprovedTable from "./Dashboard-Approved-QMS-Table";
import QMSRejectedTable from "./Dashboard-Rejected-QMS-Table";
import QMSPendingTable from "./Dashboard-Pending-QMS-Table";
import TotalQMSTable from "./Dashboard-Total-QMS-Table";
import FilledQMSTable from "./Dashboard-Filled-QMS-Table";


type Props = {
  cardData: TotalQMSOnboardingResponse["message"] | null
  dashboardPendingTableData?: PendingQMSOnboardingResponse["message"] | null
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"] | null
  dashboardApprovedTableData: ApprovedSupplierQMSResponse["message"] | null
  dashboardRejectedTableData: RejectedSupplierQMSResponse["message"] | null
  dashboardFilledQMSTableData: FullyFilledSupplierQMSResponse["message"] | null
}

const QADashboardCards = ({ ...Props }: Props) => {
  const [cardCount, setCardCount] = useState(Props?.cardData);

  const cardData = [
    {
      name: "Total QMS Form",
      count: cardCount?.total_count ?? 0,
      icon: "/dashboard-assests/cards_icon/bar.svg",
      text_color: "text-rose-800",
      bg_color: "bg-rose-100",
      hover: "hover:border-rose-400",
    },
    /*{
      name: "Filled QMS Form",
      count: Props.dashboardFilledQMSTableData?.total_count ?? 0,
      icon: "/dashboard-assests/cards_icon/doc.svg",
      text_color: "text-yellow-800",
      bg_color: "bg-yellow-100",
      hover: "hover:border-yellow-400",
    },
    {
      name: "Pending QMS Form",
      count: Props.dashboardPendingTableData?.total_count ?? 0,
      icon: "/dashboard-assests/cards_icon/clock.svg",
      text_color: "text-blue-800",
      bg_color: "bg-blue-100",
      hover: "hover:border-blue-400",
    },*/
    {
      name: "Approved QMS Form",
      count: Props?.dashboardApprovedTableData?.total_count ?? 0,
      icon: "/dashboard-assests/cards_icon/tick.svg",
      text_color: "text-emerald-800",
      bg_color: "bg-emerald-100",
      hover: "hover:border-emerald-400",
    },
    /*{
      name: "Rejected QMS Form",
      count: Props?.dashboardRejectedTableData?.total_count ?? 0,
      icon: "/dashboard-assests/cards_icon/tick.svg",
      text_color: "text-violet-800",
      bg_color: "bg-violet-100",
      hover: "hover:border-violet-400",
    },*/

  ];

  return (
    <div>
      <Tabs defaultValue={cardData?.[0]?.name} className="">
        <div>
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
              {item.name === "Total QMS Form" && (
                <TotalQMSTable
                  companyDropdown={Props?.companyDropdown || []}
                  dashboardTableData={Props?.cardData?.total_qms_onboarding || []}
                />
              )}
              {item.name === "Filled QMS Form" && (
                <FilledQMSTable
                  companyDropdown={Props?.companyDropdown || []}
                  dashboardTableData={Props?.dashboardFilledQMSTableData?.completed_qms_onboarding || []}
                />
              )}
              {item.name === "Pending QMS Form" && (
                <QMSPendingTable
                  companyDropdown={Props?.companyDropdown || []}
                  dashboardTableData={Props?.dashboardPendingTableData?.pending_qms_onboarding || []}
                />
              )}
              {item.name === "Approved QMS Form" && (
                <QMSApprovedTable
                  companyDropdown={Props?.companyDropdown || []}
                  dashboardTableData={Props?.dashboardApprovedTableData?.approved_supplier_qms || []}
                />
              )}
              {item.name === "Rejected QMS Form" && (
                <QMSRejectedTable
                  companyDropdown={Props?.companyDropdown || []}
                  dashboardTableData={Props?.dashboardRejectedTableData?.rejected_supplier_qms || []}
                />
              )}
            </TabsContent>
          )
        }
        )
        }
      </Tabs>
    </div>

  );
};

export default QADashboardCards;
