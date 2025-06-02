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
  qms_form:string
  vendor_code:string,
  country:string,
  register_by:string
  status:string,
  purchase_team:string,
  purchase_head:string,
  accounts_team:string,
  company:string
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
    address_line_1?:string,
    address_line_2?:string,
    ma_pincode:string,
    ma_district?:{name:string,district_code:string,district_name:string},
    ma_city?:{name:string,city_code:string,city_name:string},
    ma_state?:{name:string,state_code:string,state_name:string},
    ma_country?:{name:string,country_name:string,country_code:string},
  } 

  export type Address = {
    address_line_1:string,
    address_line_2:string,
    pincode:string,
    district:{name:string,district_code:string,district_name:string},
    city:{name:string,city_code:string,city_name:string},
    state:{name:string,state_code:string,state_name:string},
    country:{name:string,country_name:string,country_code:string},
  }

  export type pincodeBasedData = {
    message:{
      data:{
        city:{name:string,city_code:string,city_name:string}[],
        district:{name:string,district_code:string,district_name:string}[],
        state:{name:string,state_code:string,state_name:string}[],
        country:{name:string,country_name:string,country_code:string}[]
      }
    }
  }


  export type TcertificateCodeDropdown = {
    message:{
      data:{
        certificate_names:{
          name:string,
          certificate_name:string,
          certificate_code:string
        }[]
      }
    }
  }


  export type TbankNameDropdown = {
    data:{
      name:string
    }[]
  }


  export type TCurrencyDropdown = {
    data:{
      name:string
    }[]
  }




  export type VendorOnboardingResponse = {
    message: {
      status: string;
      message: string;
      company_details_tab: CompanyDetailsTab;
      company_address_tab: CompanyAddressDetails;
      document_details_tab: DocumentDetailsTab;
      payment_details_tab: PaymentDetailsTab;
      contact_details_tab: ContactDetails[];
      manufacturing_details_tab: ManufacturingDetailsTab;
      employee_details_tab:EmployeeDetail[];
      machinery_details_tab:MachineryDetail[];
      testing_details_tab:TestingDetail[];
      reputed_partners_details_tab:ReputedPartnerDetail[];
      certificate_details_tab:CertificateDetail[]
    };
  };

  type CompanyAddressDetails = {
    same_as_above: number;
    multiple_locations: number;
    billing_address: BillingAddress;
    shipping_address: ShippingAddress;
    multiple_location_table: MultipleLocationEntry[];
    address_proofattachment: AddressProofAttachment;
  };


  type LocationDetail = {
    name: string;
    city_code?: string;
    city_name?: string;
    district_code?: string;
    district_name?: string;
    state_code?: string;
    state_name?: string;
    country_code?: string;
    country_name?: string;
  };
  
  type BillingAddress = {
    address_line_1: string;
    address_line_2: string;
    pincode: string;
    city: string;
    district: string;
    state: string;
    country: string;
    city_details: LocationDetail;
    district_details: LocationDetail;
    state_details: LocationDetail;
    country_details: LocationDetail;
  };
  
  type ShippingAddress = {
    street_1: string ;
    street_2: string ;
    manufacturing_pincode: string ;
    manufacturing_city: string ;
    manufacturing_district: string ;
    manufacturing_state: string ;
    manufacturing_country: string ;
    city_details: LocationDetail ;
    district_details: LocationDetail ;
    state_details: LocationDetail ;
    country_details: LocationDetail ;
  };
  

  type MultipleLocationEntry = {
    name: string;
    owner: string;
    creation: string;
    modified: string;
    modified_by: string;
    docstatus: number;
    idx: number;
    address_line_1: string;
    address_line_2: string;
    ma_pincode: string;
    ma_district: string;
    ma_city: string;
    ma_state: string;
    ma_country: string;
    parent: string;
    parentfield: string;
    parenttype: string;
    doctype: string;
    city_details: LocationDetail;
    district_details: LocationDetail;
    state_details: LocationDetail;
    country_details: LocationDetail;
  };
  

  type AddressProofAttachment = {
    url: string;
    name: string;
  };
  
  
  export type CertificateAttachment = {
    url: string;
    name: string;
    file_name: string;
  };
  
  type CertificateDetail = {
    name: string;
    idx: number;
    certificate_code: string;
    valid_till: string; // format: YYYY-MM-DD
    certificate_attach: CertificateAttachment;
  };


  type ReputedPartnerDetail = {
    name: string;
    owner: string;
    creation: string;
    modified: string;
    modified_by: string;
    docstatus: number;
    idx: number;
    company_name: string;
    test: string | null;
    supplied_qtyyear: string;
    remark: string;
    parent: string;
    parentfield: string;
    parenttype: string;
    doctype: string;
  };

  type TestingDetail = {
    name: string;
    owner: string;
    creation: string;
    modified: string;
    modified_by: string;
    docstatus: number;
    idx: number;
    equipment_name: string;
    equipment_qty: string;
    capacity: string;
    remarks: string;
    parent: string;
    parentfield: string;
    parenttype: string;
    doctype: string;
  };

  type MachineryDetail = {
    name: string;
    owner: string;
    creation: string; // ISO timestamp
    modified: string; // ISO timestamp
    modified_by: string;
    docstatus: number;
    idx: number;
    equipment_name: string;
    equipment_qty: string;
    capacity: string;
    remarks: string;
    parent: string;
    parentfield: string;
    parenttype: string;
    doctype: string;
  };

  type EmployeeDetail = {
    name: string;
    owner: string;
    creation: string; // ISO timestamp as string
    modified: string; // ISO timestamp as string
    modified_by: string;
    docstatus: number;
    idx: number;
    production: string;
    qaqc: string;
    logistics: string;
    marketing: string;
    r_d: string;
    hse: string;
    other: string;
    parent: string;
    parentfield: string;
    parenttype: string;
    doctype: string;
  };
  
  type CompanyDetailsTab = {
    vendor_title: string | null;
    vendor_name: string | null;
    company_name: string | null;
    type_of_business: string;
    size_of_company: string;
    website: string;
    registered_office_number: string;
    telephone_number: string;
    whatsapp_number: string;
    established_year: string;
    office_email_primary: string;
    office_email_secondary: string;
    corporate_identification_number: string;
    cin_date: string;
    nature_of_company: string;
    nature_of_business: string;
    vendor_types: string[];
  };
  

  
  type FileAttachment = {
    url: string;
    name: string;
    file_name?: string;
  };
  
  type DocumentDetailsTab = {
    company_pan_number: string;
    name_on_company_pan: string;
    enterprise_registration_number: string;
    msme_registered: string;
    msme_enterprise_type: string;
    udyam_number: string;
    name_on_udyam_certificate: string ;
    pan_proof: FileAttachment;
    entity_proof: FileAttachment;
    msme_proof: FileAttachment;
    gst_table: any[]; // Adjust if GST structure is known
  };
  
  type PaymentDetailsTab = {
    bank_name: string;
    ifsc_code: string;
    account_number: string;
    name_of_account_holder: string;
    type_of_account: string;
    currency: string;
    rtgs: number;
    neft: number;
    bank_proof: FileAttachment;
  };
  
  type ContactDetails = {
    name: string;
    owner: string;
    creation: string;
    modified: string;
    modified_by: string;
    docstatus: number;
    idx: number;
    first_name: string;
    last_name: string;
    designation: string;
    email: string;
    contact_number: string;
    department_name: string;
    parent: string;
    parentfield: string;
    parenttype: string;
    doctype: string;
  };
  
  type ManufacturingDetailsTab = {
    total_godown: string;
    storage_capacity: string;
    spare_capacity: string;
    type_of_premises: string;
    working_hours: string;
    weekly_holidays: string;
    number_of_manpower: string;
    annual_revenue: string;
    cold_storage: number;
    materials_supplied: SuppliedMaterial[];
    brochure_proof: FileAttachment;
    organisation_structure_document: FileAttachment;
  };
  
  type SuppliedMaterial = {
    name: string;
    owner: string;
    creation: string;
    modified: string;
    modified_by: string;
    docstatus: number;
    idx: number;
    material_description: string;
    material_images: FileAttachment;
    annual_capacity: string;
    hsnsac_code: string;
    parent: string;
    parentfield: string;
    parenttype: string;
    doctype: string;
  };


  type GstVendorType = {
    name: string;
    registration_ven_code: string;
    registration_ven_name: string;
  };
  
  type StateMaster = {
    name: string;
    state_code: string;
    state_name: string;
  };
  
  type DropdownMasters = {
    gst_vendor_type: GstVendorType[];
    state_master: StateMaster[];
  };

  export type TdocumentDetailDropdown = {
    message:{
      status: string; // e.g., "success"
      message: string; // e.g., "Dropdown masters fetched successfully."
      data: DropdownMasters;
    }
  }


  export type TCompanyAddressDetail = {
    ref_no:string,
    vendor_onboarding:string,
    billing_address:Partial<Address>,
    shipping_address:Partial<Address>,
    same_as_above:number,
    multiple_locations:number,
    multiple_location_table:TmultipleLocation[]
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

  type dispatch_vendor_onboarding = {
    name: string;
    owner: string;
    creation: string;
    modified: string;
    modified_by: string;
    docstatus: number;
    idx: number;
    ref_no: string;
    vendor_name: string;
    company_name: string;
    onboarding_form_status: string 
    purchase_t_approval: string 
    purchase_h_approval: string 
    accounts_t_approval: string 
    qms_form: string 
    purchase_team_undertaking: number;
    accounts_team_undertaking: number;
    purchase_head_undertaking: number;
  }
  
  export interface DashboardTableType {
    status: string;
    message: string;
    total_vendor_onboarding: VendorOnboarding[];
    pending_vendor_onboarding:VendorOnboarding[];
    rejected_vendor_onboarding:VendorOnboarding[];
    approved_vendor_onboarding:VendorOnboarding[];
    dispatch_vendor_onboarding:dispatch_vendor_onboarding[]
    qms_form:string
  }
  
