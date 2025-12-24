export type ASAForm = {
    vendor_ref_no?: string;
    name?: string;
    vms_ref_no?: string;
    naming_series?: string;
    name_of_the_company?: string;
    location?: string;
    name_of_product?: string;
    general_disclosure_section?: string;
    valid_consent_from_pollution_control?: string;
    expiry_date_of_consent?: string;
    recycle_plastic_package_material?: string;
    recycle_plastic_details?: string;
    plans_for_recycle_materials?: string;
    details_to_increase_recycle_material?: string;
    link_documents?: string[];
    governance_doctype?: string;
    environment_doctype?: string;
    social_doctype?: string;
    have_formal_governance_structure?: string;
    esg_policies_coverage?: string;
    esg_risk_integration?: string;
    company_publish_sustainability_report?: string;
    esg_rating_participated?: string;
    esg_rating_score?: string;
    esg_incentive_for_employee?: string;
    csat_survey_conducted?: string;
    csat_score?: string;
    details_1?: string;
    details_2?: string;
    details_3?: string;
    details_4?: string;
    details_6?: string;
    instance_of_loss_customer_data?: string;
    no_of_loss_data_incidents?: string;
    environment_tab?: string;
    environmental_management_system_section?: string;
    does_company_have?: string;
    environment_sustainability_policy?: string;
    environmental_management_certification?: string;
    regular_audits_conducted?: string;
    energy_consumption_tracking?: string;
    total_energy_consumed?: string;
    company_track_greenhouse_gas?: string;
    scope_wise_chg_emission?: string;
    consume_renewable_energy?: string;
    total_renewable_energy_consumption?: string;
    have_system_to_control_air_emission?: string;
    details_of_system_to_control_air_emission?: string;
    have_target_for_increase_renewable_share?: string;
    mention_target_for_increase_renewable_share?: string;
    have_target_to_reduce_energy_consumption?: string;
    mention_target_to_reduce_energy_consumption?: string;
    have_plan_to_improve_energy_efficiency?: string;
    list_plan_to_improve_energy_efficiency?: string;
    have_targets_to_reduce_emission?: string;
    details_of_targets_to_reduce_emission?: string;
    pcf_conducted?: string;
    water_consumption_and_management_section?: string;
    water_source_tracking?: string;
    have_permission_for_groundwater?: string;
    has_system_to_track_water_withdrawals?: string;
    have_facility_to_recycle_wastewater?: string;
    have_zld_strategy?: string;
    have_initiatives_to_increase_water_efficiency?: string;
    details_to_increase_water_efficiency?: string;
    have_targets_to_reduce_water_consumption?: string;
    targets_to_reduce_water_consumption?: string;
    waste_management_section?: string;
    track_waste_generation?: string;
    vendor_audits_for_waste_management?: string;
    have_epr_for_waste_management?: string;
    have_goals_to_reduce_waste?: string;
    details_of_goals_to_reduce_waste?: string;
    green_products_section?: string;
    certified_green_projects?: string;
    biodiversity_section?: string;
    have_policy_on_biodiversity?: string;
    social_tab?: string;
    labor_rights_and_working_conditions_section?: string;
    have_prohibition_policy_of_child_labor?: string;
    age_verification_before_hiring?: string;
    ensure_modern_slavery_labor_policy?: string;
    have_non_discrimination_policy?: string;
    has_setup_safety_report_incidents?: string;
    pending_legal_cases_workplace_harassment?: string;
    details_of_pending_legal_cases?: string;
    comply_minimum_wage_law_regulation?: string;
    legal_working_hours?: string;
    work_hrs_track_by_company?: string;
    has_diversity_inclusion_policy?: string;
    have_target_to_promote_diversity?: string;
    details_of_targets?: string;
    grievance_mechanism_section?: string;
    have_grievance_mechanism?: string;
    employee_well_being_section?: string;
    any_emp_well_being_initiative?: string;
    details_of_initiatives?: string;
    health_and_safety_section?: string;
    has_develop_health_safety_policy?: string;
    have_healthy_safety_management?: string;
    conduct_hira_activity?: string;
    certify_ohs_system?: string;
    emp_trained_health_safety?: string;
    mention_behavior_base_safety?: string;
    track_health_safety_indicators?: string;
    provide_any_healthcare_services?: string;
    details_of_healthcare_services?: string;
    employee_satisfaction_section?: string;
    handover_waste_to_authorized_vendor?: string;
    conduct_esat?: string;
    esat_score?: string;
    details_26?: string;
    details_25?: string;
    details_12?: string;
    details_13?: string;
    details_14?: string;
    details_15?: string;
    details_16?: string;
    details_17?: string;
    details_18?: string;
    details_19?: string;
    details_20?: string;
    details_21?: string;
    details_22?: string;
    details_23?: string;
    // details_24?: string;
    details_8?: string;
    details_9?: string;
    details_10?: string;
    details_11?: string;
    details_5?: string;
    details_7?: string;
    vendor_name?: string;
    creation?: string,
    form_is_submitted?: boolean | undefined | number,
    verify_by_asa_team?: boolean | undefined | number,
};

