import { Vendor, CompanyData, VendorOnboardingRecord } from "./allvendorstypes";

export interface RowData extends Vendor {
  ref_no: string;
  multiple_company: number;
  company_code: string;
  vendor_code: string;
  vendor_type?: string; 
  pan_number: string;
  pan_file?: string;
  gst_no?: string;
  gst_file?: string;
  state?: string;
  pincode?: string;
  bank_name?: string;
  ifsc_code?: string;
  bank_file?: string;
  sap_client_code?: string;
  purchase_org?: string;
}

export interface ExtendRowData extends RowData {
  prev_company: string;
  extend_company: string;
}

export interface MultipleCompanyData {
  company_name: string,
  purchase_organization?: string,
  account_group?: string,
  terms_of_payment?: string,
  sap_client_code?: string,
  purchase_group?: string,
  order_currency?: string,
  incoterm?: string,
  reconciliation_account?: string,
  company_vendor_code: string,
  company_display_name: string;
  via_import?: number | boolean | string;
}
