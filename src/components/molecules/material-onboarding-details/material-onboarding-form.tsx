// "use client";

// import React, { useEffect, useState } from "react";
// import { UseFormReturn } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { Form } from "@/components/ui/form";
// import { Save } from "lucide-react";
// import Alertbox from "@/src/components/common/vendor-onboarding-alertbox";
// import { useAuth } from "@/src/context/AuthContext";

// import MaterialInformation from "@/src/components/molecules/material-onboarding-details/material-information";
// import MaterialSpecifications from "@/src/components/molecules/material-onboarding-details/material-specifications";
// import MaterialOnboardingApproval from "@/src/components/molecules/material-onboarding-details/material-approval";
// import MaterialPurchasingData from "@/src/components/molecules/material-onboarding-details/material-purchasing-data";
// import RequesterDetails from "@/src/components/molecules/material-onboarding-details/requester-details";
// import MaterialComment from "@/src/components/molecules/material-onboarding-details/material-remarks-field";
// import MaterialMRPData from "@/src/components/molecules/material-onboarding-details/material-mrp-data";
// import MaterialQAQCData from "@/src/components/molecules/material-onboarding-details/material-qa-qc-data";
// import MaterialOtherData from "@/src/components/molecules/material-onboarding-details/material-other-data";
// import SAPMaterialModal from "@/src/components/molecules/material-onboarding-modal/SAPMaterialModal";
// import RevertRemarkModal from "@/src/components/molecules/material-onboarding-modal/revert-remark-field";
// import { MaterialRegistrationFormData, EmployeeDetail, Company, Plant, division, industry, ClassType, UOMMaster, MRPType, ValuationClass, procurementType, ValuationCategory, MaterialGroupMaster, MaterialCategory, ProfitCenter, AvailabilityCheck, PriceControl, MRPController, StorageLocation, InspectionType, SerialNumber, LotSize, SchedulingMarginKey, ExpirationDate } from "@/src/types/MaterialCodeRequestFormTypes";

// interface FileRecord {
//   file: File;
//   fileURL: string;
// }

// interface MaterialOnboardingFormProps {
//   form: UseFormReturn<MaterialRegistrationFormData>;
//   onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
//   isLoading?: boolean;
//   showAlert?: boolean;
//   showcompletealert?: boolean;
//   showRevertAlert?: boolean;
//   companyName?: Company[];
//   plantcode?: Plant[];
//   EmployeeDetailsJSON?: EmployeeDetail;
//   DivisionDetails?: division[];
//   IndustryDetails?: industry[];
//   UnitOfMeasure?: UOMMaster[];
//   MRPType?: MRPType[];
//   ValuationClass?: ValuationClass[];
//   ProcurementType?: procurementType[];
//   ValuationCategory?: ValuationCategory[];
//   MaterialGroup?: MaterialGroupMaster[];
//   MaterialOnboardingDetails?: MaterialRegistrationFormData;
//   lineItemFiles?: Record<string, FileRecord>;
//   setLineItemFiles?: React.Dispatch<React.SetStateAction<Record<string, FileRecord>>>;
//   setHsnStatus?: (val: boolean) => void;
//   hsnStatus?: boolean;
//   companyInfo?: any;
//   ProfitCenter?: ProfitCenter[];
//   PriceControl?: PriceControl[];
//   AvailabilityCheck?: AvailabilityCheck[];
//   MRPController?: MRPController[];
//   StorageLocation?: StorageLocation[];
//   ClassType?: ClassType[];
//   PurchaseGroup?: any;
//   SerialProfile?: SerialNumber[];
//   InspectionType?: InspectionType[];
//   LotSize?: LotSize[];
//   materialCompanyCode?: string;
//   setMaterialCompanyCode?: (code: string) => void;
//   MaterialCategory?: MaterialCategory[];
//   SMK?: SchedulingMarginKey[];
//   ExpirationDate?: ExpirationDate[];
//   doc_name?: string;
//   sendEmailToUser?: (doc: string) => Promise<void>;
//   sendRevertEmail?: (doc: string, remark: string) => Promise<void>;
//   onCloseCallback?: (doc: string) => void;
//   saveAsDraft?: () => void;
// }

