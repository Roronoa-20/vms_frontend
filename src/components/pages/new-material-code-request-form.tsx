"use client";

import { useEffect, useState, MouseEvent, FormEvent } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import MaterialOnboardingForm from "@/src/components/molecules/material-onboarding/material-onboarding-form";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";
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
  const form = useForm<any>();
  const [UserDetailsJSON, setUserDetailsJSON] = useState<any>(null);
  const [EmployeeDetailsJSON, setEmployeeDetailsJSON] = useState<EmployeeDetail | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const userId = Cookies.get("user_id");
        if (!userId) {
          console.error("No user_id found in cookies");
          return;
        }

        const employeeRes: AxiosResponse<EmployeeAPIResponse> = await requestWrapper({
          url: `${API_END_POINTS.getEmployeeDetails}?user=${userId}`,
          method: "GET",
        });
        if (employeeRes?.status === 200) {
          const employeeData = employeeRes?.data?.message?.data
          if (!employeeData) {
            console.warn("No employee details found for user_id:", userId);
            return;
          }

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
            return [key, res?.data?.data || []];
          })
        );

        const fetchedMasters: Record<string, any[]> = {};
        results.forEach((result) => {
          if (result.status === "fulfilled") {
            const [key, data] = result.value;
            fetchedMasters[key] = data;
          }
        });

        setMasters((prev) => ({ ...prev, ...fetchedMasters }));
      } catch (err) {
        console.error("Error fetching master data:", err);
      }
    };

    fetchAllMasters();
  }, []);

  const onCancel = (e: MouseEvent<HTMLButtonElement>) => e.preventDefault();
  const onSubmit = (e: FormEvent<HTMLFormElement>) => e.preventDefault();
  const onUpdate = (e: MouseEvent<HTMLButtonElement>) => e.preventDefault();

  if (!UserDetailsJSON || !EmployeeDetailsJSON || !companyName) {
    return (
      <div className="text-center py-8 text-gray-700 font-medium">
        Loading data from server...
      </div>
    );
  }

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
          companyName={companyName}
          masters={masters}
        />
      </Form>
    </div>
  );
}
