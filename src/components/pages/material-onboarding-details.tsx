// "use client";

// import React, { useEffect, useState } from "react";
// import MaterialOnboardingForm from "@/src/components/molecules/material-onboarding-details/material-onboarding-form";
// import API_END_POINTS from "@/src/services/apiEndPoints";
// import requestWrapper from "@/src/services/apiCall";
// import { AxiosResponse } from "axios";
// import { useSearchParams } from "next/navigation";
// import { MaterialRegistrationFormData, EmployeeDetail, EmployeeAPIResponse, Company, Plant, division, industry, ClassType, UOMMaster, MRPType, ValuationClass, procurementType, ValuationCategory, MaterialGroupMaster, MaterialCategory, ProfitCenter, AvailabilityCheck, PriceControl, MRPController, StorageLocation, InspectionType, SerialNumber, LotSize, SchedulingMarginKey, ExpirationDate, MaterialType } from "@/src/types/MaterialCodeRequestFormTypes";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import VendorRegistrationSchemas from "@/src/schemas/vendorRegistrationSchema";
// import { useAuth } from "@/src/context/AuthContext";


// export default function MaterialOnboardingDetails() {
//   const form = useForm<any>({ resolver: zodResolver(VendorRegistrationSchemas) });
//   const [loading, setLoading] = useState(true);
//   const [MaterialOnboardingDetails, setMaterialOnboardingDetails] = useState<MaterialRegistrationFormData[]>([]);
//   const [materialCodeDetailsJSON, setMaterialCodeDetailsJSON] = useState<any>(null);
//   const [materialCodesJSON, setMaterialCodesJSON] = useState<any>(null);
//   const [allMaterialTypeJSON, setAllMaterialTypeJSON] = useState<any>(null);
//   const [CompanyJson, setCompanyJson] = useState<Company[]>([]);
//   const [PlantJson, setPlantJson] = useState<Plant[]>([]);
//   const [DivisionJson, setDivisionJson] = useState<division[]>([]);
//   const [IndustryJson, setIndustryJson] = useState<industry[]>([]);
//   const [UOMJson, setUOMJson] = useState<UOMMaster[]>([]);
//   const [MRPTypeJson, setMRPTypeJson] = useState<MRPType[]>([]);
//   const [ValuationClassJson, setValuationClassJson] = useState<ValuationClass[]>([]);
//   const [ProcurementTypeJson, setProcurementTypeJson] = useState<procurementType[]>([]);
//   const [ValuationCategoryJson, setValuationCategoryJson] = useState<ValuationCategory[]>([]);
//   const [MaterialGroupJson, setMaterialGroupJson] = useState<MaterialGroupMaster[]>([]);
//   const [ProfitCenterJson, setProfitCenterJson] = useState<ProfitCenter[]>([]);
//   const [PriceControlJson, setPriceControlJson] = useState<PriceControl[]>([]);
//   const [AvailabilityCheckJson, setAvailabilityCheckJson] = useState<AvailabilityCheck[]>([]);
//   const [MaterialTypeJson, setMaterialTypeJson] = useState<MaterialType[]>([]);
//   const [MRPControllerJson, setMRPControllerJson] = useState<MRPController[]>([]);
//   const [StorageLocationJson, setStorageLocationJson] = useState<StorageLocation[]>([]);
//   const [ClassTypeJson, setClassTypeJson] = useState<ClassType[]>([]);
//   const [PurchaseGroupJson, setPurchaseGroupJson] = useState<any>([]);
//   const [SerialNumberProfileJson, setSerialNumberProfileJson] = useState<SerialNumber[]>([]);
//   const [InspectionTypeJson, setInspectionTypeJson] = useState<InspectionType[]>([]);
//   const [LotSizeJson, setLotSizeJson] = useState<LotSize[]>([]);
//   const [MaterialCategoryJson, setMaterialCategoryJson] = useState<MaterialCategory[]>([]);
//   const [SchedulingMarginKeyJson, setSchedulingMarginKeyJson] = useState<SchedulingMarginKey[]>([]);
//   const [ExpirationDateJson, setExpirationDateJson] = useState<ExpirationDate[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [EmployeeDetailsJSON, setEmployeeDetailsJSON] = useState<EmployeeDetail | null>(null);
//   const searchParams = useSearchParams();
//   const name = searchParams.get("name");
//   const material_name = searchParams.get("material_name");
//   const { user_email } = useAuth();

//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       if (!user_email) return;
//       try {
//         const employeeRes: AxiosResponse<EmployeeAPIResponse> =
//           await requestWrapper({
//             url: `${API_END_POINTS.getEmployeeDetails}?user=${user_email}`,
//             method: "GET",
//           });
//         if (employeeRes?.status === 200) {
//           const employeeData = employeeRes?.data?.message?.data;
//           if (!employeeData) return console.warn("No employee details found");
//           setEmployeeDetailsJSON(employeeData);
//         }
//       } catch (err) {
//         console.error("Error fetching employee details:", err);
//       }
//     };

//     fetchEmployeeData();
//   }, [user_email]);

//   useEffect(() => {
//     const fetchExistingFormData = async () => {
//       if (!name || !material_name) return;

//       try {
//         setIsLoading(true);
//         const res: AxiosResponse = await requestWrapper({
//           url: `${API_END_POINTS.getMaterialOnboardingTableList}`,
//           method: "GET",
//           params: {
//             filters: JSON.stringify({
//               name: name,
//               material_name_description: material_name,
//             }),
//           },
//         });
//         const data = res?.data?.message?.data?.[0];
//         // console.log("Existing form data fetched:", data);
//         if (!data) {
//           console.warn("No form found for the provided params");
//           return;
//         }
//         setMaterialOnboardingDetails(data);

