"use client"
import { TReconsiliationDropdown, VendorOnboardingResponse } from '@/src/types/types'
import React, { useState } from 'react'
import { Input } from '../../atoms/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../atoms/select'
import ApprovalButton from '../../molecules/ApprovalButton'
import { useAuth } from '@/src/context/AuthContext'

interface Props {
  ref_no:string,
  onboarding_ref_no:string,
  OnboardingDetail?:VendorOnboardingResponse["message"]["purchasing_details"][0],
  reconciliationDropdown:TReconsiliationDropdown["message"]["data"],
  tabType:string
}

const PurchaseDetails = ({ref_no,onboarding_ref_no,OnboardingDetail,reconciliationDropdown,tabType}:Props) => {
  const [reconciliationAccount,setReconciliationAccountt] = useState<string>("");
  const {designation} = useAuth();
  console.log(OnboardingDetail,"htis is data")
  console.log(reconciliationDropdown,"this is dropdown")
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
      <div className={`${designation == "Purchase Head"?"hidden":""}`}>
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          Reconciliation Account
        </h1>
        {/* <Input placeholder="" disabled defaultValue={OnboardingDetail?.reconciliation_account}/> */}
        <Select value={OnboardingDetail?.reconciliation_account ?? ""} onValueChange={(value)=>{setReconciliationAccountt(value)}}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {
                          reconciliationDropdown?.map((item,index)=>(
                            <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                          ))
                        }
                      </SelectGroup>
                    </SelectContent>
                  </Select>
      </div>
    </div>
    <div className="flex justify-end pr-6">
    {/* <Button className={`bg-blue-400 hover:bg-blue-400 ${designation?"hidden":""}`}>Next</Button> */}
    <ApprovalButton tabtype={tabType} ref_no={ref_no} onboardingRefno={onboarding_ref_no} reconsiliationDrodown={reconciliationDropdown} reconciliationAccount={reconciliationAccount}/>
    </div>
  </div>
  )
}

export default PurchaseDetails