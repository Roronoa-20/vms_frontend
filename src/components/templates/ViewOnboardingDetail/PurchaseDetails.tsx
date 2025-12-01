"use client"
import { TReconsiliationDropdown, VendorOnboardingResponse, TvendorRegistrationDropdown } from '@/src/types/types'
import React, { useState } from 'react'
import { Input } from '../../atoms/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../atoms/select'
import ApprovalButton from '../../molecules/ApprovalButton'
import { useAuth } from '@/src/context/AuthContext';
import { Button } from "../../atoms/button";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label'
import { Lock, Pencil } from "lucide-react";

interface IvalidationChecks {
  accounts_team_undertaking: number;
  form_fully_submitted_by_vendor: number;
  mandatory_data_filled: number;
  purchase_head_undertaking: number;
  purchase_team_undertaking: number;
  is_purchase_approve: number,
  is_purchase_head_approve: number,
  is_accounts_team_approve: number,
  is_accounts_head_approve: number,
  register_by_account_team: number,
  change_pur_detail_req_mail_to_it_head: number;
}

interface Props {
  ref_no: string,
  onboarding_ref_no: string,
  OnboardingDetail?: VendorOnboardingResponse["message"]["purchasing_details"][0],
  reconciliationDropdown: TReconsiliationDropdown["message"]["data"],
  tabType: string
  validation_check: IvalidationChecks
  isPurchaseTeamBankFile?: string
  isPurchaseTeamBeneficiaryFile?: string
  isPurchaseTeamIntermediateFile?: string
  isAmendment: number,
  country: string,
  re_release: number;
  incoTermsDropdown: TvendorRegistrationDropdown["message"]["data"]["incoterm_master"]
}

