"use client";

import React, { useState, useEffect } from "react";
import MaterialRequestForm from "./material-request-form";
import { MaterialCode } from "@/src/types/PurchaseRequestType";
import { UseFormReturn } from "react-hook-form";
import { MaterialRegistrationFormData } from "@/src/types/MaterialCodeRequestFormTypes";
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'


interface MaterialInformationProps {
  form: UseFormReturn<any>;
  basicMasters: {
    companyMaster: any[];
    materialCategoryMaster: any[];
    uomMaster: any[];
  };
  MaterialOnboarding?: MaterialRegistrationFormData;
}

export default function MaterialInformation({ form, basicMasters, MaterialOnboarding }: MaterialInformationProps) {

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [materialSelectedFromList, setMaterialSelectedFromList] = useState(false);
  const [materialCodeAutoFetched, setMaterialCodeAutoFetched] = useState(false);
  const [selectedMaterialType, setSelectedMaterialType] = useState("");
  const [AllMaterialCodes, setAllMaterialCodes] = useState<MaterialCode[]>([]);

  const fetchMaterialCodeData = async (query?: string): Promise<MaterialCode[]> => {
    try {
      const baseUrl = API_END_POINTS?.MaterialCodeSearchApi;
      let url = baseUrl;

      const company = form.getValues("material_company_code");
      const materialtype = form.getValues("material_type");

      const filters: Record<string, string> = {};
      if (company) filters.company = company;
      if (materialtype) filters.material_type = materialtype;

      if (Object.keys(filters).length > 0) {
        url += `?filters=${encodeURIComponent(JSON.stringify(filters))}`;
      }

      if (query) {
        url += `${url.includes("?") ? "&" : "?"}search_term=${encodeURIComponent(query)}`;
      }

      const response: AxiosResponse = await requestWrapper({ url, method: "GET" });
      if (response?.status === 200) {
        const data = response.data?.message?.data || [];
        setAllMaterialCodes(data);
        return data;
      } else {
        console.error("Failed to fetch material codes:", response);
      }
    } catch (error) {
      console.error("Error fetching material code data:", error);
    }
    return [];
  };

  useEffect(() => {
    fetchMaterialCodeData();
  }, []);

  useEffect(() => {
    const subscription = form.watch(async (value, { name }) => {
      if (name === "material_company_code" || name === "material_type") {
        await fetchMaterialCodeData();
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);


  const handleMaterialSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    form.setValue("material_name_description", val);

    if (val.trim().length > 2) {
      const filtered = AllMaterialCodes?.filter((item) =>
        item.material_description?.toLowerCase().includes(val.toLowerCase())
      );

      const mappedResults = filtered?.map((item) => ({
        material_name_description: item.material_description,
        material_code_revised: item.name,
        material_type: item.material_type,
      }));

      console.log("Mapped Results:", mappedResults);

      setSearchResults(mappedResults || []);
      setShowSuggestions(true);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
    setMaterialSelectedFromList(false);
    setMaterialCodeAutoFetched(false);
  };

  const handleMaterialSelect = (item: any) => {
    form.setValue("material_name_description", item.material_name_description);
    form.setValue("material_code_revised", item.material_code_revised);
    form.setValue("material_type", item.material_type);
    setMaterialSelectedFromList(true);
    setMaterialCodeAutoFetched(true);
    setShowSuggestions(false);
  };

  return (
    <div>
      <MaterialRequestForm
        form={form}
        masters={basicMasters}
        MaterialOnboardingDetails={MaterialOnboarding}
        handleMaterialSearch={handleMaterialSearch}
        handleMaterialSelect={handleMaterialSelect}
        searchResults={searchResults}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        materialSelectedFromList={materialSelectedFromList}
        setMaterialSelectedFromList={setMaterialSelectedFromList}
        materialCodeAutoFetched={materialCodeAutoFetched}
        setMaterialCodeAutoFetched={setMaterialCodeAutoFetched}
        setSelectedMaterialType={setSelectedMaterialType}
      />
    </div>
  );
}