export type TasaformDetail = {
    message: {
        data: {
            asa_form: ASAForm;
        };
    };
};

export interface TextValue {
    selection: string;
    comment: string;
    file: File | null;
}



export type CompanyInformation = {
    name_of_the_company: TextValue;
    location: TextValue;
    name_of_product: TextValue;
}

export type YesNoNAValue = {
    selection: "Yes" | "No" | "NA" | "";
    comment: string;
    file: File | { url: string; name: string; file_name?: string; base64?: string; } | null;
};

export type GeneralDisclosureData = {
    valid_consent_from_pollution_control: YesNoNAValue;
    recycle_plastic_package_material: YesNoNAValue;
    plans_for_recycle_materials: YesNoNAValue;
};

export type EnvironmentalManagementSystem = {
    environment_sustainability_policy: YesNoNAValue;
    environmental_management_certification: YesNoNAValue;
    regular_audits_conducted: YesNoNAValue;
};

export type EnergyConsumptionAndEmission = {
    energy_consumption_tracking: YesNoNAValue;
    company_track_greenhouse_gas: YesNoNAValue;
    consume_renewable_energy: YesNoNAValue;
    have_system_to_control_air_emission: YesNoNAValue;
    have_target_for_increase_renewable_share: YesNoNAValue;
    have_target_to_reduce_energy_consumption: YesNoNAValue;
    have_plan_to_improve_energy_efficiency: YesNoNAValue;
    have_targets_to_reduce_emission: YesNoNAValue;
    pcf_conducted: YesNoNAValue;
};

export type WaterConsumptionAndManagement = {
    water_source_tracking: YesNoNAValue;
    have_permission_for_groundwater: YesNoNAValue;
    has_system_to_track_water_withdrawals: YesNoNAValue;
    have_facility_to_recycle_wastewater: YesNoNAValue;
    have_zld_strategy: YesNoNAValue;
    have_initiatives_to_increase_water_efficiency: YesNoNAValue;
    have_targets_to_reduce_water_consumption: YesNoNAValue;
};

export type WasteManagement = {
    track_waste_generation: YesNoNAValue;
    handover_waste_to_authorized_vendor: YesNoNAValue;
    vendor_audits_for_waste_management: YesNoNAValue;
    have_epr_for_waste_management: YesNoNAValue;
    have_goals_to_reduce_waste: YesNoNAValue;
};

export type GreenProducts = {
    certified_green_projects: YesNoNAValue;
};

export type Biodiversity = {
    have_policy_on_biodiversity: YesNoNAValue;
};

export type LaborRightsAndWorkingConditions = {
    have_prohibition_policy_of_child_labor: YesNoNAValue;
    age_verification_before_hiring: YesNoNAValue;
    ensure_modern_slavery_labor_policy: YesNoNAValue;
    have_non_discrimination_policy: YesNoNAValue;
    has_setup_safety_report_incidents: YesNoNAValue;
    pending_legal_cases_workplace_harassment: YesNoNAValue;
    comply_minimum_wage_law_regulation: YesNoNAValue;
    legal_working_hours: YesNoNAValue;
    work_hrs_track_by_company: YesNoNAValue;
    has_diversity_inclusion_policy: YesNoNAValue;
    have_target_to_promote_diversity: YesNoNAValue;
};

