export interface VendorOnboardingResponse {
  message: {
    status: string;
    message: string;
    total_vendor_onboarding: VendorOnboarding[];
  };
}

export interface VendorOnboarding {
  name: string;
  ref_no: string;
  company_name: string;
  vendor_name: string;
  onboarding_form_status: string;
  modified: string;
  qms_form_filled: 0 | 1;
  sent_qms_form_link: 0 | 1;
  registered_by: string;
  vendor_country: string;
  document_details: string;
  payment_detail: string;
  company_vendor_codes: CompanyVendorCode[];
  document_details_data: DocumentDetailsData;
  company_details: CompanyDetails;
  payment_details_data: PaymentDetailsData;
  vendor_master: VendorMaster;
}

/* ------------ Company & Vendor Codes ------------ */
export interface CompanyVendorCode {
  company_name: string;
  company_code: string;
  vendor_codes: VendorCode[];
}

export interface VendorCode {
  state: string;
  gst_no: string;
  vendor_code: string;
}

/* ------------ Document Details ------------ */
export interface DocumentDetailsData {
  company_pan_number: string;
  name_on_company_pan: string | null;
  enterprise_registration_number: string | null;
  msme_registered: string;
  msme_enterprise_type: string;
  udyam_number: string | null;
  name_on_udyam_certificate: string | null;
  iec: string | null;
  trc_certificate_no: string | null;

  pan_proof: FileProof;
  entity_proof: FileProof;
  msme_proof: FileProof;
  iec_proof: FileProof;
  form_10f_proof: FileProof;
  trc_certificate: FileProof;
  pe_certificate: FileProof;

  gst_table: GSTDetail[];
}

export interface FileProof {
  url: string;
  name: string;
  file_name: string;
}

export interface GSTDetail {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  gst_state: string;
  gst_number: string;
  gst_registration_date: string;
  gst_ven_type: string;
  gst_document: FileProof;
  pincode: string | null;
  company: string | null;
  parent: string;
  parentfield: string;
  parenttype: string;
  doctype: string;
  state_details: StateDetails;
}

export interface StateDetails {
  name: string;
  state_code: string;
  state_name: string;
}

/* ------------ Company Details ------------ */
export interface CompanyDetails {
  address_line_1: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  international_city: string | null;
  international_state: string | null;
  international_country: string | null;
  international_zipcode: string | null;
}

/* ------------ Payment Details ------------ */
export interface PaymentDetailsData {
  bank_name: string;
  ifsc_code: string;
  account_number: string;
  name_of_account_holder: string;
  type_of_account: string;
  currency: string;
  rtgs: number;
  neft: number;
  ift: number;
  bank_name_details: BankNameDetails;
  bank_proof: FileProof;
  bank_proof_by_purchase_team: FileProof;
  address: {
    country: string;
  };
  international_bank_details: any[]; // expand later if backend adds structure
  intermediate_bank_details: any[];
}

export interface BankNameDetails {
  name: string;
  bank_code: string;
  country: string;
  description: string | null;
}

/* ------------ Vendor Master ------------ */
export interface VendorMaster {
  vendor_name: string;
  mobile_number: string;
  office_email_primary: string;
  service_provider_type: string | null;
}
