import React from 'react'
import OnboardingTab from '../molecules/OnboardingTab'
import CompanyDetailForm from '../templates/vewOnboardingDetail/CompanyDetails'
import CompanyAddress from '../templates/vewOnboardingDetail/CompanyAddress'
import DocumentDetails from '../templates/vewOnboardingDetail/DocumentDetails'
import PaymentDetail from '../templates/vewOnboardingDetail/PaymentDetail'
import ContactDetail from '../templates/vewOnboardingDetail/ContactDetail'
import ManufacturingDetail from '../templates/vewOnboardingDetail/ManufacturingDetail'
import EmployeeDetail from '../templates/vewOnboardingDetail/EmployeeDetail'
import MachineryDetail from '../templates/vewOnboardingDetail/MachineryDetail'
import TestingFacility from '../templates/vewOnboardingDetail/TestingFacility'
import ReputedPartners from '../templates/vewOnboardingDetail/ReputedPartners'
import Certificate from '../templates/vewOnboardingDetail/Certificate'
import { Button } from '../atoms/button'
import { cookies } from 'next/headers'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import { TbankNameDropdown, TcertificateCodeDropdown, TCompanyAddressDropdown, TcompanyDetailDropdown, TCurrencyDropdown, TdocumentDetailDropdown, TReconsiliationDropdown, TvendorOnboardingDetail, VendorOnboardingResponse } from '@/src/types/types'
import ApprovalButton from '../molecules/ApprovalButton'
import PurchaseDetails from '../templates/vewOnboardingDetail/PurchaseDetails'
import InternationalDocumentDetails from '../templates/vewOnboardingDetail/InternationalDocumentDetails'
import InternationalPaymentDetail from '../templates/vewOnboardingDetail/InternationalPaymentDetail'
import InternationalCompanyAddress from '../templates/vewOnboardingDetail/InternationalCompanyAddress'

interface Props {
  vendor_onboarding: any;
  tabtype: string;
  refno: string;
}

