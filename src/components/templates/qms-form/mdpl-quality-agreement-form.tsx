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
import { Form6}  from '@/src/components/molecules/mdpl-quality-agreement/form6';
import Form7 from '@/src/components/molecules/mdpl-quality-agreement/form7';


export const MDPLQualityAgreementForm = ({ vendor_onboarding, ref_no, company_code }: { vendor_onboarding: string; ref_no: string; company_code: string; }) => {
    const params = useSearchParams();
    const formRef = useRef<HTMLInputElement | null>(null);
    const currentTab = params.get("tabtype")?.toLowerCase() || "vendor information";
    const { formData, handleSubmit, documentTypes, selectedDocumentType, handleDocumentTypeChange, handleAdd, clearFileSelection, handleFileUpload, handleDelete, handleBack, tableData, fileSelected, fileName, } = useQMSForm(vendor_onboarding, currentTab);

    return (
    <div className="space-y-4 flex flex-col justify-between min-h-[80vh]">
      <Form1 vendor_onboarding={vendor_onboarding} />
      <Form2 />
      <Form3 />
      <Form4 />
      <Form5 vendor_onboarding={vendor_onboarding}/>
      <Form6 vendor_onboarding={vendor_onboarding}/>
      <Form7 vendor_onboarding={vendor_onboarding}/>
      <div className="flex justify-end space-x-5 items-center pt-[5px]">
        <Button variant="backbtn" size="backbtnsize" className="py-2" onClick={handleBack}>
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
  )

}