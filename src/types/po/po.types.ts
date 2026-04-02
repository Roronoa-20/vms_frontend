export interface PoListViewRecord {
    name: string;
    vendor_code: string;
    supplier_name: string;
    company_code: string;
    status: string;
    po_date: string;
    purchase_group: string;
    purchase_team: string;
    delivery_date: string | null;
    ack_date: string | null;
}

export interface PoListViewResponse {
    status: string;
    data: PoListViewRecord[];
    total_count: number;
    page_no: number;
    page_size: number;
    total_pages: number;
}

export interface PoListViewParams {
    search_term?: string;
    company?: string;
    status?: string;
    page_no?: number;
    page_size?: number;
}