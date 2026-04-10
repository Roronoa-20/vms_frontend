const url = process.env.NEXT_PUBLIC_BACKEND_END;

const PO_API_END_POINTS = {
    sendPoConfirmationEmail: `${url}/api/method/vms.APIs.purchase_order.v1.email_notification.send_po_confirmation_email_to_vendor`,
    uploadPoDocument: `${url}/api/method/vms.APIs.purchase_order.v1.raise_advance_request.upload_po_document`,
    acknowledgePo: `${url}/api/method/vms.APIs.purchase_order.v1.email_notification.notify_purchase_team_vendor_po_acknowledged`,
    fetchPoDetails: `${url}/api/method/vms.APIs.purchase_order.v1.get_po_details.get_purchase_order_details`,
    raiseAdvanceRequest: `${url}/api/method/vms.APIs.purchase_order.v1.raise_advance_request.raise_advance_request`,
    poListView: `${url}/api/method/vms.APIs.purchase_order.v1.dashboard.po_list_view.get_purchase_order_records`,
}

export default PO_API_END_POINTS;