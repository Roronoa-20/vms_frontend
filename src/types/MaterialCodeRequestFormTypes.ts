import { string } from "zod";

export interface EmployeeDetail {
  name: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  full_name: string;
  user_id: string;
  department?: string | null;
  sub_department?: string | null;
  designation?: string | null;
  company_email?: string | null;
  branch?: string | null;
  team?: string | null;
  cell_number?: string | null;
  reports_to?: string | null;
  head_of_department: string | null;
  company?: Company[];
}

export interface EmployeeAPIResponse {
  message: {
    message: string;
    data: EmployeeDetail;
  }
}

export type MaterialRegistrationFormData = {
  material_name: string;
  material_code: string;
  material_type: string;
  uom: string;
  requestor_name: string;
  requestor_email: string;
  [key: string]: any;
};

export type MaterialSafePrefillData = {
  material_company_code: string;
  material_category: string;
  base_unit_of_measure: string;
  plant_name: string;
  material_type: string;
  material_name_description: string;
  material_code_revised: string;
  material_specifications: string;
  comment_by_user: string;
  requested_by_name: string;
  requested_by_place: string;
}

export interface Plant {
  name: string;
  plant_code: string;
  plant_name: string | null;
  description: string | null;
  company: string;
  profit_center_list: ProfitCenter[];
}

export interface Company {
  name: string;
  company_code: string;
  company_name: string;
  description: string | null;
}

export interface MaterialGroupMaster {
  name: string;
  material_group_name: string;
  material_group_description: string;
  material_group_company: string
}

// UOM Master
export interface UOMMaster {
  name: string;
  uom_code: string;
  uom: string;
  description: string | null;
}

export interface CostCenter {
  name: string;
  cost_center_code: string;
  cost_center_name: string;
  description: string;
}

// Profit Center
export interface ProfitCenter {
  name: string;
  profit_center_code?: string;
  profit_center_name?: string;
  description: string;
  company_code?: string;
  profit_center?: string;
}

// GL Account Number
export interface GLAccountNumber {
  name: string;
  gl_account_code: string;
  gl_account_name: string;
  description: string;
}

// Material Code
export interface MaterialCode {
  name: string;
  material_code: string;
  material_name: string;
  description: string;
  material_description: string;
  material_type: string;
  company: string;
  material_code_name: string;
  plant: string;
}

export interface StorageLocation {
  name: string;
  storage_name: string;
  storage_location_name: string;
  storage_location: string;
  description: string;
  company: string;
  plant_code: string;
}

export interface ValuationClass {
  name: string;
  valuation_class_code: string;
  valuation_class_name: string;
  description: string;
}

export interface MRPType {
  name: string;
  mrp_type_code: string;
  mrp_type_name: string;
  mrp_name: string;
  description: string;
}

export interface MaterialCodeResponse {
  message: {
    message: string;
    data: MaterialCode[];
  }
}

export interface division {
  name?: string;
  division_code?: string;
  division_name?: string;
  description?: string;
  company?: string
}

export interface industry {
  name: string;
  industry_code: string;
  industry_name: string;
  description: string;
}

export interface procurementType {
  name: string;
  procurement_type_code: string;
  procurement_type_name: string;
  description: string;
}

export interface ValuationCategory {
  name: string;
  valuation_category_code: string;
  valuation_category_name: string;
  description: string;
}

export interface MaterialCategory {
  name: string;
  material_category_code: string;
  material_category_name: string;
  description: string;
}

export interface MRPController {
  name: string;
  mrp_controller_code: string;
  mrp_controller_name: string;
  description: string;
  mrp_controller: string;
}

export interface InspectionType {
  name: string;
  inspection_type_code: string;
  inspection_type_name: string;
  description: string;
}

export interface SerialNumber {
  name: string;
  serial_no_profile: string;
  serialization_level: string;
}

export interface PriceControl {
  name: string;
  price_control_code: string;
  description: string;
  do_not_cost: string;
}

export interface AvailabilityCheck {
  availability_check: string;
  name: string;
  description: string;
}

export interface ClassType {
  name: string
  class_type: string;
  class_name: string;
  class_number: string
  description: string;
}

export interface MaterialType {
  name: string;
  material_type_name: string;
  description: string;
  material_category_type: string;
  plant_code: string;
  multiple_company: {
    company: string;
    company_name: string;
  }[];
  storage_location_table: {
    storage_location: string;
    storage_name: string;
  }[];
  valuation_and_profit: {
    company: string;
    division: string;
    division_name: string;
    profit_center: string;
    profit_center_description: string;
    valuation_class: string;
    valuation_class_description: string;
  }[];
  material_code_logic: {
    material_type_category: string;
    code_logic: string;
  }[];
}

