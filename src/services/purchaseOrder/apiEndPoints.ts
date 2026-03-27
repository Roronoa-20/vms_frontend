const url = process.env.NEXT_PUBLIC_BACKEND_END;

const PO_API_END_POINTS = {
    sendPoConfirmationEmail: `${url}/api/method/vms.APIs.purchase_order.v1.email_notification.send_po_confirmation_email_to_vendor`,
}

export default PO_API_END_POINTS;