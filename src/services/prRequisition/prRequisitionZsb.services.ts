import { CostCenterDropdownType, GlAccountDropdownType, MaterialGroupDropdownType, plantBasedOnCompanyType, serviceCodeDropdownType, shortTextBasedOnServiceType, uomBasedOnServiceType, uomType } from "@/src/types/prRequisition/prRequisition.types";
import API_END_POINTS from "./apiEndPointsZsb";


export const getPurchaseRequisitionPlantBasedOnCompany = async(company:string,cookie?:string):Promise<plantBasedOnCompanyType[]>=>{
    try {
        const response = await fetch(`${API_END_POINTS.getPlantBasedOnCompany}?company=${company}`, {
            method: 'GET',
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
        console.error("Error Fetching Purchase Requisition Plant Based On Company :", error);
        return Promise.reject("error fetching purchase requisition plant based on company");
    }
}



export const getPurchaseRequisitionUom = async(cookie?:string):Promise<uomType[]>=>{
    try {
        const response = await fetch(`${API_END_POINTS.getUom}`, {
            method: 'GET',
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
        console.error("Error Fetching Purchase Requisition UOM :", error);
        return Promise.reject("error fetching purchase requisition uom");
    }
}


export const getMaterialGroupDropdown = async(company?:string,cookie?:string):Promise<MaterialGroupDropdownType[]>=>{
    try {
        const response = await fetch(`${API_END_POINTS.getMaterialGroupDropdown}?company=${company}`, {
            method: 'GET',
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
        console.error("Error fetching Material Group Dropdown :", error);
        return Promise.reject("error fetching material group dropdown");
    }
}


export const getGlAccountBasedOnCompanyDropdown = async(company:string,cookie?:string):Promise<GlAccountDropdownType[]>=>{
    try {
        const response = await fetch(`${API_END_POINTS.getGlAccountDropdown}?company=${company}`, {
            method: 'GET',
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
        console.error("Error fetching GL Account Dropdown based on company :", error);
        return Promise.reject("error fetching gl account dropdown based on company");
    }
}


export const getCostCenterBasedOnCompanyDropdown = async(company:string,cookie?:string):Promise<CostCenterDropdownType[]>=>{
    try {
        const response = await fetch(`${API_END_POINTS.getCostCenterDropdown}?company=${company}`, {
            method: 'GET',
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
        console.error("Error fetching Cost Center Dropdown based on company :", error);
        return Promise.reject("error fetching cost center dropdown based on company");
    }
}


export const addZsbLineItems = async(body:any,type:string,cookie?:string):Promise<any>=>{
    let url = "";
    if(type === "service"){
        url = API_END_POINTS.addServiceLineItems;
    }else {
        url = API_END_POINTS.addAssetLineItems;
    }
    try {
        const response = await fetch(url, {
            method: 'POST',
                headers: {
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
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error adding ZSB Line Items :", error);
        return Promise.reject("error adding zsb line items");
    }
}


export const deleteZsbLineItems = async(name:string,type:string,cookie?:string):Promise<any>=>{
    let url = "";
    if(type === "service"){
        url = API_END_POINTS.deleteServiceLineItems;
    }else {
        url = API_END_POINTS.deleteAssetLineItems;
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
        if(response.ok){
            return Promise.resolve(response.json()?.then((data)=>data?.message));
        }else{
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error deleting ZSB Line Items :", error);
        return Promise.reject("error deleting zsb line items");
    }
}

export const updateZsbLineItems = async(body:any,type:string,cookie?:string):Promise<any>=>{
    let url = "";
    if(type === "service"){
        url = API_END_POINTS.updateServiceLineItems;
    }else {
        url = API_END_POINTS.updateAssetLineItems;
    }
    try {
        const response = await fetch(`${url}`, {
            method: 'POST',
                headers: {
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
            return Promise.reject(Response?.message?.errors);
        }
    } catch (error) {
        console.error("Error updating ZSB Line Items :", error);
        return Promise.reject("error updating zsb line items");
    }
}


export const getServiceCodeDropdown = async(cookie?:string):Promise<serviceCodeDropdownType[]>=>{
    try {
        const response = await fetch(API_END_POINTS.getServiceCodeDropdown, {
            method: 'GET',
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
        console.error("Error fetching Service Code Dropdown :", error);
        return Promise.reject("error fetching service code dropdown");
    }
}

export const getUomBasedOnServiceCode = async(serviceCode:string,cookie?:string):Promise<uomBasedOnServiceType>=>{
    try {
        const response = await fetch(`${API_END_POINTS.getUomBasedOnServiceCode}?service_code=${serviceCode}`, {
            method: 'GET',
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
        console.error("Error fetching UOM based on Service Code :", error);
        return Promise.reject("error fetching uom based on service code");
    }
}


export const getShortTextBasedOnServiceCode = async(serviceCode:string,cookie?:string):Promise<shortTextBasedOnServiceType>=>{
    try {
        const response = await fetch(`${API_END_POINTS.getShortTextBasedOnServiceCode}?service_code=${serviceCode}`, {
            method: 'GET',
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
        console.error("Error fetching Short Text based on Service Code :", error);
        return Promise.reject("error fetching short text based on service code");
    }
}





export const addSublineItem = async(body:any,type:string,cookie?:string):Promise<any>=>{

    let url = "";
    if(type === "service"){
        url = API_END_POINTS.addServiceSublineItem;
    } else {
        url = API_END_POINTS.addAssetSublineItem;
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
        if(response.ok){
            return Promise.resolve(response.json()?.then((data)=>data?.message));
        }else{
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error adding subline item :", error);
        return Promise.reject("error adding subline item");
    }
}


export const deleteSublineItem = async(name:string,type:string,cookie?:string):Promise<any>=>{

    let url = "";
    if(type === "service"){
        url = API_END_POINTS.deleteServiceSublineItem;
    } else {
        url = API_END_POINTS.deleteAssetSublineItem;
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
        if(response.ok){
            return Promise.resolve(response.json()?.then((data)=>data?.message?.message));
        }else{
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error deleting subline item :", error);
        return Promise.reject("error deleting subline item");
    }
}


export const updateSublineItem = async(body:any,type:string,cookie?:string):Promise<any>=>{

    let url = "";
    if(type === "service"){
        url = API_END_POINTS.updateServiceSublineItem;
    } else {
        url = API_END_POINTS.updateAssetSublineItem;
    }

    try {
        const response = await fetch(`${url}`, {
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookie as string
                },
                credentials: 'include',
                body: JSON.stringify(body)
        });
        if(response.ok){
            return Promise.resolve(response.json()?.then((data)=>data?.message?.message));
        }else{
            const Response = await response.json();
            return Promise.reject(Response);
        }
    } catch (error) {
        console.error("Error updating subline item :", error);
        return Promise.reject("error updating subline item");
    }
}