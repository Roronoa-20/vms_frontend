"use client";

import React, { useRef } from "react";
import { Button } from "../../atoms/button";
import { useSearchParams } from "next/navigation";
import { useQMSForm } from "@/src/hooks/useQMSForm";
import Form1 from "@/src/components/molecules/mdpl-quality-agreement/form1";
import Form2 from "@/src/components/molecules/mdpl-quality-agreement/form2";
import Form3 from "@/src/components/molecules/mdpl-quality-agreement/form3";
import Form4 from "@/src/components/molecules/mdpl-quality-agreement/form4";
import { Form5 } from "@/src/components/molecules/mdpl-quality-agreement/form5";
import { Form6 } from "@/src/components/molecules/mdpl-quality-agreement/form6";
import Form7 from "@/src/components/molecules/mdpl-quality-agreement/form7";

export const MDPLQualityAgreementForm = ({
  vendor_onboarding,
  company_code,
}: {
  vendor_onboarding: string;
  company_code: string;
}) => {
  const params = useSearchParams();
  const formRef = useRef<HTMLDivElement | null>(null);
  const currentTab =
    params.get("tabtype")?.toLowerCase() || "vendor information";

  const { handleSubmit, handleBack } = useQMSForm(
    vendor_onboarding,
    currentTab
  );

  return (
    <div className="flex flex-col items-center px-4 pt-[40px] pb-10 bg-gray-100 min-h-screen">
      {/* Each Form = 1 Page */}
      <div className="page">
        <Form1 vendor_onboarding={vendor_onboarding} />
      </div>
      <div className="page">
        <Form2 />
      </div>
      <div className="page">
        <Form3 />
      </div>
      <div className="page">
        <Form4 />
      </div>
      <div className="page">
        <Form5 vendor_onboarding={vendor_onboarding} />
      </div>
      <div className="page">
        <Form6 vendor_onboarding={vendor_onboarding} />
      </div>
      <div className="page flex flex-col justify-between">
        <Form7 vendor_onboarding={vendor_onboarding} />

        {/* Footer Buttons on last page */}
        <div className="flex justify-end space-x-5 pt-6">
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
      </div>
    </div>
  );
};