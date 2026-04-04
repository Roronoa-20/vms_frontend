import React from "react";
import RequesterDetails from "@/src/components/templates/material-onboarding-details/requester-details";
import MaterialInformation from "@/src/components/templates/material-onboarding-details/material-information";
import Storefields from "@/src/components/templates/material-onboarding-details/material-store-fields";
import MaterialPurchasingData from "@/src/components/templates/material-onboarding-details/material-purchasing-data";
import MaterialMRPData from "@/src/components/templates/material-onboarding-details/material-mrp-data";
import MaterialQAQCData from "@/src/components/templates/material-onboarding-details/material-qa-qc-data";
import MaterialOtherData from "@/src/components/templates/material-onboarding-details/material-other-data";
import MaterialSpecifications from "@/src/components/templates/material-onboarding-details/material-specifications";
import MaterialComment from "@/src/components/templates/material-onboarding-details/material-remarks-field";

interface MaterialFormSectionsProps {
    tab: string;
    props: any;
    role: string;
    isZCAPMaterial: boolean;
    finalShouldShowAllFields: boolean;
    materialCompanyCode: string;
    setMaterialCompanyCode: (code: string) => void;
    filteredProfit: any;
    fileSelected: boolean;
    setFileSelected: (selected: boolean) => void;
    fileName: string;
    setFileName: (name: string) => void;
    handleLabelClick: (inputId: string) => void;
    handleImageChange: (event: React.ChangeEvent<HTMLInputElement>, key: string) => void;
    handleRemoveFile: (inputId: string, clearFileNameFn: (v: string) => void) => void;
    setIsMaterialCodeEdited: React.Dispatch<React.SetStateAction<boolean>>;
    setIsMatchedMaterial: React.Dispatch<React.SetStateAction<boolean>>;
    isMaterialCodeEdited?: boolean;
    setShouldShowAllFields: React.Dispatch<React.SetStateAction<boolean>>;
    shouldShowAllFields: boolean;
    isFileUploading?: boolean;
    localLineItemFiles?: any;
    latestCodeSuggestions: any;
    selectedCodeLogic: string;
    setSelectedCodeLogic: (logic: string) => void;
}

export default function MaterialFormSections({
    tab,
    props,
    role,
    isZCAPMaterial,
    finalShouldShowAllFields,
    materialCompanyCode,
    setMaterialCompanyCode,
    filteredProfit,
    fileSelected,
    setFileSelected,
    fileName,
    setFileName,
    handleLabelClick,
    handleImageChange,
    handleRemoveFile,
    setIsMaterialCodeEdited,
    setIsMatchedMaterial,
    setShouldShowAllFields,
    isMaterialCodeEdited,
    isFileUploading,
    localLineItemFiles,
    latestCodeSuggestions,
    selectedCodeLogic,
    setSelectedCodeLogic,
}: MaterialFormSectionsProps) {

    if (tab === "basic-data") {
        return (
            <>
                <RequesterDetails
                    MaterialOnboardingDetails={props.MaterialOnboardingDetails}
                    MaterialDetails={props.MaterialDetails}
                    form={props.form}
                />

                <MaterialInformation
                    {...props}
                    role={role}
                    isZCAPMaterial={isZCAPMaterial}
                    materialCompanyCode={materialCompanyCode}
                    setMaterialCompanyCode={setMaterialCompanyCode}
                    setIsMaterialCodeEdited={setIsMaterialCodeEdited}
                    setIsMatchedMaterial={setIsMatchedMaterial}
                    setShouldShowAllFields={setShouldShowAllFields}
                    shouldShowAllFields={finalShouldShowAllFields}
                    isMaterialCodeEdited={isMaterialCodeEdited}
                    isFileUploading={isFileUploading}
                    localLineItemFiles={localLineItemFiles}
                    latestCodeSuggestions={latestCodeSuggestions}
                    selectedCodeLogic={selectedCodeLogic}
                    setSelectedCodeLogic={setSelectedCodeLogic}
                />
            </>
        );
    }

    if (!finalShouldShowAllFields) return null;

    switch (tab) {
        case "store-data":
            return (
                <Storefields
                    {...props}
                    role={role}
                    isZCAPMaterial={isZCAPMaterial}
                    materialCompanyCode={materialCompanyCode}
                    setMaterialCompanyCode={setMaterialCompanyCode}
                />
            );

        case "purchasing-data":
            return <MaterialPurchasingData {...props} role={role} />;

        case "mrp-data":
            return (
                <MaterialMRPData
                    {...props}
                    role={role}
                    isZCAPMaterial={isZCAPMaterial}
                />
            );

        case "qa-qc-data":
            return !isZCAPMaterial ? (
                <MaterialQAQCData {...props} />
            ) : null;

        case "others-data":
            return (
                <MaterialOtherData
                    {...props}
                    role={role}
                    filteredProfit={filteredProfit}
                    fileSelected={fileSelected}
                    setFileSelected={setFileSelected}
                    fileName={fileName}
                    setFileName={setFileName}
                    handleLabelClick={handleLabelClick}
                    handleImageChange={handleImageChange}
                    handleRemoveFile={handleRemoveFile}
                    isFileUploading={isFileUploading}
                    localLineItemFiles={localLineItemFiles}
                />
            );

        case "specifications":
            return !isZCAPMaterial ? (
                <MaterialSpecifications {...props} />
            ) : null;

        case "comments":
            return <MaterialComment {...props} />;

        default:
            return null;
    }
}