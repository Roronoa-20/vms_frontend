"use client";

import React, { useEffect, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { MaterialCode } from "@/src/types/PurchaseRequestType";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";
import Alertbox from "@/src/components/common/vendor-onboarding-alertbox";
import { useAuth } from "@/src/context/AuthContext";
import MaterialInformation from "@/src/components/templates/material-onboarding-details/material-information";
import MaterialSpecifications from "@/src/components/templates/material-onboarding-details/material-specifications";
import MaterialPurchasingData from "@/src/components/templates/material-onboarding-details/material-purchasing-data";
import RequesterDetails from "@/src/components/templates/material-onboarding-details/requester-details";
import MaterialComment from "@/src/components/templates/material-onboarding-details/material-remarks-field";
import MaterialMRPData from "@/src/components/templates/material-onboarding-details/material-mrp-data";
import MaterialQAQCData from "@/src/components/templates/material-onboarding-details/material-qa-qc-data";
import MaterialOtherData from "@/src/components/templates/material-onboarding-details/material-other-data";
import Storefields from "@/src/components/templates/material-onboarding-details/material-store-fields";
import SAPMaterialModal from "@/src/components/molecules/material-onboarding-modal/SAPMaterialModal";
import RevertRemarkModal from "@/src/components/molecules/material-onboarding-modal/revert-remark-field";
import { MaterialRegistrationFormData, EmployeeDetail, Company, Plant, division, industry, ClassType, UOMMaster, MRPType, ValuationClass, procurementType, ValuationCategory, MaterialGroupMaster, MaterialCategory, ProfitCenter, AvailabilityCheck, PriceControl, MRPController, StorageLocation, InspectionType, SerialNumber, LotSize, SchedulingMarginKey, ExpirationDate, MaterialRequestData, MaterialType, MRPGroup, LatestCodeSuggestions } from "@/src/types/MaterialCodeRequestFormTypes";
import { TcompanyNameBasedDropdown } from "@/src/types/types";
import { useSearchParams, usePathname } from "next/navigation";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import { getMaterialTabs } from "@/src/constants/materialTabs";
import MaterialFormFooter from "../../molecules/MaterialFormFooter";
import MaterialFormSections from "../../molecules/MaterialFormSections";
import { EDIT_ROLES, MATERIAL_ROLES } from "@/src/constants/materialRoles";

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
  MaterialType?: MaterialType[];
  PurchaseGroupJson?: TcompanyNameBasedDropdown["message"]["data"]["purchase_groups"];
  MRPGroup?: MRPGroup[];
  isFileUploading?: boolean;
  localLineItemFiles?: any;
}

