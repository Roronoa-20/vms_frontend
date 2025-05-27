export type Tlogin = {
  usr: string;
  pwd: string;
};

export type TSendOtp = {
  message: {
    Authorization: string,
    message: string,
    status: string
  }
}

export type TvendorRegistrationDropdown = {
  message: {
    data: {
      vendor_type: { name: string }[],
      vendor_title: { name: string }[],
      country_master: { name: string }[],
      company_master: { name: string }[],
      incoterm_master: { name: string }[],
      currency_master: { name: string }[]
    }
  }
}


export type TCompanyAddressDropdown = {
  message: {
    data: {
      city_master: { name: string, city_code: string, city_name: string }[],
      district_master: { name: string, district_code: string, district_name: string }[],
      state_master: { state_name: string }[],
      country_master: { country_name: string }[]
    }
  }
}

export type TcompanyNameBasedDropdown = {
  message: {
    data: {
      purchase_organizations: {
        name: string,
        purchase_organization_name: string
      }[],
      purchase_groups: {
        name: string,
        purchase_group_name: string,
        descriptionn: string
      }[],
      terms_of_payment: {
        name: string,
        terms_of_payment_name: string,
        description: string
      }[]
    }
  }
}

export type TpurchaseOrganizationBasedDropdown = {
  message: {
    name: string,
    account_group_name: string
  }[]
}


export type VendorType = {
  vendor_type: string;
};

export type CompanyData = {
  company_name: string;
  purchase_organization: string;
  account_group: string;
  terms_of_payment: string;
  purchase_group: string;
  order_currency: string;
  incoterm: string;
};

export type VendorRegistrationData = {
  vendor_title: string;
  vendor_name: string;
  office_email_primary: string;
  search_term: string;
  country: string;
  mobile_number: string;
  registered_date: string;
  qa_required: string;
  qms_required: number;

  multiple_company_data: CompanyData[];
  vendor_types: VendorType[];

  purchase_organization: string;
  account_group: string;
  purchase_group: string;
  terms_of_payment: string;
  order_currency: string;
  incoterms: string;
  company_name: string
};


type CompanyOfVendor = {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  vendor_company_details: string;
  parent: string;
  parentfield: string;
  parenttype: string;
  doctype: string;
};

type VendorTypeGroup = {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  vendor_type: string;
  parent: string;
  parentfield: string;
  parenttype: string;
  doctype: string;
};

type VendorOnboarding = {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  ref_no: string;
  qms_required: string;
  onboarding_form_status: string | null;
  rejection_comment: string | null;
  purchase_t_approval: string | null;
  purchase_team_undertaking: number;
  accounts_t_approval: string | null;
  accounts_team_undertaking: number;
  purchase_h_approval: string | null;
  purchase_head_undertaking: number;
  form_fully_submitted_by_vendor: number;
  rejected: number;
  rejected_by: string | null;
  reason_for_rejection: string | null;
  payment_detail: string;
  document_details: string;
  certificate_details: string;
  manufacturing_details: string;
  payee_in_document: number;
  check_double_invoice: number;
  gr_based_inv_ver: number;
  service_based_inv_ver: number;
  purchase_organization: string;
  order_currency: string;
  terms_of_payment: string;
  purchase_group: string;
  incoterms: string;
  account_group: string;
  purchase_team_remarks: string | null;
  purchase_head_remarks: string | null;
  enterprise: string | null;
  reconciliation_account: string | null;
  qa_team_remarks: string | null;
  doctype: string;
  company_name: string
  number_of_employee: any[];
  contact_details: any[];
  reputed_partners: any[];
  vendor_company_details: CompanyOfVendor[];
  vendor_types: VendorTypeGroup[];
  testing_detail: any[];
  machinery_detail: any[];
  vendor_name:string;
};

type MultipleCompanyData = {
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
  purchase_group: string;
  order_currency: string;
  incoterm: string;
  reconciliation_account: string | null;
  company_vendor_code: string | null;
  parent: string;
  parentfield: string;
  parenttype: string;
  doctype: string;
};

type VendorMaster = {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  vendor_title: string;
  vendor_name: string;
  first_name: string | null;
  last_name: string | null;
  office_email_primary: string;
  search_term: string;
  payee_in_document: number;
  gr_based_inv_ver: number;
  service_based_inv_ver: number;
  check_double_invoice: number;
  country: string;
  mobile_number: string;
  office_email_secondary: string | null;
  registered_date: string;
  qa_required: string;
  send_welcome_email: number;
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
  doctype: string;
  multiple_company_data: MultipleCompanyData[];
  vendor_types: VendorTypeGroup[];
};

