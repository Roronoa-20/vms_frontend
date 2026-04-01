import { VendorPoDetailsType } from "@/src/types/view-po-details/poDetailsType";
import PO_API_END_POINTS from "./apiEndPoints";

interface SendPoConfirmationEmailParams {
    po_no: string;
    vendor_emails: string[];
    pur_team_emails: string[];
}

export const uploadPoDocument = async (po_no: string, po_attachment: File): Promise<{ success: boolean; message: string; file_url: string }> => {
    try {
        const formData = new FormData();
        formData.append("po_no", po_no);
        formData.append("po_attachment", po_attachment);

        const response = await fetch(PO_API_END_POINTS.uploadPoDocument, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        if (response.ok) {
            return response.json().then((data) => data?.message);
        } else {
            const errorResponse = await response.json();
            return Promise.reject(errorResponse?.message);
        }
    } catch (error) {
        console.error("Error uploading PO document:", error);
        return Promise.reject("Error uploading PO document");
    }
}

export const acknowledgePo = async (po_no: string, ack_remarks: string): Promise<{ success: boolean; message: string }> => {
    try {
        const params = new URLSearchParams({ po_no, ack_remarks });
        const response = await fetch(`${PO_API_END_POINTS.acknowledgePo}?${params.toString()}`, {
            method: 'POST',
            credentials: 'include',
        });
        if (response.ok) {
            return response.json().then((data) => data?.message);
        } else {
            const errorResponse = await response.json();
            return Promise.reject(errorResponse?.message);
        }
    } catch (error) {
        console.error("Error acknowledging PO:", error);
        return Promise.reject("Error acknowledging PO");
    }
}

export const fetchPoDetails = async (po_no: string, cookieHeaderString?: string): Promise<VendorPoDetailsType> => {
    try {
        const params = new URLSearchParams({ po_no });
        const response = await fetch(`${PO_API_END_POINTS.fetchPoDetails}?${params.toString()}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Cookie': cookieHeaderString as string
            }

        });
        if (response.ok) {
            return response.json().then((data) => data?.message);
        } else {
            const errorResponse = await response.json();
            return Promise.reject(errorResponse?.message);
        }
    } catch (error) {
        console.error("Error fetching PO details:", error);
        return Promise.reject("Error fetching PO details");
    }
}

interface PaymentRequestItem {
    material_code: string;
    name: string;
    total_amount: number;
    raise_advance: number;
}

interface RaiseAdvanceRequestParams {
    po_no: string;
    delivery_date: string;
    remarks: string;
    payment_request_items: PaymentRequestItem[];
}

export const raiseAdvanceRequest = async (params: RaiseAdvanceRequestParams, proforma_invoice?: File): Promise<{ success: boolean; message: string; data: { payment_requisition: string; payment_tracker: string } }> => {
    try {
        const formData = new FormData();
        formData.append("data", JSON.stringify(params));
        if (proforma_invoice) {
            formData.append("proforma_invoice", proforma_invoice);
        }

        const response = await fetch(PO_API_END_POINTS.raiseAdvanceRequest, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        if (response.ok) {
            return response.json().then((data) => data?.message);
        } else {
            const errorResponse = await response.json();
            return Promise.reject(errorResponse?.message);
        }
    } catch (error) {
        console.error("Error raising advance request:", error);
        return Promise.reject("Error raising advance request");
    }
}

export const sendPoConfirmationEmail = async (params: SendPoConfirmationEmailParams): Promise<any> => {
    try {
        const response = await fetch(PO_API_END_POINTS.sendPoConfirmationEmail, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ data: params })
        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message));
        } else {
            const Response = await response.json();
            return Promise.reject(Response?.message);
        }
    } catch (error) {
        console.error("Error sending PO confirmation email:", error);
        return Promise.reject("error sending PO confirmation email");
    }
}