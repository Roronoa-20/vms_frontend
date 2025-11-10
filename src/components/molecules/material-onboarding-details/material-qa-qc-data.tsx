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
// import { UseFormReturn } from "react-hook-form";

// interface ExpirationDateOption {
//     name: string;
//     description: string;
// }

// interface MaterialOnboardingData {
//     minimum_remaining_shell_life?: string;
//     total_shell_life?: string;
//     expiration_date?: string;
//     inspection_require?: string;
//     inspection_interval?: string;
//     incoming_inspection_01?: boolean;
//     incoming_inspection_09?: boolean;
// }

// interface MaterialDetailsType {
//     material_onboarding?: MaterialOnboardingData;
// }

// interface MaterialQAQCFormProps {
//     form: UseFormReturn<any>; // you can replace `any` with your actual form schema type
//     InspectionType?: string[];
//     AllMaterialType?: string[];
//     ExpirationDate?: ExpirationDateOption[];
//     MaterialDetails?: MaterialDetailsType;
// }

// const MaterialQAQCForm: React.FC<MaterialQAQCFormProps> = ({
//     form,
//     InspectionType,
//     AllMaterialType,
//     ExpirationDate,
//     MaterialDetails,
// }) => {
//     const inspectionRequire = form.watch("inspection_require");

//     // Set default value for inspection_require
//     useEffect(() => {
//         const currentValue = form.getValues("inspection_require");
//         if (!currentValue) {
//             form.setValue("inspection_require", "No");
//         }
//     }, [form]);

//     // Populate fields if MaterialDetails exist
//     useEffect(() => {
//         const data = MaterialDetails?.material_onboarding;
//         if (!data) return;

//         const fields: (keyof MaterialOnboardingData)[] = [
//             "minimum_remaining_shell_life",
//             "total_shell_life",
//             "expiration_date",
//             "inspection_require",
//             "inspection_interval",
//             "incoming_inspection_01",
//             "incoming_inspection_09",
//         ];

//         fields.forEach((field) => {
//             if (data[field] !== undefined && data[field] !== null) {
//                 form.setValue(field, data[field]);
//             }
//         });
//     }, [MaterialDetails, form]);

//     return (
//         <div className="bg-[#F4F4F6]">
//             <div className="flex flex-col justify-between pt-4 bg-white rounded-[8px]">
//                 <div className="space-y-1">
//                     <div className="text-[20px] font-semibold leading-[24px] text-[#03111F] border-b border-slate-500 pb-1">
//                         QA/QC Data
//                     </div>
//                     <div className="grid grid-cols-3 gap-4">
//                         {/* Minimum Remaining Shelf Life */}
//                         <FormField
//                             control={form.control}
//                             name="minimum_remaining_shell_life"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Minimum Remaining Shell Life</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             {...field}
//                                             className="p-3 w-full text-sm placeholder:text-gray-400"
//                                             placeholder="Enter minimum remaining shell life"
//                                             onChange={field.onChange}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         {/* Total Shelf Life */}
//                         <FormField
//                             control={form.control}
//                             name="total_shell_life"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Total Shelf Life</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             {...field}
//                                             className="p-3 w-full text-sm placeholder:text-gray-400"
//                                             placeholder="Enter total shelf life"
//                                             onChange={field.onChange}
//                                         />
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         {/* Expiration Date */}
//                         <FormField
//                             control={form.control}
//                             name="expiration_date"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Period Indicator for Shelf Life Expiration Date</FormLabel>
//                                     <FormControl>
//                                         <Select
//                                             onValueChange={field.onChange}
//                                             value={field.value || ""}
//                                         >
//                                             <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
//                                                 <SelectValue placeholder="Select Expiration Date Type" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {ExpirationDate?.map((exp) => (
//                                                     <SelectItem key={exp.name} value={exp.name}>
//                                                         {exp.description}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </FormControl>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />

//                         {/* Inspection Require */}
//                         <div className="col-span-3 grid grid-cols-3 gap-4">
//                             <FormField
//                                 control={form.control}
//                                 name="inspection_require"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Inspection Require</FormLabel>
//                                         <FormControl>
//                                             <Select
//                                                 onValueChange={field.onChange}
//                                                 value={field.value || "No"}
//                                             >
//                                                 <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
//                                                     <SelectValue placeholder="Select Yes or No" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     <SelectItem value="Yes">Yes</SelectItem>
//                                                     <SelectItem value="No">No</SelectItem>
//                                                 </SelectContent>
//                                             </Select>
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             {/* Conditionally Render QA Fields */}
//                             {inspectionRequire === "Yes" && (
//                                 <>
//                                     <div className="grid grid-cols-2 gap-4 mt-[36.8px]">
//                                         <FormField
//                                             control={form.control}
//                                             name="incoming_inspection_01"
//                                             render={({ field }) => (
//                                                 <FormItem>
//                                                     <div className="flex items-center gap-2">
//                                                         <FormControl>
//                                                             <input
//                                                                 type="checkbox"
//                                                                 className="w-4 h-4 accent-blue-600"
//                                                                 checked={field.value || false}
//                                                                 onChange={(e) => field.onChange(e.target.checked)}
//                                                             />
//                                                         </FormControl>
//                                                         <FormLabel className="text-[16px] m-0">
//                                                             Incoming Inspection 01
//                                                         </FormLabel>
//                                                     </div>
//                                                 </FormItem>
//                                             )}
//                                         />

//                                         <FormField
//                                             control={form.control}
//                                             name="incoming_inspection_09"
//                                             render={({ field }) => (
//                                                 <FormItem>
//                                                     <div className="flex items-center gap-2">
//                                                         <FormControl>
//                                                             <input
//                                                                 type="checkbox"
//                                                                 className="w-4 h-4 accent-blue-600"
//                                                                 checked={field.value || false}
//                                                                 onChange={(e) => field.onChange(e.target.checked)}
//                                                             />
//                                                         </FormControl>
//                                                         <FormLabel className="text-[16px] m-0">
//                                                             Incoming Inspection 09
//                                                         </FormLabel>
//                                                     </div>
//                                                 </FormItem>
//                                             )}
//                                         />
//                                     </div>

//                                     {/* Inspection Interval */}
//                                     <FormField
//                                         control={form.control}
//                                         name="inspection_interval"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>Inspection Interval (In Days)</FormLabel>
//                                                 <FormControl>
//                                                     <Input
//                                                         {...field}
//                                                         type="number"
//                                                         className="p-3 w-full text-sm placeholder:text-gray-400"
//                                                         placeholder="Enter Inspection interval in days"
//                                                         onChange={field.onChange}
//                                                     />
//                                                 </FormControl>
//                                                 <FormMessage />
//                                             </FormItem>
//                                         )}
//                                     />
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MaterialQAQCForm;