// const MaterialOnboardingForm: React.FC<MaterialOnboardingFormProps> = (props) => {
//   const { form, onSubmit, isLoading, MaterialOnboardingDetails, companyInfo, ProfitCenter = [], MaterialGroup, setLineItemFiles, lineItemFiles, sendRevertEmail, doc_name, saveAsDraft, onCloseCallback, showAlert, showcompletealert, showRevertAlert, EmployeeDetailsJSON } = props;

//   const router = useRouter();

//   const [fileSelected, setFileSelected] = useState(false);
//   const [fileName, setFileName] = useState("");
//   const [filteredProfit, setFilteredProfit] = useState<ProfitCenter[]>([]);
//   const [showSAPModal, setShowSAPModal] = useState(false);
//   const [isMaterialCodeEdited, setIsMaterialCodeEdited] = useState(false);
//   const [shouldShowAllFields, setShouldShowAllFields] = useState(false);
//   const [isMatchedMaterial, setIsMatchedMaterial] = useState(false);
//   const [showRemarkDialog, setShowRemarkDialog] = useState(false);
//   const { designation } = useAuth();
//   const role = designation || "";

//   useEffect(() => {
//     const currentDate = new Date().toISOString().split("T")[0];
//     if (!form.getValues("request_date")) {
//       form.setValue("request_date", currentDate);
//     }
//   }, [form]);

//   useEffect(() => {
//     if (MaterialOnboardingDetails?.approval_status === "Code Generated by SAP") {
//       setShowSAPModal(true);
//     }
//   }, [MaterialOnboardingDetails]);


//   useEffect(() => {
//     if (
//       !EmployeeDetailsJSON?.company ||
//       !Array.isArray(EmployeeDetailsJSON.company) ||
//       !ProfitCenter?.length
//     ) {
//       if (filteredProfit.length > 0) {
//         setFilteredProfit([]);
//       }
//       return;
//     }

//     const employeeCompanyCodes = EmployeeDetailsJSON.company
//       .map((comp) => String(comp.company_code))
//       .filter(Boolean);

//     const newFilteredProfit = ProfitCenter.filter((pc) =>
//       employeeCompanyCodes.includes(String(pc.company_code))
//     );

//     const hasChanged =
//       newFilteredProfit.length !== filteredProfit.length ||
//       newFilteredProfit.some(
//         (pc, i) =>
//           pc.profit_center_code !== filteredProfit[i]?.profit_center_code ||
//           pc.profit_center_name !== filteredProfit[i]?.profit_center_name
//       );

//     if (hasChanged) {
//       console.log("🔄 Updating filteredProfit:", newFilteredProfit);
//       setFilteredProfit(newFilteredProfit);
//     } else {
//       console.log("✅ Skipped update — filteredProfit unchanged");
//     }
//   }, [EmployeeDetailsJSON, ProfitCenter]);



//   const onCancel = (e: React.MouseEvent) => {
//     e.preventDefault();
//     router.push("/material-onboarding-table");
//     window.location.reload();
//   };

//   const handleLabelClick = (inputId: string) => {
//     document.getElementById(inputId)?.click();
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
//     const file = e.target.files?.[0];
//     if (file && setLineItemFiles) {
//       const fileURL = URL.createObjectURL(file);
//       setLineItemFiles((prev) => ({
//         ...prev,
//         [key]: { file, fileURL },
//       }));
//       setFileSelected(true);
//       setFileName(file.name);
//     }
//   };

//   const handleRemoveFile = (inputId: string, clearFileNameFn: (v: string) => void) => {
//     if (!setLineItemFiles) return;
//     setLineItemFiles((prev) => {
//       const updated = { ...prev };
//       delete updated["material_information"];
//       return updated;
//     });
//     clearFileNameFn("");
//     setFileSelected(false);
//     const input = document.getElementById(inputId) as HTMLInputElement;
//     if (input) input.value = "";
//   };

