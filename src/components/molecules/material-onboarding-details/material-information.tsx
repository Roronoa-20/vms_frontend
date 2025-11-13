// "use client";

// import React, { useEffect, useState, ChangeEvent } from "react";
// import UserRequestDetails from "@/src/components/molecules/material-onboarding-details/user-request-details";
// import Storefields from "./material-store-fields";

// interface MaterialCodeItem {
//   material_description?: string;
//   name?: string;
// }

// interface CompanyInfo {
//   company_code?: string;
//   [key: string]: any;
// }

// interface MaterialGroupItem {
//   name: string;
//   material_group_company?: string;
//   material_group_name?: string;
//   material_group_description?: string;
//   [key: string]: any;
// }

// interface StorageLocationItem {
//   company?: string;
//   [key: string]: any;
// }

// interface DivisionItem {
//   company?: string;
//   [key: string]: any;
// }

// interface MaterialDetails {
//   material_master?: Record<string, any>;
// }

// interface MaterialInformationFormProps {
//   form: any;
//   onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
//   companyName?: string;
//   plantcode?: string;
//   UserDetails?: any;
//   DivisionDetails?: DivisionItem[];
//   role?: string;
//   UnitOfMeasure?: any[];
//   MaterialGroup?: MaterialGroupItem[];
//   MaterialOnboardingDetails?: any;
//   companyInfo?: CompanyInfo;
//   ProfitCenter?: any[];
//   AvailabilityCheck?: any[];
//   MaterialType?: any[];
//   StorageLocation?: StorageLocationItem[];
//   ClassType?: any[];
//   SerialProfile?: any[];
//   MaterialDetails?: MaterialDetails;
//   materialCompanyCode?: string;
//   setMaterialCompanyCode?: React.Dispatch<React.SetStateAction<string>>;
//   MaterialCode?: any[];
//   MaterialCategory?: any[];
//   AllMaterialType?: any[];
//   isMaterialCodeEdited?: boolean;
//   setIsMaterialCodeEdited?: React.Dispatch<React.SetStateAction<boolean>>;
//   AllMaterialCodes?: MaterialCodeItem[];
//   setShouldShowAllFields?: React.Dispatch<React.SetStateAction<boolean>>;
//   shouldShowAllFields?: boolean;
//   setIsMatchedMaterial?: React.Dispatch<React.SetStateAction<boolean>>;
//   isZCAPMaterial?: boolean;
// }

// const MaterialInformationForm: React.FC<MaterialInformationFormProps> = ({
//   form,
//   onSubmit,
//   companyName,
//   plantcode,
//   UserDetails,
//   DivisionDetails = [],
//   role,
//   UnitOfMeasure,
//   MaterialGroup = [],
//   MaterialOnboardingDetails,
//   companyInfo,
//   ProfitCenter,
//   AvailabilityCheck,
//   MaterialType,
//   StorageLocation = [],
//   ClassType,
//   SerialProfile,
//   MaterialDetails,
//   materialCompanyCode,
//   setMaterialCompanyCode,
//   MaterialCode,
//   MaterialCategory,
//   AllMaterialType,
//   isMaterialCodeEdited,
//   setIsMaterialCodeEdited,
//   AllMaterialCodes = [],
//   setShouldShowAllFields,
//   shouldShowAllFields,
//   setIsMatchedMaterial,
//   isZCAPMaterial
// }) => {
//   const [selectedMaterialType, setSelectedMaterialType] = useState<string>("");
//   const [filteredMaterialGroup, setFilteredMaterialGroup] = useState<MaterialGroupItem[]>([]);
//   const [filteredStorage, setFilteredStorage] = useState<StorageLocationItem[]>([]);
//   const [filteredDivision, setFilteredDivision] = useState<DivisionItem[]>([]);
//   const [searchResults, setSearchResults] = useState<MaterialCodeItem[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
//   const [materialSelectedFromList, setMaterialSelectedFromList] = useState<boolean>(false);

//   useEffect(() => {
//     const employeeCompanyCode = String(companyInfo?.company_code || "");
//     setFilteredMaterialGroup(
//       MaterialGroup?.filter((group) => String(group.material_group_company) === employeeCompanyCode) || []
//     );
//     setFilteredStorage(
//       StorageLocation?.filter((loc) => String(loc.company) === employeeCompanyCode) || []
//     );
//     setFilteredDivision(
//       DivisionDetails?.filter((div) => String(div.company) === employeeCompanyCode) || []
//     );
//   }, [MaterialGroup, companyInfo, ProfitCenter, MaterialType, StorageLocation, DivisionDetails]);

