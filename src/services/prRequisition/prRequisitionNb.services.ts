import { companyDropdownBasedOnUserType, purchaseRequisitionDataType, PurchaseRequisitionMaterialDropdownType, purchaseRequisitionPlantDropdownType, purchaseRequisitionPurchaseGroupDropdownType, purchaseRequisitionTypeDropdownType, purchaseRequisitionUOMType } from "@/src/types/prRequisition/prRequisition.types";
import API_END_POINTS from "./apiEndPointsNb";

export const GetPurchaseRequisitionTypeDropdown = async (cookies?: string): Promise<purchaseRequisitionTypeDropdownType[]> => {
    try {
        const response = await fetch(`${API_END_POINTS.getPurchaseRequisitionTypeDropdown}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies as string
            },
            credentials: 'include',
        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message?.data));
        }
        else {
            console.error("Failed to get Purchase Requisition Type Dropdown with status:", await response.json().then((data) => data));
            return Promise.reject(false);
        }
    } catch (error) {
        console.error("Error getting Purchase Requisition Type Dropdown:", error);
        return Promise.reject("error fetching purchase requisition type dropdown");
    }
}



export const getCompanyDropdownBasedOUser = async (cookie: string): Promise<companyDropdownBasedOnUserType[]> => {
    try {
        const response = await fetch(`${API_END_POINTS.getCompanyDropdownBasedOUser}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie
            },

        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message?.data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Fetching Company Dropdown :", error);
        return Promise.reject("error fetching company dropdown");
    }
}

