"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../../atoms/input";
import {
  pincodeBasedData,
  TCompanyAddressDropdown,
  TmultipleLocation,
  TvendorOnboardingDetail,
  VendorOnboardingResponse,
} from "@/src/types/types";
import { useCompanyAddressFormStore } from "@/src/store/companyAddressStore";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import { Button } from "../../atoms/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../atoms/table";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import FilePreview from "../../molecules/FilePreview";
import Link from "next/link";
import { CropIcon, Cross, CrossIcon, Trash2, X, Pencil, Lock, Paperclip } from "lucide-react";

interface Props {
  companyAddressDropdown?: TCompanyAddressDropdown["message"]["data"];
  ref_no: string;
  onboarding_ref_no: string;
  OnboardingDetail: VendorOnboardingResponse["message"]["company_address_tab"];
  isAmendment: number;
  re_release: number
}


interface shippingData {
  address1?: string;
  address2?: string;
  pincode?: string;
  city?: string;
  state?: string;
  district?: string;
  country?: string;
}

interface billingData {
  address1?: string;
  address2?: string;
  pincode?: string;
  city?: string;
  state?: string;
  district?: string;
  country?: string;
}

type formdataT = {
  billing_address: billingData,
  shipping_address: shippingData
}

interface multipleAddress {
  address_line_1: string;
  address_line_2: string;
  pincode: string;
  city: string
  state: string
  country: string
  zipcode: string
}

