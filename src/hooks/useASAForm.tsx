import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { ASAForm, CompanyInformation, GeneralDisclosureData, Governance, fileKeys, commentFieldKeys, EnvironmentalManagementSystem, Biodiversity, GreenProducts, EnergyConsumptionAndEmission, WaterConsumptionAndManagement, WasteManagement, EmployeeSatisfaction, LaborRightsAndWorkingConditions, GrievanceMechanism, EmployeeWellBeing, HealthAndSafety } from '@/src/types/asatypes';


type UseASAFormReturn = {
    companyInfo: CompanyInformation;
    generalDisclosure: GeneralDisclosureData;
    governanceform: Governance;
    emsform: EnvironmentalManagementSystem;
    biodiversityForm: Biodiversity;
    greenProductsForm: GreenProducts;
    eceform: EnergyConsumptionAndEmission;
    wcmform: WaterConsumptionAndManagement,
    wastemanagementForm: WasteManagement;
    EmpSatisfactionForm: EmployeeSatisfaction;
    LaborRightsForm: LaborRightsAndWorkingConditions;
    GrievanceMechForm: GrievanceMechanism,
    EmpWellBeingForm: EmployeeWellBeing,
    HealthSafetyForm: HealthAndSafety,
    updateCompanyInfo: (data: CompanyInformation) => void;
    updateGeneralDisclosure: (data: GeneralDisclosureData) => void;
    updateGovernanceForm: (data: Governance) => void;
    updateEmsForm: (data: EnvironmentalManagementSystem) => void
    updateBiodiversityForm: (data: Biodiversity) => void;
    updateGreenProductsForm: (data: GreenProducts) => void;
    updateEceForm: (data: EnergyConsumptionAndEmission) => void;
    updateWcmForm: (data: WaterConsumptionAndManagement) => void;
    updateWasteManagementForm: (data: WasteManagement) => void;
    updateEmpSatisactionForm: (data: EmployeeSatisfaction) => void;
    updateLaborRightsForm: (data: LaborRightsAndWorkingConditions) => void;
    updateGrievnaceMechForm: (data: GrievanceMechanism) => void;
    updateEmpWellBeingForm: (data: EmployeeWellBeing) => void;
    updateHealthSafetyForm: (data: HealthAndSafety) => void;
    submitForm: () => Promise<void>;
    refreshFormData: () => void;
    submitGoveranceForm: () => Promise<boolean>;
    submitEnvironmentForm: () => Promise<void>;
    submitSocialForm: () => Promise<void>;
    ASAformName: string;
    // VerifyASAForm: (asaFormName: string) => Promise<any>;
    asaFormSubmitData: ASAForm;

};

