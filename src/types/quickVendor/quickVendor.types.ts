export interface TVendorType {
    name: string;
    description: string;
}

export interface TVendorTitle {
    name: string;
}

export interface TVendorMasterResponse {
    message: {
        status: string;
        message: string;
        vendor_types: TVendorType[];
        vendor_title: TVendorTitle[];
    }
}

export interface TCompanyCode {
    name: string;
    company_name: string;
}

export interface TCompanyCodeResponse {
    message: {
        success: boolean;
        message: string;
        user: string;
        data: TCompanyCode[];
    }
}

export interface TPurchaseOrg {
    name: string;
    purchase_organization_name: string;
    description: string;
}

export interface TPurchaseOrgResponse {
    message: {
        success: boolean;
        message: string;
        data: TPurchaseOrg[];
        total_count: number;
        page_no: number;
        page_size: number;
    }
}

export interface TCurrency {
    name: string;
    currency_name: string;
}

export interface TCurrencyResponse {
    message: {
        status: string;
        message: string;
        total_records: number;
        page_no: number;
        page_size: number;
        data: TCurrency[];
    }
}

export interface TAccountGroup {
    name: string;
    account_group_name: string;
}

export interface TAccountGroupResponse {
    message: {
        success: boolean;
        message: string;
        data: TAccountGroup[];
        total_count: number;
    }
}

export interface TPincode {
    name: string;
}

export interface TPincodeResponse {
    message: {
        status: string;
        message: string;
        total_records: number;
        page_no: number;
        page_size: number;
        data: TPincode[];
    }
}

export interface TLocationData {
    pincode: string;
    city: {
        name: string;
        city_name: string;
    };
    district: {
        name: string;
        district_name: string;
    };
    state: {
        name: string;
        state_name: string;
    };
    country: {
        name: string;
        country_name: string;
    };
}

export interface TLocationByPincodeResponse {
    message: {
        status: string;
        message: string;
        data: TLocationData;
    }
}

export interface TReconciliation {
    name: string;
    reconcil_account: string;
    reconcil_description: string;
}

export interface TReconciliationResponse {
    message: {
        status: string;
        message: string;
        total_records: number;
        page_no: number;
        page_size: number;
        data: TReconciliation[];
    }
}

export interface TTermsOfPayment {
    name: string;
    terms_of_payment_name: string | null;
    description: string | null;
}

export interface TTermsOfPaymentResponse {
    message: {
        success: boolean;
        message: string;
        data: TTermsOfPayment[];
        total_count: number;
        page_no: number;
        page_size: number;
    }
}

export interface TCountry {
    name: string;
    country_code: string;
}

export interface TCountryMasterResponse {
    message: {
        status: string;
        message: string;
        total_records: number;
        page_no: number;
        page_size: number;
        data: TCountry[];
    }
}

export interface TBankKey {
    name: string;
    bank_code: string;
    bank_name: string;
}

export interface TBankKeyMasterResponse {
    message: {
        status: string;
        message: string;
        total_records: number;
        page_no: number;
        page_size: number;
        data: TBankKey[];
    }
}

export interface TState {
    name: string;
    state_code: string;
}

export interface TStateMasterResponse {
    message: {
        status: string;
        message: string;
        total_records: number;
        page_no: number;
        page_size: number;
        data: TState[];
    }
}

export interface TGstDetail {
    gst_state: string;
    gst_number: string;
    gst_ven_class: string;
}

export interface TContactPerson {
    first_name: string;
    last_name: string;
    email: string;
    contact_number: string;
}

export interface TBankDetail {
    country: string;
    bank_key: string;
    bank_name: string;
    bank_type: string;
    name_of_account_holder: string;
    account_number: string;
    ak: string;
    bnkt: string;
    ifsc_code: string;
}

export interface TInternationalBankDetail {
    meril_company_name: string;
    beneficiary_name: string;
    beneficiary_bank_name: string;
    beneficiary_account_no: string;
    beneficiary_iban_no: string;
    beneficiary_bank_address: string;
    beneficiary_swift_code: string;
    beneficiary_ach_no: string;
    beneficiary_aba_no: string;
    beneficiary_routing_no: string;
}

