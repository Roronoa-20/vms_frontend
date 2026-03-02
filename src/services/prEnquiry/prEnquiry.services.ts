import { categoryTypeDropdownType, cityDropdownType, companyDropdownBasedOnUserType, createPurchaseEnquiryResponse, locationDropdownType, ProductNameDropdown, PurchaseTypeType, TPRInquiry } from "@/src/types/prEnquiry/prEnquiry.types";
import API_END_POINTS from "../apiEndPoints";

export const createPurchaseEnquiry = async(body:any):Promise<createPurchaseEnquiryResponse>=>{
    try {
        const response = await fetch(`${API_END_POINTS.createPurchaseEnquiry}`, {
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(body)
        });
        if(response.ok){
            return Promise.resolve(response.json()?.then((data)=>data?.message));
        }else{
            console.error("Purchase Enquiry creation failed with status:", await response.json().then((data)=>data));
            return Promise.reject(false);
        }
    } catch (error) {
        console.error("Error creating Purchase Enquiry:", error);
        return Promise.reject();
    }
}


export const getCompanyDropdownBasedOUser = async(cookie:string):Promise<companyDropdownBasedOnUserType[]>=>{
    try {
        const response = await fetch(`${API_END_POINTS.getCompanyDropdownBasedOUser}`, {
            method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookie
                },
                
        });
        if(response.ok){
            return Promise.resolve(response.json()?.then((data)=>data?.message?.data));
        }else{
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Fetching Company Dropdown :", error);
        return Promise.reject(error);
    }
}

export const getPurchaseEnquiryData = async(refno:string,cookie?:string,status?:string,pr_type?:string):Promise<TPRInquiry>=>{
    try {
        const response = await fetch(`${API_END_POINTS.getPurchaseEnquiryData}?cart_id=${refno}&status=${status?status:""}&purchase_type=${pr_type?pr_type:""}`, {
            method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookie as string
                },
                credentials: 'include'
                
        });
        if(response.ok){
            return Promise.resolve(response.json()?.then((data)=>data?.message?.data));
        }else{
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Fetching Purchase Enquiry Data :", error);
        return Promise.reject(error);
    }
}


export const getProductNameDropdown = async(query:string,cookie?:string):Promise<ProductNameDropdown[]>=>{
    try {
        const response = await fetch(`${API_END_POINTS.getProductNameDropdown}?search_term=${query}`, {
            method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookie as string
                },
                credentials: 'include'
                
        });
        if(response.ok){
            return Promise.resolve(response.json()?.then((data)=>data?.message?.data));
        }else{
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Fetching Product Name Dropdown :", error);
        return Promise.reject(error);
    }
}


export const getPurchaseTypeDropdown = async(cookie?:string):Promise<PurchaseTypeType[]>=>{
    try {
        const response = await fetch(`${API_END_POINTS.getPurchaseTypeDropdown}`, {
            method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookie as string
                },
                credentials: 'include'
        });
        if(response.ok){
            return Promise.resolve(response.json()?.then((data)=>data?.message?.purchase_req_type));
        }else{
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Fetching Product Type Dropdown :", error);
        return Promise.reject(error);
    }
}


export const getlocationDropdown = async(query:string,company:string,cookie?:string):Promise<locationDropdownType[]>=>{
    try {
        const response = await fetch(`${API_END_POINTS.getLocationDropdown}?search_term=${query}&comp=${company}`, {
            method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookie as string
                },
                credentials: 'include'
        });
        if(response.ok){
            return Promise.resolve(response.json()?.then((data)=>data?.message?.data));
        }else{
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Fetching Product Type Dropdown :", error);
        return Promise.reject(error);
    }
}

export const getCityDropdown = async(query:string,company:string,cookie?:string):Promise<cityDropdownType[]>=>{
    try {
        const response = await fetch(`${API_END_POINTS.getCityDropdown}?search_term=${query}&comp=${company}`, {
            method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookie as string
                },
                credentials: 'include'
        });
        if(response.ok){
            return Promise.resolve(response.json()?.then((data)=>data?.message?.data));
        }else{
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Fetching City Dropdown :", error);
        return Promise.reject(error);
    }
}


