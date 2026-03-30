"use client"
import React, { useState, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import CreatePurchaseRequest from '../templates/purchase-request/CreatePurchaseRequest'
import { Button } from '../atoms/button'
import NormalPR from '../templates/purchase-request/NormalPR'
import CapexPR from '../templates/purchase-request/CapexPR'
import { companyDropdownBasedOnUserType, purchaseRequisitionDataType, PurchaseRequisitionMaterialDropdownType, purchaseRequisitionPlantDropdownType, purchaseRequisitionTypeDropdownType } from '@/src/types/prRequisition/prRequisition.types'
import { getPurchaseReqisitionData, processApprovalAction, submitPurchaseRequisition } from '@/src/services/prRequisition/prRequisitionNb.services'
import ZSBService from '../templates/purchase-request/ZSBService'
import ZSBAsset from '../templates/purchase-request/ZSBAsset'
import PopUp from '../molecules/PopUp'
import { Input } from '../atoms/input'
import FileList from '../templates/purchase-request/FileList'

interface Props {
    purchaseRequisitionTypeDropdown: purchaseRequisitionTypeDropdownType[]
    companyDropdown: companyDropdownBasedOnUserType[]
    prData?: purchaseRequisitionDataType
    pr_id?: string
    materialDropdown: PurchaseRequisitionMaterialDropdownType[] | []
    plantDropdown: purchaseRequisitionPlantDropdownType[]
}

enum PurchaseType {
    nbNormal = "NB-Normal",
    nbCapex = "NB-CAPEX",
    zsbService = "ZSB Cost Centre",
    zsbAsset = "ZSB Asset",
}

const PrRequest = (props: Props) => {
    const [prData, setPrData] = useState<purchaseRequisitionDataType>(props?.prData as purchaseRequisitionDataType);
    const submitLoaderRef = useRef<HTMLSpanElement>(null);
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

    const fetchPrData = (prId?: string) => {
        getPurchaseReqisitionData(prId ?? props?.pr_id as string).then((res) => {
            console.log(res, "fetched pr data");
            setPrData(res);
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
            })
    }

    return (
        <div className='py-8 px-5'>
            <CreatePurchaseRequest purchaseRequisitionTypeDropdown={props.purchaseRequisitionTypeDropdown} companyDropdown={props?.companyDropdown} prData={prData} pr_id={props?.pr_id} fetchPrData={fetchPrData} />

            {/* normal pr component */}
            {
                props?.prData?.pr_type === PurchaseType.nbNormal && <NormalPR prData={prData} materialDropdown={props?.materialDropdown} handlePurchaseRequisitionSubmit={handlePurchaseRequisitionSubmit} submitLoaderRef={submitLoaderRef} financeFields={financeFields} setFinanceFields={setFinanceFields} />
            }

            {/* capex pr component */}
            {
                props?.prData?.pr_type === PurchaseType.nbCapex && <CapexPR prData={prData} materialDropdown={props?.materialDropdown} handlePurchaseRequisitionSubmit={handlePurchaseRequisitionSubmit} submitLoaderRef={submitLoaderRef} />
            }

            {/* ZSB SERVICE */}

            {
                props?.prData?.pr_type === PurchaseType.zsbService && <ZSBService prData={prData} plantDropdown={props?.plantDropdown} handlePurchaseRequisitionSubmit={handlePurchaseRequisitionSubmit} submitLoaderRef={submitLoaderRef} />
            }

            {/* ZSB ASSET */}

            {
                props?.prData?.pr_type === PurchaseType.zsbAsset && <ZSBAsset prData={prData} handlePurchaseRequisitionSubmit={handlePurchaseRequisitionSubmit} submitLoaderRef={submitLoaderRef} />
            }

            {props?.pr_id && prData?.can_approve === 1 && (
                <div className='flex justify-end gap-4 mt-5'>
                    <Button className='bg-[#5291CD] text-white rounded-lg px-6 py-2 hover:bg-[#65a4e7]' onClick={() => { setIsApprovalDialog(true); setRemarks(""); }}>
                        Approve
                    </Button>
                    <Button variant={"destructive"} className='rounded-lg px-6 py-2' onClick={() => { setIsRejectionDialog(true); setRemarks(""); }}>
                        Reject
                    </Button>
                </div>
            )}

            {isApprovalDialog &&
                <PopUp Submitbutton={handleApprove} isSubmit={true} headerText='Are you sure you want to approve ?' handleClose={handleClose} classname='pb-3 md:w-full md:max-w-[900px] md:max-h-[700px]' isHeaderTextUnderline={true}>
                    <Input className='mt-3' placeholder='Enter your comment here...' onChange={(e) => { setRemarks(e.target.value); }} />
                </PopUp>
            }

            {isRejectionDialog &&
                <PopUp Submitbutton={handleReject} isSubmit={true} headerText='Are you sure you want to reject ?' handleClose={handleClose} classname='pb-3 md:w-full md:max-w-[900px] md:max-h-[700px]' isHeaderTextUnderline={true}>
                    <Input className='mt-3' placeholder='Enter your comment here...' onChange={(e) => { setRemarks(e.target.value); }} />
                </PopUp>
            }

            <FileList data={prData?.attachment || []} fetchPrData={fetchPrData} prId={prData?.name} canEdit={!!prData?.can_edit}/>

        </div>
    )
}

export default PrRequest