const url = process.env.NEXT_PUBLIC_BACKEND_END;

export const QUICK_VENDOR_END_POINTS = {
    getVendorTypeMasterList: `${url}/api/method/vms.utils.master_data.get_vendor_type_master_list`,
    getCompanyCodesBySessionUser: `${url}/api/method/vms.utils.master_data.get_company_codes_by_session_user`,
    getPurchaseOrgMasterData: `${url}/api/method/vms.utils.master_data.get_purchase_org_master_data`,
    getCurrencyMasterList: `${url}/api/method/vms.utils.master_data.get_currency_master_list`,
    getAccountGroupMasterData: `${url}/api/method/vms.utils.master_data.get_account_group_master_data`,
    getPincodeMaster: `${url}/api/method/vms.utils.master_data.get_pincode_master`,
    getLocationByPincode: `${url}/api/method/vms.utils.master_data.get_location_by_pincode`,
    getReconciliationMasterData: `${url}/api/method/vms.utils.master_data.get_reconciliation_master_data`,
    getTermsOfPaymentMasterData: `${url}/api/method/vms.utils.master_data.get_terms_of_payment_master_data`,
    getCountryMasterList: `${url}/api/method/vms.utils.master_data.get_country_master_list`,
    getBankKeyMasterData: `${url}/api/method/vms.utils.master_data.get_bank_key_master_data`,
    getStateMasterList: `${url}/api/method/vms.utils.master_data.get_state_master_list`,
    createQuickVendorOnboarding: `${url}/api/method/vms.APIs.quick_onboarding.v1.vendor_registration.vendor_registration`,
    getQuickVendorOnboardingDetails: `${url}/api/method/vms.APIs.quick_onboarding.v1.quick_vendor_onboarding_details.get_quick_vendor_onboarding_details`,
    getIncotermsMasterData: `${url}/api/method/vms.utils.master_data.get_incoterms_master_data`,
}
