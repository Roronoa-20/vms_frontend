import { QUICK_VENDOR_END_POINTS } from "./quickVendorEndpoints";
import { TVendorMasterResponse, TCompanyCodeResponse, TPurchaseOrgResponse, TCurrencyResponse, TAccountGroupResponse, TPincodeResponse, TLocationByPincodeResponse, TReconciliationResponse, TTermsOfPaymentResponse, TCountryMasterResponse, TBankKeyMasterResponse, TStateMasterResponse, TVendorRegistrationRequest, TVendorRegistrationResponse, TOnboardingDetailsResponse, TIncotermResponse } from "@/src/types/quickVendor/quickVendor.types";

export const getVendorTypeMasterList = async (cookie?: string): Promise<TVendorMasterResponse> => {
    try {
        const response = await fetch(`${QUICK_VENDOR_END_POINTS.getVendorTypeMasterList}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include'
        });

        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error fetching vendor type master list:", error);
        return Promise.reject(error);
    }
};

export const getCompanyCodesBySessionUser = async (cookie?: string): Promise<TCompanyCodeResponse> => {
    try {
        const response = await fetch(`${QUICK_VENDOR_END_POINTS.getCompanyCodesBySessionUser}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include'
        });

        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error fetching company code list:", error);
        return Promise.reject(error);
    }
};

export const getPurchaseOrgMasterData = async (company?: string, search_term?: string, cookie?: string): Promise<TPurchaseOrgResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (company) queryParams.append('company', company);
        if (search_term) queryParams.append('search_term', search_term);

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

        const response = await fetch(`${QUICK_VENDOR_END_POINTS.getPurchaseOrgMasterData}${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include'
        });

        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error fetching purchase organization master data:", error);
        return Promise.reject(error);
    }
};

export const getCurrencyMasterList = async (search_term?: string, cookie?: string): Promise<TCurrencyResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (search_term) queryParams.append('search_term', search_term);

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

        const response = await fetch(`${QUICK_VENDOR_END_POINTS.getCurrencyMasterList}${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include'
        });

        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error fetching currency master list:", error);
        return Promise.reject(error);
    }
};

export const getAccountGroupMasterData = async (purchase_organization?: string, vendor_types?: string[], cookie?: string): Promise<TAccountGroupResponse> => {
    try {
        const queryParams = new URLSearchParams();
        const data: Record<string, any> = {};
        if (purchase_organization) data.purchase_organization = purchase_organization;
        if (vendor_types) data.vendor_types = vendor_types;
        queryParams.append('data', JSON.stringify(data));

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

        const response = await fetch(`${QUICK_VENDOR_END_POINTS.getAccountGroupMasterData}${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include'
        });

        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error fetching account group master data:", error);
        return Promise.reject(error);
    }
};

export const getPincodeMaster = async (search_term?: string, cookie?: string): Promise<TPincodeResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (search_term) queryParams.append('search_term', search_term);

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

        const response = await fetch(`${QUICK_VENDOR_END_POINTS.getPincodeMaster}${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include'
        });

        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error fetching pincode master data:", error);
        return Promise.reject(error);
    }
};

export const getLocationByPincode = async (pincode: string, cookie?: string): Promise<TLocationByPincodeResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (pincode) queryParams.append('pincode', pincode);

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

        const response = await fetch(`${QUICK_VENDOR_END_POINTS.getLocationByPincode}${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include'
        });

        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error fetching location by pincode:", error);
        return Promise.reject(error);
    }
};

export const getReconciliationMasterData = async (company?: string, search_term?: string, cookie?: string): Promise<TReconciliationResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (company) queryParams.append('company', company);
        if (search_term) queryParams.append('search_term', search_term);

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

        const response = await fetch(`${QUICK_VENDOR_END_POINTS.getReconciliationMasterData}${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include'
        });

        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error fetching reconciliation master data:", error);
        return Promise.reject(error);
    }
};

export const getTermsOfPaymentMasterData = async (company?: string, search_term?: string, cookie?: string): Promise<TTermsOfPaymentResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (company) queryParams.append('company', company);
        if (search_term) queryParams.append('search_term', search_term);

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

        const response = await fetch(`${QUICK_VENDOR_END_POINTS.getTermsOfPaymentMasterData}${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include'
        });

        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error fetching terms of payment master data:", error);
        return Promise.reject(error);
    }
};

export const getCountryMasterList = async (search_term?: string, cookie?: string): Promise<TCountryMasterResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (search_term) queryParams.append('search_term', search_term);

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

        const response = await fetch(`${QUICK_VENDOR_END_POINTS.getCountryMasterList}${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include'
        });

        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error fetching country master list:", error);
        return Promise.reject(error);
    }
};

export const getBankKeyMasterData = async (country?: string, search_term?: string, cookie?: string): Promise<TBankKeyMasterResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (country) queryParams.append('country', country);
        if (search_term) queryParams.append('search_term', search_term);

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

        const response = await fetch(`${QUICK_VENDOR_END_POINTS.getBankKeyMasterData}${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include'
        });

        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error fetching bank key master data:", error);
        return Promise.reject(error);
    }
};

export const getStateMasterList = async (search_term?: string, cookie?: string): Promise<TStateMasterResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (search_term) queryParams.append('search_term', search_term);

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

        const response = await fetch(`${QUICK_VENDOR_END_POINTS.getStateMasterList}${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include'
        });

        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error fetching state master list:", error);
        return Promise.reject(error);
    }
};

export const createQuickVendorOnboarding = async (formData: FormData, cookie?: string): Promise<any> => {
    try {
        const response = await fetch(`${QUICK_VENDOR_END_POINTS.createQuickVendorOnboarding}`, {
            method: 'POST',
            headers: cookie ? { 'Cookie': cookie } : {},
            credentials: 'include',
            body: formData
        });

        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error creating quick vendor onboarding:", error);
        return Promise.reject(error);
    }
};

export const getQuickVendorOnboardingDetails = async (onboarding_id: string, cookie?: string): Promise<TOnboardingDetailsResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (onboarding_id) queryParams.append('onboarding_id', onboarding_id);

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

        const response = await fetch(`${QUICK_VENDOR_END_POINTS.getQuickVendorOnboardingDetails}${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include'
        });

        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error fetching quick vendor onboarding details:", error);
        return Promise.reject(error);
    }
};

export const getIncotermsMasterData = async (company?: string, search_term?: string, cookie?: string): Promise<TIncotermResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (company) queryParams.append('company', company);
        if (search_term) queryParams.append('search_term', search_term);
        // Add default pagination if needed
        queryParams.append('page_no', '1');
        queryParams.append('page_size', '20');

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

        const response = await fetch(`${QUICK_VENDOR_END_POINTS.getIncotermsMasterData}${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
            credentials: 'include'
        });

        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error fetching incoterms master data:", error);
        return Promise.reject(error);
    }
};
