export type ASAForm = {
    name: string;
    creation: string;
    owner: string;
    ref_no: string;
    general_disclosures_tab?: string;
    company_information_section?: string;
    naming_series?: string;
    name_of_the_company?: string;
    location?: string;
    name_of_product?: string;
    general_disclosure_section?: string;
    valid_consent_from_pollution_control?: string;
    expiry_date_of_consent?: string;
    recycle_plastic_package_material?: boolean;
    plans_for_recycle_materials?: string;
    link_documents?: string[];
    governance_doctype?: string;
    environment_doctype?: string;
    social_doctype?: string;
    governance_tab?: string;
    have_formal_governance_structure?: boolean;
    esg_policies_coverage?: string;
    esg_risk_integration?: string;
    company_publish_sustainability_report?: boolean;
    esg_rating_participated?: boolean;
    esg_rating_score?: number;
    esg_incentive_for_employee?: boolean;
    csat_survey_conducted?: boolean;
    csat_score?: number;
    instance_of_loss_customer_data?: boolean;
    no_of_loss_data_incidents?: number;
    environment_tab?: string;
    environmental_management_system_section?: string;
    does_company_have?: boolean;
    environment_sustainability_policy?: boolean;
    environmental_management_certification?: string;
    regular_audits_conducted?: boolean;
    energy_consumption_tracking?: boolean;
    total_energy_consumed?: number;
    company_track_greenhouse_gas?: boolean;
    scope_wise_chg_emission?: string;
    consume_renewable_energy?: boolean;
    total_renewable_energy_consumption?: number;
    have_system_to_control_air_emission?: boolean;
    details_of_system_to_control_air_emission?: string;
    have_target_for_increase_renewable_share?: boolean;
    mention_target_for_increase_renewable_share?: string;
    have_target_to_reduce_energy_consumption?: boolean;
    mention_target_to_reduce_energy_consumption?: string;
    have_plan_to_improve_energy_efficiency?: boolean;
    list_plan_to_improve_energy_efficiency?: string;
    have_targets_to_reduce_emission?: boolean;
    details_of_targets_to_reduce_emission?: string;
    pcf_conducted?: boolean;
    water_consumption_and_management_section?: string;
    water_source_tracking?: string;
    have_permission_for_groundwater?: boolean;
    has_system_to_track_water_withdrawals?: boolean;
    have_facility_to_recycle_wastewater?: boolean;
    have_zld_strategy?: boolean;
    have_initiatives_to_increase_water_efficiency?: boolean;
    details_to_increase_water_efficiency?: string;
    have_targets_to_reduce_water_consumption?: boolean;
    targets_to_reduce_water_consumption?: string;
    waste_management_section?: string;
    track_waste_generation?: boolean;
    vendor_audits_for_waste_management?: boolean;
    have_epr_for_waste_management?: boolean;
    have_goals_to_reduce_waste?: boolean;
    details_of_goals_to_reduce_waste?: string;
    green_products_section?: string;
    certified_green_projects?: string;
    biodiversity_section?: string;
    have_policy_on_biodiversity?: boolean;
    social_tab?: string;
    labor_rights_and_working_conditions_section?: string;
    have_prohibition_policy_of_child_labor?: boolean;
    age_verification_before_hiring?: boolean;
    ensure_modern_slavery_labor_policy?: boolean;
    have_non_discrimination_policy?: boolean;
    has_setup_safety_report_incidents?: boolean;
    pending_legal_cases_workplace_harassment?: boolean;
    details_of_pending_legal_cases?: string;
    comply_minimum_wage_law_regulation?: boolean;
    legal_working_hours?: number;
    work_hrs_track_by_company?: boolean;
    has_diversity_inclusion_policy?: boolean;
    have_target_to_promote_diversity?: boolean;
    details_of_targets?: string;
    grievance_mechanism_section?: string;
    have_grievance_mechanism?: boolean;
    employee_well_being_section?: string;
    any_emp_well_being_initiative?: boolean;
    details_of_initiatives?: string;
    health_and_safety_section?: string;
    has_develop_health_safety_policy?: boolean;
    have_healthy_safety_management?: boolean;
    conduct_hira_activity?: boolean;
    certify_ohs_system?: string;
    emp_trained_health_safety?: boolean;
    mention_behavior_base_safety?: string;
    track_health_safety_indicators?: boolean;
    provide_any_healthcare_services?: boolean;
    details_of_healthcare_services?: string;
    employee_satisfaction_section?: string;
    conduct_esat?: boolean;
    esat_score?: number;
};

export type TasaformDetail = {
    message: {
        data: {
            asa_form: ASAForm;
        };
    };
};


export type CompanyInformation = {
    companyName: string;
    companyAddress: string;
    productOrServiceName: string;
}
export type YesNoNAValue = {
    selection: "yes" | "no" | "na" | "";
    comment: string;
    file: File | null;
};

export type GeneralDisclosureData = {
    question1: YesNoNAValue;
    question2: YesNoNAValue;
    question3: YesNoNAValue;
};

export type EnvironmentalManagementSystem = {
    question1: YesNoNAValue;
    question2: YesNoNAValue;
    question3: YesNoNAValue;
};

export type EnergyConsumptionAndEmission = {
    question1: YesNoNAValue;
    question2: YesNoNAValue;
    question3: YesNoNAValue;
    question4: YesNoNAValue;
    question5: YesNoNAValue;
    question6: YesNoNAValue;
    question7: YesNoNAValue;
    question8: YesNoNAValue;
    question9: YesNoNAValue;
};

export type WaterConsumptionAndManagement = {
    question1: YesNoNAValue;
    question2: YesNoNAValue;
    question3: YesNoNAValue;
    question4: YesNoNAValue;
    question5: YesNoNAValue;
    question6: YesNoNAValue;
    question7: YesNoNAValue;
};

export type WasteManagement = {
    question1: YesNoNAValue;
    question2: YesNoNAValue;
    question3: YesNoNAValue;
    question4: YesNoNAValue;
    question5: YesNoNAValue;
};

export type GreenProducts = {
    question1: YesNoNAValue;
};

export type Biodiversity = {
    question1: YesNoNAValue;
};

export type LaborRightsAndWorkingConditions = {
    question1: YesNoNAValue;
    question2: YesNoNAValue;
    question3: YesNoNAValue;
    question4: YesNoNAValue;
    question5: YesNoNAValue;
    question6: YesNoNAValue;
    question7: YesNoNAValue;
    question8: YesNoNAValue;
    question9: YesNoNAValue;
    question10: YesNoNAValue;
    question11: YesNoNAValue;
    question12: YesNoNAValue;
};

export type GrievanceMechanism = {
    question1: YesNoNAValue;
};

export type EmployeeWellBeing = {
    question1: YesNoNAValue;
};

export type HealthAndSafety = {
    question1: YesNoNAValue;
    question2: YesNoNAValue;
    question3: YesNoNAValue;
    question4: YesNoNAValue;
    question5: YesNoNAValue;
    question6: YesNoNAValue;
    question7: YesNoNAValue;
};

export type EmployeeSatisfaction = {
    question1: YesNoNAValue;
};

export type Governance = {
    question1: YesNoNAValue;
    question2: YesNoNAValue;
    question3: YesNoNAValue;
    question4: YesNoNAValue;
    question5: YesNoNAValue;
    question6: YesNoNAValue;
    question7: YesNoNAValue;
    question8: YesNoNAValue;
};
