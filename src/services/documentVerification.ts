import API_END_POINTS from "./apiEndPoints";


type TpanNumberVerificationResponse = {
    pan_number:string,
    full_name:string,
    client_id:string,
    category:string
}



export const getAccessToken = async(cookies: string): Promise<string> =>{
    try {
        const response = await fetch(`${API_END_POINTS.generateToken}`, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies
            },
            method: 'POST',
            credentials: 'include' 
        });
        if(response.ok){
            return Promise.resolve(response.json().then((data)=>data?.message));
        }else{
            return Promise.reject("error Generating Access Token for Document Verification");
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
        return Promise.reject("error Generating Access Token for Document Verification");
    }
} 


export const verifyGstNumber = async(gstNumber:string):Promise<boolean>=>{
    try {
        const response = await fetch(`${API_END_POINTS.verifyGstNumber}?gstin=${gstNumber}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(response.ok){
            return Promise.resolve(true);
        }else{
            return Promise.reject(false);
        }
    } catch (error) {
        console.error("Error verifying GST number:", error);
        return Promise.reject(false);
    }
}


export const verifyPanNumber = async(panNumber:string):Promise<TpanNumberVerificationResponse>=>{
    try {
        const response = await fetch(`${API_END_POINTS.verifyPanNumber}?id_number=${panNumber}`, {
            method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
        });
        if(response.ok){
            return Promise.resolve(response.json()?.then((data)=>data?.message));
        }else{
            console.error("PAN number verification failed with status:", await response.json().then((data)=>data));
            return Promise.reject(false);
        }
    } catch (error) {
        console.error("Error verifying PAN number:", error);
        return Promise.reject();
    }
}