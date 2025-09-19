"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import PurchaseAndOngoingOrders from "./SuperHead-Dashboard-po-table";
import PendingVendorsTable from "./SuperHead-Dashboard-Pending-Vendors-Table";
import RejectedVendorsTable from "./SuperHead-Dashboard-Rejected-Table";
import ApprovedVendorsTable from "./SuperHead-Dashboard-Approved-Table";
import SAPErrorTable from "./SuperHead-Dashboard-SAP-Error-Table";

type Props = {
  cardData?: any;
  companyDropdown?: any;
  apiResults: {
    accountsSAPError: { total_count: number; vendors: any[] };
    accountsPending: { total_count: number; vendors: any[] };
    accountsRejected: { total_count: number; vendors: any[] };
    accountsApproved: { total_count: number; vendors: any[] };
  };
};


const HeadDashboardCards = ({ ...Props }: Props) => {
  const [purchaseTeams, setPurchaseTeams] = useState<{ name: string; team_name: string }[]>([]);
  const [activeTeamTab, setActiveTeamTab] = useState("purchase");
  const [activePurchaseSubTab, setActivePurchaseSubTab] = useState("All");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const res = await requestWrapper({
          url: API_END_POINTS.PurchaseTeamFilter,
          method: "GET",
        });
        if (res?.status === 200) {
          setPurchaseTeams(res?.data?.message?.teams || []);
          setActivePurchaseSubTab("All");
        }
      } catch (err) {
        console.error("Error fetching teams", err);
      }
    };
    fetchTeams();
  }, []);

  const [purchaseData, setPurchaseData] = useState({
    purchasePending: { total_count: 0, vendors: [] },
    purchaseApproved: { total_count: 0, vendors: [] },
    purchaseRejected: { total_count: 0, vendors: [] },
    purchaseSAPError: { total_count: 0, vendors: [] },
    purchasePODetails: { total_count: 0, vendors: [] },
    purchaseRFQList: { total_count: 0, vendors: [] },
  });

  useEffect(() => {
    const fetchPurchaseData = async () => {
      setLoading(true);
      try {
        const teamParam = activePurchaseSubTab === "All" ? "" : activePurchaseSubTab;

        const [pending, approved, rejected, sapError, PODetails, RFQList] = await Promise.all([
          requestWrapper({
            url: `${API_END_POINTS.PurchaseTeamPendingVendors}?team=${teamParam}`,
            method: "GET",
          }),
          requestWrapper({
            url: `${API_END_POINTS.PurchaseTeamApprovedVendors}?team=${teamParam}`,
            method: "GET",
          }),
          requestWrapper({
            url: `${API_END_POINTS.PurchaseTeamRejectedVendors}?team=${teamParam}`,
            method: "GET",
          }),
          requestWrapper({
            url: `${API_END_POINTS.PurchaseTeamSAPError}?team=${teamParam}`,
            method: "GET",
          }),
          requestWrapper({
            url: `${API_END_POINTS.PurchaseTeamPODetailsList}?team=${teamParam}`,
            method: "GET",
          }),
          requestWrapper({
            url: `${API_END_POINTS.PurchaseTeamRFQList}?team=${teamParam}`,
            method: "GET",
          }),
        ]);

        setPurchaseData({
          purchasePending: {
            total_count: pending?.data?.message?.total_count || 0,
            vendors: pending?.data?.message?.pending_vendor_onboarding || [],
          },
          purchaseApproved: {
            total_count: approved?.data?.message?.total_count || 0,
            vendors: approved?.data?.message?.purchase_team_approved || [],
          },
          purchaseRejected: {
            total_count: rejected?.data?.message?.total_count || 0,
            vendors: rejected?.data?.message?.purchase_team_rejected || [],
          },
          purchaseSAPError: {
            total_count: sapError?.data?.message?.total_count || 0,
            vendors: sapError?.data?.message?.purchase_team_sap_error || [],
          },
          purchasePODetails: {
            total_count: PODetails?.data?.message?.total_count || 0,
            vendors: PODetails?.data?.message?.total_po || [],
          },
          purchaseRFQList: {
            total_count: RFQList?.data?.message?.total_count || 0,
            vendors: RFQList?.data?.message?.data || [],
          },
        });
      } catch (err) {
        console.error("Error fetching purchase APIs", err);
      } finally {
        setLoading(false);
      }
    };

    if (activeTeamTab === "purchase") {
      fetchPurchaseData();
    }
  }, [activePurchaseSubTab, activeTeamTab]);


  const purchaseCards = [
    {
      name: "Purchase Pending",
      count: purchaseData.purchasePending.total_count,
      vendors: purchaseData.purchasePending.vendors,
      icon: "/dashboard-assests/cards_icon/clock.svg",
      text_color: "text-red-800",
      bg_color: "bg-red-100",
      hover: "hover:border-red-400",
    },
    {
      name: "Purchase Approved",
      count: purchaseData.purchaseApproved.total_count,
      vendors: purchaseData.purchaseApproved.vendors,
      icon: "/dashboard-assests/cards_icon/tick.svg",
      text_color: "text-emerald-800",
      bg_color: "bg-emerald-100",
      hover: "hover:border-emerald-400",
    },
    {
      name: "Purchase Rejected",
      count: purchaseData.purchaseRejected.total_count,
      vendors: purchaseData.purchaseRejected.vendors,
      icon: "/dashboard-assests/cards_icon/doc.svg",
      text_color: "text-yellow-800",
      bg_color: "bg-yellow-100",
      hover: "hover:border-yellow-400",
    },
    {
      name: "SAP Error",
      count: purchaseData.purchaseSAPError.total_count,
      vendors: purchaseData.purchaseSAPError.vendors,
      icon: "/dashboard-assests/cards_icon/file-search.svg",
      text_color: "text-purple-800",
      bg_color: "bg-purple-100",
      hover: "hover:border-purple-400",
    },
    {
      name: "Purchase & Ongoing Orders",
      count: purchaseData.purchasePODetails.total_count,
      vendors: purchaseData.purchasePODetails.vendors,
      icon: "/dashboard-assests/cards_icon/package.svg",
      text_color: "text-blue-800",
      bg_color: "bg-blue-100",
      hover: "hover:border-blue-400",
    },
    {
      name: "RFQ Comparision",
      count: purchaseData.purchaseRFQList.total_count,
      vendors: purchaseData.purchaseRFQList.vendors,
      icon: "/dashboard-assests/cards_icon/file-search.svg",
      text_color: "text-orange-800",
      bg_color: "bg-orange-100",
      hover: "hover:border-orange-400",
    },
  ];


  const accountsCards = [
    {
      name: "Accounts Pending",
      count: Props.apiResults.accountsPending.total_count,
      vendors: Props.apiResults.accountsPending.vendors,
      icon: "/dashboard-assests/cards_icon/clock.svg",
      text_color: "text-orange-800",
      bg_color: "bg-orange-100",
      hover: "hover:border-orange-400",
    },
    {
      name: "Accounts Approved",
      count: Props.apiResults.accountsApproved.total_count,
      vendors: Props.apiResults.accountsApproved.vendors,
      icon: "/dashboard-assests/cards_icon/tick.svg",
      text_color: "text-emerald-800",
      bg_color: "bg-emerald-100",
      hover: "hover:border-emerald-400",
    },
    {
      name: "Accounts Rejected",
      count: Props.apiResults.accountsRejected.total_count,
      vendors: Props.apiResults.accountsRejected.vendors,
      icon: "/dashboard-assests/cards_icon/doc.svg",
      text_color: "text-red-800",
      bg_color: "bg-red-100",
      hover: "hover:border-red-400",
    },
    {
      name: "SAP Error",
      count: Props.apiResults.accountsSAPError.total_count,
      vendors: Props.apiResults.accountsSAPError.vendors,
      icon: "/dashboard-assests/cards_icon/file-search.svg",
      text_color: "text-purple-800",
      bg_color: "bg-purple-100",
      hover: "hover:border-purple-400",
    },
  ];

  const activeCards = activeTeamTab === "purchase" ? purchaseCards : accountsCards;

  return (
    <div className="space-y-6">
      {/* Top-level tabs: Purchase / Accounts */}
      <Tabs value={activeTeamTab} onValueChange={setActiveTeamTab}>
        <TabsList className="flex gap-4 w-fit bg-transparent">
          <TabsTrigger
            value="purchase"
            className={[
              "whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition",
              activeTeamTab === "purchase"
                ? "bg-gradient-to-br from-blue-600 to-indigo-800 shadow-lg text-white"
                : "bg-white text-blue-600 hover:ring-2 hover:ring-blue-200 shadow",
            ].join(" ")}
            style={activeTeamTab === "purchase" ? { color: "white" } : {}}
          >
            Purchase Team
          </TabsTrigger>

          <TabsTrigger
            value="accounts"
            className={[
              "whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition",
              activeTeamTab === "accounts"
                ? "bg-gradient-to-br from-blue-600 to-indigo-800 shadow-lg text-white"
                : "bg-white text-blue-600 hover:ring-2 hover:ring-blue-200 shadow",
            ].join(" ")}
            style={activeTeamTab === "accounts" ? { color: "white" } : {}}
          >
            Accounts Team
          </TabsTrigger>
        </TabsList>
      </Tabs>


      {/* Sub-tabs for Purchase team */}
      {activeTeamTab === "purchase" && (
        <Tabs value={activePurchaseSubTab} onValueChange={setActivePurchaseSubTab}>
          <TabsList className="flex gap-2 justify-start no-scrollbar bg-transparent">
            {purchaseTeams.map((team) => (
              <TabsTrigger
                key={team.name}
                value={team.team_name}
                className={[
                  "whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition",
                  activePurchaseSubTab === team.team_name
                    ? "bg-gradient-to-br from-blue-600 to-indigo-800 shadow-lg text-white"
                    : "bg-white text-blue-600 hover:ring-2 hover:ring-blue-200 shadow",
                ].join(" ")}
                style={activePurchaseSubTab === team.team_name ? { color: "white" } : {}}
              >
                {team.team_name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Cards */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <Tabs defaultValue={activeCards[0].name} className="">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full pb-6 bg-transparent">
            {activeCards.map((item, index) => (
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

          {purchaseCards.map((item) => (
            <TabsContent key={item.name} value={item.name}>
              {item.name === "Purchase Pending" && (
                <PendingVendorsTable
                  dashboardTableData={purchaseData.purchasePending}
                  companyDropdown={Props?.companyDropdown}
                  team={activePurchaseSubTab}
                />
              )}
              {item.name === "Purchase Approved" && (
                <ApprovedVendorsTable
                  dashboardTableData={purchaseData.purchaseApproved}
                  companyDropdown={Props?.companyDropdown}
                  team={activePurchaseSubTab}

                />
              )}
              {item.name === "Purchase Rejected" && (
                <RejectedVendorsTable
                  dashboardTableData={purchaseData.purchaseRejected}
                  companyDropdown={Props?.companyDropdown}
                  team={activePurchaseSubTab}

                />
              )}
              {item.name === "Purchase & Ongoing Orders" && (
                <PurchaseAndOngoingOrders
                  dashboardTableData={purchaseData.purchasePODetails}
                  companyDropdown={Props?.companyDropdown}
                  // team={activePurchaseSubTab}
                />
              )}
              {item.name === "SAP Error" && (
                <SAPErrorTable
                  dashboardTableData={purchaseData.purchaseSAPError}
                  companyDropdown={Props?.companyDropdown}
                  team={activePurchaseSubTab}
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default HeadDashboardCards;