//   const handleMaterialSearch = (e: ChangeEvent<HTMLInputElement>) => {
//     const val = e.target.value;

//     if (val.trim().length > 3) {
//       const filtered = AllMaterialCodes?.filter((item) =>
//         item.material_description?.toLowerCase().includes(val.toLowerCase())
//       );

//       const mappedResults =
//         filtered?.map((item) => ({
//           material_description: item.material_description,
//           name: item.name
//         })) || [];

//       setSearchResults(mappedResults);
//       setShowSuggestions(true);
//     } else {
//       setSearchResults([]);
//       setShowSuggestions(false);
//     }

//     setMaterialSelectedFromList(false);
//   };

//   const handleMaterialSelect = (item: { material_name_description?: string; material_code_revised?: string }) => {
//     form.setValue("material_name_description", item.material_name_description || "");

//     if (item.material_code_revised && item.material_code_revised !== "null") {
//       form.setValue("material_code_revised", item.material_code_revised);
//     } else {
//       form.setValue("material_code_revised", "");
//     }

//     setMaterialSelectedFromList(true);
//     setShowSuggestions(false);
//   };

//   useEffect(() => {
//     const data = MaterialDetails?.material_master;
//     if (!data || !filteredMaterialGroup.length) return;

//     const fields = [
//       "material_group",
//       "batch_requirements_yn",
//       "brand_make",
//       "availability_check",
//       "class_type",
//       "class_number",
//       "serial_number_profile",
//       "serialization_level"
//     ];

//     fields.forEach((field) => {
//       if (data[field]) {
//         form.setValue(field, data[field]);
//       }
//     });
//   }, [MaterialDetails, filteredMaterialGroup]);

//   return (
//     <div className="bg-[#F4F4F6]">
//       <div className="flex flex-col justify-between pt-4 bg-white rounded-[8px]">
//         <div>
//           <UserRequestDetails
//             companyName={companyName}
//             role={role}
//             form={form}
//             MaterialDetails={MaterialDetails}
//             MaterialOnboardingDetails={MaterialOnboardingDetails}
//             materialCompanyCode={materialCompanyCode}
//             setMaterialCompanyCode={setMaterialCompanyCode}
//             setSelectedMaterialType={setSelectedMaterialType}
//             selectedMaterialType={selectedMaterialType}
//             UnitOfMeasure={UnitOfMeasure}
//             MaterialType={MaterialType}
//             plantcode={plantcode}
//             DivisionDetails={DivisionDetails}
//             filteredStorage={filteredStorage}
//             searchResults={searchResults}
//             showSuggestions={showSuggestions}
//             materialSelectedFromList={materialSelectedFromList}
//             handleMaterialSearch={handleMaterialSearch}
//             handleMaterialSelect={handleMaterialSelect}
//             setSearchResults={setSearchResults}
//             setShowSuggestions={setShowSuggestions}
//             MaterialCode={MaterialCode}
//             MaterialCategory={MaterialCategory}
//             filteredDivision={filteredDivision}
//             StorageLocation={StorageLocation}
//             AllMaterialType={AllMaterialType}
//             isMaterialCodeEdited={isMaterialCodeEdited}
//             setIsMaterialCodeEdited={setIsMaterialCodeEdited}
//             AllMaterialCodes={AllMaterialCodes}
//             setShouldShowAllFields={setShouldShowAllFields}
//             shouldShowAllFields={shouldShowAllFields}
//             setIsMatchedMaterial={setIsMatchedMaterial}
//             isZCAPMaterial={isZCAPMaterial}
//           />

//           {shouldShowAllFields && (role === "CP" || role === "Store") && (
//             <Storefields
//               companyInfo={companyInfo}
//               companyName={companyName}
//               role={role}
//               form={form}
//               MaterialDetails={MaterialDetails}
//               MaterialOnboardingDetails={MaterialOnboardingDetails}
//               materialCompanyCode={materialCompanyCode}
//               setMaterialCompanyCode={setMaterialCompanyCode}
//               UnitOfMeasure={UnitOfMeasure}
//               MaterialType={MaterialType}
//               plantcode={plantcode}
//               AllMaterialType={AllMaterialType}
//               AvailabilityCheck={AvailabilityCheck}
//               MaterialGroup={MaterialGroup}
//               SerialProfile={SerialProfile}
//               ClassType={ClassType}
//               isZCAPMaterial={isZCAPMaterial}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MaterialInformationForm;