const ViewOnboardingDetails = async({ vendor_onboarding, tabtype, refno }: Props) => {
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
      const companyAddressDropdownResponse:AxiosResponse = await requestWrapper({
        url:`${companyAddressDropdownUrl}`,
        method:"GET"
      })
      const companyAddressDropdown:TCompanyAddressDropdown["message"]["data"] = companyAddressDropdownResponse?.status == 200 ? companyAddressDropdownResponse?.data?.message?.data:"";
    
      const certificateUrl = API_END_POINTS?.certifcateCodeDropdown;
      const certificateResponse:AxiosResponse = await requestWrapper({
        url:certificateUrl,
        method:"GET"
      })
      const certificateCodeDropdown:TcertificateCodeDropdown["message"]["data"] = certificateResponse?.status == 200?certificateResponse?.data?.message?.data : "";
    
      const gst_vendor_type_dropdown_url =API_END_POINTS?.documentDetail_dropdown;
      const documentDetailDropdownApi:AxiosResponse = await requestWrapper({url:gst_vendor_type_dropdown_url,method:"GET"});
      const documentDetailDropdown:TdocumentDetailDropdown["message"]["data"] =  documentDetailDropdownApi?.status == 200?documentDetailDropdownApi?.data?.message?.data:"";
    
      const fetchOnboardingDetailUrl = `${API_END_POINTS?.fetchDetails}?ref_no=${refno}&vendor_onboarding=${vendorOnboardingRefno}`;
      const fetchOnboardingDetailResponse:AxiosResponse = await requestWrapper({url:fetchOnboardingDetailUrl,method:"GET"});
      const OnboardingDetail:VendorOnboardingResponse["message"] = fetchOnboardingDetailResponse?.status == 200 ?fetchOnboardingDetailResponse?.data?.message : "";
      
      console.log(OnboardingDetail,"this is onboarding data")

      const reconsiliationUrl = API_END_POINTS?.reconsiliationDropdown;
      const ReconciliationdropDownApi:AxiosResponse = await requestWrapper({url:reconsiliationUrl,method:"POST",data:{data:{company:OnboardingDetail?.purchasing_details?.[0]?.company_name}}});
      const reconciliationDropdown:TReconsiliationDropdown["message"]["data"] = ReconciliationdropDownApi?.status == 200 ? ReconciliationdropDownApi?.data?.message?.data : ""
      console.log(reconciliationDropdown,"this is reconciliation")
      console.log(OnboardingDetail?.purchasing_details?.[0]?.account_group,"this is onboarding details")
  return (
    <div>
        <OnboardingTab onboarding_refno={vendorOnboardingRefno} refno={refno} />
        <div className="flex p-2 justify-center gap-5 max-h-[70vh] w-full">
        {/* form */}
        {tabType == "Company Detail" ? (
          // <CompanyDetailForm
          //   companyDetailDropdown={companyDetailDropdown}
          //   onboarding_refno={vendorOnboardingRefno}
          //   refno={refno}
          //   OnboardingDetail={OnboardingDetail?.company_details_tab}
          // />
          <CompanyDetailForm
          companyDetailDropdown={companyDetailDropdown}
          onboarding_refno={vendorOnboardingRefno}
          refno={refno}
          OnboardingDetail={OnboardingDetail?.company_details_tab}
          multipleCompany={OnboardingDetail?.multi_company_data}
          ismulticompany={OnboardingDetail?.is_multi_company}
          />
        )
        : tabType == "Company Address" && OnboardingDetail?.payment_details_tab?.address?.country != "India" ? (
          <InternationalCompanyAddress companyAddressDropdown={companyAddressDropdown} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.company_address_tab}/>
        )
        : tabType == "Company Address" ? (
          <CompanyAddress companyAddressDropdown={companyAddressDropdown} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.company_address_tab}/>
        )
        : tabType == "Document Detail" && OnboardingDetail?.payment_details_tab?.address?.country != "India" ? (
          <InternationalDocumentDetails  ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.document_details_tab} documentDetailDropdown={documentDetailDropdown} />
        )
        : tabType == "Document Detail" ? (
          <DocumentDetails ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.document_details_tab} documentDetailDropdown={documentDetailDropdown} />
        ) 
        : tabType?.includes("Payment Detail") && OnboardingDetail?.payment_details_tab?.address?.country != "India" ? ( 
        <InternationalPaymentDetail ref_no={refno} company_name={OnboardingDetail?.company_details_tab?.company_name} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.payment_details_tab}/>
        )
        : tabType?.includes("Payment Detail") ? ( 
          <PaymentDetail ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} company_name={OnboardingDetail?.company_details_tab?.company_name} OnboardingDetail={OnboardingDetail?.payment_details_tab}/>
        ) : tabType?.includes("Contact Detail") ? (
          <ContactDetail ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.contact_details_tab}/>
        ) : tabType == "Manufacturing Detail" ? (
          <ManufacturingDetail ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.manufacturing_details_tab}/>
        ) : tabType == "Employee Detail" ? (
          <EmployeeDetail ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.employee_details_tab}/>
        ) : tabType == "Machinery Detail" ? (
          <MachineryDetail ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.machinery_details_tab}/>
        ) : tabType == "Testing Facility" ? (
          <TestingFacility ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.testing_details_tab}/>
        ) : tabType == "Reputed Partners" ? (
          <ReputedPartners ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.reputed_partners_details_tab}/>
        ) : tabType == "Certificate" ? (
          <Certificate certificateCodeDropdown={certificateCodeDropdown?.certificate_names} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.certificate_details_tab}/>
        ) : tabType == "Purchase Detail"?(
          <PurchaseDetails ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} OnboardingDetail={OnboardingDetail?.purchasing_details?.[0]} reconciliationDropdown={reconciliationDropdown} tabType={tabType} validation_check={OnboardingDetail?.validation_check}/>
        )
        : (
          ""
        )}
      </div>
    </div>
  )
}

export default ViewOnboardingDetails