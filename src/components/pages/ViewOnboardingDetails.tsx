'use client'
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
import { useSearchParams } from 'next/navigation'
import { Button } from '../atoms/button'

const ViewOnboardingDetails = () => {
      const param = useSearchParams();
      const tabType = param?.get("tabtype");
  return (
    <div>
        <OnboardingTab/>
        <div className="flex px-10 justify-center gap-5 max-h-[70vh] w-full">
        {/* form */}
        {tabType == "Company Detail" ? (
          <CompanyDetailForm />
        ) : tabType == "Company Address" ? (
          <CompanyAddress />
        ) : tabType == "Document Detail" ? (
          <DocumentDetails />
        ) : tabType?.includes("Payment Detail") ? (
          <PaymentDetail />
        ) : tabType?.includes("Contact Detail") ? (
          <ContactDetail />
        ) : tabType == "Manufacturing Detail" ? (
          <ManufacturingDetail />
        ) : tabType == "Employee Detail" ? (
          <EmployeeDetail />
        ) : tabType == "Machinery Detail" ? (
          <MachineryDetail />
        ) : tabType == "Testing Facility" ? (
          <TestingFacility />
        ) : tabType == "Reputed Partners" ? (
          <ReputedPartners />
        ) : tabType == "Certificate" ? (
          <Certificate />
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