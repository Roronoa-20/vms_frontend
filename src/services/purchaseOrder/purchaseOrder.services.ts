import PO_API_END_POINTS from "./apiEndPoints";

interface SendPoConfirmationEmailParams {
    po_no: string;
    vendor_emails: string[];
    pur_team_emails: string[];
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