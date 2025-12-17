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
  const [materialCodeStatus, setMaterialCodeStatus] = useState<"idle" | "checking" | "exists" | "available">("idle");
  const [selectedCodeLogic, setSelectedCodeLogic] = useState<string>("");
  const [latestCodeSuggestions, setLatestCodeSuggestions] = useState<MaterialCode[]>([]);

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
        // console.log(data);
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

  const checkMaterialCodeExists = async (code: string) => {
    if (!code) return;

    try {
      setMaterialCodeStatus("checking");

      const company = form.getValues("material_company_code");
      const materialtype = form.getValues("material_type");

      if (!company || !materialtype) {
        setMaterialCodeStatus("idle");
        return;
      }

      const url =
        `${API_END_POINTS.MaterialCodeSearchApi}` +
        `?filters=${encodeURIComponent(
          JSON.stringify({
            company,
            material_type: materialtype,
          })
        )}&search_term=${encodeURIComponent(code)}`;

      const response: AxiosResponse = await requestWrapper({
        url,
        method: "GET",
      });

      const data = response?.data?.message?.data || [];

      if (data.length > 0) {
        setMaterialCodeStatus("exists");
        form.setError("material_code_revised", {
          type: "manual",
          message: "Material Code already exists",
        });
      } else {
        setMaterialCodeStatus("available");
        form.clearErrors("material_code_revised");
      }
    } catch (err) {
      console.error("Material code validation failed", err);
      setMaterialCodeStatus("idle");
    }
  };

  useEffect(() => {
    if (!selectedCodeLogic || !AllMaterialCodes.length) {
      setLatestCodeSuggestions([]);
      return;
    }

    const matched = AllMaterialCodes
      .filter(item => item.name?.startsWith(`${selectedCodeLogic}-`))
      .sort((a, b) => {
        const numA = Number(a.name.split("-").pop());
        const numB = Number(b.name.split("-").pop());
        return numB - numA;
      })
      .slice(0, 1);

    setLatestCodeSuggestions(matched);
  }, [selectedCodeLogic, AllMaterialCodes]);


  useEffect(() => {
    const code = form.watch("material_code_revised");

    if (!code || code.endsWith("-")) {
      setMaterialCodeStatus("idle");
      return;
    }

    const timer = setTimeout(() => {
      checkMaterialCodeExists(code);
    }, 600);

    return () => clearTimeout(timer);
  }, [
    form.watch("material_code_revised"),
    form.watch("material_company_code"),
    form.watch("material_type"),
  ]);

  useEffect(() => {
    fetchMaterialCodeData();
    setMaterialCodeStatus("idle");
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
        materialCodeStatus={materialCodeStatus}
        selectedCodeLogic={selectedCodeLogic}
        setSelectedCodeLogic={setSelectedCodeLogic}
        latestCodeSuggestions={latestCodeSuggestions}
      />
    </div>
  );
}
