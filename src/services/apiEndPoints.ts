import { verify } from "crypto";

const url = process.env.NEXT_PUBLIC_BACKEND_END;
const API_END_POINTS = {
  // Custom Methods
  // Standard Methods
  login: `${url}/api/method/vms.APIs.authentication_api.login.login`,
  otpEmail:`${url}/api/method/vms.APIs.authentication_api.send_otp.send_otp`,
  verifyOtp:`${url}/api/method/vms.vms.doctype.otp_verification.otp_verification.verify_otp_and_delete`,
  changePassword:`${url}/api/method/vms.APIs.authentication_api.login.reset_pwd`,
  vendorRegistrationDropdown:`${url}/api/method/vms.APIs.vendor_onboarding.vendor_registration_masters.vendor_registration_dropdown_masters`,
  companyBasedDropdown:`${url}/api/method/vms.APIs.vendor_onboarding.vendor_field_details.get_purchase_team_details`,
  purchaseGroupBasedDropdown:`${url}/api/method/vms.APIs.vendor_onboarding.vendor_field_details.account_group_details`,
  vendorRegistrationSubmit:`${url}/api/method/vms.APIs.vendor_onboarding.vendor_registration.vendor_registration`,
  vendorOnboardingDetail:`${url}/api/method/vms.APIs.vendor_onboarding.vendor_onboarding_get_data.get_vendor_onboarding_data`,
  companyDetailDropdown:`${url}/api/method/vms.APIs.vendor_onboarding.vendor_registration_masters.vendor_onboarding_company_dropdown_master`,
  companyDetailSubmit:`${url}/api/method/vms.APIs.vendor_onboarding.vendor_company_details.update_vendor_onboarding_company_details`,
  companyAddressSubmit:`${url}/api/method/vms.APIs.vendor_onboarding.vendor_company_details.update_vendor_onboarding_company_address`,
  companyAddressDropdown:`${url}/api/method/vms.APIs.vendor_onboarding.vendor_registration_masters.all_address_masters`,
  dashboardCardURL:`${url}/api/method/vms.APIs.dashboard_api.filter_card.dashboard_card`,
  dashboardPOTableURL:`${url}/api/method/vms.APIs.dashboard_api.po_data.get_po`,
  dashboardTableURL:`${url}/api/method/vms.APIs.dashboard_api.filter_card.get_vendors_based_on_status`,
  getPoDetailURL:`${url}/api/method/vms.APIs.dashboard_api.po_data.get_po_details`,
  dashboardTotalVendorTableURL:`${url}/api/method/vms.APIs.dashboard_api.filter_card.total_vendor_details`,
  dashboardPendingVendorTableURL:`${url}/api/method/vms.APIs.dashboard_api.filter_card.pending_vendor_details`,
  dashboardApprovedVendorTableURL:`${url}/api/method/vms.APIs.dashboard_api.filter_card.approved_vendor_details`,
  dashboardRejectedVendorTableURL:`${url}/api/method/vms.APIs.dashboard_api.filter_card.rejected_vendor_details`
};

export default API_END_POINTS;
