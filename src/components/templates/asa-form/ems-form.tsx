import React, { useState, useEffect } from "react";
import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { EnvironmentalManagementSystem } from "@/src/types/asatypes";
import { Label } from "@/components/ui/label";
import { useASAForm } from "@/src/hooks/useASAForm";
import { useASAFormContext } from "@/src/context/ASAFormContext";


export default function Environmental_Management_System() {

  const router = useRouter();
  const params = useSearchParams();
  const vmsRefNo = params.get("vms_ref_no") || "";
  const { emsform, updateEmsForm, refreshFormData, asaFormSubmitData, setFormProgress } = useASAFormContext();
  const isverified = asaFormSubmitData.form_is_submitted || 0;

  console.log("General Disclosure Form Data:", emsform);

  const calculateProgress = () => {
    const entries = Object.entries(emsform);

    const completed = entries.filter(([key, item]) => {
      const typedItem = item as EnvironmentalManagementSystem[keyof EnvironmentalManagementSystem];
      if (!typedItem.selection) return false;
      if (typedItem.selection === "Yes" && !typedItem.comment.trim()) return false;
      // if (fileRequiredQuestions.has(key) && typedItem.selection === "Yes" && !typedItem.file) return false;
      return true;
    }).length;

    return Math.round((completed / entries.length) * 100);
  };

  useEffect(() => {
    const percent = calculateProgress();

    setFormProgress((prev: any) => ({
      ...prev,
      ems: percent,
    }));
  }, [emsform]);

  const isValid = Object.values(emsform).every((item) => {
    const typedItem = item as EnvironmentalManagementSystem[keyof EnvironmentalManagementSystem];
    if (!typedItem.selection) return false;
    if (typedItem.selection === "Yes") {
      if (!typedItem.comment?.trim()) return false;
      if (!typedItem.file) return false;
    }
    return true;
  });


  const base64ToBlob = (base64: string): Blob => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  useEffect(() => {
    const stored = localStorage.getItem("EMSForm");
    if (stored) {
      const parsed = JSON.parse(stored);

      for (const key in parsed) {
        const entry = parsed[key];
        if (entry.file?.base64) {
          const blob = base64ToBlob(entry.file.base64);
          entry.file = new File([blob], entry.file.name, { type: blob.type });
        }
      }
      updateEmsForm(parsed);
      refreshFormData();
    }
  }, []);

  const handleSelectionChange = (name: string, selection: "Yes" | "No" | "NA" | "") => {
    updateEmsForm({
      ...emsform,
      [name]: {
        ...emsform[name as keyof EnvironmentalManagementSystem],
        selection,
      },
    });
  };

  const handleCommentChange = (name: string, comment: string) => {
    updateEmsForm({
      ...emsform,
      [name]: {
        ...emsform[name as keyof EnvironmentalManagementSystem],
        comment,
      },
    });
  };

  const handleFileChange = (name: string, file: File | null) => {
    updateEmsForm({
      ...emsform,
      [name]: {
        ...emsform[name as keyof EnvironmentalManagementSystem],
        file,
      },
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };


  const handleNext = async () => {
    console.log("Submitting EMS Form and navigating to next tab:", emsform);
    const emsCopy = { ...emsform };

    for (const key in emsCopy) {
      const entry = emsCopy[key as keyof EnvironmentalManagementSystem];
      if (entry.file instanceof File) {
        const base64 = await fileToBase64(entry.file);
        entry.file = {
          url: "",
          name: entry.file.name,
          base64,
        };
      }
    }
    updateEmsForm(emsCopy);
    localStorage.setItem("EMSForm", JSON.stringify(emsCopy));
    router.push(`asa-form?tabtype=ece&vms_ref_no=${vmsRefNo}`);
  };

  const handleBack = () => {
    router.push(`asa-form?tabtype=general_disclosures_sub&vms_ref_no=${vmsRefNo}`);
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-950 p-3 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Environmental Management System
        </h1>
        <div className="border-b border-gray-300 dark:border-gray-700 mb-1" />
        <div className="mb-6">
          <Label className="block text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Does your company have:
          </Label>

          <div className="space-y-6 pl-4">
            <YesNoNA
              name="environment_sustainability_policy"
              value={emsform.environment_sustainability_policy}
              onSelectionChange={handleSelectionChange}
              onCommentChange={handleCommentChange}
              onFileChange={handleFileChange}
              label="i. Environment/Sustainability Policy in place?"
              helperText="If Yes, attach the copy of the policy."
              required={true}
              fileRequired={true}
              disabled={isverified === 1}
              options={["Yes", "No"]}

            />

            <YesNoNA
              name="environmental_management_certification"
              value={emsform.environmental_management_certification}
              onSelectionChange={handleSelectionChange}
              onCommentChange={handleCommentChange}
              onFileChange={handleFileChange}
              label="ii. Environment Management System certified to standards like ISO 14001, ISO 5001, etc.?"
              helperText="If Yes, attach the copy of the certificate."
              required={true}
              fileRequired={true}
              disabled={isverified === 1}
              options={["Yes", "No"]}

            />

            <YesNoNA
              name="regular_audits_conducted"
              value={emsform.regular_audits_conducted}
              onSelectionChange={handleSelectionChange}
              onCommentChange={handleCommentChange}
              onFileChange={handleFileChange}
              label="iii. Do you conduct regular energy, water, and waste audits?"
              helperText="If Yes, please attach the audit reports/recoomendations."
              required={true}
              fileRequired={true}
              disabled={isverified === 1}
              options={["Yes", "No"]}

            />
          </div>
        </div>

        {/* Next Button */}
        {isverified !== 1 && (
          <div className="flex space-x-4 justify-end">
            <Button
              className="py-2.5"
              variant="backbtn"
              size="backbtnsize"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              className="py-2.5"
              variant="nextbtn"
              size="nextbtnsize"
              onClick={handleNext}
            // disabled={!isValid}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}