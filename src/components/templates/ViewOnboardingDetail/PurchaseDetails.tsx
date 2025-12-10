"use client"

import { TReconsiliationDropdown, VendorOnboardingResponse, TvendorRegistrationDropdown, TcompanyNameBasedDropdown } from '@/src/types/types';
import React, { useState, useEffect } from 'react';
import { Input } from '../../atoms/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../../atoms/select';
import ApprovalButton from '../../molecules/ApprovalButton';
import { useAuth } from '@/src/context/AuthContext';
import { Button } from "../../atoms/button";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { Lock, Pencil } from "lucide-react";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";


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
};

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
  incoTermsDropdown: TvendorRegistrationDropdown["message"]["data"]["incoterm_master"];
  versions: VendorOnboardingResponse["message"]["version_changes"];
};

const PurchaseDetails = ({ ref_no, onboarding_ref_no, OnboardingDetail, reconciliationDropdown, tabType, validation_check, isPurchaseTeamBankFile, isAmendment, country, isPurchaseTeamBeneficiaryFile, isPurchaseTeamIntermediateFile, re_release, incoTermsDropdown, versions }: Props) => {

  const [reconciliationAccount, setReconciliationAccountt] = useState<string>(OnboardingDetail?.reconciliation_account as string);
  const [IncoTerms, setIncoTerms] = useState<string>(OnboardingDetail?.incoterms as string);
  const { designation } = useAuth();
  const isTreasuryUser = designation?.toLowerCase() === "treasury";
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const router = useRouter();
  const [companyBasedDropdown, setCompanyBasedDropdown] = useState<TcompanyNameBasedDropdown["message"]["data"]>();
  const [termsOfPaymentDropdown, setTermsOfPaymentDropdown] = useState<any>([]);
  const [selectedTermsOfPayment, setSelectedTermsOfPayment] = useState(OnboardingDetail?.term_payment_details?.name || "");
  const [showNext, setShowNext] = useState(false);
  const [showApprovalButtons, setShowApprovalButtons] = useState(true);
  const versionTableRef = React.useRef<HTMLDivElement>(null);

  console.log(versions, "htis is versions data")

  const handleCompanyDropdownChange = async (value: string) => {
    const url = API_END_POINTS?.companyBasedDropdown;
    const response = await requestWrapper({ url: url, method: "GET", params: { company_name: value } })
    const data: TcompanyNameBasedDropdown = response?.status == 200 ? response?.data : "";
    setCompanyBasedDropdown(data?.message?.data);
    const newArray = await Promise.all(data?.message?.data?.terms_of_payment?.map((item) => {
      return ({
        label: item?.description,
        value: item?.name
      })
    }))
    setTermsOfPaymentDropdown(newArray);
  };

  useEffect(() => {
    const compName = OnboardingDetail?.company_name;
    if (compName) {
      handleCompanyDropdownChange(compName);
    }
  }, [OnboardingDetail?.company_name]);


  const handleSubmit = async () => {
    const submitUrl = API_END_POINTS?.purchasingDetailsSubmit;
    const payload = {
      ref_no: ref_no,
      vendor_onboarding: onboarding_ref_no,
      purchase_details: {
        terms_of_payment: selectedTermsOfPayment,
        incoterms: IncoTerms,
        reconciliation_account: reconciliationAccount,
      },
    };
    console.log("Submitting purchasing details:", payload);
    const submitResponse: AxiosResponse = await requestWrapper({
      url: submitUrl,
      data: payload,
      method: "PATCH"
    });
    if (submitResponse?.status == 200) {
      setShowNext(false);
      setShowApprovalButtons(true);
      setIsDisabled(true);
      alert("Details Updated Successfully!!!");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `${dd}-${mm}-${yyyy}`;
  };


  return (
    <div className="flex flex-col bg-white rounded-lg p-2 w-full h-screen max-h-[75vh]">
      <div className="flex justify-between items-center border-b-2">
        <h1 className="font-semibold text-[18px]">Purchasing Details</h1>
        {designation == "Purchase Team" && !isTreasuryUser && (isAmendment == 1 || re_release == 1) && (
          <div
            onClick={() => {
              setIsDisabled(prev => !prev);
              if (isDisabled) {
                setShowNext(true);
                setShowApprovalButtons(false);
              } else {
                setShowNext(false);
                setShowApprovalButtons(true);
              }
            }}
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
          <Input placeholder="" disabled defaultValue={OnboardingDetail?.company_details?.description} />
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
          <Input placeholder="" disabled defaultValue={OnboardingDetail?.account_group_details?.account_group_description} />
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
          {/* <Input placeholder="" disabled={isDisabled} defaultValue={OnboardingDetail?.term_payment_details?.description} /> */}
          <Select disabled={isDisabled} value={selectedTermsOfPayment} onValueChange={(value) => setSelectedTermsOfPayment(value)}>
            <SelectTrigger>
              <SelectValue placeholder="--- Select Terms of Payment ---" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {termsOfPaymentDropdown?.length > 0 ? (
                  termsOfPaymentDropdown.map((item: any, index: number) => (
                    <SelectItem value={item.value} key={index}>
                      {item.label}
                    </SelectItem>
                  ))
                ) : (
                  <div className="text-center text-sm">No Value</div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Group
          </h1>
          <Input required placeholder="" disabled
            defaultValue={OnboardingDetail?.pur_group_details?.description} />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Incoterms
          </h1>
          {/* <Input required placeholder="" disabled={isDisabled} defaultValue={OnboardingDetail?.incoterms} /> */}
          <Select disabled={isDisabled} value={IncoTerms ?? OnboardingDetail?.incoterms ?? ""} onValueChange={(value) => setIncoTerms(value)}>
            <SelectTrigger>
              <SelectValue placeholder="--- Select Inco Terms ---" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {incoTermsDropdown ?
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
          <Input placeholder="" disabled={isDisabled} defaultValue={OnboardingDetail?.purchase_team_remarks} />
        </div>
        <div className={`${validation_check?.register_by_account_team == 0 ? "" : "hidden"}`}>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Head Remarks
          </h1>
          <Input disabled defaultValue={OnboardingDetail?.purchase_head_remarks} />
        </div>
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
                {reconciliationDropdown?.map((item, index) => (
                  <SelectItem key={index} value={item?.name}>{item?.reconcil_description}</SelectItem>
                ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Version History Section */}
      {versions?.length > 0 && (
        <div className="mt-3">
          <Accordion type="single" collapsible className="w-full border rounded-xl shadow-sm"
            onValueChange={(val) => {
              if (val === "version-history") {
                setTimeout(() => {
                  versionTableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 200);
              }
            }}>
            <AccordionItem value="version-history">
              <AccordionTrigger className="text-[16px] font-semibold bg-gray-200 px-4 py-3">
                Purchase Details Change History
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4">
                <div ref={versionTableRef} className="border rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
                  <Table className="w-full text-sm">
                    <TableHeader className="bg-gray-100">
                      <TableRow>
                        <TableHead className="text-black text-center border">Sr.no.</TableHead>
                        <TableHead className="text-black text-center border">Date & Time</TableHead>
                        <TableHead className="text-black text-center border">Field</TableHead>
                        <TableHead className="text-black text-center border">Old Value</TableHead>
                        <TableHead className="text-black text-center border">New Value</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {(() => {
                        let counter = 1;
                        return versions.map((v, i) => {
                          const parsed = JSON.parse(v.field_json || "{}");
                          const changedFields = parsed.changed || [];

                          return changedFields.map((c: any, idx: number) => (
                            <TableRow key={`${i}-${idx}`} className="border-b hover:bg-gray-50">
                              <TableCell className="text-black text-center border">
                                {counter++}
                              </TableCell>
                              <TableCell className="text-black text-center border">
                                {formatDate(v.date_and_time)}
                              </TableCell>
                              <TableCell className="text-black text-center capitalize border">
                                {c[0].replaceAll("_", " ")}
                              </TableCell>
                              <TableCell className="text-center text-red-500 border">
                                {c[1] || "-"}
                              </TableCell>
                              <TableCell className="text-center text-green-600 border">
                                {c[2] || "-"}
                              </TableCell>
                            </TableRow>
                          ));
                        });
                      })()}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      {/* Button Section */}
      <div className="flex justify-end sticky bottom-0 right-0 bg-white py-3 z-50">
        {/* {validation_check?.change_pur_detail_req_mail_to_it_head !== 1 && ( */}
        {designation == "Purchase Team" && showNext && (
          <div className="pr-4">
            <Button onClick={handleSubmit} variant="nextbtn" size="nextbtnsize" className='py-2.5'>Next</Button>
          </div>
        )}
      </div>
      {showApprovalButtons && !isTreasuryUser && (
          <>
            {/* <Button className={`bg-blue-400 hover:bg-blue-400 ${designation?"hidden":""}`}>Next</Button> */}
            {designation == "Purchase Team" && validation_check?.is_purchase_approve == 1 && validation_check?.change_pur_detail_req_mail_to_it_head !== 1 &&
              <ApprovalButton isBeneficieryBankProofByPurchaseTeam={isPurchaseTeamBeneficiaryFile ? true : false} isIntermediateBankProofByPurchaseTeam={isPurchaseTeamIntermediateFile ? true : false} country={country} tabtype={tabType} ref_no={ref_no} onboardingRefno={onboarding_ref_no} reconsiliationDrodown={reconciliationDropdown} reconciliationAccount={reconciliationAccount} isBankProofByPurchaseTeam={isPurchaseTeamBankFile ? true : false} isAccountTeam={validation_check?.register_by_account_team == 1 ? 1 : 0} />
            }
            {designation == "Purchase Head" && validation_check?.is_purchase_head_approve &&
              <ApprovalButton isBeneficieryBankProofByPurchaseTeam={isPurchaseTeamBeneficiaryFile ? true : false} isIntermediateBankProofByPurchaseTeam={isPurchaseTeamIntermediateFile ? true : false} country={country} tabtype={tabType} ref_no={ref_no} onboardingRefno={onboarding_ref_no} reconsiliationDrodown={reconciliationDropdown} reconciliationAccount={reconciliationAccount} isBankProofByPurchaseTeam={isPurchaseTeamBankFile ? true : false} isAccountTeam={validation_check?.register_by_account_team == 1 ? 1 : 0} />
            }
            {designation == "Accounts Team" && validation_check?.is_accounts_team_approve &&
              <ApprovalButton isBeneficieryBankProofByPurchaseTeam={isPurchaseTeamBeneficiaryFile ? true : false} isIntermediateBankProofByPurchaseTeam={isPurchaseTeamIntermediateFile ? true : false} country={country} tabtype={tabType} ref_no={ref_no} onboardingRefno={onboarding_ref_no} reconsiliationDrodown={reconciliationDropdown} reconciliationAccount={reconciliationAccount} isBankProofByPurchaseTeam={isPurchaseTeamBankFile ? true : false} isAccountTeam={validation_check?.register_by_account_team == 1 ? 1 : 0} />
            }
            {designation == "Accounts Head" && validation_check?.is_accounts_head_approve &&
              <ApprovalButton isBeneficieryBankProofByPurchaseTeam={isPurchaseTeamBeneficiaryFile ? true : false} isIntermediateBankProofByPurchaseTeam={isPurchaseTeamIntermediateFile ? true : false} country={country} tabtype={tabType} ref_no={ref_no} onboardingRefno={onboarding_ref_no} reconsiliationDrodown={reconciliationDropdown} reconciliationAccount={reconciliationAccount} isBankProofByPurchaseTeam={isPurchaseTeamBankFile ? true : false} isAccountTeam={validation_check?.register_by_account_team == 1 ? 1 : 0} />
            }
          </>
        )}

    </div>
  )
}

export default PurchaseDetails