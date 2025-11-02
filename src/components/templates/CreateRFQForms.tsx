
"use client"
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PurchaseRequestDropdown } from '@/src/types/PurchaseRequestType'
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import LogisticsExportRFQ from './RFQTemplates/LogisticsExportRFQ'
import LogisticsImportRFQ from './RFQTemplates/LogisticsImportRFQ'
import MaterialRFQ from './RFQTemplates/MaterialRFQ'
import ServiceRFQ from './RFQTemplates/ServiceRFQ'

interface Props {
  Dropdown: PurchaseRequestDropdown["message"];
  pr_codes?: string | null;
  pr_type?: string | null;
}

const CreateRFQForms = ({ Dropdown }: Props) => {
  const searchParams = useSearchParams();
  // const prCodeParam = searchParams.get("pr_codes");
  // const decodedValue = decodeURIComponent(prCodeParam ?? "");
  // const resultPRArray = decodedValue.trim() === "" ? [] : decodedValue.split(",");
  const [resultPRArray, setResultPRArray] = useState<string[]>([]);
  const prTypeParam = searchParams.get('pr_type');
  const [currentSlide, setCurrentSlide] = useState(1);
  const router = useRouter();
  const [defaultTab, setDefaultTab] = useState("RfqForLogisticImport");
  const getDefaultTab = (pr_type: string | null) => {
    switch (pr_type) {
      case "NB":
        setCurrentSlide(3)
        return "RfqForMaterial";
      case "SB":
        setCurrentSlide(4)
        return "RfqForService";
      default:
        return "RfqForLogisticImport";
    }
  };

  const handleTabClick = (tabId: number) => {
    setCurrentSlide(tabId);
        // remove query params — navigate to base URL
    router.replace("/create-rfq", { scroll: false });
    switch (tabId) {
      case 3:
        setDefaultTab("RfqForMaterial")
        return
      case 4:
        setDefaultTab("RfqForService")
        return
      case 2:
        setDefaultTab("RfqForLogisticExport")
        return
      default:
        setDefaultTab("RfqForLogisticImport")
        return ;
    }
  };

  useEffect(() => {
    const newTab = getDefaultTab(prTypeParam);
    console.log("New Tab:::", newTab)
    if(prTypeParam){
      setDefaultTab(newTab);
    }
  }, [prTypeParam]);

useEffect(() => {
  const prCodeParam = searchParams.get("pr_codes");
  console.log(prCodeParam,"prCodeParamprCodeParamprCodeParamprCodeParamprCodeParamprCodeParam")
  if (prCodeParam) {
    console.log("prCodeParam inside oinsdie")
    const decodedValue = decodeURIComponent(prCodeParam);
    const parsedArray = decodedValue.trim() === "" ? [] : decodedValue.split(",");
    setResultPRArray(parsedArray);
  }else{
    setResultPRArray([]);
  }
}, [searchParams]); // only run when params change

  return (
    <div className="bg-[#F4F4F6]">
      <div className=" mx-auto pt-6">
        <Tabs value={defaultTab} onValueChange={setDefaultTab}>
          {/* ─── Tab bar ───────────────────────────────────────────── */}
          <TabsList className="flex justify-start items-start gap-4 p-2 rounded-">
            {[
              { id: 1, value: "RfqForLogisticImport", label: "RFQ for Logistics (Import)" },
              { id: 2, value: "RfqForLogisticExport", label: "RFQ for Logistics (Export)" },
              { id: 3, value: "RfqForMaterial", label: "RFQ for Material" },
              { id: 4, value: "RfqForService", label: "RFQ for Services" },
            ].map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                onClick={() => handleTabClick(tab.id)}
                className={[
                  "whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition ",
                  currentSlide === tab.id
                    ? "bg-gradient-to-br from-blue-600 to-indigo-800 shadow-lg text-white"
                    : "bg-white text-blue-600 hover:ring-2 hover:ring-blue-200  shadow"
                ].join(" ")}
                style={currentSlide === tab.id ? { color: 'white' } : {}}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ─── Tab panels ───────────────────────────────────────── */}
          <TabsContent value="RfqForLogisticImport" className="mt-8">
            <LogisticsImportRFQ Dropdown={Dropdown} />
          </TabsContent>

          <TabsContent value="RfqForLogisticExport" className="mt-8">
            <LogisticsExportRFQ Dropdown={Dropdown} />
          </TabsContent>

          <TabsContent value="RfqForMaterial" className="mt-8">
            <MaterialRFQ Dropdown={Dropdown} pr_codes={resultPRArray} pr_type={prTypeParam} />
          </TabsContent>

          <TabsContent value="RfqForService" className="mt-8">
            <ServiceRFQ Dropdown={Dropdown} pr_codes={resultPRArray} pr_type={prTypeParam} />
          </TabsContent>
        </Tabs>
      </div>
    </div>

  )
}

export default CreateRFQForms;