//       } catch (err) {
//         console.error("Error fetching existing form:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchExistingFormData();
//   }, [name, material_name]);

//   const fetchAllData = async () => {
//     setLoading(true);
//     try {
//       const responses: AxiosResponse<any>[] = await Promise.all([
//         requestWrapper({ url: API_END_POINTS.getCompanyMaster, method: "GET" }),
//         requestWrapper({ url: API_END_POINTS.getPlantMaster, method: "GET" }),
//         requestWrapper({ url: API_END_POINTS.getDivisionMaster, method: "GET" }),
//         requestWrapper({ url: API_END_POINTS.getIndustryMaster, method: "GET" }),
//         requestWrapper({ url: API_END_POINTS.getUOMMaster, method: "GET" }),
//         requestWrapper({ url: API_END_POINTS.getMRPTypeMaster, method: "GET" }),
//         requestWrapper({ url: API_END_POINTS.getProcurementTypeMaster, method: "GET" }),
//         requestWrapper({ url: API_END_POINTS.getValuationCategoryMaster, method: "GET" }),
//         requestWrapper({ url: API_END_POINTS.getProfitCenterMaster, method: "GET" }),
//         requestWrapper({ url: API_END_POINTS.getPriceControlMaster, method: "GET" }),
//         requestWrapper({ url: API_END_POINTS.getAvailabilityCheckMaster, method: "GET" }),
//         requestWrapper({ url: API_END_POINTS.getMRPControllerMaster, method: "GET" }),
//         requestWrapper({ url: API_END_POINTS.getStorageLocationMaster, method: "GET" }),
//         requestWrapper({ url: API_END_POINTS.getClassTypeMaster, method: "GET" }),
//         requestWrapper({ url: API_END_POINTS.getSerialNumberMaster, method: "GET" }),
//         requestWrapper({ url: API_END_POINTS.getInspectionTypeMaster, method: "GET" }),
//         requestWrapper({ url: API_END_POINTS.getlotSizeMaster, method: "GET" }),
//         requestWrapper({ url: API_END_POINTS.getMaterialCategoryMaster, method: "GET" }),
//         requestWrapper({ url: API_END_POINTS.getschedulingMarginKeyMaster, method: "GET" }),
//         requestWrapper({ url: API_END_POINTS.getexpirationDateMaster, method: "GET" }),
//       ]);

//       console.log("All responses received:", responses);

//       const [
//         companyRes,
//         plantRes,
//         divisionRes,
//         industryRes,
//         uomRes,
//         mrpTypeRes,
//         procureTypeRes,
//         valCatRes,
//         profitCenterRes,
//         priceControlRes,
//         availCheckRes,
//         mrpControllerRes,
//         storageRes,
//         classTypeRes,
//         serialRes,
//         inspectionRes,
//         lotSizeRes,
//         matCategoryRes,
//         schedMarginRes,
//         expiryRes,
//       ] = responses;

//       setCompanyJson(companyRes?.data);
//       setPlantJson(plantRes?.data?.message?.data);
//       setDivisionJson(divisionRes?.data?.message?.data);
//       setIndustryJson(industryRes?.data?.message?.data);
//       setUOMJson(uomRes?.data?.message?.data);
//       setMRPTypeJson(mrpTypeRes?.data?.message?.data);
//       setProcurementTypeJson(procureTypeRes?.data?.message?.data);
//       setValuationCategoryJson(valCatRes?.data?.message?.data);
//       setProfitCenterJson(profitCenterRes?.data?.data);
//       setPriceControlJson(priceControlRes?.data?.message?.data);
//       setAvailabilityCheckJson(availCheckRes?.data?.message?.data);
//       setMRPControllerJson(mrpControllerRes?.data?.message?.data);
//       setStorageLocationJson(storageRes?.data?.message?.data);
//       setClassTypeJson(classTypeRes?.data?.message?.data);
//       setSerialNumberProfileJson(serialRes?.data?.message?.data);
//       setInspectionTypeJson(inspectionRes?.data?.message?.data);
//       setLotSizeJson(lotSizeRes?.data?.message?.data);
//       setMaterialCategoryJson(matCategoryRes?.data?.message?.data);
//       setSchedulingMarginKeyJson(schedMarginRes?.data?.message?.data);
//       setExpirationDateJson(expiryRes?.data?.message?.data);
//     } catch (error) {
//       console.error("Error fetching onboarding data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   console.log("Profit Center JSON:", ProfitCenterJson)
//   useEffect(() => {
//     fetchAllData();
//   }, [name, material_name]);

//   if (loading) return <div className="p-4 text-gray-600">Loading...</div>;

//   return (
//     <MaterialOnboardingForm
//       {...({
//         form,
//         EmployeeDetailsJSON,
//         CompanyJson,
//         PlantJson,
//         DivisionJson,
//         IndustryJson,
//         UOMJson,
//         MRPTypeJson,
//         ValuationClassJson,
//         ProcurementTypeJson,
//         ValuationCategoryJson,
//         MaterialGroupJson,
//         ProfitCenterJson,
//         PriceControlJson,
//         AvailabilityCheckJson,
//         MaterialTypeJson,
//         MRPControllerJson,
//         StorageLocationJson,
//         ClassTypeJson,
//         PurchaseGroupJson,
//         SerialNumberProfileJson,
//         InspectionTypeJson,
//         LotSizeJson,
//         MaterialCategoryJson,
//         SchedulingMarginKeyJson,
//         ExpirationDateJson,
//         MaterialOnboardingDetails
//       } as any)}
//     />
//   );
// };
