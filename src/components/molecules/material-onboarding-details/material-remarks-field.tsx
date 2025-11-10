// import React, { useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { Control, UseFormReturn } from "react-hook-form";

// interface MaterialOnboardingData {
//     comment_by_store?: string;
// }

// interface MaterialRequestItem {
//     comment_user?: string;
// }

// interface MaterialDetailsType {
//     material_onboarding?: MaterialOnboardingData;
//     material_request_item?: MaterialRequestItem;
// }

// interface MaterialRemarksFormProps {
//     form: UseFormReturn<any>; // You can replace `any` with a proper form type interface later
//     MaterialDetails?: MaterialDetailsType;
// }

// const MaterialRemarksForm: React.FC<MaterialRemarksFormProps> = ({
//     form,
//     MaterialDetails,
// }) => {
//     useEffect(() => {
//         const onboardingData = MaterialDetails?.material_onboarding;
//         const requestItem = MaterialDetails?.material_request_item;

//         if (onboardingData) {
//             const fields: (keyof MaterialOnboardingData)[] = ["comment_by_store"];

//             fields.forEach((field) => {
//                 if (onboardingData[field]) {
//                     form.setValue(field, onboardingData[field]);
//                 }
//             });
//         }

//         if (requestItem?.comment_user) {
//             form.setValue("comment_by_user", requestItem.comment_user);
//         }
//     }, [MaterialDetails, form]);

//     return (
//         <div className="bg-[#F4F4F6]">
//             <div className="flex flex-col justify-between pt-4 bg-white rounded-[8px]">
//                 <div className="space-y-1">
//                     <div className="text-[20px] font-semibold leading-[24px] text-[#03111F] border-b border-slate-500 pb-1">
//                         Comments
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                         {/* User Comment Field */}
//                         <div className="space-y-2">
//                             <FormField
//                                 control={form.control}
//                                 name="comment_by_user"
//                                 rules={{
//                                     required:
//                                         "Comment is required when material is selected.",
//                                 }}
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>
//                                             User Comment{" "}
//                                             <span className="text-red-500">*</span>
//                                         </FormLabel>
//                                         <FormControl>
//                                             <textarea
//                                                 {...field}
//                                                 rows={2}
//                                                 className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded-md placeholder:text-gray-400 hover:border-blue-400 focus:border-blue-400 focus:outline-none"
//                                                 placeholder="Provide a reason for selecting this material"
//                                                 readOnly
//                                             />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>

//                         {/* Store Comment Field */}
//                         <div className="space-y-2">
//                             <FormField
//                                 control={form.control}
//                                 name="comment_by_store"
//                                 rules={{
//                                     required:
//                                         "Store Comment is required when material is selected.",
//                                 }}
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>
//                                             Store Comment{" "}
//                                             <span className="text-red-500">*</span>
//                                         </FormLabel>
//                                         <FormControl>
//                                             <textarea
//                                                 {...field}
//                                                 rows={2}
//                                                 className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded-md placeholder:text-gray-400 hover:border-blue-400 focus:border-blue-400 focus:outline-none"
//                                                 placeholder="Provide a reason for selecting this material"
//                                             />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MaterialRemarksForm;