
"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Input } from '../atoms/input'
import { Button } from '../atoms/button'
import { PurchaseRequestDropdown } from '@/src/types/PurchaseRequestType'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
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
  const prCodeParam = searchParams.get('pr_codes');
  const prTypeParam = searchParams.get('pr_type');
  const [currentSlide, setCurrentSlide] = useState(1);

  const getDefaultTab = (pr_type: string | null) => {
    switch (pr_type) {
      case "NB":
        return "RfqForMaterial";
      case "SB":
        return "RfqForService";
      default:
        return "RfqForLogisticImport";
    }
  };

  const [defaultTab, setDefaultTab] = useState("RfqForLogisticImport");

  useEffect(() => {
    const newTab = getDefaultTab(prTypeParam);
    console.log("New Tab:::",newTab)
    setDefaultTab(newTab);
  }, [prTypeParam]);


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
                onClick={() => setCurrentSlide(tab.id)}
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
            <MaterialRFQ Dropdown={Dropdown} pr_codes={prCodeParam} pr_type={prTypeParam} />
          </TabsContent>

          <TabsContent value="RfqForService" className="mt-8">
            <ServiceRFQ Dropdown={Dropdown} />
          </TabsContent>
        </Tabs>
      </div>
    </div>

  )
}

export default CreateRFQForms;

{/* <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Request Type <span className="text-red-600 ml-1">*</span>
          </h1>
          <Select
            onValueChange={(value) => { handleSelectChange(value, "purchase_requisition_type") }}
            value={formData?.purchase_requisition_type ?? ""}
            disabled
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.purchase_requisition_type?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Company Code Area <span className="text-red-600 ml-1">*</span>
          </h1>
          <Select
            value={formData?.company ?? ""}
            onValueChange={(value) => { handleSelectChange(value, "company") }}
            disabled
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.company?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Plant <span className="text-red-600 ml-1">*</span>
          </h1>
          <Select value={formData?.plant ?? ""} onValueChange={(value) => { handleSelectChange(value, "plant") }} disabled>
            <SelectTrigger className={`${errors?.plant
              ? `border border-red-600`
              : ``
              }`}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.plant?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.plant_name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">Requisitioner <span className="text-red-600 ml-1">*</span></h1>
          <Input placeholder="" name='requisitioner' onChange={(e) => { handleFieldChange(e) }} value={formData?.requisitioner ?? user ?? ""} disabled />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Group <span className="text-red-600 ml-1">*</span>
          </h1>
          <Select onValueChange={(value) => { handleSelectChange(value, "purchase_group") }} value={formData?.purchase_group ?? ""} disabled>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.purchase_group?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">Cart Id</h1>
          <Input placeholder="" name='requisitioner' value={formData?.cart_id ?? ""} disabled />
        </div>
      </div> */}