export type TcompanyDetailDropdown = {
  message: {
    data: {
      type_of_business: { name: string }[],
      company_nature_master: { name: string }[],
      business_nature_master: { name: string }[]
    }
  }
}

export type TVendorCompanyDetail = {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  naming_series: string;
  ref_no: string;
  vendor_onboarding: string;
  gst: string | null;
  company_pan_number: string | null;
  vendor_title: string | null;
  company_name: string | null;
  type_of_business: string | null;
  website: string | null;
  office_email_primary: string | null;
  office_email_secondary: string | null;
  telephone_number: string | null;
  whatsapp_number: string | null;
  vendor_name: string | null;
  cin_date: string | null;
  nature_of_company: string | null;
  size_of_company: string | null;
  registered_office_number: string | null;
  established_year: string | null;
  nature_of_business: string | null;
  corporate_identification_number: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  pincode: string | null;
  same_as_above: number;
  street_1: string | null;
  street_2: string | null;
  manufacturing_city: string | null;
  manufacturing_district: string | null;
  manufacturing_state: string | null;
  manufacturing_country: string | null;
  manufacturing_pincode: string | null;
  multiple_locations: number;
  address_proofattachment: string | null;
}


export type TvendorOnboardingDetail = {
  message: {
    data: {
      vendor_onboarding: VendorOnboarding;
      vendor_master: VendorMaster;
      vendor_company_details: TVendorCompanyDetail[]
    }
  }
}

export type TCompanyDetailForm = {
  ref_no: string,
  vendor_onboarding: string,
  type_of_business: string,
  website: string,
  office_email_primary: string,
  office_email_secondary: string,
  telephone_number: string,
  whatsapp_number: string,
  cin_date: string,
  nature_of_company: string,
  size_of_company: string,
  registered_office_number: string,
  established_year: string,
  nature_of_business: string,
  corporate_identification_number: string
}


export type TmultipleLocation = {
  address_line_1: string,
  address_line2: string,
  ma_pincode: string,
  ma_district: string,
  ma_city: string,
  ma_state: string,
  ma_country: string
}

export type Address = {
  address_line1: string,
  address_line2: string,
  pincode: string,
  district: string,
  city: string,
  state: string,
  country: string
}


export type TCompanyAddressDetail = {
  ref_no: string,
  vendor_onboarding: string,
  billing_address: Address,
  shipping_address: Address,
  same_as_above: number,
  multiple_locations: number,
  multiple_location_table: TmultipleLocation[]
}

export type dashboardCardData = {
  status: string;
  message: string;
  role: string[];
  team: string;
  total_vendor_count: number;
  pending_vendor_count: number;
  approved_vendor_count: number;
  current_month_vendor: number;
  rejected_vendor_count:number;
}

// export type DashboardTableType = {
//   vendor_onboarding: VendorOnboarding;
//   vendor_master: VendorMaster[];
//   vendor_company_details: TVendorCompanyDetail[]
// }
export interface DashboardPOTableItem {
  name: string;
  creation: string;
  modified: string;
  modified_by: string;
  owner: string;
  docstatus: number;
  idx: number;
  supplier_name: string;
  po_no: string;
  bill_to_company: string;
  ship_to_company: string;
  rfq_code: string | null;
  vendor_gst_no: string | null;
  contact_person: string | null;
  phonemobile_no: string | null;
  email: string | null;
  delivery_terms: string | null;
  dispatch_mode: string;
  currency: string;
  supplier_quote_ref: string | null;
  po_date: string | null;
  ref_pr_date: string | null;
  contact_person2: string | null;
  telephone_no: string;
  email2: string;
  total_gross_amount: string;
  total_value_in_words: string | null;
  vendor_code: string;
  purchase_order_type: string;
  purchase_order_category: string;
  purchase_organization: string;
  company_code: string;
  collection_number: string;
  delivery_date: string | null;
  purchase_group: string;
  ref_pr_no: string;
  ref_pr_person: string | null;
  phone_no: string;
  msme_no: string | null;
  total_input_cgst: string;
  delivery_schedule: string | null;
  po_change_date: string | null;
  po_release_date: string | null;
  tax_code: string;
  exchange_rate: string;
  total_input_sgst: string;
  vendors_reason_to_reject: string | null;
  storage_location: string;
  po_plant: string;
  lead_time: string | null;
  packaging_shipping_details: string;
  warranty_support_details: string | null;
  return_refund_policy: string | null;
  quote_vol_per_unit: string | null;
  total_order_pricing: string | null;
  rfq_date: string | null;
  status: string;
  po_number: string;
  dl_no: string | null;
  gstin_no: string | null;
  terms_of_payment: string;
  terms_of_payment_code: string;
  total_value_of_po__so: string | null;
  other_note: string | null;
  total_input_igst: string;
  vendor_status: string;
  vendors_tentative_delivery_date: string | null;
  street_1: string;
  street_4: string;
  city: string;
  district: string;
  state: string | null;
  street_2: string;
  street_3: string;
  country: string;
  pincode: string;
  shipping_street1: string;
  shipping_street4: string;
  shipping_city: string;
  shipping_state: string | null;
  description: string | null;
  shipping_street2: string;
  shipping_street3: string;
  shipping_district: string | null;
  shipping_country: string;
  shipping_pincode: string;
  instructions: string | null;
  _user_tags: string | null;
  _comments: string | null;
  _assign: string | null;
  _liked_by: string | null;
}

