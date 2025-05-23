"use client";
import React, { useEffect, useState } from "react";
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
  pincodeBasedData,
  TCompanyAddressDetail,
  TCompanyAddressDropdown,
  TmultipleLocation,
  TvendorOnboardingDetail,
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
import { tableData } from "@/src/constants/dashboardTableData";
import ManufacturingDetail from "./ManufacturingDetail";

interface Props {
  companyAddressDropdown?: TCompanyAddressDropdown["message"]["data"];
  ref_no: string;
  onboarding_ref_no: string;
  onboarding_data:TvendorOnboardingDetail["message"]["data"]
}

interface pincodeFetchData {
  district?: string;
  city?: string;
  state?: string;
  country?: string;
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

interface multipleAddress {
  address1?: string;
  address2?: string;
  pincode?: string;
  city?: { name: string; city_name: string; city_code: string };
  state?: { name: string; state_name: string; state_code: string };
  district?: { name: string; district_name: string; district_code: string };
  country?: { name: string; country_name: string; country_code: string };
}

const CompanyAddress = ({
  companyAddressDropdown,
  ref_no,
  onboarding_ref_no,
  onboarding_data
}: Props) => {

  // useEffect(()=>{
    
  // },[])
  console.log(onboarding_data,"htis is onboarding data")

  const {
    billingAddress,
    shippingAddress,
    multiple_location_table,
    updatebillingAddress,
    updateshippingAddress,
    updateLocationAtIndex,
    addMultipleLocation,
  } = useCompanyAddressFormStore();

  const [pincodeFetchData, setPincodeData] = useState<pincodeFetchData>();
  const [isShippingSame, setIsShippingSame] = useState<boolean>(false);
  const [shippingData, setShippingData] = useState<shippingData>();
  const [MultipleAddress, setMultipleAddress] = useState<multipleAddress>();

  const [isMultipleLocation, setIsMultipleLocation] = useState<boolean>(false);

  const handlePincodeChange = async (value: string) => {
    updatebillingAddress("pincode", value);
    if (value?.length >= 6) {
      const pincodeChangeUrl = `${API_END_POINTS?.districtchangeUrl}?pincode=${value}`;
      const pincodeChangeResponse: AxiosResponse = await requestWrapper({
        url: pincodeChangeUrl,
        method: "GET",
      });
      const data: pincodeBasedData["message"] =
        pincodeChangeResponse?.status == 200
          ? pincodeChangeResponse?.data?.message
          : "";
      if (data) {
        updatebillingAddress("city", data?.data?.city[0]?.name);
        updatebillingAddress("district", data?.data?.district[0]?.name);
        updatebillingAddress("state", data?.data?.state[0]?.name);
        updatebillingAddress("country", data?.data?.country[0]?.name);
      }
    }
  };

  const handleShippingPincodeChange = async (value: string) => {
    updateshippingAddress("pincode", value);
    if (value?.length >= 6) {
      const pincodeChangeUrl = `${API_END_POINTS?.districtchangeUrl}?pincode=${value}`;
      const pincodeChangeResponse: AxiosResponse = await requestWrapper({
        url: pincodeChangeUrl,
        method: "GET",
      });
      const data: pincodeBasedData["message"] =
        pincodeChangeResponse?.status == 200
          ? pincodeChangeResponse?.data?.message
          : "";
      if (data) {
        updateshippingAddress("city", data?.data?.city[0]?.city_name);
        updateshippingAddress("district", data?.data?.district[0]?.name);
        updateshippingAddress("state", data?.data?.state[0]?.name);
        updateshippingAddress("country", data?.data?.country[0]?.name);
        setShippingData((prev) => ({
          ...prev,
          country: data?.data?.country[0]?.country_name,
          state: data?.data?.state[0]?.state_name,
          city: data?.data?.city[0]?.city_name,
          district: data?.data?.district[0]?.district_name,
        }));
      }
    }
  };

  const handleMultiplePincodeChange = async (value: string) => {
    setMultipleAddress((prev) => ({ ...prev, pincode: value }));
    if (value?.length >= 6) {
      updateshippingAddress("pincode", value);
      const pincodeChangeUrl = `${API_END_POINTS?.districtchangeUrl}?pincode=${value}`;
      const pincodeChangeResponse: AxiosResponse = await requestWrapper({
        url: pincodeChangeUrl,
        method: "GET",
      });
      const data: pincodeBasedData["message"] =
        pincodeChangeResponse?.status == 200
          ? pincodeChangeResponse?.data?.message
          : "";
      if (data) {
        setMultipleAddress((prev) => ({ ...prev, city: data?.data?.city[0] }));
        setMultipleAddress((prev) => ({
          ...prev,
          state: data?.data?.state[0],
        }));
        setMultipleAddress((prev) => ({
          ...prev,
          district: data?.data?.district[0],
        }));
        setMultipleAddress((prev) => ({
          ...prev,
          country: data?.data?.country[0],
        }));
      }
    }
  };

  const handleMultipleAdd = () => {
    const updatedData: TmultipleLocation = {
      address_line_1: MultipleAddress?.address1,
      address_line_2: MultipleAddress?.address2,
      ma_pincode: MultipleAddress?.pincode,
      ma_district: MultipleAddress?.district?.name,
      ma_state: MultipleAddress?.state?.name,
      ma_city: MultipleAddress?.city?.name,
      ma_country: MultipleAddress?.country?.name,
    };
    addMultipleLocation(updatedData);
    setMultipleAddress({});
  };

  const handleShippingCheck = (e: boolean) => {
    setIsShippingSame(e);
    if (e) {
      setShippingData((prev) => ({
        ...prev,
        address1: billingAddress?.address_line_1,
        address2: billingAddress?.address_line_2,
        pincode: billingAddress?.pincode,
        district: pincodeFetchData?.district,
        city: pincodeFetchData?.city,
        state: pincodeFetchData?.state,
        country: pincodeFetchData?.country,
      }));
    }
  };

  const handleSubmit = async () => {
    const submitUrl = API_END_POINTS?.companyAddressSubmit;
    const Data = {
      ref_no: ref_no,
      ...billingAddress,
      street_1: shippingAddress?.address_line_1,
      street_2:shippingAddress?.address_line_2,
      manufacturing_pincode:shippingAddress?.pincode,
      manufacturing_country:shippingAddress?.country,
      manufacturing_state:shippingAddress?.state,
      manufacturing_city:shippingAddress?.city,
      manufacturing_district:shippingAddress?.district,
      same_as_above: isShippingSame ? 1 : 0,
      vendor_onboarding: onboarding_ref_no,
      multiple_locations: isMultipleLocation ? 1 : 0,
      multiple_location_table: multiple_location_table,
    };
    const updatedData = {data:Data}

    const formData = new FormData();
    formData.append("data",JSON.stringify(updatedData));
    const submitResponse:AxiosResponse = await requestWrapper({url:submitUrl,method:"POST",data:updatedData});
    if(submitResponse?.status == 200){
      console.log("successfully submitted");
    }


  };

  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg z-50">
        Company Address
      </h1>
      <h1 className="pl-2 ">Billing Address</h1>
      <div className="grid grid-cols-4 gap-6 p-5">
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Address 1
          </h1>
          <Input
            placeholder=""
            onChange={(e) => {
              updatebillingAddress("address_line_1", e.target.value);
            }}
            value={billingAddress?.address_line_1 as string ?? onboarding_data?.vendor_company_details[0]?.address_line_1 as string ?? ""}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Address 2
          </h1>
          <Input
            placeholder=""
            onChange={(e) => {
              updatebillingAddress("address_line_2", e.target.value);
            }}
            value={billingAddress?.address_line_2?? onboarding_data?.vendor_company_details[0]?.address_line_2 as string ?? ""}
            // defaultValue={}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Pincode/Zipcode
          </h1>
          <Input
            placeholder=""
            onChange={(e) => {
              handlePincodeChange(e.target.value);
            }}
            value={billingAddress?.pincode?? onboarding_data?.vendor_company_details[0]?.pincode as string ?? ""}
            // defaultValue={}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            District
          </h1>
          <Input
            placeholder=""
            value={billingAddress?.district ?? onboarding_data?.vendor_company_details[0]?.district as string ?? ""}
            // defaultValue={}
            readOnly
          />
        </div>
        <div className="grid grid-cols-3 col-span-4 gap-4">
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              City
            </h1>
            <Input
              placeholder=""
              value={billingAddress?.city?? onboarding_data?.vendor_company_details[0]?.city as string ?? ""}
              // defaultValue={}
              readOnly
            />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              State
            </h1>
            <Input
              placeholder=""
              value={billingAddress?.state ?? onboarding_data?.vendor_company_details[0]?.state as string ?? ""}
              // defaultValue={}
              readOnly
            />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Country
            </h1>
            <Input
              placeholder=""
              value={billingAddress?.country ?? onboarding_data?.vendor_company_details[0]?.country as string ?? ""}
              
              readOnly
            />
          </div>
        </div>
      </div>
      <div className="flex justify-start gap-6 items-center">
        <h1 className="pl-2 ">Shipping Address</h1>
        <div className="flex items-center gap-1">
          <Input
            type="checkbox"
            className="w-4"
            onChange={(e) => {
              handleShippingCheck(e.target.checked);
            }}
            value={isShippingSame?1:0}
          />
          <h1 className="font-normal">Same as above</h1>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6 p-5">
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Address 1
          </h1>
          <Input
            // placeholder={shippingData?.address1}
            value={shippingAddress?.address_line_1 ?? ""}
            readOnly={isShippingSame ? true : false}
            onChange={(e) => {
              updateshippingAddress("address_line_1", e.target.value);
            }}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Address 2
          </h1>
          <Input
            // placeholder={shippingData?.address2}
            value={shippingAddress?.address_line_2 ?? ""}
            readOnly={isShippingSame ? true : false}
            onChange={(e) => {
              updateshippingAddress("address_line_2", e.target.value);
            }}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Pincode/Zipcode
          </h1>
          <Input
            // placeholder={shippingData?.pincode}
            value={shippingAddress?.pincode ?? ""}
            readOnly={isShippingSame ? true : false}
            onChange={(e) => {
              handleShippingPincodeChange(e.target.value);
            }}
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            District
          </h1>
          <Input
            // placeholder={shippingData?.district}
            value={shippingAddress?.district ?? ""}
            readOnly={isShippingSame ? true : false}
            onChange={()=>{}}
          />
        </div>
        <div className="grid grid-cols-3 col-span-4 gap-4">
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              City
            </h1>
            <Input
              // placeholder={shippingData?.city}
              value={shippingAddress?.city ?? ""}
              readOnly={isShippingSame ? true : false}
              onChange={()=>{}}
            />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              State
            </h1>
            <Input
              // placeholder={shippingData?.state}
              value={shippingAddress?.state ?? ""}
              readOnly={isShippingSame ? true : false}
              onChange={()=>{}}
            />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Country
            </h1>
            <Input
              // placeholder={shippingData?.country}
              value={shippingAddress?.country ?? ""}
              readOnly={isShippingSame ? true : false}
              onChange={()=>{}}
            />
          </div>
        </div>
      </div>
      <div className="pl-4 flex gap-4 items-center">
        <Input
          type="checkbox"
          className="w-4"
          onChange={(e) => {
            setIsMultipleLocation(e.target.checked);
          }}
        />
        <h1>Do you have multiple locations?</h1>
      </div>
      {isMultipleLocation && (
        <>
          <div className="grid grid-cols-4 gap-6 p-5">
            <div className="col-span-2">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Address 1
              </h1>
              <Input
                onChange={(e) => {
                  setMultipleAddress((prev) => ({
                    ...prev,
                    address1: e.target.value,
                  }));
                }}
                value={MultipleAddress?.address1 || ""}
              />
            </div>
            <div className="col-span-2">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Address 2
              </h1>
              <Input
                onChange={(e) => {
                  setMultipleAddress((prev) => ({
                    ...prev,
                    address2: e.target.value,
                  }));
                }}
                value={MultipleAddress?.address2 || ""}
              />
            </div>
            <div className="col-span-2">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Pincode/Zipcode
              </h1>
              <Input
                onChange={(e) => {
                  handleMultiplePincodeChange(e.target.value);
                }}
                value={MultipleAddress?.pincode ? MultipleAddress?.pincode : ""}
              />
            </div>
            <div className="col-span-2">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                District
              </h1>
              <Input
                value={MultipleAddress?.district?.district_name || ""}
                readOnly
              />
            </div>
            <div className="grid grid-cols-3 col-span-4 gap-4">
              <div>
                <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                  City
                </h1>
                <Input
                  value={MultipleAddress?.city?.city_name || ""}
                  readOnly
                />
              </div>
              <div>
                <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                  State
                </h1>
                <Input
                  value={MultipleAddress?.state?.state_name || ""}
                  readOnly
                />
              </div>
              <div>
                <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                  Country
                </h1>
                <Input
                  value={MultipleAddress?.country?.country_name || ""}
                  readOnly
                />
              </div>
              <div>
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
                  <TableHead className="w-[100px]">Sr No.</TableHead>
                  <TableHead>Address1</TableHead>
                  <TableHead>Address2</TableHead>
                  <TableHead className="text-center">Pincode</TableHead>
                  <TableHead className="text-center">District</TableHead>
                  <TableHead className="text-center">City</TableHead>
                  <TableHead className="text-center">State</TableHead>
                  <TableHead className="text-center">Country</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-center">
                {multiple_location_table?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index}</TableCell>
                    <TableCell>{item?.address_line_1}</TableCell>
                    <TableCell>{item?.address_line_2}</TableCell>
                    <TableCell>{item?.ma_pincode}</TableCell>
                    <TableCell>
                      <div>{item?.ma_district}</div>
                    </TableCell>
                    <TableCell>{item?.ma_city}</TableCell>
                    <TableCell>{item?.ma_state}</TableCell>
                    <TableCell>{item?.ma_country}</TableCell>
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
        <Input type="file" className="w-fit" />
      </div>
      <div className="flex justify-end gap-4">
        <Button
        className="bg-blue-400 hover:bg-blue-400"
          onClick={() => {
            handleSubmit();
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CompanyAddress;
