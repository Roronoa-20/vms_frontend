import React from 'react'
import OnboardingTab from '../molecules/OnboardingTab'
import CompanyDetailForm from '../templates/ViewOnboardingDetail/CompanyDetails'
import CompanyAddress from '../templates/ViewOnboardingDetail/CompanyAddress'
import DocumentDetails from '../templates/ViewOnboardingDetail/DocumentDetails'
import PaymentDetail from '../templates/ViewOnboardingDetail/PaymentDetail'
import ContactDetail from '../templates/ViewOnboardingDetail/ContactDetail'
import ManufacturingDetail from '../templates/ViewOnboardingDetail/ManufacturingDetail'
import EmployeeDetail from '../templates/ViewOnboardingDetail/EmployeeDetail'
import MachineryDetail from '../templates/ViewOnboardingDetail/MachineryDetail'
import TestingFacility from '../templates/ViewOnboardingDetail/TestingFacility'
import ReputedPartners from '../templates/ViewOnboardingDetail/ReputedPartners'
import Certificate from '../templates/ViewOnboardingDetail/Certificate'
import { Button } from '../atoms/button'
import { cookies } from 'next/headers'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import { TbankNameDropdown, TcertificateCodeDropdown, TCompanyAddressDropdown, TcompanyDetailDropdown, TCurrencyDropdown, TdocumentDetailDropdown, TReconsiliationDropdown, TvendorOnboardingDetail, VendorOnboardingResponse } from '@/src/types/types'
import ApprovalButton from '../molecules/ApprovalButton'
import PurchaseDetails from '../templates/ViewOnboardingDetail/PurchaseDetails'
import InternationalDocumentDetails from '../templates/ViewOnboardingDetail/InternationalDocumentDetails'
import InternationalPaymentDetail from '../templates/ViewOnboardingDetail/InternationalPaymentDetail'
import InternationalCompanyAddress from '../templates/ViewOnboardingDetail/InternationalCompanyAddress'

interface Props {
  vendor_onboarding: any;
  tabtype: string;
  refno: string;
}