const PurchaseDetails = ({ ref_no, onboarding_ref_no, OnboardingDetail, reconciliationDropdown, tabType, validation_check, isPurchaseTeamBankFile, isAmendment, country, isPurchaseTeamBeneficiaryFile, isPurchaseTeamIntermediateFile, re_release, incoTermsDropdown }: Props) => {

  const [reconciliationAccount, setReconciliationAccountt] = useState<string>(OnboardingDetail?.reconciliation_account as string);
  const [IncoTerms, setIncoTerms] = useState<string>(OnboardingDetail?.incoterms as string);
  const { designation } = useAuth();
  const isTreasuryUser = designation?.toLowerCase() === "treasury";
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  console.log(OnboardingDetail, "htis is data")
  console.log(reconciliationDropdown, "this is dropdown")
  console.log(OnboardingDetail?.reconciliation_account, "this is reconsiliation");

  const [openDialog, setOpenDialog] = useState(false);
  const [remark, setRemark] = useState("");


  return (
    <div className="flex flex-col bg-white rounded-lg p-2 w-full h-screen max-h-[75vh]">
      <div className="flex justify-between items-center border-b-2">
        <h1 className="font-semibold text-[18px]">Purchasing Details</h1>
        {designation == "Purchase Team" && !isTreasuryUser && (isAmendment == 1 || re_release == 1) && (
          <div
            onClick={() => setIsDisabled((prev) => !prev)}
            className="mb-2 inline-flex items-center gap-2 cursor-pointer rounded-[28px] border px-3 py-2 shadow-sm bg-[#5e90c0] hover:bg-gray-100 transition"
          >
            {isDisabled ? (
              <>
                <Lock className="w-5 h-5 text-red-500" />
                <span className="text-[14px] font-medium text-white hover:text-black">
                  Enable Edit
                </span>
              </>
            ) : (
              <>
                <Pencil className="w-5 h-5 text-green-600" />
                <span className="text-[14px] font-medium text-white hover:text-black">
                  Disable Edit
                </span>
              </>
            )}
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-6 p-2">
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Company Name
          </h1>
          <Input placeholder="" disabled
            defaultValue={OnboardingDetail?.company_details?.description} />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Organization
          </h1>
          <Input placeholder="" defaultValue={OnboardingDetail?.pur_org_details?.description} disabled
          />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Account Group
          </h1>
          <Input placeholder="" disabled
            defaultValue={OnboardingDetail?.account_group_details?.account_group_description} />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Order Currency
          </h1>
          <Input placeholder="" defaultValue={OnboardingDetail?.order_currency} disabled
          />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Terms Of Payment
          </h1>
          <Input placeholder="" disabled={isDisabled}
            defaultValue={OnboardingDetail?.term_payment_details?.description} />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Group
          </h1>
          <Input required placeholder="" disabled={isDisabled}
            defaultValue={OnboardingDetail?.pur_group_details?.description} />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Incoterms
          </h1>
          {/* <Input required placeholder="" disabled={isDisabled}
            defaultValue={OnboardingDetail?.incoterms} /> */}
          <Select disabled={isDisabled} value={IncoTerms ?? OnboardingDetail?.incoterms ?? ""} onValueChange={(value) => { setIncoTerms((prev: any) => ({ ...prev, incoterms: value })) }}>
            <SelectTrigger>
              <SelectValue placeholder="Select Inco Terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  incoTermsDropdown ?
                    incoTermsDropdown?.map((item, index) => (
                      <SelectItem value={item?.name} key={index}>{item?.name}</SelectItem>
                    )) :
                    <div className="text-center text-sm">No Value</div>
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className={`${validation_check?.register_by_account_team == 0 ? "" : "hidden"}`}>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Team Remarks
          </h1>
          <Input placeholder="" disabled={isDisabled}
            defaultValue={OnboardingDetail?.purchase_team_remarks} />
        </div>
        <div className={`${validation_check?.register_by_account_team == 0 ? "" : "hidden"}`}>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Head Remarks
          </h1>
          <Input disabled defaultValue={OnboardingDetail?.purchase_head_remarks} />
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
        <div className={`${validation_check?.register_by_account_team == 0 ? "hidden" : ""}`}>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Accounts Head Remarks
          </h1>
          <Input placeholder="" className='disabled:opacity-100' disabled defaultValue={OnboardingDetail?.account_head_remarks} />
        </div>
        <div>
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
      <div className={`flex justify-end`}>
        {/* {validation_check?.change_pur_detail_req_mail_to_it_head !== 1 && ( */}
        {!isTreasuryUser && (
          <>
            {/* <Button className={`bg-blue-400 hover:bg-blue-400 ${designation?"hidden":""}`}>Next</Button> */}
            {
              designation == "Purchase Team" && validation_check?.is_purchase_approve == 1 && validation_check?.change_pur_detail_req_mail_to_it_head !== 1 &&
              <ApprovalButton isBeneficieryBankProofByPurchaseTeam={isPurchaseTeamBeneficiaryFile ? true : false} isIntermediateBankProofByPurchaseTeam={isPurchaseTeamIntermediateFile ? true : false} country={country} tabtype={tabType} ref_no={ref_no} onboardingRefno={onboarding_ref_no} reconsiliationDrodown={reconciliationDropdown} reconciliationAccount={reconciliationAccount} isBankProofByPurchaseTeam={isPurchaseTeamBankFile ? true : false} isAccountTeam={validation_check?.register_by_account_team == 1 ? 1 : 0} />
            }
            {
              designation == "Purchase Head" && validation_check?.is_purchase_head_approve &&
              <ApprovalButton isBeneficieryBankProofByPurchaseTeam={isPurchaseTeamBeneficiaryFile ? true : false} isIntermediateBankProofByPurchaseTeam={isPurchaseTeamIntermediateFile ? true : false} country={country} tabtype={tabType} ref_no={ref_no} onboardingRefno={onboarding_ref_no} reconsiliationDrodown={reconciliationDropdown} reconciliationAccount={reconciliationAccount} isBankProofByPurchaseTeam={isPurchaseTeamBankFile ? true : false} isAccountTeam={validation_check?.register_by_account_team == 1 ? 1 : 0} />
            }
            {
              designation == "Accounts Team" && validation_check?.is_accounts_team_approve &&
              <ApprovalButton isBeneficieryBankProofByPurchaseTeam={isPurchaseTeamBeneficiaryFile ? true : false} isIntermediateBankProofByPurchaseTeam={isPurchaseTeamIntermediateFile ? true : false} country={country} tabtype={tabType} ref_no={ref_no} onboardingRefno={onboarding_ref_no} reconsiliationDrodown={reconciliationDropdown} reconciliationAccount={reconciliationAccount} isBankProofByPurchaseTeam={isPurchaseTeamBankFile ? true : false} isAccountTeam={validation_check?.register_by_account_team == 1 ? 1 : 0} />
            }
            {
              designation == "Accounts Head" && validation_check?.is_accounts_head_approve &&
              <ApprovalButton isBeneficieryBankProofByPurchaseTeam={isPurchaseTeamBeneficiaryFile ? true : false} isIntermediateBankProofByPurchaseTeam={isPurchaseTeamIntermediateFile ? true : false} country={country} tabtype={tabType} ref_no={ref_no} onboardingRefno={onboarding_ref_no} reconsiliationDrodown={reconciliationDropdown} reconciliationAccount={reconciliationAccount} isBankProofByPurchaseTeam={isPurchaseTeamBankFile ? true : false} isAccountTeam={validation_check?.register_by_account_team == 1 ? 1 : 0} />
            }
          </>
        )}
      </div>
    </div>
  )
}

export default PurchaseDetails