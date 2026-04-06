"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import CreatePurchaseRequest from '../templates/purchase-request/CreatePurchaseRequest'
import { Button } from '../atoms/button'
import NormalPR from '../templates/purchase-request/NormalPR'
import CapexPR from '../templates/purchase-request/CapexPR'
import { companyDropdownBasedOnUserType, purchaseRequisitionDataType, PurchaseRequisitionMaterialDropdownType, purchaseRequisitionTypeDropdownType } from '@/src/types/prRequisition/prRequisition.types'
import { getPurchaseReqisitionData, processApprovalAction, submitPurchaseRequisition } from '@/src/services/prRequisition/prRequisitionNb.services'
import ZSBService from '../templates/purchase-request/ZSBService'
import ZSBAsset from '../templates/purchase-request/ZSBAsset'
import PopUp from '../molecules/PopUp'
import { Input } from '../atoms/input'
import FileList from '../templates/purchase-request/FileList'
import FinanceFields from '../templates/purchase-request/FinanceFields'
import { useAuth } from '@/src/context/AuthContext'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
    purchaseRequisitionTypeDropdown: purchaseRequisitionTypeDropdownType[]
    companyDropdown: companyDropdownBasedOnUserType[]
    prData?: purchaseRequisitionDataType
    pr_id?: string
    materialDropdown: PurchaseRequisitionMaterialDropdownType[] | []
}

enum PurchaseType {
    nbNormal = "NB-Normal",
    nbCapex = "NB-CAPEX",
    zsbService = "ZSB Cost Centre",
    zsbAsset = "ZSB Asset",
}

