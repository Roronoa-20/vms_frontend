"use client";

import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import { useWatch } from "react-hook-form";
import UserRequestDetails from "@/src/components/molecules/material-onboarding-details/user-request-details";
import UserRequestDetails2 from "@/src/components/molecules/material-onboarding-details/user-request-details-2";
import Storefields from "./material-store-fields";
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import { MaterialCode } from "@/src/types/PurchaseRequestType";
import { MaterialRegistrationFormData, EmployeeDetail, Company, Plant, division, ClassType, UOMMaster, MaterialGroupMaster, MaterialCategory, ProfitCenter, AvailabilityCheck, StorageLocation, SerialNumber, MaterialType, MaterialRequestData } from "@/src/types/MaterialCodeRequestFormTypes";

interface MaterialInformationFormProps {
  form: any;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  companyName?: Company[];
  plantcode?: Plant[];
  EmployeeDetailsJSON?: EmployeeDetail;
  DivisionDetails?: division[];
  role?: string;
  UnitOfMeasure?: UOMMaster[];
  MaterialGroup?: MaterialGroupMaster[];
  MaterialOnboardingDetails?: MaterialRegistrationFormData;
  companyInfo?: Company[];
  ProfitCenter?: ProfitCenter[];
  AvailabilityCheck?: AvailabilityCheck[];
  MaterialType?: MaterialType[];
  StorageLocation?: StorageLocation[];
  ClassType?: ClassType[];
  SerialProfile?: SerialNumber[];
  materialCompanyCode?: string;
  setMaterialCompanyCode: React.Dispatch<React.SetStateAction<string>>;
  MaterialCategory?: MaterialCategory[];
  isMaterialCodeEdited?: boolean;
  setIsMaterialCodeEdited: React.Dispatch<React.SetStateAction<boolean>>;
  setShouldShowAllFields: React.Dispatch<React.SetStateAction<boolean>>;
  shouldShowAllFields: boolean;
  setIsMatchedMaterial: React.Dispatch<React.SetStateAction<boolean>>;
  isZCAPMaterial?: boolean;
  MaterialDetails?: MaterialRequestData;
}

