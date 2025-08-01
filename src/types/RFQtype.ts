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

interface Quotation {
  quotation: string;
  creation: string; // or `Date` if you'll parse it
}
export type VendorDetail = {
  refno: string;
  vendor_name: string;
  vendor_code: string[]; // assuming it's an array of strings
  office_email_primary: string;
  mobile_number: string;
  service_provider_type: string | null;
  country: string;
  quotations:Quotation[];
};

export type RFQDetails = {
  unique_id:string;
  rfq:string;
  rfq_type: string;
  company_name_logistic: string;
  service_provider: string;
  sr_no: string;
  rfq_cutoff_date_logistic: string;
  rfq_date_logistic: string;
  mode_of_shipment: string;
  destination_port: string;
  country: string;
  port_code: string;
  port_of_loading: string;
  inco_terms: string | null;
  shipper_name: string;
  ship_to_address: string | null;
  package_type: string;
  no_of_pkg_units: string;
  product_category: string;
  vol_weight: string;
  actual_weight: string;
  invoice_date: string;
  invoice_no: string;
  invoice_value: string;
  expected_date_of_arrival: string;
  remarks: string;
  consignee_name: string | null;
  shipment_date: string | null;
  rfq_date: string | null;
  company_name: string | null;
  purchase_organization: string | null;
  purchase_group: string | null;
  currency: string;
  collection_number: string | null;
  quotation_deadline: string | null;
  validity_start_date: string | null;
  validity_end_date: string | null;
  bidding_person: string | null;
  service_code: string;
  service_category: string;
  material_code: string | null;
  material_category: string | null;
  plant_code: string | null;
  storage_location: string | null;
  short_text: string | null;
  rfq_quantity: string | null;
  quantity_unit: string | null;
  delivery_date: string | null;
  estimated_price: string | null;
  first_reminder: string | null;
  second_reminder: string | null;
  third_reminder: string | null;
  shipment_type: string | null;
  logistic_type:string | null;
  pr_items: any[]; // Can be defined more strictly if you know the structure
  vendor_details: VendorDetail[];
  non_onboarded_vendors: any[]; // Can also be typed properly if needed
  attachments: any[]; // Can also be typed if needed
  total_quotation_received:number;
  total_rfq_sent:number;
  status:string;
  name:string;
};
