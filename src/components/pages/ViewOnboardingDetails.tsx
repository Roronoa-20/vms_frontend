import React from 'react'
import OnboardingTab from '../molecules/OnboardingTab'
import CompanyDetailForm from '../templates/vendor-detail-form/CompanyDetails'
import CompanyAddress from '../templates/vendor-detail-form/CompanyAddress'
import DocumentDetails from '../templates/vendor-detail-form/DocumentDetails'
import PaymentDetail from '../templates/vendor-detail-form/PaymentDetail'
import ContactDetail from '../templates/vendor-detail-form/ContactDetail'
import ManufacturingDetail from '../templates/vendor-detail-form/ManufacturingDetail'
import EmployeeDetail from '../templates/vendor-detail-form/EmployeeDetail'
import MachineryDetail from '../templates/vendor-detail-form/MachineryDetail'
import TestingFacility from '../templates/vendor-detail-form/TestingFacility'
import ReputedPartners from '../templates/vendor-detail-form/ReputedPartners'
import Certificate from '../templates/vendor-detail-form/Certificate'
import { Button } from '../atoms/button'
import { cookies } from 'next/headers'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import { TbankNameDropdown, TcertificateCodeDropdown, TCompanyAddressDropdown, TcompanyDetailDropdown, TCurrencyDropdown, TdocumentDetailDropdown, TvendorOnboardingDetail, VendorOnboardingResponse } from '@/src/types/types'

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
      const onboardingDetailUrl = API_END_POINTS?.vendorOnboardingDetail;
      
      const response: AxiosResponse = await requestWrapper({
        url: `${onboardingDetailUrl}?vendor_onboarding=${vendorOnboardingRefno}`,
        method: "GET",
      });
      const Data: TvendorOnboardingDetail["message"]["data"] =
        response?.status == 200 ? response?.data?.message?.data : "";
    
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
    
    
      const bankNameDropdownUrl = API_END_POINTS?.bankNameDropdown;
      const bankNameResponse:AxiosResponse = await requestWrapper({url:bankNameDropdownUrl,method:"GET",headers: {
        cookie: cookieHeaderString
      }});
      const bankNameDropown:TbankNameDropdown["data"] = bankNameResponse?.status == 200?bankNameResponse?.data?.data :"";
    
    
      const currencyDropdownUrl = API_END_POINTS?.currencyDropdown;
      const currencyDropdownResponse:AxiosResponse = await requestWrapper({url:currencyDropdownUrl,method:"GET",headers: {
        cookie: cookieHeaderString
      }});
      const currencyDropown:TCurrencyDropdown["data"] = currencyDropdownResponse?.status == 200?currencyDropdownResponse?.data?.data :"";
    
      const fetchOnboardingDetailUrl = `${API_END_POINTS?.fetchDetails}?ref_no=${refno}&vendor_onboarding=${vendorOnboardingRefno}`;
      const fetchOnboardingDetailResponse:AxiosResponse = await requestWrapper({url:fetchOnboardingDetailUrl,method:"GET"});
      const OnboardingDetail:VendorOnboardingResponse["message"] = fetchOnboardingDetailResponse?.status == 200 ?fetchOnboardingDetailResponse?.data?.message : "";
    

  return (
    <div>
        <OnboardingTab onboarding_refno={vendorOnboardingRefno} refno={refno} />
        <div className="flex px-10 justify-center gap-5 max-h-[70vh] w-full">
        {/* form */}
        {tabType == "Company Detail" ? (
          <CompanyDetailForm
            companyDetailDropdown={companyDetailDropdown}
            onboarding_refno={vendorOnboardingRefno}
            refno={refno}
            OnboardingDetail={OnboardingDetail?.company_details_tab}
          />
        ) : tabType == "Company Address" ? (
          <CompanyAddress companyAddressDropdown={companyAddressDropdown} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} onboarding_data={Data} OnboardingDetail={OnboardingDetail?.company_address_tab}/>
        ) : tabType == "Document Detail" ? (
          <DocumentDetails ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} onboarding_data={Data} OnboardingDetail={OnboardingDetail?.document_details_tab} documentDetailDropdown={documentDetailDropdown} />
        ) : tabType?.includes("Payment Detail") ? ( 
          <PaymentDetail bankNameDropown={bankNameDropown} ref_no={refno} onboarding_ref_no={vendorOnboardingRefno} currencyDropown={currencyDropown} OnboardingDetail={OnboardingDetail?.payment_details_tab}/>
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
        ) : (
          ""
        )}
      </div>
      <div className='w-full flex justify-end gap-5 px-5 pt-4'>
        <Button className={`bg-blue-400 hover:bg-blue-400 ${tabType == "Company Detail"?"hidden":""}`}>Back</Button>
        <Button className={`bg-blue-400 hover:bg-blue-400 ${tabType == "Certificate"?"hidden":""}`}>Next</Button>
      </div>
    </div>
  )
}

export default ViewOnboardingDetails