const PrRequest = (props: Props) => {
    const [prData, setPrData] = useState<purchaseRequisitionDataType>(props?.prData as purchaseRequisitionDataType);
    const {setStatus} = useAuth();

    useEffect(() => {
        setStatus(props?.prData?.status ?? "");
    }, [props?.prData?.status]);
    const submitLoaderRef = useRef<HTMLSpanElement>(null);
    const isSubmittingRef = useRef<boolean>(false);
    const [isApprovalDialog, setIsApprovalDialog] = useState<boolean>(false);
    const [isRejectionDialog, setIsRejectionDialog] = useState<boolean>(false);
    const [remarks, setRemarks] = useState<string>("");
    const [financeFields, setFinanceFields] = useState({
        costCenter: props?.prData?.cost_center || "",
        budgetAmount: props?.prData?.budget_amount?.toString() || "",
        actualAmount: props?.prData?.actual_amount?.toString() || "",
    });

    const isFinanceApproval = prData?.is_finance_visible === 1 && prData?.can_approve === 1;
    const isNormalPR = props?.prData?.pr_type === PurchaseType.nbNormal;
    const showFinanceFields = isFinanceApproval && isNormalPR;

    const fetchPrData = (prId?: string) => {
        getPurchaseReqisitionData(prId ?? props?.pr_id as string).then((res) => {
            console.log(res, "fetched pr data");
            setPrData(res);
            setStatus(res?.status ?? "");
        }).catch((err) => {
            console.error("Error fetching PR data:", err);
        })
    }

    const handleApprove = () => {
        if (isFinanceApproval && isNormalPR) {
            if (!financeFields.costCenter) {
                alert("Please select a Cost Center");
                return;
            }
            if (!financeFields.budgetAmount || Number(financeFields.budgetAmount) <= 0) {
                alert("Please enter a valid Budget Amount");
                return;
            }
            if (!financeFields.actualAmount || Number(financeFields.actualAmount) <= 0) {
                alert("Please enter a valid Actual Amount");
                return;
            }
        }
        const financeData = isFinanceApproval && isNormalPR ? {
            cost_center: financeFields.costCenter,
            budget_amount: financeFields.budgetAmount,
            actual_amount: financeFields.actualAmount,
        } : undefined;
        processApprovalAction(props.pr_id as string, "Approve", remarks, financeData).then((res) => {
            alert(res?.message || "Approved Successfully");
            fetchPrData();
        }).catch((err) => {
            console.error(err);
            alert(err?.message || "Error approving PR");
        }).finally(() => { setIsApprovalDialog(false); setRemarks(""); });
    }

    const handleReject = () => {
        processApprovalAction(props.pr_id as string, "Reject", remarks).then((res) => {
            alert(res?.message || "Rejected Successfully");
            fetchPrData();
        }).catch((err) => {
            console.error(err);
            alert(err?.message || "Error rejecting PR");
        }).finally(() => { setIsRejectionDialog(false); setRemarks(""); });
    }

    const handleClose = () => {
        setIsApprovalDialog(false);
        setIsRejectionDialog(false);
        setRemarks("");
    }

    const handlePurchaseRequisitionSubmit = (isAlert:boolean) => {
        if(isAlert){
            if (!confirm("Are you sure you want to submit this purchase requisition?")) {
                return;
            }
        }
            if (submitLoaderRef?.current) {
                submitLoaderRef.current.className = "inline-flex animate-spin ml-2";
            }
            isSubmittingRef.current = true;
            submitPurchaseRequisition(props?.pr_id as string).then((res) => {
                alert(res?.message || `PR Created Successfully with PR Number:- ${res?.sap_pr_number}`);
                fetchPrData();
                if (submitLoaderRef?.current) {
                    submitLoaderRef.current.className = "hidden";
                }
            }).catch((err) => {
                console.error(err);
                if (submitLoaderRef?.current) {
                    submitLoaderRef.current.className = "hidden";
                }
            }).finally(() => {
                isSubmittingRef.current = false;
            })
    }

    return (
        <div className='p-4 space-y-5'>
            <CreatePurchaseRequest purchaseRequisitionTypeDropdown={props.purchaseRequisitionTypeDropdown} companyDropdown={props?.companyDropdown} prData={prData} pr_id={props?.pr_id} fetchPrData={fetchPrData} />

            {props?.prData?.pr_type === PurchaseType.nbNormal && <NormalPR prData={prData} materialDropdown={props?.materialDropdown} handlePurchaseRequisitionSubmit={handlePurchaseRequisitionSubmit} submitLoaderRef={submitLoaderRef} />}

            {props?.prData?.pr_type === PurchaseType.nbCapex && <CapexPR prData={prData} materialDropdown={props?.materialDropdown} handlePurchaseRequisitionSubmit={handlePurchaseRequisitionSubmit} submitLoaderRef={submitLoaderRef} />}

            {props?.prData?.pr_type === PurchaseType.zsbService && <ZSBService prData={prData} handlePurchaseRequisitionSubmit={handlePurchaseRequisitionSubmit} submitLoaderRef={submitLoaderRef} />}

            {props?.prData?.pr_type === PurchaseType.zsbAsset && <ZSBAsset prData={prData} handlePurchaseRequisitionSubmit={handlePurchaseRequisitionSubmit} submitLoaderRef={submitLoaderRef} />}

            {/* ZSB ASSET */}

            {
                props?.prData?.pr_type === PurchaseType.zsbAsset && <ZSBAsset prData={prData} handlePurchaseRequisitionSubmit={handlePurchaseRequisitionSubmit} submitLoaderRef={submitLoaderRef} />
            }

            {props?.pr_id && <FileList data={prData?.attachment || []} fetchPrData={fetchPrData} prId={prData?.name} canEdit={!!prData?.can_edit} isSubmittingRef={isSubmittingRef}/>}

            {showFinanceFields && (
                <FinanceFields company={prData?.company as string} financeFields={financeFields} setFinanceFields={setFinanceFields} />
            )}

            {props?.pr_id && prData?.can_approve === 1 && (
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="py-4">
                        <div className="flex items-center justify-end gap-3">
                            <Button
                                variant={"backbtn"}
                                size={"backbtnsize"}
                                className="px-6 rounded-xl flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 shadow-sm transition-colors"
                                onClick={() => { setIsRejectionDialog(true); setRemarks(""); }}
                            >
                                <XCircle className="w-4 h-4" />
                                Reject
                            </Button>
                            <Button
                                variant={"nextbtn"}
                                size={"nextbtnsize"}
                                className="px-6 rounded-xl flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                                onClick={() => { setIsApprovalDialog(true); setRemarks(""); }}
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                Approve
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {isApprovalDialog &&
                <PopUp Submitbutton={handleApprove} isSubmit={true} headerText='Approve Purchase Requisition' handleClose={handleClose} classname='pb-3 md:w-full md:max-w-[500px] md:max-h-[380px]'>
                    <div className="mt-4">
                        <label className="text-sm font-semibold text-[#1E293B] pb-2 block">Comments</label>
                        <textarea
                            onChange={(e) => setRemarks(e.target.value)}
                            value={remarks}
                            className="w-full border border-slate-200 rounded-lg p-3 text-sm text-[#334155] focus:border-[#4F6BED] focus:ring-2 focus:ring-[#4F6BED]/20 outline-none transition-all resize-none"
                            rows={4}
                            placeholder="Enter your comment here..."
                        />
                    </div>
                </PopUp>
            }

            {isRejectionDialog &&
                <PopUp Submitbutton={handleReject} isSubmit={true} headerText='Reject Purchase Requisition' handleClose={handleClose} classname='pb-3 md:w-full md:max-w-[500px] md:max-h-[380px]'>
                    <div className="mt-4">
                        <label className="text-sm font-semibold text-[#1E293B] pb-2 block">
                            Comments <span className="text-xs text-[#94A3B8] font-normal">(Provide a reason for rejection)</span>
                        </label>
                        <textarea
                            onChange={(e) => setRemarks(e.target.value)}
                            value={remarks}
                            className="w-full border border-slate-200 rounded-lg p-3 text-sm text-[#334155] focus:border-[#4F6BED] focus:ring-2 focus:ring-[#4F6BED]/20 outline-none transition-all resize-none"
                            rows={4}
                            placeholder="Provide a reason for rejection..."
                        />
                    </div>
                </PopUp>
            }
        </div>
    )
}

export default PrRequest