import API_END_POINTS from "@/src/services/apiEndPoints";

export const uploadFileApi = async (file: File, po_name: string) => {
    const formData = new FormData();
    formData.append('po_details_attachment', file);
    formData.append('data', JSON.stringify({ po_name: po_name }));
    try {
        const response = await fetch(`${API_END_POINTS?.uploadPoDocument}`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });
        if(!response.ok){
            console.error("Failed to upload file");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error uploading file:", error);
        // throw error;
    }
};

export const deleteFileApi = async (po_name: string) => {
    try {
        const response = await fetch(`${API_END_POINTS?.deletePoDocument}?po_name=${po_name}`, {
            method: 'POST',
            credentials: 'include',
        });
        if(!response.ok){
            console.error("Failed to delete file");
            return Promise.reject("Failed to delete file");  
          }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error deleting file:", error);
        // throw error;
    }
};