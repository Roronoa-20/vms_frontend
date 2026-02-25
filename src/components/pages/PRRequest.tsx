"use client"
import React, { useState } from 'react'
import CreatePurchaseRequest from '../templates/purchase-request/CreatePurchaseRequest'
import { Button } from '../atoms/button'
import NormalPR from '../templates/purchase-request/NormalPR'
import CapexPR from '../templates/purchase-request/CapexPR'
import { companyDropdownBasedOnUserType, purchaseRequisitionDataType, PurchaseRequisitionMaterialDropdownType, purchaseRequisitionPlantDropdownType, purchaseRequisitionTypeDropdownType } from '@/src/types/prRequisition/prRequisition.types'
import { getPurchaseReqisitionData, submitPurchaseRequisition } from '@/src/services/prRequisition/prRequisitionNb.services'
import ZSBService from '../templates/purchase-request/ZSBService'
import ZSBAsset from '../templates/purchase-request/ZSBAsset'

interface Props  {
    purchaseRequisitionTypeDropdown:purchaseRequisitionTypeDropdownType[]
    companyDropdown: companyDropdownBasedOnUserType[]
    prData?: purchaseRequisitionDataType
    pr_id?: string
    materialDropdown: PurchaseRequisitionMaterialDropdownType[]
        plantDropdown: purchaseRequisitionPlantDropdownType[]
}

enum PurchaseType  {
    nbNormal = "NB-Normal",
    nbCapex = "NB-CAPEX",
    zsbService = "ZSB Cost Centre",
    zsbAsset = "ZSB Asset",
}

const PrRequest = (props:Props) => {
    const [prData,setPrData] = useState<purchaseRequisitionDataType>(props?.prData as purchaseRequisitionDataType);

    const fetchPrData = (prId?:string)=>{
        getPurchaseReqisitionData(prId ?? props?.pr_id as string).then((res)=>{
            console.log(res,"fetched pr data");
            setPrData(res);
        }).catch((err)=>{
            console.error("Error fetching PR data:", err);
        })
    }

    const handlePurchaseRequisitionSubmit = ()=>{
        confirm("Are you sure you want to submit this purchase requisition?") &&
        submitPurchaseRequisition(props?.pr_id as string).then((res)=>{
            alert("Purchase Requisition submitted successfully");
            fetchPrData();
        }).catch((err)=>{
            console.error("Error submitting purchase requisition:", err);
        })
    }

  return (
    <div className='py-8 px-5'>
        <CreatePurchaseRequest purchaseRequisitionTypeDropdown={props.purchaseRequisitionTypeDropdown} companyDropdown={props?.companyDropdown} prData={prData} pr_id={props?.pr_id} fetchPrData={fetchPrData}/>
        <div className='flex justify-end'>
            {
                props?.pr_id && !prData?.is_submitted && 
                <Button className='mt-5 bg-[#5291CD] text-white rounded-lg px-6 py-2 hover:bg-[#65a4e7]' onClick={()=>{handlePurchaseRequisitionSubmit()}}>
          Submit PR
        </Button>
        }
        </div>

        {/* normal pr component */}
        {
            props.prData?.pr_type === PurchaseType.nbNormal && <NormalPR prData={prData} materialDropdown={props?.materialDropdown} plantDropdown={props?.plantDropdown} />
        }

        {/* capex pr component */}
        {
            props.prData?.pr_type === PurchaseType.nbCapex && <CapexPR prData={prData} materialDropdown={props?.materialDropdown} plantDropdown={props?.plantDropdown} />
        }

        {/* ZSB SERVICE */}

        {
            props.prData?.pr_type === PurchaseType.zsbService && <ZSBService prData={prData} plantDropdown={props?.plantDropdown} />
        }

        {/* ZSB ASSET */}

        {
            props.prData?.pr_type === PurchaseType.zsbAsset && <ZSBAsset prData={prData} />
        }        

    </div>
  )
}

export default PrRequest