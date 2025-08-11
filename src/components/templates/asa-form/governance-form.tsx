import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button"
import { Governance } from "@/src/types/asatypes";
import { useState } from "react";
import { useASAForm } from "@/src/hooks/useASAForm";

export default function GovernanceForm() {

   const {governanceform, updateGovernanceForm, submitGoveranceForm, refreshFormData } = useASAForm();
   console.log("Governance web Form Data:", governanceform);

   const handleSelectionChange = ( name: string, selection: "Yes" | "No" | "NA" | "") => {
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
        await submitGoveranceForm();
        refreshFormData();
    };


   return (
      <div className="h-full">
         <div className="p-3 bg-white shadow-md rounded-xl">
            <div className="text-2xl font-bold text-gray-800 mb-2">Governance</div>
            <div className="border-b border-gray-400"></div>
            <div className="space-y-6 p-3">

               <YesNoNA
                  name="have_formal_governance_structure"
                  label="1. Does the company have a formal governance structure in place to oversee ESG matters, including roles like Board-level committees, ESG heads, and specific committees for health, safety, and prevention of sexual harassment?"
                  value={governanceform.have_formal_governance_structure}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />

               <YesNoNA
                  name="esg_policies_coverage"
                  label="2. Does the company have policies in place for various ESG aspects, such as environment, health, safety, child labor, diversity, employee conduct, human rights, CSR, whistleblowing, anti-bribery, anti-discrimination, anti-money laundering, fair competition, and intellectual property rights?"
                  value={governanceform.esg_policies_coverage}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />

               <YesNoNA
                  name="esg_risk_integration"
                  label="3. Are ESG risks integrated into the company's risk register?"
                  value={governanceform.esg_risk_integration}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />

               <YesNoNA
                  name="company_publish_sustainability_report"
                  label="4. Does your company annually publish a Sustainability report/ESG Report/Integrated report?"
                  value={governanceform.company_publish_sustainability_report}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />

               <YesNoNA
                  name="esg_rating_participated"
                  label="5. Have you participated in ESG/Sustainability ratings like DJSI, CDP, MSCI, Ecovadis, etc.? If Yes, provide the scoring/rating achieved."
                  value={governanceform.esg_rating_participated}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />

               <YesNoNA
                  name="esg_incentive_for_employee"
                  label="6. Does the company provide incentives to employees on achieving ESG targets?"
                  value={governanceform.esg_incentive_for_employee}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />

               <YesNoNA
                  name="csat_survey_conducted"
                  label="7. Do you conduct customer satisfaction survey (CSAT)? If yes, provide the CSAT score."
                  value={governanceform.csat_survey_conducted}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />

               <YesNoNA
                  name="instance_of_loss_customer_data"
                  label="8. Was there any instances involving loss / breach of data of customers? If Yes, provide the number of such incidents."
                  value={governanceform.instance_of_loss_customer_data}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />
               <div className="flex justify-end">
                  <Button
                     className="py-2.5"
                     variant="nextbtn"
                     size="nextbtnsize"
                     onClick={handleSubmit}
                  >
                     Submit
                  </Button>
               </div>
            </div>
         </div>
      </div>
   )
}