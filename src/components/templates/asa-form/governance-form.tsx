import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button"
import { Governance } from "@/src/types/asatypes";
import { useState } from "react";

export default function GovernanceForm() {
   const [formData, setFormData] = useState<Governance>({
      question1: { selection: "", comment: "", file: null },
      question2: { selection: "", comment: "", file: null },
      question3: { selection: "", comment: "", file: null },
      question4: { selection: "", comment: "", file: null },
      question5: { selection: "", comment: "", file: null },
      question6: { selection: "", comment: "", file: null },
      question7: { selection: "", comment: "", file: null },
      question8: { selection: "", comment: "", file: null },
   });
   // handlers
   const handleSelectionChange = (name: string, selection: "yes" | "no" | "na") => {
      setFormData((prev) => ({
         ...prev,
         [name]: {
            ...prev[name as keyof Governance],
            selection,
         },
      }));
   };

   const handleCommentChange = (name: string, comment: string) => {
      setFormData((prev) => ({
         ...prev,
         [name]: {
            ...prev[name as keyof Governance],
            comment,
         },
      }));
   };

   const handleFileChange = (name: string, file: File | null) => {
      setFormData((prev) => ({
         ...prev,
         [name]: {
            ...prev[name as keyof Governance],
            file,
         },
      }));
   };


   return (
      <>
         <div className="ml-6 mt-3 mr-6">
            <div className="text-xl font-semibold">Governance</div>
            <div className="border-b border-gray-400"></div>
            <div className="mt-6">
               <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  1. Does the company have a formal governance structure in place to oversee ESG matters, including roles like Board-level committees, ESG heads, and specific committees for health, safety, and prevention of sexual harassment?
               </label>
               <YesNoNA
                  name="question1"
                  value={formData.question1}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />
               <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  2. Does the company have policies in place for various ESG aspects, such as environment, health, safety, child labor, diversity, employee conduct, human rights, CSR, whistleblowing, anti-bribery, anti-discrimination, anti-money laundering, fair competition, and intellectual property rights?
               </label>
               <YesNoNA
                  name="question2"
                  value={formData.question2}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />
               <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  3. Are ESG risks integrated into the company's risk register?
               </label>
               <YesNoNA
                  name="question3"
                  value={formData.question3}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />
               <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  4. Does your company annually publish a Sustainability report/ESG Report/Integrated report?
               </label>
               <YesNoNA
                  name="question4"
                  value={formData.question4}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />
               <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  5. Have you participated in ESG/Sustainability ratings like DJSI, CDP, MSCI, Ecovadis, etc.? If Yes, provide the scoring/rating achieved.
               </label>
               <YesNoNA
                  name="question5"
                  value={formData.question5}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />
               <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  6. Does the company provide incentives to employees on achieving ESG targets?
               </label>
               <YesNoNA
                  name="question6"
                  value={formData.question6}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />
               <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  7. Do you conduct customer satisfaction survey (CSAT)? If yes, provide the CSAT score.
               </label>
               <YesNoNA
                  name="question7"
                  value={formData.question7}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />
               <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  8. Was there any instances involving loss / breach of data of customers? If Yes, provide the number of such incidents.
               </label>
               <YesNoNA
                  name="question8"
                  value={formData.question8}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />
               <Button className="bg-gray-900 hover:bg-gray-700 mt-3">Submit</Button>
            </div>
         </div>
      </>
   )
}