export type GrievanceMechanism = {
    have_grievance_mechanism: YesNoNAValue;
};

export type EmployeeWellBeing = {
    any_emp_well_being_initiative: YesNoNAValue;
};

export type HealthAndSafety = {
    has_develop_health_safety_policy: YesNoNAValue;
    have_healthy_safety_management: YesNoNAValue;
    conduct_hira_activity: YesNoNAValue;
    certify_ohs_system: YesNoNAValue;
    emp_trained_health_safety: YesNoNAValue;
    track_health_safety_indicators: YesNoNAValue;
    provide_any_healthcare_services: YesNoNAValue;
};

export type EmployeeSatisfaction = {
    conduct_esat: YesNoNAValue;
};

export type Governance = {
    have_formal_governance_structure: YesNoNAValue;
    esg_policies_coverage: YesNoNAValue;
    esg_risk_integration: YesNoNAValue;
    company_publish_sustainability_report: YesNoNAValue;
    esg_rating_participated: YesNoNAValue;
    esg_incentive_for_employee: YesNoNAValue;
    csat_survey_conducted: YesNoNAValue;
    instance_of_loss_customer_data: YesNoNAValue;
};

export const fileKeys = {
    valid_consent_from_pollution_control: "valid_consent",
    recycle_plastic_package_material: "upload_file_2",
    plans_for_recycle_materials: "upload_file_3",
    have_formal_governance_structure: "upload_file_1",
    esg_policies_coverage: "upload_file_2",
    esg_risk_integration: "upload_file_3",
    company_publish_sustainability_report: "upload_file_4",
    esg_rating_participated: "upload_file_5",
    esg_incentive_for_employee: "upload_file_6",
    csat_survey_conducted: "upload_file_7",
    instance_of_loss_customer_data: "upload_file_8",
    environment_sustainability_policy: "upload_file_1",
    environmental_management_certification: "upload_file_2",
    regular_audits_conducted: "upload_file_3",
    have_policy_on_biodiversity: "upload_file_26",
    certified_green_projects: "upload_file_25",
    energy_consumption_tracking: "upload_file_4",
    company_track_greenhouse_gas: "upload_file_5",
    consume_renewable_energy: "upload_file_6",
    have_system_to_control_air_emission: "upload_file_7",
    have_target_for_increase_renewable_share: "upload_file_8",
    have_target_to_reduce_energy_consumption: "upload_file_9",
    have_plan_to_improve_energy_efficiency: "upload_file_10",
    have_targets_to_reduce_emission: "upload_file_11",
    pcf_conducted: "upload_file_12",
    water_source_tracking: "upload_file_13",
    have_permission_for_groundwater: "upload_file_14",
    has_system_to_track_water_withdrawals: "upload_file_15",
    have_facility_to_recycle_wastewater: "upload_file_16",
    have_zld_strategy: "upload_file_17",
    have_initiatives_to_increase_water_efficiency: "upload_file_18",
    have_targets_to_reduce_water_consumption: "upload_file_19",
    track_waste_generation: "upload_file_20",
    handover_waste_to_authorized_vendor: "upload_file_21",
    vendor_audits_for_waste_management: "upload_file_22",
    have_epr_for_waste_management: "upload_file_23",
    have_goals_to_reduce_waste: "upload_file_24",
    conduct_esat: "upload_file_21",
    have_grievance_mechanism: "upload_file_12",
    any_emp_well_being_initiative: "upload_file_13",
    have_prohibition_policy_of_child_labor: "upload_file_1",
    age_verification_before_hiring: "upload_file_2",
    ensure_modern_slavery_labor_policy: "upload_file_3",
    have_non_discrimination_policy: "upload_file_4",
    has_setup_safety_report_incidents: "upload_file_5",
    pending_legal_cases_workplace_harassment: "upload_file_6",
    comply_minimum_wage_law_regulation: "upload_file_7",
    legal_working_hours: "upload_file_8",
    work_hrs_track_by_company: "upload_file_9",
    has_diversity_inclusion_policy: "upload_file_10",
    have_target_to_promote_diversity: "upload_file_11",
    has_develop_health_safety_policy: "upload_file_14",
    have_healthy_safety_management: "upload_file_15",
    conduct_hira_activity: "upload_file_16",
    certify_ohs_system: "upload_file_17",
    emp_trained_health_safety: "upload_file_18",
    track_health_safety_indicators: "upload_file_19",
    provide_any_healthcare_services: "upload_file_20",

} as const;

