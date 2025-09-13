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
import { CropIcon, Cross, CrossIcon, Trash2, X } from "lucide-react";

interface Props {
  companyAddressDropdown?: TCompanyAddressDropdown["message"]["data"];
  ref_no: string;
  onboarding_ref_no: string;
  OnboardingDetail: VendorOnboardingResponse["message"]["company_address_tab"];
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
  OnboardingDetail
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
    if (submitResponse?.status == 200) router.push(`/vendor-details-form?tabtype=Document%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`);
  };

  const handleBack = () => {
    router.push(`/vendor-details-form?tabtype=Company%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`);
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
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-1 font-semibold sticky top-0 bg-white py-2 text-lg z-50">
        Company Address
      </h1>
      <h1 className="pl-1 pt-1">Office Address</h1>
      <div className="grid grid-cols-4 gap-4 p-2">
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Street Line 1<span className="pl-1 text-red-400 text-2xl">*</span>
          </h1>
          <Input
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
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Street Line 2<span className="pl-1 text-red-400 text-2xl">*</span>
          </h1>
          <Input
            maxLength={40}
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
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Pincode/Zipcode<span className="pl-1 text-red-400 text-2xl">*</span>
          </h1>
          <Input
            placeholder=""
            type="number"
            name="international_zipcode"
            onChange={(e) => {
              handleFieldChange(e, "billing_address")
            }}
            value={formdata?.billing_address?.international_zipcode ?? OnboardingDetail?.billing_address?.international_zipcode ?? ""}
          />
          <p className="text-xs text-gray-500 pt-2">
            Enter the Pincode/Postal Code/ZipCode in the global format for your state or country.<br/>
            <span className="underline text-black font-medium">(For Eg.- Country: <span className="underline text-blue-500 font-medium">Sweden</span>, ZipCode: <span className="underline text-blue-500 font-medium">123 45</span>)</span>
          </p>
          {errors?.international_zipcode && <span style={{ color: 'red' }}>{errors?.international_zipcode}</span>}
        </div>

        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            City<span className="pl-1 text-red-400 text-2xl">*</span>
          </h1>
          <Input
            placeholder=""
            name="international_city"
            onChange={(e) => { handleFieldChange(e, "billing_address") }}
            value={formdata?.billing_address?.international_city ?? OnboardingDetail?.billing_address?.international_city ?? ""}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            State<span className="pl-1 text-red-400 text-2xl">*</span>
          </h1>
          <Input
            placeholder=""
            name="international_state"
            onChange={(e) => { handleFieldChange(e, "billing_address") }}
            value={formdata?.billing_address?.international_state ?? OnboardingDetail?.billing_address?.international_state ?? ""}
          // defaultValue={}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Country <span className="pl-1 text-red-400 text-2xl">*</span>
          </h1>
          <Input
            placeholder=""
            name="international_country"
            onChange={(e) => { handleFieldChange(e, "billing_address") }}
            value={formdata?.billing_address?.international_country ?? OnboardingDetail?.billing_address?.international_country ?? ""}
          />
        </div>

      </div>
      <div className="flex justify-start gap-4 items-center">
        <h1 className="pl-1 pt-2 font-medium">Manufacturing Address</h1>
        <div className="flex items-center gap-1 pt-2">
          <Input
            type="checkbox"
            className="w-4"
            onChange={(e) => {
              setformdata((prev: any) => ({ ...prev, same_as_above: e.target.checked }));
            }}
            value={formdata?.same_as_above ? 1 : 0}

            checked={formdata?.same_as_above ?? OnboardingDetail?.same_as_above}
          />
          <h1 className="font-normal">Same as above</h1>
        </div>
      </div>
      <div className={`grid grid-cols-4 gap-4 p-2 ${formdata?.same_as_above ? "hidden" : ""}`}>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Address 1
          </h1>
          <Input
            maxLength={40}
            // placeholder={shippingData?.address1}
            name="street_1"
            value={formdata?.shipping_address?.street_1 ?? OnboardingDetail?.shipping_address?.street_1 ?? ""}
            disabled={formdata?.same_as_above ? true : false}
            onChange={(e) => {
              handleFieldChange(e, "shipping_address");
            }}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Address 2
          </h1>
          <Input
            maxLength={40}
            name="street_2"
            value={formdata?.shipping_address?.street_2 ?? OnboardingDetail?.shipping_address?.street_2 ?? ""}
            disabled={formdata?.same_as_above ? true : false}
            onChange={(e) => {
              handleFieldChange(e, "shipping_address");
            }}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Pincode/Zipcode
          </h1>
          <Input
            name="inter_manufacture_zipcode"
            value={formdata?.shipping_address?.inter_manufacture_zipcode ?? OnboardingDetail?.shipping_address?.inter_manufacture_zipcode ?? ""}
            disabled={formdata?.same_as_above ? true : false}
            onChange={(e) => {
              handleFieldChange(e, "shipping_address");
            }}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            City
          </h1>
          <Input
            // placeholder={shippingData?.city}
            name="inter_manufacture_city"
            value={formdata?.shipping_address?.inter_manufacture_city ?? OnboardingDetail?.shipping_address?.inter_manufacture_city ?? ""}
            disabled={formdata?.same_as_above ? true : false}
            onChange={(e) => { handleFieldChange(e, "shipping_address") }}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            State
          </h1>
          <Input
            // placeholder={shippingData?.state}
            name="inter_manufacture_state"
            value={formdata?.shipping_address?.inter_manufacture_state ?? OnboardingDetail?.shipping_address?.inter_manufacture_state ?? ""}
            disabled={formdata?.same_as_above ? true : false}
            onChange={(e) => { handleFieldChange(e, "shipping_address") }}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Country
          </h1>
          <Input
            name="inter_manufacture_country"
            value={formdata?.shipping_address?.inter_manufacture_country ?? OnboardingDetail?.shipping_address?.inter_manufacture_country ?? ""}
            disabled={formdata?.same_as_above ? true : false}
            onChange={(e) => { handleFieldChange(e, "shipping_address") }}
          />
        </div>
      </div>
      <div className="pl-2 flex gap-4 items-center">
        <Input
          type="checkbox"
          className="w-4"
          onChange={(e) => {
            setformdata((prev: any) => ({ ...prev, multiple_locations: e.target.checked }));
          }}
          checked={formdata?.multiple_locations ?? OnboardingDetail?.multiple_locations == 1}
        />
        <h1>Do you have multiple locations?</h1>
      </div>
      {formdata?.multiple_locations && (
        <>
          <div className="grid grid-cols-4 gap-4 p-2">
            <div className="col-span-2">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Address 1
              </h1>
              <Input
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
                  onChange={(e) => {
                    setSingleRow((prev: any) => ({ ...prev, country: e.target.value }))
                  }}
                  value={singlerow?.country ?? ""}
                />
              </div>
              <div className={``}>
                <Button
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

          {/* // table */}

          <div className="shadow- bg-[#f6f6f7] p-4 mb-4 rounded-2xl">
            <div className="flex w-full justify-between pb-4">
              <h1 className="text-[20px] text-[#03111F] font-semibold">
                Multiple Locations
              </h1>
            </div>
            <Table>
              {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
              <TableHeader className="text-center">
                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                  <TableHead className="text-center text-black">Sr No.</TableHead>
                  <TableHead className="text-center text-black">Address1</TableHead>
                  <TableHead className="text-center text-black">Address2</TableHead>
                  <TableHead className="text-center text-black">Pincode</TableHead>
                  <TableHead className="text-center text-black">City</TableHead>
                  <TableHead className="text-center text-black">State</TableHead>
                  <TableHead className="text-center text-black">Country</TableHead>
                  <TableHead className="text-center text-black">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-center">
                {multipleTable?.map((item: any, index: any) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="text-center" >{item?.address_line_1}</TableCell>
                    <TableCell className="text-center">{item?.address_line_2}</TableCell>
                    <TableCell className="text-center">{item?.zipcode}</TableCell>
                    <TableCell className="text-center" >{item?.city}</TableCell>
                    <TableCell className="text-center">{item?.state}</TableCell>
                    <TableCell className="text-center">{item?.country}</TableCell>
                    <TableCell className="flex justify-center"><Trash2 className="text-red-400 cursor-pointer" onClick={() => { handleRowDelete(index) }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <div className="flex flex-col gap-2 justify-center pl-2 pt-2">
        {/* <h1 className="font-medium">Main Office Address Proof</h1> */}
        <h1 className="font-normal">
          Upload Main Office Address Proof (Light Bill, Telephone Bill, etc.)
        </h1>
        <Input type="file" className="w-fit" onChange={(e) => { setFile(e.target.files) }} />
        {/* file preview */}
        {
          isFilePreview && !file && OnboardingDetail?.address_proofattachment?.url &&
          <div className="flex gap-2">
            <Link target="blank" href={OnboardingDetail?.address_proofattachment?.url} className="underline text-blue-300 max-w-44 truncate">
              <span>{OnboardingDetail?.address_proofattachment?.file_name}</span>
            </Link>
            <X className="cursor-pointer" onClick={() => { setIsFilePreview((prev) => !prev) }} />
          </div>
        }
      </div>
      <div className="flex justify-end items-center space-x-3">
        <Button
          onClick={handleBack}
          variant="backbtn"
          size="backbtnsize"
        >
          Back
        </Button>

        <Button
          onClick={handleSubmit}
          variant="nextbtn"
          size="nextbtnsize"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CompanyAddress;
