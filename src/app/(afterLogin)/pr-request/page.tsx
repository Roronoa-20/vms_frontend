import { getPurchaseReqisitionData, getPurchaseRequisitionMaterialDropdown, GetPurchaseRequisitionTypeDropdown } from '@/src/services/prRequisition/prRequisitionNb.services'
import PrRequest from '../../../../src/components/pages/PRRequest'
import React from 'react'
import { cookies } from 'next/headers'
import { getCompanyDropdownBasedOUser } from '@/src/services/prEnquiry/prEnquiry.services'
import { purchaseRequisitionDataType, PurchaseRequisitionMaterialDropdownType } from '@/src/types/prRequisition/prRequisition.types'

interface PageProps {
  searchParams: Promise<{
    pr_id?: string
    cart_id?: string
    prf_name?: string
  }>
}


const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const pr_id = params["pr_id"];
  const cart_id = params["cart_id"];
  const prf_name = params["prf_name"];


  const cookieStore = await cookies();
  const user = cookieStore.get('user')?.value;
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

  const purchaseRequisitionTypeDropdown = await GetPurchaseRequisitionTypeDropdown(cookieHeaderString);
  const getCompanyDropdown = await getCompanyDropdownBasedOUser(cookieHeaderString);

  let prData: purchaseRequisitionDataType | null = null;

  if (pr_id) {
    prData = await getPurchaseReqisitionData(pr_id, cookieHeaderString);
  }

  let getMaterialDropdown: PurchaseRequisitionMaterialDropdownType[] | null = null;
  if (pr_id) {
    getMaterialDropdown = await getPurchaseRequisitionMaterialDropdown("", prData?.company as string, cookieHeaderString);
  }


  return (
    <PrRequest purchaseRequisitionTypeDropdown={purchaseRequisitionTypeDropdown} companyDropdown={getCompanyDropdown} prData={prData as purchaseRequisitionDataType} pr_id={pr_id} materialDropdown={getMaterialDropdown ? getMaterialDropdown : []} />
  )
}

export default page