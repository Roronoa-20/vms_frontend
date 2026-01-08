import { useEffect } from "react";
import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button"
import { Governance, EmployeeSatisfaction } from "@/src/types/asatypes";
import { useState } from "react";
import { useASAForm } from "@/src/hooks/useASAForm";
import { useBackNavigation } from "@/src/hooks/useBackNavigationASAForm";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useASAFormContext } from "@/src/context/ASAFormContext";

export default function GovernanceForm() {

   const searchParams = useSearchParams();
   const vmsRefNo = searchParams.get("vms_ref_no") || "";
   const { governanceform, updateGovernanceForm, submitGoveranceForm, refreshFormData, updateEmpSatisactionForm, asaFormSubmitData, setFormProgress } = useASAFormContext();
   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
   const isverified = asaFormSubmitData.form_is_submitted || 0;

   const calculateProgress = () => {
      const entries = Object.entries(governanceform);

      const completed = entries.filter(([key, item]) => {
         const typedItem = item as Governance[keyof Governance];
         if (!typedItem.selection) return false;
         if (typedItem.selection === "Yes" && !typedItem.comment?.trim()) return false;
         if (fileRequiredQuestions.has(key) && typedItem.selection === "Yes" && !typedItem.file) return false;
         return true;
      }).length;

      return Math.round((completed / entries.length) * 100);
   };

   useEffect(() => {
      const percent = calculateProgress();
      setFormProgress((prev: any) => ({
         ...prev,
         governance: percent,
      }));
   }, [governanceform]);

   console.log("Governance web Form Data:", governanceform);

   const router = useRouter();
   const fileRequiredQuestions = new Set([
      "have_formal_governance_structure",
      "esg_policies_coverage",
      "esg_risk_integration",
      "company_publish_sustainability_report",
      "esg_rating_participated",
      "esg_incentive_for_employee",
   ]);

   const isValid = Object.entries(governanceform).every(([key, item]) => {
      const typedItem = item as Governance[keyof Governance];
      if (!typedItem.selection) return false;
      if (typedItem.selection === "Yes" && !typedItem.comment.trim()) return false;
      if (fileRequiredQuestions.has(key) && typedItem.selection === "Yes" && !typedItem.file) return false;
      return true;
   });

   const handleSelectionChange = (name: string, selection: "Yes" | "No" | "NA" | "") => {
      updateGovernanceForm({
         ...governanceform,
         [name]: {
            ...governanceform[name as keyof Governance],
            selection,
         },
      });
   };

   const handleCommentChange = (name: string, comment: string) => {
      updateGovernanceForm({
         ...governanceform,
         [name]: {
            ...governanceform[name as keyof Governance],
            comment,
         },
      });
   };

   const handleFileChange = (name: string, file: File | null) => {
      updateGovernanceForm({
         ...governanceform,
         [name]: {
            ...governanceform[name as keyof Governance],
            file,
         },
      });
   };

   const handleSubmit = async () => {
      if (!isValid) return;
      const success = await submitGoveranceForm();
      if (success) {
         setShowSuccessPopup(true);
      }
      refreshFormData();
   };

   const handleBack = useBackNavigation<EmployeeSatisfaction>(
      "EmpSatisfactionForm",
      updateEmpSatisactionForm,
      "employee_satisfaction",
      vmsRefNo
   );


   return (
      <div className="h-full">
         <div className="p-3 bg-white shadow-md rounded-xl">
            <div className="text-2xl font-bold text-gray-800 mb-2">Governance</div>
            <div className="border-b border-gray-400"></div>
            <div className="space-y-6 p-3">

               <YesNoNA
                  name="have_formal_governance_structure"
                  label="1. Does the company have a formal governance structure in place to oversee ESG matters, including roles like Board-level committees, ESG heads, and specific committees for health, safety, and prevention of sexual harassment?"
                  helperText="If Yes, attach the governing structure and committee details."
                  value={governanceform.have_formal_governance_structure}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  disabled={isverified === 1}
                  fileRequired={true}
                  options={["Yes", "No"]}
               />

               <YesNoNA
                  name="esg_policies_coverage"
                  label="2. Does the company have policies in place for various ESG aspects, such as environment, health, safety, child labor, diversity, employee conduct, human rights, CSR, whistleblowing, anti-bribery, anti-discrimination, anti-money laundering, fair competition, and intellectual property rights?"
                  helperText="If Yes, attach the copy of the policies."
                  value={governanceform.esg_policies_coverage}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  options={["Yes", "No"]}
                  fileRequired={true}
                  disabled={isverified === 1}
               />

               <YesNoNA
                  name="esg_risk_integration"
                  label="3. Are ESG risks integrated into the company's risk register?"
                  helperText="If Yes, attach the company risk register or th list of the risks identified."
                  value={governanceform.esg_risk_integration}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  options={["Yes", "No"]}
                  fileRequired={true}
                  disabled={isverified === 1}
               />

               <YesNoNA
                  name="company_publish_sustainability_report"
                  label="4. Does your company annually publish a Sustainability report/ESG Report/Integrated report?"
                  helperText="If Yes, attach the copy of the report."
                  value={governanceform.company_publish_sustainability_report}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  options={["Yes", "No"]}
                  fileRequired={true}
                  disabled={isverified === 1}
               />

               <YesNoNA
                  name="esg_rating_participated"
                  label="5. Have you participated in ESG/Sustainability ratings like DJSI, CDP, MSCI, Ecovadis, etc.? If Yes, provide the scoring/rating achieved."
                  helperText="If Yes, specify the scoring/ratings received and upload the relevant documents or the screenshot of the score/ratings."
                  value={governanceform.esg_rating_participated}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  fileRequired={true}
                  options={["Yes", "No"]}
                  disabled={isverified === 1}
               />

               <YesNoNA
                  name="esg_incentive_for_employee"
                  label="6. Does the company provide incentives to employees on achieving ESG targets?"
                  helperText="If yes, provide the details of the incentives provided to the employees and attach the relevant documents/policy."
                  value={governanceform.esg_incentive_for_employee}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  fileRequired={true}
                  options={["Yes", "No"]}
                  disabled={isverified === 1}
               />

               <YesNoNA
                  name="csat_survey_conducted"
                  label="7. Do you conduct customer satisfaction survey (CSAT)? If yes, provide the CSAT score."
                  helperText="If Yes, provide the CSAT score, and provide the details of the parameters covered in the customer satisfaction survey."
                  value={governanceform.csat_survey_conducted}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  options={["Yes", "No"]}
                  disabled={isverified === 1}
               />

               <YesNoNA
                  name="instance_of_loss_customer_data"
                  label="8. Was there any instances involving loss / breach of data of customers? If Yes, provide the number of such incidents."
                  helperText="If Yes, provide the number of such incidents and details about those incidents."
                  value={governanceform.instance_of_loss_customer_data}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  options={["Yes", "No"]}
                  disabled={isverified === 1}
               />

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
                        // disabled={!isValid}
                        onClick={handleSubmit}
                     >
                        Submit
                     </Button>
                  </div>
               )}
            </div>
         </div>

         {showSuccessPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
               <div className="bg-white p-6 rounded-xl shadow-xl w-[350px] text-center">
                  <h2 className="text-xl font-semibold mb-4">
                     ASA Form Submitted Successfully
                  </h2>
                  <Button
                     className="mt-2 py-2.5 hover:bg-white hover:text-black hover:border hover:border-[#5291CD]"
                     variant={"nextbtn"}
                     size={"nextbtnsize"}
                     onClick={() => router.push("/vendor-dashboard")}
                  >
                     OK
                  </Button>
               </div>
            </div>
         )}

      </div>
   )
}