//   const getButtonLabel = (role: string, approvalStatus?: string): string => {
//     if (["Material CP", "Store"].includes(role)) {
//       if (approvalStatus === "Pending by CP" || approvalStatus === "Re-Opened by CP")
//         return "Send to SAP";
//       if (approvalStatus === "Sent to SAP") return "Update";
//     }
//     if (role === "SAP") return "Close";
//     return "Submit";
//   };

//   const handleApprovalStatus = async () => {
//     if (role === "SAP") {
//       form.setValue("approval_status", "Code Generated by SAP");
//     } else if (
//       ["CP", "Store"].includes(role) &&
//       MaterialOnboardingDetails?.approval_status === "Sent to SAP"
//     ) {
//       form.setValue("approval_status", "Updated By CP");
//     } else if (
//       ["CP", "Store"].includes(role) &&
//       MaterialOnboardingDetails?.approval_status === "Pending by SAP"
//     ) {
//       form.setValue("approval_status", "Sent to SAP");
//     }
//   };

//   const handleRejectStatus = (remark: string) => {
//     if (["Material CP", "Store"].includes(role)) {
//       form.setValue("approval_status", "Re-Opened by CP");
//       form.setValue("remark_by_cp", remark);
//     }
//   };

//   const approvalStatus = MaterialOnboardingDetails?.approval_status;
//   const isSAPLockedStatus = [
//     "Sent to SAP",
//     "Code Generated by SAP",
//     "Pending by CP",
//     "Updated by CP",
//     "Re-Opened by CP",
//   ].includes(approvalStatus);

//   const materialType = MaterialOnboardingDetails?.material_type_name;
//   const isZCAPMaterial = materialType === "ZCAP";

//   return (
//     <Form {...form}>
//       <form onSubmit={onSubmit}>
//         <div className="bg-[#F4F4F6]">
//           <div className="space-y-[32px] flex flex-col justify-between p-3 bg-white rounded-[8px]">
//             {/* === SAP MODAL === */}
//             {/* <SAPMaterialModal
//               isOpen={showSAPModal}
//               onClose={() => setShowSAPModal(false)}
//               materialCode={MaterialCode || ""}
//               materialDescription={
//                 MaterialOnboardingDetails?.material_name_description || ""
//               }
//               isZCAPMaterial={isZCAPMaterial}
//             /> */}

//             {/* === SECTIONS === */}
//             <RequesterDetails MaterialOnboardingDetails={MaterialOnboardingDetails} form={form} />

//             {/* <MaterialInformation
//               {...props}
//               setShouldShowAllFields={setShouldShowAllFields}
//               shouldShowAllFields={shouldShowAllFields}
//               isMaterialCodeEdited={isMaterialCodeEdited}
//               setIsMaterialCodeEdited={setIsMaterialCodeEdited}
//               setIsMatchedMaterial={setIsMatchedMaterial}
//               isZCAPMaterial={isZCAPMaterial}
//             />

//             {shouldShowAllFields && (
//               <>
//                 {["CP", "Store"].includes(role) && (
//                   <>
//                     <MaterialPurchasingData {...props} role={role} />

//                     <MaterialMRPData {...props} role={role} isZCAPMaterial={isZCAPMaterial} />

//                     {!isZCAPMaterial && (
//                       <MaterialQAQCData {...props} role={role} isZCAPMaterial={isZCAPMaterial} />
//                     )}

//                     <MaterialSpecifications {...props} role={role} isZCAPMaterial={isZCAPMaterial} />

