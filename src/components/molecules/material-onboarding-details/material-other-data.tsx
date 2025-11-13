// "use client";

// import React, { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Paperclip } from "lucide-react";
// import { Label } from "@/components/ui/label";
// import { UseFormReturn } from "react-hook-form";

// // ------------------ Types ------------------

// interface PriceControlType {
//   name: string;
//   description?: string;
//   do_not_cost?: string;
// }

// interface ValuationProfitType {
//   company: string;
//   valuation_class?: string;
//   valuation_class_description?: string;
//   profit_center?: string;
//   profit_center_description?: string;
// }

// interface MaterialType {
//   name: string;
//   valuation_and_profit?: ValuationProfitType[];
// }

// interface ProfitCenter {
//   name: string;
//   description: string;
// }

// interface ValuationClass {
//   name: string;
//   valuation_class_code: string;
//   valuation_class_name: string;
// }

// interface MaterialDetailsType {
//   material_request_item?: {
//     material_type?: string;
//     company_name?: string;
//   };
//   material_onboarding?: {
//     price_control?: string;
//     hsn_code?: string;
//     do_not_cost?: string;
//     material_information?: string;
//     profit_center?: string;
//     valuation_class?: string;
//   };
// }

// interface MaterialProcurementFormProps {
//   form: UseFormReturn<any>;
//   onSubmit: (values: any) => void;
//   role: string;
//   designationname?: string;
//   MaterialOnboardingDetails?: any;
//   MaterialDetails?: MaterialDetailsType;
//   companyInfo?: any;
//   PriceControl?: PriceControlType[];
//   ValuationClass?: any[];
//   filteredProfit?: any[];
//   handleImageChange: (
//     e: React.ChangeEvent<HTMLInputElement>,
//     field: string
//   ) => void;
//   handleLabelClick: (id: string) => void;
//   handleRemoveFile: (id: string, setFileName: React.Dispatch<React.SetStateAction<string>>) => void;
//   lineItemFiles?: any;
//   fileSelected: boolean;
//   setFileSelected: React.Dispatch<React.SetStateAction<boolean>>;
//   setFileName: React.Dispatch<React.SetStateAction<string>>;
//   fileName: string;
//   AllMaterialType?: MaterialType[];
//   isZCAPMaterial?: boolean;
// }

// // ------------------ Component ------------------

// const MaterialOthersData: React.FC<MaterialProcurementFormProps> = ({
//   form,
//   onSubmit,
//   role,
//   designationname,
//   MaterialOnboardingDetails,
//   MaterialDetails,
//   companyInfo,
//   PriceControl = [],
//   ValuationClass,
//   filteredProfit,
//   handleImageChange,
//   handleLabelClick,
//   handleRemoveFile,
//   lineItemFiles,
//   fileSelected,
//   setFileSelected,
//   setFileName,
//   fileName,
//   AllMaterialType = [],
//   isZCAPMaterial = false,
// }) => {
//   const [filteredProfitCenter, setFilteredProfitCenter] = useState<ProfitCenter[]>([]);
//   const [filteredValuationClass, setFilteredValuationClass] = useState<ValuationClass[]>([]);
//   const [profitcenterSearch, setProfitCenterSearch] = useState<string>("");

//   // ------------------ Effect: Price Control ------------------
//   useEffect(() => {
//     const currentPriceControl = form.getValues("price_control");
//     const matched = PriceControl.find(
//       (item) => item.name === (currentPriceControl || "V")
//     );

//     if (!currentPriceControl && matched) {
//       form.setValue("price_control", matched.name);
//     }

//     if (matched?.do_not_cost !== undefined) {
//       form.setValue("do_not_cost", matched.do_not_cost);
//     } else {
//       form.setValue("do_not_cost", "");
//     }
//   }, [form.watch("price_control"), PriceControl, form]);

//   // ------------------ Effect: Filter Valuation & Profit ------------------
//   useEffect(() => {
//     const materialType = MaterialDetails?.material_request_item?.material_type;
//     const company = MaterialDetails?.material_request_item?.company_name;

//     if (!materialType || !company || !AllMaterialType?.length) return;

//     const matchedType = AllMaterialType.find(
//       (type) => type.name === materialType
//     );