const MaterialInformationForm: React.FC<MaterialInformationFormProps> = ({ form, companyName, plantcode, EmployeeDetailsJSON, DivisionDetails = [], role, UnitOfMeasure, MaterialGroup, MaterialOnboardingDetails, companyInfo, AvailabilityCheck, MaterialType, StorageLocation = [], ClassType, SerialProfile, materialCompanyCode, setMaterialCompanyCode, MaterialCategory, setIsMaterialCodeEdited, setShouldShowAllFields, shouldShowAllFields, setIsMatchedMaterial, isZCAPMaterial, MaterialDetails }) => {

  const [selectedMaterialType, setSelectedMaterialType] = useState<string>("");
  const [filteredMaterialGroup, setFilteredMaterialGroup] = useState<MaterialGroupMaster[]>([]);
  const [filteredStorage, setFilteredStorage] = useState<StorageLocation[]>([]);
  const [filteredDivision, setFilteredDivision] = useState<division[]>([]);
  const [searchResults, setSearchResults] = useState<MaterialCode[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [materialSelectedFromList, setMaterialSelectedFromList] = useState<boolean>(false);
  const [materialCodeAutoFetched, setMaterialCodeAutoFetched] = useState(false);
  const [AllMaterialCodes, setAllMaterialCodes] = useState<MaterialCode[]>([]);
  const [materialCodeStatus, setMaterialCodeStatus] = useState<"idle" | "checking" | "exists" | "available">("idle");
  const [selectedCodeLogic, setSelectedCodeLogic] = useState<string>("");
  const [latestCodeSuggestions, setLatestCodeSuggestions] = useState<MaterialCode[]>([]);

  const company = useWatch({ control: form.control, name: "material_company_code" });
  const materialType = useWatch({ control: form.control, name: "material_type" });

  console.log("shouldShowAllFields ==========================>", shouldShowAllFields);

  const fetchMaterialCodeData = useCallback(
    async (query?: string): Promise<MaterialCode[]> => {
      try {
        let url = API_END_POINTS?.MaterialCodeSearchApi;
        const filters: Record<string, string> = {};
        if (company) filters.company = company;
        if (materialType) filters.material_type = materialType;

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
    },
    [company, materialType]
  );

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
    const category = form.getValues("material_type_category");
    if (!category || !MaterialType?.length) return;

    const materialType = form.getValues("material_type");
    if (!materialType) return;

    const matchedType = MaterialType.find(t => t.name === materialType);
    if (!matchedType?.material_code_logic?.length) return;

    const matchedLogic = matchedType.material_code_logic.find(
      (m) => m.material_type_category === category
    );

    if (matchedLogic?.code_logic) {
      setSelectedCodeLogic(matchedLogic.code_logic);
    }
  }, [
    form.watch("material_type_category"),
    form.watch("material_type"),
    MaterialType
  ]);


  const fetchLatestCode = async () => {
    if (!selectedCodeLogic) return;

    const company = form.getValues("material_company_code");

    const res = await requestWrapper({
      method: "GET",
      url: `${API_END_POINTS.getLatestMaterialCode}?prefix=${selectedCodeLogic}&company=${company}`,
    });
    if (res?.data?.message) {
      setLatestCodeSuggestions([res.data.message]);
    }
  };

  useEffect(() => {
    fetchLatestCode();
  }, [selectedCodeLogic]);

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
    if (company || materialType) {
      fetchMaterialCodeData();
    }
  }, [company, materialType]);

  useEffect(() => {
    const employeeCompanyCode = (EmployeeDetailsJSON?.company && Array.isArray(EmployeeDetailsJSON.company) && EmployeeDetailsJSON.company[0]?.company_code) || "";
    const newFilteredMaterialGroup = MaterialGroup?.filter((group) => String(group.material_group_company) === employeeCompanyCode) || [];
    const newFilteredStorage = StorageLocation?.filter((loc) => String(loc.company) === employeeCompanyCode) || [];
    const newFilteredDivision = DivisionDetails?.filter((div) => String(div.company) === employeeCompanyCode) || [];

    setFilteredMaterialGroup(prev => {
      if (JSON.stringify(prev) !== JSON.stringify(newFilteredMaterialGroup)) return newFilteredMaterialGroup;
      return prev;
    });

    setFilteredStorage(prev => {
      if (JSON.stringify(prev) !== JSON.stringify(newFilteredStorage)) return newFilteredStorage;
      return prev;
    });

    setFilteredDivision(prev => {
      if (JSON.stringify(prev) !== JSON.stringify(newFilteredDivision)) return newFilteredDivision;
      return prev;
    });

  }, [EmployeeDetailsJSON, MaterialGroup, StorageLocation, DivisionDetails]);


  const handleMaterialSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    form.setValue("material_name_description", val);

    if (val.trim().length > 2) {
      const filtered = AllMaterialCodes?.filter((item) =>
        item.material_description?.toLowerCase().includes(val.toLowerCase())
      ) || [];

      console.log("Filtered Results:", filtered);
      setSearchResults(filtered);
      setShowSuggestions(true);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
    setMaterialSelectedFromList(false);
    setMaterialCodeAutoFetched(false);
  };

  const handleMaterialSelect = (item: MaterialCode) => {
    form.setValue("material_name_description", item.material_name_description || "");

    if (item.material_code_revised && item.material_code_revised !== "null") {
      form.setValue("material_code_revised", item.material_code_revised);
    } else {
      form.setValue("material_code_revised", "");
    }
    form.setValue("material_type", item.material_type);
    setMaterialSelectedFromList(true);
    setShowSuggestions(false);
    setMaterialCodeAutoFetched(true);
  };

  useEffect(() => {
    const data = MaterialDetails?.material_master;
    if (!data || !filteredMaterialGroup.length) return;

    const fields = ["material_group", "batch_requirements_yn", "brand_make", "availability_check", "class_type", "class_number", "serial_number_profile", "serialization_level"
    ] as const;

    fields.forEach((field) => {
      if (data[field]) {
        form.setValue(field, data[field]);
      }
    });
  }, [MaterialDetails, filteredMaterialGroup]);

  useEffect(() => {
    // console.log("MaterialInformationForm: role =", role, "showAll =", shouldShowAllFields);
  }, [role, shouldShowAllFields]);


  return (
    <div className="bg-[#F4F4F6] overflow-hidden">
      <div className="flex flex-col justify-between bg-white rounded-[8px]">
        <div>
          <UserRequestDetails
            companyName={companyName}
            form={form}
            MaterialDetails={MaterialDetails}
            MaterialOnboardingDetails={MaterialOnboardingDetails}
            materialCompanyCode={materialCompanyCode}
            setMaterialCompanyCode={setMaterialCompanyCode}
            setSelectedMaterialType={setSelectedMaterialType}
            UnitOfMeasure={UnitOfMeasure}
            plantcode={plantcode}
            filteredStorage={filteredStorage}
            MaterialCategory={MaterialCategory}
            filteredDivision={filteredDivision}
            StorageLocation={StorageLocation}
            AllMaterialType={MaterialType}
            AllMaterialCodes={AllMaterialCodes}
          />

          <UserRequestDetails2
            // companyName={companyName}
            form={form}
            MaterialDetails={MaterialDetails}
            MaterialOnboardingDetails={MaterialOnboardingDetails}
            materialCompanyCode={materialCompanyCode}
            setMaterialCompanyCode={setMaterialCompanyCode}
            setSelectedMaterialType={setSelectedMaterialType}
            selectedMaterialType={selectedMaterialType}
            UnitOfMeasure={UnitOfMeasure}
            // MaterialType={MaterialType}
            plantcode={plantcode}
            DivisionDetails={DivisionDetails}
            filteredStorage={filteredStorage}
            searchResults={searchResults}
            showSuggestions={showSuggestions}
            materialSelectedFromList={materialSelectedFromList}
            setMaterialSelectedFromList={setMaterialSelectedFromList}
            handleMaterialSearch={handleMaterialSearch}
            handleMaterialSelect={handleMaterialSelect}
            setSearchResults={setSearchResults}
            setShowSuggestions={setShowSuggestions}
            // MaterialCode={MaterialCode}
            MaterialCategory={MaterialCategory}
            filteredDivision={filteredDivision}
            StorageLocation={StorageLocation}
            AllMaterialType={MaterialType}
            // isMaterialCodeEdited={isMaterialCodeEdited}
            setIsMaterialCodeEdited={setIsMaterialCodeEdited}
            materialCodeAutoFetched={materialCodeAutoFetched}
            setMaterialCodeAutoFetched={setMaterialCodeAutoFetched}
            AllMaterialCodes={AllMaterialCodes}
            setShouldShowAllFields={setShouldShowAllFields}
            shouldShowAllFields={shouldShowAllFields}
            setIsMatchedMaterial={setIsMatchedMaterial}
            isZCAPMaterial={isZCAPMaterial}
            materialCodeStatus={materialCodeStatus}
            selectedCodeLogic={selectedCodeLogic}
            setSelectedCodeLogic={setSelectedCodeLogic}
            latestCodeSuggestions={latestCodeSuggestions}
          />

          {shouldShowAllFields && (role === "Material CP" || role === "Store") && (
            <Storefields
              companyInfo={companyInfo}
              role={role}
              form={form}
              MaterialDetails={MaterialDetails}
              MaterialOnboardingDetails={MaterialOnboardingDetails}
              materialCompanyCode={materialCompanyCode}
              setMaterialCompanyCode={setMaterialCompanyCode}
              UnitOfMeasure={UnitOfMeasure}
              MaterialType={MaterialType}
              plantcode={plantcode}
              AllMaterialType={MaterialType}
              AvailabilityCheck={AvailabilityCheck}
              MaterialGroup={MaterialGroup}
              SerialProfile={SerialProfile}
              ClassType={ClassType}
              isZCAPMaterial={isZCAPMaterial}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialInformationForm;