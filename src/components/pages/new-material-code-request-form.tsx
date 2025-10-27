"use client";

import { useEffect, useState, MouseEvent, FormEvent } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import MaterialOnboardingForm from "@/src/components/molecules/material-onboarding/material-onboarding-form";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import VendorRegistrationSchemas from "@/src/schemas/vendorRegistrationSchema";
import {
  EmployeeDetail,
  EmployeeAPIResponse,
} from "@/src/types/MaterialCodeRequestFormTypes";

interface MastersData {
  companyMaster: any[];
  plantMaster: any[];
  divisionMaster: any[];
  industryMaster: any[];
  uomMaster: any[];
  mrpTypeMaster: any[];
  valuationClassMaster: any[];
  procurementTypeMaster: any[];
  valuationCategoryMaster: any[];
  materialGroupMaster: any[];
  profitCenterMaster: any[];
  priceControlMaster: any[];
  availabilityCheckMaster: any[];
  materialTypeMaster: any[];
  mrpControllerMaster: any[];
  storageLocationMaster: any[];
  classTypeMaster: any[];
  serialNumberMaster: any[];
  inspectionTypeMaster: any[];
  materialCategoryMaster: any[];
}

export default function MaterialRegistration() {
  const form = useForm<any>({
    resolver: zodResolver(VendorRegistrationSchemas),
  });

  const [UserDetailsJSON, setUserDetailsJSON] = useState<any>(null);
  const [EmployeeDetailsJSON, setEmployeeDetailsJSON] =
    useState<EmployeeDetail | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [AllMaterialCodes, setAllMaterialCodes] = useState<any>(null);
  const [materialRequestList, setMaterialRequestList] = useState<any[]>([]);
  const [materialCompanyCode, setMaterialCompanyCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const router = useRouter();
  const token = Cookies.get("token");

  const sanitizeValue = (value: any): string =>
    value === undefined || value === "undefined" ? "" : value;

  // 🧩 FETCH EMPLOYEE DETAILS
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const userId = Cookies.get("user_id");
        if (!userId) return console.error("No user_id found in cookies");

        const employeeRes: AxiosResponse<EmployeeAPIResponse> =
          await requestWrapper({
            url: `${API_END_POINTS.getEmployeeDetails}?user=${userId}`,
            method: "GET",
          });

        if (employeeRes?.status === 200) {
          const employeeData = employeeRes?.data?.message?.data;
          if (!employeeData) return console.warn("No employee details found");

          setEmployeeDetailsJSON(employeeData);
          setUserDetailsJSON({
            user_id: employeeData.user_id,
            full_name: employeeData.full_name,
            email: employeeData.company_email,
          });
        }
      } catch (err) {
        console.error("Error fetching employee details:", err);
      }
    };

    fetchEmployeeData();
  }, []);

  // 🧩 FETCH ALL MASTERS
  useEffect(() => {
    const fetchAllMasters = async () => {
      try {
        const apiList = {
          companyMaster: API_END_POINTS.getCompanyMaster,
          plantMaster: API_END_POINTS.getPlantMaster,
          divisionMaster: API_END_POINTS.getDivisionMaster,
          industryMaster: API_END_POINTS.getIndustryMaster,
          uomMaster: API_END_POINTS.getUOMMaster,
          mrpTypeMaster: API_END_POINTS.getMRPTypeMaster,
          valuationClassMaster: API_END_POINTS.getValuationClassMaster,
          procurementTypeMaster: API_END_POINTS.getProcurementTypeMaster,
          valuationCategoryMaster: API_END_POINTS.getValuationCategoryMaster,
          materialGroupMaster: API_END_POINTS.getMaterialGroupMaster,
          profitCenterMaster: API_END_POINTS.getProfitCenterMaster,
          priceControlMaster: API_END_POINTS.getPriceControlMaster,
          availabilityCheckMaster: API_END_POINTS.getAvailabilityCheckMaster,
          materialTypeMaster: API_END_POINTS.getMaterialTypeMaster,
          mrpControllerMaster: API_END_POINTS.getMRPControllerMaster,
          storageLocationMaster: API_END_POINTS.getStorageLocationMaster,
          classTypeMaster: API_END_POINTS.getClassTypeMaster,
          serialNumberMaster: API_END_POINTS.getSerialNumberMaster,
          inspectionTypeMaster: API_END_POINTS.getInspectionTypeMaster,
          materialCategoryMaster: API_END_POINTS.getMaterialCategoryMaster,
        };

        const results = await Promise.allSettled(
          Object.entries(apiList).map(async ([key, url]) => {
            const res = await requestWrapper({ url, method: "GET" });
            const data =
              res?.data?.data || res?.data?.message?.data || [];
            return [key, data];
          })
        );

        const fetchedMasters: Record<string, any[]> = {};
        results.forEach((r) => {
          if (r.status === "fulfilled") {
            const [key, data] = r.value;
            fetchedMasters[key] = data;
          }
        });
        setMasters((prev) => ({ ...prev, ...fetchedMasters }));
      } catch (err) {
        console.error("Error fetching masters:", err);
      }
    };

    fetchAllMasters();
  }, []);

  // 🧩 FETCH MATERIAL CODES
  useEffect(() => {
    const fetchMaterialCode = async () => {
      try {
        const MaterialCodeRes: AxiosResponse<EmployeeAPIResponse> =
          await requestWrapper({
            url: `${API_END_POINTS.MaterialCodeSearchApi}`,
            method: "GET",
          });
        console.log("Mteirl code response--->",MaterialCodeRes)
        if (MaterialCodeRes?.status === 200) {
          const MaterialCodeData = MaterialCodeRes?.data?.message?.data;
          setAllMaterialCodes(MaterialCodeData || []);
        }
      } catch (err) {
        console.error("Error fetching material codes:", err);
      }
    };

    fetchMaterialCode();
  }, []);

  const [masters, setMasters] = useState<MastersData>({
    companyMaster: [],
    plantMaster: [],
    divisionMaster: [],
    industryMaster: [],
    uomMaster: [],
    mrpTypeMaster: [],
    valuationClassMaster: [],
    procurementTypeMaster: [],
    valuationCategoryMaster: [],
    materialGroupMaster: [],
    profitCenterMaster: [],
    priceControlMaster: [],
    availabilityCheckMaster: [],
    materialTypeMaster: [],
    mrpControllerMaster: [],
    storageLocationMaster: [],
    classTypeMaster: [],
    serialNumberMaster: [],
    inspectionTypeMaster: [],
    materialCategoryMaster: [],
  });

  // 🧾 CREATE REQUESTOR MASTER
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const formValues = form.getValues();
      const finalMaterialRequestList =
        materialRequestList.length > 0
          ? materialRequestList
          : [
            {
              material_name_description: formValues.material_name_description,
              material_code_revised: formValues.material_code_revised,
              material_company_code: materialCompanyCode,
              material_type: formValues.material_type,
              plant_name: formValues.plant_name,
              material_category: formValues.material_category,
              base_unit_of_measure: formValues.base_unit_of_measure,
              comment_by_user: formValues.comment_by_user,
              material_specifications: formValues.material_specifications,
              is_revised_code_new: formValues.is_revised_code_new,
            },
          ];

      const payload = new FormData();
      Object.entries(formValues).forEach(([key, value]) => {
        if (key !== "material_request")
          payload.append(key, sanitizeValue(value));
      });
      payload.append("material_request", JSON.stringify(finalMaterialRequestList));

      const res: AxiosResponse = await requestWrapper({
        url: API_END_POINTS.createRequestorMaster,
        method: "POST",
        headers: { Authorization: `token ${token}` },
        data: payload,
      });

      console.log("Create success →", res.data);
      setIsButtonDisabled(true);
      setShowAlert(true);

    } catch (err) {
      console.error("Error creating material:", err);

    } finally {
      setIsLoading(false);
    }
  };

  // 🧾 UPDATE REQUESTOR MASTER
  const onUpdate = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const formValues = form.getValues();
      const requestorName = formValues?.requestor_name;
      if (!requestorName) throw new Error("Missing Requestor Master name");

      const finalMaterialRequestList =
        materialRequestList.length > 0
          ? materialRequestList
          : [
            {
              material_name_description: formValues.material_name_description,
              material_code_revised: formValues.material_code_revised,
              material_company_code: materialCompanyCode,
              material_type: formValues.material_type,
              plant_name: formValues.plant_name,
              material_category: formValues.material_category,
              base_unit_of_measure: formValues.base_unit_of_measure,
              comment_by_user: formValues.comment_by_user,
              material_specifications: formValues.material_specifications,
              is_revised_code_new: formValues.is_revised_code_new,
            },
          ];

      const payload = new FormData();
      payload.append("requestor_name", requestorName);
      Object.entries(formValues).forEach(([key, value]) => {
        if (key !== "material_request")
          payload.append(key, sanitizeValue(value));
      });
      payload.append("material_request", JSON.stringify(finalMaterialRequestList));

      const res: AxiosResponse = await requestWrapper({
        url: API_END_POINTS.updateRequestorMaster,
        method: "POST",
        headers: { Authorization: `token ${token}` },
        data: payload,
      });

      console.log("Update success →", res.data);
      setIsButtonDisabled(true);
      setShowAlert(true);

    } catch (err) {
      console.error("Error updating material:", err);

    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/new-material-code-request-table");
    window.location.reload();
  };

  if (!UserDetailsJSON || !EmployeeDetailsJSON)
    return (
      <div className="text-center py-8 text-gray-700 font-medium">
        Loading data from server...
      </div>
    );

  return (
    <div className="pt-4 pl-[1%] pr-[1%] bg-slate-300">
      <Form {...form}>
        <MaterialOnboardingForm
          form={form}
          onCancel={onCancel}
          onSubmit={onSubmit}
          onUpdate={onUpdate}
          UserDetailsJSON={UserDetailsJSON}
          EmployeeDetailsJSON={EmployeeDetailsJSON}
          masters={masters}
          AllMaterialCodes={AllMaterialCodes}
          showAlert={showAlert}
          isLoading={isLoading}
          isButtonDisabled={isButtonDisabled}

        />
      </Form>
    </div>
  );
}