//     if (matchedType && matchedType.valuation_and_profit?.length) {
//       const valuationProfit = matchedType.valuation_and_profit.filter(
//         (item) => item.company === company
//       );
//       const uniqueValuationClasses: ValuationClass[] = [];
//       const uniqueProfits: ProfitCenter[] = [];

//       valuationProfit.forEach((item) => {
//         if (
//           item.valuation_class &&
//           !uniqueValuationClasses.find(
//             (vc) => vc.name === item.valuation_class
//           )
//         ) {
//           uniqueValuationClasses.push({
//             name: item.valuation_class,
//             valuation_class_code: item.valuation_class,
//             valuation_class_name: item.valuation_class_description || "",
//           });
//         }

//         if (
//           item.profit_center &&
//           !uniqueProfits.find((pc) => pc.name === item.profit_center)
//         ) {
//           uniqueProfits.push({
//             name: item.profit_center,
//             description: item.profit_center_description || "",
//           });
//         }
//       });

//       setFilteredValuationClass(uniqueValuationClasses);
//       setFilteredProfitCenter(uniqueProfits);
//     }
//   }, [MaterialDetails, AllMaterialType, form]);

//   const filteredProfitCenterOptions = profitcenterSearch
//     ? filteredProfitCenter.filter((profit) =>
//         profit.name
//           ?.toLowerCase()
//           .includes(profitcenterSearch.toLowerCase())
//       )
//     : filteredProfitCenter;

//   // ------------------ Effect: Prefill from Onboarding ------------------
//   useEffect(() => {
//     const data = MaterialDetails?.material_onboarding;
//     if (!data) return;

//     const fields = [
//       "price_control",
//       "hsn_code",
//       "do_not_cost",
//       "material_information",
//       "profit_center",
//       "valuation_class",
//     ];

//     fields.forEach((field) => {
//       if ((data as any)[field]) {
//         form.setValue(field, (data as any)[field]);
//         if (field === "material_information") {
//           const fileUrl = (data as any)[field];
//           const fileNameFromUrl = fileUrl?.split("/").pop();
//           setFileName(fileNameFromUrl);
//           setFileSelected(true);
//         }
//       }
//     });

//     if (
//       filteredProfitCenter.length &&
//       filteredValuationClass.length &&
//       data.profit_center &&
//       data.valuation_class
//     ) {
//       form.setValue("profit_center", data.profit_center);
//       form.setValue("valuation_class", data.valuation_class);
//     }
//   }, [MaterialDetails, filteredProfitCenter, filteredValuationClass, form]);

//   // ------------------ Render ------------------
//   return (
//     <div className="bg-[#F4F4F6]">
//       <div className="flex flex-col justify-between pt-4 bg-white rounded-[8px]">
//         <div className="space-y-1">
//           <div className="text-[20px] font-semibold leading-[24px] text-[#03111F] border-b border-slate-500 pb-1">
//             Others Data
//           </div>

