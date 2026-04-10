const url = process.env.NEXT_PUBLIC_BACKEND_END;

const ADVANCE_PAYMENT_API_END_POINTS = {
    paymentHistory: `${url}/api/method/vms.APIs.purchase_order.v1.payment_history.get_payment_history`,
    paymentRequestList: `${url}/api/method/vms.APIs.payment_request.v1.dashboard.advance_payment_list.get_payment_request_list`,
    paymentRequestDetails: `${url}/api/method/vms.APIs.payment_request.v1.get_payment_request_details.get_payment_request_details`,
    processApprovalAction: `${url}/api/method/vms.approval.approval_router.process_approval_action`,
}

export default ADVANCE_PAYMENT_API_END_POINTS;