const CompanyAddress = ({
  ref_no,
  onboarding_ref_no,
  OnboardingDetail,
  isAmendment, re_release
}: Props) => {

  const router = useRouter();

  const {
    billingAddress
  } = useCompanyAddressFormStore();
  const [file, setFile] = useState<FileList | null>(null);
  const [isFilePreview, setIsFilePreview] = useState<boolean>(true);
  const [formdata, setformdata] = useState<formdataT | null | any>({ ...OnboardingDetail });
  const [multipleTable, setMultipleTable] = useState<multipleAddress[] | null>(OnboardingDetail?.multiple_location_table);
  const [singlerow, setSingleRow] = useState<Partial<multipleAddress>>();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);



  console.log(OnboardingDetail, "htis is onboarding data")



  const handleMultipleAdd = () => {
    setMultipleTable((prev: any) => ([...prev, singlerow]));
    setSingleRow({});
  };

  const [errors, setErrors] = useState<any>({});
  const validate = () => {
    const errors: any = {};

    const addressLine1 = formdata?.billing_address?.address_line_1 ?? OnboardingDetail?.billing_address?.address_line_1;
    if (!addressLine1) {
      errors.address_line_1 = "Please Enter Address 1";
    }

    const addressLine2 = formdata?.billing_address?.address_line_2 ?? OnboardingDetail?.billing_address?.address_line_2;
    if (!addressLine2) {
      errors.address_line_2 = "Please Enter Address Line 2";
    }

    const pincode = formdata?.billing_address?.international_zipcode ?? OnboardingDetail?.billing_address?.international_zipcode;
    if (!pincode) {
      errors.pincode = "Please Enter Pincode";
    }

    return errors;
  };

  const handleSubmit = async () => {

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const submitUrl = API_END_POINTS?.companyAddressSubmit;
    const Data = {
      ref_no: ref_no,
      ...formdata?.billing_address,
      ...formdata?.shipping_address,
      same_as_above: formdata?.same_as_above ? 1 : 0,
      vendor_onboarding: onboarding_ref_no,
      multiple_locations: formdata?.multiple_locations ? 1 : 0,
      multiple_location_table: multipleTable
    };
    // const updatedData = {data:Data}

    const formData = new FormData();
    formData.append("data", JSON.stringify(Data));
    if (file) {
      formData.append("file", file[0])
    }
    const submitResponse: AxiosResponse = await requestWrapper({ url: submitUrl, method: "POST", data: formData });
    if (submitResponse?.status == 200)
      alert("International Company Address Updated Successfully!!!");
      router.push(`/view-onboarding-details?tabtype=Document%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`);
  };

  const handleRowDelete = (index: number) => {
    const updatedContacts = multipleTable?.filter((_, itemIndex) => itemIndex !== index);
    setMultipleTable(updatedContacts ?? []);
  }


  const handleFieldChange = (e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >, type: string) => {
    const { name, value } = e.target;
    if (type == "billing_address") {
      setformdata((prev: any) => ({
        ...prev,
        billing_address: {
          ...(prev?.billing_address ?? {}),
          [name]: value
        }
      }));
    } else if (type == "shipping_address") {
      setformdata((prev: any) => ({
        ...prev,
        shipping_address: {
          ...(prev?.shipping_address ?? {}),
          [name]: value
        }
      }));
    }
  }

  console.log(formdata, "this is form data")

  return (
    <div className="flex flex-col bg-white rounded-lg p-3 max-h-[80vh] overflow-y-scroll w-full">
      <div className="flex justify-between items-center border-b-2">
        <h1 className="font-semibold text-[18px]">
          Company Address
        </h1>
        {/* <Button onClick={() => { setIsDisabled(prev => !prev) }} className={`mb-2 ${isAmendment == 1?"":"hidden"}`}>{isDisabled ? "Enable Edit" : "Disable Edit"}</Button> */}
        {(isAmendment == 1 || re_release == 1) && (
          <div
            onClick={() => setIsDisabled(prev => !prev)}
            className="mb-2 inline-flex items-center gap-2 cursor-pointer rounded-[28px] border px-3 py-2 shadow-sm bg-[#5e90c0] hover:bg-gray-100 transition"
          >
            {isDisabled ? (
              <>
                <Lock className="w-5 h-5 text-red-500" />
                <span className="text-[14px] font-medium text-white hover:text-black">Enable Edit</span>
              </>
            ) : (
              <>
                <Pencil className="w-5 h-5 text-green-600" />
                <span className="text-[14px] font-medium text-white hover:text-black">Disable Edit</span>
              </>
            )}
          </div>
        )}
      </div>
      <h1 className="p-1">Office Address</h1>
      <div className="grid grid-cols-4 gap-6 p-1">
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Street Line 1 <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <Input
            disabled={isDisabled}
            maxLength={40}
            placeholder=""
            name="address_line_1"
            onChange={(e) => {
              handleFieldChange(e, "billing_address");
            }}
            value={formdata?.billing_address?.address_line_1 as string ?? OnboardingDetail?.billing_address?.address_line_1 ?? ""}
          />
          {errors?.address_line_1 && <span style={{ color: 'red' }}>{errors?.address_line_1}</span>}
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Street Line 2 <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <Input
            maxLength={40}
            disabled={isDisabled}
            placeholder=""
            name="address_line_2"
            onChange={(e) => {
              handleFieldChange(e, "billing_address");
            }}
            value={formdata?.billing_address?.address_line_2 ?? OnboardingDetail?.billing_address?.address_line_2 ?? ""}
          // defaultValue={}
          />
          {errors?.address_line_2 && <span style={{ color: 'red' }}>{errors?.address_line_2}</span>}
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Pincode/Zipcode <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <Input
            disabled={isDisabled}
            placeholder=""
            type="number"
            name="international_zipcode"
            onChange={(e) => {
              handleFieldChange(e, "billing_address")
            }}
            value={formdata?.billing_address?.international_zipcode ?? OnboardingDetail?.billing_address?.international_zipcode ?? ""}
          />
          {errors?.international_zipcode && <span style={{ color: 'red' }}>{errors?.international_zipcode}</span>}
        </div>

        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            City <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <Input
            disabled={isDisabled}
            placeholder=""
            name="international_city"
            onChange={(e) => { handleFieldChange(e, "billing_address") }}
            value={formdata?.billing_address?.international_city ?? OnboardingDetail?.billing_address?.international_city ?? ""}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            State <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <Input
            disabled={isDisabled}
            placeholder=""
            name="international_state"
            onChange={(e) => { handleFieldChange(e, "billing_address") }}
            value={formdata?.billing_address?.international_state ?? OnboardingDetail?.billing_address?.international_state ?? ""}
          // defaultValue={}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Country <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <Input
            disabled={isDisabled}
            placeholder=""
            name="international_country"
            onChange={(e) => { handleFieldChange(e, "billing_address") }}
            value={formdata?.billing_address?.international_country ?? OnboardingDetail?.billing_address?.international_country ?? ""}
          />
        </div>

      </div>
      <div className="flex justify-start gap-6 items-center">
        <h1 className="pl-2 ">Manufacturing Address</h1>
        <div className="flex items-center gap-1">
          <Input
            disabled={isDisabled}
            type="checkbox"
            className="w-4"
            onChange={(e) => {
              setformdata((prev: any) => ({ ...prev, same_as_above: e.target.checked }));
            }}
            // value={formdata?.same_as_above ? 1 : 0}
            checked={Boolean(formdata?.same_as_above ?? OnboardingDetail?.same_as_above)}
          />
          <h1 className="font-normal">Same as above</h1>
        </div>
      </div>
      <div className={`grid grid-cols-4 gap-6 p-5 ${formdata?.same_as_above ? "hidden" : ""}`}>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Address 1
          </h1>
          <Input
            maxLength={40}
            // placeholder={shippingData?.address1}
            name="street_1"
            value={formdata?.shipping_address?.street_1 ?? OnboardingDetail?.shipping_address?.street_1 ?? ""}
            disabled={isDisabled}
            onChange={(e) => {
              handleFieldChange(e, "shipping_address");
            }}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Address 2
          </h1>
          <Input
            maxLength={40}
            name="street_2"
            value={formdata?.shipping_address?.street_2 ?? OnboardingDetail?.shipping_address?.street_2 ?? ""}
            disabled={isDisabled}
            onChange={(e) => {
              handleFieldChange(e, "shipping_address");
            }}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Pincode/Zipcode
          </h1>
          <Input
            name="inter_manufacture_zipcode"
            value={formdata?.shipping_address?.inter_manufacture_zipcode ?? OnboardingDetail?.shipping_address?.inter_manufacture_zipcode ?? ""}
            disabled={isDisabled}
            onChange={(e) => {
              handleFieldChange(e, "shipping_address");
            }}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            City
          </h1>
          <Input
            // placeholder={shippingData?.city}
            name="inter_manufacture_city"
            value={formdata?.shipping_address?.inter_manufacture_city ?? OnboardingDetail?.shipping_address?.inter_manufacture_city ?? ""}
            disabled={isDisabled}
            onChange={(e) => { handleFieldChange(e, "shipping_address") }}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            State
          </h1>
          <Input
            // placeholder={shippingData?.state}
            name="inter_manufacture_state"
            value={formdata?.shipping_address?.inter_manufacture_state ?? OnboardingDetail?.shipping_address?.inter_manufacture_state ?? ""}
            disabled={isDisabled}
            onChange={(e) => { handleFieldChange(e, "shipping_address") }}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Country
          </h1>
          <Input
            name="inter_manufacture_country"
            value={formdata?.shipping_address?.inter_manufacture_country ?? OnboardingDetail?.shipping_address?.inter_manufacture_country ?? ""}
            disabled={isDisabled}
            onChange={(e) => { handleFieldChange(e, "shipping_address") }}
          />
        </div>
      </div>
      <div className="pl-4 flex gap-4 items-center">
        <Input
          disabled={isDisabled}
          type="checkbox"
          className="w-4"
          onChange={(e) => {
            setformdata((prev: any) => ({ ...prev, multiple_locations: e.target.checked }));
          }}
          checked={Boolean(formdata?.multiple_locations ?? OnboardingDetail?.multiple_locations)}

        />
        <h1>Do you have multiple locations?</h1>
      </div>
      {formdata?.multiple_locations && (
        <>
          <div className="grid grid-cols-4 gap-6 p-5">
            <div className="col-span-2">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Address 1
              </h1>
              <Input
                disabled={isDisabled}
                maxLength={40}
                onChange={(e) => {
                  setSingleRow((prev: any) => ({ ...prev, address_line_1: e.target.value }))
                }}
                value={singlerow?.address_line_1 ?? ""}
              />
            </div>
            <div className="col-span-2">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Address 2
              </h1>
              <Input
                disabled={isDisabled}
                maxLength={40}
                onChange={(e) => {
                  setSingleRow((prev: any) => ({ ...prev, address_line_2: e.target.value }))
                }}
                value={singlerow?.address_line_2 ?? ""}
              />
            </div>
            <div className="col-span-2">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Pincode/Zipcode
              </h1>
              <Input
                disabled={isDisabled}
                onChange={(e) => {
                  setSingleRow((prev: any) => ({ ...prev, zipcode: e.target.value }))
                }}
                value={singlerow?.zipcode ? singlerow?.zipcode : ""}
              />
            </div>
            <div className="grid grid-cols-3 col-span-4 gap-4">
              <div>
                <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                  City
                </h1>
                <Input
                  value={singlerow?.city ?? ""}
                  disabled={isDisabled}
                  onChange={(e) => {
                    setSingleRow((prev: any) => ({ ...prev, city: e.target.value }))
                  }}
                />
              </div>
              <div>
                <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                  State
                </h1>
                <Input
                  value={singlerow?.state ?? ""}
                  disabled={isDisabled}
                  onChange={
                    (e) => {
                      setSingleRow((prev: any) => ({ ...prev, state: e.target.value }))
                    }
                  }
                />
              </div>
              <div>
                <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                  Country
                </h1>
                <Input
                  disabled={isDisabled}
                  onChange={(e) => {
                    setSingleRow((prev: any) => ({ ...prev, country: e.target.value }))
                  }}
                  value={singlerow?.country ?? ""}
                />
              </div>
              <div className={``}>
                <Button
                  disabled={isDisabled}
                  className="bg-blue-400 hover:bg-blue-400 rounded-3xl"
                  onClick={() => {
                    handleMultipleAdd();
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          <div className="shadow- bg-[#f6f6f7] p-4 mb-4 rounded-2xl">
            <div className="flex w-full justify-between pb-4">
              <h1 className="text-[20px] text-[#03111F] font-semibold">
                Multiple Locations
              </h1>
            </div>
            <Table>
              <TableHeader className="text-center">
                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                  <TableHead className="w-[100px]">Sr No.</TableHead>
                  <TableHead>Address1</TableHead>
                  <TableHead>Address2</TableHead>
                  <TableHead className="text-center">Pincode</TableHead>
                  <TableHead className="text-center">City</TableHead>
                  <TableHead className="text-center">State</TableHead>
                  <TableHead className="text-center">Country</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-center">
                {multipleTable?.map((item: any, index: any) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{item?.address_line_1}</TableCell>
                    <TableCell>{item?.address_line_2}</TableCell>
                    <TableCell>{item?.zipcode}</TableCell>
                    <TableCell>{item?.city}</TableCell>
                    <TableCell>{item?.state}</TableCell>
                    <TableCell>{item?.country}</TableCell>
                    <TableCell className="flex justify-center">
                      {!isDisabled && (
                        <Trash2
                          className="text-red-400 cursor-pointer"
                          onClick={() => handleRowDelete(index)}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <div className="flex flex-col gap-2 justify-center pl-4 pt-2">
        <h1 className="font-medium">Main Office Address Proof</h1>
        <h1 className="text-[12px] font-normal text-[#626973]">
          Upload Address Proof (Light Bill, Telephone Bill, etc.)
        </h1>

        {/* Hidden file input with label trigger */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="file-upload"
            className={`flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800 ${isDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            <Paperclip className="w-5 h-5" />
            <span className="text-sm">Attach File</span>
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            disabled={isDisabled}
            onChange={(e) => setFile(e.target.files)}
          />
        </div>

        {/* Show preview if a new file is selected */}
        {file && file[0] && (
          <div className="flex gap-2 items-center mt-1">
            <span className="text-blue-500 max-w-44 truncate">{file[0].name}</span>
            {!isDisabled && (
              <X className="cursor-pointer" onClick={() => setFile(null)} />
            )}
          </div>
        )}

        {/* Show existing preview if no new file is chosen */}
        {!file && isFilePreview && OnboardingDetail?.address_proofattachment?.url && (
          <div className="flex gap-2 items-center mt-1">
            <Link
              target="_blank"
              href={OnboardingDetail.address_proofattachment.url}
              className="underline text-blue-500 max-w-44 truncate"
            >
              {OnboardingDetail.address_proofattachment.file_name}
            </Link>
            {!isDisabled && (
              <X
                className="cursor-pointer"
                onClick={() => setIsFilePreview(false)}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end pr-4 pb-4">
        <Button
          onClick={handleSubmit}
          variant="nextbtn"
          size="nextbtnsize"
          className={`${isDisabled ? "hidden" : ""}`}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CompanyAddress;