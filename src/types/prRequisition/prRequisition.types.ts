export type purchaseRequisitionTypeDropdownType = {
    value:string
    label:string
}

export type companyDropdownBasedOnUserType = {
    company_name: string,
    name:string
}

export type PurchaseRequisitionMaterialDropdownType = {
    name:string,
    material_name:string,
    material_code:string,
    material_group:string,
    material_description:string
}

export type MaterialGroupDropdownType = {
    name: string,
    material_group_name: string,
    material_group_description: string,
    material_group_company: string
}

export type CostCenterDropdownType = {
   name: string,
   cost_center_code: string,
   cost_center_name: string
}


export type GlAccountDropdownType = {
    name: string,
    gl_account_code: string,
    gl_account_name: string
}

export type purchaseRequisitionPlantDropdownType = {
    name:string,
    plant_name:string,
    plant_code:string
}

export type purchaseRequisitionPurchaseGroupDropdownType = {
    name:string,
    purchase_group_name:string
}

export type purchaseRequisitionUOMType = {
    base_uom:string
}

export type purchaseRequisitionDataType = {
    name:string,
    is_submitted:number
    pr_type:string,
    company:string,
    plant:string,
    nb_normal_items:nbItemsType[],
    nb_capex_items:nbCapexItemsType[],
    zsb_asset_items:zsbAssetItemsType[],
    zsb_service_items:zsbServiceItemsType[],
    can_approve:number,
    attachment:prAttachmentType[],
    can_edit:number,
    is_finance_visible:number,
    cost_center:string,
    budget_amount:number,
    actual_amount:number,
    status:string
}

export type prAttachmentType = {
    name:string,
    filename:string,
    url:string,
    amount:number,
    creation:string,
}

export type nbItemsType = {
    name?:string,
    material:string,
    material_description:string,
    plant:string,
    quantity:number,
    uom:string,
    purchasing_group:string,
    required_delivery_date:string,
}

export type nbCapexItemsType = {
    name?:string,
    material:string,
    material_description:string,
    plant:string,
    quantity:number,
    uom:string,
    purchasing_group:string,
    required_delivery_date:string,
    asset_code:string
}


export type zsbAssetItemsType = {
    name?:string,
    material:string,
    plant:string,
    quantity:number,
    uom:string,
    purchasing_group:string,
    required_delivery_date:string,
    asset_code:string
    material_description:string,
    material_group:string,
    short_text:string
    sub_items:zsbAssetSubItemsType[]
}

export type zsbServiceItemsType = {
    name?:string,
    material:string,
    plant:string,
    quantity:number,
    uom:string,
    purchasing_group:string,
    required_delivery_date:string,
    asset_code:string
    material_description:string,
    material_group:string,
    gl_account:string,
    cost_center:string,
    short_text:string
    sub_items:zsbServiceSubItemsType[]
}

export type serviceCodeDropdownType = {
    name: string,
    service_code: string,
    short_text: string,
    uom: string
}

export type uomBasedOnServiceType = {
    uom:string
}

export type shortTextBasedOnServiceType = {
    short_text:string
}

export type zsbServiceSubItemsType = {
            name?:string,
            service_code?:string,
            short_text:string
            uom?:string,
            quantity?:number
}

export type zsbAssetSubItemsType = {
            name?:string,
            service_code?:string,
            short_text:string
            uom?:string,
            quantity?:number
}


export type plantBasedOnCompanyType = {
    name:string,
    plant_name:string,
    plant_code:string
}

export type uomType = {
      name: string,
      uom_code: string,
      uom: string,
      description: string
    
}