export const commentFieldKeys = {
    valid_consent_from_pollution_control: "expiry_date_of_consent",
    recycle_plastic_package_material: "recycle_plastic_details",
    plans_for_recycle_materials: "details_to_increase_recycle_material",
    have_formal_governance_structure: "details_1",
    esg_policies_coverage: "details_2",
    esg_risk_integration: "details_3",
    company_publish_sustainability_report: "details_4",
    esg_incentive_for_employee: "details_6",
    esg_rating_participated: "esg_rating_score",
    csat_survey_conducted: "csat_score",
    instance_of_loss_customer_data: "no_of_loss_data_incidents",
    environment_sustainability_policy: "details_1",
    environmental_management_certification: "details_2",
    regular_audits_conducted: "details_3",
    certified_green_projects: "details_25",
    have_policy_on_biodiversity: "details_26",
    energy_consumption_tracking: "total_energy_consumed",
    company_track_greenhouse_gas: "scope_wise_chg_emission",
    consume_renewable_energy: "total_renewable_energy_consumption",
    have_system_to_control_air_emission: "details_of_system_to_control_air_emission",
    have_target_for_increase_renewable_share: "mention_target_for_increase_renewable_share",
    have_target_to_reduce_energy_consumption: "mention_target_to_reduce_energy_consumption",
    have_plan_to_improve_energy_efficiency: "list_plan_to_improve_energy_efficiency",
    have_targets_to_reduce_emission: "details_of_targets_to_reduce_emission",
    pcf_conducted: "details_12",
    water_source_tracking: "details_13",
    have_permission_for_groundwater: "details_14",
    has_system_to_track_water_withdrawals: "details_15",
    have_facility_to_recycle_wastewater: "details_16",
    have_zld_strategy: "details_17",
    have_initiatives_to_increase_water_efficiency: "details_to_increase_water_efficiency",
    have_targets_to_reduce_water_consumption: "targets_to_reduce_water_consumption",
    track_waste_generation: "details_20",
    handover_waste_to_authorized_vendor: "details_21",
    vendor_audits_for_waste_management: "details_22",
    have_epr_for_waste_management: "details_23",
    have_goals_to_reduce_waste: "details_of_goals_to_reduce_waste",
    conduct_esat: "esat_score",
    have_grievance_mechanism: "details_12",
    any_emp_well_being_initiative: "details_of_initiatives",
    have_prohibition_policy_of_child_labor: "details_1",
    age_verification_before_hiring: "details_2",
    ensure_modern_slavery_labor_policy: "details_3",
    have_non_discrimination_policy: "details_4",
    has_setup_safety_report_incidents: "details_5",
    pending_legal_cases_workplace_harassment: "details_6",
    comply_minimum_wage_law_regulation: "details_7",
    legal_working_hours: "details_8",
    work_hrs_track_by_company: "details_9",
    has_diversity_inclusion_policy: "details_10",
    have_target_to_promote_diversity: "details_of_targets",
    has_develop_health_safety_policy: "details_14",
    have_healthy_safety_management: "details_15",
    conduct_hira_activity: "details_16",
    certify_ohs_system: "details_17",
    emp_trained_health_safety: "details_18",
    mention_behavior_base_safety: "mention_behavior_base_safety",
    track_health_safety_indicators: "details_19",
    provide_any_healthcare_services: "details_of_healthcare_services",
} as const;
