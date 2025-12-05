"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "../../atoms/button";
import { useSearchParams } from "next/navigation";
import { useQMSForm } from '@/src/hooks/useQMSForm';
import Form1 from '@/src/components/molecules/mdpl-quality-agreement/form1';
import Form2 from '@/src/components/molecules/mdpl-quality-agreement/form2';
import Form3 from '@/src/components/molecules/mdpl-quality-agreement/form3';
import Form4 from '@/src/components/molecules/mdpl-quality-agreement/form4';
import { Form5 } from '@/src/components/molecules/mdpl-quality-agreement/form5';
import { Form6 } from '@/src/components/molecules/mdpl-quality-agreement/form6';
import Form7 from '@/src/components/molecules/mdpl-quality-agreement/form7';
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";


export const MDPLQualityAgreementForm = ({ vendor_onboarding, ref_no, company_code }: { vendor_onboarding: string; ref_no: string; company_code: string; }) => {
  const params = useSearchParams();
  const formRef = useRef<HTMLInputElement | null>(null);
  const currentTab = params.get("tabtype")?.toLowerCase() || "vendor information";
  const { formData, handleBack } = useQMSForm(vendor_onboarding, currentTab);

  const isQATeamApproved = formData?.qa_team_approved === 1;

  const handleSubmit = async () => {
    try {
      const storageKeys = [
        "QualityAgreementInfo",
        "Form5Data",
        "Form6Data",
        "Form7Data",
      ];
      const mergedLocalStorageData: any = {};

      storageKeys.forEach((key) => {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            Object.assign(mergedLocalStorageData, parsed);
          } catch (err) {
            console.warn(`Could not parse ${key}`, err);
          }
        }
      });

      const finalPayload = {
        vendor_onboarding,
        qms_form: formData?.name,
        ...mergedLocalStorageData,
      };

      console.log("Final LocalStorage Being Submitted →", mergedLocalStorageData);
      console.log("Attach Person Singature", formData?.attach_person_signature)

      const form = new FormData();
      form.append("data", JSON.stringify(finalPayload));
      if (formData.attach_person_signature instanceof File) {
        form.append("attach_person_signature", formData.attach_person_signature);
      }

      if (formData.attach_meril_signature instanceof File) {
        form.append("attach_meril_signature", formData.attach_meril_signature);
      }

      console.log("Final Payload Being Submitted →", finalPayload);
      const response = await requestWrapper({
        url: API_END_POINTS.createsubmitQualityAgreement,
        method: "POST",
        data: form,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("API response:", response);
      if (response?.status === 200) {
        // handleNext();
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <div className="space-y-4 flex flex-col justify-between min-h-[80vh]">
      <Form1 vendor_onboarding={vendor_onboarding} />
      <Form2 />
      <Form3 />
      <Form4 />
      <Form5 vendor_onboarding={vendor_onboarding} />
      <Form6 vendor_onboarding={vendor_onboarding} />
      <Form7 vendor_onboarding={vendor_onboarding} />

      {!isQATeamApproved && (
        <div className="flex justify-end space-x-5 items-center pt-[5px]">
          <Button
            variant="backbtn"
            size="backbtnsize"
            className="py-2"
            onClick={handleBack}
          >
            Back
          </Button>

          <Button
            variant="nextbtn"
            size="nextbtnsize"
            className="py-2.5"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      )}
    </div>
  )

}