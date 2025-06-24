"use client"
import requestWrapper from "@/src/services/apiCall";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { useVendorStore } from "@/src/store/VendorRegistrationStore";
import { VendorRegistrationData } from "@/src/types/types";
import { AxiosResponse } from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

export const handleSubmit = async(e:React.MouseEvent<HTMLButtonElement>,data:VendorRegistrationData,router:AppRouterInstance)=>{
    // const {data,resetForm} = useVendorStore()
    // const router = useRouter();
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
      // resetForm();
      console.log("handle submit successfully");
      alert("Submit Successfully");
      router.push("/dashboard");
      return;
    }
  }