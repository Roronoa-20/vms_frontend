export interface CompanyMasterData {
  name: string;
  creation: string;
  modified: string;
  modified_by: string;
  owner: string;
  docstatus: number;
  idx: number;
  sap_client_code: string;
  company_code: string;
  company_name: string;
  company_short_form: string;
  description: string;
  _user_tags: string | null;
  _comments: string | null;
  _assign: string | null;
  _liked_by: string | null;
  gstin_number: string | null;
  dl_number: string | null;
  ssi_region_number: string | null;
  company_logo: string | null;
  street_1: string | null;
  street_2: string | null;
  city: string | null;
  pincode: string | null;
}

export interface MultipleCompanyData {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  company_name: string;
  purchase_organization: string;
  account_group: string;
  terms_of_payment: string;
  sap_client_code: string;
  purchase_group: string;
  order_currency: string;
  incoterm: string;
  reconciliation_account: string | null;
  company_vendor_code: string | null;
  parent: string;
  parentfield: string;
  parenttype: string;
  doctype: string;
  company_master_data: CompanyMasterData;
}

export interface VendorCompanyResponse {
  message: {
    success: boolean;
    data: MultipleCompanyData[];
    vendor_master_id: string;
  };
}
