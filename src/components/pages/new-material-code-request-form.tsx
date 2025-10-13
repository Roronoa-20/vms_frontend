"use client";

import { useEffect, useState, MouseEvent, FormEvent } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import MaterialOnboardingForm from "@/src/components/molecules/material-onboarding/material-onboarding-form";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { EmployeeDetail, EmployeeAPIResponse } from "@/src/types/MaterialCodeRequestFormTypes";

export default function MaterialRegistration() {
  const form = useForm<any>();
  const [UserDetailsJSON, setUserDetailsJSON] = useState<any>(null);
  const [EmployeeDetailsJSON, setEmployeeDetailsJSON] = useState<EmployeeDetail | null>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const userId = Cookies.get("user_id");
        if (!userId) {
          console.error("No user_id found in cookies");
          return;
        }

        const filterParam = encodeURIComponent(JSON.stringify({ user_id: userId }));
        const fieldsParam = encodeURIComponent(JSON.stringify(["*"]));

        const employeeRes: AxiosResponse<EmployeeAPIResponse> = await requestWrapper({
          url: `${API_END_POINTS.getEmployeeDetails}?fields=${fieldsParam}&filters=${filterParam}`,
          method: "GET",
        });

        console.log("Employee Details----->", employeeRes);

        if (employeeRes?.status === 200) {
          const employeeData = employeeRes?.data?.data?.[0];
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
          setCompanyName(employeeData.branch || "Default Company");
        }
      } catch (err) {
        console.error("Error fetching employee details:", err);
      }
    };

    fetchEmployeeData();
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
        />
      </Form>
    </div>
  );
}
