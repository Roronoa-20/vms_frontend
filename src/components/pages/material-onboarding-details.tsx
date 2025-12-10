"use client";

import React, { useEffect, useState } from "react";
import MaterialOnboardingForm from "@/src/components/molecules/material-onboarding-details/material-onboarding-form";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import VendorRegistrationSchemas from "@/src/schemas/vendorRegistrationSchema";
import { useAuth } from "@/src/context/AuthContext";
import { TcompanyNameBasedDropdown } from "@/src/types/types";
import type { MaterialRegistrationFormData, MaterialRequestData, EmployeeDetail, EmployeeAPIResponse, Company, Plant, division, industry, ClassType, UOMMaster, MRPType, ValuationClass, procurementType, ValuationCategory, MaterialGroupMaster, ProfitCenter, AvailabilityCheck, PriceControl, MRPController, StorageLocation, InspectionType, SerialNumber, LotSize, SchedulingMarginKey, ExpirationDate, MaterialType, } from "@/src/types/MaterialCodeRequestFormTypes";



export default function MaterialOnboardingDetails() {
  const form = useForm<any>({ resolver: zodResolver(VendorRegistrationSchemas) });
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const material_name = searchParams.get("material_name");
  const { user_email } = useAuth();

  const [loading, setLoading] = useState(true);
  const [MaterialOnboardingDetails, setMaterialOnboardingDetails] = useState<MaterialRegistrationFormData | null>(null);
  const [MaterialDetails, setMaterialDetails] = useState<MaterialRequestData[]>([]);
  const [CompanyJson, setCompanyJson] = useState<Company[]>([]);
  const [PlantJson, setPlantJson] = useState<Plant[]>([]);
  const [DivisionJson, setDivisionJson] = useState<division[]>([]);
  const [IndustryJson, setIndustryJson] = useState<industry[]>([]);
  const [UOMJson, setUOMJson] = useState<UOMMaster[]>([]);
  const [MRPTypeJson, setMRPTypeJson] = useState<MRPType[]>([]);
  const [ValuationClassJson, setValuationClassJson] = useState<ValuationClass[]>([]);
  const [ProcurementTypeJson, setProcurementTypeJson] = useState<procurementType[]>([]);
  const [ValuationCategoryJson, setValuationCategoryJson] = useState<ValuationCategory[]>([]);
  const [MaterialGroupJson, setMaterialGroupJson] = useState<MaterialGroupMaster[]>([]);
  const [ProfitCenterJson, setProfitCenterJson] = useState<ProfitCenter[]>([]);
  const [PriceControlJson, setPriceControlJson] = useState<PriceControl[]>([]);
  const [AvailabilityCheckJson, setAvailabilityCheckJson] = useState<AvailabilityCheck[]>([]);
  const [MaterialTypeJson, setMaterialTypeJson] = useState<MaterialType[]>([]);
  const [MRPControllerJson, setMRPControllerJson] = useState<MRPController[]>([]);
  const [StorageLocationJson, setStorageLocationJson] = useState<StorageLocation[]>([]);
  const [ClassTypeJson, setClassTypeJson] = useState<ClassType[]>([]);
  const [SerialNumberProfileJson, setSerialNumberProfileJson] = useState<SerialNumber[]>([]);
  const [InspectionTypeJson, setInspectionTypeJson] = useState<InspectionType[]>([]);
  const [LotSizeJson, setLotSizeJson] = useState<LotSize[]>([]);
  const [MaterialCategoryJson, setMaterialCategoryJson] = useState<any[]>([]);
  const [SchedulingMarginKeyJson, setSchedulingMarginKeyJson] = useState<SchedulingMarginKey[]>([]);
  const [ExpirationDateJson, setExpirationDateJson] = useState<ExpirationDate[]>([]);
  const [PurchaseGroupJson, setPurchaseGroupJson] = useState<TcompanyNameBasedDropdown["message"]["data"]["purchase_groups"]>();
  const [EmployeeDetailsJSON, setEmployeeDetailsJSON] = useState<EmployeeDetail | null>(null);

  useEffect(() => {
    if (!user_email) return;

    (async () => {
      try {
        const res: AxiosResponse<EmployeeAPIResponse> = await requestWrapper({
          url: `${API_END_POINTS.getEmployeeDetails}?user=${user_email}`,
          method: "GET",
        });
        console.log("Employee Details ------>",res)
        setEmployeeDetailsJSON(res?.data?.message?.data || null);
      } catch (err) {
        console.error("Error fetching employee details:", err);
      }
    })();
  }, [user_email]);

  useEffect(() => {
    const fetchMasterData = async () => {
      setLoading(true);
      try {
        const [companyRes, plantRes, divisionRes, industryRes, uomRes, mrpTypeRes, procurementRes, valCatRes, profitCenterRes, priceControlRes, availCheckRes, mrpControllerRes, storageRes, classTypeRes, serialRes, inspectionRes, lotSizeRes, matCategoryRes, schedRes, expiryRes] = await Promise.all([
          requestWrapper({ url: API_END_POINTS.getCompanyMaster, method: "GET" }),
          requestWrapper({ url: API_END_POINTS.getPlantMaster, method: "GET" }),
          requestWrapper({ url: API_END_POINTS.getDivisionMaster, method: "GET" }),
          requestWrapper({ url: API_END_POINTS.getIndustryMaster, method: "GET" }),
          requestWrapper({ url: API_END_POINTS.getUOMMaster, method: "GET" }),
          requestWrapper({ url: API_END_POINTS.getMRPTypeMaster, method: "GET" }),
          requestWrapper({ url: API_END_POINTS.getProcurementTypeMaster, method: "GET" }),
          requestWrapper({ url: API_END_POINTS.getValuationCategoryMaster, method: "GET" }),
          requestWrapper({ url: API_END_POINTS.getProfitCenterMaster, method: "GET" }),
          requestWrapper({ url: API_END_POINTS.getPriceControlMaster, method: "GET" }),
          requestWrapper({ url: API_END_POINTS.getAvailabilityCheckMaster, method: "GET" }),
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

        // console.log("Master Data Responses:");
        // console.log("Company Master:", companyRes);
        // console.log("Plant Master:", plantRes);
        // console.log("Division Master:", divisionRes);
        // console.log("Industry Master:", industryRes);
        // console.log("UOM Master:", uomRes);
        // console.log("MRP Type Master:", mrpTypeRes);
        // console.log("Procurement Type Master:", procurementRes);
        // console.log("Valuation Category Master:", valCatRes);
        // console.log("Profit Center Master:", profitCenterRes);
        // console.log("Price Control Master:", priceControlRes);
        // console.log("Availability Check Master:", availCheckRes);
        // console.log("MRP Controller Master:", mrpControllerRes);
        // console.log("Storage Location Master:", storageRes);
        // console.log("Class Type Master:", classTypeRes);
        // console.log("Serial Number Master:", serialRes);
        // console.log("Inspection Type Master:", inspectionRes);
        // console.log("Lot Size Master:", lotSizeRes);
        // console.log("Material Category Master:", matCategoryRes);
        // console.log("Scheduling Margin Key Master:", schedRes);
        // console.log("Expiration Date Master:", expiryRes);

        setCompanyJson(companyRes?.data?.data);
        setPlantJson(plantRes?.data?.message?.data);
        setDivisionJson(divisionRes?.data?.data);
        setIndustryJson(industryRes?.data?.data);
        setUOMJson(uomRes?.data?.data);
        setMRPTypeJson(mrpTypeRes?.data?.data);
        setProcurementTypeJson(procurementRes?.data?.data);
        setValuationCategoryJson(valCatRes?.data?.data);
        setProfitCenterJson(profitCenterRes?.data?.data);
        setPriceControlJson(priceControlRes?.data?.data);
        setAvailabilityCheckJson(availCheckRes?.data?.data);
        setMRPControllerJson(mrpControllerRes?.data?.data);
        setStorageLocationJson(storageRes?.data?.data);
        setClassTypeJson(classTypeRes?.data?.data);
        setSerialNumberProfileJson(serialRes?.data?.data);
        setInspectionTypeJson(inspectionRes?.data?.data);
        setLotSizeJson(lotSizeRes?.data?.data);
        setMaterialCategoryJson(matCategoryRes?.data?.data);
        setSchedulingMarginKeyJson(schedRes?.data?.data);
        setExpirationDateJson(expiryRes?.data?.data);

      } catch (err) {
        console.error("Error fetching master data:", err);
      }
    };

    fetchMasterData();
  }, []);

  useEffect(() => {
    if (!name || !material_name) return;

    const fetchMaterialData = async () => {
      setLoading(true);
      try {
        const [tableRes, detailsRes] = await Promise.all([
          requestWrapper({
            url: API_END_POINTS.getMaterialOnboardingTableList,
            method: "GET",
            params: { filters: JSON.stringify({ name, material_name_description: material_name }) },
          }),
          requestWrapper({
            url: API_END_POINTS.getMaterialOnboardingDetails,
            method: "GET",
            params: { name, material_name },
          }),
        ]);
        console.log("Table REsponse Materi O--->",tableRes)
        console.log("Table REsponse Materi D--->",detailsRes)
        const tableData = tableRes?.data?.message?.data?.[0];
        const detailsData = detailsRes?.data?.message?.data;

        if (tableData) setMaterialOnboardingDetails(tableData);
        if (detailsData) setMaterialDetails(detailsData);

      } catch (err) {
        console.error("Error fetching material onboarding data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterialData();
  }, [name, material_name]);

  useEffect(() => {
    if (!MaterialOnboardingDetails?.material_company_code || !MaterialOnboardingDetails?.material_category) return;

    const fetchMaterialType = async () => {
      try {
        const res: AxiosResponse = await requestWrapper({
          url: API_END_POINTS.getMaterialTypeMaster,
          method: "GET",
          params: {
            company: MaterialOnboardingDetails.material_company_code,
            material_category_type: MaterialOnboardingDetails.material_category,
          },
        });
        setMaterialTypeJson(res?.data?.message?.data || []);
      } catch (err) {
        console.error("Error fetching MaterialType:", err);
      }
    };

    fetchMaterialType();
  }, [MaterialOnboardingDetails]);

  const fetchMaterialGroup = async (company_code: string) => {
    if (!company_code) return;

    try {
      const response: AxiosResponse<any> = await requestWrapper({
        url: API_END_POINTS.getMaterialGroupMaster,
        method: "GET",
        params: { company_name: company_code }
      })
      const data = response?.data?.message?.data;
      if (data?.length) {
        setMaterialGroupJson(data);
      } else {
        setMaterialGroupJson([]);
      }

      // console.log("Material Fetch Groups:", data);
    } catch (err) {
      console.error("Error fetching Purchase Group:", err);
      setMaterialGroupJson([]);
    }
  }

  const fetchPurchaseGroups = async (company_code: string) => {
    if (!company_code) return;

    try {
      const response: AxiosResponse<any> = await requestWrapper({
        url: API_END_POINTS.companyBasedDropdown,
        method: "GET",
        params: { company_name: company_code },
      });

      const data = response?.data?.message?.data;
      if (data?.purchase_groups?.length) {
        setPurchaseGroupJson(data.purchase_groups);
      } else {
        setPurchaseGroupJson([]);
      }

      // console.log("Purchase Groups:", data?.purchase_groups);
    } catch (err) {
      console.error("Error fetching Purchase Group:", err);
      setPurchaseGroupJson([]);
    }
  };

  useEffect(() => {
    if (MaterialOnboardingDetails?.material_company_code) {
      fetchPurchaseGroups(MaterialOnboardingDetails.material_company_code);
      fetchMaterialGroup(MaterialOnboardingDetails.material_company_code);
    }
  }, [MaterialOnboardingDetails?.material_company_code]);


  const [showcompletealert, setshowcompletealert] = useState(false);

  const sendEmailToUser = async (name: string) => {
    try {
      const response: AxiosResponse<any> = await requestWrapper({
        url: API_END_POINTS.sendemailtouseexistingcode,
        method: "POST",
        params: { doc_name: name },
      });

      const result = response?.data;
      console.log("Email API response:", result);
      if (response?.status === 200)
        setshowcompletealert(true);
    } catch (error) {
      console.error("Error sending email to user:", error);
    }
  };

  const [showRevertAlert, setShowRevertAlert] = useState(false);
  const sendRevertEmail = async (name: string, remark: string) => {
    try {
      const response: AxiosResponse<any> = await requestWrapper({
        url: API_END_POINTS.sendrevertemailtouser,
        method: "POST",
        params: { doc_name: name,
          remark: remark,
         },
      });

      const result = response?.data;
      console.log("Email API response:", result);
      if (response?.status === 200)
        setShowRevertAlert(true);
    } catch (error) {
      console.error("Error sending email to user:", error);
    }
  };

  //   if (loading) return <div className="p-4 text-gray-600">Loading...</div>;

  return (
    <MaterialOnboardingForm
      {...({
        form,
        EmployeeDetailsJSON,
        companyName: CompanyJson,
        plantcode: PlantJson,
        DivisionDetails: DivisionJson,
        IndustryDetails: IndustryJson,
        UnitOfMeasure: UOMJson,
        MRPType: MRPTypeJson,
        ValuationClass: ValuationClassJson,
        ProcurementType: ProcurementTypeJson,
        ValuationCategory: ValuationCategoryJson,
        MaterialGroup: MaterialGroupJson,
        ProfitCenter: ProfitCenterJson,
        PriceControl: PriceControlJson,
        AvailabilityCheck: AvailabilityCheckJson,
        MaterialType: MaterialTypeJson,
        MRPController: MRPControllerJson,
        StorageLocation: StorageLocationJson,
        ClassType: ClassTypeJson,
        PurchaseGroup: PurchaseGroupJson,
        SerialProfile: SerialNumberProfileJson,
        InspectionType: InspectionTypeJson,
        LotSize: LotSizeJson,
        MaterialCategory: MaterialCategoryJson,
        SMK: SchedulingMarginKeyJson,
        ExpirationDate: ExpirationDateJson,
        MaterialOnboardingDetails,
        MaterialDetails,
        showcompletealert,
        onCloseCallback: sendEmailToUser,
        showRevertAlert,
        sendRevertEmail
      } as any)}
    />
  );
}
