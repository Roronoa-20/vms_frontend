import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button"
import { Governance } from "@/src/types/asatypes";
import { useState } from "react";
import { useASAForm } from "@/src/hooks/useASAForm";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import requestWrapper from "@/src/services/apiCall";
import { CheckCircle } from "lucide-react";
import API_END_POINTS from "@/src/services/apiEndPoints";

export default function GovernanceForm() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const vmsRefNo = searchParams.get("vms_ref_no") || "";
   const { governanceform, updateGovernanceForm, ASAformName, asaFormSubmitData } = useASAForm();
   const [showRevertBox, setShowRevertBox] = useState(false);
   const [revertComment, setRevertComment] = useState("");
   const [showVerifySuccess, setShowVerifySuccess] = useState(false);
   
   console.log("Governance web Form Data:", governanceform);

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

   const handleRevert = () => {
      router.push(`/view-asa-form?tabtype=employee_satisfaction&vms_ref_no=${vmsRefNo}`);
   };

   const VerifyASAForm = async (asaFormName: string) => {
      try {
         const response = await requestWrapper({
            url: `${API_END_POINTS.verifyasaform}?asa_name=${asaFormName}`,
            method: "POST",
         });
         if (response?.data?.message?.status === "success") {
            setShowVerifySuccess(true);
         }
         return response?.data || null;
      } catch (error) {
         console.error("VerifyASAForm error:", error);
         return null;
      }
   };

   const RevertASAForm = async (asaFormName: string, comment: string) => {
      try {
         const response = await requestWrapper({
            url: API_END_POINTS.revertasaform,
            method: "POST",
            data: {
               data: {
                  asa_name: asaFormName,
                  reason_of_revert: comment,
               },
            },
         });

         if (response?.data?.message?.status === "success") {
            router.push("/dashboard");
         }

         return response?.data || null;
      } catch (error) {
         console.error("RevertASAForm error:", error);
         return null;
      }
   };

   const handleNext = async () => {
      const res = await VerifyASAForm(ASAformName);
      console.log("verify result:", res);
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
                  helperText="If Yes, attach the governing structure and committee details."
                  value={governanceform.have_formal_governance_structure}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  disabled={true}
                  fileRequired={true}
                  options={["Yes", "No"]}

               />

               <YesNoNA
                  name="esg_policies_coverage"
                  helperText="If Yes, attach the copy of the policies."
                  label="2. Does the company have policies in place for various ESG aspects, such as environment, health, safety, child labor, diversity, employee conduct, human rights, CSR, whistleblowing, anti-bribery, anti-discrimination, anti-money laundering, fair competition, and intellectual property rights?"
                  value={governanceform.esg_policies_coverage}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  options={["Yes", "No"]}
                  fileRequired={true}
                  disabled={true}
               />

               <YesNoNA
                  name="esg_risk_integration"
                  label="3. Are ESG risks integrated into the company's risk register?"
                  helperText="If Yes, attach the company ris register or th list of the risks identified."
                  value={governanceform.esg_risk_integration}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  options={["Yes", "No"]}
                  fileRequired={true}
                  disabled={true}
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
                  disabled={true}
               />

               <YesNoNA
                  name="esg_rating_participated"
                  label="5. Have you participated in ESG/Sustainability ratings like DJSI, CDP, MSCI, Ecovadis, etc.? If Yes, provide the scoring/rating achieved."
                  helperText="If Yes, specify the scoring/ratings received."
                  value={governanceform.esg_rating_participated}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  options={["Yes", "No"]}
                  disabled={true}

               />

               <YesNoNA
                  name="esg_incentive_for_employee"
                  label="6. Does the company provide incentives to employees on achieving ESG targets?"
                  helperText="If yes, provide the details of the incentives provided to the employees."
                  value={governanceform.esg_incentive_for_employee}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  options={["Yes", "No"]}
                  disabled={true}
               />

               <YesNoNA
                  name="csat_survey_conducted"
                  helperText="If Yes, provide the CSAT score, and provide the details of the parameters covered in the customer satisfaction survey."
                  label="7. Do you conduct customer satisfaction survey (CSAT)? If yes, provide the CSAT score."
                  value={governanceform.csat_survey_conducted}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
                  required={true}
                  options={["Yes", "No"]}
                  disabled={true}
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
                  disabled={true}
               />

               {asaFormSubmitData.verify_by_asa_team !== 1 && (
                  <div className="space-x-4 flex justify-end">
                     <Button
                        className="py-2.5"
                        variant="backbtn"
                        size="backbtnsize"
                        onClick={() => setShowRevertBox(true)}
                     >
                        Revert
                     </Button>
                     <Button
                        className="py-2.5"
                        variant="nextbtn"
                        size="nextbtnsize"
                        onClick={handleNext}
                     >
                        Verify
                     </Button>
                  </div>
               )}
            </div>

            {showVerifySuccess && (
               <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4 text-center">

                     <div className="flex flex-col items-center gap-3">
                        <CheckCircle className="w-14 h-14 text-green-600" />

                        <div className="text-xl font-semibold text-green-700">
                           Verified Successfully
                        </div>
                     </div>

                     <div className="text-sm text-gray-600">
                        The ASA form has been verified successfully.
                     </div>

                     <div className="flex justify-center">
                        <Button
                           className="py-2.5"
                           variant="nextbtn"
                           size="nextbtnsize"
                           onClick={() => {
                              setShowVerifySuccess(false);
                              router.push("/dashboard");
                           }}
                        >
                           OK
                        </Button>
                     </div>

                  </div>
               </div>
            )}

            {showRevertBox && (
               <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 space-y-4">

                     <div className="text-lg font-semibold text-gray-800">
                        Revert Reason
                     </div>

                     <textarea
                        className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                        rows={4}
                        placeholder="Tell us why you're reverting this form..."
                        value={revertComment}
                        onChange={(e) => setRevertComment(e.target.value)}
                     />

                     <div className="flex justify-end gap-3">
                        <Button
                           className="py-2.5"
                           variant="backbtn"
                           size="backbtnsize"
                           onClick={() => {
                              setShowRevertBox(false);
                              setRevertComment("");
                           }}
                        >
                           Cancel
                        </Button>

                        <Button
                           className="py-2.5"
                           variant="nextbtn"
                           size="nextbtnsize"
                           disabled={!revertComment.trim()}
                           onClick={async () => {
                              await RevertASAForm(ASAformName, revertComment);
                              setShowRevertBox(false);
                              setRevertComment("");
                           }}
                        >
                           Revert
                        </Button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   )
}