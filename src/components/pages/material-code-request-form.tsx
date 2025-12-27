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
import MaterialOnboardingSchemas from "@/src/schemas/MaterialOnboardingSchema";
import { EmployeeDetail, EmployeeAPIResponse, Company, Plant, division, industry, ClassType, UOMMaster, MRPType, ValuationClass, procurementType, ValuationCategory, MaterialGroupMaster, MaterialCategory, ProfitCenter, AvailabilityCheck, PriceControl, MRPController, StorageLocation, InspectionType, SerialNumber, MaterialType } from "@/src/types/MaterialCodeRequestFormTypes";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

interface MastersData {
  companyMaster: Company[];
  uomMaster: UOMMaster[];
  materialCategoryMaster: MaterialCategory[];
}

export default function MaterialRegistration() {
  const form = useForm<any>({ resolver: zodResolver(MaterialOnboardingSchemas) });
  const [EmployeeDetailsJSON, setEmployeeDetailsJSON] = useState<EmployeeDetail | null>(null);
  const [materialRequestList, setMaterialRequestList] = useState<any[]>([]);
  const [materialCompanyCode, setMaterialCompanyCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameParam = searchParams.get("name");
  const materialNameParam = searchParams.get("material_name");
  const { user_email } = useAuth();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!user_email) return;
      try {
        const employeeRes: AxiosResponse<EmployeeAPIResponse> =
          await requestWrapper({
            url: `${API_END_POINTS.getEmployeeDetails}?user=${user_email}`,
            method: "GET",
          });
        if (employeeRes?.status === 200) {
          const employeeData = employeeRes?.data?.message?.data;
          if (!employeeData) return console.warn("No employee details found");
          setEmployeeDetailsJSON(employeeData);
        }
      } catch (err) {
        console.error("Error fetching employee details:", err);
      }
    };

    fetchEmployeeData();
  }, [user_email]);

  useEffect(() => {
    const fetchExistingFormData = async () => {
      if (!nameParam || !materialNameParam) return;

      try {
        setIsLoading(true);
        const res: AxiosResponse = await requestWrapper({
          url: `${API_END_POINTS.getMaterialOnboardingTableList}`,
          method: "GET",
          params: {
            filters: JSON.stringify({
              name: nameParam,
              material_name_description: materialNameParam,
            }),
          },
        });
        const data = res?.data?.message?.data?.[0];
        if (!data) {
          console.warn("No form found for the provided params");
          return;
        }
        setMaterialRequestList([data]);

      } catch (err) {
        console.error("Error fetching existing form:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingFormData();
  }, [nameParam, materialNameParam]);

  useEffect(() => {
    const fetchAllMasters = async () => {
      try {
        const apiList = {
          companyMaster: API_END_POINTS.getCompanyMaster,
          uomMaster: API_END_POINTS.getUOMMaster,
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

  const [masters, setMasters] = useState<MastersData>({
    companyMaster: [],
    uomMaster: [],
    materialCategoryMaster: [],
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      console.log("Validated Data:", data);
      const formValues = form.getValues();
      console.log("ALL FORM VALUES →", form.getValues());

      const materialItem: any = {
        material_name_description: formValues.material_name_description,
        material_company_code: materialCompanyCode,
        material_type: formValues.material_type,
        material_type_category: formValues.material_type_category,
        plant: formValues.plant_name,
        material_category: formValues.material_category,
        unit_of_measure: formValues.base_unit_of_measure,
        comment_by_user: formValues.comment_by_user,
        material_specifications: formValues.material_specifications,
        is_revised_code_new: formValues.is_revised_code_new,
        company_name: formValues.material_company_code,
      };

      const isRevisedNew = formValues.is_revised_code_new === true || formValues.is_revised_code_new === 1;

      const isRP = ["R", "P"].includes(formValues.material_category);

      if (isRevisedNew && isRP) {
        materialItem.material_code_revised = formValues.material_code_revised;
      }

      const finalMaterialRequestList = materialRequestList.length > 0 ? materialRequestList : [materialItem];

      const requestorData = {
        request_date: formValues.request_date,
        requested_by: formValues.requested_by,
        requestor_company: formValues.company,
        department: formValues.department,
        sub_department: formValues.sub_department,
        hod: formValues.hod,
        immediate_reporting_head: formValues.immediate_reporting_head,
        contact_information_email: formValues.contact_information_email,
        contact_information_phone: formValues.contact_information_phone,
        requested_by_name: formValues.requested_by_name,
        requested_by_place: formValues.requested_by_place,
      };

      const payload = new FormData();
      payload.append("requestor_data", JSON.stringify(requestorData));
      payload.append("material_request", JSON.stringify(finalMaterialRequestList));
      payload.append("send_email", "true");

      console.log("Final Payload before API hit-------->", payload)

      const res: AxiosResponse = await requestWrapper({
        url: API_END_POINTS.createRequestorMaster,
        method: "POST",
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

  const onUpdate = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const formValues = form.getValues();
      // console.log("Form Values on Submit----->", formValues);
      const materialItem: any = {
        material_name_description: formValues.material_name_description,
        material_company_code: materialCompanyCode,
        material_type: formValues.material_type,
        plant: formValues.plant_name,
        material_category: formValues.material_category,
        unit_of_measure: formValues.base_unit_of_measure,
        comment_by_user: formValues.comment_by_user,
        material_specifications: formValues.material_specifications,
        is_revised_code_new: formValues.is_revised_code_new,
        company_name: formValues.material_company_code,
      };

      if (!formValues.is_revised_code_new) {
        materialItem.material_code_revised = formValues.material_code_revised;
      }

      const finalMaterialRequestList =
        materialRequestList.length > 0
          ? materialRequestList
          : [materialItem];

      const requestorData = {
        request_date: formValues.request_date,
        requested_by: formValues.requested_by,
        requestor_company: formValues.company,
        department: formValues.department,
        sub_department: formValues.sub_department,
        hod: formValues.hod,
        immediate_reporting_head: formValues.immediate_reporting_head,
        contact_information_email: formValues.contact_information_email,
        contact_information_phone: formValues.contact_information_phone,
        requested_by_name: formValues.requested_by_name,
        requested_by_place: formValues.requested_by_place,
      };

      const payload = new FormData();
      payload.append("requestor_data", JSON.stringify(requestorData));
      payload.append("material_request", JSON.stringify(finalMaterialRequestList));
      payload.append("send_email", "true");

      const res: AxiosResponse = await requestWrapper({
        url: API_END_POINTS.updateRequestorMaster,
        method: "POST",
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

  const onError = (errors: any) => {
    console.log("Validation Errors:", errors);

    alert("⚠️ Please fill all required fields before submitting.");
  };


  if (!EmployeeDetailsJSON)
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
          onError={onError}
          EmployeeDetailsJSON={EmployeeDetailsJSON}
          masters={masters}
          showAlert={showAlert}
          isLoading={isLoading}
          isButtonDisabled={isButtonDisabled}
          materialRequestList={(materialRequestList.length > 0 ? materialRequestList[0] : undefined) as any}
        />
      </Form>
    </div>
  );
}
