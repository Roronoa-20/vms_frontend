"use client"
import { TReconsiliationDropdown, VendorOnboardingResponse } from '@/src/types/types'
import React, { useState } from 'react'
import { Input } from '../../atoms/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../atoms/select'
import ApprovalButton from '../../molecules/ApprovalButton'
import { useAuth } from '@/src/context/AuthContext'

interface IvalidationChecks {
  accounts_team_undertaking: number;
  form_fully_submitted_by_vendor: number;
  mandatory_data_filled: number;
  purchase_head_undertaking: number;
  purchase_team_undertaking: number;
  is_purchase_approve:number,
  is_purchase_head_approve:number,
  is_accounts_team_approve:number,
  is_accounts_head_approve:number,
  
}


interface Props {
  ref_no: string,
  onboarding_ref_no: string,
  OnboardingDetail?: VendorOnboardingResponse["message"]["purchasing_details"][0],
  reconciliationDropdown: TReconsiliationDropdown["message"]["data"],
  tabType: string
  validation_check: IvalidationChecks
}

const PurchaseDetails = ({ ref_no, onboarding_ref_no, OnboardingDetail, reconciliationDropdown, tabType, validation_check }: Props) => {
  const [reconciliationAccount, setReconciliationAccountt] = useState<string>(OnboardingDetail?.reconciliation_account as string);
  const { designation } = useAuth();
  console.log(OnboardingDetail, "htis is data")
  console.log(reconciliationDropdown, "this is dropdown")
  console.log(OnboardingDetail?.reconciliation_account, "this is reconsiliation")
  return (
    <div className="flex flex-col bg-white rounded-lg p-4 w-full">
    <h1 className="border-b-2 pb-2">Purchasing Details</h1>
    <div className="grid grid-cols-3 gap-6 p-5 overflow-y-scroll max-h-[70vh] disabled:opacity-100">
    <div>
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          Company Name
        </h1>
        <Input placeholder="" disabled defaultValue={OnboardingDetail?.company_details?.description} />
      </div>
      <div>
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          Purchase Organization
        </h1>
        <Input placeholder="" defaultValue={OnboardingDetail?.pur_org_details?.description} disabled/>
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
        <Input placeholder="" disabled defaultValue={OnboardingDetail?.term_payment_details?.description}/>
      </div>
      <div>
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          Purchase Group
        </h1>
        <Input required placeholder="Enter Reg No." disabled defaultValue={OnboardingDetail?.pur_group_details?.description} />
      </div>
      <div>
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          Incoterms
        </h1>
        <Input required placeholder="Enter Reg No." disabled defaultValue={OnboardingDetail?.incoterms} />
      </div>
      <div>
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          Purchase Team Remarks
        </h1>
        <Input placeholder="" disabled defaultValue={OnboardingDetail?.purchase_team_remarks}/>
      </div>
      <div>
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          Purchase Head Remarks
        </h1>
        <Input  disabled defaultValue={OnboardingDetail?.purchase_head_remarks} />
      </div>
      {/* <div>
        <h1 className="text-[12px] font-normal text-[#626973] pb-3">
          QA Team Remarks
        </h1>
        <Input placeholder="" disabled defaultValue={OnboardingDetail?.qa_team_remarks} />
      </div> */}
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Accounts Team Remarks
          </h1>
          <Input placeholder="" className='disabled:opacity-100' disabled defaultValue={OnboardingDetail?.account_team_remarks} />
        </div>
        <div className={`${designation == "Purchase Head" ? "hidden" : ""}`}>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Reconciliation Account
          </h1>
          {/* <Input placeholder="" disabled defaultValue={OnboardingDetail?.reconciliation_account}/> */}
          <Select value={reconciliationAccount ?? OnboardingDetail?.reconciliation_account ?? ""} onValueChange={(value) => { setReconciliationAccountt(value) }}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  reconciliationDropdown?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.reconcil_description}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className={`flex justify-end pr-6`}>
        {/* <Button className={`bg-blue-400 hover:bg-blue-400 ${designation?"hidden":""}`}>Next</Button> */}
        {
          designation == "Purchase Team" && validation_check?.is_purchase_approve == 1 &&
          <ApprovalButton tabtype={tabType} ref_no={ref_no} onboardingRefno={onboarding_ref_no} reconsiliationDrodown={reconciliationDropdown} reconciliationAccount={reconciliationAccount} />
        }
        {
          designation == "Purchase Head" && validation_check?.is_purchase_head_approve &&
          <ApprovalButton tabtype={tabType} ref_no={ref_no} onboardingRefno={onboarding_ref_no} reconsiliationDrodown={reconciliationDropdown} reconciliationAccount={reconciliationAccount} />
        }
        {
          designation == "Accounts Team" && validation_check?.is_accounts_team_approve &&
          <ApprovalButton tabtype={tabType} ref_no={ref_no} onboardingRefno={onboarding_ref_no} reconsiliationDrodown={reconciliationDropdown} reconciliationAccount={reconciliationAccount} />
        }
        {
          designation == "Accounts Head" && validation_check?.is_accounts_head_approve &&
          <ApprovalButton tabtype={tabType} ref_no={ref_no} onboardingRefno={onboarding_ref_no} reconsiliationDrodown={reconciliationDropdown} reconciliationAccount={reconciliationAccount} />
        }
      </div>
    </div>
  )
}

export default PurchaseDetails