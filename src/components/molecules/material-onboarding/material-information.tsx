"use client";

import React, { useState } from "react";
import MaterialRequestForm from "./material-request-form";
import { MaterialCode } from "@/src/types/PurchaseRequestType";
import { UseFormReturn } from "react-hook-form";

interface MaterialInformationProps {
  form: UseFormReturn<any>;
  basicMasters: {
    companyMaster: any[];
    plantMaster: any[];
    materialCategoryMaster: any[];
    materialTypeMaster: any[];
    uomMaster: any[];
  };
  advancedMasters: Record<string, any[]>;
  AllMaterialCodes: MaterialCode[];
  MaterialOnboardingDetails?: any;
  companyName?: any;
}

export default function MaterialInformation({ form, basicMasters, advancedMasters, AllMaterialCodes, MaterialOnboardingDetails, companyName }: MaterialInformationProps) {

  console.log("ALl Material Codes----->", AllMaterialCodes);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [materialSelectedFromList, setMaterialSelectedFromList] = useState(false);
  const [materialCodeAutoFetched, setMaterialCodeAutoFetched] = useState(false);
  const [selectedMaterialType, setSelectedMaterialType] = useState("");

  // 🔍 Material description search logic
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

      setSearchResults(mappedResults || []);
      setShowSuggestions(true);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
    setMaterialSelectedFromList(false);
    setMaterialCodeAutoFetched(false);
  };

  // 📦 Select a material from dropdown
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
        MaterialOnboardingDetails={MaterialOnboardingDetails}
        companyName={companyName}
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
