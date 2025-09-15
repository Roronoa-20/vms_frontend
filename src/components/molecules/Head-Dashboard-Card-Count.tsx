"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import PurchaseAndOngoingOrders from "./VendorPurchase-and-Ongoing-Orders";
import DashboardDispatchVendorsTable from "./Dashboard-Dispatch-Vendors-Table";
import DashboardRFQTable from "./ViewRFQ/Dashboard-Vendor-RFQ-Table";

type Props = {
  cardData: any;
  dashboardPOTableData?: any;
  companyDropdown?: any;
  dispatchTableData?: any;
  dispatchCardCount: string | number;
  rfqData: any;
};

const HeadDashboardCards = ({ ...Props }: Props) => {
  const [purchaseTeams, setPurchaseTeams] = useState<{ name: string; team_name: string }[]>([]);
  const [activeTeamTab, setActiveTeamTab] = useState("purchase"); // purchase | accounts
  const [activePurchaseSubTab, setActivePurchaseSubTab] = useState("All"); // default "All"

  // fetch Purchase Team filter
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await requestWrapper({
          url: API_END_POINTS.PurchaseTeamFilter,
          method: "GET",
        });
        if (res?.status === 200) {
          setPurchaseTeams(res?.data?.message?.teams || []);
          setActivePurchaseSubTab("All"); // default
        }
      } catch (err) {
        console.error("Error fetching teams", err);
      }
    };
    fetchTeams();
  }, []);

  // Card sets for Purchase (6) and Accounts (4)
  const purchaseCards = [
    {
      name: "Purchase & Ongoing Orders",
      count: Props?.cardData?.purchase_order_count ?? 0,
      icon: "/dashboard-assests/cards_icon/bar.svg",
      text_color: "text-rose-800",
      bg_color: "bg-rose-100",
    },
    {
      name: "Quotation",
      count: Props.rfqData?.overall_total_rfq ?? 0,
      icon: "/dashboard-assests/cards_icon/doc.svg",
      text_color: "text-blue-800",
      bg_color: "bg-blue-100",
    },
    {
      name: "Dispatch Details",
      count: Props?.dispatchCardCount ?? 0,
      icon: "/dashboard-assests/cards_icon/truck.svg",
      text_color: "text-emerald-800",
      bg_color: "bg-emerald-100",
    },
    {
      name: "Purchase Order History",
      count: 0,
      icon: "/dashboard-assests/cards_icon/clock.svg",
      text_color: "text-blue-800",
      bg_color: "bg-blue-100",
    },
    {
      name: "Vendor Performance",
      count: 3, // dummy count, replace with API
      icon: "/dashboard-assests/cards_icon/star.svg",
      text_color: "text-yellow-800",
      bg_color: "bg-yellow-100",
    },
    {
      name: "Pending Approvals",
      count: 5, // dummy
      icon: "/dashboard-assests/cards_icon/warning.svg",
      text_color: "text-red-800",
      bg_color: "bg-red-100",
    },
  ];

  const accountsCards = [
    {
      name: "Invoice Processing",
      count: 2,
      icon: "/dashboard-assests/cards_icon/doc.svg",
      text_color: "text-purple-800",
      bg_color: "bg-purple-100",
    },
    {
      name: "Payment Requests",
      count: 4,
      icon: "/dashboard-assests/cards_icon/wallet.svg",
      text_color: "text-green-800",
      bg_color: "bg-green-100",
    },
    {
      name: "Cleared Payments",
      count: 1,
      icon: "/dashboard-assests/cards_icon/check.svg",
      text_color: "text-blue-800",
      bg_color: "bg-blue-100",
    },
    {
      name: "Pending Invoices",
      count: 7,
      icon: "/dashboard-assests/cards_icon/clock.svg",
      text_color: "text-orange-800",
      bg_color: "bg-orange-100",
    },
  ];

  const activeCards = activeTeamTab === "purchase" ? purchaseCards : accountsCards;

  return (
    <div className="space-y-6">
      {/* Top-level tabs: Purchase / Accounts */}
      <Tabs value={activeTeamTab} onValueChange={setActiveTeamTab}>
        <TabsList className="grid grid-cols-2 w-[300px] mb-4">
          <TabsTrigger value="purchase">Purchase Team</TabsTrigger>
          <TabsTrigger value="accounts">Accounts Team</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Sub-tabs for Purchase team */}
      {activeTeamTab === "purchase" && (
        <Tabs value={activePurchaseSubTab} onValueChange={setActivePurchaseSubTab}>
          <TabsList className="flex gap-2 mb-4">
            {purchaseTeams.map((team) => (
              <TabsTrigger key={team.name} value={team.team_name}>
                {team.team_name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Cards */}
      <Tabs defaultValue={activeCards[0].name} className="">
        <TabsList className="grid grid-cols-4 gap-4 h-full pb-6 bg-white">
          {activeCards.map((item, index) => (
            <TabsTrigger
              key={item.name || index}
              value={item.name}
              className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-black text-gray-500 rounded-2xl p-0"
            >
              <div
                className={`group w-full h-full rounded-2xl ${item.bg_color} flex flex-col p-3 ${item.text_color} h-28 justify-between border-2 hover:scale-105 transition`}
              >
                <div className="flex w-full justify-between">
                  <h1 className="text-[13px]">{item.name}</h1>
                  <Image src={item.icon} alt="" width={25} height={30} />
                </div>
                <div className="text-[20px] font-bold">{item.count}</div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {purchaseCards.map((item) => (
          <TabsContent key={item.name} value={item.name}>
            {item.name === "Purchase & Ongoing Orders" && (
              <PurchaseAndOngoingOrders
                dashboardPOTableData={Props?.dashboardPOTableData}
                companyDropdown={Props?.companyDropdown}
              />
            )}
            {item.name === "Quotation" && (
              <DashboardRFQTable
                dashboardTableData={Props?.rfqData?.data}
                companyDropdown={Props?.companyDropdown}
              />
            )}
            {item.name === "Dispatch Details" && (
              <DashboardDispatchVendorsTable dashboardTableData={Props?.dispatchTableData} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default HeadDashboardCards;