const MaterialOnboardingForm: React.FC<MaterialOnboardingFormProps> = (props) => {
  const { form, isLoading, MaterialOnboardingDetails, ProfitCenter = [], setLineItemFiles, sendRevertEmail, onCloseCallback, showAlert, showcompletealert, showRevertAlert, EmployeeDetailsJSON, MaterialDetails, MaterialType } = props;

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const name = searchParams.get("name");
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState("");
  const [showSAPModal, setShowSAPModal] = useState(false);
  const [isMaterialCodeEdited, setIsMaterialCodeEdited] = useState(false);
  const [shouldShowAllFields, setShouldShowAllFields] = useState(false);
  const [isMatchedMaterial, setIsMatchedMaterial] = useState(false);
  const [showRemarkDialog, setShowRemarkDialog] = useState(false);
  const [materialCompanyCode, setMaterialCompanyCode] = useState<string>("");
  const { designation } = useAuth();
  const role = designation || "";

  const [selectedCodeLogic, setSelectedCodeLogic] = useState<string>("");
  const [latestCodeSuggestions, setLatestCodeSuggestions] = useState<LatestCodeSuggestions | null>(null);

  const materialTypeField = form.watch("material_type");
  const category = useWatch({ control: form.control, name: "material_type_category" });
  const companyField = form.watch("material_company_code");

  useEffect(() => {
    if (!category || !MaterialType?.length || !materialTypeField) return;

    const matchedType = MaterialType.find((t) => t.name === materialTypeField);
    if (!matchedType?.material_code_logic?.length) return;

    const normalize = (v: string) => (v || "").trim().toLowerCase();
    const matchedLogic = matchedType.material_code_logic.find(
      (m) => normalize(m.material_type_category) === normalize(category)
    );

    if (matchedLogic?.code_logic) {
      setSelectedCodeLogic(matchedLogic.code_logic);
    }
  }, [category, materialTypeField, MaterialType]);

  const fetchLatestCode = React.useCallback(async () => {
    if (!selectedCodeLogic || !companyField) return;

    try {
      const res = await requestWrapper({
        method: "GET",
        url: `${API_END_POINTS.getLatestMaterialCode}?prefix=${selectedCodeLogic}&company=${companyField}`,
      });
      if (res?.data?.message) {
        const { sap, onboarding, next_suggested } = res.data.message;
        setLatestCodeSuggestions({
          next: next_suggested || null,
          sap: sap || null,
          onboarding: onboarding || null,
        });
      }
    } catch (e) {
      console.error("fetchLatestCode API Failed", e);
    }
  }, [selectedCodeLogic, companyField]);

  useEffect(() => {
    fetchLatestCode();
  }, [selectedCodeLogic, companyField, fetchLatestCode]);

  useEffect(() => {
    if (MaterialOnboardingDetails?.approval_status === "Code Generated by SAP") {
      setShowSAPModal(true);
    }
  }, [MaterialOnboardingDetails]);

  const filteredProfit = React.useMemo(() => {
    if (!EmployeeDetailsJSON?.company || !Array.isArray(EmployeeDetailsJSON.company) || !ProfitCenter?.length) {
      return [];
    }

    const employeeCompanyCodes = EmployeeDetailsJSON.company.map((c) => String(c.company_code)).filter(Boolean);

    return ProfitCenter.filter((pc) => employeeCompanyCodes.includes(String(pc.company_code)));
  }, [EmployeeDetailsJSON, ProfitCenter]);

  const onCancel = () => {
    router.push("/view-material-code-request");
  };

  const handleLabelClick = React.useCallback((inputId: string) => {
    document.getElementById(inputId)?.click();
  }, []);

  const [localLineItemFiles, setLocalLineItemFiles] = useState<Record<string, FileRecord>>({});
  const [isFileUploading, setIsFileUploading] = useState(false);

  const handleImageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsFileUploading(true);
      const fileURL = URL.createObjectURL(file);

      setLocalLineItemFiles((prev) => ({
        ...prev,
        [key]: { file, fileURL },
      }));

      // Automatically store in hook-form so API might receive it directly 
      // depending on implementation, or just for internal reference
      form.setValue(key as any, file);

      setFileSelected(true);
      setFileName(file.name);

      // Simulate slightly slow upload so loader is visible
      setTimeout(() => {
        setIsFileUploading(false);
      }, 1000);
    },
    [form]
  );

  const handleRemoveFile = React.useCallback(
    (inputId: string, clearFileNameFn: (v: string) => void) => {
      setLocalLineItemFiles((prev) => {
        const updated = { ...prev };
        delete updated["material_information"];
        return updated;
      });

      clearFileNameFn("");
      setFileSelected(false);
      form.setValue("material_information" as any, "");

      const input = document.getElementById(inputId) as HTMLInputElement;
      if (input) input.value = "";
    },
    [form]
  );

  const getButtonLabel = (role: string, approvalStatus?: string): string => {
    if (EDIT_ROLES.includes(role)) {
      if (["Pending by CP", "Re-Opened by CP"].includes(approvalStatus || "")) {
        return "Send to SAP";
      }
      if (approvalStatus === "Sent to SAP") return "Update";
    }
    if (role === "SAP") return "Close";
    return "Submit";
  };

  const handleRejectStatus = (remark: string) => {
    if (EDIT_ROLES.includes(role)) {
      form.setValue("approval_status", "Re-Opened by CP");
      form.setValue("remark_by_cp", remark);
    }
  };

  const approvalStatus = MaterialOnboardingDetails?.approval_status?.trim() ?? "";
  const isPendingByCP = approvalStatus === "Pending by CP";
  const isCodeGeneratedBySAP = approvalStatus === "Code Generated by SAP";

  const isSAPLockedStatus = ["Sent to SAP", "Code Generated by SAP", "Pending by CP", "Updated by CP", "Re-Opened by CP"].includes(approvalStatus);

  const revisedFlag = MaterialDetails?.material_request_item?.is_revised_code_new;
  const isRevisedNewCode = revisedFlag === 1 || revisedFlag === true;
  const finalShouldShowAllFields = isRevisedNewCode || (!isPendingByCP && shouldShowAllFields);
  const isUserLockedView = role === "User" && isSAPLockedStatus;

  const materialType = MaterialOnboardingDetails?.material_type_name;
  const isZCAPMaterial = materialType === "ZCAP";

  // New Tab Navigation Logic
  const tabs = React.useMemo(
    () => getMaterialTabs(role, finalShouldShowAllFields, isZCAPMaterial),
    [role, finalShouldShowAllFields, isZCAPMaterial]
  );

  const availableTabs = tabs.map((t) => t.id);
  const urlTabType = searchParams.get("tabtype");

  const [activeTab, setActiveTab] = useState(urlTabType || "basic-data");

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tabtype", val);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (urlTabType && urlTabType !== activeTab) {
      setActiveTab(urlTabType);
    }
  }, [urlTabType, activeTab]);

  useEffect(() => {
    if (!urlTabType && availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [urlTabType, activeTab, availableTabs.length]);

  const isFirstTab = activeTab === availableTabs[0];
  const isLastTab = activeTab === availableTabs[availableTabs.length - 1];

  const tabFieldValidationMap: Record<string, string[]> = {
    "basic-data": shouldShowAllFields ? ["material_code_revised", "division", "storage_location"] : ["material_code_revised"],
    "others-data": ["profit_center", "valuation_class", "price_control"],

  };

  const handleNextTab = async () => {
    const fieldsToValidate = tabFieldValidationMap[activeTab] || [];

    let isValid = true;

    fieldsToValidate.forEach((field) => {
      const value = form.getValues(field);

      if (!value || (typeof value === "string" && !value.trim())) {
        form.setError(field, {
          type: "manual",
          message: "This field is required",
        });
        isValid = false;
      } else {
        form.clearErrors(field);
      }
    });

    if (activeTab === "basic-data") {
      const status = MaterialOnboardingDetails?.approval_status?.trim();
      const isFinalized =
        status === "Sent to SAP" || status === "Code Generated by SAP";

      if (isFinalized) {
        //  if (status === "Code Generated by SAP") {
        //   setShowSAPModal(true);
        // } else if (status === "Sent to SAP" && latestCodeSuggestions) {
        //   const alertMsg = `SAP Latest Code: ${latestCodeSuggestions.sap}\nOnboarding Latest Code: ${latestCodeSuggestions.onboarding}\nNext Suggested Code: ${latestCodeSuggestions.next}`;
        //   alert(alertMsg);
        // }
        // Validation bypass: No alerts or modals, just allow navigation
      } else {
        const value = form.getValues("material_code_revised")?.trim() || "";

        if (!value || value.endsWith("-")) {
          form.setError("material_code_revised", {
            type: "manual",
            message: "Enter a valid Material Code",
          });
          isValid = false;
        } else if (latestCodeSuggestions) {
          // Validation: Must match NEXT suggested
          if (latestCodeSuggestions.next && value !== latestCodeSuggestions.next) {
            const errMsg = `Material Code must match next suggested code: ${latestCodeSuggestions.next}`;
            form.setError("material_code_revised", {
              type: "manual",
              message: errMsg,
            });
            alert(errMsg);
            isValid = false;
          }

          // Validation: Must NOT match SAP or Onboarding latest suggestions
          if (
            value === latestCodeSuggestions.sap ||
            value === latestCodeSuggestions.onboarding
          ) {
            const errMsg = "Material Code cannot match existing SAP or Onboarding values";
            form.setError("material_code_revised", {
              type: "manual",
              message: errMsg,
            });
            alert(errMsg);
            isValid = false;
          }
        }
      }
    }

    if (!isValid) return;

    const idx = availableTabs.indexOf(activeTab);
    if (idx !== -1 && idx < availableTabs.length - 1) {
      handleTabChange(availableTabs[idx + 1]);
    }
  };

  const handlePrevTab = () => {
    const idx = availableTabs.indexOf(activeTab);
    if (idx > 0) {
      handleTabChange(availableTabs[idx - 1]);
    }
  };

  const saveAsDraft = async () => {
    const values = form.getValues();
    const approvedByName = EmployeeDetailsJSON?.company_email || "";
    const { request_date, requested_by, company, department, sub_department, hod, immediate_reporting_head, contact_information_email, contact_information_phone, material_information,
      ...rest } = values;

    const finalPayload = Object.fromEntries(
      Object.entries(rest).map(([key, value]) => [
        key,
        typeof value === "object" && value !== null && "value" in value
          ? value.value
          : value,
      ])
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
        issue_unit: form.getValues("issue_unit"),
        company: form.getValues("material_company_code"),
        plant: form.getValues("plant_name"),
        save_as_draft: true,
      };

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (localLineItemFiles?.["material_information"]?.file) {
        formData.append("material_information", localLineItemFiles["material_information"].file);
      }

      const response: any = await requestWrapper({
        url: API_END_POINTS.creatematerialonboarding,
        method: "POST",
        data: formData,
      });

      console.log("FULL RESPONSE (DRAFT):", response);

      if (response?.status === 200) {
        alert("Draft saved successfully!");
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
      console.error("Error saving draft:", error);
      alert("Something went wrong saving the draft. Try again.");
    }
  };

  const handleSubmit = async (values: any) => {
    const approvedByName = EmployeeDetailsJSON?.company_email || "";
    const { request_date, requested_by, company, department, sub_department, hod, immediate_reporting_head, contact_information_email, contact_information_phone, material_information,
      ...rest } = values;

    const finalPayload = Object.fromEntries(
      Object.entries(rest).map(([key, value]) => [
        key,
        typeof value === "object" && value !== null && "value" in value
          ? value.value
          : value,
      ])
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

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (localLineItemFiles?.["material_information"]?.file) {
        formData.append("material_information", localLineItemFiles["material_information"].file);
      }

      const response: any = await requestWrapper({
        url: API_END_POINTS.creatematerialonboarding,
        method: "POST",
        data: formData,
      });

      console.log("FULL RESPONSE:", response);

      if (response?.status === 200) {
        const sapStatus = response.data?.message?.sap_status;
        const sapMessage = response.data?.message?.sap_message;

        if (sapStatus === "success") {
          alert("Material details sent to SAP successfully!!!");
          router.push("/material-onboarding-dashboard");
        } else {
          alert("Material saved, but SAP integration failed.\n\n" + (sapMessage || ""));
        }

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

  useEffect(() => {
    const revisedFlag = MaterialDetails?.material_request_item?.is_revised_code_new;

    if (revisedFlag === 0 || revisedFlag === false) {
      setIsMatchedMaterial(true);
    } else {
      setIsMatchedMaterial(false);
    }
  }, [MaterialDetails]);


  const getNextApprovalStatus = () => {
    const current = MaterialOnboardingDetails?.approval_status;
    if (role === "SAP") return "Code Generated by SAP";

    if (EDIT_ROLES.includes(role)) {
      if (current === "Sent to SAP") return "Updated By CP";
      if (current === "Pending by SAP") return "Sent to SAP";
      if (["Pending by CP", "Re-Opened by CP"].includes(current || "")) {
        return "Sent to SAP";
      }
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
        {/* === SAP MODAL === */}
        <SAPMaterialModal
          isOpen={showSAPModal}
          onClose={() => setShowSAPModal(false)}
          materialCode={MaterialOnboardingDetails?.material_code_revised || ""}
          materialDescription={MaterialOnboardingDetails?.material_name_description || ""}
          isZCAPMaterial={isZCAPMaterial}
        />

        {/* === DYNAMIC RENDER START === */}
        {MaterialDetails?.material_request_item?.is_revised_code_new ? (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex flex-col gap-2">
            {/* === TABS HEADER === */}
            <div className="sticky top-0 z-10">
              <TabsList className="p-2 flex justify-start flex-wrap bg-[#DDE8FE] rounded-xl gap-3 h-fit text-sm w-full">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="data-[state=active]:bg-[#0C72F5] data-[state=active]:text-white text-[#0C72F5] p-2 rounded-lg text-nowrap"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="flex flex-col p-3 bg-white rounded-[8px] min-h-[88vh] shadow-sm w-full">
              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-0 space-y-4">
                  <MaterialFormSections
                    tab={tab.id}
                    props={props}
                    role={role}
                    isZCAPMaterial={isZCAPMaterial}
                    finalShouldShowAllFields={finalShouldShowAllFields}
                    materialCompanyCode={materialCompanyCode}
                    setMaterialCompanyCode={setMaterialCompanyCode}
                    setIsMaterialCodeEdited={setIsMaterialCodeEdited}
                    filteredProfit={filteredProfit}
                    fileSelected={fileSelected}
                    setFileSelected={setFileSelected}
                    fileName={fileName}
                    setFileName={setFileName}
                    handleLabelClick={handleLabelClick}
                    handleImageChange={handleImageChange}
                    handleRemoveFile={handleRemoveFile}
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
                </TabsContent>
              ))}
              {/* === FOOTER BUTTONS === */}
              <div className="flex justify-between items-center w-full mt-4">
                {/* === User Locked View === */}
                {isCodeGeneratedBySAP || isUserLockedView ? (
                  <div className="flex justify-between w-full">
                    <Button variant="backbtn" size="backbtnsize" onClick={isFirstTab ? onCancel : handlePrevTab} type="button">
                      {isFirstTab ? "Back to Home" : "Back"}
                    </Button>
                    {!isLastTab && (
                      <Button variant="nextbtn" size="nextbtnsize" onClick={handleNextTab} type="button">
                        Next
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    <MaterialFormFooter
                      isFirstTab={isFirstTab}
                      isLastTab={isLastTab}
                      isLoading={isLoading}
                      role={role}
                      approvalStatus={approvalStatus}
                      onNext={handleNextTab}
                      onPrev={handlePrevTab}
                      onCancel={onCancel}
                      onSubmit={onFinalSubmit}
                      onUseExisting={() => onCloseCallback && name ? onCloseCallback(name) : {}}
                      onRevert={() => setShowRemarkDialog(true)}
                      saveAsDraft={saveAsDraft}
                      getButtonLabel={getButtonLabel}
                      isRevisedNewCode={isRevisedNewCode}
                    />
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
          </Tabs>
        ) : (
          <div className="flex flex-col p-3 bg-white rounded-[8px] min-h-[88vh] shadow-sm w-full">
            <div className="space-y-4">
              {/* === REGULAR VERITCAL LAYOUT === */}

              <RequesterDetails MaterialOnboardingDetails={MaterialOnboardingDetails} MaterialDetails={MaterialDetails} form={form} />

              <MaterialInformation
                {...props}
                MaterialDetails={MaterialDetails}
                MaterialType={MaterialType}
                setShouldShowAllFields={setShouldShowAllFields}
                shouldShowAllFields={finalShouldShowAllFields}
                isMaterialCodeEdited={isMaterialCodeEdited}
                setIsMaterialCodeEdited={setIsMaterialCodeEdited}
                setIsMatchedMaterial={setIsMatchedMaterial}
                isZCAPMaterial={isZCAPMaterial}
                materialCompanyCode={materialCompanyCode}
                setMaterialCompanyCode={setMaterialCompanyCode}
                role={role}
                latestCodeSuggestions={latestCodeSuggestions}
                selectedCodeLogic={selectedCodeLogic}
                setSelectedCodeLogic={setSelectedCodeLogic}
              />

              {finalShouldShowAllFields && EDIT_ROLES.includes(role) && (
                <>
                  <Storefields
                    companyInfo={props.companyInfo}
                    role={role}
                    form={form}
                    MaterialDetails={MaterialDetails}
                    MaterialOnboardingDetails={MaterialOnboardingDetails}
                    materialCompanyCode={materialCompanyCode}
                    setMaterialCompanyCode={setMaterialCompanyCode}
                    UnitOfMeasure={props.UnitOfMeasure}
                    MaterialType={MaterialType}
                    plantcode={props.plantcode}
                    AllMaterialType={MaterialType}
                    AvailabilityCheck={props.AvailabilityCheck}
                    MaterialGroup={props.MaterialGroup}
                    SerialProfile={props.SerialProfile}
                    ClassType={props.ClassType}
                    isZCAPMaterial={isZCAPMaterial}
                  />

                  <MaterialPurchasingData {...props} role={role} />

                  <MaterialMRPData {...props} role={role} isZCAPMaterial={isZCAPMaterial} />

                  {!isZCAPMaterial && (
                    <MaterialQAQCData {...props} MaterialDetails={MaterialDetails} />
                  )}

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
                    isZCAPMaterial={isZCAPMaterial}
                    MaterialType={MaterialType}
                    isFileUploading={isFileUploading}
                    localLineItemFiles={localLineItemFiles}
                  />

                  {!isZCAPMaterial && (
                    <MaterialSpecifications {...props} isZCAPMaterial={isZCAPMaterial} />
                  )}

                  <MaterialComment {...props} />
                </>
              )}

              {/* === STATIC FOOTER BUTTONS === */}
              <div className="flex justify-between items-center w-full mt-4">
                {isCodeGeneratedBySAP || isUserLockedView ? (
                  <div className="flex justify-end w-full">
                    <Button variant="backbtn" size="backbtnsize" onClick={onCancel} type="button">
                      Back to Home
                    </Button>
                  </div>
                ) : (
                  <>

                    <MaterialFormFooter
                      isFirstTab={true}
                      isLastTab={true}
                      isLoading={isLoading}
                      role={role}
                      approvalStatus={approvalStatus}
                      onNext={() => { }}
                      onPrev={() => { }}
                      onCancel={onCancel}
                      onSubmit={onFinalSubmit}
                      onRevert={() => setShowRemarkDialog(true)}
                      onUseExisting={() => onCloseCallback && name ? onCloseCallback(name) : {}}
                      saveAsDraft={saveAsDraft}
                      getButtonLabel={getButtonLabel}
                      isRevisedNewCode={false}
                    />
                  </>
                )}
              </div>

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
        )}

        {/* === Floating Save Button Removed === */}
      </div>
    </Form>
  );
};

export default MaterialOnboardingForm;