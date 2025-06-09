import { VendorOnboardingResponse } from '@/src/types/types'
import React from 'react'
import { Input } from '../../atoms/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../atoms/select'

interface Props {
  ref_no:string,
  onboarding_ref_no:string,
  OnboardingDetail?:VendorOnboardingResponse["message"]["purchasing_details"][0]
}

const PurchaseDetails = ({ref_no,onboarding_ref_no,OnboardingDetail}:Props) => {
  console.log(OnboardingDetail,"purchase")
  return (
    <div className="flex flex-col bg-white rounded-lg p-4 w-full">
    <h1 className="border-b-2 pb-2">Purchasing Details</h1>
    <div className="grid grid-cols-3 gap-6 p-5 overflow-y-scroll max-h-[70vh]">
    <div>
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          Company Name
        </h1>
        <Input placeholder="" disabled defaultValue={OnboardingDetail?.company_name} />
      </div>
      <div>
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          Purchase Organization
        </h1>
        <Input placeholder="" defaultValue={OnboardingDetail?.purchase_organization} disabled/>
      </div>
      <div>
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          Order Currency
        </h1>
        <Input placeholder="" defaultValue={OnboardingDetail?.order_currency} disabled />
      </div>
      <div>
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          Terms Of Payment
        </h1>
        <Input placeholder="" disabled defaultValue={OnboardingDetail?.terms_of_payment}/>
      </div>
      <div>
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          Purchase Group
        </h1>
        <Input required placeholder="Enter Reg No." disabled defaultValue={OnboardingDetail?.purchase_group} />
      </div>
      <div>
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          Purchase Head Remarks
        </h1>
        <Input placeholder="Enter Mobile Number" disabled defaultValue={OnboardingDetail?.purchase_head_remarks} />
      </div>
      <div>
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          Purchase Team Remarks
        </h1>
        <Input placeholder="" disabled defaultValue={OnboardingDetail?.purchase_team_remarks}/>
      </div>
      <div>
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          QA Team Remarks
        </h1>
        <Input placeholder="" disabled defaultValue={OnboardingDetail?.qa_team_remarks} />
      </div>
      <div>
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          Reconciliation Account
        </h1>
        <Input placeholder="" disabled defaultValue={OnboardingDetail?.reconciliation_account}/>
      </div>
    </div>
    <div className="flex justify-end pr-6">
    {/* <Button className={`bg-blue-400 hover:bg-blue-400 ${designation?"hidden":""}`}>Next</Button> */}
    </div>
  </div>
  )
}

export default PurchaseDetails