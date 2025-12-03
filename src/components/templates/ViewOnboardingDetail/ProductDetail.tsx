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
  validation_check: VendorOnboardingResponse["message"]["validation_check"]
};

const ProductDetail = ({ ref_no, onboarding_ref_no, OnboardingDetail, validation_check }: Props) => {
  const router = useRouter();

  const [singleRow, SetSingleRow] = useState<any>()
  const [productImage, setProductImage] = useState<File | null>();
  const [materialsTable, setMaterialsTable] = useState<any[]>(OnboardingDetail ?? []);

  const uploadProductImageRef = useRef<HTMLInputElement>(null);

  console.log(OnboardingDetail, "this is console")

  const fetchTable = async () => {
    const fetchOnboardingDetailUrl = `${API_END_POINTS?.fetchDetails}?ref_no=${ref_no}&vendor_onboarding=${onboarding_ref_no}`;
    const fetchOnboardingDetailResponse: AxiosResponse = await requestWrapper({ url: fetchOnboardingDetailUrl, method: "GET" });
    const OnboardingDetail: VendorOnboardingResponse["message"] = fetchOnboardingDetailResponse?.status == 200 ? fetchOnboardingDetailResponse?.data?.message : "";
    setMaterialsTable(OnboardingDetail?.product_details_tab)
  }

  const handleDelete = async (index: number) => {
    const response: AxiosResponse = await requestWrapper({ url: API_END_POINTS?.deleteProductDetailItem, data: { data: { ref_no: ref_no, vendor_onboarding: onboarding_ref_no, idx: index } }, method: "DELETE" });
    if (response?.status == 200) {
      alert("Record Deleted Successfully");
      fetchTable();
    }
  }

  const handleAdd = async () => {

    if (materialsTable?.length < 1) {
      alert("Please Enter At Least 1 Material Details")
      return;
    }

    const formdata = new FormData();
    if (productImage) {
      formdata.append("material_images", productImage);
    }
    const Data = { materials_supplied: singleRow, ref_no: ref_no, vendor_onboarding: onboarding_ref_no };
    formdata.append("data", JSON.stringify(Data));
    const submitUrl = API_END_POINTS?.addProductDetail;
    const submitResponse: AxiosResponse = await requestWrapper({
      url: submitUrl,
      data: formdata,
      method: "POST",
    });

    if (submitResponse?.status == 200) {
      alert("data added successfully");
      fetchTable();
      SetSingleRow({});
      setProductImage(null);
      const imageinput = uploadProductImageRef?.current
      if (imageinput) {
        imageinput.value = ""
      }
    }
  };

  const viewFile = (fileId: string) => {
    const url = `${API_END_POINTS.securefileview}?file_id=${fileId}`;
    window.open(url, "_blank");
  };

  const handleNext = () => {
    router.push(
      `/vendor-details-form?tabtype=Manufacturing%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
    )
  }

  const handleBack = () => {
    router.push(
      `/vendor-details-form?tabtype=Contact%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`
    );
  };

  const handleTableCheckbox = async (value: boolean, type: "critical" | "non_critical", idx: number) => {

    let data: any = {
      ref_no: ref_no,
      vendor_onboarding: onboarding_ref_no,
      idx: idx
    }

    if (value && type == "critical") {
      data = { ...data, critical: 1, "non_critical": 0 }
    } else if (value && type == "non_critical") {
      data = { ...data, critical: 0, "non_critical": 1 }
    } else {
      data = { ...data, critical: 0, "non_critical": 0 }
    }

    const formdata = new FormData();
    formdata.append("data", JSON.stringify(data));

    const response: AxiosResponse = await requestWrapper({
      url: API_END_POINTS?.criticalNonCritical, method: "PATCH",
      data: formdata
    });
    if (response.status != 200) {
      console.log("error while updateing the products table");
    }
    fetchTable();
  }

  console.log("Mamafbaeofb", validation_check);

  return (
    <div className="flex flex-col bg-white rounded-lg p-2 max-h-[80vh] w-full">
      {/* <h1 className="border-b-2 pb-1 sticky top-0 bg-white py-2 text-lg font-semibold">
        Product Detail<span className="pl-1 text-red-400 text-2xl">*</span>
      </h1> */}

      {/* <div className="grid grid-cols-3 gap-4 p-1">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Product Manufactured
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
            HSN/SAC Code
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
            Annual Capacity
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
            Product Description
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
            Upload manufactured product image
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
      </div> */}
      {materialsTable?.length > 0 && (
        <div className="shadow- bg-[#f6f6f7] p-3 mb-3 mt-3 rounded-2xl">
          <div className="flex w-full justify-between pb-4">
            <h1 className="text-[20px] text-[#03111F] font-semibold">
              Product Details
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
                  <TableHead className="text-center">Critical</TableHead>
                  <TableHead className="text-center">Non-Critical</TableHead>
                  {/* <TableHead className="text-center">Action</TableHead> */}
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
                      {/* <Link href={material?.material_images?.url} target="blank">{material?.material_images?.file_name ?? "-"}
                      </Link> */}
                      <span
                        className="text-[13px] text-blue-600 underline cursor-pointer hover:text-blue-800 mt-1"
                        onClick={() => viewFile(material?.material_images?.name ?? "")}
                      >
                        {material?.material_images?.file_name}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Input type="checkbox" className="w-5 h-5" onChange={(e) => { handleTableCheckbox(e.target.checked, "critical", material?.idx) }} checked={material?.critical} disabled={validation_check?.purchase_team_undertaking == 1 ? true : false} />
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Input type="checkbox" className="w-5 h-5" checked={material?.non_critical} onChange={(e) => { handleTableCheckbox(e.target.checked, "non_critical", material?.idx) }} disabled={validation_check?.purchase_team_undertaking == 1 ? true : false} />
                      </div>
                    </TableCell>

                    {/* <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Trash2
                          className="text-red-400 hover:cursor-pointer"
                          onClick={() => handleDelete(material?.idx)}
                        />
                      </div>
                    </TableCell> */}

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
      {/* <div className="flex justify-end items-center space-x-3 mt-24">
        <Button onClick={handleBack} variant="backbtn" size="backbtnsize">
          Back
        </Button>

        <Button  variant="nextbtn" size="nextbtnsize" onClick={()=>{handleNext()}}>
          Next
        </Button>
      </div> */}
    </div>
  );
};
export default ProductDetail;