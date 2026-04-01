import { FileAttachment } from "../types";

export type PoDetailsType = {
    message:{
        po_name: string;
        po_date:string;
        vendor_code:string;
        po_status:string;
        supplier_name:string;
        purchase_group_name:string;
        contact_person:string;
        total_gross_amount:string;
        terms_of_payment:string;
        po_details_attachment:FileAttachment
        items: PoItemsType[];
        po_mail_sent:number;
        po_ack_by_vendor:number;
    }
}

export type VendorPoDetailsType = {
    success: boolean;
    data: {
        po_no: string;
        po_date: string;
        vendor_code: string;
        vendor_name: string;
        company: string;
        purchase_grp: string;
        purchase_grp_name: string;
        purchase_team: string;
        payment_terms_code: string;
        payment_terms_name: string;
        purchase_person: string;
        total_value: number;
        status: string;
        ack_date: string | null;
        delivery_date: string | null;
        po_mail_sent: number;
        po_ack_by_vendor: number;
        items: VendorPoItemType[];
    }
}

export type VendorPoItemType = {
    name: string;
    product_code: string;
    product_name: string | null;
    material_code: string;
    description: string;
    hsn_code: string;
    uom: string;
    quantity: string;
    rate: string;
    schedule_date: string | null;
    schedule_qty: string | null;
    total_amount: number;
    advance_balance: number;
    total_claimed_amt: number;
    raise_advance: number;
}

type PoItemsType = {
    srNo: number;
    material_code: string;
    short_text: string;
    hsnsac:string;
    uom:string;
    quantity:number;
    rate:number;
    schedule_date:string;
    schedule_date_qty_json:string;
    total_amount:number;
    raise_amount:number;
    total_advance_approved:number;
}