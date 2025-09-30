export interface ApiResponse {
  message: {
    success: boolean;
    data: {
      vendors: Vendor[];
    };
  };
}

export interface Vendor {
  name: string;
  creation: string;
  modified: string;
  modified_by: string;
  owner: string;
  docstatus: number;
  idx: number;
  vendor_title: string | null;
  vendor_name: string;
  first_name: string | null;
  last_name: string | null;
  office_email_primary: string;
  office_email_secondary: string | null;
  search_term: string | null;
  payee_in_document: number;
  gr_based_inv_ver: number;
  service_based_inv_ver: number;
  check_double_invoice: number;
  country: string | null;
  mobile_number: string | null;
  registered_date: string | null;
  qa_required: string | null;
  registered_by: string | null;
  purchase_team_approval: string | null;
  purchase_team_second: string | null;
  purchase_head_approval: string | null;
  purchase_head_second_approval: string | null;
  qa_team_approval: string | null;
  qa_head_approval: string | null;
  accounts_team_approval: string | null;
  accounts_team_second_approval: string | null;
  status: string | null;
  onboarding_form_status: string | null;
  onboarding_ref_no: string | null;
  rejection_comment: string | null;
  _user_tags: string | null;
  _comments: string | null;
  _assign: string | null;
  _liked_by: string | null;
  created_from_registration: number;
  user_create: number;
  asa_required: number;
  service_provider_type: string | null;
  bank_details: BankDetails | null;
  document_details: string | null;
  manufacturing_details: string | null;
  validity_status: string | null;
  password: string | null;
  remarks_ok: number;
  via_data_import: number;
  remarks: string | null;
  multiple_company_data: CompanyData[];
  vendor_onb_records: VendorOnboardingRecord[];
  vendor_types: any[];
}

export interface BankDetails {
  name: string;
  creation: string;
  modified: string;
  modified_by: string;
  owner: string;
  docstatus: number;
  idx: number;
  naming_series: string;
  ref_no: string;
  country: string;
  bank_name: string;
  ifsc_code: string;
  account_number: string;
  name_of_account_holder: string;
  type_of_account: string;
  currency: string;
  currency_code: string;
  bank_proof: string;
  bank_proof_by_purchase_team: string | null;
  rtgs: number;
  neft: number;
  ift: number;
  add_intermediate_bank_details: number;
  registered_for_multi_companies: number;
  unique_multi_comp_id: string | null;
  _user_tags: string | null;
  _comments: string | null;
  _assign: string | null;
  _liked_by: string | null;
  created_from_import: number;
  import_ref: string | null;
  company_pan_number: string | null;
  banker_details: any[];
  international_bank_details: any[];
  intermediate_bank_details: any[];
}

export interface CompanyData {
  name: string;
  creation: string;
  modified: string;
  modified_by: string;
  owner: string;
  docstatus: number;
  idx: number;
  company_name: string;
  purchase_organization: string | null;
  account_group: string | null;
  terms_of_payment: string | null;
  sap_client_code: string;
  purchase_group: string | null;
  order_currency: string | null;
  incoterm: string | null;
  reconciliation_account: string | null;
  company_vendor_code: string | null;
  parent: string;
  parentfield: string;
  parenttype: string;
  company_display_name: string;
  via_import?: number | boolean | string;
  company_id: string | null;

}

export interface VendorOnboardingRecord {
  name: string;
  creation: string;
  modified: string;
  modified_by: string;
  owner: string;
  docstatus: number;
  idx: number;
  vendor_onboarding_no: string;
  onboarding_form_status: string | null;
  registered_by: string | null;
  purchase_team_approval: string | null;
  purchase_head_approval: string | null;
  accounts_team_approval: string | null;
  parent: string;
  parentfield: string;
  parenttype: string;
  onboarding_date: string | null;
  onboarding_status: string | null;
  vendor_onboarding: string | null;
  payment_details: string | null;
  document_details: string | null;
  certificate_details: string | null;
  manufacturing_details: string | null;
  is_current: number;
  synced_date: string | null;
  synced_by: string | null;
  created_by_accounts_team: number;
  company_id: string | null;
}


export interface AllVendorsCompanyCodeResponse {
  message: {
    success: boolean;
    data: {
      company_vendor_codes: CompanyVendorCodeRecord[];
      total_records: number;
      search_criteria: {
        vendor_master_id: string;
        company_name: string;
      };
    };
  };
}

export interface CompanyVendorCodeRecord {
  company_vendor_code_data: CompanyVendorCodeData;
  vendor_info: VendorInfo;
  company_info: CompanyInfo;
  state_info: StateInfo | null;
  vendor_code_table: VendorCodeTable[];
  metadata: Metadata;
}

export interface CompanyVendorCodeData {
  name: string;
  creation: string;
  modified: string;
  modified_by: string;
  owner: string;
  docstatus: number;
  idx: number;
  vendor_ref_no: string;
  vendor_name: string;
  company_name: string;
  company_code: string;
  sap_client_code: string;
  naming_series: string;
  _user_tags: string | null;
  _comments: string | null;
  _assign: string | null;
  _liked_by: string | null;
  company_description: string | null;
  imported: number;
}

export interface VendorInfo {
  vendor_name: string;
  office_email_primary: string;
  mobile_number: string;
  country: string;
}

export interface CompanyInfo {
  company_name: string;
  company_code: string;
  sap_client_code: string;
}

export interface StateInfo {
  // define if backend sends details (your response had null)
}

export interface VendorCodeTable {
  name: string;
  creation: string;
  modified: string;
  modified_by: string;
  owner: string;
  docstatus: number;
  idx: number;
  state: string;
  gst_no: string;
  vendor_code: string;
  parent: string;
  parentfield: string;
  parenttype: string;
}

export interface Metadata {
  record_found: boolean;
  vendor_id_searched: string;
  company_searched: string;
  created_on: string;
  modified_on: string;
  created_by: string;
  modified_by: string;
  total_vendor_codes: number;
}

export interface VendorRow extends Vendor {
  company?: CompanyData;
}


