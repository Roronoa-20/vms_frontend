export interface VendorCode {
  state: string;
  gst_no: string;
  vendor_code: string;
}

export interface CompanyVendorCode {
  company_name: string;
  company_code: string;
  vendor_codes: VendorCode[];
}

export interface VendorOnboardingRecord {
  name: string;
  ref_no: string;
  company_name: string;
  vendor_name: string;
  onboarding_form_status: string;
  awaiting_approval_status: string | null;
  modified: string;
  purchase_t_approval: string | null;
  accounts_t_approval: string | null;
  purchase_h_approval: string | null;
  mandatory_data_filled: number;
  purchase_team_undertaking: number;
  accounts_team_undertaking: number;
  purchase_head_undertaking: number;
  form_fully_submitted_by_vendor: number;
  sent_registration_email_link: number;
  rejected: number;
  data_sent_to_sap: number;
  expired: number;
  payee_in_document: number;
  check_double_invoice: number;
  gr_based_inv_ver: number;
  service_based_inv_ver: number;
  qms_form_filled: number;
  sent_qms_form_link: number;
  registered_by: string | null;
  register_by_account_team: number;
  vendor_country: string;
  rejected_by: string | null;
  rejected_by_designation: string | null;
  reason_for_rejection: string | null;
  sap_error_mail_sent: number;
  registered_by_full_name: string | null;
  purchase_t_approval_full_name: string | null;
  accounts_t_approval_full_name: string | null;
  purchase_h_approval_full_name: string | null;
  rejected_by_full_name: string | null;
  company_vendor_codes: CompanyVendorCode[];
}

export interface VendorApiResponse {
  message: {
    status: string;
    message: string;
    approved_vendor_onboarding?: VendorOnboardingRecord[];
    rejected_vendor_onboarding?: VendorOnboardingRecord[];
    pending_vendor_onboarding?: VendorOnboardingRecord[];
    sap_error_vendor_onboarding?: VendorOnboardingRecord[];
    total_count: number;
    page_no: number;
    page_length: number;
  };
}
