"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";
import { Input } from "../../atoms/input";
import { SelectContent } from "../../atoms/select";
import {
  useContactDetailStore,
  TcontactDetail,
} from "@/src/store/ContactDetailStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../atoms/table";
import { Button } from "@/components/ui/button";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import { VendorOnboardingResponse } from "@/src/types/types";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import Link from "next/link";

type Props = {
  ref_no: string;
  onboarding_ref_no: string;
  OnboardingDetail: VendorOnboardingResponse["message"]["product_details_tab"];
};

const ProductDetail = ({ ref_no, onboarding_ref_no, OnboardingDetail }: Props) => {
  const router = useRouter();

  const [singleRow,SetSingleRow] = useState<any>()
  const [productImage,setProductImage] = useState<File | null>();
  const [materialsTable, setMaterialsTable] = useState<any[]>(OnboardingDetail ?? []);

  const uploadProductImageRef = useRef<HTMLInputElement>(null);

  console.log(OnboardingDetail,"this is console")

  // const handleAddMaterial = () => {
  //   if (
  //     !singleRow?.material_description ||
  //     !singleRow?.hsnsac_code ||
  //     !singleRow?.annual_capacity ||
  //     !singleRow?.product_description ||
  //     !productImage
  //   ) {
  //     alert(
  //       "Please fill in all fields and upload a product image before adding."
  //     );
  //     return;
  //   }
  //   const newEntry = {
  //     material_description: singleRow.material_description,
  //     hsnsac_code: singleRow.hsnsac_code,
  //     annual_capacity: singleRow.annual_capacity,
  //     product_description:singleRow.product_description,
  //     material_images: productImage,
  //   };
  //   setMaterialsTable((prev) => [...prev, newEntry]);
  // };

    const fetchTable = async()=>{
      const fetchOnboardingDetailUrl = `${API_END_POINTS?.fetchDetails}?ref_no=${ref_no}&vendor_onboarding=${onboarding_ref_no}`;
      const fetchOnboardingDetailResponse: AxiosResponse = await requestWrapper({ url: fetchOnboardingDetailUrl, method: "GET" });
      const OnboardingDetail: VendorOnboardingResponse["message"] = fetchOnboardingDetailResponse?.status == 200 ? fetchOnboardingDetailResponse?.data?.message : "";
      setMaterialsTable(OnboardingDetail?.product_details_tab)
    }

    const handleDelete = async(index:number)=>{
      const response:AxiosResponse = await requestWrapper({url:API_END_POINTS?.deleteProductDetailItem,data:{data:{ref_no:ref_no,vendor_onboarding:onboarding_ref_no,idx:index}},method:"DELETE"});
      if(response?.status == 200){
        alert("Record Deleted Successfully");
        fetchTable();
      }
    }

    const requiredFieldsFilled =  {
      material_name: "Please enter product manufactured",
      hsnsac_code: "Please enter HSN/SAC Code",
      annual_capacity: "Please enter Annual Capacity",          
      material_description: "Please enter Product Description",
    }

  const handleAdd = async () => {

    for (const [field, message] of Object.entries(requiredFieldsFilled)) {
      if (!singleRow?.[field]) {
        alert(message);
        return;
      };
    };

    if(!productImage){
      alert("Please upload a product image");
      return;
    }

    const formdata = new FormData();
    formdata.append("material_images",productImage);
  
    const Data = {materials_supplied:singleRow,ref_no:ref_no,vendor_onboarding:onboarding_ref_no};
    formdata.append("data",JSON.stringify(Data));
    const submitUrl = API_END_POINTS?.addProductDetail;
    const submitResponse: AxiosResponse = await requestWrapper({
      url: submitUrl,
      data:formdata ,
      method: "POST",
    });

    // if (submitResponse?.status == 200)
    //   router.push(
    //     `/vendor-details-form?tabtype=Manufacturing%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
    //   );
    if(submitResponse?.status == 200){
      alert("data added successfully");
      fetchTable();
      SetSingleRow({});
      setProductImage(null);
      const imageinput = uploadProductImageRef?.current
      if(imageinput){
        imageinput.value = "" 
      }
    }
  };

  const handleNext = ()=>{
    if (materialsTable?.length == 0) {
      alert("Please Enter At Least 1 Material Details")
      return;
    }
    router.push(
      `/vendor-details-form?tabtype=Manufacturing%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
    )
  }

  const handleBack = () => {
    router.push(
      `/vendor-details-form?tabtype=Contact%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
    );
  };

  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-1 sticky top-0 bg-white py-2 text-lg font-semibold">
        Product Detail<span className="pl-1 text-red-400 text-2xl">*</span>
      </h1>
      <div className="grid grid-cols-3 gap-4 p-1">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Product Manufactured <span className="pl-1 text-red-400 text-xl">*</span>
          </h1>
          <Input
            placeholder=""
            value={
              singleRow?.material_name ?? ""
            }
            onChange={(e) => {
              SetSingleRow((prev:any)=>({...prev,material_name:e.target.value}));
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            HSN/SAC Code <span className="pl-1 text-red-400 text-xl">*</span>
          </h1>
          <Input
            placeholder=""
            value={
              singleRow?.hsnsac_code ?? ""
            }
            onChange={(e) => {
              SetSingleRow((prev:any)=>({...prev,hsnsac_code:e.target.value}))
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Annual Capacity <span className="pl-1 text-red-400 text-xl">*</span>
          </h1>
          <Input
            placeholder=""
            value={
              singleRow?.annual_capacity ?? ""
            }
            onChange={(e) => {
              SetSingleRow((prev:any)=>({...prev,annual_capacity:e.target.value}))
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Product Description <span className="pl-1 text-red-400 text-xl">*</span>
          </h1>
          <Input
            placeholder=""
            value={
              singleRow?.material_description ?? ""
            }
            onChange={(e) => {
              SetSingleRow((prev:any)=>({...prev,material_description:e.target.value}))
            }}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Upload manufactured product image <span className="pl-1 text-red-400 text-xl">*</span>
          </h1>
          <div className="flex gap-4">
            <Input
            ref={uploadProductImageRef}
              placeholder=""
              type="file"
              onChange={(e) => {
                setProductImage(e?.target?.files?.[0]);
              }}
            />

          </div>
        </div>
        <div className="col-span-1 flex items-end">
          <Button
            onClick={handleAdd}
            className="py-2"
            variant="nextbtn"
            size="nextbtnsize"
          >
            Add
          </Button>
        </div>
      </div>
      {materialsTable?.length > 0 && (
        <div className="shadow- bg-[#f6f6f7] p-4 mb-4 mt-4 rounded-2xl">
          <div className="flex w-full justify-between pb-4">
            <h1 className="text-[20px] text-[#03111F] font-semibold">
              Multiple Product List Detail
            </h1>
          </div>
          <div className="col-span-3 mt-4">
            <Table className="max-h-40 overflow-y-scroll">
              <TableHeader className="text-center">
                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                  <TableHead className="text-center">Sr.No.</TableHead>
                  <TableHead className="text-center">Product</TableHead>
                  <TableHead className="text-center">HSN/SAC Code</TableHead>
                  <TableHead className="text-center">Annual Capacity</TableHead>
                  <TableHead className="text-center">Product Description</TableHead>
                  <TableHead className="text-center">File Name</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materialsTable?.map((material, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="text-center">{material.material_name}</TableCell>
                    <TableCell className="text-center">{material.hsnsac_code}</TableCell>
                    <TableCell className="text-center">{material.annual_capacity}</TableCell>
                    <TableCell className="text-center">{material.material_description}</TableCell>
                    <TableCell className="text-center">
                      <Link href={material?.material_images?.url} target="blank">{material?.material_images?.file_name ?? "-"}</Link>
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <Trash2 className="text-red-400 hover:cursor-pointer" onClick={()=>{handleDelete(material?.idx)}}>
                        Delete
                      </Trash2>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      
      {/* <div className={`flex justify-end pb-2`}>
        <Button
          className="py-2"
          variant={"nextbtn"}
          size={"nextbtnsize"}
          onClick={() => {
            handleAddMaterial();
          }}
        >
          Add
        </Button>
      </div> */}
      <div className="flex justify-end items-center space-x-3 mt-24">
        <Button onClick={handleBack} variant="backbtn" size="backbtnsize">
          Back
        </Button>

        <Button  variant="nextbtn" size="nextbtnsize" onClick={()=>{handleNext()}}>
          Next
        </Button>
      </div>
    </div>
  );
};
export default ProductDetail;