export const useASAForm = (): UseASAFormReturn => {
    const [companyInfo, setCompanyInfo] = useState<CompanyInformation>({
        name_of_the_company: { selection: "", comment: "", file: null },
        location: { selection: "", comment: "", file: null },
        name_of_product: { selection: "", comment: "", file: null }
    });

    const [generalDisclosure, setGeneralDisclosure] = useState<GeneralDisclosureData>({
        valid_consent_from_pollution_control: { selection: "", comment: "", file: null },
        recycle_plastic_package_material: { selection: "", comment: "", file: null },
        plans_for_recycle_materials: { selection: "", comment: "", file: null },
    });

    const [governanceform, setgovernanceform] = useState<Governance>({
        have_formal_governance_structure: { selection: "", comment: "", file: null },
        esg_policies_coverage: { selection: "", comment: "", file: null },
        esg_risk_integration: { selection: "", comment: "", file: null },
        company_publish_sustainability_report: { selection: "", comment: "", file: null },
        esg_rating_participated: { selection: "", comment: "", file: null },
        esg_incentive_for_employee: { selection: "", comment: "", file: null },
        csat_survey_conducted: { selection: "", comment: "", file: null },
        instance_of_loss_customer_data: { selection: "", comment: "", file: null }
    });

    const [emsform, setEmsForm] = useState<EnvironmentalManagementSystem>({
        environment_sustainability_policy: { selection: "", comment: "", file: null },
        environmental_management_certification: { selection: "", comment: "", file: null },
        regular_audits_conducted: { selection: "", comment: "", file: null },
    });

    const [eceform, setEceForm] = useState<EnergyConsumptionAndEmission>({
        energy_consumption_tracking: { selection: "", comment: "", file: null },
        company_track_greenhouse_gas: { selection: "", comment: "", file: null },
        consume_renewable_energy: { selection: "", comment: "", file: null },
        have_system_to_control_air_emission: { selection: "", comment: "", file: null },
        have_target_for_increase_renewable_share: { selection: "", comment: "", file: null },
        have_target_to_reduce_energy_consumption: { selection: "", comment: "", file: null },
        have_plan_to_improve_energy_efficiency: { selection: "", comment: "", file: null },
        have_targets_to_reduce_emission: { selection: "", comment: "", file: null },
        pcf_conducted: { selection: "", comment: "", file: null },
    });

    const [wcmform, setWcmForm] = useState<WaterConsumptionAndManagement>({
        water_source_tracking: { selection: "", comment: "", file: null },
        have_permission_for_groundwater: { selection: "", comment: "", file: null },
        has_system_to_track_water_withdrawals: { selection: "", comment: "", file: null },
        have_facility_to_recycle_wastewater: { selection: "", comment: "", file: null },
        have_zld_strategy: { selection: "", comment: "", file: null },
        have_initiatives_to_increase_water_efficiency: { selection: "", comment: "", file: null },
        have_targets_to_reduce_water_consumption: { selection: "", comment: "", file: null },
    });

    const [wastemanagementForm, setWasteManagementForm] = useState<WasteManagement>({
        track_waste_generation: { selection: "", comment: "", file: null },
        handover_waste_to_authorized_vendor: { selection: "", comment: "", file: null },
        vendor_audits_for_waste_management: { selection: "", comment: "", file: null },
        have_epr_for_waste_management: { selection: "", comment: "", file: null },
        have_goals_to_reduce_waste: { selection: "", comment: "", file: null },
    });

    const [biodiversityForm, setBiodiversityForm] = useState<Biodiversity>({
        have_policy_on_biodiversity: { selection: "", comment: "", file: null },
    });

    const [greenProductsForm, setGreenProductsForm] = useState<GreenProducts>({
        certified_green_projects: { selection: "", comment: "", file: null },
    });

    const [EmpSatisfactionForm, setEmpSatisfactionForm] = useState<EmployeeSatisfaction>({
        conduct_esat: { selection: "", comment: "", file: null },
    });

    const [LaborRightsForm, setLaborRightsForm] = useState<LaborRightsAndWorkingConditions>({
        have_prohibition_policy_of_child_labor: { selection: "", comment: "", file: null },
        age_verification_before_hiring: { selection: "", comment: "", file: null },
        ensure_modern_slavery_labor_policy: { selection: "", comment: "", file: null },
        have_non_discrimination_policy: { selection: "", comment: "", file: null },
        has_setup_safety_report_incidents: { selection: "", comment: "", file: null },
        pending_legal_cases_workplace_harassment: { selection: "", comment: "", file: null },
        comply_minimum_wage_law_regulation: { selection: "", comment: "", file: null },
        legal_working_hours: { selection: "", comment: "", file: null },
        work_hrs_track_by_company: { selection: "", comment: "", file: null },
        has_diversity_inclusion_policy: { selection: "", comment: "", file: null },
        have_target_to_promote_diversity: { selection: "", comment: "", file: null },
    });

    const [GrievanceMechForm, setGrievanceMechForm] = useState<GrievanceMechanism>({
        have_grievance_mechanism: { selection: "", comment: "", file: null },
    });

    const [EmpWellBeingForm, setEmpWellBeingForm] = useState<EmployeeWellBeing>({
        any_emp_well_being_initiative: { selection: "", comment: "", file: null },
    });

    const [HealthSafetyForm, setHealthSafetyForm] = useState<HealthAndSafety>({
        has_develop_health_safety_policy: { selection: "", comment: "", file: null },
        have_healthy_safety_management: { selection: "", comment: "", file: null },
        conduct_hira_activity: { selection: "", comment: "", file: null },
        certify_ohs_system: { selection: "", comment: "", file: null },
        emp_trained_health_safety: { selection: "", comment: "", file: null },
        track_health_safety_indicators: { selection: "", comment: "", file: null },
        provide_any_healthcare_services: { selection: "", comment: "", file: null },
    });

    const params = useSearchParams();
    const router = useRouter();
    const vms_ref_no = params.get("vms_ref_no") || "";
    const [shouldFetch, setShouldFetch] = useState(true);
    const [ASAformName, setASAFormName] = useState("");
    const [asaFormSubmitData, setAsaFormSubmitData] = useState<ASAForm>({});


    useEffect(() => {
        const fetchFormData = async () => {
            if (!vms_ref_no || !shouldFetch) return;

            const loadLocalStorage = (key: string) => {
                try {
                    const stored = localStorage.getItem(key);
                    if (stored) {
                        console.log(`Found ${key} in localStorage`);
                        return JSON.parse(stored);
                    }
                } catch (err) {
                    console.error(`Error parsing ${key}:`, err);
                }
                return null;
            };

            const localForms = {
                CompanyInfoForm: loadLocalStorage("companyInfo"),
                EMSForm: loadLocalStorage("EMSForm"),
                ECEForm: loadLocalStorage("ECEForm"),
                WCMForm: loadLocalStorage("WCMForm"),
                WasteManagementForm: loadLocalStorage("WasteManagementForm"),
                GreenProductsForm: loadLocalStorage("GreenProductsForm"),
                LaborRightsForm: loadLocalStorage("LaborRightsForm"),
                GrievanceMechForm: loadLocalStorage("GrivenanceForm"),
                EmpWellBeingForm: loadLocalStorage("EmpWellBeingForm"),
                HealthSafetyForm: loadLocalStorage("HealthSafetyForm"),
                EmpSatisfactionForm: loadLocalStorage("EmpSatisfactionForm")
            };
            // if (localForms.CompanyInfoForm) setCompanyInfo(localForms.CompanyInfoForm);
            if (localForms.CompanyInfoForm) {
                console.log("Setting Company Info from localStorage", localForms.CompanyInfoForm);
                setCompanyInfo(localForms.CompanyInfoForm);
            }
            if (localForms.EMSForm) setEmsForm(localForms.EMSForm);
            if (localForms.ECEForm) setEceForm(localForms.ECEForm);
            if (localForms.WCMForm) setWcmForm(localForms.WCMForm);
            if (localForms.WasteManagementForm) setWasteManagementForm(localForms.WasteManagementForm);
            if (localForms.GreenProductsForm) setGreenProductsForm(localForms.GreenProductsForm);
            if (localForms.LaborRightsForm) setLaborRightsForm(localForms.LaborRightsForm);
            if (localForms.GrievanceMechForm) setGrievanceMechForm(localForms.GrievanceMechForm);
            if (localForms.EmpWellBeingForm) setEmpWellBeingForm(localForms.EmpWellBeingForm);
            if (localForms.HealthSafetyForm) setHealthSafetyForm(localForms.HealthSafetyForm);
            if (localForms.EmpSatisfactionForm) setEmpSatisfactionForm(localForms.EmpSatisfactionForm);

            try {
                const response = await requestWrapper({
                    url: `${API_END_POINTS.getASAFormSubmit}?vendor_ref_no=${encodeURIComponent(vms_ref_no)}`,
                    method: 'GET',
                });

                // console.log('Fetched ASA Form Data:', response);
                const data = response?.data?.message || {};
                setAsaFormSubmitData(data);
                const ASADoctypename = data?.name || "";
                setASAFormName(ASADoctypename);
                // setCompanyInfo({
                //     name_of_the_company: data?.company_information?.name_of_the_company || "",
                //     location: data?.company_information?.location || "",
                //     name_of_product: data?.company_information?.name_of_product || "",
                // });

                const parseSection = (
                    sectionData: any,
                    setState: Function,
                    stateKey: keyof typeof localForms | ""
                ) => {
                    if (!sectionData) {
                        console.warn(`Missing section data for ${stateKey}`);
                        return;
                    }
                    if (stateKey && localForms[stateKey]) return;

                    setState((prev: any) => {
                        const updated: any = { ...prev };
                        for (const key in prev) {
                            const fileKey = fileKeys[key as keyof typeof fileKeys];
                            const commentKey = commentFieldKeys[key as keyof typeof commentFieldKeys];
                            updated[key] = {
                                selection: sectionData[key] || "",
                                comment: commentKey ? sectionData[commentKey] || "" : "",
                                file: fileKey && sectionData[fileKey]?.url ? sectionData[fileKey] : null,
                            };
                        }
                        return updated;
                    });
                };

                parseSection(data?.general_disclosure, setGeneralDisclosure, "");
                parseSection(data?.governance, setgovernanceform, "");
                parseSection(data?.biodiversity, setBiodiversityForm, "");
                parseSection(data?.emp_satisfaction, setEmpSatisfactionForm, "");
                parseSection(data?.company_information, setCompanyInfo, "CompanyInfoForm");
                parseSection(data?.env_manage_system, setEmsForm, "EMSForm");
                parseSection(data?.energy_cons_emis, setEceForm, "ECEForm");
                parseSection(data?.water_cons_mang, setWcmForm, "WCMForm");
                parseSection(data?.waste_management, setWasteManagementForm, "WasteManagementForm");
                parseSection(data?.green_products, setGreenProductsForm, "GreenProductsForm");
                parseSection(data?.labor_rights_condi, setLaborRightsForm, "LaborRightsForm");
                parseSection(data?.griv_mechanism, setGrievanceMechForm, "GrievanceMechForm");
                parseSection(data?.emp_well_being, setEmpWellBeingForm, "EmpWellBeingForm");
                parseSection(data?.health_safety, setHealthSafetyForm, "HealthSafetyForm");
                parseSection(data?.emp_satisfaction, setEmpSatisfactionForm, "EmpSatisfactionForm");

                setShouldFetch(false);
            } catch (error) {
                console.error('Error fetching ASA form data:', error);
            }
        };

        fetchFormData();
    }, [vms_ref_no, shouldFetch, ASAformName]);

    console.log("Complete ASA Form Data-->", asaFormSubmitData)

    useEffect(() => {
        // console.log("Updated ASAformName from state:", ASAformName);
    }, [ASAformName]);

    const refreshFormData = () => setShouldFetch(true);

    const updateCompanyInfo = (data: CompanyInformation) => {
        setCompanyInfo(data);
    };

    const updateGeneralDisclosure = (data: GeneralDisclosureData) => {
        setGeneralDisclosure(data);
    };

    const updateGovernanceForm = (data: Governance) => {
        setgovernanceform(data);
    };

    const updateEmsForm = (data: EnvironmentalManagementSystem) => {
        setEmsForm(data);
    };

    const updateEceForm = (data: EnergyConsumptionAndEmission) => {
        setEceForm(data);
    };

    const updateWcmForm = (data: WaterConsumptionAndManagement) => {
        setWcmForm(data);
    };

    const updateWasteManagementForm = (data: WasteManagement) => {
        setWasteManagementForm(data);
    };

    const updateBiodiversityForm = (data: Biodiversity) => {
        setBiodiversityForm(data);
    };

    const updateGreenProductsForm = (data: GreenProducts) => {
        setGreenProductsForm(data);
    };

    const updateEmpSatisactionForm = (data: EmployeeSatisfaction) => {
        setEmpSatisfactionForm(data);
    };

    const updateLaborRightsForm = (data: LaborRightsAndWorkingConditions) => {
        setLaborRightsForm(data);
    };

    const updateGrievnaceMechForm = (data: GrievanceMechanism) => {
        setGrievanceMechForm(data);
    };

    const updateEmpWellBeingForm = (data: EmployeeWellBeing) => {
        setEmpWellBeingForm(data);
    };

    const updateHealthSafetyForm = (data: HealthAndSafety) => {
        setHealthSafetyForm(data)
    };

    // ASA Initial Form Submit API 
    const submitForm = async () => {
        const localCompanyInfo = localStorage.getItem("companyInfo");
        let formCompanyInfo = companyInfo;

        if (localCompanyInfo) {
            try {
                formCompanyInfo = JSON.parse(localCompanyInfo);
                updateCompanyInfo(formCompanyInfo);
            } catch (err) {
                console.error("Error parsing localStorage companyInfo:", err);
            }
        }
        const formData = new FormData();
        const dataPayload: ASAForm = {
            vendor_ref_no: vms_ref_no,
            name_of_the_company: formCompanyInfo.name_of_the_company.selection,
            location: formCompanyInfo.location.selection,
            name_of_product: formCompanyInfo.name_of_product.selection,

            valid_consent_from_pollution_control: generalDisclosure.valid_consent_from_pollution_control.selection,
            expiry_date_of_consent: generalDisclosure.valid_consent_from_pollution_control.comment,

            recycle_plastic_package_material: generalDisclosure.recycle_plastic_package_material.selection,
            recycle_plastic_details: generalDisclosure.recycle_plastic_package_material.comment,

            plans_for_recycle_materials: generalDisclosure.plans_for_recycle_materials.selection,
            details_to_increase_recycle_material: generalDisclosure.plans_for_recycle_materials.comment,
        };
        formData.append("data", JSON.stringify(dataPayload));

        // Attach files separately, using expected field names
        if (generalDisclosure.valid_consent_from_pollution_control.file) {
            if (generalDisclosure.valid_consent_from_pollution_control.file instanceof File) {
                formData.append("valid_consent", generalDisclosure.valid_consent_from_pollution_control.file);
            }
        }
        if (generalDisclosure.recycle_plastic_package_material.file) {
            if (generalDisclosure.recycle_plastic_package_material.file instanceof File) {
                formData.append("upload_file_2", generalDisclosure.recycle_plastic_package_material.file);
            }
        }
        if (generalDisclosure.plans_for_recycle_materials.file) {
            if (generalDisclosure.plans_for_recycle_materials.file instanceof File) {
                formData.append("upload_file_3", generalDisclosure.plans_for_recycle_materials.file);
            }
        }

        console.log("Submitting ASA Form Data:");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            const response = await fetch(API_END_POINTS.asaformSubmit, {
                method: "POST",
                body: formData,
            });

            const res = await response.json();

            if (!response.ok || res.message?.status !== "success") {
                const errMsg =
                    typeof res.message === "string"
                        ? res.message
                        : res.message?.message || "Something went wrong while submitting the form.";
                throw new Error(errMsg);
            }
            console.log("Form submission successful:", res);
            localStorage.removeItem("companyInfo");
            router.push(`asa-form?tabtype=ems&vms_ref_no=${vms_ref_no}`);

        } catch (err) {
            console.error("Form submission failed:", err);
        }
    };

    const submitGoveranceForm = async (): Promise<boolean> => {
        try {
            const formData = new FormData();

            const dataPayload: ASAForm = {
                vendor_ref_no: vms_ref_no,
                name: ASAformName,
                form_is_submitted: 1,
                have_formal_governance_structure: governanceform.have_formal_governance_structure.selection,
                details_1: governanceform.have_formal_governance_structure.comment,

                esg_policies_coverage: governanceform.esg_policies_coverage.selection,
                details_2: governanceform.esg_policies_coverage.comment,

                esg_risk_integration: governanceform.esg_risk_integration.selection,
                details_3: governanceform.esg_risk_integration.comment,

                company_publish_sustainability_report: governanceform.company_publish_sustainability_report.selection,
                details_4: governanceform.company_publish_sustainability_report.comment,

                esg_rating_participated: governanceform.esg_rating_participated.selection,
                esg_rating_score: governanceform.esg_rating_participated.comment,

                esg_incentive_for_employee: governanceform.esg_incentive_for_employee.selection,
                details_6: governanceform.esg_incentive_for_employee.comment,

                csat_survey_conducted: governanceform.csat_survey_conducted.selection,
                csat_score: governanceform.csat_survey_conducted.comment,

                instance_of_loss_customer_data: governanceform.instance_of_loss_customer_data.selection,
                no_of_loss_data_incidents: governanceform.instance_of_loss_customer_data.comment,
            };

            formData.append("data", JSON.stringify(dataPayload));

            // Attach files
            const fileMap = [
                { file: governanceform.have_formal_governance_structure.file, name: "upload_file_1" },
                { file: governanceform.esg_policies_coverage.file, name: "upload_file_2" },
                { file: governanceform.esg_risk_integration.file, name: "upload_file_3" },
                { file: governanceform.company_publish_sustainability_report.file, name: "upload_file_4" },
                { file: governanceform.esg_rating_participated.file, name: "upload_file_5" },
                { file: governanceform.esg_incentive_for_employee.file, name: "upload_file_6" },
                { file: governanceform.csat_survey_conducted.file, name: "upload_file_7" },
                { file: governanceform.instance_of_loss_customer_data.file, name: "upload_file_8" },
            ];

            fileMap.forEach(({ file, name }) => {
                if (file instanceof File) {
                    formData.append(name, file);
                }
            });

            console.log("Submitting ASA Form Data:");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await fetch(API_END_POINTS.asagrovernanceformSubmit, {
                method: "POST",
                body: formData,
            });

            const res = await response.json();

            if (!response.ok || res.message?.status !== "success") {
                const errMsg =
                    typeof res.message === "string"
                        ? res.message
                        : res.message?.message || "Something went wrong while submitting the form.";
                console.error("Form submission failed:", errMsg);
                return false;
            }
            console.log("Governance Form submission successful:", res);
            return true;
        } catch (err) {
            console.error("Form submission failed:", err);
            return false;
        }
    };

    // Environment Form Submit API
    const submitEnvironmentForm = async () => {
        const localemsform = localStorage.getItem("EMSForm");
        const localeceform = localStorage.getItem("ECEForm");
        const localwcmform = localStorage.getItem("WCMForm");
        const localwastermanagementForm = localStorage.getItem("WasteManagementForm");
        const localgreenProductsForm = localStorage.getItem("GreenProductsForm");
        let formemsform = emsform;
        let formeceform = eceform;
        let formwcmform = wcmform;
        let formwastermanagementForm = wastemanagementForm;
        let localGreenProductsForm = greenProductsForm;

        if (localemsform) {
            try {
                formemsform = JSON.parse(localemsform);
                updateEmsForm(formemsform);
            } catch (err) {
                console.error("Error parsing localStorage companyInfo:", err);
            }
        }
        if (localeceform) {
            try {
                formeceform = JSON.parse(localeceform);
                updateEceForm(formeceform);
            } catch (err) {
                console.error("Error parsing localStorage eceform:", err);
            }
        }
        if (localwcmform) {
            try {
                formwcmform = JSON.parse(localwcmform);
                updateWcmForm(formwcmform);
            } catch (err) {
                console.error("Error parsing localStorage wcmform:", err);
            }
        }
        if (localwastermanagementForm) {
            try {
                formwastermanagementForm = JSON.parse(localwastermanagementForm);
                updateWasteManagementForm(formwastermanagementForm);
            } catch (err) {
                console.error("Error parsing localStorage wastermanagementForm:", err);
            }
        }
        if (localgreenProductsForm) {
            try {
                localGreenProductsForm = JSON.parse(localgreenProductsForm);
                updateGreenProductsForm(localGreenProductsForm);
            } catch (err) {
                console.error("Error parsing localStorage greenProductsForm:", err);
            }
        }
        console.log("Green Products Form--->", greenProductsForm);
        const formData = new FormData();
        const dataPayload: ASAForm = {
            vendor_ref_no: vms_ref_no,
            name: ASAformName,
            environment_sustainability_policy: formemsform.environment_sustainability_policy.selection,
            details_1: formemsform.environment_sustainability_policy.comment,
            environmental_management_certification: formemsform.environmental_management_certification.selection,
            details_2: formemsform.environmental_management_certification.comment,
            regular_audits_conducted: formemsform.regular_audits_conducted.selection,
            details_3: formemsform.regular_audits_conducted.comment,
            // Bio-Diversity Form
            have_policy_on_biodiversity: biodiversityForm.have_policy_on_biodiversity.selection,
            details_26: biodiversityForm.have_policy_on_biodiversity.comment,
            // Green Products Form
            certified_green_projects: greenProductsForm.certified_green_projects.selection,
            details_25: greenProductsForm.certified_green_projects.comment,
            // ECE Form
            energy_consumption_tracking: formeceform.energy_consumption_tracking.selection,
            total_energy_consumed: formeceform.energy_consumption_tracking.comment,
            company_track_greenhouse_gas: formeceform.company_track_greenhouse_gas.selection,
            scope_wise_chg_emission: formeceform.company_track_greenhouse_gas.comment,
            consume_renewable_energy: formeceform.consume_renewable_energy.selection,
            total_renewable_energy_consumption: formeceform.consume_renewable_energy.comment,
            have_system_to_control_air_emission: formeceform.have_system_to_control_air_emission.selection,
            details_of_system_to_control_air_emission: formeceform.have_system_to_control_air_emission.comment,
            have_target_for_increase_renewable_share: formeceform.have_target_for_increase_renewable_share.selection,
            mention_target_for_increase_renewable_share: formeceform.have_target_for_increase_renewable_share.comment,
            have_target_to_reduce_energy_consumption: formeceform.have_target_to_reduce_energy_consumption.selection,
            mention_target_to_reduce_energy_consumption: formeceform.have_target_to_reduce_energy_consumption.comment,
            have_plan_to_improve_energy_efficiency: formeceform.have_plan_to_improve_energy_efficiency.selection,
            list_plan_to_improve_energy_efficiency: formeceform.have_plan_to_improve_energy_efficiency.comment,
            have_targets_to_reduce_emission: formeceform.have_targets_to_reduce_emission.selection,
            details_of_targets_to_reduce_emission: formeceform.have_targets_to_reduce_emission.comment,
            pcf_conducted: formeceform.pcf_conducted.selection,
            details_12: formeceform.pcf_conducted.comment,
            // WCM Form
            water_source_tracking: formwcmform.water_source_tracking.selection,
            details_13: formwcmform.water_source_tracking.comment,
            have_permission_for_groundwater: formwcmform.have_permission_for_groundwater.selection,
            details_14: formwcmform.have_permission_for_groundwater.comment,
            has_system_to_track_water_withdrawals: formwcmform.has_system_to_track_water_withdrawals.selection,
            details_15: formwcmform.has_system_to_track_water_withdrawals.comment,
            have_facility_to_recycle_wastewater: formwcmform.have_facility_to_recycle_wastewater.selection,
            details_16: formwcmform.have_facility_to_recycle_wastewater.comment,
            have_zld_strategy: formwcmform.have_zld_strategy.selection,
            details_17: formwcmform.have_zld_strategy.comment,
            have_initiatives_to_increase_water_efficiency: formwcmform.have_initiatives_to_increase_water_efficiency.selection,
            details_to_increase_water_efficiency: formwcmform.have_initiatives_to_increase_water_efficiency.comment,
            have_targets_to_reduce_water_consumption: formwcmform.have_targets_to_reduce_water_consumption.selection,
            targets_to_reduce_water_consumption: formwcmform.have_targets_to_reduce_water_consumption.comment,
            // Waste Management Form
            track_waste_generation: formwastermanagementForm.track_waste_generation.selection,
            details_20: formwastermanagementForm.track_waste_generation.comment,
            handover_waste_to_authorized_vendor: formwastermanagementForm.handover_waste_to_authorized_vendor.selection,
            details_21: formwastermanagementForm.handover_waste_to_authorized_vendor.comment,
            vendor_audits_for_waste_management: formwastermanagementForm.vendor_audits_for_waste_management.selection,
            details_22: formwastermanagementForm.vendor_audits_for_waste_management.comment,
            have_epr_for_waste_management: formwastermanagementForm.have_epr_for_waste_management.selection,
            details_23: formwastermanagementForm.have_epr_for_waste_management.comment,
            have_goals_to_reduce_waste: formwastermanagementForm.have_goals_to_reduce_waste.selection,
            details_of_goals_to_reduce_waste: formwastermanagementForm.have_goals_to_reduce_waste.comment,
        };
        formData.append("data", JSON.stringify(dataPayload));
        console.log("ASA Form Name--->", ASAformName);

        if (formemsform.environment_sustainability_policy.file) {
            if (formemsform.environment_sustainability_policy.file instanceof File) {
                formData.append("upload_file_1", formemsform.environment_sustainability_policy.file);
            }
        }
        if (formemsform.environmental_management_certification.file) {
            if (formemsform.environmental_management_certification.file instanceof File) {
                formData.append("upload_file_2", formemsform.environmental_management_certification.file);
            }
        }
        if (formemsform.regular_audits_conducted.file) {
            if (formemsform.regular_audits_conducted.file instanceof File) {
                formData.append("upload_file_3", formemsform.regular_audits_conducted.file);
            }
        }
        if (biodiversityForm.have_policy_on_biodiversity.file) {
            if (biodiversityForm.have_policy_on_biodiversity.file instanceof File) {
                formData.append("upload_file_26", biodiversityForm.have_policy_on_biodiversity.file);
            }
        }
        if (greenProductsForm.certified_green_projects.file) {
            if (greenProductsForm.certified_green_projects.file instanceof File) {
                formData.append("upload_file_25", greenProductsForm.certified_green_projects.file);
            }
        }
        if (formeceform.energy_consumption_tracking.file) {
            if (formeceform.energy_consumption_tracking.file instanceof File) {
                formData.append("upload_file_4", formeceform.energy_consumption_tracking.file);
            }
        }
        if (formeceform.company_track_greenhouse_gas.file) {
            if (formeceform.company_track_greenhouse_gas.file instanceof File) {
                formData.append("upload_file_5", formeceform.company_track_greenhouse_gas.file);
            }
        }
        if (formeceform.consume_renewable_energy.file) {
            if (formeceform.consume_renewable_energy.file instanceof File) {
                formData.append("upload_file_6", formeceform.consume_renewable_energy.file);
            }
        }
        if (formeceform.have_system_to_control_air_emission.file) {
            if (formeceform.have_system_to_control_air_emission.file instanceof File) {
                formData.append("upload_file_7", formeceform.have_system_to_control_air_emission.file);
            }
        }
        if (formeceform.have_target_for_increase_renewable_share.file) {
            if (formeceform.have_target_for_increase_renewable_share.file instanceof File) {
                formData.append("upload_file_8", formeceform.have_target_for_increase_renewable_share.file);
            }
        }
        if (formeceform.have_target_to_reduce_energy_consumption.file) {
            if (formeceform.have_target_to_reduce_energy_consumption.file instanceof File) {
                formData.append("upload_file_9", formeceform.have_target_to_reduce_energy_consumption.file);
            }
        }
        if (formeceform.have_plan_to_improve_energy_efficiency.file) {
            if (formeceform.have_plan_to_improve_energy_efficiency.file instanceof File) {
                formData.append("upload_file_10", formeceform.have_plan_to_improve_energy_efficiency.file);
            }
        }
        if (formeceform.have_targets_to_reduce_emission.file) {
            if (formeceform.have_targets_to_reduce_emission.file instanceof File) {
                formData.append("upload_file_11", formeceform.have_targets_to_reduce_emission.file);
            }
        }
        if (formeceform.pcf_conducted.file) {
            if (formeceform.pcf_conducted.file instanceof File) {
                formData.append("upload_file_12", formeceform.pcf_conducted.file);
            }
        }
        if (formwcmform.water_source_tracking.file) {
            if (formwcmform.water_source_tracking.file instanceof File) {
                formData.append("upload_file_13", formwcmform.water_source_tracking.file);
            }
        }
        if (formwcmform.have_permission_for_groundwater.file) {
            if (formwcmform.have_permission_for_groundwater.file instanceof File) {
                formData.append("upload_file_14", formwcmform.have_permission_for_groundwater.file);
            }
        }
        if (formwcmform.has_system_to_track_water_withdrawals.file) {
            if (formwcmform.has_system_to_track_water_withdrawals.file instanceof File) {
                formData.append("upload_file_15", formwcmform.has_system_to_track_water_withdrawals.file);
            }
        }
        if (formwcmform.have_facility_to_recycle_wastewater.file) {
            if (formwcmform.have_facility_to_recycle_wastewater.file instanceof File) {
                formData.append("upload_file_16", formwcmform.have_facility_to_recycle_wastewater.file);
            }
        }
        if (formwcmform.have_zld_strategy.file) {
            if (formwcmform.have_zld_strategy.file instanceof File) {
                formData.append("upload_file_17", formwcmform.have_zld_strategy.file);
            }
        }
        if (formwcmform.have_initiatives_to_increase_water_efficiency.file) {
            if (formwcmform.have_initiatives_to_increase_water_efficiency.file instanceof File) {
                formData.append("upload_file_18", formwcmform.have_initiatives_to_increase_water_efficiency.file);
            }
        }
        if (formwcmform.have_targets_to_reduce_water_consumption.file) {
            if (formwcmform.have_targets_to_reduce_water_consumption.file instanceof File) {
                formData.append("upload_file_19", formwcmform.have_targets_to_reduce_water_consumption.file);
            }
        }
        if (formwastermanagementForm.track_waste_generation.file) {
            if (formwastermanagementForm.track_waste_generation.file instanceof File) {
                formData.append("upload_file_20", formwastermanagementForm.track_waste_generation.file);
            }
        }
        if (formwastermanagementForm.handover_waste_to_authorized_vendor.file) {
            if (formwastermanagementForm.handover_waste_to_authorized_vendor.file instanceof File) {
                formData.append("upload_file_21", formwastermanagementForm.handover_waste_to_authorized_vendor.file);
            }
        }
        if (formwastermanagementForm.vendor_audits_for_waste_management.file) {
            if (formwastermanagementForm.vendor_audits_for_waste_management.file instanceof File) {
                formData.append("upload_file_22", formwastermanagementForm.vendor_audits_for_waste_management.file);
            }
        }
        if (formwastermanagementForm.have_epr_for_waste_management.file) {
            if (formwastermanagementForm.have_epr_for_waste_management.file instanceof File) {
                formData.append("upload_file_23", formwastermanagementForm.have_epr_for_waste_management.file);
            }
        }
        if (formwastermanagementForm.have_goals_to_reduce_waste.file) {
            if (formwastermanagementForm.have_goals_to_reduce_waste.file instanceof File) {
                formData.append("upload_file_24", formwastermanagementForm.have_goals_to_reduce_waste.file);
            }
        }
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        try {
            const response = await fetch(API_END_POINTS.asaenvformSubmit, {
                method: "POST",
                body: formData,
            });

            const res = await response.json();

            if (!response.ok || res.message?.status !== "success") {
                const errMsg =
                    typeof res.message === "string"
                        ? res.message
                        : res.message?.message || "Something went wrong while submitting the form.";
                throw new Error(errMsg);
            }
            console.log("EMS Form submission successful:", res);
            localStorage.removeItem("companyInfo");
            localStorage.removeItem("EMSForm");
            localStorage.removeItem("ECEForm");
            localStorage.removeItem("WCMForm");
            localStorage.removeItem("GreenProductsForm");
            localStorage.removeItem("WasteManagementForm");
            router.push(`asa-form?tabtype=labor_rights&vms_ref_no=${vms_ref_no}`);

        } catch (err) {
            console.error("EMS Form submission failed:", err);
        }
    };

    // Social For Submit API
    const submitSocialForm = async () => {
        const locallaborrightform = localStorage.getItem("LaborRightsForm");
        const localgrivancemechform = localStorage.getItem("GrievanceMechForm");
        const localempwellbeingform = localStorage.getItem("EmpWellBeingForm");
        const localhealthsafetyform = localStorage.getItem("HealthSafetyForm");
        const localMentionBehaviorBaseSafety = localStorage.getItem("mention_behavior_base_safety") || "";
        let formlaborrightform = LaborRightsForm;
        let formgrivancemechform = GrievanceMechForm;
        let formempwellbeingform = EmpWellBeingForm;
        let formhealthsafetyform = HealthSafetyForm;

        if (locallaborrightform) {
            try {
                formlaborrightform = JSON.parse(locallaborrightform);
                updateLaborRightsForm(formlaborrightform);
            } catch (err) {
                console.error("Error parsing localStorage companyInfo:", err);
            }
        }
        if (localgrivancemechform) {
            try {
                formgrivancemechform = JSON.parse(localgrivancemechform);
                updateGrievnaceMechForm(formgrivancemechform);
            } catch (err) {
                console.error("Error parsing localStorage companyInfo:", err);
            }
        }
        if (localempwellbeingform) {
            try {
                formempwellbeingform = JSON.parse(localempwellbeingform);
                updateEmpWellBeingForm(formempwellbeingform);
            } catch (err) {
                console.error("Error parsing localStorage companyInfo:", err);
            }
        }
        if (localhealthsafetyform) {
            try {
                formhealthsafetyform = JSON.parse(localhealthsafetyform);
                updateHealthSafetyForm(formhealthsafetyform);
            } catch (err) {
                console.error("Error parsing localStorage companyInfo:", err);
            }
        }
        const formData = new FormData();
        const dataPayload: ASAForm = {
            vendor_ref_no: vms_ref_no,
            name: ASAformName,
            // Emp. Satisfaction Form
            conduct_esat: EmpSatisfactionForm.conduct_esat.selection,
            esat_score: EmpSatisfactionForm.conduct_esat.comment,
            // Labor Rights Form
            have_prohibition_policy_of_child_labor: formlaborrightform.have_prohibition_policy_of_child_labor.selection,
            details_1: formlaborrightform.have_prohibition_policy_of_child_labor.comment,
            age_verification_before_hiring: formlaborrightform.age_verification_before_hiring.selection,
            details_2: formlaborrightform.age_verification_before_hiring.comment,
            ensure_modern_slavery_labor_policy: formlaborrightform.ensure_modern_slavery_labor_policy.selection,
            details_3: formlaborrightform.ensure_modern_slavery_labor_policy.comment,
            have_non_discrimination_policy: formlaborrightform.have_non_discrimination_policy.selection,
            details_4: formlaborrightform.have_non_discrimination_policy.comment,
            has_setup_safety_report_incidents: formlaborrightform.has_setup_safety_report_incidents.selection,
            details_5: formlaborrightform.has_setup_safety_report_incidents.comment,
            pending_legal_cases_workplace_harassment: formlaborrightform.pending_legal_cases_workplace_harassment.selection,
            details_of_pending_legal_cases: formlaborrightform.pending_legal_cases_workplace_harassment.comment,
            comply_minimum_wage_law_regulation: formlaborrightform.comply_minimum_wage_law_regulation.selection,
            details_7: formlaborrightform.comply_minimum_wage_law_regulation.comment,
            legal_working_hours: formlaborrightform.legal_working_hours.selection,
            details_8: formlaborrightform.legal_working_hours.comment,
            work_hrs_track_by_company: formlaborrightform.work_hrs_track_by_company.selection,
            details_9: formlaborrightform.work_hrs_track_by_company.comment,
            has_diversity_inclusion_policy: formlaborrightform.has_diversity_inclusion_policy.selection,
            details_10: formlaborrightform.has_diversity_inclusion_policy.comment,
            have_target_to_promote_diversity: formlaborrightform.have_target_to_promote_diversity.selection,
            details_of_targets: formlaborrightform.have_target_to_promote_diversity.comment,
            // Grivance Mechanism
            have_grievance_mechanism: formgrivancemechform.have_grievance_mechanism.selection,
            details_12: formgrivancemechform.have_grievance_mechanism.comment,
            //Emp. Well Being Form
            any_emp_well_being_initiative: formempwellbeingform.any_emp_well_being_initiative.selection,
            details_of_initiatives: formempwellbeingform.any_emp_well_being_initiative.comment,
            //Health & Safety Form
            has_develop_health_safety_policy: formhealthsafetyform.has_develop_health_safety_policy.selection,
            details_14: formhealthsafetyform.has_develop_health_safety_policy.comment,
            have_healthy_safety_management: formhealthsafetyform.have_healthy_safety_management.selection,
            details_15: formhealthsafetyform.have_healthy_safety_management.comment,
            conduct_hira_activity: formhealthsafetyform.conduct_hira_activity.selection,
            details_16: formhealthsafetyform.conduct_hira_activity.comment,
            certify_ohs_system: formhealthsafetyform.certify_ohs_system.selection,
            details_17: formhealthsafetyform.certify_ohs_system.comment,
            emp_trained_health_safety: formhealthsafetyform.emp_trained_health_safety.selection,
            details_18: formhealthsafetyform.emp_trained_health_safety.comment,
            mention_behavior_base_safety: localMentionBehaviorBaseSafety,
            track_health_safety_indicators: formhealthsafetyform.track_health_safety_indicators.selection,
            details_19: formhealthsafetyform.track_health_safety_indicators.comment,
            provide_any_healthcare_services: formhealthsafetyform.provide_any_healthcare_services.selection,
            details_of_healthcare_services: formhealthsafetyform.provide_any_healthcare_services.comment
        }
        formData.append("data", JSON.stringify(dataPayload));
        if (EmpSatisfactionForm.conduct_esat.file) {
            if (EmpSatisfactionForm.conduct_esat.file instanceof File) {
                formData.append("upload_file_1", EmpSatisfactionForm.conduct_esat.file);
            }
        }
        console.log("ASA Form Name--->", ASAformName);

        if (EmpSatisfactionForm.conduct_esat.file) {
            if (EmpSatisfactionForm.conduct_esat.file instanceof File) {
                formData.append("upload_file_21", EmpSatisfactionForm.conduct_esat.file);
            }
        }
        if (formgrivancemechform.have_grievance_mechanism.file) {
            if (formgrivancemechform.have_grievance_mechanism.file instanceof File) {
                formData.append("upload_file_12", formgrivancemechform.have_grievance_mechanism.file);
            }
        }
        if (formempwellbeingform.any_emp_well_being_initiative.file) {
            if (formempwellbeingform.any_emp_well_being_initiative.file instanceof File) {
                formData.append("upload_file_13", formempwellbeingform.any_emp_well_being_initiative.file);
            }
        }
        if (formhealthsafetyform.has_develop_health_safety_policy.file) {
            if (formhealthsafetyform.has_develop_health_safety_policy.file instanceof File) {
                formData.append("upload_file_14", formhealthsafetyform.has_develop_health_safety_policy.file);
            }
        }
        if (formhealthsafetyform.have_healthy_safety_management.file) {
            if (formhealthsafetyform.have_healthy_safety_management.file instanceof File) {
                formData.append("upload_file_15", formhealthsafetyform.have_healthy_safety_management.file);
            }
        }
        if (formhealthsafetyform.conduct_hira_activity.file) {
            if (formhealthsafetyform.conduct_hira_activity.file instanceof File) {
                formData.append("upload_file_16", formhealthsafetyform.conduct_hira_activity.file);
            }
        }
        if (formhealthsafetyform.certify_ohs_system.file) {
            if (formhealthsafetyform.certify_ohs_system.file instanceof File) {
                formData.append("upload_file_17", formhealthsafetyform.certify_ohs_system.file);
            }
        }
        if (formhealthsafetyform.emp_trained_health_safety.file) {
            if (formhealthsafetyform.emp_trained_health_safety.file instanceof File) {
                formData.append("upload_file_18", formhealthsafetyform.emp_trained_health_safety.file);
            }
        }
        if (formhealthsafetyform.track_health_safety_indicators.file) {
            if (formhealthsafetyform.track_health_safety_indicators.file instanceof File) {
                formData.append("upload_file_19", formhealthsafetyform.track_health_safety_indicators.file);
            }
        }
        if (formhealthsafetyform.provide_any_healthcare_services.file) {
            if (formhealthsafetyform.provide_any_healthcare_services.file instanceof File) {
                formData.append("upload_file_20", formhealthsafetyform.provide_any_healthcare_services.file);
            }
        }
        if (formlaborrightform.have_prohibition_policy_of_child_labor.file) {
            if (formlaborrightform.have_prohibition_policy_of_child_labor.file instanceof File) {
                formData.append("upload_file_1", formlaborrightform.have_prohibition_policy_of_child_labor.file);
            }
        }
        if (formlaborrightform.age_verification_before_hiring.file) {
            if (formlaborrightform.age_verification_before_hiring.file instanceof File) {
                formData.append("upload_file_2", formlaborrightform.age_verification_before_hiring.file);
            }
        }
        if (formlaborrightform.ensure_modern_slavery_labor_policy.file) {
            if (formlaborrightform.ensure_modern_slavery_labor_policy.file instanceof File) {
                formData.append("upload_file_3", formlaborrightform.ensure_modern_slavery_labor_policy.file);
            }
        }
        if (formlaborrightform.have_non_discrimination_policy.file) {
            if (formlaborrightform.have_non_discrimination_policy.file instanceof File) {
                formData.append("upload_file_4", formlaborrightform.have_non_discrimination_policy.file);
            }
        }
        if (formlaborrightform.has_setup_safety_report_incidents.file) {
            if (formlaborrightform.has_setup_safety_report_incidents.file instanceof File) {
                formData.append("upload_file_5", formlaborrightform.has_setup_safety_report_incidents.file);
            }
        }
        if (formlaborrightform.pending_legal_cases_workplace_harassment.file) {
            if (formlaborrightform.pending_legal_cases_workplace_harassment.file instanceof File) {
                formData.append("upload_file_6", formlaborrightform.pending_legal_cases_workplace_harassment.file);
            }
        }
        if (formlaborrightform.comply_minimum_wage_law_regulation.file) {
            if (formlaborrightform.comply_minimum_wage_law_regulation.file instanceof File) {
                formData.append("upload_file_7", formlaborrightform.comply_minimum_wage_law_regulation.file);
            }
        }
        if (formlaborrightform.legal_working_hours.file) {
            if (formlaborrightform.legal_working_hours.file instanceof File) {
                formData.append("upload_file_8", formlaborrightform.legal_working_hours.file);
            }
        }
        if (formlaborrightform.work_hrs_track_by_company.file) {
            if (formlaborrightform.work_hrs_track_by_company.file instanceof File) {
                formData.append("upload_file_9", formlaborrightform.work_hrs_track_by_company.file);
            }
        }
        if (formlaborrightform.has_diversity_inclusion_policy.file) {
            if (formlaborrightform.has_diversity_inclusion_policy.file instanceof File) {
                formData.append("upload_file_10", formlaborrightform.has_diversity_inclusion_policy.file);
            }
        }
        if (formlaborrightform.have_target_to_promote_diversity.file) {
            if (formlaborrightform.have_target_to_promote_diversity.file instanceof File) {
                formData.append("upload_file_11", formlaborrightform.have_target_to_promote_diversity.file);
            }
        }

        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        try {
            const response = await fetch(API_END_POINTS.asasocialformSubmit, {
                method: "POST",
                body: formData,
            });

            const res = await response.json();

            if (!response.ok || res.message?.status !== "success") {
                const errMsg =
                    typeof res.message === "string"
                        ? res.message
                        : res.message?.message || "Something went wrong while submitting the form.";
                throw new Error(errMsg);
            }
            console.log("EMS Form submission successful:", res);
            localStorage.removeItem("LaborRightsForm");
            localStorage.removeItem("GrievanceMechForm");
            localStorage.removeItem("EmpWellBeingForm");
            localStorage.removeItem("HealthSafetyForm");
            router.push(`asa-form?tabtype=governance&vms_ref_no=${vms_ref_no}`);

        } catch (err) {
            console.error("EMS Form submission failed:", err);
        }
    };

    return {
        companyInfo, generalDisclosure, updateCompanyInfo, updateGeneralDisclosure, submitForm, refreshFormData, governanceform, submitGoveranceForm, updateGovernanceForm, emsform, updateEmsForm, submitEnvironmentForm, biodiversityForm, greenProductsForm, updateBiodiversityForm, updateGreenProductsForm, eceform, updateEceForm, wcmform, updateWcmForm, wastemanagementForm, updateWasteManagementForm, EmpSatisfactionForm, updateEmpSatisactionForm, LaborRightsForm, updateLaborRightsForm, submitSocialForm, GrievanceMechForm, updateGrievnaceMechForm, EmpWellBeingForm, updateEmpWellBeingForm, updateHealthSafetyForm, HealthSafetyForm, ASAformName, asaFormSubmitData
    };
};
