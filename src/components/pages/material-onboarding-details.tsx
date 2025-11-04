"use client";

import React, { useEffect, useState } from "react";
import MaterialOnboardingForm from "@/src/components/molecules/material-onboarding-details/material-onboarding-form";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";

interface MaterialOnboardingDetailsProps {
  searchParams?: Record<string, string>;
}

const MaterialOnboardingDetails: React.FC<MaterialOnboardingDetailsProps> = ({ searchParams }) => {
  const [loading, setLoading] = useState(true);

  const [materialOnboardingDetailsJson, setMaterialOnboardingDetailsJson] = useState<any>(null);
  const [materialCodeDetailsJSON, setMaterialCodeDetailsJSON] = useState<any>(null);
  const [materialCodesJSON, setMaterialCodesJSON] = useState<any>(null);
  const [allMaterialTypeJSON, setAllMaterialTypeJSON] = useState<any>(null);
  const [CompanyJson, setCompanyJson] = useState<any>(null);
  const [PlantJson, setPlantJson] = useState<any>(null);
  const [DivisionJson, setDivisionJson] = useState<any>(null);
  const [IndustryJson, setIndustryJson] = useState<any>(null);
  const [UOMJson, setUOMJson] = useState<any>(null);
  const [MRPTypeJson, setMRPTypeJson] = useState<any>(null);
  const [ValuationClassJson, setValuationClassJson] = useState<any>(null);
  const [ProcurementTypeJson, setProcurementTypeJson] = useState<any>(null);
  const [ValuationCategoryJson, setValuationCategoryJson] = useState<any>(null);
  const [MaterialGroupJson, setMaterialGroupJson] = useState<any>(null);
  const [ProfitCenterJson, setProfitCenterJson] = useState<any>(null);
  const [PriceControlJson, setPriceControlJson] = useState<any>(null);
  const [AvailabilityCheckJson, setAvailabilityCheckJson] = useState<any>(null);
  const [MaterialTypeJson, setMaterialTypeJson] = useState<any>(null);
  const [MRPControllerJson, setMRPControllerJson] = useState<any>(null);
  const [StorageLocationJson, setStorageLocationJson] = useState<any>(null);
  const [ClassTypeJson, setClassTypeJson] = useState<any>(null);
  const [PurchaseGroupJson, setPurchaseGroupJson] = useState<any>(null);
  const [SerialNumberProfileJson, setSerialNumberProfileJson] = useState<any>(null);
  const [InspectionTypeJson, setInspectionTypeJson] = useState<any>(null);
  const [LotSizeJson, setLotSizeJson] = useState<any>(null);
  const [MaterialCategoryJson, setMaterialCategoryJson] = useState<any>(null);
  const [SchedulingMarginKeyJson, setSchedulingMarginKeyJson] = useState<any>(null);
  const [ExpirationDateJson, setExpirationDateJson] = useState<any>(null);

  const name = searchParams?.name || "";
  const material_name = searchParams?.material_name || "";

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const responses: AxiosResponse<any>[] = await Promise.all([
        requestWrapper({
          url: `${API_END_POINTS.getMaterialOnboardingDetails}?name=${name}&material_name=${material_name}`,
          method: "GET",
        }),
        requestWrapper({ url: API_END_POINTS.MaterialCodeSearchApi, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.filterMaterialCode, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getAllMaterialTypeMasterDetails, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getCompanyMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getPlantMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getDivisionMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getIndustryMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getUOMMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getMRPTypeMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getValuationClassMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getProcurementTypeMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getValuationCategoryMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getMaterialGroupMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getProfitCenterMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getPriceControlMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getAvailabilityCheckMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getMaterialTypeMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getMRPControllerMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getStorageLocationMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getClassTypeMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getSerialNumberMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getInspectionTypeMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getlotSizeMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getMaterialCategoryMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getschedulingMarginKeyMaster, method: "GET" }),
        requestWrapper({ url: API_END_POINTS.getexpirationDateMaster, method: "GET" }),
      ]);

      const [
        onboardingRes,
        codeDetailsRes,
        codesRes,
        matTypeRes,
        companyRes,
        plantRes,
        divisionRes,
        industryRes,
        uomRes,
        mrpTypeRes,
        valClassRes,
        procureTypeRes,
        valCatRes,
        matGroupRes,
        profitCenterRes,
        priceControlRes,
        availCheckRes,
        matTypeJsonRes,
        mrpControllerRes,
        storageRes,
        classTypeRes,
        serialRes,
        inspectionRes,
        lotSizeRes,
        matCategoryRes,
        schedMarginRes,
        expiryRes,
      ] = responses;

      setMaterialOnboardingDetailsJson(onboardingRes?.data);
      setMaterialCodeDetailsJSON(codeDetailsRes?.data);
      setMaterialCodesJSON(codesRes?.data);
      setAllMaterialTypeJSON(matTypeRes?.data);
      setCompanyJson(companyRes?.data);
      setPlantJson(plantRes?.data);
      setDivisionJson(divisionRes?.data);
      setIndustryJson(industryRes?.data);
      setUOMJson(uomRes?.data);
      setMRPTypeJson(mrpTypeRes?.data);
      setValuationClassJson(valClassRes?.data);
      setProcurementTypeJson(procureTypeRes?.data);
      setValuationCategoryJson(valCatRes?.data);
      setMaterialGroupJson(matGroupRes?.data);
      setProfitCenterJson(profitCenterRes?.data);
      setPriceControlJson(priceControlRes?.data);
      setAvailabilityCheckJson(availCheckRes?.data);
      setMaterialTypeJson(matTypeJsonRes?.data);
      setMRPControllerJson(mrpControllerRes?.data);
      setStorageLocationJson(storageRes?.data);
      setClassTypeJson(classTypeRes?.data);
      setSerialNumberProfileJson(serialRes?.data);
      setInspectionTypeJson(inspectionRes?.data);
      setLotSizeJson(lotSizeRes?.data);
      setMaterialCategoryJson(matCategoryRes?.data);
      setSchedulingMarginKeyJson(schedMarginRes?.data);
      setExpirationDateJson(expiryRes?.data);
    } catch (error) {
      console.error("Error fetching onboarding data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [name, material_name]);

  if (loading) return <div className="p-4 text-gray-600">Loading...</div>;

  return (
    <MaterialOnboardingForm
      {...( {
        materialOnboardingDetailsJson,
        materialCodeDetailsJSON,
        materialCodesJSON,
        allMaterialTypeJSON,
        CompanyJson,
        PlantJson,
        DivisionJson,
        IndustryJson,
        UOMJson,
        MRPTypeJson,
        ValuationClassJson,
        ProcurementTypeJson,
        ValuationCategoryJson,
        MaterialGroupJson,
        ProfitCenterJson,
        PriceControlJson,
        AvailabilityCheckJson,
        MaterialTypeJson,
        MRPControllerJson,
        StorageLocationJson,
        ClassTypeJson,
        PurchaseGroupJson,
        SerialNumberProfileJson,
        InspectionTypeJson,
        LotSizeJson,
        MaterialCategoryJson,
        SchedulingMarginKeyJson,
        ExpirationDateJson
      } as any) }
    />
  );
};

export default MaterialOnboardingDetails;