export interface TVendorDetails {
    vendor_title: string;
    vendor_name: string;
    vendors_primary_email: string;
    mobile_no: string;
    search_term: string;
    vendor_type: string;
    company_code: string;
    purchase_organization: string;
    account_group: string;
    reconciliation_account: string;
    terms_of_payment: string;
    order_currency: string;
    incoterms: string;
    street_house_no: string;
    street_2: string;
    street_3: string;
    street_4: string;
    postal_code: string;
    city: string;
    district: string;
    region: string;
    country: string;
    gst_no: string;
    gst_ven_class: string;
    pan_number: string;
    payee_in_document: boolean;
    check_double_invoice: boolean;
    gr_based_inv_verif: boolean;
    service_based_inv_verif: boolean;
    state: string;
    gst_details: TGstDetail[];
    contact_persons: TContactPerson[];
    bank_details: TBankDetail[];
    international_bank_details: TInternationalBankDetail[];
}

export interface TVendorRegistrationRequest {
    vendor_details: TVendorDetails;
}

export interface TVendorRegistrationResponse {
    message: {
        status: string;
        message: string;
        vendor_id: string;
        onboarding_id: string;
    }
}

export interface TFileAttachment {
    url: string;
    name: string;
    file_name: string;
}

export interface TOnboardingGstDetail {
    name: string;
    gst_state: string;
    gst_number: string;
    gst_ven_class: string;
    gst_document: TFileAttachment;
}

export interface TGstAttachment {
    name: string;
    gst_attachment_detail: TFileAttachment;
}

export interface TOnboardingContactPerson {
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    contact_number: string;
}

export interface TOnboardingBankDetail {
    name: string;
    country: string;
    bank_name: string;
    account_number: string;
    domestic_bank_proof: TFileAttachment;
}

export interface TOnboardingInternationalBankDetail {
    name: string;
    meril_company_name: string;
    beneficiary_name: string;
    swift_code: string;
    iban_no: string;
    beneficiary_bank_name: string | null;
    beneficiary_account_no: string | null;
    beneficiary_currency: string | null;
    import_bank_proof: TFileAttachment;
}

export interface TBankDetailsAttachment {
    name: string;
    bank_attachment_detail: TFileAttachment;
}

export interface TOnboardingData {
    name: string;
    vendor_name: string;
    vendor_title: string;
    email: string;
    mobile_number: string;
    search_term: string;
    company_code: string;
    purchase_organization: string;
    account_group: string;
    reconciliation_account: string;
    terms_of_payment: string;
    state: string;
    order_currency: string;
    incoterms: string;
    street_house_no: string;
    street_2: string;
    street_3: string;
    street_4: string;
    postal_code: string;
    city: string;
    district: string;
    region: string;
    country: string;
    gst_no: string;
    gst_ven_class: string;
    pan_number: string;
    payee_in_document: number;
    check_double_invoice: number;
    gr_base_inv_ver: number;
    service_base_inv_ver: number;
    vendor_types: string[];
    gst_details: TOnboardingGstDetail[];
    gst_attachment: TGstAttachment[];
    contact_persons: TOnboardingContactPerson[];
    bank_details: TOnboardingBankDetail[];
    international_bank_details: TOnboardingInternationalBankDetail[];
    bank_details_attachment: TBankDetailsAttachment[];
    requester: {
        full_name: string;
    };
}

export interface TOnboardingDetailsResponse {
    message: {
        success: boolean;
        message: string;
        data: TOnboardingData;
    }
}

export interface TIncoterm {
    name: string;
    incoterm_code: string;
    incoterm_name: string;
}

export interface TIncotermResponse {
    message: {
        success: boolean;
        message: string;
        data: TIncoterm[];
        total_count: number;
        page_no: number;
        page_size: number;
    }
}