const ViewOnboardingDetails = async ({ vendor_onboarding, tabtype, refno }: Props) => {
  const cookie = await cookies()
  const cookieStore = await cookies();
  const user = cookie.get("user_id")?.value
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

  const vendorOnboardingRefno = vendor_onboarding;
  const tabType = tabtype;

  const companyDetailDropdownUrl = API_END_POINTS?.companyDetailDropdown;
  const companyDetailresponse: AxiosResponse = await requestWrapper({
    url: `${companyDetailDropdownUrl}`,
    method: "GET",
  });
  const companyDetailDropdown: TcompanyDetailDropdown["message"]["data"] =
    companyDetailresponse?.status == 200
      ? companyDetailresponse?.data?.message?.data
      : "";

  const companyAddressDropdownUrl = API_END_POINTS?.companyAddressDropdown;
  const companyAddressDropdownResponse: AxiosResponse = await requestWrapper({
    url: `${companyAddressDropdownUrl}`,
    method: "GET"
  })
  const companyAddressDropdown: TCompanyAddressDropdown["message"]["data"] = companyAddressDropdownResponse?.status == 200 ? companyAddressDropdownResponse?.data?.message?.data : "";

  const certificateUrl = API_END_POINTS?.certifcateCodeDropdown;
  const certificateResponse: AxiosResponse = await requestWrapper({
    url: certificateUrl,
    method: "GET"
  })
  const certificateCodeDropdown: TcertificateCodeDropdown["message"]["data"] = certificateResponse?.status == 200 ? certificateResponse?.data?.message?.data : "";

  const gst_vendor_type_dropdown_url = API_END_POINTS?.documentDetail_dropdown;
  const documentDetailDropdownApi: AxiosResponse = await requestWrapper({ url: gst_vendor_type_dropdown_url, method: "GET" });
  const documentDetailDropdown: TdocumentDetailDropdown["message"]["data"] = documentDetailDropdownApi?.status == 200 ? documentDetailDropdownApi?.data?.message?.data : "";

  const fetchOnboardingDetailUrl = `${API_END_POINTS?.fetchDetails}?ref_no=${refno}&vendor_onboarding=${vendorOnboardingRefno}`;
  const fetchOnboardingDetailResponse: AxiosResponse = await requestWrapper({ url: fetchOnboardingDetailUrl, method: "GET" });
  const OnboardingDetail: VendorOnboardingResponse["message"] = fetchOnboardingDetailResponse?.status == 200 ? fetchOnboardingDetailResponse?.data?.message : "";

  console.log(OnboardingDetail, "this is onboarding data")

  const reconsiliationUrl = API_END_POINTS?.reconsiliationDropdown;
  const ReconciliationdropDownApi: AxiosResponse = await requestWrapper({ url: reconsiliationUrl, method: "POST", data: { data: { company: OnboardingDetail?.purchasing_details?.[0]?.company_name } } });
  const reconciliationDropdown: TReconsiliationDropdown["message"]["data"] = ReconciliationdropDownApi?.status == 200 ? ReconciliationdropDownApi?.data?.message?.data : ""
  console.log(reconciliationDropdown, "this is reconciliation")
  console.log(OnboardingDetail?.purchasing_details?.[0]?.account_group, "this is onboarding details")
  return (
    <div>
      <OnboardingTab onboarding_refno={vendorOnboardingRefno} refno={refno} />
      <div className="flex justify-center gap-5 max-h-[70vh] w-full">
        {/* form */}
        {tabType == "Company Detail" ? (
          // <CompanyDetailForm
          //   companyDetailDropdown={companyDetailDropdown}
          //   onboarding_refno={vendorOnboardingRefno}
          //   refno={refno}
          //   OnboardingDetail={OnboardingDetail?.company_details_tab}
          // />
          <CompanyDetailForm
            isAmendment={OnboardingDetail?.validation_check?.is_amendment}
            re_release={OnboardingDetail?.validation_check?.re_release}
            companyDetailDropdown={companyDetailDropdown}
            onboarding_refno={vendorOnboardingRefno}
            refno={refno}
            OnboardingDetail={OnboardingDetail?.company_details_tab}
            multipleCompany={OnboardingDetail?.multi_company_data}
            ismulticompany={OnboardingDetail?.is_multi_company}
          />
        )
          : tabType == "Company Address" && OnboardingDetail?.payment_details_tab?.address?.country != "India" ? (
            <InternationalCompanyAddress isAmendment={OnboardingDetail?.validation_check?.is_amendment} companyAddressDropdown={companyAddressDropdown} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.company_address_tab} re_release={OnboardingDetail?.validation_check?.re_release} />
          )
            : tabType == "Company Address" ? (
              <CompanyAddress isAmendment={OnboardingDetail?.validation_check?.is_amendment} companyAddressDropdown={companyAddressDropdown} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.company_address_tab} re_release={OnboardingDetail?.validation_check?.re_release} />
            )
<<<<<<< Updated upstream
              : tabType == "Document Detail" && OnboardingDetail?.payment_details_tab?.address?.country != "India" ? (
                <InternationalDocumentDetails isAmendment={OnboardingDetail?.validation_check?.is_amendment} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.document_details_tab} documentDetailDropdown={documentDetailDropdown} re_release={OnboardingDetail?.validation_check?.re_release}/>
              )
=======
              // : tabType == "Document Detail" && OnboardingDetail?.payment_details_tab?.address?.country != "India" ? (
              //   <InternationalDocumentDetails isAmendment={OnboardingDetail?.validation_check?.is_amendment as number} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.document_details_tab as VendorOnboardingResponse["message"]["document_details_tab"]} documentDetailDropdown={documentDetailDropdown} re_release={OnboardingDetail?.validation_check?.re_release as number} />
              // )
