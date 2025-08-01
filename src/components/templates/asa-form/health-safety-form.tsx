import YesNoNA from "@/src/components/common/YesNoNAwithFile";
import { Button } from "@/components/ui/button";
import { HealthAndSafety } from "@/src/types/asatypes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Health_And_Safety() {
   const [formData, setFormData] = useState<HealthAndSafety>({
      question1: { selection: "", comment: "", file: null },
      question2: { selection: "", comment: "", file: null },
      question3: { selection: "", comment: "", file: null },
      question4: { selection: "", comment: "", file: null },
      question5: { selection: "", comment: "", file: null },
      question6: { selection: "", comment: "", file: null },
      question7: { selection: "", comment: "", file: null },
   });
   // handlers
   const handleSelectionChange = (name: string, selection: "yes" | "no" | "na") => {
      setFormData((prev) => ({
         ...prev,
         [name]: {
            ...prev[name as keyof HealthAndSafety],
            selection,
         },
      }));
   };

   const handleCommentChange = (name: string, comment: string) => {
      setFormData((prev) => ({
         ...prev,
         [name]: {
            ...prev[name as keyof HealthAndSafety],
            comment,
         },
      }));
   };

   const handleFileChange = (name: string, file: File | null) => {
      setFormData((prev) => ({
         ...prev,
         [name]: {
            ...prev[name as keyof HealthAndSafety],
            file,
         },
      }));
   };

   // routing
   const router = useRouter()
   const employeesatisfaction = () => {
      router.push("/asaform/employeesatisfaction")
   }
   return (
      <>
         <div className="ml-6 mt-3 mr-6">
            <div className="text-xl font-semibold">Health and Safety</div>
            <div className="border-b border-gray-400"></div>
            <div className="mt-6">
               <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  1. Has the company developed health and safety policy and has displayed it at a conspicuous location?
               </label>
               <YesNoNA
                  name="question1"
                  value={formData.question1}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />
               <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  2. Do you have an Occupational Healthy & Safety management (OHS) system?
               </label>
               <YesNoNA
                  name="question2"
                  value={formData.question2}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />
               <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  3. Does the company conduct hazard identification and risk assessment (HIRA) for every activity and for any change in conditions?
               </label>
               <YesNoNA
                  name="question3"
                  value={formData.question3}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />
               <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  4. Is your OHS system certified to ISO 14001 or OHSAS 18001?
               </label>
               <YesNoNA
                  name="question4"
                  value={formData.question4}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />
               <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  5. Are employees regularly trained on health & safety? Also, please mention if behavior-based safety training is provided.
               </label>
               <YesNoNA
                  name="question5"
                  value={formData.question5}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />
               <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  6. Is the company tracking its indicators pertaining to health and safety like fatality, lost time injuries, first aid cases, near misses and maintain records?
               </label>
               <YesNoNA
                  name="question6"
                  value={formData.question6}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />
               <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  7. Does the company provide healthcare services to the employees and workers like Annual Health checkup? If Yes, provide the details.
               </label>
               <YesNoNA
                  name="question7"
                  value={formData.question7}
                  onSelectionChange={handleSelectionChange}
                  onCommentChange={handleCommentChange}
                  onFileChange={handleFileChange}
               />
               <Button className="bg-gray-900 hover:bg-gray-700 mt-3" onClick={employeesatisfaction}>Next</Button>
            </div>
         </div>
      </>
   )
}