export const createPurchaseReqisition = async (body: any): Promise<any> => {
    try {
        const response = await fetch(`${API_END_POINTS.createPurchaseReqisition}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ data: body })

        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response?.message);
        }
    } catch (error) {
        console.error("Error Fetching Company Dropdown :", error);
        return Promise.reject("error creating purchase requisition");
    }
}

export const getPurchaseReqisitionData = async (name: string, cookie?: string): Promise<purchaseRequisitionDataType> => {
    try {
        const response = await fetch(`${API_END_POINTS.getPurchaseRequisitionData}?name=${name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include',

        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message?.data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Fetching Purchase Requisition Data :", error);
        return Promise.reject("error fetching purchase requisition data");
    }
}


export const getPurchaseRequisitionMaterialDropdown = async (query: string, company: string, cookie?: string): Promise<PurchaseRequisitionMaterialDropdownType[]> => {
    try {
        const response = await fetch(`${API_END_POINTS.getMaterialDropdown}?search_term=${query}&company=${company}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include',

        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message?.data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Fetching Purchase Requisition Material Dropdown :", error);
        return Promise.reject("error fetching purchase requisition material dropdown");
    }
}

export const getPurchaseRequisitionPlantDropdown = async (company: string, cookie?: string): Promise<purchaseRequisitionPlantDropdownType[]> => {
    try {
        const response = await fetch(`${API_END_POINTS.getPlantDropdown}?company=${company}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include',
        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message?.data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Fetching Purchase Requisition Plant Dropdown :", error);
        return Promise.reject("error fetching purchase requisition plant dropdown");
    }
}

export const getPlantByMaterial = async (material: string, cookie?: string): Promise<any> => {
    try {
        const response = await fetch(`${API_END_POINTS.getPlantByMaterial}?material_code=${material}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include',
        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message?.data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Fetching Plant By Material :", error);
        return Promise.reject("error fetching plant by material");
    }
}
export const getMaterialNameByCode = async (material_code: string, cookie?: string): Promise<{ material_name: string }> => {
    try {
        const response = await fetch(`${API_END_POINTS.getMaterialNameByCode}?material_code=${material_code}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include',
        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message?.data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Fetching Material Name By Code :", error);
        return Promise.reject("error fetching material name by code");
    }
}

export const getPurchaseRequisitionPurchaseGroupDropdown = async (material: string, cookie?: string): Promise<purchaseRequisitionPurchaseGroupDropdownType[]> => {
    try {
        const response = await fetch(`${API_END_POINTS.getPurchaseGroupDropdown}?material=${material}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include',
        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message?.data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Fetching Purchase Requisition Purchase Group Dropdown :", error);
        return Promise.reject("error fetching purchase requisition purchase group dropdown");
    }
}


export const getPurchaseRequisitionUOM = async (material: string, cookie?: string): Promise<purchaseRequisitionUOMType> => {
    try {
        const response = await fetch(`${API_END_POINTS.getUOMDropdown}?material=${material}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include',
        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message?.data?.base_uom));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Fetching Purchase Requisition UOM :", error);
        return Promise.reject("error fetching purchase requisition UOM");
    }
}


export const addPurchaseRequisitionNBItems = async (body: any, type: string, cookie?: string): Promise<any> => {
    let url = "";
    if (type == "NB-CAPEX") {
        url = API_END_POINTS.addPurchaseRequisitionCapexItems;
    } else {
        url = API_END_POINTS.addPurchaseRequisitionNBItems;
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include',
            body: JSON.stringify(body)
        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message?.message));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Adding Purchase Requisition NB Items :", error);
        return Promise.reject("error adding purchase requisition items");
    }
}


export const deletePurchaseRequisitionNBItems = async (name: any, type: string, cookie?: string): Promise<any> => {
    let url = "";
    if (type == "NB-CAPEX") {
        url = API_END_POINTS.deletePurchaseRequisitionCapexItems;
    } else {
        url = API_END_POINTS.deletePurchaseRequisitionNBItems;
    }
    try {
        const response = await fetch(`${url}?name=${name}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include',
        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message?.message));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Deleting Purchase Requisition NB Items :", error);
        return Promise.reject("error deleting purchase requisition items");
    }
}


export const updatePurchaseRequisitionNBItems = async (body: any, type: string, cookie?: string): Promise<any> => {
    let url = "";
    if (type == "NB-CAPEX") {
        url = API_END_POINTS.updatePurchaseRequisitionCapexItems;
    } else {
        url = API_END_POINTS.updatePurchaseRequisitionNBItems;
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include',
            body: JSON.stringify(body)
        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message?.message));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Updating Purchase Requisition NB Items :", error);
        return Promise.reject("error updating purchase requisition items");
    }
}



export const processApprovalAction = async (doc_name: string, action: "Approve" | "Reject", remarks: string, financeData?: { cost_center: string; budget_amount: string; actual_amount: string }): Promise<any> => {
    try {
        const response = await fetch(API_END_POINTS.processApprovalAction, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                doctype: "VMS Purchase Requisition",
                doc_name,
                action,
                remarks,
                ...financeData,
            })
        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message));
        } else {
            const Response = await response.json();
            return Promise.reject(Response?.message);
        }
    } catch (error) {
        console.error("Error processing approval action:", error);
        return Promise.reject("error processing approval action");
    }
}

export const uploadPrDocument = async (name: string, file: File, amount: string): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("amount", amount);

        const response = await fetch(`${API_END_POINTS.uploadPrDocument}?name=${name}`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message));
        } else {
            const Response = await response.json();
            return Promise.reject(Response?.message);
        }
    } catch (error) {
        console.error("Error uploading PR document:", error);
        return Promise.reject("error uploading PR document");
    }
}

export const deletePrDocument = async (name: string): Promise<any> => {
    try {
        const response = await fetch(`${API_END_POINTS.deletePrDocument}?name=${name}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message));
        } else {
            const Response = await response.json();
            return Promise.reject(Response?.message);
        }
    } catch (error) {
        console.error("Error deleting PR document:", error);
        return Promise.reject("error deleting PR document");
    }
}

export const submitPurchaseRequisition = async (name: any, cookie?: string): Promise<any> => {
    try {
        const response = await fetch(`${API_END_POINTS.submitPurchaseRequisition}?name=${name}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include',
        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message));
        }
        else if (response.status === 400) {
            const Response = await response.json();
            return Promise.resolve(Response?.message);
        }
        else {
            const Response = await response.json();
            return Promise.reject(Response?.message?.message);
        }
    } catch (error) {
        console.error("Error Submitting Purchase Requisition :", error);
        return Promise.reject("error submitting purchase requisition");
    }
}
