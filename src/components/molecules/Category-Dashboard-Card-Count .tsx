"use client";
import Image from "next/image";
import { dashboardCardData, PurchaseRequisition, TvendorRegistrationDropdown, CategoryPRCount } from "@/src/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import CategoryDashboardPurchaseEnquiryTable from "./Category-Type-Dashboard-Purchase-Enquiry-Table";
import CategoryDashboardPurchaseRequisitionTable from "./Category-Dashboard-Purchase-Requisition-Table";
import { categoryColorMap, fallbackColors } from "@/src/constants/categoryStyles";


type Props = {
  cardData: {
    assigned_categories: string[];
    category_counts: Record<string, number>;
    data: Record<string, any[]>;
  };
  companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"];
  prData: PurchaseRequisition[];
  prcount: CategoryPRCount;
  UserCategory: string[];
};

type DashboardTabItem = {
  name: string;
  originalName?: string;
  count: number;
  icon: string;
  text_color: string;
  bg_color: string;
  hover: string;
  subname?: string;
};

const CategoryMasterDashboardCards = ({ cardData, companyDropdown, prData, prcount, UserCategory }: Props) => {

  console.log("sdbwiwiwibwivb- check wegfjisb---->", cardData);
  const { designation } = useAuth();
  const user = designation;
  const [loading, setLoading] = useState<boolean>(true);
  console.log(user, "this is desingation");

  const dynamicCategoryTabs: DashboardTabItem[] = [
    ...cardData.assigned_categories.map((cat) => {
      const colors = categoryColorMap[cat] || fallbackColors;

      return {
        name: `Purchase Enquiry - ${cat}`,
        originalName: cat,
        count: cardData.category_counts?.[cat] ?? 0,
        icon: "/dashboard-assests/cards_icon/doc.svg",
        text_color: colors.text,
        bg_color: colors.bg,
        hover: colors.hover,
      };
    }),
    {
      name: "Purchase Requisition Request",
      subname: "Generated through VMS",
      count: prcount?.total_count ?? 0,
      icon: "/dashboard-assests/cards_icon/doc.svg",
      text_color: "text-purple-700",
      bg_color: "bg-purple-100",
      hover: "hover:bg-purple-200",
    },
  ];

  useEffect(() => {
    setLoading(false);
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Tabs defaultValue={dynamicCategoryTabs?.[0]?.name}>
        <TabsList className="grid grid-cols-4 gap-4 h-full pb-6 bg-white">
          {dynamicCategoryTabs.map((item, index) => (
            <TabsTrigger
              key={item.name || index}
              value={item.name}
              className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-black text-gray-500 rounded-2xl p-0 transition-all duration-300 ease-in-out"
            >
              <div
                className={`group w-full h-full rounded-2xl ${item.bg_color} flex flex-col p-3 ${item.text_color} h-28 justify-between border-2 ${item.hover} hover:scale-105 transition duration-300 transform cursor-pointer shadow-md`}
              >
                <div className="flex w-full justify-between items-center">
                  <div className="flex flex-col">
                    <h1 className="text-[14px] leading-none">{item.name}</h1>

                    {item.subname && (
                      <span className="text-[12px] text-gray-600">({item.subname})</span>
                    )}
                  </div>
                  <Image src={item.icon} alt="" width={25} height={30} />
                </div>
                <div className="text-[20px] text-left w-full font-bold">{item.count}</div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* --- TAB CONTENTS --- */}
        {dynamicCategoryTabs.map((item, idx) => (
          <TabsContent key={idx} value={item.name}>
            {item.originalName && (
              <CategoryDashboardPurchaseEnquiryTable
                dashboardTableData={cardData.data[item.originalName] || []}
                companyDropdown={companyDropdown}
                categoryType={item.originalName}
              />
            )}

            {item.name === "Purchase Requisition Request" && (
              <CategoryDashboardPurchaseRequisitionTable
                dashboardTableData={prData}
                companyDropdown={companyDropdown}
                UserCategory={UserCategory}

              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CategoryMasterDashboardCards;