>>>>>>> Stashed changes
                : tabType == "Document Detail" ? (
                  <DocumentDetails isAmendment={OnboardingDetail?.validation_check?.is_amendment} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.document_details_tab} documentDetailDropdown={documentDetailDropdown} re_release={OnboardingDetail?.validation_check?.re_release}/>
                )
                  : tabType?.includes("Payment Detail") && OnboardingDetail?.payment_details_tab?.address?.country != "India" ? (
                    <InternationalPaymentDetail isAmendment={OnboardingDetail?.validation_check?.is_amendment} ref_no={refno} company_name={OnboardingDetail?.company_details_tab?.company_name} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.payment_details_tab} isAccountTeam={OnboardingDetail?.validation_check?.register_by_account_team == 1 ? 1 : 0} isBankProof={OnboardingDetail?.payment_details_tab?.bank_proof_upload_status} re_release={OnboardingDetail?.validation_check?.re_release}/>
                  )
                    : tabType?.includes("Payment Detail") ? (
                      <PaymentDetail isAmendment={OnboardingDetail?.validation_check?.is_amendment} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} company_name={OnboardingDetail?.company_details_tab?.company_name} OnboardingDetail={OnboardingDetail?.payment_details_tab} isAccountTeam={OnboardingDetail?.validation_check?.register_by_account_team == 1 ? 1 : 0} isBankProof={OnboardingDetail?.payment_details_tab?.bank_proof_upload_status} re_release={OnboardingDetail?.validation_check?.re_release}/>
                    ) : tabType?.includes("Contact Detail") ? (
                      <ContactDetail isAmendment={OnboardingDetail?.validation_check?.is_amendment} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.contact_details_tab} re_release={OnboardingDetail?.validation_check?.re_release} />
                    ) : tabType == "Manufacturing Detail" ? (
                      <ManufacturingDetail isAmendment={OnboardingDetail?.validation_check?.is_amendment} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.manufacturing_details_tab} re_release={OnboardingDetail?.validation_check?.re_release} />
                    ) : tabType == "Employee Detail" ? (
                      <EmployeeDetail isAmendment={OnboardingDetail?.validation_check?.is_amendment} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.employee_details_tab} re_release={OnboardingDetail?.validation_check?.re_release} />
                    ) : tabType == "Machinery Detail" ? (
                      <MachineryDetail isAmendment={OnboardingDetail?.validation_check?.is_amendment} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.machinery_details_tab} re_release={OnboardingDetail?.validation_check?.re_release} />
                    ) : tabType == "Testing Facility" ? (
                      <TestingFacility isAmendment={OnboardingDetail?.validation_check?.is_amendment} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.testing_details_tab} re_release={OnboardingDetail?.validation_check?.re_release}/>
                    ) : tabType == "Reputed Partners" ? (
                      <ReputedPartners isAmendment={OnboardingDetail?.validation_check?.is_amendment} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.reputed_partners_details_tab} 
                      re_release={OnboardingDetail?.validation_check?.re_release} />
                    ) : tabType == "Certificate" ? (
                      <Certificate certificateCodeDropdown={certificateCodeDropdown?.certificate_names} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.certificate_details_tab} isAmendment={OnboardingDetail?.validation_check?.is_amendment} re_release={OnboardingDetail?.validation_check?.re_release} />
                    ) : tabType == "Purchase Detail" ? (
                      <PurchaseDetails country={OnboardingDetail?.payment_details_tab?.address?.country} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.purchasing_details?.[0]} reconciliationDropdown={reconciliationDropdown} tabType={tabType} validation_check={OnboardingDetail?.validation_check} isPurchaseTeamBankFile={OnboardingDetail?.payment_details_tab?.bank_proofs_by_purchase_team?.[0]?.name} isAmendment={OnboardingDetail?.validation_check?.is_amendment} isPurchaseTeamBeneficiaryFile={OnboardingDetail?.payment_details_tab?.international_bank_details[0]?.international_bank_proof_by_purchase_team?.name} isPurchaseTeamIntermediateFile={OnboardingDetail?.payment_details_tab?.intermediate_bank_details?.[0]?.intermediate_bank_proof_by_purchase_team?.url} re_release={OnboardingDetail?.validation_check?.re_release} />
                    )
                      : (
                        ""
                      )}
      </div>
    </div>
  )
}

export default ViewOnboardingDetails