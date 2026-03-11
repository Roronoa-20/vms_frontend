"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";


export const MDPLQualityAgreementForm = ({ vendor_onboarding, ref_no, company_code }: { vendor_onboarding: string; ref_no: string; company_code: string; }) => {
  const params = useSearchParams();
  const formRef = useRef<HTMLInputElement | null>(null);
  const currentTab = params.get("tabtype")?.toLowerCase() || "vendor information";
  const qms = useQMSForm(vendor_onboarding, currentTab);
  const { formData, handleBack } = qms
  const router = useRouter();
  // const isQATeamApproved = formData?.qa_team_approved === 1;
  const isQATeamApproved = formData?.form_fully_submitted === 1;
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);


  const handleSubmit = async () => {
    console.log("Parent formData:", formData);
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

      if (formData?.attach_person_signature) {
        form.append("attach_person_signature", formData.attach_person_signature);
      }

      if (formData.attach_meril_signature) {
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
        setShowSuccessPopup(true);
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
      <Form5 vendor_onboarding={vendor_onboarding} qms={qms} />
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
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px] text-center">
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="w-14 h-14 text-green-600" />

              <div className="text-lg font-semibold text-green-400">
                QMS Questionnaire and QUality Agreement Submitted Successfully!!!
              </div>
            </div>
            <Button
              className="mt-2 py-2.5 hover:bg-white hover:text-black hover:border hover:border-[#5291CD]"
              variant={"nextbtn"}
              size={"nextbtnsize"}
              onClick={() => router.push("/success")}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  )

}