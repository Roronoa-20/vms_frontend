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
  profit_center_code: string;
  profit_center_name: string;
  description: string;
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
}

export interface StorageLocation {
  name: string;
  storage_name: string;
  storage_location_name: string;
  storage_location: string;
  description: string;
  company: string;
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
  description: string;
}

export interface MaterialCodeResponse {
  message: {
    message: string;
    data: MaterialCode[];
  }
}

export interface division {
  name: string;
  division_code: string;
  division_name: string;
  description: string;
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
  class_type: string;
  class_name: string;
  description: string;
}

export interface MaterialType {
  name: string; // e.g. "ZCAP - Capital Mat-Non Valuated"
  material_type_name: string; // same as name, but keeping both for consistency
  description: string; // e.g. "Capital Mat-Non Valuated"
  material_category_type: string; // e.g. "F"
  plant_code: string; // e.g. "9100 - HEALTH CARE"
  multiple_company: {
    company: string;
    company_name: string;
  }[];
  storage_location_table: {
    storage_location: string;
    storage_name: string;
  }[];
  valuation_and_profit: {
    company: string; // e.g. "9000"
    division: string; // e.g. "AI - Arthroscopy - Implan - 9000"
    division_name: string; // e.g. "AI - Arthroscopy - Implan"
    profit_center: string; // e.g. "9151"
    profit_center_description: string; // e.g. "ARTHROSCOPY IMPLANT"
    valuation_class: string; // e.g. "GM91 - 9000"
    valuation_class_description: string; // e.g. "General Material"
  }[];
}
