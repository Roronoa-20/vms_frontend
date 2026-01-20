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
        po_details_attachment:FileAttachment
        items: PoItemsType[];
    }
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
}