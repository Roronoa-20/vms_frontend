export interface VendorDataRFQ {
  refno: string;
  vendor_name: string;
  office_email_primary: string;
  mobile_number: string;
  country: string;
  service_provider_type:string;
  vendor_code: string[];
}

export interface VendorApiResponse {
  status: 'success' | 'error';
  message: string;
  data: VendorDataRFQ[];
  total_count: number;
  page_no: number;
  page_length: number;
}

export interface VendorSelectType{
    vendors :VendorDataRFQ[]
}
export interface SAPPRData {
  name: string;
  sap_pr_code: string;
}
