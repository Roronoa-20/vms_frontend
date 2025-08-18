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
import { CropIcon, Cross, CrossIcon, X } from "lucide-react";

interface Props {
  companyAddressDropdown?: TCompanyAddressDropdown["message"]["data"];
  ref_no: string;
  onboarding_ref_no: string;
  OnboardingDetail: VendorOnboardingResponse["message"]["company_address_tab"];
}

interface pincodeFetchData {
  district?: { name: string; district_name: string; district_code: string };
  city?: { name: string; city_name: string; city_code: string };
  state?: { name: string; state_name: string; state_code: string };
  country?: { name: string; country_name: string; country_code: string };
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
  ref_no,
  onboarding_ref_no,
  OnboardingDetail
}: Props) => {

  const router = useRouter();

  const {
    billingAddress,
    shippingAddress,
    multiple_location_table,
    updatebillingAddress,
    updateshippingAddress,
    updateLocationAtIndex,
    addMultipleLocation,
    resetMultiple
  } = useCompanyAddressFormStore();
  const [pincodeFetchData, setPincodeData] = useState<pincodeFetchData>();
  const [isShippingSame, setIsShippingSame] = useState<boolean>(OnboardingDetail?.same_as_above == 1 ? true : false);
  const [shippingData, setShippingData] = useState<shippingData>();
  const [MultipleAddress, setMultipleAddress] = useState<multipleAddress>();
  const [file, setFile] = useState<FileList | null>(null);
  const [isFilePreview, setIsFilePreview] = useState<boolean>(true);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const [isMultipleLocation, setIsMultipleLocation] = useState<boolean>(OnboardingDetail?.multiple_locations ? true : false);
  useEffect(() => {
    resetMultiple();
    OnboardingDetail?.multiple_location_table?.map((item) => {
      addMultipleLocation({
        address_line_1: item?.address_line_1,
        address_line_2: item?.address_line_2,
        ma_pincode: item?.ma_pincode,
        ma_district: { name: item?.district_details?.name as string, district_name: item?.district_details?.district_name as string, district_code: item?.district_details?.district_code as string },
        ma_state: { name: item?.state_details?.name as string, state_name: item?.state_details?.state_name as string, state_code: item?.state_details?.state_code as string },
        ma_city: {
          name: item?.city_details?.name,
          city_name: item?.city_details?.city_name as string,
          city_code: item?.city_details?.city_code as string
        },
        ma_country: { name: item?.country_details?.name as string, country_code: item?.country_details?.country_code as string, country_name: item?.country_details?.country_name as string }
      })
    })
  }, [])



  console.log(OnboardingDetail, "htis is onboarding data")



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
      console.log(data, "this is billing api data")
      if (data) {
        updatebillingAddress("city", data?.data?.city[0]);
        updatebillingAddress("district", data?.data?.district[0]);
        updatebillingAddress("state", data?.data?.state[0]);
        updatebillingAddress("country", data?.data?.country[0]);
      }
      console.log("aftre api data set", billingAddress)
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
        updateshippingAddress("city", data?.data?.city[0]);
        updateshippingAddress("district", data?.data?.district[0]);
        updateshippingAddress("state", data?.data?.state[0]);
        updateshippingAddress("country", data?.data?.country[0]);
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
      ma_pincode: MultipleAddress?.pincode ?? "",
      ma_district: MultipleAddress?.district,
      ma_state: MultipleAddress?.state,
      ma_city: MultipleAddress?.city,
      ma_country: MultipleAddress?.country,
    };
    addMultipleLocation(updatedData);
    setMultipleAddress({});
  };

  const handleShippingCheck = (e: boolean) => {
    console.log(e, "this is check")
    setIsShippingSame(e);
    // setShippingData((prev)=>({...prev,address1:billingAddress?.address_line_1,address2:billingAddress?.address_line_2}))
    if (e) {
      // handleShippingPincodeChange(billingAddress?.pincode ?? "");
      setShippingData((prev) => ({
        ...prev,
        address_line_1: billingAddress?.address_line_1,
        address_line_2: billingAddress?.address_line_2,
        pincode: billingAddress?.pincode,
        district: billingAddress?.district?.district_name,
        city: billingAddress?.city?.city_name,
        state: billingAddress?.state?.state_name,
        country: billingAddress?.country?.country_name,
      }));
    }
  };
  console.log(isShippingSame, "is shipping same");

  const [errors, setErrors] = useState<any>({});
  const validate = () => {
    const errors: any = {};
    // if (!billingAddress?.address_line_1) {
    //   errors.address_line_1 = "Please Enter Address 1";
    // }
    // if (!billingAddress?.address_line_2) {
    //   errors.address_line_2 = "Please Enter Address Line 2 ";
    // }

    // if (!billingAddress?.pincode) {
    //   errors.pincode = "Please Enter Pincode ";

    // } 

    return errors;
  };
  const { designation } = useAuth();

  const handleSubmit = async () => {

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const submitUrl = API_END_POINTS?.companyAddressSubmit;
    const Data = {
      ref_no: ref_no,
      ...billingAddress,
      street_1: shippingAddress?.address_line_1,
      street_2: shippingAddress?.address_line_2,
      manufacturing_pincode: shippingAddress?.pincode,
      manufacturing_country: shippingAddress?.country?.name,
      manufacturing_state: shippingAddress?.state?.name,
      manufacturing_city: shippingAddress?.city?.name,
      manufacturing_district: shippingAddress?.district?.name,
      same_as_above: isShippingSame ? 1 : 0,
      vendor_onboarding: onboarding_ref_no,
      multiple_locations: isMultipleLocation ? 1 : 0,
      multiple_location_table: multiple_location_table?.map((item) => ({
        address_line_1: item?.address_line_1,
        address_line_2: item?.address_line_2,
        ma_pincode: item?.ma_pincode,
        ma_district: item?.ma_district?.name,
        ma_state: item?.ma_state?.name,
        ma_city: item?.ma_city?.name,
        ma_country: item?.ma_country?.name,
      })),
    };
    // const updatedData = {data:Data}

    const formData = new FormData();
    formData.append("data", JSON.stringify(Data));
    if (file) {
      formData.append("file", file[0])
    }
    const submitResponse: AxiosResponse = await requestWrapper({ url: submitUrl, method: "POST", data: formData });
    if (submitResponse?.status == 200) router.push(`${designation == "Purchase Team" || designation == "Purchase Head" ? `/view-onboarding-details?tabtype=Contact%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}` : `/view-onboarding-details?tabtype=Document%20Detail&vendor_onboarding=${onboarding_ref_no}&refno=${ref_no}`}`);
  };





  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <div className="flex justify-between">
        <h1 className="border-b-2 font-semibold text-[18px]">Company</h1>
        <Button onClick={() => { setIsDisabled(prev => !prev) }} className="mb-2">{isDisabled ? "Enable Edit" : "Disable Edit"}</Button>
      </div>
      <h1 className="pl-2">Office Address</h1>
      <div className="grid grid-cols-4 gap-6 p-2">
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Address 1 <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <Input
            disabled={isDisabled}
            className="disabled:opacity-100"
            placeholder=""
            onChange={(e) => {
              updatebillingAddress("address_line_1", e.target.value);
            }}
            value={billingAddress?.address_line_1 as string ?? OnboardingDetail?.billing_address?.address_line_1 ?? ""}
          />
          {errors?.address_line_1 && !billingAddress?.address_line_1 && <span style={{ color: 'red' }}>{errors?.address_line_1}</span>}
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Address 2 <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <Input
            className="disabled:opacity-100"
            disabled={isDisabled}
            placeholder=""
            onChange={(e) => {
              updatebillingAddress("address_line_2", e.target.value);
            }}
            value={billingAddress?.address_line_2 ?? OnboardingDetail?.billing_address?.address_line_2 ?? ""}
          // defaultValue={}
          />
          {errors?.address_line_2 && !billingAddress?.address_line_2 && <span style={{ color: 'red' }}>{errors?.address_line_2}</span>}
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Pincode/Zipcode <span className="pl-2 text-red-400 text-2xl">*</span>
          </h1>
          <Input
            disabled={isDisabled}
            className="disabled:opacity-100"
            placeholder=""
            onChange={(e) => {
              handlePincodeChange(e.target.value);
            }}
            value={billingAddress?.pincode ?? OnboardingDetail?.billing_address?.pincode ?? ""}
          // defaultValue={}
          />
          {errors?.pincode && !billingAddress?.pincode && <span style={{ color: 'red' }}>{errors?.pincode}</span>}
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-7">
            District
          </h1>
          <Input
            disabled={isDisabled}
            className="disabled:opacity-100"
            placeholder=""
            value={billingAddress?.district?.district_name ?? OnboardingDetail?.billing_address?.district_details?.district_name ?? ""}
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
              className="disabled:opacity-100"
              disabled={isDisabled}
              placeholder=""
              value={billingAddress?.city?.city_name ?? OnboardingDetail?.billing_address?.city_details?.city_name ?? ""}
              // defaultValue={}
              readOnly
            />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              State
            </h1>
            <Input
              className="disabled:opacity-100"
              disabled={isDisabled}
              placeholder=""
              value={billingAddress?.state?.state_name ?? OnboardingDetail?.billing_address?.state_details?.state_name ?? ""}
              // defaultValue={}
              readOnly
            />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Country
            </h1>
            <Input
              disabled={isDisabled}
              className="disabled:opacity-100"
              placeholder=""
              value={billingAddress?.country?.country_name ?? OnboardingDetail?.billing_address?.country_details?.country_name ?? ""}

              readOnly
            />
          </div>
        </div>
      </div>
      <div className="flex justify-start gap-6 items-center">
        <h1 className="pl-2 ">Manufacturing Address</h1>
        <div className="flex items-center gap-1">
          <Input
            type="checkbox"
            disabled={isDisabled}
            className="w-4 disabled:opacity-100"
            onChange={(e) => {
              handleShippingCheck(e.target.checked);
            }}
            value={isShippingSame ? 1 : 0}

            checked={isShippingSame ?? OnboardingDetail?.same_as_above}
          />
          <h1 className="font-normal">Same as above</h1>
        </div>
      </div>
      <div className={`grid grid-cols-4 gap-6 p-5 ${isShippingSame ? "hidden" : ""}`}>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Address 1
          </h1>
          <Input
            // placeholder={shippingData?.address1}
            value={shippingAddress?.address_line_1 ?? OnboardingDetail?.shipping_address?.street_1 ?? ""}
            disabled={isShippingSame ? true : false}
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
            value={shippingAddress?.address_line_2 ?? OnboardingDetail?.shipping_address?.street_2 ?? ""}
            disabled={isShippingSame ? true : false}
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
            value={shippingAddress?.pincode ?? OnboardingDetail?.shipping_address?.manufacturing_pincode ?? ""}
            disabled={isShippingSame ? true : false}
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
            value={shippingAddress?.district?.district_name ?? ""}
            disabled={isShippingSame ? true : false}
            onChange={() => { }}
          />
        </div>
        <div className="grid grid-cols-3 col-span-4 gap-4">
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              City
            </h1>
            <Input
              // placeholder={shippingData?.city}
              value={shippingAddress?.city?.city_name ?? ""}
              disabled={isShippingSame ? true : false}
              onChange={() => { }}
            />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              State
            </h1>
            <Input
              // placeholder={shippingData?.state}
              value={shippingAddress?.state?.state_name ?? ""}
              disabled={isShippingSame ? true : false}
              onChange={() => { }}
            />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Country
            </h1>
            <Input
              // placeholder={shippingData?.country}
              value={shippingAddress?.country?.country_name ?? ""}
              disabled={isShippingSame ? true : false}
              onChange={() => { }}
            />
          </div>
        </div>
      </div>
      <div className="pl-4 flex gap-4 items-center">
        <Input
          disabled={isDisabled}
          type="checkbox"
          className="w-4 disabled:opacity-100"
          onChange={(e) => {
            setIsMultipleLocation(e.target.checked);
          }}
          checked={isMultipleLocation ?? OnboardingDetail?.multiple_locations == 1}
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
                disabled={isDisabled}
                onChange={(e) => {
                  setMultipleAddress((prev) => ({
                    ...prev,
                    address1: e.target.value,
                  }));
                }}
                className="disabled:opacity-100"
                value={MultipleAddress?.address1 ?? ""}
              />
            </div>
            <div className="col-span-2">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Address 2
              </h1>
              <Input
                className="disabled:opacity-100"
                onChange={(e) => {
                  setMultipleAddress((prev) => ({
                    ...prev,
                    address2: e.target.value,
                  }));
                }}
                disabled={isDisabled}
                value={MultipleAddress?.address2 ?? ""}
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
                disabled={isDisabled}
                value={MultipleAddress?.pincode ? MultipleAddress?.pincode : ""}
              />
            </div>
            <div className="col-span-2">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                District
              </h1>
              <Input
                disabled={isDisabled}
                className="disabled:opacity-100"
                value={MultipleAddress?.district?.district_name ?? ""}
                readOnly
              />
            </div>
            <div className="grid grid-cols-3 col-span-4 gap-4">
              <div>
                <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                  City
                </h1>
                <Input
                  className="disabled:opacity-100"
                  disabled={isDisabled}
                  value={MultipleAddress?.city?.city_name ?? ""}
                  readOnly
                />
              </div>
              <div>
                <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                  State
                </h1>
                <Input
                  disabled={isDisabled}
                  value={MultipleAddress?.state?.state_name ?? ""}
                  readOnly
                  className="disabled:opacity-100"
                />
              </div>
              <div>
                <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                  Country
                </h1>
                <Input
                  className="disabled:opacity-100"
                  disabled={isDisabled}
                  value={MultipleAddress?.country?.country_name ?? ""}
                  readOnly
                />
              </div>
              <div className={``}>
                <Button
                  disabled={isDisabled}
                  className="bg-blue-400 hover:bg-blue-400 rounded-3xl disabled:opacity-100"
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
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{item?.address_line_1}</TableCell>
                    <TableCell>{item?.address_line_2}</TableCell>
                    <TableCell>{item?.ma_pincode}</TableCell>
                    <TableCell>
                      <div>{item?.ma_district?.district_name}</div>
                    </TableCell>
                    <TableCell>{item?.ma_city?.city_name}</TableCell>
                    <TableCell>{item?.ma_state?.state_name}</TableCell>
                    <TableCell>{item?.ma_country?.country_name}</TableCell>
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
        <Input disabled={isDisabled} type="file" className="w-fit disabled:opacity-100" onChange={(e) => { setFile(e.target.files) }} />
        {/* file preview */}
        {
          isFilePreview && !file && OnboardingDetail?.address_proofattachment?.url &&
          <div className="flex gap-2">
            <Link target="blank" href={OnboardingDetail?.address_proofattachment?.url} className="underline text-blue-300 max-w-44 truncate">
              <span>{OnboardingDetail?.address_proofattachment?.file_name}</span>
            </Link>
            <X className={`cursor-pointer disabled:opacity-100 ${isDisabled ? "hidden" : ""}`} onClick={() => { setIsFilePreview((prev) => !prev) }} />
          </div>
        }
      </div>
      <div className={`flex justify-end gap-4`}>
        <Button
          // disabled={isDisabled}
          className={`bg-blue-400 hover:bg-blue-400 disabled:opacity-100 ${isDisabled ? "hidden" : ""}`}
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
