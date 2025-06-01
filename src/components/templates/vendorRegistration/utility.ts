"use client"
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { useVendorStore } from "@/src/store/VendorRegistrationStore";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";

export const handleSubmit = async()=>{
    const {data,resetForm} = useVendorStore()
    const router = useRouter();
    const url = API_END_POINTS?.vendorRegistrationSubmit
    const response:AxiosResponse = await requestWrapper({
      url:url,
      method:"POST",
      data:{data:data}
    });

    if(response?.status == 500){
      console.log("error in submitting this form");
      return;
    }

    if(response?.status == 200){
      resetForm();
      console.log("handle submit successfully");
      alert("Submit Successfully");
      router.push("/dashboard");
      return;
    }
  }