//           <div className="grid grid-cols-3 gap-4">
//             {/* Profit Center */}
//             <div className="space-y-2">
//               <FormField
//                 control={form.control}
//                 name="profit_center"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>
//                       Profit Center <span className="text-red-500">*</span>
//                     </FormLabel>
//                     <FormControl>
//                       <Select
//                         onValueChange={(val) => {
//                           field.onChange(val);
//                           setProfitCenterSearch("");
//                         }}
//                         value={field.value || ""}
//                         disabled={isZCAPMaterial}
//                       >
//                         <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
//                           <SelectValue placeholder="Select Profit Center" />
//                         </SelectTrigger>
//                         <SelectContent className="max-h-60 overflow-y-auto">
//                           <div className="px-2 py-1">
//                             <input
//                               type="text"
//                               value={profitcenterSearch}
//                               onChange={(e) => setProfitCenterSearch(e.target.value)}
//                               onKeyDown={(e) => {
//                                 if (
//                                   !["ArrowDown", "ArrowUp", "Enter"].includes(e.key)
//                                 ) {
//                                   e.stopPropagation();
//                                 }
//                               }}
//                               placeholder="Search Division..."
//                               className="w-full p-2 border border-gray-300 rounded text-sm"
//                             />
//                           </div>
//                           {filteredProfitCenterOptions?.length > 0 ? (
//                             filteredProfitCenterOptions.map((profit) => (
//                               <SelectItem key={profit.name} value={profit.name}>
//                                 {profit.name}
//                               </SelectItem>
//                             ))
//                           ) : (
//                             <div className="px-3 py-2 text-sm text-gray-500">
//                               No matching profit center found
//                             </div>
//                           )}
//                         </SelectContent>
//                       </Select>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {!isZCAPMaterial && (
//               <>
//                 {/* Valuation Class */}
//                 <div className="space-y-2">
//                   <FormField
//                     control={form.control}
//                     name="valuation_class"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           Valuation Class <span className="text-red-500">*</span>
//                         </FormLabel>
//                         <FormControl>
//                           <Select
//                             onValueChange={field.onChange}
//                             value={field.value || undefined}
//                           >
//                             <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
//                               <SelectValue placeholder="Select Valuation Class" />
//                             </SelectTrigger>
//                             <SelectContent className="max-h-60 overflow-y-auto">
//                               {filteredValuationClass.map((vclass) => (
//                                 <SelectItem key={vclass.name} value={vclass.name}>
//                                   {vclass.valuation_class_code} - {vclass.valuation_class_name}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 {/* Price Control */}
//                 <div className="space-y-2">
//                   <FormField
//                     control={form.control}
//                     name="price_control"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           Price Control <span className="text-red-500">*</span>
//                         </FormLabel>
//                         <FormControl>
//                           <Select
//                             onValueChange={field.onChange}
//                             value={field.value || undefined}
//                           >
//                             <SelectTrigger className="p-3 w-full text-sm data-[placeholder]:text-gray-500">
//                               <SelectValue placeholder="Select Price Control" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {PriceControl.map((price) => (
//                                 <SelectItem key={price.name} value={price.name}>
//                                   {price.name} - {price.description}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 {/* HSN Code */}
//                 <div className="space-y-2">
//                   <FormField
//                     control={form.control}
//                     name="hsn_code"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>HSN Code</FormLabel>
//                         <FormControl>
//                           <Input
//                             {...field}
//                             type="text"
//                             maxLength={8}
//                             inputMode="numeric"
//                             pattern="\d{8}"
//                             className="p-3 w-full text-sm placeholder:text-gray-500"
//                             placeholder="Enter HSN Code"
//                             onChange={(e) => {
//                               const formattedValue = e.target.value
//                                 .toLowerCase()
//                                 .replace(/\b\w/g, (char) =>
//                                   char.toUpperCase()
//                                 );
//                               field.onChange(formattedValue);
//                             }}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 {/* Do Not Cost */}
//                 <div className="space-y-2">
//                   <FormField
//                     control={form.control}
//                     name="do_not_cost"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Do Not Cost</FormLabel>
//                         <FormControl>
//                           <Input
//                             {...field}
//                             readOnly
//                             className="p-3 w-full text-sm placeholder:text-gray-500"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 {(role === "CP" || role === "Store") && (
//                   <div className="col-span-1 space-y-[5px]">
//                     <Label htmlFor="fileinput">
//                       Upload Material Information File
//                     </Label>
//                     <div className="border-2 border-dashed border-gray-400 rounded-lg">
//                       <div className="items-center">
//                         <div className="flex items-center justify-between gap-4 mt-1 px-2 py-2">
//                           <input
//                             type="file"
//                             id="fileinput"
//                             name="material_information"
//                             key="material_information"
//                             className="hidden"
//                             onChange={(event) =>
//                               handleImageChange(event, "material_information")
//                             }
//                           />
//                           <div className="flex items-center gap-2">
//                             {!fileSelected && (
//                               <Paperclip
//                                 size={18}
//                                 className="cursor-pointer text-blue-600 hover:text-blue-800"
//                                 onClick={() => handleLabelClick("fileinput")}
//                               />
//                             )}

//                             {!fileSelected ? (
//                               <span className="text-sm text-gray-500">
//                                 No file selected
//                               </span>
//                             ) : (
//                               <>
//                                 <a
//                                   href={`${process.env.NEXT_PUBLIC_BASE_URL}${form.getValues(
//                                     "material_information"
//                                   )}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="text-sm text-blue-600 underline"
//                                 >
//                                   {fileName}
//                                 </a>
//                                 <Button
//                                   type="button"
//                                   variant="ghost"
//                                   className="text-red-500 font-bold p-0 h-auto"
//                                   onClick={() =>
//                                     handleRemoveFile("fileinput", setFileName)
//                                   }
//                                 >
//                                   ✕
//                                 </Button>
//                               </>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MaterialOthersData;
