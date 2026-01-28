import { FileAttachment } from "../types"

export interface purchaseInquiryDropdown {
    message: {
        category_type: {
            name: string,
            category_name: string
        }[],
        uom_master: {
            name: string,
            uom: string,
            description: string
        }[]
    }
}

export type createPurchaseEnquiryResponse = {
    status:string,
    message:string,
    name:string
}

export type companyDropdownBasedOnUserType = {
    company_name: string,
    name:string
}

export type getPurchaseEnquiryDataType = {
    name:string,
    user:string,
    cart_use:string,
    cart_date:string,
    company:{
        name:string,
        description:string,
        company_name:string
    },
    purchase_requisition_form_created:boolean,
    purchase_requisition_form:string | null,
    overall_approval_status:string,
    is_submited:number,
    all_purchase_team_approvals:boolean,
    all_hod_approved:boolean,
    second_stage_approved:boolean,
    is_approval:boolean,
    cart_product:itemListType[]
}

export type itemListType = {
    can_acknowledge:number
    need_asset_code: boolean
    asset_code: string,
    product_name: string,
    product_price: string,
    uom: string,
    lead_time: string,
    product_quantity: string,
    user_specifications: string
    final_price_by_purchase_team?: number,
    purchase_team_approved:boolean
    purchase_team_acknowledgement:boolean
    name?: string
    file: File
    can_approve:number
    location_details:{
        name:string,
        location_name:string
    }
    approval_initiated:boolean
    attachment_details?: FileAttachment,
    purchase_type: string,
    remarks:string
    product_details:{
        name:string,
        product_name:string
    }
    plant_details:{
        name:string,
        plant_name:string
    }
    category_type:string
    approval_status:string

}

export type TPRInquiry = {
    user: string,
    company: {
        name:string,
        description:string,
        company_name:string
    },
    cart_date: string,
    cart_use: string,
    category_type: string,
    
    cart_product: itemListType[]
    hod: boolean,
    purchase_team: boolean
    purchase_team_acknowledgement: boolean,
    purchase_group: string,
    plant: string,
    asked_to_modify: boolean | 0 | 1,
    purchase_team_approved: boolean,
    acknowledged_date: string,
    is_submited: number,
    hod_approved: boolean,
    second_stage_approval_by: string
    second_stage_approved: boolean,
    cost_center: any,
    gl_account: any,
    purchase_requisition_form_created: boolean
    purchase_team_approval_status: string
    purchase_team_status: string
}

export type ProductHistory = {
    cart_id: string,
    user: string,
    cart_date: string,
    purchase_requisition_form_created: number,
    purchase_requisition_form: string,
    product_name: string,
    price: number,
    final_price: number,
    quantity: number
}

export type PurchaseTypeType = {
    purchase_requisition_type_name:string,
    name:string
}

export type ProductNameDropdown = {
  name: string,
  product_name: string,
  product_price: string,
  lead_time: string,
  uom:string,
  category_type:string
}

export type locationDropdownType = {
    name: string,
    plant_name: string,
    description: string
}

export type cityDropdownType = {
    name:string,
    city_name:string
}

export type categoryTypeDropdownType = {
    name:string,
    category_name:string
}