export const addEnquiryItems = async(body:FormData,cookie?:string):Promise<any>=>{
    try {
        const response = await fetch(`${API_END_POINTS?.addEnquiryItems}`, {
            method: 'POST',
                headers: {
                    'Cookie': cookie as string
                },
                credentials: 'include',
                body:body
        });
        if(response.ok){
            return Promise.resolve(response.json()?.then((data)=>data?.message?.data));
        }else{
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Fetching Product Type Dropdown :", error);
        return Promise.reject(error);
    }
}


export const deleteEnquiryItems = async(cart_id:string,row_id:string,cookie?:string):Promise<any>=>{
    try {
        const response = await fetch(`${API_END_POINTS?.deleteEnquiryItem}?cart_id=${cart_id}&row_name=${row_id}`, {
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookie as string
                },
                credentials: 'include',
        });
        if(response.ok){
            return Promise.resolve(response.json()?.then((data)=>data?.message?.data));
        }else{
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Fetching Product Type Dropdown :", error);
        return Promise.reject(error);
    }
}


export const submitEnquiry = async(cart_id:string,cookie?:string):Promise<any>=>{
    try {
        const response = await fetch(`${API_END_POINTS?.submitEnquiry}?cart_id=${cart_id}`, {
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookie as string
                },
                credentials: 'include',
        });
        if(response.ok){
            return Promise.resolve(response.json()?.then((data)=>data?.message?.data));
        }else{
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Fetching Product Type Dropdown :", error);
        return Promise.reject(error);
    }
}


export const acknowledgeEnquiry = async(body:FormData,):Promise<any>=>{
    try {
        const response = await fetch(`${API_END_POINTS?.acknowledgeEnquiry}`, {
            method: 'POST',
                credentials: 'include',
                body:body
        });
        if(response.ok){
            return Promise.resolve(response.json()?.then((data)=>data?.message?.data));
        }else{
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error acknowledging purchase enquiry :", error);
        return Promise.reject(error);
    }
}

export const approvalEnquiry = async(body:any):Promise<any>=>{
    try {
        const response = await fetch(`${API_END_POINTS?.approvalEnquiry}`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
                credentials: 'include',
                body:JSON.stringify(body)
        });
        if(response.ok){
            return Promise.resolve(response.json()?.then((data)=>data?.message?.data));
        }else{
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error Proceeding purchase enquiry :", error);
        return Promise.reject(error);
    }
}


export const getCategoryTypeEnquiryDropdown = async(cookie?:string):Promise<categoryTypeDropdownType[]>=>{
    try {
        const response = await fetch(`${API_END_POINTS?.getPurchaseTypeDropdown}`, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
                credentials: 'include',
        });
        if(response.ok){
            return Promise.resolve(response.json()?.then((data)=>data?.message?.category_type));
        }else{
            const Response = await response.json();
            console.error(Response?.exception)
            return Promise.reject(Response?.exception);
        }
    } catch (error:any) {
        console.error("Error Fetching Category Type enquiry Dropdown  :", error);
        return Promise.reject(error?.exception);
    }
}

export const proceedToPR = async(body:any,cookie?:string):Promise<any>=>{
    try {
        const response = await fetch(`${API_END_POINTS?.proceedToPR}`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Cookie': cookie as string
            },
                credentials: 'include',
                body:JSON.stringify(body)
        });
        if(response.ok){
            return Promise.resolve(response.json()?.then((data)=>data?.message));
        }else{
            const Response = await response.json();
            console.error(Response?.message)
            return Promise.reject(Response?.message);
        }
    } catch (error:any) {
        console.error("Error Proceeding Enquiry To PR :", error);
        return Promise.reject(error?.exception);
    }
}