export interface LotSize {
  name: string;
  lot_size_code: string;
  lot_size_name: string;
  description: string;
}

export interface SchedulingMarginKey {
  name: string;
  smk_code: string;
  description: string;
}

export interface ExpirationDate {
  name: string;
  expiration_date_code: string;
  expiration_date_name: string;
  description: string;
}

// Material Request Item (used inside requestor_master.material_request)
export interface MaterialRequestItem {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  company_name: string;
  material_type: string;
  material_type_code: string;
  material_category: string;
  required_by: string | null;
  material_name_description: string;
  material_group: string | null;
  material_image: string | null;
  quantity: number | null;
  unit_of_measure: string;
  rate: number | null;
  amount: number | null;
  manufacturer: string | null;
  plant: string;
  material_code_revised: string;
  is_revised_code_new: number | string | boolean;
  comment_by_user: string | null;
  parent: string;
  parentfield: string;
  parenttype: string;
  doctype: string;
  material_type_name: string;
  company_name_display?: string;
  material_specifications?:string
}

export interface RequestorMaster {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  material_master_ref_no: string | null;
  approval_status: string;
  revert_remark: string | null;
  material_onboarding_ref_no: string | null;
  request_id: string;
  request_date: string;
  requestor_company: string | null;
  sub_department: string | null;
  immediate_reporting_head: string | null;
  contact_information_phone: string | null;
  requested_by: string;
  requestor_department: string;
  requestor_hod: string;
  contact_information_email: string;
  requested_by_place: string | null;
  zmsg: string | null;
  maktx: string | null;
  ztext: string | null;
  sap_summary: string | null;
  doctype: string;
  material_request: MaterialRequestItem[];
}

export interface MaterialMaster {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  naming_series: string;
  basic_data_ref_no: string;
  old_material_code: string;
  division: string | null;
  division_code: string | null;
  storage_location: string | null;
  storage_location_code: string | null;
  inactive: number;
  company: string | null;
  plant: string | null;
  valuation_class: string | null;
  valuation_class_code: string | null;
  price_control: string | null;
  valuation_type: string | null;
  price_unit: string | null;
  currency: string;
  created_by: string | null;
  batch_requirements_yn: string | null;
  brand_make: string | null;
  availability_check: string | null;
  serialization_level: string | null;
  class_type: string | null;
  class_number: string | null;
  serial_number_profile: string | null;
  purchasing_group: string | null;
  gr_processing_time: string | null;
  purchase_uom: string | null;
  lead_time: string | null;
  purchasing_value_key: string | null;
  min_lot_size: string | null;
  purchase_order_text: string | null;
  numerator_for_conversion: string | null;
  denominator_for_conversion: string | null;
  mrp_type: string | null;
  mrp_group: string | null;
  mrp_controller_revised: string | null;
  lot_size_key: string | null;
  procurement_type: string | null;
  scheduling_margin_key: string | null;
  base_uom: string | null;
  numerator_issue_uom: string | null;
  denominator_issue_uom: string | null;
  requestor_ref_no: string | null;
  material_code: string | null;
  material_group: string | null;
  material_name: string | null;
  material_category: string | null;
  material_onboarding_ref_no: string | null;
  material_code_revised: string | null;
  material_type: string | null;
  material_image: string | null;
  description: string | null;
  industry: string | null;
  default_material_manufacturer: string | null;
  doctype: string;
  children: any[];
}

export interface MaterialOnboarding {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  requestor_ref_no: string;
  material_master_ref_no: string;
  material_code_latest: string | null;
  minimum_remaining_shell_life: string | null;
  total_shell_life: string | null;
  expiration_date: string | null;
  inspection_require: string | null;
  inspection_interval: string | null;
  incoming_inspection_01: number;
  incoming_inspection_09: number;
  intended_usage_application: string | null;
  storage_requirements: string | null;
  hazardous_material: string | null;
  profit_center: string | null;
  valuation_class: string | null;
  price_control: string | null;
  hsn_code: string | null;
  do_not_cost: string | null;
  material_information: string | null;
  hsn_status: string | null;
  comment_by_store: string | null;
  special_instructionsnotes: string | null;
  requested_by_name: string | null;
  requested_by: string | null;
  requested_by_place: string | null;
  approval_date: string | null;
  approved_by_name: string | null;
  approved_by: string | null;
  approved_by_place: string | null;
  approval_stage: string | null;
  doctype: string;
  children: any[];
}

export interface MaterialRequestData {
  requestor_master: RequestorMaster;
  material_request_item: MaterialRequestItem;
  material_master: MaterialMaster;
  material_onboarding: MaterialOnboarding;
}

// Final API response
export interface MaterialRequestAPIResponse {
  message: {
    message: string;
    data: MaterialRequestData;
  };
}