export interface DashboardPOTableData {
  message: DashboardPOTableItem[];
}

export interface PurchaseOrderItem {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  product_code: string;
  product_name: string | null;
  material_code: string;
  material_type: string;
  material_category: string;
  product_category: string;
  hsnsac: string;
  uom: string;
  quantity: string;
  rate: string;
  pending_qty: string | null;
  dispatch_qty: string | null;
  price: string;
  base_amount: string;
  total_input_sgst: string;
  total_input_cgst: string;
  total_input_igst: string;
  short_text: string;
  plant: string;
  schedule_date: string | null;
  po_date: string | null;
  delivery_date: string | null;
  parent: string;
  parentfield: string;
  parenttype: string;
  doctype: string;
}

export interface PurchaseOrder {
  name: string;
  owner: string;
  creation: string;
  modified: string;
  modified_by: string;
  docstatus: number;
  idx: number;
  supplier_name: string;
  po_no: string;
  bill_to_company: string;
  ship_to_company: string;
  rfq_code: string | null;
  vendor_gst_no: string | null;
  contact_person: string | null;
  phonemobile_no: string | null;
  email: string | null;
  delivery_terms: string | null;
  dispatch_mode: string;
  currency: string;
  supplier_quote_ref: string | null;
  po_date: string | null;
  ref_pr_date: string | null;
  contact_person2: string | null;
  telephone_no: string;
  email2: string;
  total_gross_amount: string;
  total_value_in_words: string | null;
  vendor_code: string;
  purchase_order_type: string;
  purchase_order_category: string;
  purchase_organization: string;
  company_code: string;
  collection_number: string;
  delivery_date: string | null;
  purchase_group: string;
  ref_pr_no: string;
  ref_pr_person: string | null;
  phone_no: string;
  msme_no: string | null;
  total_input_cgst: string;
  delivery_schedule: string | null;
  po_change_date: string | null;
  po_release_date: string | null;
  tax_code: string;
  exchange_rate: string;
  total_input_sgst: string;
  vendors_reason_to_reject: string | null;
  storage_location: string;
  po_plant: string;
  lead_time: string | null;
  packaging_shipping_details: string;
  warranty_support_details: string | null;
  return_refund_policy: string | null;
  quote_vol_per_unit: string | null;
  total_order_pricing: string | null;
  rfq_date: string | null;
  status: string;
  po_number: string;
  dl_no: string | null;
  gstin_no: string | null;
  terms_of_payment: string;
  terms_of_payment_code: string;
  total_value_of_po__so: string | null;
  other_note: string | null;
  total_input_igst: string;
  vendor_status: string;
  vendors_tentative_delivery_date: string | null;
  street_1: string;
  street_4: string;
  city: string;
  district: string;
  state: string | null;
  street_2: string;
  street_3: string;
  country: string;
  pincode: string;
  shipping_street1: string;
  shipping_street4: string;
  shipping_city: string;
  shipping_state: string | null;
  description: string | null;
  shipping_street2: string;
  shipping_street3: string;
  shipping_district: string | null;
  shipping_country: string;
  shipping_pincode: string;
  instructions: string | null;
  doctype: string;
  po_items: PurchaseOrderItem[];
}

export interface PurchaseOrderResponse {
  message: PurchaseOrder;
}

export interface DashboardTableType {
  status: string;
  message: string;
  total_vendor_onboarding: VendorOnboarding[];
  pending_vendor_onboarding:VendorOnboarding[];
  rejected_vendor_onboarding:VendorOnboarding[];
  approved_vendor_onboarding:VendorOnboarding[];
}
