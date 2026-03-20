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

export const getReconciliationMasterData = async (account_group?: string, search_term?: string, cookie?: string): Promise<TReconciliationResponse> => {
    try {
        const queryParams = new URLSearchParams();
        if (account_group) queryParams.append('account_group', account_group);
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

export const updateGstDetail = async (data: { onboarding_id: string; name?: string; gst_state: string; gst_number: string; gst_ven_class: string }, gst_document?: File | null): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        if (gst_document) {
            formData.append('gst_document', gst_document);
        }
        const response = await fetch(`${QUICK_VENDOR_END_POINTS.updateGstDetail}`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error updating GST detail:", error);
        return Promise.reject(error);
    }
};

export const deleteGstDetailRow = async (onboarding_id: string, row_name: string): Promise<any> => {
    try {
        const response = await fetch(`${QUICK_VENDOR_END_POINTS.deleteGstDetailRow}?onboarding_id=${onboarding_id}&row_name=${row_name}`, {
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
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error deleting GST detail row:", error);
        return Promise.reject(error);
    }
};

export const updateContactDetail = async (body: { data: { onboarding_id: string; name?: string; first_name: string; last_name: string; email: string; contact_number: string } }): Promise<any> => {
    try {
        const response = await fetch(`${QUICK_VENDOR_END_POINTS.updateContactDetail}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body)
        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error updating contact detail:", error);
        return Promise.reject(error);
    }
};

export const deleteContactDetailRow = async (onboarding_id: string, row_name: string): Promise<any> => {
    try {
        const response = await fetch(`${QUICK_VENDOR_END_POINTS.deleteContactDetailRow}?onboarding_id=${onboarding_id}&row_name=${row_name}`, {
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
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error deleting contact detail row:", error);
        return Promise.reject(error);
    }
};

export const updateDomesticBankDetails = async (data: { onboarding_id: string; name?: string; country: string; bank_key: string; bank_name?: string; name_of_account_holder: string; account_number: string; ifsc_code: string }, domestic_bank_proof?: File | null): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        if (domestic_bank_proof) {
            formData.append('domestic_bank_proof', domestic_bank_proof);
        }
        const response = await fetch(`${QUICK_VENDOR_END_POINTS.updateDomesticBankDetails}`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error updating domestic bank details:", error);
        return Promise.reject(error);
    }
};

export const deleteDomesticBankDetailRow = async (onboarding_id: string, row_name: string): Promise<any> => {
    try {
        const response = await fetch(`${QUICK_VENDOR_END_POINTS.deleteDomesticBankDetailRow}?onboarding_id=${onboarding_id}&row_name=${row_name}`, {
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
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error deleting domestic bank detail row:", error);
        return Promise.reject(error);
    }
};

export const updateImportBankDetails = async (data: { onboarding_id: string; name?: string; meril_company_name: string; beneficiary_name: string; beneficiary_swift_code: string; beneficiary_iban_no: string; beneficiary_aba_no: string; beneficiary_bank_address: string; beneficiary_bank_name: string; beneficiary_account_no: string; beneficiary_ach_no: string; beneficiary_routing_no: string; beneficiary_currency: string }, import_bank_proof?: File | null): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        if (import_bank_proof) {
            formData.append('import_bank_proof', import_bank_proof);
        }
        const response = await fetch(`${QUICK_VENDOR_END_POINTS.updateImportBankDetails}`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data?.message));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error updating import bank details:", error);
        return Promise.reject(error);
    }
};

export const deleteImportBankDetailRow = async (onboarding_id: string, row_name: string): Promise<any> => {
    try {
        const response = await fetch(`${QUICK_VENDOR_END_POINTS.deleteImportBankDetailRow}?onboarding_id=${onboarding_id}&row_name=${row_name}`, {
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
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error deleting import bank detail row:", error);
        return Promise.reject(error);
    }
};

export const submitOnboardingForm = async (formData: FormData, cookie?: string): Promise<any> => {
    try {
        const response = await fetch(`${QUICK_VENDOR_END_POINTS.submitOnboardingForm}`, {
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
        console.error("Error submitting onboarding form:", error);
        return Promise.reject(error);
    }
};

export const accountsTeamApproval = async (body: { data: { onboarding_id: string; action: number; remarks: string } }, cookie?: string): Promise<any> => {
    try {
        const response = await fetch(`${QUICK_VENDOR_END_POINTS.accountsTeamApproval}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(cookie ? { 'Cookie': cookie } : {})
            },
            credentials: 'include',
            body: JSON.stringify(body) // Body contains action 1 for approve, 0 for reject
        });
        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error on accounts team approval:", error);
        return Promise.reject(error);
    }
};

export const getQuickOnboardingRequesterRecords = async (
    params: {
        search_term?: string;
        status?: string;
        company?: string;
        page_no?: number;
        page_size?: number;
    },
    cookie?: string
): Promise<any> => {
    try {
        const queryParams = new URLSearchParams();
        if (params.search_term) queryParams.append("search_term", params.search_term);
        if (params.status) queryParams.append("status", params.status);
        if (params.company) queryParams.append("company", params.company);
        if (params.page_no) queryParams.append("page_no", params.page_no.toString());
        if (params.page_size) queryParams.append("page_size", params.page_size.toString());

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

        const response = await fetch(
            `${QUICK_VENDOR_END_POINTS.getQuickOnboardingRequesterRecords}${queryString}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(cookie ? { Cookie: cookie } : {}),
                },
                credentials: "include",
            }
        );

        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error fetching quick onboarding requester records:", error);
        return Promise.reject(error);
    }
};

export const getQuickOnboardingApprovalRecords = async (
    params: {
        search_term?: string;
        status?: string;
        company?: string;
        page_no?: number;
        page_size?: number;
    },
    cookie?: string
): Promise<any> => {
    try {
        const queryParams = new URLSearchParams();
        if (params.search_term) queryParams.append("search_term", params.search_term);
        if (params.status) queryParams.append("status", params.status);
        if (params.company) queryParams.append("company", params.company);
        if (params.page_no) queryParams.append("page_no", params.page_no.toString());
        if (params.page_size) queryParams.append("page_size", params.page_size.toString());

        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

        const response = await fetch(
            `${QUICK_VENDOR_END_POINTS.getQuickOnboardingApprovalRecords}${queryString}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(cookie ? { Cookie: cookie } : {}),
                },
                credentials: "include",
            }
        );

        if (response.ok) {
            return Promise.resolve(response.json()?.then((data) => data));
        } else {
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error fetching quick onboarding approval records:", error);
        return Promise.reject(error);
    }
};