//                     <MaterialOtherData
//                       {...props}
//                       filteredProfit={filteredProfit}
//                       setFilteredProfit={setFilteredProfit}
//                       fileSelected={fileSelected}
//                       setFileSelected={setFileSelected}
//                       fileName={fileName}
//                       setFileName={setFileName}
//                       handleLabelClick={handleLabelClick}
//                       handleImageChange={handleImageChange}
//                       handleRemoveFile={handleRemoveFile}
//                       isZCAPMaterial={isZCAPMaterial}
//                     />
//                     <MaterialComment {...props} />
//                     <MaterialOnboardingApproval {...props} />
//                   </>
//                 )}
//               </>
//             )} */}

//             {/* === FOOTER BUTTONS === */}
//             <div className="flex justify-between items-center w-full mt-4">
//               {role === "User" && isSAPLockedStatus ? (
//                 <div className="flex justify-end w-full">
//                   <Button variant="backbtn" size="backbtnsize" onClick={onCancel} type="button">
//                     Back to Home
//                   </Button>
//                 </div>
//               ) : isMatchedMaterial ? (
//                 <>
//                   <Button variant="backbtn" size="backbtnsize" onClick={onCancel} type="button">
//                     Back to Home
//                   </Button>
//                   <div className="flex space-x-5 items-center">
//                     <Button variant="backbtn" size="backbtnsize" type="button" onClick={() => setShowRemarkDialog(true)}>
//                       Revert
//                     </Button>
//                     <Button
//                       variant="nextbtn"
//                       size="nextbtnsize"
//                       type="button"
//                       onClick={() => {
//                         if (onCloseCallback && doc_name) onCloseCallback(doc_name);
//                       }}
//                     >
//                       {isLoading ? "Processing..." : "Use Existing Material Code"}
//                     </Button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <Button variant="backbtn" size="backbtnsize" onClick={onCancel} type="button">
//                     Back
//                   </Button>
//                   <div className="flex space-x-5 items-center">
//                     <Button variant="backbtn" size="backbtnsize" type="button" onClick={() => setShowRemarkDialog(true)}>
//                       Revert
//                     </Button>
//                     <Button
//                       variant="nextbtn"
//                       size="nextbtnsize"
//                       type="submit"
//                       onClick={handleApprovalStatus}
//                     >
//                       {isLoading ? "Processing..." : getButtonLabel(role, approvalStatus)}
//                     </Button>
//                   </div>
//                 </>
//               )}

//               {showAlert && (
//                 <Alertbox
//                   content="Your Details have been submitted successfully!"
//                   submit={showAlert}
//                   url="/material-onboarding-table"
//                 />
//               )}

//               {showcompletealert && (
//                 <Alertbox
//                   content="Your ticket to create new Material Code has been successfully closed!"
//                   submit={showcompletealert}
//                   url="/material-onboarding-table"
//                 />
//               )}

//               <RevertRemarkModal
//                 isOpen={showRemarkDialog}
//                 onClose={() => setShowRemarkDialog(false)}
//                 onConfirm={async (remark) => {
//                   handleRejectStatus(remark);
//                   if (sendRevertEmail && doc_name) {
//                     await sendRevertEmail(doc_name, remark);
//                     setShowRemarkDialog(false);
//                   }
//                 }}
//               />

//               {showRevertAlert && (
//                 <Alertbox
//                   content="Your ticket has been successfully re-opened with the remark!"
//                   submit={showRevertAlert}
//                   url="/material-onboarding-table"
//                 />
//               )}
//             </div>
//           </div>

//           {/* === Floating Save Button === */}
//           {saveAsDraft && (
//             <div className="fixed right-0 bottom-20 z-50 group">
//               <button
//                 type="button"
//                 onClick={saveAsDraft}
//                 className="bg-[#5291CD] text-white rounded-full p-3 shadow-lg hover:bg-[#407ab0] transition-all duration-200 relative"
//               >
//                 <Save className="w-5 h-5" />
//                 <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
//                   Save as Draft
//                 </span>
//               </button>
//             </div>
//           )}
//         </div>
//       </form>
//     </Form>
//   );
// };

// export default MaterialOnboardingForm;
