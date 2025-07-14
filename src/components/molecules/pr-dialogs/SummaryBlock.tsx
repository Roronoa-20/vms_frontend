import { PurchaseRequisitionDataItem } from '@/src/types/PurchaseRequisitionType';
import React from 'react'
const NBFields: Partial<Record<keyof PurchaseRequisitionDataItem, string>> = {
    item_number_of_purchase_requisition_head: "Line Item Number",
    purchase_requisition_date_head: "Purchase Requisition Date",
    purchase_requisitioner_name: "Purchase Requisition Name",
    purchase_requisition_type: "Purchase Requisition Type",
    purchase_group_head: "Purchase Group",
    material_code_head: "Material Code",
    short_text_head: "Short Text",
    plant_head: "Plant",
    quantity_head: "Quantity",
    delivery_date_head: "Delivery Date",
    store_location_head: "Store Location",
    material_group_head: "Material Group",
    uom_head: "UOM",
    account_assignment_category_head: "Account Assignment Category",
    item_category_head: "Item Category",
    gl_account_number_head: "GL Account Number",
    cost_center_head: "Cost Center",
    company_code_area_head: "Company Code Area",
    valuation_area_head: "Valuation Area",
    // asset_number: "Asset Number",
    profit_ctr_head: "Profit Center",
    main_asset_no_head: "Main Asset No",
    asset_subnumber_head: "Asset Subnumber",
    requisitioner_name_head: "Requistioner Name",
};

const SBFields: Partial<Record<keyof PurchaseRequisitionDataItem, string>> = {
    status_head: "Status",
    item_number_of_purchase_requisition_head: "Line Item Number",
    account_assignment_category_head: "Account Assignment Category",
    item_category_head: "Item Category",
    short_text_head: "Short Text",
    quantity_head: "Quantity",
    uom_head: "UOM",
    c_delivery_date_head: "C/ Delivery Date",
    delivery_date_head: "Delivery Date",
    material_group_head: "Material Group",
    plant_head: "Plant",
    store_location_head: "Store Location",
    purchase_group_head: "Purchase Group",
    tracking_id_head: "Tracking ID",
    desired_vendor_head: "Desired Vendor",
    valuation_area_head: "Valuation Area",
    fixed_value_head: "Fixed Value",
    spit_head: "Spit",
    agreement_head: "Agreement",
    item_of_head: "Item Of...",
    mpn_number_head: "MPN Number",
    purchase_requisition_type: "Purchase Requisition Type",
    requisitioner_name_head: "Requistioner Name",
};

// helper – makes *anything* JSX‑friendly
const renderCellValue = (val: unknown) => {
    if (val == null || val === '') return "N/A";

    // array of objects → show a comma‑separated list of something meaningful
    if (Array.isArray(val)) {
        return val.map((v, i) => (
            <span key={i} className="inline-block">
                {typeof v === "object" ? JSON.stringify(v) : String(v)}
                {i < val.length - 1 && ", "}
            </span>
        ));
    }

    // primitives (string | number | boolean | Date)
    return String(val);
};


type Props = {
    mainItem: PurchaseRequisitionDataItem
}

const SummaryBlock = ({ mainItem }: Props) => {
    const type = mainItem.purchase_requisition_type?.toUpperCase();
    const fields =
        type === "SB" ? SBFields :
            type === "NB" ? NBFields :
                null;

    if (!fields) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            {(Object.entries(fields) as [keyof PurchaseRequisitionDataItem, string][]).map(
                ([key, label]) => (
                    <div key={key as string}>
                        <strong>{label}:</strong>{" "}
                        {renderCellValue(mainItem[key])}
                    </div>
                ))}
        </div>
    );
};


export default SummaryBlock
