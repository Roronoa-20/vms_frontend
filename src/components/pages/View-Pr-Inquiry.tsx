import React from 'react'
import ViewPrInquiryForm from '../templates/ViewPrInquiryForm'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { cookies } from 'next/headers';
import { FileAttachment, TvendorRegistrationDropdown } from '@/src/types/types';

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
      assest_code:string,
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
}


const PrInquiryPage = async({refno}:Props) => {

  const cookieStore = await cookies();
  const user = cookieStore.get("user_id")?.value
  console.log(user, "user")
  const cookieHeaderString = cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join("; ");

    const categoryDropdownUrl = API_END_POINTS?.getInquiryDropdown;
    const dropdownResponse:AxiosResponse = await requestWrapper({url:categoryDropdownUrl,method:"GET",headers:{
        cookie:cookieHeaderString
    }});
    const rawDropdown = dropdownResponse?.status == 200 ? dropdownResponse?.data?.message : "";
    const dropdown: purchaseInquiryDropdown["message"] = rawDropdown
        ? {
            ...rawDropdown,
            uom_master: rawDropdown.uom_master?.map((uom: any) => ({
                ...uom,
                description: uom.description ?? ""
            })) ?? []
        }
        : { category_type: [], uom_master: [] };
  
let PRInquiryData: TPRInquiry | null   = null;
console.log(refno,"this is refno")
if (refno) {
    const PRInquiryDataUrl = `${API_END_POINTS?.prInquiryData}?pi_name=${refno}`;
    const PRInquiryDataResponse: AxiosResponse = await requestWrapper({ url: PRInquiryDataUrl, method: "GET",headers: {
      cookie: cookieHeaderString
    } });
    PRInquiryData = PRInquiryDataResponse?.status == 200 ? PRInquiryDataResponse?.data?.message : "";

}
const companyDropdownUrl = `${API_END_POINTS?.InquirycompanyBasedOnUser}?usr=${user}`;
const companyDropdownResponse:AxiosResponse = await requestWrapper({url:companyDropdownUrl,method:"GET",headers:{
   cookie:cookieHeaderString
}});
const companyDropdown = companyDropdownResponse?.status == 200? companyDropdownResponse?.data?.message?.data : ""

const purchaseTypeUrl = API_END_POINTS?.InquiryPurchaseTypeDropdown;
const purchaseTypeResponse:AxiosResponse = await requestWrapper({url:purchaseTypeUrl,method:"GET",headers:{
   cookie:cookieHeaderString
}});
const purchaseTypeDropdown = purchaseTypeResponse?.status == 200? purchaseTypeResponse?.data?.message?.data : ""
  const dropdownUrl = API_END_POINTS?.vendorRegistrationDropdown;
  const dropDownApi: AxiosResponse = await requestWrapper({
    url: dropdownUrl,
    method: "GET",
  });
  const AllcompanyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"] =
    dropDownApi?.status == 200 ? dropDownApi?.data?.message?.data?.company_master : "";
return (
    <ViewPrInquiryForm PRInquiryData={PRInquiryData} companyDropdown={companyDropdown} AllcompanyDropdown={AllcompanyDropdown} purchaseTypeDropdown={purchaseTypeDropdown} dropdown={dropdown} refno={refno} />
)
}

export default PrInquiryPage