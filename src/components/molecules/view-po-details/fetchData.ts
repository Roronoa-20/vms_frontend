import API_END_POINTS from "@/src/services/apiEndPoints";
import { PoDetailsType } from "@/src/types/view-po-details/poDetailsType";

export const fetchPoDetailsData = async (po_name: string, cookieHeaderString?: string): Promise<PoDetailsType | undefined> => {
    try {
        const response = await fetch(`${API_END_POINTS?.POItemsTable}?po_name=${po_name}`, {
            method: 'POST',
            headers: {
                'Cookie': cookieHeaderString as string
            },
            credentials: 'include',
        });
        return response.json();
    } catch (error) {
        console.error(error);
    }
};