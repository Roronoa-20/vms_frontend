"use client";

import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Save } from "lucide-react";
import Alertbox from "@/src/components/common/vendor-onboarding-alertbox";
import { useAuth } from "@/src/context/AuthContext";
import MaterialInformation from "@/src/components/molecules/material-onboarding-details/material-information";
import MaterialSpecifications from "@/src/components/molecules/material-onboarding-details/material-specifications";
import MaterialOnboardingApproval from "@/src/components/molecules/material-onboarding-details/material-approval";
import MaterialPurchasingData from "@/src/components/molecules/material-onboarding-details/material-purchasing-data";
import RequesterDetails from "@/src/components/molecules/material-onboarding-details/requester-details";
import MaterialComment from "@/src/components/molecules/material-onboarding-details/material-remarks-field";
import MaterialMRPData from "@/src/components/molecules/material-onboarding-details/material-mrp-data";
import MaterialQAQCData from "@/src/components/molecules/material-onboarding-details/material-qa-qc-data";
import MaterialOtherData from "@/src/components/molecules/material-onboarding-details/material-other-data";
import SAPMaterialModal from "@/src/components/molecules/material-onboarding-modal/SAPMaterialModal";
import RevertRemarkModal from "@/src/components/molecules/material-onboarding-modal/revert-remark-field";
import { MaterialRegistrationFormData, EmployeeDetail, Company, Plant, division, industry, ClassType, UOMMaster, MRPType, ValuationClass, procurementType, ValuationCategory, MaterialGroupMaster, MaterialCategory, ProfitCenter, AvailabilityCheck, PriceControl, MRPController, StorageLocation, InspectionType, SerialNumber, LotSize, SchedulingMarginKey, ExpirationDate, MaterialRequestData, MaterialType, MRPGroup } from "@/src/types/MaterialCodeRequestFormTypes";
import { TcompanyNameBasedDropdown } from "@/src/types/types";
import { useSearchParams } from "next/navigation";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";


interface FileRecord {
  file: File;
  fileURL: string;
}

interface MaterialOnboardingFormProps {
  form: UseFormReturn<MaterialRegistrationFormData>;
  isLoading?: boolean;
  showAlert?: boolean;
  showcompletealert?: boolean;
  showRevertAlert?: boolean;
  companyName?: Company[];
  plantcode?: Plant[];
  EmployeeDetailsJSON?: EmployeeDetail;
  DivisionDetails?: division[];
  IndustryDetails?: industry[];
  UnitOfMeasure?: UOMMaster[];
  MRPType?: MRPType[];
  ValuationClass?: ValuationClass[];
  ProcurementType?: procurementType[];
  ValuationCategory?: ValuationCategory[];
  MaterialGroup?: MaterialGroupMaster[];
  MaterialOnboardingDetails?: MaterialRegistrationFormData;
  MaterialDetails?: MaterialRequestData;
  lineItemFiles?: Record<string, FileRecord>;
  setLineItemFiles?: React.Dispatch<React.SetStateAction<Record<string, FileRecord>>>;
  setHsnStatus?: (val: boolean) => void;
  hsnStatus?: boolean;
  companyInfo?: any;
  ProfitCenter?: ProfitCenter[];
  PriceControl?: PriceControl[];
  AvailabilityCheck?: AvailabilityCheck[];
  MRPController?: MRPController[];
  StorageLocation?: StorageLocation[];
  ClassType?: ClassType[];
  PurchaseGroup?: any;
  SerialProfile?: SerialNumber[];
  InspectionType?: InspectionType[];
  LotSize?: LotSize[];
  MaterialCategory?: MaterialCategory[];
  SMK?: SchedulingMarginKey[];
  ExpirationDate?: ExpirationDate[];
  doc_name?: string;
  sendRevertEmail?: (doc: string, remark: string) => Promise<void>;
  onCloseCallback?: (name: string) => void;
  saveAsDraft?: () => void;
  MaterialType?: MaterialType[];
  PurchaseGroupJson?: TcompanyNameBasedDropdown["message"]["data"]["purchase_groups"];
  MRPGroup?: MRPGroup[];
}

