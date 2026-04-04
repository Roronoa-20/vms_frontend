import { PaymentHistoryResponse, PaymentHistoryParams, PaymentRequestListResponse, PaymentRequestListParams, PaymentRequestDetailsResponse, ProcessApprovalActionParams, ProcessApprovalActionResponse } from "@/src/types/advancePayment/advancePayment.types";
import ADVANCE_PAYMENT_API_END_POINTS from "./apiEndPoints";

export const getPaymentHistory = async (params: PaymentHistoryParams, cookieHeaderString?: string): Promise<PaymentHistoryResponse> => {
    try {
        const searchParams = new URLSearchParams();
        if (params.doctype) searchParams.append("doctype", params.doctype);
        if (params.doc_name) searchParams.append("doc_name", params.doc_name);
        if (params.search_term) searchParams.append("search_term", params.search_term);
        if (params.date) searchParams.append("date", params.date);
        if (params.page_no) searchParams.append("page_no", params.page_no.toString());
        if (params.page_size) searchParams.append("page_size", params.page_size.toString());

        const response = await fetch(`${ADVANCE_PAYMENT_API_END_POINTS.paymentHistory}?${searchParams.toString()}`, {
            method: 'GET',
            credentials: 'include',
            headers: cookieHeaderString ? { 'Cookie': cookieHeaderString } : {},
        });
        if (response.ok) {
            return response.json().then((data) => data?.message);
        } else {
            const errorResponse = await response.json();
            return Promise.reject(errorResponse?.message);
        }
    } catch (error) {
        console.error("Error fetching payment history:", error);
        return Promise.reject("Error fetching payment history");
    }
}

export const getPaymentRequestList = async (params: PaymentRequestListParams, cookieHeaderString?: string): Promise<PaymentRequestListResponse> => {
    try {
        const searchParams = new URLSearchParams();
        if (params.search_term) searchParams.append("search_term", params.search_term);
        if (params.status) searchParams.append("status", params.status);
        if (params.date) searchParams.append("date", params.date);
        if (params.company) searchParams.append("company", params.company);
        if (params.page_no) searchParams.append("page_no", params.page_no.toString());
        if (params.page_size) searchParams.append("page_size", params.page_size.toString());

        const response = await fetch(`${ADVANCE_PAYMENT_API_END_POINTS.paymentRequestList}?${searchParams.toString()}`, {
            method: 'GET',
            credentials: 'include',
            headers: cookieHeaderString ? { 'Cookie': cookieHeaderString } : {},
        });
        if (response.ok) {
            return response.json().then((data) => data?.message);
        } else {
            const errorResponse = await response.json();
            return Promise.reject(errorResponse?.message);
        }
    } catch (error) {
        console.error("Error fetching payment request list:", error);
        return Promise.reject("Error fetching payment request list");
    }
}

export const getPaymentRequestDetails = async (name: string, cookieHeaderString?: string): Promise<PaymentRequestDetailsResponse> => {
    try {
        const response = await fetch(`${ADVANCE_PAYMENT_API_END_POINTS.paymentRequestDetails}?name=${encodeURIComponent(name)}`, {
            method: 'GET',
            credentials: 'include',
            headers: cookieHeaderString ? { 'Cookie': cookieHeaderString } : {},
        });
        if (response.ok) {
            return response.json().then((data) => data?.message);
        } else {
            const errorResponse = await response.json();
            return Promise.reject(errorResponse?.message);
        }
    } catch (error) {
        console.error("Error fetching payment request details:", error);
        return Promise.reject("Error fetching payment request details");
    }
}

export const processApprovalAction = async (params: ProcessApprovalActionParams): Promise<ProcessApprovalActionResponse> => {
    try {
        const response = await fetch(ADVANCE_PAYMENT_API_END_POINTS.processApprovalAction, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (response.ok) {
            return response.json().then((data) => data?.message);
        } else {
            const errorResponse = await response.json();
            return Promise.reject(errorResponse?.message);
        }
    } catch (error) {
        console.error("Error processing approval action:", error);
        return Promise.reject("Error processing approval action");
    }
}