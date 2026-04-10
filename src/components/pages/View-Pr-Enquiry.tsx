import React from 'react'
import ViewPrInquiryForm from '../templates/ViewPrInquiryForm'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { cookies } from 'next/headers';
import { FileAttachment, TvendorRegistrationDropdown } from '@/src/types/types';
import { ProductHistory } from '../../types/prEnquiry/prEnquiry.types';
import { getCompanyDropdownBasedOUser, getPurchaseEnquiryData, getPurchaseTypeDropdown } from '@/src/services/prEnquiry/prEnquiry.services';

export interface purchaseInquiryDropdown {
    message:{
        category_type:{
            name:string,
            category_name:string
        }[],
        uom_master:{
            name:string,
            uom:string,
            description: string;
        }[],
    }
}

interface Props {
    refno?:string
}

export type TableData = {
      need_asset_code: boolean,
      asset_code:string,
      product_name:string,
      product_price:string,
      uom:string,
      lead_time:string,
      product_quantity:string,
      user_specifications:string,
      file:File,
      attachment:FileAttachment
}

export type TPRInquiry = {
    user:string,
    company:string,
    cart_date:string,
    cart_use:string,
    category_type:string,
    cart_product:TableData[]
    hod:boolean,
    purchase_team:boolean
    purchase_group:string,
    plant:string,
    purchase_type:string,
    purchase_team_acknowledgement:boolean,
    asked_to_modify:boolean,
    purchase_team_approved:boolean,
    acknowledged_date:string,
    is_submited:number,
    hod_approved:boolean
    second_stage_approved:boolean,
    second_stage_approval_by:string
    cost_center:string,
    gl_account:string
    purchase_requisition_form_created:boolean
    purchase_team_approval_status:string
    purchase_team_status:string
}


const PrInquiryPage = async({refno}:Props) => {

    const cookieStore = await cookies();
    const user = cookieStore.get("user_id")?.value
    console.log(user, "user")
    const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");
    const categoryDropdownUrl = API_END_POINTS?.getInquiryDropdown;

const purchaseEnquiryData = await getPurchaseEnquiryData(refno as string,cookieHeaderString)
return (
     <ViewPrInquiryForm PRInquiryData={purchaseEnquiryData}  />
)
}

export default PrInquiryPage