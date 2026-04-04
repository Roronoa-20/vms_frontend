export interface PaymentHistoryItem {
    item: string;
    payment_type: string;
    payment_percentage: number;
    total_amount: number;
    raised_amount: number;
    balance_amount: number;
}

export interface PaymentHistoryRecord {
    payment_req: string;
    status: string;
    date: string;
    items: PaymentHistoryItem[];
}

export interface PaymentHistoryResponse {
    success: boolean;
    message: string;
    data: PaymentHistoryRecord[];
    page_no: number;
    page_size: number;
}

export interface PaymentHistoryParams {
    doctype?: string;
    doc_name?: string;
    search_term?: string;
    date?: string;
    page_no?: number;
    page_size?: number;
}

export interface PaymentRequestRecord {
    name: string;
    date: string;
    company_name: string;
    vendor_name: string | null;
    currency: string | null;
    amount: number | null;
    total_raised_amt: number | null;
    record: string;
    payment_type: string;
    purchase_order_date: string | null;
    approval_entry: string;
    company: string;
    approval_status: string;
    can_approve: boolean;
}

export interface PaymentRequestListResponse {
    status: string;
    data: PaymentRequestRecord[];
    total_count: number;
    overall_count: number;
    page_no: number;
    page_size: number;
    total_pages: number;
}

export interface PaymentRequestListParams {
    search_term?: string;
    status?: string;
    date?: string;
    company?: string;
    page_no?: number;
    page_size?: number;
}

export interface PaymentRequestItemDetail {
    name: string;
    item_code: string;
    payment_type: string;
    payment_percentage: number;
    total_amount: string;
    advance_balance: string;
    total_claimed_amt: string;
    raised_amount: string;
    balance_amount: string;
}

export interface PaymentRequestPurchaseDetails {
    vendor_code: string;
    purchase_group: string;
    purchase_group_name: string;
    contact_person: string;
    po_attachment: {
        url: string;
        name: string;
        file_name: string;
    };
}

export interface PaymentRequestDetails {
    company: string;
    sr_no: string | null;
    payment_req_date: string;
    currency: string;
    total_amt: string;
    vendor_name: string;
    po_no: string;
    payment_type: string;
    purchase_team: string;
    po_date: string;
    status: string;
    is_submitted: number;
    approval_initiated: number;
    can_approve: boolean;
    approval_status: string;
    payment_request_items: PaymentRequestItemDetail[];
    purchase_details: PaymentRequestPurchaseDetails;
    is_treasury_visible:number
    utr_number?: string;
    payment_date?: string;
    payment_amount?: string;
}

export interface PaymentRequestDetailsResponse {
    success: boolean;
    message: string;
    data: PaymentRequestDetails;
}

export interface ProcessApprovalActionParams {
    doctype: string;
    doc_name: string;
    action: string;
    remarks?: string;
    utr_number?: string;
    payment_date?: string;
    payment_amount?: string;
}

export interface ProcessApprovalActionResponse {
    status: string;
    message: string;
}