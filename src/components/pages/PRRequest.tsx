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

    const fetchPrData = (prId?: string) => {
        getPurchaseReqisitionData(prId ?? props?.pr_id as string).then((res) => {
            console.log(res, "fetched pr data");
            setPrData(res);
        }).catch((err) => {
            console.error("Error fetching PR data:", err);
        })
    }

    const handleApprove = () => {
        processApprovalAction(props.pr_id as string, "Approve", remarks).then((res) => {
            alert(res?.message || "Approved Successfully");
            fetchPrData();
        }).catch((err) => {
            console.error(err);
            alert(err || "Error approving PR");
        }).finally(() => { setIsApprovalDialog(false); setRemarks(""); });
    }

    const handleReject = () => {
        processApprovalAction(props.pr_id as string, "Reject", remarks).then((res) => {
            alert(res?.message || "Rejected Successfully");
            fetchPrData();
        }).catch((err) => {
            console.error(err);
            alert(err || "Error rejecting PR");
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
            {/* <div className='flex justify-end'>
                {
                    props?.pr_id && !prData?.is_submitted &&
                    <Button className='mt-5 bg-[#5291CD] text-white rounded-lg px-6 py-2 hover:bg-[#65a4e7]' onClick={() => { handlePurchaseRequisitionSubmit() }}>
                        Submit PR
                        <span ref={submitLoaderRef} className="hidden">
                            <Loader2 className="w-5 h-5" />
                        </span>
                    </Button>
                }
            </div> */}

            {/* normal pr component */}
            {
                props?.prData?.pr_type === PurchaseType.nbNormal && <NormalPR prData={prData} materialDropdown={props?.materialDropdown} handlePurchaseRequisitionSubmit={handlePurchaseRequisitionSubmit} submitLoaderRef={submitLoaderRef} />
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

        </div>
    )
}

export default PrRequest