const MaterialOnboardingForm: React.FC<MaterialOnboardingFormProps> = (props) => {
  const { form, isLoading, MaterialOnboardingDetails, ProfitCenter = [], setLineItemFiles, sendRevertEmail, onCloseCallback, showAlert, showcompletealert, showRevertAlert, EmployeeDetailsJSON, MaterialDetails, MaterialType } = props;

  console.log("Material Onboarding type------>", EmployeeDetailsJSON)

  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");
  const [filteredProfit, setFilteredProfit] = useState<ProfitCenter[]>([]);
  const [showSAPModal, setShowSAPModal] = useState(false);
  const [isMaterialCodeEdited, setIsMaterialCodeEdited] = useState(false);
  const [shouldShowAllFields, setShouldShowAllFields] = useState(false);
  const [isMatchedMaterial, setIsMatchedMaterial] = useState(false);
  const [showRemarkDialog, setShowRemarkDialog] = useState(false);
  const [materialCompanyCode, setMaterialCompanyCode] = useState<string>("");
  const { designation } = useAuth();
  const role = designation || "";
  const memoizedDetails = React.useMemo(() => MaterialOnboardingDetails, [MaterialOnboardingDetails]);
  const memoizedMaterialDetails = React.useMemo(() => MaterialDetails, [MaterialDetails]);


  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    if (!form.getValues("request_date")) {
      form.setValue("request_date", currentDate);
    }
  }, []);

  useEffect(() => {
    if (MaterialOnboardingDetails?.approval_status === "Code Generated by SAP") {
      setShowSAPModal(true);
    }
  }, [MaterialOnboardingDetails?.approval_status]);


  useEffect(() => {
    if (!EmployeeDetailsJSON?.company || !Array.isArray(EmployeeDetailsJSON.company) || !ProfitCenter?.length) {
      if (filteredProfit.length > 0) {
        setFilteredProfit([]);
      }
      return;
    }

    const employeeCompanyCodes = EmployeeDetailsJSON.company
      .map((comp) => String(comp.company_code))
      .filter(Boolean);

    const newFilteredProfit = ProfitCenter.filter((pc) =>
      employeeCompanyCodes.includes(String(pc.company_code))
    );

    const hasChanged =
      newFilteredProfit.length !== filteredProfit.length ||
      newFilteredProfit.some(
        (pc, i) =>
          pc.profit_center_code !== filteredProfit[i]?.profit_center_code ||
          pc.profit_center_name !== filteredProfit[i]?.profit_center_name
      );

    if (hasChanged) {
      setFilteredProfit(newFilteredProfit);
    } else {
    }
  }, [EmployeeDetailsJSON, ProfitCenter, filteredProfit]);

  const onCancel = () => {
    router.push("/view-material-code-request");
  };

  const handleLabelClick = (inputId: string) => {
    document.getElementById(inputId)?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file && setLineItemFiles) {
      const fileURL = URL.createObjectURL(file);
      setLineItemFiles((prev) => ({
        ...prev,
        [key]: { file, fileURL },
      }));
      setFileSelected(true);
      setFileName(file.name);
    }
  };

  const handleRemoveFile = (inputId: string, clearFileNameFn: (v: string) => void) => {
    if (!setLineItemFiles) return;
    setLineItemFiles((prev) => {
      const updated = { ...prev };
      delete updated["material_information"];
      return updated;
    });
    clearFileNameFn("");
    setFileSelected(false);
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) input.value = "";
  };

  const getButtonLabel = (role: string, approvalStatus?: string): string => {
    if (["Material CP", "Store"].includes(role)) {
      if (approvalStatus === "Pending by CP" || approvalStatus === "Re-Opened by CP")
        return "Send to SAP";
      if (approvalStatus === "Sent to SAP") return "Update";
    }
    if (role === "SAP") return "Close";
    return "Submit";
  };

  const handleRejectStatus = (remark: string) => {
    if (["Material CP", "Store"].includes(role)) {
      form.setValue("approval_status", "Re-Opened by CP");
      form.setValue("remark_by_cp", remark);
    }
  };

  const approvalStatus = MaterialOnboardingDetails?.approval_status;
  const isSAPLockedStatus = ["Sent to SAP", "Code Generated by SAP", "Pending by CP", "Updated by CP", "Re-Opened by CP"].includes(approvalStatus);

  const isCodeGeneratedBySAP = approvalStatus === "Code Generated by SAP";
  const isUserLockedView = role === "User" && isSAPLockedStatus;

  const materialType = MaterialOnboardingDetails?.material_type_name;
  const isZCAPMaterial = materialType === "ZCAP";
  // console.log("is ZCAP Material Type---->", MaterialOnboardingDetails)

  // const buttonLabel = getButtonLabel(role, approvalStatus);

  const handleSubmit = async (values: any) => {
    // console.log("FINAL PAYLOAD:", values);
    const approvedByName = EmployeeDetailsJSON?.company_email || "";
    const { request_date, requested_by, company, department, sub_department, hod, immediate_reporting_head, contact_information_email, contact_information_phone,
      ...rest } = values;

    const finalPayload = Object.fromEntries(
      Object.entries(rest).map(([key, val]) => {
        if (val && typeof val === "object" && "value" in val) {
          return [key, val.value];
        }
        return [key, val];
      })
    );
    try {
      const payload = {
        requestor_ref_no: name,
        ...finalPayload,
        approved_by_name: approvedByName,
        material_code: form.getValues("material_code_revised") || form.getValues("old_material_code"),
        material_name: form.getValues("material_name_description"),
        numerator_for_conversion: form.getValues("numerator_purchase_uom"),
        denominator_for_conversion: form.getValues("denominator_purchase_uom"),
        purchase_uom: form.getValues("purchase_uom"),
        purchasing_value_key: form.getValues("purchasing_value_key"),
        min_lot_size: form.getValues("min_lot_size"),
        issue_unit: form.getValues("base_uom"),
        company: form.getValues("material_company_code"),
        plant: form.getValues("plant_name"),
      };

      // console.log("FINAL PAYLOAD SENT TO BACKEND:", payload);

      const response: any = await requestWrapper({
        url: API_END_POINTS.creatematerialonboarding,
        method: "POST",
        data: payload,
      });

      // console.log("Create Material Onboarding Response:", response);

      if (response?.status === 200) {
        alert("Material created successfully");
        return;
      }
      if (response?.name === "AxiosError" && response?.status === 400) {
        let errorMessage = "";

        const data = response.response?.data;

        if (data?._server_messages) {
          try {
            const msgs = JSON.parse(data._server_messages);
            errorMessage = msgs?.[0]?.message;
          } catch {
          }
        }

        if (!errorMessage && data?.message?.error) {
          errorMessage = data.message.error;
        }

        if (!errorMessage) {
          errorMessage = response.message || "Request failed";
        }

        alert(errorMessage);
        return;
      }

    } catch (error: any) {
      console.error("Error submitting onboarding:", error);
      alert("Something went wrong. Try again.");
    }
  };


  const getNextApprovalStatus = () => {
    const current = MaterialOnboardingDetails?.approval_status;
    if (role === "SAP") return "Code Generated by SAP";

    if (["Material CP", "Store"].includes(role)) {
      if (current === "Sent to SAP") return "Updated By CP";
      if (current === "Pending by SAP") return "Sent to SAP";
      if (current === "Pending by CP" || current === "Re-Opened by CP") return "Sent to SAP";
    }

    return form.getValues("approval_status") || "Pending by CP";
  };

  const onFinalSubmit = async () => {
    const nextStatus = getNextApprovalStatus();
    form.setValue("approval_status", nextStatus);

    const values = form.getValues();
    await handleSubmit(values);
  };


  return (
    <Form {...form}>
      <div className="bg-gray-300 p-2 overflow-hidden">
        <div className="flex flex-col p-3 bg-white rounded-[8px] min-h-[88vh] shadow-sm w-full">
          {/* === SAP MODAL === */}
          <SAPMaterialModal
            isOpen={showSAPModal}
            onClose={() => setShowSAPModal(false)}
            materialCode={MaterialOnboardingDetails?.material_code_revised || ""}
            materialDescription={MaterialOnboardingDetails?.material_name_description || ""}
            isZCAPMaterial={isZCAPMaterial}
          />

          {/* === SECTIONS === */}
          <RequesterDetails MaterialOnboardingDetails={memoizedDetails} form={form} />

          <MaterialInformation
            {...props}
            MaterialDetails={memoizedMaterialDetails}
            MaterialType={MaterialType}
            setShouldShowAllFields={setShouldShowAllFields}
            shouldShowAllFields={shouldShowAllFields}
            isMaterialCodeEdited={isMaterialCodeEdited}
            setIsMaterialCodeEdited={setIsMaterialCodeEdited}
            setIsMatchedMaterial={setIsMatchedMaterial}
            isZCAPMaterial={isZCAPMaterial}
            materialCompanyCode={materialCompanyCode}
            setMaterialCompanyCode={setMaterialCompanyCode}
            role={role}
          />

          {shouldShowAllFields && (
            <>
              {["Material CP", "Store"].includes(role) && (
                <>
                  <MaterialPurchasingData {...props} role={role} />


                  <MaterialMRPData {...props} role={role} isZCAPMaterial={isZCAPMaterial} />

                  {!isZCAPMaterial && (
                    <MaterialQAQCData {...props} MaterialDetails={memoizedMaterialDetails} />
                  )}

                  <MaterialOtherData
                    {...props}
                    role={role}
                    filteredProfit={filteredProfit}
                    setFilteredProfit={setFilteredProfit}
                    fileSelected={fileSelected}
                    setFileSelected={setFileSelected}
                    fileName={fileName}
                    setFileName={setFileName}
                    handleLabelClick={handleLabelClick}
                    handleImageChange={handleImageChange}
                    handleRemoveFile={handleRemoveFile}
                    isZCAPMaterial={isZCAPMaterial}
                    MaterialType={MaterialType}
                  />

                  {!isZCAPMaterial && (
                    <MaterialSpecifications {...props} isZCAPMaterial={isZCAPMaterial} />
                  )}

                  <MaterialComment {...props} />

                  {/* <MaterialOnboardingApproval {...props} role={role} /> */}
                </>
              )}
            </>
          )}

          {/* === FOOTER BUTTONS === */}
          <div className="flex justify-between items-center w-full mt-4">
            {/* === User Locked View === */}
            {isCodeGeneratedBySAP || isUserLockedView ? (
              <div className="flex justify-end w-full">
                <Button variant="backbtn" size="backbtnsize" onClick={onCancel} type="button">
                  Back to Home
                </Button>
              </div>
            ) : (
              <>

                {/* === Back Button (Always shown) === */}
                <Button
                  variant="backbtn"
                  size="backbtnsize"
                  type="button"
                  onClick={onCancel}
                >
                  Back
                </Button>

                {/* === Right Side Button Set === */}
                <div className="flex space-x-5 items-center">

                  {/* === Revert Button === */}
                  <Button
                    variant="backbtn"
                    size="backbtnsize"
                    type="button"
                    onClick={() => setShowRemarkDialog(true)}
                  >
                    Revert
                  </Button>

                  {/* === Use Existing Material (Matched Case) === */}
                  {isMatchedMaterial ? (
                    <Button
                      variant="nextbtn"
                      size="nextbtnsize"
                      type="button"
                      onClick={() => onCloseCallback?.(name || "")}
                    >
                      {isLoading ? "Processing..." : "Use Existing Material Code"}
                    </Button>
                  ) : (
                    /* === Main Submit Button === */
                    <Button
                      variant="nextbtn"
                      size="nextbtnsize"
                      type="submit"
                      onClick={onFinalSubmit}
                    >
                      {isLoading ? "Processing..." : getButtonLabel(role, approvalStatus)}
                    </Button>
                  )}

                </div>
              </>
            )}

            {showAlert && (
              <Alertbox
                content="Your Details have been submitted successfully!"
                submit={showAlert}
                url="/material-onboarding-dashboard"
              />
            )}

            {showcompletealert && (
              <Alertbox
                content="Your ticket to create new Material Code has been successfully closed!"
                submit={showcompletealert}
                url="/material-onboarding-dashboard"
              />
            )}

            <RevertRemarkModal
              isOpen={showRemarkDialog}
              onClose={() => setShowRemarkDialog(false)}
              onConfirm={async (remark) => {
                handleRejectStatus(remark);
                if (sendRevertEmail && name) {
                  await sendRevertEmail(name, remark);
                  setShowRemarkDialog(false);
                }
              }}
            />

            {showRevertAlert && (
              <Alertbox
                content="Your ticket has been successfully re-opened with the remark!"
                submit={showRevertAlert}
                url="/material-onboarding-dashboard"
              />
            )}
          </div>
        </div>

        {/* === Floating Save Button === */}
        {/* {saveAsDraft && (
            <div className="fixed right-0 bottom-20 z-50 group">
              <button
                type="button"
                onClick={saveAsDraft}
                className="bg-[#5291CD] text-white rounded-full p-3 shadow-lg hover:bg-[#407ab0] transition-all duration-200 relative"
              >
                <Save className="w-5 h-5" />
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  Save as Draft
                </span>
              </button>
            </div>
          )} */}
      </div>
      {/* </form> */}
    </Form>
  );
};

export default MaterialOnboardingForm;