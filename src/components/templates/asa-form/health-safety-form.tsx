import React, { useState, useEffect } from "react";
import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button";
import { HealthAndSafety, EmployeeWellBeing } from "@/src/types/asatypes";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useASAForm } from "@/src/hooks/useASAForm";
import { useBackNavigation } from "@/src/hooks/useBackNavigationASAForm";
import { Label } from "@/components/ui/label";


export default function Health_And_Safety() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const vmsRefNo = searchParams.get("vms_ref_no") || "";
   const { refreshFormData, updateEmpWellBeingForm, HealthSafetyForm, updateHealthSafetyForm, asaFormSubmitData } = useASAForm();
   const [mentionBehaviorBaseSafety, setMentionBehaviorBaseSafety] = useState("");
   const isverified = asaFormSubmitData.verify_by_asa_team || 0;
   console.log("Health Safety Form Data:", HealthSafetyForm);

   const isValid = Object.values(HealthSafetyForm).every((item) => {
      if (!item.selection) return false;
      if (item.selection === "Yes" && !item.comment.trim()) return false;
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
      const stored = localStorage.getItem("HealthSafetyForm");
      const extrastored = localStorage.getItem("mention_behavior_base_safety");
      if (stored) {
         const parsed = JSON.parse(stored);

         for (const key in parsed) {
            const entry = parsed[key];
            if (entry.file?.base64) {
               const blob = base64ToBlob(entry.file.base64);
               entry.file = new File([blob], entry.file.name, { type: blob.type });
            }
         }
         updateHealthSafetyForm(parsed);
         refreshFormData();
      }
      if (extrastored) {
         setMentionBehaviorBaseSafety(extrastored);
      }
   }, []);

   const handleSelectionChange = (name: string, selection: "Yes" | "No" | "NA" | "") => {
      updateHealthSafetyForm({
         ...HealthSafetyForm,
         [name]: {
            ...HealthSafetyForm[name as keyof HealthAndSafety],
            selection,
         },
      });
   };

   const handleCommentChange = (name: string, comment: string) => {
      updateHealthSafetyForm({
         ...HealthSafetyForm,
         [name]: {
            ...HealthSafetyForm[name as keyof HealthAndSafety],
            comment,
         },
      });
   };

   const handleFileChange = (name: string, file: File | null) => {
      updateHealthSafetyForm({
         ...HealthSafetyForm,
         [name]: {
            ...HealthSafetyForm[name as keyof HealthAndSafety],
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
      console.log("Submitting Labor Rights Form and navigating to next tab:", HealthSafetyForm);
      const HealthSafetyFormCopy = { ...HealthSafetyForm };

      for (const key in HealthSafetyFormCopy) {
         const entry = HealthSafetyFormCopy[key as keyof HealthAndSafety];
         if (entry.file instanceof File) {
            const base64 = await fileToBase64(entry.file);
            entry.file = {
               url: "",
               name: entry.file.name,
               base64,
            };
         }
      }
      updateHealthSafetyForm(HealthSafetyFormCopy);
      localStorage.setItem("HealthSafetyForm", JSON.stringify(HealthSafetyFormCopy));
      localStorage.setItem("mention_behavior_base_safety", mentionBehaviorBaseSafety);
      router.push(`asa-form?tabtype=employee_satisfaction&vms_ref_no=${vmsRefNo}`);
   };

   const handleBack = useBackNavigation<EmployeeWellBeing>(
      "EmpWellBeingForm",
      updateEmpWellBeingForm,
      "employee_wellbeing",
      vmsRefNo
   );


   return (
      <div className="h-full">
         <div className="p-3 bg-white shadow-md rounded-xl">
            <div className="text-2xl font-bold text-gray-800 mb-2">Health and Safety</div>
            <div className="border-b border-gray-400"></div>
            <div className="space-y-6 p-3">

               <YesNoNA
                  name="has_develop_health_safety_policy"
                  label="1. Has the company developed health and safety policy and has displayed it at a conspicuous location?"
                  value={HealthSafetyForm.has_develop_health_safety_policy}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  disabled={isverified === 1}
               />

               <YesNoNA
                  name="have_healthy_safety_management"
                  label="2. Do you have an Occupational Healthy & Safety management (OHS) system?"
                  value={HealthSafetyForm.have_healthy_safety_management}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  disabled={isverified === 1}
               />

               <YesNoNA
                  name="conduct_hira_activity"
                  label="3. Does the company conduct hazard identification and risk assessment (HIRA) for every activity and for any change in conditions?"
                  value={HealthSafetyForm.conduct_hira_activity}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  disabled={isverified === 1}
               />

               <YesNoNA
                  name="certify_ohs_system"
                  label="4. Is your OHS system certified to ISO 14001 or OHSAS 18001?"
                  value={HealthSafetyForm.certify_ohs_system}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  disabled={isverified === 1}
               />

               <YesNoNA
                  name="emp_trained_health_safety"
                  label="5. Are employees regularly trained on health & safety?"
                  value={HealthSafetyForm.emp_trained_health_safety}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  disabled={isverified === 1}
               />

               <div className="flex flex-col space-y-1">
                  <Label htmlFor="mention_behavior_base_safety" className="text-sm font-medium text-black">
                     Also, please mention if behavior-based safety training is provided.<span className="text-red-600 ml-1">*</span>
                  </Label>
                  <textarea
                     id="mention_behavior_base_safety"
                     name="mention_behavior_base_safety"
                     rows={2}
                     placeholder="Mention behavior-based safety training details if any"
                     value={mentionBehaviorBaseSafety}
                     className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     onChange={(e) => {
                        setMentionBehaviorBaseSafety(e.target.value);
                        localStorage.setItem("mention_behavior_base_safety", e.target.value);
                     }}
                     disabled={isverified === 1}
                  />
               </div>


               <YesNoNA
                  name="track_health_safety_indicators"
                  label="6. Does the company track health and safety indicators like fatalities, lost time injuries, first aid cases, near misses, and maintain records?"
                  value={HealthSafetyForm.track_health_safety_indicators}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  disabled={isverified === 1}
               />

               <YesNoNA
                  name="provide_any_healthcare_services"
                  label="7. Does the company provide healthcare services to the employees and workers like Annual Health checkup? If Yes, provide the details."
                  value={HealthSafetyForm.provide_any_healthcare_services}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  disabled={isverified === 1}
               />

               {isverified !== 1 && (
                  <div className="space-x-4 flex justify-end">
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
                        disabled={!isValid}
                     >
                        Next
                     </Button>
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}